import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import type { OrderStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getPaymentClient } from "@/lib/mercadopago";
import {
  sendAdminNotificationEmail,
  sendBuyerConfirmationEmail,
} from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function verifySignature(
  signatureHeader: string | null,
  requestId: string | null,
  dataId: string,
  secret: string,
): boolean {
  if (!signatureHeader) return false;

  const parts = signatureHeader.split(",").reduce<Record<string, string>>(
    (acc, part) => {
      const [k, v] = part.split("=");
      if (k && v) acc[k.trim()] = v.trim();
      return acc;
    },
    {},
  );

  const ts = parts.ts;
  const v1 = parts.v1;
  if (!ts || !v1) return false;

  const manifest = `id:${dataId};request-id:${requestId ?? ""};ts:${ts};`;
  const hmac = crypto
    .createHmac("sha256", secret)
    .update(manifest)
    .digest("hex");

  try {
    return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(v1));
  } catch {
    return false;
  }
}

function mapMpStatus(status: string | undefined): OrderStatus | null {
  switch (status) {
    case "approved":
      return "PAID";
    case "rejected":
    case "cancelled":
      return "REJECTED";
    case "pending":
    case "in_process":
    case "authorized":
      return "PENDING";
    case "refunded":
    case "charged_back":
      return "REFUNDED";
    default:
      return null;
  }
}

export async function POST(req: NextRequest) {
  const raw = await req.text();
  let body: { type?: string; action?: string; data?: { id?: string | number } };
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "bad json" }, { status: 400 });
  }

  const signature = req.headers.get("x-signature");
  const requestId = req.headers.get("x-request-id");
  const dataId = body.data?.id ? String(body.data.id) : "";

  const secret = process.env.MP_WEBHOOK_SECRET;
  if (secret) {
    const ok = verifySignature(signature, requestId, dataId, secret);
    if (!ok) {
      console.warn("[webhook] firma inválida");
      return NextResponse.json({ error: "invalid signature" }, { status: 401 });
    }
  } else {
    console.warn(
      "[webhook] MP_WEBHOOK_SECRET no configurado — saltando verificación (modo prueba)",
    );
  }

  const type = body.type || body.action?.split(".")[0];
  if (type !== "payment") {
    return NextResponse.json({ received: true });
  }

  if (!dataId) {
    return NextResponse.json({ error: "missing data.id" }, { status: 400 });
  }

  let payment;
  try {
    const client = getPaymentClient();
    payment = await client.get({ id: dataId });
  } catch (err) {
    console.error("[webhook] error consultando payment:", err);
    return NextResponse.json({ error: "mp api error" }, { status: 500 });
  }

  const orderId = payment.external_reference;
  if (!orderId) {
    console.error("[webhook] payment sin external_reference", payment.id);
    return NextResponse.json({ received: true });
  }

  const newStatus = mapMpStatus(payment.status);
  if (!newStatus) {
    console.log("[webhook] status no mapeable:", payment.status);
    return NextResponse.json({ received: true });
  }

  const existing = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: { include: { product: true } } },
  });
  if (!existing) {
    console.error("[webhook] orden no encontrada:", orderId);
    return NextResponse.json({ received: true });
  }

  if (
    existing.status === "PAID" &&
    existing.mpPaymentId === String(payment.id)
  ) {
    return NextResponse.json({ received: true, idempotent: true });
  }

  const wasAlreadyPaid = existing.status === "PAID";

  const updated = await prisma.order.update({
    where: { id: orderId },
    data: {
      status: newStatus,
      mpPaymentId: String(payment.id),
      mpStatus: payment.status ?? null,
      paidAt: newStatus === "PAID" ? new Date() : existing.paidAt,
    },
    include: { items: { include: { product: true } } },
  });

  if (newStatus === "PAID" && !wasAlreadyPaid) {
    const results = await Promise.allSettled([
      sendBuyerConfirmationEmail(updated),
      sendAdminNotificationEmail(updated),
    ]);
    results.forEach((r, i) => {
      if (r.status === "rejected") {
        console.error(
          `[webhook] email ${i === 0 ? "buyer" : "admin"} fallido:`,
          r.reason,
        );
      }
    });
  }

  return NextResponse.json({ received: true, orderId, status: newStatus });
}

export async function GET() {
  return NextResponse.json({ ok: true, endpoint: "mp-webhook" });
}
