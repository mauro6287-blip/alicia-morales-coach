import { NextResponse, type NextRequest } from "next/server";
import { Readable } from "node:stream";
import { ZipArchive } from "archiver";
import { prisma } from "@/lib/prisma";
import { getAdminFromRequest } from "@/lib/auth/admin";
import { generarCertificadoPdf } from "@/lib/cert/pdf-generator";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { emisionId: string } },
) {
  const admin = await getAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const emision = await prisma.emision.findUnique({ where: { id: params.emisionId } });
  if (!emision) {
    return NextResponse.json({ error: "Emisión no encontrada" }, { status: 404 });
  }

  const certificados = await prisma.certificado.findMany({
    where: { emisionId: params.emisionId, estado: "VALIDO" },
  });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://aliciamoralescoach.com";
  const archive = new ZipArchive({ zlib: { level: 9 } });

  (async () => {
    try {
      for (const certificado of certificados) {
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
        archive.append(buffer, { name: `certificado-${certificado.codigo}.pdf` });
      }
      await archive.finalize();
    } catch (err) {
      archive.destroy(err instanceof Error ? err : new Error(String(err)));
    }
  })();

  const webStream = Readable.toWeb(archive) as ReadableStream;

  return new NextResponse(webStream, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="emision-${params.emisionId}.zip"`,
    },
  });
}
