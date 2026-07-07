import { headers } from "next/headers";
import { validarFormatoCodigo } from "@/lib/cert/codes";
import { buscarCertificado, registrarVerificacion } from "@/lib/cert/verificar";
import { ofuscarRut } from "@/lib/cert/rut";

function formatFecha(fecha: Date): string {
  const dd = String(fecha.getUTCDate()).padStart(2, "0");
  const mm = String(fecha.getUTCMonth() + 1).padStart(2, "0");
  const yyyy = fecha.getUTCFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

function AvisoTratamiento() {
  return (
    <p className="mx-auto mt-10 max-w-lg text-center font-sans text-xs leading-relaxed text-muted">
      Esta página trata datos personales para verificar la autenticidad del certificado. Se
      registra la fecha, IP y navegador de cada consulta para fines de auditoría. Base legal:
      obligación legal derivada de la Ley 19.628 y Ley 19.799 y del interés legítimo de proteger
      la integridad de los certificados emitidos.
    </p>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center bg-background px-4 py-12">
      <p className="mb-8 font-display text-xl font-bold text-primary">AMC</p>
      <div className="w-full max-w-md rounded-lg border border-border bg-surface p-8 text-center shadow-xl">
        {children}
      </div>
      <AvisoTratamiento />
    </div>
  );
}

export default async function VerificarPage({
  params,
}: {
  params: { codigo: string };
}) {
  const codigo = params.codigo.toUpperCase();

  if (!validarFormatoCodigo(codigo)) {
    return (
      <Layout>
        <p className="mb-2 text-3xl text-muted">✕</p>
        <h1 className="font-display text-xl font-semibold text-foreground">Código inválido</h1>
      </Layout>
    );
  }

  const certificado = await buscarCertificado(codigo);

  if (!certificado) {
    return (
      <Layout>
        <p className="mb-2 text-3xl text-muted">✕</p>
        <h1 className="mb-3 font-display text-2xl font-semibold text-foreground">
          Certificado no encontrado
        </h1>
        <p className="font-sans text-sm text-muted">
          El código {codigo} no corresponde a ningún certificado emitido por Escuela de
          Competencias Aplicadas — Alicia Morales Coach SPA.
        </p>
      </Layout>
    );
  }

  const headersList = headers();
  const ip = headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
  const userAgent = headersList.get("user-agent");
  await registrarVerificacion(certificado.id, ip, userAgent);

  if (certificado.estado === "ANULADO") {
    return (
      <Layout>
        <p className="mb-2 text-3xl text-red-500">⚠</p>
        <h1 className="mb-3 font-display text-2xl font-semibold text-red-500">
          Certificado anulado
        </h1>
        <p className="font-sans text-sm text-muted">
          Este certificado (código {certificado.codigo}) fue anulado
          {certificado.anuladoEn ? ` el ${formatFecha(certificado.anuladoEn)}` : ""}.
          {certificado.motivoAnulacion ? ` Motivo: ${certificado.motivoAnulacion}.` : ""}
        </p>
      </Layout>
    );
  }

  return (
    <Layout>
      <p className="mb-2 text-3xl text-primary">✓</p>
      <h1 className="mb-6 font-display text-2xl font-semibold text-primary">
        Certificado válido
      </h1>
      <dl className="grid grid-cols-2 gap-y-2 text-left font-sans text-sm">
        <dt className="text-muted">Alumno</dt>
        <dd className="text-foreground">{certificado.alumnoNombre}</dd>

        <dt className="text-muted">RUT</dt>
        <dd className="text-foreground">{ofuscarRut(certificado.alumnoRut)}</dd>

        <dt className="text-muted">Curso</dt>
        <dd className="text-foreground">{certificado.cursoNombre}</dd>

        <dt className="text-muted">Fecha de aprobación</dt>
        <dd className="text-foreground">{formatFecha(certificado.fechaAprobacion)}</dd>

        <dt className="text-muted">Horas</dt>
        <dd className="text-foreground">{certificado.horasCurso}</dd>

        <dt className="text-muted">Código</dt>
        <dd className="font-mono text-foreground">{certificado.codigo}</dd>

        <dt className="text-muted">Emitido el</dt>
        <dd className="text-foreground">{formatFecha(certificado.fechaEmision)}</dd>
      </dl>
      <p className="mt-6 font-sans text-xs leading-relaxed text-muted">
        Este certificado ha sido emitido por Escuela de Competencias Aplicadas — Alicia Morales
        Coach SPA. La información aquí desplegada proviene del registro oficial en
        aliciamoralescoach.com.
      </p>
    </Layout>
  );
}
