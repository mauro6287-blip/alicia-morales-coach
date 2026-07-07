import { createHash } from "crypto";

export function hashCertificado(datos: {
  codigo: string;
  alumnoNombre: string;
  alumnoRut: string;
  cursoNombre: string;
  fechaAprobacion: Date;
  horasCurso: number;
}): string {
  const canonico = [
    datos.codigo,
    datos.alumnoNombre.trim().toUpperCase(),
    datos.alumnoRut.replace(/[.-]/g, "").toUpperCase(),
    datos.cursoNombre.trim(),
    datos.fechaAprobacion.toISOString().slice(0, 10),
    datos.horasCurso,
  ].join("|");

  return createHash("sha256").update(canonico).digest("hex");
}
