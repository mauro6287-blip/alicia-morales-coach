import { NextResponse, type NextRequest } from "next/server";
import { getAdminFromRequest } from "@/lib/auth/admin";
import { normalizarFilas, type FilaExcel, type Mapeo } from "@/lib/cert/excel-parser";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const admin = await getAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = (await request.json()) as { filas: FilaExcel[]; mapeo: Mapeo };
  if (!Array.isArray(body.filas) || !body.mapeo) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const normalizadas = normalizarFilas(body.filas, body.mapeo);
  return NextResponse.json({ filas: normalizadas });
}
