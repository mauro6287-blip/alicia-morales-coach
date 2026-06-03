#!/usr/bin/env bash
# Entrypoint de la imagen Moodle:
#   1. Espera a que la base de datos MariaDB esté lista.
#   2. Genera config.php desde las variables de entorno (idempotente).
#   3. Instala Moodle por CLI si la BD aún no tiene el esquema.
#   4. Ajusta permisos de moodledata y arranca Apache en primer plano.
set -euo pipefail

MOODLE_DIR="/var/www/html"
MOODLE_DATA="/var/www/moodledata"
DB_PORT="${MOODLE_DB_PORT:-3306}"

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
require_env() {
  local name="$1"
  if [ -z "${!name:-}" ]; then
    echo "ERROR: falta la variable de entorno requerida: ${name}" >&2
    exit 1
  fi
}

# Escapa un valor para incrustarlo dentro de una cadena PHP entre comillas simples.
php_squote() {
  local s="$1"
  s="${s//\\/\\\\}"   # \  -> \\
  s="${s//\'/\\\'}"   # '  -> \'
  printf "%s" "$s"
}

# ---------------------------------------------------------------------------
# 1. Validación de variables obligatorias
# ---------------------------------------------------------------------------
require_env MOODLE_DB_HOST
require_env MOODLE_DB_NAME
require_env MOODLE_DB_USER
require_env MOODLE_DB_PASSWORD
require_env MOODLE_SITE_URL
require_env MOODLE_ADMIN_USER
require_env MOODLE_ADMIN_PASSWORD
require_env MOODLE_ADMIN_EMAIL

# ---------------------------------------------------------------------------
# 2. Esperar a la base de datos
# ---------------------------------------------------------------------------
echo "==> Esperando a MariaDB en ${MOODLE_DB_HOST}:${DB_PORT} ..."
ATTEMPTS=0
until php -r '
    $c = @mysqli_connect(getenv("MOODLE_DB_HOST"), getenv("MOODLE_DB_USER"),
                         getenv("MOODLE_DB_PASSWORD"), "", (int)getenv("DB_PORT"));
    exit($c ? 0 : 1);
' 2>/dev/null; do
  ATTEMPTS=$((ATTEMPTS + 1))
  if [ "$ATTEMPTS" -ge 60 ]; then
    echo "ERROR: la base de datos no respondió tras 60 intentos." >&2
    exit 1
  fi
  sleep 2
done
echo "==> MariaDB disponible."

# ---------------------------------------------------------------------------
# 3. Generar config.php desde las variables de entorno
# ---------------------------------------------------------------------------
echo "==> Generando ${MOODLE_DIR}/config.php"

SSLPROXY_LINE=""
if [ "${MOODLE_SSLPROXY:-}" = "yes" ]; then
  SSLPROXY_LINE='$CFG->sslproxy = true;'
fi

# --- SMTP saliente (Resend) — inyectado desde variables de entorno ---
# Reproducible (infra-as-code): si MOODLE_SMTP_HOST está definido, se fuerzan los
# ajustes SMTP en config.php. El remitente (noreplyaddress) solo se fija si se
# define MOODLE_NOREPLY_ADDRESS (debe ser de un dominio verificado en Resend).
SMTP_BLOCK=""
if [ -n "${MOODLE_SMTP_HOST:-}" ]; then
  _smtp_port="${MOODLE_SMTP_PORT:-587}"
  _smtp_secure="${MOODLE_SMTP_SECURE:-tls}"
  SMTP_BLOCK=$(printf "\$CFG->smtphosts  = '%s';\n\$CFG->smtpsecure = '%s';\n\$CFG->smtpuser   = '%s';\n\$CFG->smtppass   = '%s';\n\$CFG->smtpmaxbulk = 1;" \
    "$(php_squote "${MOODLE_SMTP_HOST}:${_smtp_port}")" \
    "$(php_squote "${_smtp_secure}")" \
    "$(php_squote "${MOODLE_SMTP_USER:-}")" \
    "$(php_squote "${MOODLE_SMTP_PASSWORD:-}")")
  if [ -n "${MOODLE_NOREPLY_ADDRESS:-}" ]; then
    SMTP_BLOCK="${SMTP_BLOCK}
$(printf "\$CFG->noreplyaddress = '%s';" "$(php_squote "${MOODLE_NOREPLY_ADDRESS}")")"
  fi
fi

write_config() {
  local smtp_arg="$1"
  cat > "${MOODLE_DIR}/config.php" <<PHP
<?php  // Generado automáticamente por entrypoint.sh — NO editar a mano.
unset(\$CFG);
global \$CFG;
\$CFG = new stdClass();

\$CFG->dbtype    = 'mariadb';
\$CFG->dblibrary = 'native';
\$CFG->dbhost    = '$(php_squote "${MOODLE_DB_HOST}")';
\$CFG->dbname    = '$(php_squote "${MOODLE_DB_NAME}")';
\$CFG->dbuser    = '$(php_squote "${MOODLE_DB_USER}")';
\$CFG->dbpass    = '$(php_squote "${MOODLE_DB_PASSWORD}")';
\$CFG->prefix    = 'mdl_';
\$CFG->dboptions = array(
    'dbpersist' => 0,
    'dbport'    => '$(php_squote "${DB_PORT}")',
    'dbsocket'  => '',
    'dbcollation' => 'utf8mb4_unicode_ci',
);

\$CFG->wwwroot   = '$(php_squote "${MOODLE_SITE_URL}")';
\$CFG->dataroot  = '${MOODLE_DATA}';
\$CFG->admin     = 'admin';
\$CFG->directorypermissions = 02777;

// Router de Moodle 5.x (Apache: FallbackResource /r.php + DirectoryIndex index.php).
\$CFG->routerconfigured = true;

${SSLPROXY_LINE}

${smtp_arg}

require_once(__DIR__ . '/lib/setup.php');
PHP
}

