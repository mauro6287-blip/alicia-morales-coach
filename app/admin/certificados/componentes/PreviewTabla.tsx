"use client";

import type { FilaNormalizada } from "@/lib/cert/excel-parser";

export default function PreviewTabla({
  filas,
  mostrarCurso,
}: {
  filas: FilaNormalizada[];
  mostrarCurso: boolean;
}) {
  const TOPE_VISIBLES = 20;

  const filasConError = filas.filter((f) => f.errores.length > 0);
  const filasValidas = filas.filter((f) => f.errores.length === 0);
  const validas = filasValidas.length;
  const conErrores = filasConError.length;

  // Las filas con error van siempre primero y nunca se recortan: son las
  // únicas sobre las que hay algo que hacer, y quedaban escondidas cuando
  // caían más allá de las primeras 20 de un archivo largo.
  const visibles = [
    ...filasConError,
    ...filasValidas.slice(0, Math.max(0, TOPE_VISIBLES - conErrores)),
  ];
  const ocultas = filas.length - visibles.length;

  return (
    <div className="rounded-lg border border-primary/30 bg-surface p-6">
      <h2 className="mb-2 font-display text-lg font-semibold text-primary">Previsualización</h2>
      <p className="mb-2 font-sans text-sm text-muted">
        {validas} válidas / {conErrores} con errores / {filas.length} totales
      </p>

      {conErrores > 0 && (
        <p className="mb-4 font-sans text-sm text-red-400">
          {conErrores === 1
            ? "1 fila tiene errores y no se emitirá. Aparece destacada al inicio de la tabla."
            : `${conErrores} filas tienen errores y no se emitirán. Aparecen destacadas al inicio de la tabla.`}
        </p>
      )}

      {ocultas > 0 && (
        <p className="mb-4 font-sans text-xs text-muted">
          Mostrando {visibles.length} de {filas.length} filas
          {conErrores > 0 ? " (todas las que tienen errores, más una muestra del resto)." : "."}
        </p>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left font-sans text-sm">
          <thead>
            <tr className="border-b border-border text-muted">
              <th className="py-2 pr-3">Nombre</th>
              <th className="py-2 pr-3">RUT</th>
              <th className="py-2 pr-3">Email</th>
              {mostrarCurso && <th className="py-2 pr-3">Curso</th>}
              <th className="py-2 pr-3">Fecha del taller</th>
              <th className="py-2 pr-3">Errores</th>
            </tr>
          </thead>
          <tbody>
            {visibles.map((fila, idx) => (
              <tr
                key={idx}
                className={`border-b border-border/50 ${
                  fila.errores.length > 0 ? "bg-red-950/40" : ""
                }`}
              >
                <td className="py-2 pr-3 text-foreground">{fila.nombre}</td>
                <td className="py-2 pr-3 text-foreground">{fila.rut}</td>
                <td className="py-2 pr-3 text-foreground">{fila.email}</td>
                {mostrarCurso && (
                  <td className="py-2 pr-3 text-foreground">{fila.cursoOpcional || "—"}</td>
                )}
                <td className="py-2 pr-3 text-foreground">
                  {fila.fechaAprobacion
                    ? new Date(fila.fechaAprobacion).toISOString().slice(0, 10)
                    : "—"}
                </td>
                <td className="py-2 pr-3 text-red-400">{fila.errores.join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
