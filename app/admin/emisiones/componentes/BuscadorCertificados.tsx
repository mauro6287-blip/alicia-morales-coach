"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Resultado = {
  id: string;
  codigo: string;
  alumnoNombre: string;
  alumnoRut: string;
  cursoNombre: string;
  estado: "VALIDO" | "ANULADO";
  emisionId: string;
};

export default function BuscadorCertificados() {
  const [query, setQuery] = useState("");
  const [resultados, setResultados] = useState<Resultado[]>([]);
  const [buscando, setBuscando] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResultados([]);
      return;
    }
    let cancelado = false;
    const timeout = setTimeout(async () => {
      setBuscando(true);
      try {
        const res = await fetch("/api/admin/certificados/buscar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query }),
        });
        const data = await res.json();
        if (!cancelado) setResultados(data.resultados || []);
      } finally {
        if (!cancelado) setBuscando(false);
      }
    }, 300);
    return () => {
      cancelado = true;
      clearTimeout(timeout);
    };
  }, [query]);

  return (
    <div className="mb-6">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar por nombre, RUT o código..."
        className="w-full max-w-md rounded border border-border bg-surface px-3 py-2 font-sans text-sm text-foreground outline-none focus:border-primary"
      />
      {buscando && <p className="mt-2 font-sans text-xs text-muted">Buscando...</p>}
      {resultados.length > 0 && (
        <div className="mt-3 max-w-md rounded border border-border bg-surface">
          {resultados.map((r) => (
            <Link
              key={r.id}
              href={`/admin/emisiones/${r.emisionId}`}
              className="flex items-center justify-between border-b border-border/50 px-3 py-2 font-sans text-sm text-foreground last:border-0 hover:bg-background"
            >
              <span>
                {r.alumnoNombre} · {r.alumnoRut} · {r.cursoNombre}
              </span>
              <span className="font-mono text-xs text-muted">{r.codigo}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
