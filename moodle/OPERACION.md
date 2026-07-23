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
- `MOODLE_SMTP_PORT` (opcional, def. **`465`**), `MOODLE_SMTP_SECURE` (opcional, def. **`ssl`**)
- `MOODLE_NOREPLY_ADDRESS=` → **remitente; DEBE ser de un dominio verificado en Resend**

> **⚠️ Puerto: usar 465 + ssl, NO 587 + tls.** En Railway, el handshake STARTTLS en 587 falla ("no se pudo comunicar con el servidor de correo"); el SSL implícito en 465 funciona. Ambos puertos están abiertos (verificado), pero PHPMailer solo completó el intercambio por 465/ssl. Valores actuales del servicio: `MOODLE_SMTP_PORT=465`, `MOODLE_SMTP_SECURE=ssl`.

`config.php` resultante: `$CFG->smtphosts='smtp.resend.com:465'`, `$CFG->smtpsecure='ssl'`, `$CFG->smtpuser='resend'`, `$CFG->smtppass=<API key>`, `$CFG->smtpmaxbulk=1`, `$CFG->noreplyaddress`.

> **Estado al cierre del Commit 3:** SMTP **verificado funcionando** (Test outgoing mail → "Moodle envió con éxito el mensaje de prueba", auth `235 Authentication successful`). PERO Resend está en modo sandbox: NO hay dominio verificado, así que `onboarding@resend.dev` **solo entrega al email dueño de la cuenta Resend = `coaching@aliciamorales.cl`**. Enviar a cualquier otra dirección devuelve `550` (probado con mauro6287@gmail.com). **Antes del Commit 7** (correos a alumnos) hay que **verificar un dominio/subdominio en Resend** (DKIM/SPF en Hostinger) y fijar `MOODLE_NOREPLY_ADDRESS=noreply@<dominio-verificado>`.
>
> Nota Railway: SMTP saliente requiere plan **Pro** (este proyecto lo es). Tras cambios de plan, re-desplegar.

**Verificar:** *Site administration → Server → Email → Test outgoing mail configuration* (destinatario `coaching@aliciamorales.cl` mientras siga el sandbox).

---

## Curso piloto

- Nombre: **"Liderazgo – Piloto"** (shortname `liderazgo-piloto`), categoría por defecto.
- Creado de forma idempotente por `moodle/cli/create_pilot_course.php` (ejecutado desde el entrypoint; imprime `PILOT_COURSE_ID=<n>` en los logs).
- **`courseid` = `2`** (verificado en logs: `[pilot] PILOT_COURSE_ID=2`) — necesario para los Commits 6 y 7.

---

## Web Services REST (Commit 4)

Configurado de forma idempotente por `moodle/cli/setup_webservices.php` (en la
imagen en `/var/www/html/cli_custom/`; se ejecuta **manualmente** por SSH, NO
desde el entrypoint, para que el token no quede en logs). Re-ejecutable.

- **Web services**: habilitados; protocolo **REST** activo.
- **Rol de servicio**: `ws_nextjs` (arquetipo `manager`, asignable en contexto sistema) con capacidades:
  `webservice/rest:use`, `moodle/user:create`, `moodle/user:update`, `moodle/user:viewalldetails`, `enrol/manual:enrol`, `moodle/course:view`.
- **Usuario de servicio**: `wsuser` (auth manual, confinado), con el rol `ws_nextjs` a nivel sistema.
- **External Service**: `nextjs-integration` (enabled, restricted users) con EXACTAMENTE estas funciones:
  - `core_user_create_users`
  - `core_user_get_users_by_field`
  - `enrol_manual_enrol_users`
  - `core_enrol_get_users_courses`
- **Token**: generado para `wsuser` en el servicio. **NO se documenta aquí (secreto).** Vive en la variable `MOODLE_WS_TOKEN` del **servicio Next.js** de Railway (también `MOODLE_WS_URL` y `MOODLE_DEFAULT_ROLE_ID=5`).
- **Re-generar token** (si se compromete): borrar el token de `wsuser` en *Site admin → Server → Web services → Manage tokens*, re-ejecutar el script por SSH y actualizar `MOODLE_WS_TOKEN`.
- **Verificación**: `core_user_get_users_by_field` con el token devuelve JSON válido (array), no `webservice_access_exception`/`invalidtoken`.

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

---

## Chat de empleabilidad en el Dashboard (`block_exaaichat`)

Plan para activar `block_exaaichat` en el Área personal (Dashboard) de
producción, con documentos propios de empleabilidad (entrevistas, CV,
LinkedIn), sin exponerlo a invitados/portada. Escrito tras probar en
`moodle-staging` (2026-07-23) y encontrar **dos riesgos reales** que este plan
resuelve explícitamente antes de tocar producción.

### Riesgos encontrados en staging (por qué el plan tiene este orden)

1. **Orden de subida de documentos.** Un usuario que visita su Área personal
   ANTES de que los documentos terminen de subirse recibe una copia personal
   del bloque **congelada sin documentos para siempre** (Moodle clona el
   bloque a cada usuario en su primera visita, copiando la configuración tal
   cual está en ese momento; no vuelve a sincronizar después). Probado con dos
   usuarios de prueba: el que visitó antes recibió respuestas genéricas: el
   que visitó después, respuestas basadas en los documentos reales.
