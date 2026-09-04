"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { FilaExcel, Mapeo } from "@/lib/cert/excel-parser";

export default function BotonEmitir({
  filas,
  mapeo,
  cursoId,
  plantillaId,
  nombreArchivo,
  cantidadValidas,
}: {
  filas: FilaExcel[];
  mapeo: Mapeo;
  cursoId: string;
  plantillaId: string;
  nombreArchivo: string;
  cantidadValidas: number;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Solo se rellena cuando la emisión saltó duplicados: en ese caso hay algo
  // que explicar antes de navegar.
  const [resultado, setResultado] = useState<{
    emisionId: string;
    emitidos: number;
    duplicadosSaltados: number;
  } | null>(null);

  const deshabilitado = !cursoId || !plantillaId || cantidadValidas === 0 || loading;

  async function handleEmitir() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/certificados/emitir", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filas, mapeo, cursoId, plantillaId, nombreArchivo }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "No se pudo emitir el lote");
        setLoading(false);
        return;
      }
      // Camino normal: nada que explicar, se navega directo como siempre.
      if (!data.duplicadosSaltados) {
        router.push(`/admin/emisiones/${data.emisionId}`);
        return;
      }
      // Hubo omisiones por duplicado. Antes esto llevaba a una emisión con
      // menos certificados de los esperados —o vacía— sin ninguna explicación.
      setResultado({
        emisionId: data.emisionId,
        emitidos: data.emitidos ?? 0,
        duplicadosSaltados: data.duplicadosSaltados,
      });
      setLoading(false);
    } catch {
      setError("No se pudo conectar con el servidor");
      setLoading(false);
    }
  }

  return (
    <div className="rounded-lg border border-primary/30 bg-surface p-6">
      <p className="mb-3 font-sans text-sm text-muted">
        Este paso solo <strong className="text-foreground">crea</strong> los
        certificados. <strong className="text-foreground">No envía ningún
        correo</strong>: el envío es el paso siguiente, en la pantalla de la
        emisión, donde eliges a quiénes y en qué tamaño de lote.
      </p>
      <button
        type="button"
        disabled={deshabilitado}
        onClick={handleEmitir}
        className="rounded bg-primary px-5 py-2 font-sans text-sm font-semibold text-background hover:bg-primary-dark disabled:opacity-40"
      >
        {loading
          ? "Emitiendo..."
          : `Crear ${cantidadValidas} certificados (sin enviar correos)`}
      </button>
      {error && (
        <p className="mt-4 font-sans text-sm text-red-400" role="alert">
          {error}
        </p>
      )}

      {resultado && (
        <div className="mt-4 rounded border border-border bg-background p-4">
          <p className="font-sans text-sm text-foreground">
            Se crearon <strong>{resultado.emitidos}</strong>{" "}
            {resultado.emitidos === 1 ? "certificado" : "certificados"}.
          </p>
          <p className="mt-1 font-sans text-sm text-muted">
            <strong className="text-foreground">
              {resultado.duplicadosSaltados}
            </strong>{" "}
            {resultado.duplicadosSaltados === 1
              ? "alumno ya tenía"
              : "alumnos ya tenían"}{" "}
            un certificado válido en este curso, así que{" "}
            {resultado.duplicadosSaltados === 1 ? "se omitió" : "se omitieron"}.
            Sus certificados anteriores siguen vigentes en la emisión donde se
            crearon.
          </p>
          <button
            type="button"
            onClick={() => router.push(`/admin/emisiones/${resultado.emisionId}`)}
            className="mt-3 rounded border border-border px-4 py-2 font-sans text-sm text-foreground hover:bg-surface"
          >
            Ir a la emisión
          </button>
        </div>
      )}
    </div>
  );
}
