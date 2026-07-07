"use client";

import { useState } from "react";
import type { CamposCertificado, Mapeo } from "@/lib/cert/excel-parser";

const CAMPOS: { key: CamposCertificado; label: string; requerido: boolean }[] = [
  { key: "nombre", label: "Nombre", requerido: true },
  { key: "rut", label: "RUT", requerido: true },
  { key: "email", label: "Email", requerido: true },
  { key: "cursoOpcional", label: "Curso (opcional)", requerido: false },
  { key: "fechaAprobacion", label: "Fecha de aprobación", requerido: true },
  { key: "horas", label: "Horas", requerido: true },
];

export default function MapeoColumnas({
  nombresColumnas,
  onConfirm,
}: {
  nombresColumnas: string[];
  onConfirm: (mapeo: Mapeo) => void;
}) {
  const [seleccion, setSeleccion] = useState<Partial<Mapeo>>({});

  const requeridosCompletos = CAMPOS.filter((c) => c.requerido).every(
    (c) => !!seleccion[c.key],
  );

  return (
    <div className="rounded-lg border border-primary/30 bg-surface p-6">
      <h2 className="mb-4 font-display text-lg font-semibold text-primary">
        Mapear columnas
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {CAMPOS.map((campo) => (
          <div key={campo.key}>
            <label className="mb-1 block font-sans text-sm text-foreground">
              {campo.label}
              {campo.requerido ? "*" : ""}
            </label>
            <select
              value={seleccion[campo.key] || ""}
              onChange={(e) =>
                setSeleccion((prev) => ({ ...prev, [campo.key]: e.target.value }))
              }
              className="w-full rounded border border-border bg-background px-3 py-2 font-sans text-sm text-foreground outline-none focus:border-primary"
            >
              <option value="">— Seleccionar columna —</option>
              {nombresColumnas.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <button
        type="button"
        disabled={!requeridosCompletos}
        onClick={() => onConfirm(seleccion as Mapeo)}
        className="mt-6 rounded bg-primary px-5 py-2 font-sans text-sm font-semibold text-background hover:bg-primary-dark disabled:opacity-40"
      >
        Previsualizar
      </button>
    </div>
  );
}