write_config "${SMTP_BLOCK}"
# Red de seguridad: si el bloque SMTP rompiera la sintaxis de config.php, se
# regenera SIN SMTP para que Moodle siga levantando (no romper el sitio por SMTP).
if [ -n "${SMTP_BLOCK}" ] && ! php -l "${MOODLE_DIR}/config.php" >/dev/null 2>&1; then
  echo "ADVERTENCIA: config.php quedó inválido con el bloque SMTP; regenerando SIN SMTP." >&2
  write_config ""
fi

chown www-data:www-data "${MOODLE_DIR}/config.php"

# ---------------------------------------------------------------------------
# 4. Permisos de moodledata (el volumen puede montarse vacío / como root)
# ---------------------------------------------------------------------------
mkdir -p "${MOODLE_DATA}"
chown -R www-data:www-data "${MOODLE_DATA}"

# ---------------------------------------------------------------------------
# 5. Instalar Moodle si el esquema no existe todavía
# ---------------------------------------------------------------------------
SCHEMA_EXISTS="$(php -r '
    $c = @mysqli_connect(getenv("MOODLE_DB_HOST"), getenv("MOODLE_DB_USER"),
                         getenv("MOODLE_DB_PASSWORD"), getenv("MOODLE_DB_NAME"), (int)getenv("DB_PORT"));
    if (!$c) { echo "no"; exit; }
    $r = @mysqli_query($c, "SHOW TABLES LIKE \"mdl_config\"");
    echo ($r && mysqli_num_rows($r) > 0) ? "yes" : "no";
' 2>/dev/null || echo "no")"

if [ "${SCHEMA_EXISTS}" = "yes" ]; then
  echo "==> Moodle ya está instalado (tabla mdl_config presente). Se omite la instalación."
else
  echo "==> Instalando Moodle por CLI ..."
  sudo_user="www-data"
  if php "${MOODLE_DIR}/admin/cli/install_database.php" \
        --lang=es \
        --adminuser="${MOODLE_ADMIN_USER}" \
        --adminpass="${MOODLE_ADMIN_PASSWORD}" \
        --adminemail="${MOODLE_ADMIN_EMAIL}" \
        --fullname="${MOODLE_SITE_FULLNAME:-Escuela de Competencias Aplicadas}" \
        --shortname="${MOODLE_SITE_SHORTNAME:-ECA}" \
        --summary="${MOODLE_SITE_SUMMARY:-Plataforma de capacitación}" \
        --agree-license; then
    echo "==> Instalación de Moodle completada."
    chown -R www-data:www-data "${MOODLE_DATA}"
  else
    echo "ERROR: falló la instalación de Moodle." >&2
    exit 1
  fi
fi

# ---------------------------------------------------------------------------
# 5b. Curso piloto "Liderazgo – Piloto" (idempotente). Imprime PILOT_COURSE_ID.
# ---------------------------------------------------------------------------
if [ -f "${MOODLE_DIR}/cli_custom/create_pilot_course.php" ]; then
  echo "==> Curso piloto (idempotente):"
  runuser -u www-data -- /usr/local/bin/php "${MOODLE_DIR}/cli_custom/create_pilot_course.php" 2>&1 \
    | sed 's/^/[pilot] /' || echo "[pilot] no se pudo crear/verificar el curso piloto"
fi

# ---------------------------------------------------------------------------
# 5c. Cron de Moodle: crond (cada minuto) + una corrida al boot para verificar.
# El cron vive DENTRO del contenedor Moodle (misma BD + mismo moodledata); un
# servicio cron aparte no es viable porque el volumen moodledata solo puede
# montarse en un servicio. Sobrevive a redeploys (se configura en cada arranque).
# ---------------------------------------------------------------------------
CRON_LOG="${MOODLE_DATA}/cron.log"
cat > /etc/cron.d/moodle <<CRON
# Moodle cron cada minuto, como www-data.
* * * * * www-data /usr/local/bin/php ${MOODLE_DIR}/admin/cli/cron.php >> ${CRON_LOG} 2>&1
CRON
chmod 0644 /etc/cron.d/moodle
cron || service cron start || echo "ADVERTENCIA: no se pudo iniciar crond"
echo "==> crond iniciado (Moodle cron cada minuto; log en ${CRON_LOG})."
# Nota: el cron periódico escribe en ${CRON_LOG} (no en stdout) para no inundar
# los logs del contenedor. Verificación: ver ese archivo o Site admin → Tasks.

# ---------------------------------------------------------------------------
# 6. Garantizar un ÚNICO MPM en RUNTIME (prefork, requerido por mod_php).
# El base image en Railway trae mpm_event habilitado además de prefork, lo que
# rompe Apache con "More than one MPM loaded". Forzarlo en el arranque cubre
# cualquier estado de la imagen.
# ---------------------------------------------------------------------------
a2dismod mpm_event mpm_worker >/dev/null 2>&1 || true
a2enmod mpm_prefork >/dev/null 2>&1 || true
echo "==> MPM activos: $(ls -1 /etc/apache2/mods-enabled/ | grep -i mpm | tr '\n' ' ')"

# ---------------------------------------------------------------------------
# 7. Arrancar Apache en primer plano
# ---------------------------------------------------------------------------
echo "==> Arrancando Apache."
exec apache2-foreground
