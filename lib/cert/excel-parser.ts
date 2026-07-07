import * as XLSX from "xlsx";
import { validarRut } from "./rut";

export type FilaExcel = Record<string, string | number | Date>;

export type ExcelParseado = {
  nombresColumnas: string[];
  filas: FilaExcel[];
  totalFilas: number;
};

export async function parsearExcel(buffer: Buffer): Promise<ExcelParseado> {
  const workbook = XLSX.read(buffer, { type: "buffer", cellDates: true });
  const primeraHoja = workbook.SheetNames[0];
  const sheet = workbook.Sheets[primeraHoja];

  const filasCrudas: unknown[][] = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    defval: "",
  });

  if (filasCrudas.length === 0) {
    return { nombresColumnas: [], filas: [], totalFilas: 0 };
  }

  const nombresColumnas = filasCrudas[0].map((c) => String(c).trim());
  const filas: FilaExcel[] = filasCrudas.slice(1).map((fila) => {
    const obj: FilaExcel = {};
    nombresColumnas.forEach((nombre, idx) => {
      obj[nombre] = fila[idx] as string | number | Date;
    });
    return obj;
  });

  return { nombresColumnas, filas, totalFilas: filas.length };
}

export type CamposCertificado =
  | "nombre"
  | "rut"
  | "email"
  | "cursoOpcional"
  | "fechaAprobacion"
  | "horas";

export type Mapeo = Record<CamposCertificado, string>;

export type FilaNormalizada = {
  nombre: string;
  rut: string;
  email: string;
  cursoOpcional?: string;
  fechaAprobacion: Date;
  horas: number;
  errores: string[];
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function parsearFecha(valor: string | number | Date | undefined): Date | null {
  if (!valor) return null;
  if (valor instanceof Date) return valor;

  if (typeof valor === "number") {
    // Fecha serial de Excel (días desde 1899-12-30).
    const parsed = XLSX.SSF.parse_date_code(valor);
    if (!parsed) return null;
    return new Date(Date.UTC(parsed.y, parsed.m - 1, parsed.d));
  }

  const texto = valor.trim();

  const isoMatch = texto.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) {
    const [, y, m, d] = isoMatch;
    return new Date(Date.UTC(Number(y), Number(m) - 1, Number(d)));
  }

  const ddmmMatch = texto.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (ddmmMatch) {
    const [, d, m, y] = ddmmMatch;
    return new Date(Date.UTC(Number(y), Number(m) - 1, Number(d)));
  }

  return null;
}

export function normalizarFilas(filas: FilaExcel[], mapeo: Mapeo): FilaNormalizada[] {
  return filas.map((fila) => {
    const errores: string[] = [];

    const nombre = String(fila[mapeo.nombre] ?? "").trim();
    if (nombre.length < 3) errores.push("Nombre inválido");

    const rutCrudo = String(fila[mapeo.rut] ?? "").trim();
    if (!validarRut(rutCrudo)) errores.push("RUT inválido");

    const email = String(fila[mapeo.email] ?? "").trim();
    if (!EMAIL_REGEX.test(email)) errores.push("Email inválido");

    const cursoOpcional = mapeo.cursoOpcional
      ? String(fila[mapeo.cursoOpcional] ?? "").trim() || undefined
      : undefined;

    const fechaAprobacion = parsearFecha(fila[mapeo.fechaAprobacion]);
    if (!fechaAprobacion) errores.push("Fecha de aprobación inválida");

    const horasRaw = fila[mapeo.horas];
    const horas = typeof horasRaw === "number" ? horasRaw : Number(String(horasRaw ?? "").trim());
    if (!Number.isFinite(horas) || horas <= 0) errores.push("Horas inválidas");

    return {
      nombre,
      rut: rutCrudo,
      email,
      cursoOpcional,
      fechaAprobacion: fechaAprobacion ?? new Date(0),
      horas: Number.isFinite(horas) ? horas : 0,
      errores,
    };
  });
}
