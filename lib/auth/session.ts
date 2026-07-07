// Funciones de sesión puras (Web Crypto), sin dependencias de Node/Prisma,
// para que puedan usarse tanto en middleware.ts (Edge runtime) como en rutas
// API (Node runtime) sin arrastrar el cliente de Prisma al bundle de Edge.

export const SESSION_COOKIE = "amc_admin_session";
export const SESSION_MAX_AGE = 60 * 60 * 12; // 12h en segundos

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET no está configurado");
  }
  return secret;
}

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function randomHex(byteLength: number): string {
  const bytes = new Uint8Array(byteLength);
  crypto.getRandomValues(bytes);
  return toHex(bytes.buffer);
}

async function hmacSha256Hex(message: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return toHex(signature);
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

export async function createSession(userId: string): Promise<string> {
  const nonce = randomHex(32);
  const payload = `${userId}.${nonce}`;
  const signature = await hmacSha256Hex(payload, getSecret());
  return `${payload}.${signature}`;
}

export async function verifySession(token: string): Promise<string | null> {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [userId, nonce, signature] = parts;
  const payload = `${userId}.${nonce}`;
  const expected = await hmacSha256Hex(payload, getSecret());
  if (!timingSafeEqual(expected, signature)) return null;
  return userId;
}
