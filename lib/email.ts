import { Resend } from "resend";
import { formatClp, formatRut } from "./formatters";

const resend = new Resend(process.env.RESEND_API_KEY);

type OrderEmailData = {
  id: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  buyerRut: string;
  totalClp: number;
  mpPaymentId: string | null;
  createdAt: Date;
  items: Array<{
    quantity: number;
    unitPriceClp: number;
    titleSnapshot: string;
    product: { durationMin: number };
  }>;
};

const BRAND = {
  gold: "#F7B52A",
  goldLight: "#FFDE59",
  dark: "#1A1A1A",
  text: "#333333",
  muted: "#666666",
};

function itemsTable(order: OrderEmailData) {
  return order.items
    .map(
      (it) => `
    <tr>
      <td style="padding:12px;border-bottom:1px solid #eee;">
        <strong>${it.titleSnapshot}</strong><br>
        <span style="color:${BRAND.muted};font-size:13px;">${it.product.durationMin} min · ${it.quantity} × ${formatClp(it.unitPriceClp)}</span>
      </td>
      <td style="padding:12px;border-bottom:1px solid #eee;text-align:right;white-space:nowrap;">
        <strong>${formatClp(it.unitPriceClp * it.quantity)}</strong>
      </td>
    </tr>`,
    )
    .join("");
}

export async function sendBuyerConfirmationEmail(order: OrderEmailData) {
  const html = `<!DOCTYPE html>
<html><body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;color:${BRAND.text};">
  <div style="max-width:600px;margin:0 auto;background:#ffffff;">
    <div style="background:${BRAND.dark};padding:32px 24px;text-align:center;">
      <h1 style="margin:0;color:${BRAND.goldLight};font-size:22px;font-weight:600;">Alicia Morales Coach</h1>
      <p style="margin:6px 0 0;color:#ffffff;opacity:0.7;font-size:13px;">Escuela de Competencias Aplicadas</p>
    </div>

    <div style="padding:32px 24px;">
      <h2 style="color:${BRAND.dark};margin:0 0 16px;font-size:20px;">¡Hemos recibido tu solicitud!</h2>
      <p style="margin:0 0 16px;line-height:1.6;">Hola <strong>${order.buyerName}</strong>,</p>
      <p style="margin:0 0 16px;line-height:1.6;">Hemos recibido tu pago correctamente. Se ha generado una solicitud de servicio con los siguientes detalles:</p>

      <table style="width:100%;border-collapse:collapse;margin:20px 0;">
        <thead>
          <tr>
            <th style="padding:10px 12px;text-align:left;background:#f9f9f9;border-bottom:2px solid ${BRAND.gold};font-size:13px;color:${BRAND.muted};">Sesión</th>
            <th style="padding:10px 12px;text-align:right;background:#f9f9f9;border-bottom:2px solid ${BRAND.gold};font-size:13px;color:${BRAND.muted};">Subtotal</th>
          </tr>
        </thead>
        <tbody>${itemsTable(order)}</tbody>
        <tfoot>
          <tr>
            <td style="padding:16px 12px;font-size:15px;"><strong>Total</strong></td>
            <td style="padding:16px 12px;text-align:right;font-size:18px;color:${BRAND.gold};"><strong>${formatClp(order.totalClp)} CLP</strong></td>
          </tr>
        </tfoot>
      </table>

      <p style="margin:0 0 8px;font-size:13px;color:${BRAND.muted};">Número de orden</p>
      <p style="margin:0 0 24px;font-family:'Courier New',monospace;font-size:14px;background:#f5f5f5;padding:10px;border-radius:4px;">${order.id}</p>

      <div style="background:#FFF9E6;border-left:4px solid ${BRAND.gold};padding:16px;margin:24px 0;">
        <p style="margin:0;line-height:1.6;"><strong>¿Qué sigue?</strong><br>Alicia se pondrá en contacto contigo dentro de las próximas <strong>24 horas</strong> para coordinar el agendamiento de tu(s) sesión(es).</p>
      </div>

      <p style="margin:24px 0 0;line-height:1.6;font-size:14px;color:${BRAND.muted};">Si tienes alguna consulta, respondé este email o escribí a <a href="mailto:coaching@aliciamorales.cl" style="color:${BRAND.gold};">coaching@aliciamorales.cl</a>.</p>
    </div>

    <div style="background:#f9f9f9;padding:20px;text-align:center;color:${BRAND.muted};font-size:12px;">
      Alicia Morales Coach · Escuela de Competencias Aplicadas<br>
      Santiago, Chile
    </div>
  </div>
</body></html>`;

  return resend.emails.send({
    from: "Alicia Morales Coach <onboarding@resend.dev>",
    to: order.buyerEmail,
    subject: "Hemos recibido tu solicitud de servicio — Alicia Morales Coach",
    html,
  });
}

