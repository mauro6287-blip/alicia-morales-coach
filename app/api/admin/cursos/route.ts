import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAdminFromRequest } from "@/lib/auth/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  nombre: z.string().trim().min(3).max(200),
  parrafoCierre: z.string().trim().max(600).optional(),
});

export async function POST(request: NextRequest) {
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

  const yaExiste = await prisma.curso.findFirst({
    where: { nombre: { equals: nombre, mode: "insensitive" } },
    select: { id: true },
  });
  if (yaExiste) {
    return NextResponse.json(
      { error: `Ya existe un curso llamado "${nombre}".` },
      { status: 409 },
    );
  }

  // moodleCourseId queda en null: es un taller que no existe en Moodle.
  const curso = await prisma.curso.create({
    data: {
      nombre,
      parrafoCierre: parrafoCierre || null,
      moodleCourseId: null,
    },
    select: { id: true, nombre: true, parrafoCierre: true },
  });

  return NextResponse.json(curso);
}
