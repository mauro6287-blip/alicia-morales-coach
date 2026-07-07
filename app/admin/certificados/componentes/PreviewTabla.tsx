"use client";

import type { FilaNormalizada } from "@/lib/cert/excel-parser";

export default function PreviewTabla({
  filas,
  mostrarCurso,
}: {
  filas: FilaNormalizada[];
  mostrarCurso: boolean;
}) {
  const validas = filas.filter((f) => f.errores.length === 0).length;
  const conErrores = filas.length - validas;
  const visibles = filas.slice(0, 20);

  return (
    <div className="rounded-lg border border-primary/30 bg-surface p-6">
      <h2 className="mb-2 font-display text-lg font-semibold text-primary">Previsualización</h2>
      <p className="mb-4 font-sans text-sm text-muted">
        {validas} válidas / {conErrores} con errores / {filas.length} totales
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-left font-sans text-sm">
          <thead>
            <tr className="border-b border-border text-muted">
              <th className="py-2 pr-3">Nombre</th>
              <th className="py-2 pr-3">RUT</th>
              <th className="py-2 pr-3">Email</th>
              {mostrarCurso && <th className="py-2 pr-3">Curso</th>}
              <th className="py-2 pr-3">Fecha aprobación</th>
              <th className="py-2 pr-3">Horas</th>
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
                  {fila.fechaAprobacion.toISOString().slice(0, 10)}
                </td>
                <td className="py-2 pr-3 text-foreground">{fila.horas}</td>
                <td className="py-2 pr-3 text-red-400">{fila.errores.join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
