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
      router.push(`/admin/emisiones/${data.emisionId}`);
    } catch {
      setError("No se pudo conectar con el servidor");
      setLoading(false);
    }
  }

  return (
    <div className="rounded-lg border border-primary/30 bg-surface p-6">
      <button
        type="button"
        disabled={deshabilitado}
        onClick={handleEmitir}
        className="rounded bg-primary px-5 py-2 font-sans text-sm font-semibold text-background hover:bg-primary-dark disabled:opacity-40"
      >
        {loading ? "Emitiendo..." : `Emitir ${cantidadValidas} certificados`}
      </button>
      {error && (
        <p className="mt-4 font-sans text-sm text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
