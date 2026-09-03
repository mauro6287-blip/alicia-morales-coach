import { prisma } from "@/lib/prisma";
import { generarCertificadoPdf } from "@/lib/cert/pdf-generator";
import { enviarCertificadoPorEmail } from "@/lib/email";

export type MotivoOmision = "NO_EXISTE" | "ANULADO" | "YA_ENVIADO";

export type ResultadoEnvioCertificado =
  | { estado: "ENVIADO"; nombre: string; emailEnviadoEn: Date }
  | { estado: "OMITIDO"; nombre: string | null; motivo: MotivoOmision }
  | { estado: "FALLIDO"; nombre: string; error: string };

/**
 * Genera el PDF de un certificado y lo envía por correo al alumno, marcando
 * `emailEnviadoEn`. Es la única implementación del envío: la usan tanto la ruta
 * individual (`[id]/email`) como la de lote (`enviar-lote`).
 *
 * Nunca lanza: los tres desenlaces posibles vuelven como resultado. El troceo,
 * la espera entre envíos y la autenticación son responsabilidad de quien llama.
 *
 * `reenviar: false` omite los certificados que ya tienen `emailEnviadoEn`.
 */
export async function enviarCertificado(
  certificadoId: string,
  opciones: { reenviar: boolean },
): Promise<ResultadoEnvioCertificado> {
  const certificado = await prisma.certificado.findUnique({
    where: { id: certificadoId },
  });

  if (!certificado) {
    return { estado: "OMITIDO", nombre: null, motivo: "NO_EXISTE" };
  }
  if (certificado.estado === "ANULADO") {
    return {
      estado: "OMITIDO",
      nombre: certificado.alumnoNombre,
      motivo: "ANULADO",
    };
  }
  if (certificado.emailEnviadoEn && !opciones.reenviar) {
    return {
      estado: "OMITIDO",
      nombre: certificado.alumnoNombre,
      motivo: "YA_ENVIADO",
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://aliciamoralescoach.com";
  const verificarUrl = `${siteUrl}/verificar/${certificado.codigo}`;

  try {
    const pdfBuffer = await generarCertificadoPdf({
      nombre: certificado.alumnoNombre,
      rut: certificado.alumnoRut,
      cursoNombre: certificado.cursoNombre,
      horasCurso: certificado.horasCurso,
      fechaEmision: certificado.fechaEmision,
      fechaAprobacion: certificado.fechaAprobacion,
      parrafoCierre: certificado.parrafoCierre,
      codigo: certificado.codigo,
      verificarUrl,
    });

    const envio = await enviarCertificadoPorEmail({
      alumnoEmail: certificado.alumnoEmail,
      alumnoNombre: certificado.alumnoNombre,
      cursoNombre: certificado.cursoNombre,
      codigo: certificado.codigo,
      verificarUrl,
      pdfBuffer,
    });

    if (!envio.ok) {
      return {
        estado: "FALLIDO",
        nombre: certificado.alumnoNombre,
        error: envio.error || "No se pudo enviar el email",
      };
    }

    const actualizado = await prisma.certificado.update({
      where: { id: certificado.id },
      data: { emailEnviadoEn: new Date() },
    });

    return {
      estado: "ENVIADO",
      nombre: certificado.alumnoNombre,
      // `emailEnviadoEn` acaba de escribirse, nunca es null aquí.
      emailEnviadoEn: actualizado.emailEnviadoEn as Date,
    };
  } catch (e) {
    // Una excepción al generar el PDF (datos corruptos, fuente ausente) no debe
    // cortar un lote: se reporta como fallo de este certificado y nada más.
    return {
      estado: "FALLIDO",
      nombre: certificado.alumnoNombre,
      error: e instanceof Error ? e.message : String(e),
    };
  }
}
