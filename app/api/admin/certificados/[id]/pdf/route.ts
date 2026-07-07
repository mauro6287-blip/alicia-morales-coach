import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminFromRequest } from "@/lib/auth/admin";
import { generarCertificadoPdf } from "@/lib/cert/pdf-generator";
import { toArrayBuffer } from "@/lib/to-array-buffer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
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
  const buffer = await generarCertificadoPdf({
    nombre: certificado.alumnoNombre,
    rut: certificado.alumnoRut,
    cursoNombre: certificado.cursoNombre,
    horasCurso: certificado.horasCurso,
    fechaEmision: certificado.fechaEmision,
    fechaAprobacion: certificado.fechaAprobacion,
    codigo: certificado.codigo,
    verificarUrl: `${siteUrl}/verificar/${certificado.codigo}`,
  });

  return new NextResponse(toArrayBuffer(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="certificado-${certificado.codigo}.pdf"`,
    },
  });
}