2. **Usuarios que ya personalizaron su Área personal antes de hoy.** Moodle
   solo clona los bloques del Dashboard por defecto **la primera vez** que
   cada usuario lo visita. Si alguien (staff, profesores) ya tocó su Área
   personal alguna vez en el pasado, su copia personal ya existe **sin** el
   chat, y Moodle no se la va a agregar automáticamente nunca. Confirmado con
   la propia cuenta admin de staging.

### Precondición

Tener listos los documentos reales de empleabilidad. Formatos aceptados por
el bloque: `.md .txt .csv .html .pdf .docx .pptx .json`. Máximo 50 archivos,
sin límite de tamaño declarado.

### Fase B1 — Preparar sin exponer a nadie (reversible, cero usuarios afectados)

Con `allow_on_dashboard` en `0`, el bloque queda invisible en **cualquier**
Área personal (la del sitio y cualquier copia ya clonada), aunque la
instancia ya exista en el Dashboard por defecto — es un interruptor global,
no por usuario. Esto permite preparar todo sin que nadie vea nada a medias.

1. Confirmar en *Site administration → Extensiones → Bloques → Exabis AI Chat
   Block*: `api_type=responses`, `model=gpt-4o-mini`, `apikey` ya cargada
   (viene del hito RAG anterior), `enablefileupload=1`.
2. Confirmar explícitamente: `allow_on_dashboard=0`, `allowguests=0`,
   `aiplacement_showonfrontpage=0`.
3. Agregar el bloque al Dashboard por defecto: *Site administration →
   Apariencia → Área personal predeterminada* → Modo de edición → Agregar un
   bloque → Exabis AI Chat Block. (Con `allow_on_dashboard=0` sigue invisible
   para todos — este paso solo crea la instancia.)
4. Subir los documentos reales: en esa misma página, ícono de engranaje del
   bloque → Configurar bloque → sección "Documents for the AI" → arrastrar
   los archivos → Guardar cambios.
5. **Esperar y verificar que terminen de procesarse** antes de seguir (pueden
   quedar "in_progress" un rato, sobre todo si hay algún incidente de OpenAI
   en curso — revisar `https://status.openai.com` si tarda de más).
   Verificación simple: como admin, abrir el chat en esa misma página y
   preguntar algo cuya respuesta esté en los documentos reales; si responde
   con contenido específico (no una respuesta genérica), están listos.

**No avanzar a la Fase B3 hasta confirmar el paso 5.**

### Fase B2 — Decisión pendiente de Mauro (usuarios con Dashboard ya personalizado)

Este es el punto donde la tarea original pide detenerse y preguntar antes de
tocar los Dashboards de otros usuarios. Opciones:

| Opción | Qué hace | Impacto | Recomendación |
|---|---|---|---|
| **A. No resetear nada** | Los usuarios nuevos (que nunca visitaron su Área personal) reciben el chat automáticamente. A los que ya la personalizaron, se les avisa que pueden agregarlo ellos mismos: Área personal → Modo de edición → Agregar un bloque → Exabis AI Chat Block. | Cero riesgo, cero usuarios afectados sin su consentimiento. Requiere comunicar la opción manual. | **Recomendada** para el lanzamiento inicial. |
| **B. Resetear el Área personal de TODOS los usuarios** (botón "Restablecer Área personal para todos los usuarios") | Cualquier bloque que alguien haya movido, agregado, quitado u ocultado en su Dashboard vuelve al estado por defecto (con el chat incluido). | Alto: se pierde la personalización de cualquiera que la haya tocado, no solo la relacionada al chat. Conviene avisar antes. | Solo si hay pocos usuarios y Mauro confirma que ninguno tiene una personalización que le importe conservar. |
| **C. Resetear cuentas puntuales** (vía script dirigido, solo las cuentas que Mauro indique) | Igual que B pero acotado a una lista de usuarios específicos (ej. solo staff). | Bajo, pero requiere que Mauro identifique a quién. | Alternativa si B2-A no alcanza para alguien en particular (ej. la propia Alicia). |

**No ejecutar B ni C sin que Mauro lo confirme explícitamente aquí, y solo
después de que la Fase B1 esté 100% verificada** (si se resetea antes de
tener los documentos listos, se vuelve a crear el mismo problema del riesgo
1, ahora a escala de todo el sitio).

### Fase B3 — Activar (solo cuando B1 esté verificado y B2 decidido)

6. Cambiar `allow_on_dashboard=1`.
7. Verificar con una cuenta de prueba que **nunca haya visitado su Área
   personal antes** (o una cuenta nueva creada para la prueba): el chat debe
   aparecer y responder con contenido de los documentos reales.
8. Si se eligió la opción B o C de la Fase B2, ejecutarla recién ahora.
9. Confirmar que `allowguests=0` y `aiplacement_showonfrontpage=0` siguen
   desactivados, y que un visitante sin sesión iniciada no puede acceder
   (tanto la página como `blocks/exaaichat/api/completion.php` deben
   redirigir a login).

### Verificación post-lanzamiento

- `https://cursos.aliciamoralescoach.com` responde con normalidad.
- Un usuario nuevo ve el chat en su Área personal y obtiene respuestas
  basadas en los documentos, no genéricas.
- Guests y portada pública siguen sin acceso.
- `local_flujos` y su rama de trabajo no se ven afectados (son componentes
  independientes).

### Rollback

Volver `allow_on_dashboard` a `0` revierte la visibilidad del chat para
**todos** de forma inmediata y sin pérdida de datos (no borra la instancia,
los documentos ni el vector store — solo lo oculta). Es la forma más segura
de pausar el lanzamiento si algo sale mal después de la Fase B3.
