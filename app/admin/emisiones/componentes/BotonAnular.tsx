"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BotonAnular({ certificadoId }: { certificadoId: string }) {
  const router = useRouter();
  const [abierto, setAbierto] = useState(false);
  const [motivo, setMotivo] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function confirmar() {
    setError(null);
    if (motivo.trim().length < 10) {
      setError("El motivo debe tener al menos 10 caracteres");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/certificados/${certificadoId}/anular`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ motivo }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "No se pudo anular");
        setLoading(false);
        return;
      }
      setAbierto(false);
      router.refresh();
    } catch {
      setError("No se pudo conectar con el servidor");
      setLoading(false);
    }
  }

  if (!abierto) {
    return (
      <button
        type="button"
        onClick={() => setAbierto(true)}
        className="rounded border border-red-500 px-3 py-1 font-sans text-xs text-red-400 hover:bg-red-950/40"
      >
        Anular
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-sm rounded-lg border border-border bg-surface p-6">
        <h3 className="mb-3 font-display text-lg font-semibold text-foreground">
          Motivo de la anulación
        </h3>
        <textarea
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
          rows={4}
          className="mb-3 w-full rounded border border-border bg-background px-3 py-2 font-sans text-sm text-foreground outline-none focus:border-primary"
          placeholder="Explica por qué se anula este certificado (mínimo 10 caracteres)"
        />
        {error && <p className="mb-3 font-sans text-sm text-red-400">{error}</p>}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setAbierto(false)}
            disabled={loading}
            className="rounded border border-border px-4 py-2 font-sans text-sm text-foreground hover:bg-background"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={confirmar}
            disabled={loading}
            className="rounded bg-red-600 px-4 py-2 font-sans text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
          >
            {loading ? "Anulando..." : "Confirmar anulación"}
          </button>
        </div>
      </div>
    </div>
  );
}
