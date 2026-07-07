import { NextResponse, type NextRequest } from "next/server";
import { getAdminFromRequest } from "@/lib/auth/admin";
import { generarCertificadoPdf } from "@/lib/cert/pdf-generator";
import { toArrayBuffer } from "@/lib/to-array-buffer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const admin = await getAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const buffer = await generarCertificadoPdf({
    nombre: "Juan Ejemplo Pérez",
    rut: "12345678-9",
    cursoNombre: "Liderazgo y Competencias Transversales",
    horasCurso: 16,
    fechaEmision: new Date(),
    fechaAprobacion: new Date(),
    codigo: "DEMO123456AB",
    verificarUrl: "https://aliciamoralescoach.com/verificar/DEMO123456AB",
  });

  return new NextResponse(toArrayBuffer(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline; filename=preview-certificado.pdf",
    },
  });
}
