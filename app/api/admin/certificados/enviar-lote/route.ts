import { NextResponse, type NextRequest } from "next/server";
import { getAdminFromRequest } from "@/lib/auth/admin";
import { enviarCertificado } from "@/lib/cert/enviar-certificado";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Tope por petición. El cliente trocea la selección para no superarlo.
const MAX_IDS = 50;

// Resend limita la tasa de envío; 600 ms entre correos deja margen suficiente.
const PAUSA_ENTRE_ENVIOS_MS = 600;

function esperar(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

type Fallido = { id: string; nombre: string; error: string };

export async function POST(request: NextRequest) {
  const admin = await getAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const ids: unknown = body?.ids;
  const reenviar = body?.reenviar === true;

  if (!Array.isArray(ids) || ids.some((id) => typeof id !== "string")) {
    return NextResponse.json(
      { error: "El campo 'ids' debe ser un arreglo de strings" },
      { status: 400 },
    );
  }
  if (ids.length === 0) {
    return NextResponse.json({ error: "No se recibió ningún id" }, { status: 400 });
  }
  if (ids.length > MAX_IDS) {
    return NextResponse.json(
      { error: `Máximo ${MAX_IDS} certificados por petición (llegaron ${ids.length})` },
      { status: 400 },
    );
  }

  let enviados = 0;
  let omitidos = 0;
  const fallidos: Fallido[] = [];
  // Corte por cuota agotada: se deja constancia de lo que no se llegó a
  // intentar para que el cliente pueda reintentarlo sin recomponer la lista.
  let interrumpido = false;
  let idsPendientes: string[] = [];

  // Estrictamente secuencial: cada correo espera al anterior. La pausa solo se
  // paga cuando el anterior llegó a intentar un envío; los omitidos no tocan
  // Resend, así que un lote entero de omitidos se resuelve al instante.
  let anteriorIntentoEnvio = false;

  const lista = ids as string[];

  for (const [indice, id] of lista.entries()) {
    if (anteriorIntentoEnvio) {
      await esperar(PAUSA_ENTRE_ENVIOS_MS);
    }

    const resultado = await enviarCertificado(id, { reenviar });
    anteriorIntentoEnvio = resultado.estado !== "OMITIDO";

    if (resultado.estado === "ENVIADO") {
      enviados += 1;
    } else if (resultado.estado === "OMITIDO") {
      omitidos += 1;
    } else {
      fallidos.push({ id, nombre: resultado.nombre, error: resultado.error });

      // Cuota agotada: seguir sería gastar peticiones que fallarán igual. Se
      // corta aquí. Este id ya quedó como fallido porque sí se intentó; los
      // pendientes son solo los posteriores.
      if (resultado.clase === "CUOTA") {
        interrumpido = true;
        idsPendientes = lista.slice(indice + 1);
        break;
      }
    }
  }

  // 200 incluso al cortar: no es un error de la petición, es su resultado.
  return NextResponse.json({
    enviados,
    omitidos,
    fallidos,
    interrumpido,
    idsPendientes,
  });
}
