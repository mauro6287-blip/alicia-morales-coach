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

require_once(__DIR__ . '/lib/setup.php');
PHP

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
# 6. Arrancar Apache en primer plano
# ---------------------------------------------------------------------------
echo "==> Diagnóstico MPM (runtime):"
echo "    symlinks mods-enabled:"; ls -1 /etc/apache2/mods-enabled/ | grep -i mpm || echo "      (ninguno)"
echo "    LoadModule mpm en configs:"; grep -rEn "LoadModule mpm" /etc/apache2/ 2>/dev/null || echo "      (ninguno)"

echo "==> Arrancando Apache."
exec apache2-foreground
