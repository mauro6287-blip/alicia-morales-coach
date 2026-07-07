import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAdminFromRequest } from "@/lib/auth/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  motivo: z.string().trim().min(10),
});

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const admin = await getAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "El motivo debe tener al menos 10 caracteres" },
      { status: 400 },
    );
  }

  const certificado = await prisma.certificado.findUnique({ where: { id: params.id } });
  if (!certificado) {
    return NextResponse.json({ error: "Certificado no encontrado" }, { status: 404 });
  }
  if (certificado.estado === "ANULADO") {
    return NextResponse.json({ error: "Ya está anulado" }, { status: 409 });
  }

  const actualizado = await prisma.certificado.update({
    where: { id: params.id },
    data: {
      estado: "ANULADO",
      anuladoEn: new Date(),
      anuladoPorId: admin.id,
      motivoAnulacion: parsed.data.motivo,
    },
  });

  return NextResponse.json({ ok: true, estado: actualizado.estado });
}
