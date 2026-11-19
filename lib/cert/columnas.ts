// Fuente única de las columnas del Excel de certificados.
// La usan el mapeo de columnas (etiquetas, obligatoriedad y preselección),
// el parser (tipo de los campos) y la plantilla descargable (encabezados e
// instrucciones). Este módulo no importa "xlsx" para poder usarse en el cliente.

export const COLUMNAS_CERTIFICADOS = [
  {
    key: "nombre",
    encabezado: "Nombre",
    label: "Nombre",
    requerido: true,
    formato: "Nombre completo del alumno (mínimo 3 caracteres).",
    ejemplo: "María José Pérez Soto",
    ancho: 34,
  },
  {
    key: "rut",
    encabezado: "RUT",
    label: "RUT",
    requerido: true,
    formato: "RUT chileno con dígito verificador; puntos y guion opcionales.",
    ejemplo: "12.345.678-5",
    ancho: 16,
  },
  {
    key: "email",
    encabezado: "Email",
    label: "Email",
    requerido: true,
    formato: "Correo electrónico válido; ahí se envía el certificado.",
    ejemplo: "maria.perez@correo.cl",
    ancho: 32,
  },
  {
    key: "cursoOpcional",
    encabezado: "Curso",
    label: "Curso (opcional)",
    requerido: false,
    formato: "Nombre del curso tal como debe aparecer. Puede quedar vacío.",
    ejemplo: "Taller de Empleabilidad",
    ancho: 30,
  },
  {
    key: "fechaAprobacion",
    encabezado: "Fecha del taller",
    label: "Fecha del taller",
    requerido: false,
    formato:
      "Fecha DD/MM/AAAA o AAAA-MM-DD (o celda de fecha). Si queda vacía, se usa la fecha de emisión.",
    ejemplo: "15/11/2026",
    ancho: 18,
    ayuda: "Se imprime en el certificado. Si no la mapeas, se usa la fecha de emisión.",
  },
] as const satisfies readonly {
  key: string;
  encabezado: string;
  label: string;
  requerido: boolean;
  formato: string;
  ejemplo: string;
  ancho: number;
  ayuda?: string;
}[];

export type CamposCertificado = (typeof COLUMNAS_CERTIFICADOS)[number]["key"];

export const HOJA_ALUMNOS = "Alumnos";
export const HOJA_INSTRUCCIONES = "Instrucciones";
export const NOMBRE_PLANTILLA = "plantilla_certificados.xlsx";

function normalizarEncabezado(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim()
    .toLowerCase();
}

// Preselecciona el mapeo cuando un encabezado del archivo coincide con el de
// la plantilla (sin distinguir mayúsculas, tildes ni espacios en los bordes).
// Las columnas sin coincidencia quedan para que el usuario las elija a mano.
export function mapeoSugerido(
  nombresColumnas: string[],
): Partial<Record<CamposCertificado, string>> {
  const sugerido: Partial<Record<CamposCertificado, string>> = {};
  for (const col of COLUMNAS_CERTIFICADOS) {
    const objetivo = normalizarEncabezado(col.encabezado);
    const encontrada = nombresColumnas.find((n) => normalizarEncabezado(n) === objetivo);
    if (encontrada) sugerido[col.key] = encontrada;
  }
  return sugerido;
}
