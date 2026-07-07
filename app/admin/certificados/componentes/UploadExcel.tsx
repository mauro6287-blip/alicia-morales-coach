"use client";

import { useRef, useState } from "react";
import type { FilaExcel } from "@/lib/cert/excel-parser";

export type ExcelParseadoCliente = {
  nombresColumnas: string[];
  filas: FilaExcel[];
  totalFilas: number;
  nombreArchivo: string;
};

export default function UploadExcel({
  onParsed,
}: {
  onParsed: (data: ExcelParseadoCliente) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setError(null);
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("archivo", file);
      const res = await fetch("/api/admin/certificados/parsear-excel", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "No se pudo leer el archivo");
        setLoading(false);
        return;
      }
      const data = await res.json();
      onParsed({ ...data, nombreArchivo: file.name });
    } catch {
      setError("No se pudo conectar con el servidor");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-lg border border-primary/30 bg-surface p-8 text-center">
      <p className="mb-4 font-sans text-sm text-muted">
        Sube el Excel (.xlsx) con los alumnos aprobados. La primera fila debe contener los
        nombres de columna.
      </p>
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,.xls"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={loading}
        className="rounded bg-primary px-5 py-2 font-sans text-sm font-semibold text-background hover:bg-primary-dark disabled:opacity-60"
      >
        {loading ? "Leyendo archivo..." : "Seleccionar archivo Excel"}
      </button>
      {error && (
        <p className="mt-4 font-sans text-sm text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
