import type * as XLSXTipos from "xlsx";
import { COLUMNAS_CERTIFICADOS, HOJA_ALUMNOS, HOJA_INSTRUCCIONES } from "./columnas";

type ModuloXLSX = typeof XLSXTipos;

// Arma el libro de la plantilla a partir de COLUMNAS_CERTIFICADOS.
// Recibe el módulo "xlsx" por parámetro para que el cliente lo cargue de forma
// diferida (import dinámico) y no engorde el bundle inicial del panel.
//
// "Alumnos" va primero porque el importador lee solo la primera hoja; así
// "Instrucciones" nunca se procesa como datos. La hoja Alumnos no lleva filas
// de ejemplo para que no se emitan certificados ficticios por error.
// Nota: xlsx 0.18.5 (Community) no escribe negrita ni filas inmovilizadas.
export function construirPlantilla(XLSX: ModuloXLSX): XLSXTipos.WorkBook {
  const alumnos = XLSX.utils.aoa_to_sheet([COLUMNAS_CERTIFICADOS.map((c) => c.encabezado)]);
  alumnos["!cols"] = COLUMNAS_CERTIFICADOS.map((c) => ({ wch: c.ancho }));

  const instrucciones = XLSX.utils.aoa_to_sheet([
    ["Columna", "Obligatoria", "Formato esperado", "Ejemplo"],
    ...COLUMNAS_CERTIFICADOS.map((c) => [
      c.encabezado,
      c.requerido ? "Sí" : "No",
      c.formato,
      c.ejemplo,
    ]),
    [],
    [`Complete solo la hoja ${HOJA_ALUMNOS}. No cambie los nombres de las columnas.`],
  ]);
  instrucciones["!cols"] = [{ wch: 20 }, { wch: 12 }, { wch: 70 }, { wch: 26 }];

  const libro = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(libro, alumnos, HOJA_ALUMNOS);
  XLSX.utils.book_append_sheet(libro, instrucciones, HOJA_INSTRUCCIONES);
  return libro;
}
