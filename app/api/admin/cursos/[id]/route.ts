import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAdminFromRequest } from "@/lib/auth/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Ambos campos son opcionales: se puede editar solo el nombre, solo la frase
// de cierre, o ambos. No se implementa borrado porque un curso puede tener
// emisiones asociadas.
const schema = z.object({
  nombre: z.string().trim().min(3).max(200).optional(),
  parrafoCierre: z.string().trim().max(600).optional(),
});

export async function PATCH(
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
      {
        error:
          "El nombre debe tener entre 3 y 200 caracteres y la frase de cierre un máximo de 600.",
      },
      { status: 400 },
    );
  }
  const { nombre, parrafoCierre } = parsed.data;

  const curso = await prisma.curso.findUnique({ where: { id: params.id } });
  if (!curso) {
    return NextResponse.json({ error: "Curso no encontrado" }, { status: 404 });
  }

  if (nombre) {
    const yaExiste = await prisma.curso.findFirst({
      where: {
        nombre: { equals: nombre, mode: "insensitive" },
        id: { not: params.id },
      },
      select: { id: true },
    });
    if (yaExiste) {
      return NextResponse.json(
        { error: `Ya existe un curso llamado "${nombre}".` },
        { status: 409 },
      );
    }
  }

  const actualizado = await prisma.curso.update({
    where: { id: params.id },
    data: {
      ...(nombre ? { nombre } : {}),
      ...(parrafoCierre !== undefined ? { parrafoCierre: parrafoCierre || null } : {}),
    },
    select: { id: true, nombre: true, parrafoCierre: true },
  });

  return NextResponse.json(actualizado);
}
