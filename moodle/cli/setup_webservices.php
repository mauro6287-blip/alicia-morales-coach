<?php
// Configuración idempotente de Web Services REST de Moodle para la integración
// con Next.js (Hito 1, Commit 4). Re-ejecutable sin duplicar ni romper nada.
//
// Habilita web services + REST, crea un rol de servicio (arquetipo manager) con
// las capacidades necesarias, crea el usuario 'wsuser' con ese rol a nivel
// sistema, crea el External Service 'nextjs-integration' con exactamente 4
// funciones y autoriza a 'wsuser', y genera (o reutiliza) el token.
//
// SEGURIDAD: el token es un secreto. Este script imprime el token SOLO en STDOUT
// con el prefijo "WSTOKEN:". Todos los mensajes de estado van a STDERR. NO debe
// ejecutarse desde el entrypoint (el token no debe quedar en los logs); se corre
// manualmente por CLI/SSH y se captura su stdout.

define('CLI_SCRIPT', true);

require(__DIR__ . '/../config.php');
require_once($CFG->libdir . '/externallib.php');
require_once($CFG->dirroot . '/user/lib.php');
require_once($CFG->dirroot . '/webservice/lib.php');

global $DB, $CFG;

function note($m) { fwrite(STDERR, '[setup-ws] ' . $m . "\n"); }

// Ejecutar como administrador (para operaciones de capacidades/roles).
\core\session\manager::set_user(get_admin());

$systemcontext = context_system::instance();

// ---------------------------------------------------------------------------
// 1. Habilitar web services + protocolo REST
// ---------------------------------------------------------------------------
if (empty($CFG->enablewebservices)) {
    set_config('enablewebservices', 1);
    note('enablewebservices = 1 (activado)');
} else {
    note('enablewebservices ya estaba activo');
}

$protocols = empty($CFG->webserviceprotocols) ? array() : explode(',', $CFG->webserviceprotocols);
if (!in_array('rest', $protocols, true)) {
    $protocols[] = 'rest';
    set_config('webserviceprotocols', implode(',', array_filter($protocols)));
    note('protocolo REST activado');
} else {
    note('protocolo REST ya estaba activo');
}

// ---------------------------------------------------------------------------
// 2. Rol de servicio (arquetipo manager) asignable en contexto sistema
// ---------------------------------------------------------------------------
$roleshortname = 'ws_nextjs';
$role = $DB->get_record('role', array('shortname' => $roleshortname));
if (!$role) {
    $roleid = create_role('WS NextJS Integration', $roleshortname,
        'Rol de servicio para la integración Next.js vía Web Services.', 'manager');
    note("rol '$roleshortname' creado (id=$roleid)");
} else {
    $roleid = $role->id;
    note("rol '$roleshortname' ya existía (id=$roleid)");
}

$levels = get_role_contextlevels($roleid);
if (!in_array(CONTEXT_SYSTEM, $levels)) {
    $levels[] = CONTEXT_SYSTEM;
    set_role_contextlevels($roleid, $levels);
    note('rol asignable en contexto sistema');
}

$caps = array(
    'webservice/rest:use',
    'moodle/user:create',
    'moodle/user:update',
    'moodle/user:viewalldetails',
    'enrol/manual:enrol',
    'moodle/course:view',
);
foreach ($caps as $cap) {
    assign_capability($cap, CAP_ALLOW, $roleid, $systemcontext->id, true);
}
note('capacidades asignadas: ' . implode(', ', $caps));
$systemcontext->mark_dirty();

