import "server-only";
import { randomBytes } from "crypto";

// Cliente server-side de los Web Services REST de Moodle (Hito 1, Commit 6).
// NUNCA importar desde componentes cliente: usa MOODLE_WS_TOKEN (secreto).

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------
export interface MoodleUser {
  id: number;
  username: string;
  email: string;
  firstname: string;
  lastname: string;
}

export interface CrearUsuarioInput {
  email: string;
  nombre: string;
  apellido: string;
}

export interface EnrolarUsuarioInput {
  userid: number;
  courseid: number;
  roleid?: number;
}

interface MoodleException {
  exception: string;
  errorcode: string;
  message: string;
  debuginfo?: string;
}

// ---------------------------------------------------------------------------
// Configuración (desde el entorno del servicio Next.js)
// ---------------------------------------------------------------------------
function getWsUrl(): string {
  const url = process.env.MOODLE_WS_URL;
  if (!url) throw new Error("MOODLE_WS_URL no está configurado");
  return url;
}

function getWsToken(): string {
  const token = process.env.MOODLE_WS_TOKEN;
  if (!token) throw new Error("MOODLE_WS_TOKEN no está configurado");
  return token;
}

function getDefaultRoleId(): number {
  return Number.parseInt(process.env.MOODLE_DEFAULT_ROLE_ID || "5", 10);
}

// ---------------------------------------------------------------------------
// Serialización estilo Moodle/PHP: aplana objetos/arrays anidados a la notación
// con corchetes. Ej: { users: [{ username: 'x' }] } -> users[0][username]=x
// ---------------------------------------------------------------------------
function flattenParams(
  value: unknown,
  prefix = "",
  out: Record<string, string> = {},
): Record<string, string> {
  if (value === null || value === undefined) {
    return out;
  }
  if (Array.isArray(value)) {
    value.forEach((item, i) => {
      flattenParams(item, prefix ? `${prefix}[${i}]` : String(i), out);
    });
  } else if (typeof value === "object") {
    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      flattenParams(val, prefix ? `${prefix}[${key}]` : key, out);
    }
  } else if (typeof value === "boolean") {
    out[prefix] = value ? "1" : "0";
  } else {
    out[prefix] = String(value);
  }
  return out;
}

// ---------------------------------------------------------------------------
// 1. moodleRequest — POST x-www-form-urlencoded; detecta el error de Moodle
//    (que llega con HTTP 200 y forma { exception, errorcode, message }).
// ---------------------------------------------------------------------------
export async function moodleRequest<T = unknown>(
  wsfunction: string,
  params: Record<string, unknown> = {},
): Promise<T> {
  const body = new URLSearchParams({
    wstoken: getWsToken(),
    wsfunction,
    moodlewsrestformat: "json",
    ...flattenParams(params),
  });

  const res = await fetch(getWsUrl(), {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Moodle WS ${wsfunction}: HTTP ${res.status}`);
  }

  const text = await res.text();
  let data: unknown;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    throw new Error(
      `Moodle WS ${wsfunction}: respuesta no-JSON: ${text.slice(0, 200)}`,
    );
  }

  if (data && typeof data === "object" && "exception" in data) {
    const err = data as MoodleException;
    throw new Error(
      `Moodle WS ${wsfunction} falló [${err.errorcode}]: ${err.message}`,
    );
  }

  return data as T;
}

// ---------------------------------------------------------------------------
// 2. buscarUsuarioPorEmail
// ---------------------------------------------------------------------------
export async function buscarUsuarioPorEmail(
  email: string,
): Promise<MoodleUser | null> {
  const users = await moodleRequest<MoodleUser[]>(
    "core_user_get_users_by_field",
    { field: "email", values: [email] },
  );
  return Array.isArray(users) && users.length > 0 ? users[0] : null;
}

// ---------------------------------------------------------------------------
// Contraseña temporal fuerte (cumple la política por defecto de Moodle:
// >=8, mayúscula, minúscula, dígito y símbolo). No se expone al alumno; en el
// Commit 7 se fuerza el cambio en el primer acceso.
// ---------------------------------------------------------------------------
function generarPasswordTemporal(): string {
  const aleatorio = randomBytes(18)
    .toString("base64")
    .replace(/[^a-zA-Z0-9]/g, "");
  return `Aa1!${aleatorio}`;
}

// ---------------------------------------------------------------------------
// 3. crearUsuario
// ---------------------------------------------------------------------------
export async function crearUsuario({
  email,
  nombre,
  apellido,
}: CrearUsuarioInput): Promise<MoodleUser> {
  const username = email.toLowerCase();
  const created = await moodleRequest<Array<{ id: number; username: string }>>(
    "core_user_create_users",
    {
      users: [
        {
          username,
          email,
          firstname: nombre,
          lastname: apellido,
          auth: "manual",
          password: generarPasswordTemporal(),
        },
      ],
    },
  );

  if (!Array.isArray(created) || created.length === 0) {
    throw new Error("core_user_create_users no devolvió el usuario creado");
  }

  return {
    id: created[0].id,
    username: created[0].username ?? username,
    email,
    firstname: nombre,
    lastname: apellido,
  };
}

// ---------------------------------------------------------------------------
// 4. enrolarUsuario (enrolamiento manual; idempotente en Moodle)
// ---------------------------------------------------------------------------
export async function enrolarUsuario({
  userid,
  courseid,
  roleid,
}: EnrolarUsuarioInput): Promise<void> {
  await moodleRequest<null>("enrol_manual_enrol_users", {
    enrolments: [
      {
        roleid: roleid ?? getDefaultRoleId(),
        userid,
        courseid,
      },
    ],
  });
}

// ---------------------------------------------------------------------------
// 5. buscarOCrearUsuario (idempotencia: evita "username already exists")
// ---------------------------------------------------------------------------
export async function buscarOCrearUsuario(
  input: CrearUsuarioInput,
): Promise<MoodleUser> {
  const existente = await buscarUsuarioPorEmail(input.email);
  if (existente) return existente;
  return crearUsuario(input);
}
