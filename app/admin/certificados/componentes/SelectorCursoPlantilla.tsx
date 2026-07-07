"use client";

export type CursoOpcion = { id: string; nombre: string };
export type PlantillaOpcion = { id: string; nombre: string };

export default function SelectorCursoPlantilla({
  cursos,
  plantillas,
  cursoId,
  plantillaId,
  onChangeCurso,
  onChangePlantilla,
}: {
  cursos: CursoOpcion[];
  plantillas: PlantillaOpcion[];
  cursoId: string;
  plantillaId: string;
  onChangeCurso: (id: string) => void;
  onChangePlantilla: (id: string) => void;
}) {
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
    </div>
  );
}
