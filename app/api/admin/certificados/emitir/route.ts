import { NextResponse, type NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getAdminFromRequest } from "@/lib/auth/admin";
import { normalizarFilas, type FilaExcel, type Mapeo } from "@/lib/cert/excel-parser";
import { formatearRut } from "@/lib/cert/rut";
import { generarCodigo } from "@/lib/cert/codes";
import { hashCertificado } from "@/lib/cert/hash";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type EmitirBody = {
  filas: FilaExcel[];
  mapeo: Mapeo;
  cursoId: string;
  plantillaId: string;
  nombreArchivo?: string;
};

export async function POST(request: NextRequest) {
  const admin = await getAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = (await request.json()) as EmitirBody;
  if (!Array.isArray(body.filas) || !body.mapeo || !body.cursoId || !body.plantillaId) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const curso = await prisma.curso.findUnique({ where: { id: body.cursoId } });
  if (!curso) {
    return NextResponse.json({ error: "Curso no encontrado" }, { status: 400 });
  }
  const plantilla = await prisma.plantillaCertificado.findUnique({
    where: { id: body.plantillaId },
  });
  if (!plantilla) {
    return NextResponse.json({ error: "Plantilla no encontrada" }, { status: 400 });
  }

  const normalizadas = normalizarFilas(body.filas, body.mapeo).filter(
    (f) => f.errores.length === 0,
  );

  const rutsFormateados = normalizadas.map((f) => formatearRut(f.rut));
  const existentes = await prisma.certificado.findMany({
    where: {
      alumnoRut: { in: rutsFormateados },
      emision: { cursoId: body.cursoId },
    },
    select: { alumnoRut: true },
  });
  const rutsYaEmitidos = new Set(existentes.map((e) => e.alumnoRut));

  const aEmitir = normalizadas.filter((f) => !rutsYaEmitidos.has(formatearRut(f.rut)));
  const duplicadosSaltados = normalizadas.length - aEmitir.length;

  try {
    const emisionId = await prisma.$transaction(async (tx) => {
      const emision = await tx.emision.create({
        data: {
          cursoId: body.cursoId,
          plantillaId: body.plantillaId,
          adminUserId: admin.id,
          cantidadTotal: aEmitir.length,
          nombreArchivo: body.nombreArchivo,
        },
      });

      const ahora = new Date();

      for (const fila of aEmitir) {
        const alumnoRut = formatearRut(fila.rut);
        let intentos = 0;
        // Colisión de código único: prácticamente imposible (33^12 combinaciones),
        // pero se reintenta hasta 3 veces por seguridad.
        while (true) {
          const codigo = generarCodigo();
          const hashIntegridad = hashCertificado({
            codigo,
            alumnoNombre: fila.nombre,
            alumnoRut,
            cursoNombre: curso.nombre,
            fechaAprobacion: fila.fechaAprobacion,
            horasCurso: fila.horas,
          });

          try {
            await tx.certificado.create({
              data: {
                codigo,
                emisionId: emision.id,
                plantillaId: body.plantillaId,
                alumnoNombre: fila.nombre,
                alumnoRut,
                alumnoEmail: fila.email,
                cursoNombre: curso.nombre,
                fechaEmision: ahora,
                fechaAprobacion: fila.fechaAprobacion,
                horasCurso: fila.horas,
                hashIntegridad,
                estado: "VALIDO",
              },
            });
            break;
          } catch (e) {
            intentos++;
            const esColision =
              e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002";
            if (!esColision || intentos >= 3) throw e;
          }
        }
      }

      return emision.id;
    });

    return NextResponse.json({
      emisionId,
      emitidos: aEmitir.length,
      duplicadosSaltados,
    });
  } catch (e) {
    const mensaje = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: `Error al emitir: ${mensaje}` }, { status: 500 });
  }
}
