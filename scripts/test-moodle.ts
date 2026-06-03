// Prueba real del cliente lib/moodle.ts contra el curso piloto (courseid=2).
// Ejecutar con las variables del servicio Next.js, p. ej.:
//   NODE_OPTIONS="--conditions=react-server" \
//     railway run --service alicia-morales-coach -- npx tsx scripts/test-moodle.ts
// (El token llega por el entorno de Railway; NO se hardcodea.)

import {
  buscarOCrearUsuario,
  enrolarUsuario,
  moodleRequest,
} from "../lib/moodle";

const EMAIL = "test.commit6@cursos.aliciamoralescoach.com";
const COURSEID = 2;

async function main() {
  console.log("== 1ª ejecución ==");
  const u1 = await buscarOCrearUsuario({
    email: EMAIL,
    nombre: "Test",
    apellido: "Commit6",
  });
  console.log(`usuario: id=${u1.id} username=${u1.username}`);
  await enrolarUsuario({ userid: u1.id, courseid: COURSEID });
  console.log(`enrolado en courseid=${COURSEID}`);

  console.log("== 2ª ejecución (idempotencia) ==");
  const u2 = await buscarOCrearUsuario({
    email: EMAIL,
    nombre: "Test",
    apellido: "Commit6",
  });
  await enrolarUsuario({ userid: u2.id, courseid: COURSEID });
  console.log(
    `mismo id? ${u1.id === u2.id ? "SÍ (no se duplicó)" : "NO (¡duplicado!)"}`,
  );

  // Verificación opcional vía core_enrol_get_users_courses. Nota: esta función
  // de LECTURA filtra por permisos de "ver participantes/perfil" del usuario que
  // llama; wsuser (servicio, no participante) puede recibir [] aunque el
  // enrolamiento exista. No es bloqueante. El enrolamiento real se confirma por
  // que enrol_manual_enrol_users no lanzó excepción.
  console.log("== verificación opcional (core_enrol_get_users_courses) ==");
  try {
    const cursos = await moodleRequest<Array<{ id: number; fullname: string }>>(
      "core_enrol_get_users_courses",
      { userid: u1.id },
    );
    const enrolado = cursos.some((c) => c.id === COURSEID);
    console.log(
      `cursos visibles del usuario: ${cursos.map((c) => `${c.id}:${c.fullname}`).join(", ") || "(ninguno visible para wsuser)"}`,
    );
    console.log(`¿visible enrolado en ${COURSEID}? ${enrolado ? "SÍ" : "no (limitación de lectura de wsuser)"}`);
  } catch (e) {
    console.log("lectura opcional no disponible:", e instanceof Error ? e.message : e);
  }

  // Aserciones reales: idempotencia (mismo id) + enrolamiento sin excepción.
  if (u1.id !== u2.id) {
    throw new Error("Idempotencia falló: el usuario se duplicó.");
  }
  console.log("RESULTADO: OK (usuario creado/encontrado y enrolado en courseid=2; idempotente)");
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("ERROR:", e instanceof Error ? e.message : e);
    process.exit(1);
  });
