import { z } from "zod";

export function cleanRut(rut: string): string {
  return rut.replace(/[^0-9kK]/g, "").toUpperCase();
}

export function validateRut(rut: string): boolean {
  const clean = cleanRut(rut);
  if (clean.length < 2) return false;
  const body = clean.slice(0, -1);
  const dv = clean.slice(-1);
  if (!/^\d+$/.test(body)) return false;

  let sum = 0;
  let multiplier = 2;
  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body[i], 10) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }
  const expected = 11 - (sum % 11);
  const dvExpected =
    expected === 11 ? "0" : expected === 10 ? "K" : String(expected);
  return dv === dvExpected;
}

export const CheckoutSchema = z.object({
  buyerName: z
    .string()
    .trim()
    .min(2, "Ingresá tu nombre completo"),
  buyerEmail: z
    .string()
    .trim()
    .toLowerCase()
    .email("Email inválido"),
  buyerPhone: z
    .string()
    .trim()
    .min(8, "Teléfono muy corto")
    .regex(/^[0-9+\s()-]{8,}$/, "Formato inválido"),
  buyerRut: z
    .string()
    .trim()
    .refine(validateRut, "RUT inválido"),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().min(1).max(20),
      }),
    )
    .min(1, "Carrito vacío"),
});

export type CheckoutInput = z.infer<typeof CheckoutSchema>;
