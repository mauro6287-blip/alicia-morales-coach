import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { buscarOCrearUsuario, enrolarUsuario } from "@/lib/moodle";
import { enviarCorreoAccesoMoodle } from "@/lib/email";

// Runtime Node (lib/moodle usa crypto y es server-only).
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// El email de los alumnos NO se valida con .email() a nivel de lote: un email
// inválido debe producir ERROR aislado (no rechazar todo el lote). Moodle lo
// rechaza y se captura por alumno.
const schema = z.object({
  moodleCourseId: z.number().int().positive(),
  nombreCurso: z.string().min(1).optional(),
  empresa: z.object({
    nombreEmpresa: z.string().min(1),
    rut: z.string().optional(),
    contactoEmail: z.string().email(),
    contactoNombre: z.string().optional(),
  }),
  alumnos: z
    .array(
      z.object({
        nombre: z.string().min(1),
        apellido: z.string().min(1),
        email: z.string().min(1),
      }),
    )
    .min(1),
});

export async function POST(request: Request) {
  // --- Protección por secreto en header ---
  const secret = process.env.ADMIN_ENROL_SECRET;
  const provided = request.headers.get("x-admin-secret");
  if (!secret || !provided || provided !== secret) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  // --- Parseo + validación ---
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos inválidos", detalles: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const { moodleCourseId, nombreCurso, empresa, alumnos } = parsed.data;
  const roleid = Number.parseInt(process.env.MOODLE_DEFAULT_ROLE_ID || "5", 10);

  // --- Curso (idempotente por moodleCourseId) ---
  const curso = await prisma.curso.upsert({
    where: { moodleCourseId },
    update: nombreCurso ? { nombre: nombreCurso } : {},
    create: {
      moodleCourseId,
      nombre: nombreCurso || `Curso ${moodleCourseId}`,
      modalidad: "B2B",
    },
  });

  // --- ClienteB2B (sin clave única; idempotente por empresa+contacto) ---
  let cliente = await prisma.clienteB2B.findFirst({
    where: {
      nombreEmpresa: empresa.nombreEmpresa,
      contactoEmail: empresa.contactoEmail,
    },
  });
  if (!cliente) {
    cliente = await prisma.clienteB2B.create({
      data: {
        nombreEmpresa: empresa.nombreEmpresa,
        rut: empresa.rut,
        contactoEmail: empresa.contactoEmail,
        contactoNombre: empresa.contactoNombre,
      },
    });
  }

  // --- Procesar alumnos (idempotente, sin abortar el lote) ---
  let enrolados = 0;
  let correosPendientes = 0;
  const errores: Array<{ email: string; motivo: string }> = [];

  for (const alumno of alumnos) {
    const alumnoEmail = alumno.email.trim().toLowerCase();
    const alumnoNombre = `${alumno.nombre} ${alumno.apellido}`.trim();
    try {
      // 1. Crear/buscar en Moodle (idempotente) + 2. enrolar
      const mu = await buscarOCrearUsuario({
        email: alumno.email,
        nombre: alumno.nombre,
        apellido: alumno.apellido,
      });
      await enrolarUsuario({ userid: mu.id, courseid: moodleCourseId, roleid });

      // 3. Registrar ENROLADO en Postgres (upsert por [cursoId, alumnoEmail])
      const enrol = await prisma.enrolamiento.upsert({
        where: {
          cursoId_alumnoEmail: { cursoId: curso.id, alumnoEmail },
        },
        update: {
          estado: "ENROLADO",
          moodleUserId: mu.id,
          alumnoNombre,
          clienteB2BId: cliente.id,
        },
        create: {
          cursoId: curso.id,
          clienteB2BId: cliente.id,
          alumnoEmail,
          alumnoNombre,
          moodleUserId: mu.id,
          origen: "B2B",
          estado: "ENROLADO",
        },
      });
      enrolados++;

      // 4. Correo NO bloqueante: solo si aún no se envió
      if (!enrol.correoEnviadoEn) {
        const envio = await enviarCorreoAccesoMoodle({
          email: alumno.email,
          nombreAlumno: alumno.nombre,
          nombreCurso: curso.nombre,
        });
        if (envio.ok) {
          await prisma.enrolamiento.update({
            where: { id: enrol.id },
            data: { correoEnviadoEn: new Date() },
          });
        } else {
          // El alumno queda ENROLADO; el correo queda pendiente (null).
          correosPendientes++;
        }
      }
    } catch (e) {
      const motivo = e instanceof Error ? e.message : String(e);
      // Registrar ERROR aislado, sin abortar el resto del lote.
      try {
        await prisma.enrolamiento.upsert({
          where: { cursoId_alumnoEmail: { cursoId: curso.id, alumnoEmail } },
          update: { estado: "ERROR", alumnoNombre, clienteB2BId: cliente.id },
          create: {
            cursoId: curso.id,
            clienteB2BId: cliente.id,
            alumnoEmail,
            alumnoNombre,
            origen: "B2B",
            estado: "ERROR",
          },
        });
      } catch {
        // Si ni siquiera se pudo registrar, igual reportamos el error del alumno.
      }
      errores.push({ email: alumno.email, motivo });
    }
  }

  return NextResponse.json({ enrolados, errores, correosPendientes });
}
