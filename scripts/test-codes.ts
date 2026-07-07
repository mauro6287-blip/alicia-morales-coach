import { generarCodigo, validarFormatoCodigo } from "../lib/cert/codes";

const TOTAL = 1000;
const codigos = new Set<string>();

for (let i = 0; i < TOTAL; i++) {
  codigos.add(generarCodigo());
}

if (codigos.size !== TOTAL) {
  console.error(`FAIL: ${TOTAL - codigos.size} colisiones detectadas`);
  process.exit(1);
}

if (!validarFormatoCodigo("ABCD23456789")) {
  console.error("FAIL: validarFormatoCodigo rechazó un código válido");
  process.exit(1);
}

if (validarFormatoCodigo("ABCD2345678I")) {
  console.error("FAIL: validarFormatoCodigo aceptó un código con 'I'");
  process.exit(1);
}

console.log(`OK: ${TOTAL} códigos únicos generados`);
