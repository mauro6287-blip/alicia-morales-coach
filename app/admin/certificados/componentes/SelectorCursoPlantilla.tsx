"use client";

import { useState } from "react";

export type CursoOpcion = { id: string; nombre: string; parrafoCierre: string | null };
export type PlantillaOpcion = { id: string; nombre: string };

const AYUDA_FRASE =
  "Aparece impresa en el certificado, bajo el nombre del participante. Si la dejas vacía se usa el texto genérico.";

type ModoFormulario = { tipo: "crear" } | { tipo: "editar"; curso: CursoOpcion };

export default function SelectorCursoPlantilla({
  cursos,
  plantillas,
  cursoId,
  plantillaId,
  onChangeCurso,
  onChangePlantilla,
  onCursoCreado,
  onCursoActualizado,
}: {
  cursos: CursoOpcion[];
  plantillas: PlantillaOpcion[];
  cursoId: string;
  plantillaId: string;
  onChangeCurso: (id: string) => void;
  onChangePlantilla: (id: string) => void;
  onCursoCreado: (curso: CursoOpcion) => void;
  onCursoActualizado: (curso: CursoOpcion) => void;
}) {
  const [modo, setModo] = useState<ModoFormulario | null>(null);
  const [nombre, setNombre] = useState("");
  const [parrafoCierre, setParrafoCierre] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cursoSeleccionado = cursos.find((c) => c.id === cursoId) ?? null;

  function abrirCrear() {
    setModo({ tipo: "crear" });
    setNombre("");
    setParrafoCierre("");
    setError(null);
  }

  function abrirEditar(curso: CursoOpcion) {
    setModo({ tipo: "editar", curso });
    setNombre(curso.nombre);
    setParrafoCierre(curso.parrafoCierre ?? "");
    setError(null);
  }

  function cerrar() {
    setModo(null);
    setError(null);
  }

  async function guardar() {
    if (!modo) return;
    setGuardando(true);
    setError(null);

    const url =
      modo.tipo === "crear" ? "/api/admin/cursos" : `/api/admin/cursos/${modo.curso.id}`;

    try {
      const res = await fetch(url, {
        method: modo.tipo === "crear" ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, parrafoCierre }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "No se pudo guardar el curso.");
        return;
      }

      if (modo.tipo === "crear") {
        onCursoCreado(data as CursoOpcion);
      } else {
        onCursoActualizado(data as CursoOpcion);
      }
      cerrar();
    } catch {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="rounded-lg border border-primary/30 bg-surface p-6">
      <h2 className="mb-4 font-display text-lg font-semibold text-primary">
        Curso y plantilla
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block font-sans text-sm text-foreground">Curso*</label>
          <select
            value={cursoId}
            onChange={(e) => onChangeCurso(e.target.value)}
            className="w-full rounded border border-border bg-background px-3 py-2 font-sans text-sm text-foreground outline-none focus:border-primary"
          >
            <option value="">— Seleccionar curso —</option>
            {cursos.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>

          <div className="mt-2 flex gap-4">
            <button
              type="button"
              onClick={abrirCrear}
              className="font-sans text-sm text-primary hover:underline"
            >
              + Nuevo curso
            </button>
            {cursoSeleccionado && (
              <button
                type="button"
                onClick={() => abrirEditar(cursoSeleccionado)}
                className="font-sans text-sm text-primary hover:underline"
              >
                Editar
              </button>
            )}
          </div>
        </div>

        <div>
          <label className="mb-1 block font-sans text-sm text-foreground">Plantilla*</label>
          <select
            value={plantillaId}
            onChange={(e) => onChangePlantilla(e.target.value)}
            className="w-full rounded border border-border bg-background px-3 py-2 font-sans text-sm text-foreground outline-none focus:border-primary"
          >
            <option value="">— Seleccionar plantilla —</option>
            {plantillas.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      {modo && (
        <div className="mt-4 rounded border border-border bg-background p-4">
          <h3 className="mb-3 font-display text-sm font-semibold text-primary">
            {modo.tipo === "crear" ? "Nuevo curso o taller" : "Editar curso o taller"}
          </h3>

          <label className="mb-1 block font-sans text-sm text-foreground">
            Nombre del curso o taller*
          </label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full rounded border border-border bg-surface px-3 py-2 font-sans text-sm text-foreground outline-none focus:border-primary"
          />

          <label className="mb-1 mt-4 block font-sans text-sm text-foreground">
            Frase de cierre
          </label>
          <textarea
            rows={4}
            value={parrafoCierre}
            onChange={(e) => setParrafoCierre(e.target.value)}
            className="w-full rounded border border-border bg-surface px-3 py-2 font-sans text-sm text-foreground outline-none focus:border-primary"
          />
          <p className="mt-1 font-sans text-xs text-muted">{AYUDA_FRASE}</p>

          {error && <p className="mt-3 font-sans text-sm text-red-400">{error}</p>}

          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={guardar}
              disabled={guardando}
              className="rounded bg-primary px-4 py-2 font-sans text-sm font-semibold text-background hover:bg-primary-dark disabled:opacity-40"
            >
              {guardando ? "Guardando..." : "Guardar"}
            </button>
            <button
              type="button"
              onClick={cerrar}
              disabled={guardando}
              className="rounded border border-border px-4 py-2 font-sans text-sm text-foreground hover:border-primary disabled:opacity-40"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
