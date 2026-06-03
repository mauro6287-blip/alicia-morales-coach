# Operación — Moodle (Escuela de Competencias Aplicadas)

Servicio LMS en Railway (proyecto **Alicia Morales Coach**, entorno `production`).
Sitio: `https://cursos.aliciamoralescoach.com`.

Arquitectura:
- Servicio **`moodle`**: imagen propia (`moodle/Dockerfile`, Moodle 5.2 sobre `php:8.3-apache`). Deploy por push a `main` (root dir `/moodle`, watch `moodle/**`).
- Servicio **`mariadb`**: imagen propia (`mariadb/Dockerfile`, MariaDB 11.4 con `bind-address=*` para la red privada IPv6 de Railway). Root dir `/mariadb`, watch `mariadb/**`.
- Volúmenes persistentes: `mariadb-volume` → `/var/lib/mysql`; `moodle-volume` → `/var/www/moodledata`.
- DNS en **Hostinger** (NS `ns1/ns2.dns-parking.com`): CNAME `cursos` → `yaryu2qz.up.railway.app` + TXT `_railway-verify.cursos`.

---

## Cron de Moodle

**Mecanismo elegido: `crond` DENTRO del contenedor Moodle** (Opción B del plan), configurado desde `entrypoint.sh` en cada arranque.

**Por qué no un servicio cron aparte (Opción A):** Moodle cron necesita el mismo `moodledata` (caché MUC, locks, temp, trashdir) además de la misma BD. En Railway **un volumen solo puede montarse en un servicio**, así que un servicio cron separado no podría compartir `moodle-volume`. El cron in-container garantiza mismo `dataroot` + misma BD y es lo más fiable aquí.

**Detalles:**
- `/etc/cron.d/moodle`: `* * * * * www-data php /var/www/html/admin/cli/cron.php` (cada minuto), log en `/var/www/moodledata/cron.log`.
- `crond` se inicia en `entrypoint.sh` → **sobrevive a cada redeploy** (se reconfigura en cada arranque).
- Además, el entrypoint ejecuta `cron.php` una vez al boot (en segundo plano) con salida a los logs del contenedor (líneas `[cron-boot] ...`) para verificación.

**Verificar:**
- Logs del servicio: `railway logs --service moodle` → buscar `[cron-boot]` (corrida de arranque) y, tras ~1 min, las corridas periódicas en `moodledata/cron.log`.
- UI: *Site administration → Server → Tasks → Scheduled tasks* — las tareas deben avanzar sin `faildelay` creciente.

---

## SMTP saliente (Resend)

Configurado de forma reproducible: `entrypoint.sh` inyecta en `config.php` los ajustes SMTP desde variables de entorno del servicio `moodle` (persisten tras redeploy, no se tocan por la UI).

Variables (servicio `moodle` en Railway):
- `MOODLE_SMTP_HOST=smtp.resend.com`
- `MOODLE_SMTP_USER=resend`
- `MOODLE_SMTP_PASSWORD=` → la API key de Resend (referencia `${{alicia-morales-coach.RESEND_API_KEY}}`)
- `MOODLE_SMTP_PORT` (opcional, def. `587`), `MOODLE_SMTP_SECURE` (opcional, def. `tls`)
- `MOODLE_NOREPLY_ADDRESS=` → **remitente; DEBE ser de un dominio verificado en Resend**

`config.php` resultante: `$CFG->smtphosts='smtp.resend.com:587'`, `$CFG->smtpsecure='tls'`, `$CFG->smtpuser`, `$CFG->smtppass`, `$CFG->smtpmaxbulk=1`, `$CFG->noreplyaddress`.

> **Estado al cierre del Commit 3:** Resend NO tiene aún ningún dominio verificado (solo el sandbox `onboarding@resend.dev`, que solo entrega al email dueño de la cuenta). Para enviar a alumnos hace falta verificar un dominio/subdominio en Resend (registros DKIM/SPF en Hostinger) y fijar `MOODLE_NOREPLY_ADDRESS=noreply@<dominio-verificado>`.

**Verificar:** *Site administration → Server → Email → Test outgoing mail configuration*.

---

## Curso piloto

- Nombre: **"Liderazgo – Piloto"** (shortname `liderazgo-piloto`), categoría por defecto.
- Creado de forma idempotente por `moodle/cli/create_pilot_course.php` (ejecutado desde el entrypoint; imprime `PILOT_COURSE_ID=<n>` en los logs).
- **`courseid` = _(pendiente: leer de los logs `[pilot] PILOT_COURSE_ID=...` tras el primer deploy con este cambio)_** — necesario para los Commits 6 y 7.

---

## Backups (definir frecuencia y automatizar más adelante)

- **MariaDB**: respaldo lógico periódico, p. ej. `mysqldump` del esquema `moodle` (o snapshot del volumen `mariadb-volume`). Frecuencia sugerida: diaria.
- **moodledata** (`moodle-volume`): respaldo del directorio (archivos subidos, backups de curso). Frecuencia sugerida: diaria.
- Conservar al menos 7 días. (Aún NO automatizado en el Hito 1.)

## Upgrades de Moodle

1. Cambiar `ARG MOODLE_BRANCH` en `moodle/Dockerfile` a la nueva rama estable.
2. **Backup** de MariaDB + `moodledata` antes de nada.
3. Push a `main` → rebuild + redeploy del servicio `moodle`. El entrypoint corre el upgrade del esquema automáticamente al arrancar (Moodle detecta versión nueva).
4. Verificar en logs y en *Site administration*. Planificar migración a **5.3 LTS** cuando salga.

## Comprobaciones tras cada redeploy

- `crond` activo y `cron.php` corriendo (ver logs / Tasks).
- HTTPS OK en `https://cursos.aliciamoralescoach.com`.
- Persistencia: datos de MariaDB y `moodledata` intactos.
