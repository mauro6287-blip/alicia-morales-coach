import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getPreferenceClient } from "@/lib/mercadopago";
import { CheckoutSchema, cleanRut } from "@/lib/validators";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const parsed = CheckoutSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Datos inválidos",
        issues: parsed.error.issues.map((i) => ({
          path: i.path.join("."),
          message: i.message,
        })),
      },
      { status: 400 },
    );
  }

  const { buyerName, buyerEmail, buyerPhone, buyerRut, items } = parsed.data;

  const productIds = items.map((i) => i.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, active: true },
  });

  if (products.length !== productIds.length) {
    return NextResponse.json(
      { error: "Uno o más productos no están disponibles" },
      { status: 400 },
    );
  }

  const lineItems = items.map((cartItem) => {
    const product = products.find((p) => p.id === cartItem.productId);
    if (!product) throw new Error("Product not found mid-validation");
    return {
      product,
      quantity: cartItem.quantity,
    };
  });

  const totalClp = lineItems.reduce(
    (sum, li) => sum + li.product.priceClp * li.quantity,
    0,
  );

  const normalizedRut = cleanRut(buyerRut);

  try {
    const order = await prisma.order.create({
      data: {
        buyerName,
        buyerEmail,
        buyerPhone,
        buyerRut: normalizedRut,
        totalClp,
        status: "PENDING",
        items: {
          create: lineItems.map((li) => ({
            productId: li.product.id,
            quantity: li.quantity,
            unitPriceClp: li.product.priceClp,
            titleSnapshot: li.product.title,
          })),
        },
      },
    });

    const appUrl = process.env.APP_URL || req.nextUrl.origin;
    const preferenceClient = getPreferenceClient();

    const preference = await preferenceClient.create({
      body: {
        items: lineItems.map((li) => ({
          id: li.product.id,
          title: li.product.title,
          quantity: li.quantity,
          unit_price: li.product.priceClp,
          currency_id: "CLP",
          description: `Sesión de coaching · ${li.product.durationMin} min`,
          category_id: "services",
        })),
        payer: {
          name: buyerName,
          email: buyerEmail,
          phone: { area_code: "56", number: buyerPhone.replace(/\D/g, "") },
          identification: { type: "RUT", number: normalizedRut },
        },
        external_reference: order.id,
        back_urls: {
          success: `${appUrl}/checkout/success?order=${order.id}`,
          failure: `${appUrl}/checkout/failure?order=${order.id}`,
          pending: `${appUrl}/checkout/pending?order=${order.id}`,
        },
        auto_return: "approved",
        notification_url: `${appUrl}/api/checkout/webhook`,
        statement_descriptor: "ALICIA MORALES COACH",
        metadata: { order_id: order.id },
      },
    });

    if (!preference.id || !preference.init_point) {
      throw new Error("Mercado Pago no devolvió preference válida");
    }

    await prisma.order.update({
      where: { id: order.id },
      data: { mpPreferenceId: preference.id },
    });

    return NextResponse.json({
      orderId: order.id,
      init_point: preference.init_point,
    });
  } catch (err) {
    console.error("[create-preference] error:", err);
    return NextResponse.json(
      { error: "No pudimos crear la preferencia de pago. Intenta nuevamente." },
      { status: 500 },
    );
  }
}
