"use client";

import { useEffect, useState } from "react";
import UploadExcel, { type ExcelParseadoCliente } from "./componentes/UploadExcel";
import MapeoColumnas from "./componentes/MapeoColumnas";
import SelectorCursoPlantilla, {
  type CursoOpcion,
  type PlantillaOpcion,
} from "./componentes/SelectorCursoPlantilla";
import PreviewTabla from "./componentes/PreviewTabla";
import BotonEmitir from "./componentes/BotonEmitir";
import type { FilaNormalizada, Mapeo } from "@/lib/cert/excel-parser";

export default function CertificadosClient({
  cursos,
  plantillas,
}: {
  cursos: CursoOpcion[];
  plantillas: PlantillaOpcion[];
}) {
  const [archivo, setArchivo] = useState<ExcelParseadoCliente | null>(null);
  const [mapeo, setMapeo] = useState<Mapeo | null>(null);
  const [filasNormalizadas, setFilasNormalizadas] = useState<FilaNormalizada[] | null>(null);
  const [normalizando, setNormalizando] = useState(false);
  const [cursoId, setCursoId] = useState("");
  const [plantillaId, setPlantillaId] = useState("");

  useEffect(() => {
    if (!archivo || !mapeo) return;
    let cancelado = false;
    setNormalizando(true);
    fetch("/api/admin/certificados/normalizar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filas: archivo.filas, mapeo }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!cancelado) setFilasNormalizadas(data.filas);
      })
      .finally(() => {
        if (!cancelado) setNormalizando(false);
      });
    return () => {
      cancelado = true;
    };
  }, [archivo, mapeo]);

  const cantidadValidas = filasNormalizadas?.filter((f) => f.errores.length === 0).length ?? 0;

  return (
    <div className="flex flex-col gap-6">
      {!archivo && <UploadExcel onParsed={setArchivo} />}

      {archivo && !mapeo && (
        <MapeoColumnas nombresColumnas={archivo.nombresColumnas} onConfirm={setMapeo} />
      )}

      {archivo && mapeo && (
        <>
          <SelectorCursoPlantilla
            cursos={cursos}
            plantillas={plantillas}
            cursoId={cursoId}
            plantillaId={plantillaId}
            onChangeCurso={setCursoId}
            onChangePlantilla={setPlantillaId}
          />

          {normalizando && (
            <p className="font-sans text-sm text-muted">Procesando filas...</p>
          )}

          {filasNormalizadas && (
            <>
              <PreviewTabla filas={filasNormalizadas} mostrarCurso={!!mapeo.cursoOpcional} />
              <BotonEmitir
                filas={archivo.filas}
                mapeo={mapeo}
                cursoId={cursoId}
                plantillaId={plantillaId}
                nombreArchivo={archivo.nombreArchivo}
                cantidadValidas={cantidadValidas}
              />
            </>
          )}
        </>
      )}
    </div>
  );
}
