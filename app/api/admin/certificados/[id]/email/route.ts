import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminFromRequest } from "@/lib/auth/admin";
import { generarCertificadoPdf } from "@/lib/cert/pdf-generator";
import { enviarCertificadoPorEmail } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const admin = await getAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const certificado = await prisma.certificado.findUnique({ where: { id: params.id } });
  if (!certificado) {
    return NextResponse.json({ error: "Certificado no encontrado" }, { status: 404 });
  }
  if (certificado.estado === "ANULADO") {
    return NextResponse.json({ error: "Certificado anulado" }, { status: 410 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://aliciamoralescoach.com";
  const verificarUrl = `${siteUrl}/verificar/${certificado.codigo}`;

  const pdfBuffer = await generarCertificadoPdf({
    nombre: certificado.alumnoNombre,
    rut: certificado.alumnoRut,
    cursoNombre: certificado.cursoNombre,
    horasCurso: certificado.horasCurso,
    fechaEmision: certificado.fechaEmision,
    fechaAprobacion: certificado.fechaAprobacion,
    codigo: certificado.codigo,
    verificarUrl,
  });

  const envio = await enviarCertificadoPorEmail({
    alumnoEmail: certificado.alumnoEmail,
    alumnoNombre: certificado.alumnoNombre,
    cursoNombre: certificado.cursoNombre,
    codigo: certificado.codigo,
    verificarUrl,
    pdfBuffer,
  });

  if (!envio.ok) {
    return NextResponse.json({ error: envio.error || "No se pudo enviar el email" }, { status: 502 });
  }

  const actualizado = await prisma.certificado.update({
    where: { id: certificado.id },
    data: { emailEnviadoEn: new Date() },
  });

  return NextResponse.json({ ok: true, emailEnviadoEn: actualizado.emailEnviadoEn });
}