export async function sendAdminNotificationEmail(order: OrderEmailData) {
  const adminEmail = process.env.ADMIN_EMAIL || "coaching@aliciamorales.cl";
  const html = `<!DOCTYPE html>
<html><body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;color:${BRAND.text};">
  <div style="max-width:640px;margin:0 auto;background:#ffffff;">
    <div style="background:${BRAND.gold};padding:20px 24px;">
      <h1 style="margin:0;color:${BRAND.dark};font-size:18px;">✓ Nueva compra confirmada</h1>
    </div>

    <div style="padding:24px;">
      <h3 style="margin:0 0 12px;color:${BRAND.dark};">Datos del comprador</h3>
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
        <tr><td style="padding:8px 0;width:130px;color:${BRAND.muted};">Nombre</td><td style="padding:8px 0;"><strong>${order.buyerName}</strong></td></tr>
        <tr><td style="padding:8px 0;color:${BRAND.muted};">Email</td><td style="padding:8px 0;"><a href="mailto:${order.buyerEmail}">${order.buyerEmail}</a></td></tr>
        <tr><td style="padding:8px 0;color:${BRAND.muted};">Teléfono</td><td style="padding:8px 0;"><a href="tel:${order.buyerPhone}">${order.buyerPhone}</a></td></tr>
        <tr><td style="padding:8px 0;color:${BRAND.muted};">RUT (boleta)</td><td style="padding:8px 0;background:#FFF9E6;font-family:'Courier New',monospace;"><strong>${formatRut(order.buyerRut)}</strong></td></tr>
      </table>

      <h3 style="margin:24px 0 12px;color:${BRAND.dark};">Productos</h3>
      <table style="width:100%;border-collapse:collapse;">
        <thead><tr><th style="padding:10px 12px;text-align:left;background:#f9f9f9;border-bottom:2px solid ${BRAND.gold};font-size:13px;">Sesión</th><th style="padding:10px 12px;text-align:right;background:#f9f9f9;border-bottom:2px solid ${BRAND.gold};font-size:13px;">Subtotal</th></tr></thead>
        <tbody>${itemsTable(order)}</tbody>
        <tfoot><tr><td style="padding:16px 12px;"><strong>Total</strong></td><td style="padding:16px 12px;text-align:right;color:${BRAND.gold};font-size:18px;"><strong>${formatClp(order.totalClp)} CLP</strong></td></tr></tfoot>
      </table>

      <h3 style="margin:24px 0 12px;color:${BRAND.dark};">Trazabilidad</h3>
      <table style="width:100%;border-collapse:collapse;font-size:13px;">
        <tr><td style="padding:6px 0;width:130px;color:${BRAND.muted};">Orden ID</td><td style="padding:6px 0;font-family:monospace;">${order.id}</td></tr>
        <tr><td style="padding:6px 0;color:${BRAND.muted};">MP Payment ID</td><td style="padding:6px 0;font-family:monospace;">${order.mpPaymentId ?? "—"}</td></tr>
        <tr><td style="padding:6px 0;color:${BRAND.muted};">Fecha</td><td style="padding:6px 0;">${order.createdAt.toLocaleString("es-CL", { timeZone: "America/Santiago" })}</td></tr>
      </table>

      <div style="background:#FFE6E6;border-left:4px solid #D32F2F;padding:14px;margin-top:24px;">
        <p style="margin:0;font-size:14px;"><strong>ACCIÓN REQUERIDA:</strong> contactar al comprador para agendar la(s) sesión(es) y emitir boleta/factura.</p>
      </div>
    </div>
  </div>
</body></html>`;

  return resend.emails.send({
    from: "Sistema Web <onboarding@resend.dev>",
    to: adminEmail,
    replyTo: order.buyerEmail,
    subject: `Nueva solicitud de servicio — ${order.buyerName}`,
    html,
  });
}
