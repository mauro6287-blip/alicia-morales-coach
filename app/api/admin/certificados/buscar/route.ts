import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminFromRequest } from "@/lib/auth/admin";
import { ofuscarRut } from "@/lib/cert/rut";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const admin = await getAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = (await request.json()) as { query?: string };
  const query = (body.query || "").trim();
  if (!query) {
    return NextResponse.json({ resultados: [] });
  }

  const rutLimpio = query.replace(/[.-]/g, "");

  const resultados = await prisma.certificado.findMany({
    where: {
      OR: [
        { alumnoNombre: { contains: query, mode: "insensitive" } },
        { alumnoRut: { contains: rutLimpio } },
        { codigo: query.toUpperCase() },
      ],
    },
    take: 50,
    orderBy: { creadoEn: "desc" },
  });

  return NextResponse.json({
    resultados: resultados.map((c) => ({
      id: c.id,
      codigo: c.codigo,
      alumnoNombre: c.alumnoNombre,
      alumnoRut: ofuscarRut(c.alumnoRut),
      cursoNombre: c.cursoNombre,
      estado: c.estado,
      emisionId: c.emisionId,
    })),
  });
}
