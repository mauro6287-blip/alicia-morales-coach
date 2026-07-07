import { NextResponse, type NextRequest } from "next/server";
import { getAdminFromRequest } from "@/lib/auth/admin";
import { parsearExcel } from "@/lib/cert/excel-parser";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const admin = await getAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const formData = await request.formData();
  const archivo = formData.get("archivo");
  if (!(archivo instanceof Blob)) {
    return NextResponse.json({ error: "Falta el archivo" }, { status: 400 });
  }

  const buffer = Buffer.from(await archivo.arrayBuffer());
  const { nombresColumnas, filas, totalFilas } = await parsearExcel(buffer);

  // Se devuelven todas las filas (no solo una muestra): el panel las necesita
  // completas para la previsualización de 20 registros (C6) y para la
  // emisión en lote (C7), sin tener que volver a subir el archivo.
  return NextResponse.json({
    nombresColumnas,
    filas,
    primerasCincoFilas: filas.slice(0, 5),
    totalFilas,
  });
}
