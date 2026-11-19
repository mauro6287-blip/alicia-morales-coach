"use client";

import { useRef, useState } from "react";
import type { FilaExcel } from "@/lib/cert/excel-parser";
import { NOMBRE_PLANTILLA } from "@/lib/cert/columnas";

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
  const [generando, setGenerando] = useState(false);

  async function descargarPlantilla() {
    setError(null);
    setGenerando(true);
    try {
      const [XLSX, { construirPlantilla }] = await Promise.all([
        import("xlsx"),
        import("@/lib/cert/plantilla-excel"),
      ]);
      XLSX.writeFile(construirPlantilla(XLSX), NOMBRE_PLANTILLA, {
        bookType: "xlsx",
      });
    } catch {
      setError("No se pudo generar la plantilla. Intenta de nuevo.");
    } finally {
      setGenerando(false);
    }
  }

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
        Sube el Excel (.xlsx) con los alumnos aprobados. Si no tienes el formato, descarga la
        plantilla.
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
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={loading}
          className="rounded bg-primary px-5 py-2 font-sans text-sm font-semibold text-background hover:bg-primary-dark disabled:opacity-60"
        >
          {loading ? "Leyendo archivo..." : "Seleccionar archivo Excel"}
        </button>
        <button
          type="button"
          onClick={descargarPlantilla}
          disabled={generando}
          className="rounded border border-primary bg-transparent px-5 py-2 font-sans text-sm font-semibold text-primary hover:bg-primary/10 disabled:opacity-60"
        >
          {generando ? "Generando plantilla..." : "Descargar plantilla Excel"}
        </button>
      </div>
      {error && (
        <p className="mt-4 font-sans text-sm text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