// ---------------------------------------------------------------------------
// 3. Usuario de servicio 'wsuser' + rol a nivel sistema
// ---------------------------------------------------------------------------
$username = 'wsuser';
$wsuser = $DB->get_record('user', array('username' => $username, 'mnethostid' => $CFG->mnet_localhost_id));
if (!$wsuser) {
    $new = new stdClass();
    $new->auth = 'manual';
    $new->username = $username;
    $new->password = bin2hex(random_bytes(20)) . 'Aa1!';   // aleatoria; nunca se usa (auth por token)
    $new->firstname = 'WS';
    $new->lastname = 'Integration';
    $new->email = 'wsuser@cursos.aliciamoralescoach.com';
    $new->confirmed = 1;
    $new->mnethostid = $CFG->mnet_localhost_id;
    $new->lang = 'es';
    $newid = user_create_user($new, true, false);
    $wsuser = $DB->get_record('user', array('id' => $newid));
    note("usuario '$username' creado (id={$wsuser->id})");
} else {
    note("usuario '$username' ya existía (id={$wsuser->id})");
}

if (!user_has_role_assignment($wsuser->id, $roleid, $systemcontext->id)) {
    role_assign($roleid, $wsuser->id, $systemcontext->id);
    note("rol '$roleshortname' asignado a '$username' en contexto sistema");
} else {
    note("'$username' ya tenía el rol en contexto sistema");
}

// ---------------------------------------------------------------------------
// 4. External Service 'nextjs-integration' + funciones + autorización
// ---------------------------------------------------------------------------
$servicename = 'nextjs-integration';
$service = $DB->get_record('external_services', array('name' => $servicename));
if (!$service) {
    $s = new stdClass();
    $s->name = $servicename;
    $s->shortname = 'nextjs_integration';
    $s->enabled = 1;
    $s->restrictedusers = 1;
    $s->downloadfiles = 0;
    $s->uploadfiles = 0;
    $s->timecreated = time();
    $s->timemodified = time();
    $serviceid = $DB->insert_record('external_services', $s);
    note("external service '$servicename' creado (id=$serviceid)");
} else {
    $serviceid = $service->id;
    $changed = false;
    if (empty($service->enabled)) { $service->enabled = 1; $changed = true; }
    if (empty($service->restrictedusers)) { $service->restrictedusers = 1; $changed = true; }
    if ($changed) { $service->timemodified = time(); $DB->update_record('external_services', $service); }
    note("external service '$servicename' ya existía (id=$serviceid)" . ($changed ? ' (actualizado)' : ''));
}

$functions = array(
    'core_user_create_users',
    'core_user_get_users_by_field',
    'enrol_manual_enrol_users',
    'core_enrol_get_users_courses',
);
foreach ($functions as $fname) {
    if (!$DB->record_exists('external_services_functions', array('externalserviceid' => $serviceid, 'functionname' => $fname))) {
        $f = new stdClass();
        $f->externalserviceid = $serviceid;
        $f->functionname = $fname;
        $DB->insert_record('external_services_functions', $f);
        note("función agregada: $fname");
    } else {
        note("función ya presente: $fname");
    }
}

if (!$DB->record_exists('external_services_users', array('externalserviceid' => $serviceid, 'userid' => $wsuser->id))) {
    $su = new stdClass();
    $su->externalserviceid = $serviceid;
    $su->userid = $wsuser->id;
    $su->timecreated = time();
    $DB->insert_record('external_services_users', $su);
    note("'$username' autorizado en el servicio");
} else {
    note("'$username' ya estaba autorizado en el servicio");
}

// ---------------------------------------------------------------------------
// 5. Token (generar o reutilizar)
// ---------------------------------------------------------------------------
$existing = $DB->get_record('external_tokens', array(
    'externalserviceid' => $serviceid,
    'userid'            => $wsuser->id,
    'tokentype'         => EXTERNAL_TOKEN_PERMANENT,
));
if ($existing) {
    $token = $existing->token;
    note('token ya existía; se reutiliza');
} else {
    $token = external_generate_token(EXTERNAL_TOKEN_PERMANENT, $serviceid, $wsuser->id, $systemcontext);
    note('token generado');
}

// Token SOLO a stdout (captura programática). NUNCA a logs/chat.
fwrite(STDOUT, 'WSTOKEN:' . $token . "\n");
note('listo.');
