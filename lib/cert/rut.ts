function limpiar(rut: string): string {
  return rut.replace(/[^0-9kK]/g, "").toUpperCase();
}

function calcularDv(bodyDigits: string): string {
  let suma = 0;
  let multiplo = 2;
  for (let i = bodyDigits.length - 1; i >= 0; i--) {
    suma += Number.parseInt(bodyDigits[i], 10) * multiplo;
    multiplo = multiplo === 7 ? 2 : multiplo + 1;
  }
  const resto = 11 - (suma % 11);
  if (resto === 11) return "0";
  if (resto === 10) return "K";
  return String(resto);
}

export function validarRut(rut: string): boolean {
  const clean = limpiar(rut);
  if (clean.length < 2) return false;
  const body = clean.slice(0, -1);
  const dv = clean.slice(-1);
  if (!/^\d+$/.test(body)) return false;
  return calcularDv(body) === dv;
}

export function formatearRut(rut: string): string {
  const clean = limpiar(rut);
  const body = clean.slice(0, -1);
  const dv = clean.slice(-1);
  const bodyFormatted = body.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${bodyFormatted}-${dv}`;
}

export function ofuscarRut(rut: string): string {
  const clean = limpiar(rut);
  const body = clean.slice(0, -1);
  const dv = clean.slice(-1);
  const bodyFormatted = body.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  let digitosVistos = 0;
  const masked = bodyFormatted
    .split("")
    .map((ch) => {
      if (ch === ".") return ".";
      digitosVistos++;
      return digitosVistos <= 2 ? ch : "X";
    })
    .join("");

  return `${masked}-${dv}`;
}
