import { customAlphabet } from "nanoid";

const ALFABETO = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const LARGO = 12;

const nanoid = customAlphabet(ALFABETO, LARGO);

export function generarCodigo(): string {
  return nanoid();
}

const FORMATO_REGEX = new RegExp(`^[${ALFABETO}]{${LARGO}}$`);

export function validarFormatoCodigo(codigo: string): boolean {
  return FORMATO_REGEX.test(codigo);
}
