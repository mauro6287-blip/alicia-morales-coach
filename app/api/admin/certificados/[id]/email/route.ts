import { NextResponse, type NextRequest } from "next/server";
import { getAdminFromRequest } from "@/lib/auth/admin";
import { enviarCertificado } from "@/lib/cert/enviar-certificado";

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

  // El botón por fila siempre reenvía: enviar de nuevo un certificado concreto
  // es una acción deliberada del admin.
  const resultado = await enviarCertificado(params.id, { reenviar: true });

  if (resultado.estado === "OMITIDO") {
    if (resultado.motivo === "NO_EXISTE") {
      return NextResponse.json({ error: "Certificado no encontrado" }, { status: 404 });
    }
    return NextResponse.json({ error: "Certificado anulado" }, { status: 410 });
  }

  if (resultado.estado === "FALLIDO") {
    return NextResponse.json({ error: resultado.error }, { status: 502 });
  }

  return NextResponse.json({ ok: true, emailEnviadoEn: resultado.emailEnviadoEn });
}
