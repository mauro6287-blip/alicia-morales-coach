# PLAN_FLUJOS.md — Motor de Flujos Conversacionales Guiados (Moodle)

Plan por commits, con criterios de aceptación verificables, para construir un
**motor de flujos guiados** como plugin a medida de Moodle 5.2: experiencias por
etapas (ej. diagnóstico → simulación → cierre) donde la IA conversa y evalúa en
cada etapa, se capturan datos estructurados con consentimiento, y al final se
entrega un resultado (informe / plan de acción).

Casos de uso previstos:

1. Diagnóstico de competencias transversales (Método CARA: Consciencia, Acción,
   Resultados, Acompañamiento).
2. Simulación de entrevista / tránsito laboral (outplacement).
3. Otros flujos que Alicia defina más adelante.

**Requisito rector:** Alicia (no técnica) debe poder crear y editar flujos ella
misma desde un panel de administración, sin programar. No es un flujo
hardcodeado: es un **motor configurable**.

**Regla operativa de todo el plan:** el desarrollo y las pruebas de los commits
1-9 ocurren **exclusivamente en el environment `moodle-staging`** de Railway.
`production` no se toca hasta el Commit 10, y `block_exaaichat` no se modifica
en ningún ambiente.

---

## 1. Decisiones de arquitectura

### 1.1 Tipo de plugin: `local_` (recomendado) con posible bloque satélite futuro

| Opción | A favor | En contra |
|---|---|---|
| `local_` plugin | Páginas propias accesibles desde cualquier punto del sitio (portada, dashboard, URL directa) sin depender de un curso; panel de administración global natural (admin settings + páginas propias); un solo lugar para datos y permisos | No aparece "dentro" de un curso de forma nativa (se soluciona enlazando o con un bloque satélite) |
| `mod_` activity | Integración nativa en cursos (calificaciones, finalización de actividad) | Un flujo quedaría **atado a un curso**: no sirve para diagnósticos abiertos desde la portada/dashboard, que es el caso de uso principal; el constructor de flujos quedaría duplicado por instancia; mucho más código (grades, backup/restore, cm_info) |
| Ambos desde el inicio | Cubre todo | Doble superficie de mantenimiento antes de validar el producto |

**Recomendación: `local_` plugin único**, nombre frankenstyle **`local_flujos`**
(directorio `public/local/flujos`). Motivos:

- El acceso requerido es **fuera de los cursos** (dashboard/portada): eso es
  exactamente lo que un `local_` plugin resuelve y un `mod_` no.
- El motor, el constructor y los datos viven en un solo componente. Si más
  adelante se necesita lanzar un flujo *desde dentro* de un curso, se agrega un
  **bloque satélite mínimo** (`block_flujos`, ~1 archivo de contenido) que solo
  enlaza a los flujos del motor — sin duplicar datos ni lógica. Esa extensión
  queda fuera de estos 10 commits.
- Convención de nombres Moodle: minúsculas, sin guiones, prefijo del tipo
  (`local_`) + nombre corto. `flujos` es descriptivo para este proyecto a
  medida y no colisiona con plugins publicados.

### 1.2 Modelo de datos

Principio: **los flujos son datos, no código**. Alicia crea/edita flujos desde
el panel y nada requiere tocar PHP. Tablas propuestas (prefijo real
`mdl_local_flujos_*`, definidas en `db/install.xml`):

| Tabla | Propósito | Campos clave |
|---|---|---|
| `local_flujos_flow` | Definición de un flujo | id, name, intro, status (borrador/activo/archivado), settingsjson (opciones generales: audiencia, consentimiento requerido, texto de consentimiento, plantilla del informe final), usermodified, timecreated, timemodified |
| `local_flujos_stage` | Etapas ordenadas de un flujo | id, flowid (FK), sortorder, name, stagetype (`conversacion` \| `formulario` \| `informativa`), configjson (prompt de sistema de la etapa, criterio de avance, nº máx. de turnos, texto estático…) |
| `local_flujos_field` | Campos de datos estructurados que una etapa captura | id, stageid (FK), shortname, label, fieldtype (texto/número/opción/escala/rut/email…), required, sensitive (flag para enmascaramiento), optionsjson, sortorder |
| `local_flujos_session` | Una ejecución de un flujo por un usuario | id, flowid (FK), userid (FK), status (`en_curso` \| `completada` \| `abandonada`), currentstageid, consenttime, consenttextversion, timestarted, timecompleted |
| `local_flujos_message` | Transcripción de la conversación | id, sessionid (FK), stageid, role (`user` \| `assistant` \| `system`), content, timecreated |
| `local_flujos_answer` | Valores capturados de los campos estructurados | id, sessionid (FK), fieldid (FK), value, timecreated, timemodified |
| `local_flujos_result` | Entregable final generado | id, sessionid (FK), resulttype, contentjson, timecreated |

Notas:

- `configjson`/`settingsjson` dan flexibilidad para que el constructor crezca
  (nuevos tipos de etapa, criterios de avance) **sin migraciones de esquema**
  por cada opción nueva; lo estructural (orden, tipo, pertenencia) sí es
  relacional para poder consultarlo/borrarlo con la API de Moodle.
- Todo acceso a datos vía **`$DB` (data manipulation API)** y definición vía
  XMLDB — nada de SQL crudo.
- El consentimiento queda **en la sesión** (marca de tiempo + versión del texto
  aceptado), auditable por sesión.

### 1.3 Motor de ejecución

- **Recorrido:** una sesión referencia `currentstageid`. La página del flujo
  renderiza la etapa actual según su `stagetype`; la conversación con IA usa
  llamadas AJAX (external functions / servicio web propio del plugin) y las
  respuestas se persisten en `local_flujos_message` en cada turno.
- **Avance de etapa:** lo decide el criterio configurado en la etapa
  (`configjson`): p.ej. "todos los campos requeridos capturados", "la IA
  evaluó como completa la conversación" (la evaluación de la IA devuelve un
  JSON con `etapa_completa: true/false` + datos extraídos), "el usuario pulsa
  continuar", o un máximo de turnos. Al avanzar se actualiza `currentstageid`
  y `sortorder` define la siguiente.
- **Retomar sesión:** como cada turno y cada respuesta se persisten al
  momento, cerrar el navegador no pierde nada. Al volver, si existe una sesión
  `en_curso` del usuario para ese flujo, se retoma en `currentstageid` con la
  transcripción previa recargada. Barra de progreso = posición de la etapa
  actual sobre el total de etapas.
- **Una sesión activa por usuario y flujo** (índice único parcial por lógica de
  aplicación): evita estados ambiguos; el usuario puede abandonar y empezar de
  nuevo (la anterior queda `abandonada`).

### 1.4 Integración con IA

Opciones evaluadas:

| Opción | Evaluación |
|---|---|
| Reutilizar `block_exaaichat` | Descartado como dependencia: es un bloque autocontenido, su cliente OpenAI está acoplado al bloque (vector stores por instancia, config propia) y **no expone una API reutilizable**. Además la restricción del proyecto es no tocarlo. Sí sirve como **referencia de implementación** (uso de la Responses API, manejo de errores) |
| `local_ai_manager` (bycs-lp) | Buen gestor multi-herramienta, pero **no está instalado en producción**, agregaría una dependencia externa grande de terceros para un solo consumidor, y su ciclo de releases no lo controlamos |
| **Subsistema de IA del core (`core_ai`)** — recomendado | Moodle 5.2 trae el subsistema nativo (`core_ai\manager`, providers como `aiprovider_openai`, acciones como `generate_text`). Ventajas: API oficial y soportada, la API key se configura **una sola vez** en la administración del sitio (Mauro la ingresa manualmente, igual que hoy), políticas de aceptación de IA integradas, cero dependencias de terceros |

**Recomendación: `core_ai` con provider OpenAI del core.** El plugin define su
propio "placement"/consumo interno que arma el prompt por etapa (prompt de
sistema de la etapa + transcripción de la sesión) y llama a la acción de
generación de texto. **Validación obligatoria en el Commit 5:** confirmar que
la acción del core soporta bien el patrón conversacional multi-turno con
instrucciones de sistema por etapa; si resultara insuficiente, el fallback es
una capa cliente propia y delgada (`classes/local/aiclient.php`) sobre la
OpenAI Responses API (mismo patrón ya probado por `block_exaaichat`), con la
key en un setting del plugin que **Mauro ingresa manualmente** — nunca en
código ni en variables gestionadas por el agente.

### 1.5 Privacy API (obligatoria)

`local_flujos` almacena datos personales (transcripciones, respuestas,
resultados, consentimientos), por lo tanto **debe** implementar
`\core_privacy\local\metadata\provider` +
`\core_privacy\local\request\plugin\provider`:

- **Commit 1:** provider **null** (`null_provider`) — el esqueleto aún no
  guarda datos.
- **Commit 2 en adelante (cierre en Commit 6):** provider completo que declara
  cada tabla y campo, implementa exportación (GDPR-style "descargar mis
  datos") y borrado por usuario/contexto. Esto además cubre el derecho de
  eliminación de la ley chilena (ver §2).

---

## 2. Cumplimiento legal (Chile)

Marco: **Ley 19.628** (vigente) y **Ley 21.719** (nueva ley de protección de
datos personales, entra en vigor en **diciembre de 2026** — es decir, DURANTE o
poco después de este desarrollo: se diseña desde ya para cumplirla).

1. **Consentimiento explícito y previo:** ninguna etapa captura datos
   personales sin que el usuario acepte antes una pantalla de consentimiento
   que declara: qué se captura, con qué **finalidad**, quién accede (Alicia),
   y cuánto tiempo se retiene. La aceptación se registra con **marca de
   tiempo** y **versión del texto** aceptado (`consenttime`,
   `consenttextversion` en la sesión). Sin aceptación → el flujo no inicia.
2. **Finalidad declarada:** el texto de consentimiento es configurable por
   flujo (Alicia lo redacta en el constructor; se entrega un texto base marcado
   como PENDIENTE de su revisión). La finalidad debe ser específica del flujo
   (ej. "elaborar tu diagnóstico de competencias y plan de acción").
3. **Derecho a eliminación:** doble vía — (a) Privacy API de Moodle (borrado
   por solicitud del interesado, herramienta estándar de admin), y (b) botón de
   borrado de sesiones en el panel de resultados (Commit 8).
4. **RUT:** si un flujo captura RUT (fieldtype `rut`, flag `sensitive`):
   - se almacena normalizado pero **toda visualización lo muestra enmascarado**
     (patrón ya usado en el sistema de certificados: `12.XXX.XXX-9`), incluido
     el panel de Alicia y el informe final;
   - exige una justificación de finalidad registrada en la configuración del
     flujo;
   - **PENDIENTE (Alicia):** confirmar si algún flujo realmente necesita RUT o
     si basta el email/identidad de la cuenta Moodle. Si no se necesita, el
     fieldtype queda implementado pero sin uso (postura por defecto: **no
     pedir RUT**).
5. **Retención y borrado:** política configurable por flujo (por defecto:
   **PENDIENTE definir con Alicia**, propuesta base 24 meses). Tarea
   programada de Moodle (`scheduled task`) que anonimiza/elimina sesiones más
   antiguas que la política, con registro en logs de la ejecución.
6. **Minimización y acceso:** solo Alicia (capability `local/flujos:viewresults`)
   y el propio usuario ven resultados; las transcripciones no se comparten con
   terceros; la IA recibe solo lo necesario por etapa (no el perfil completo
   del usuario).

---

## 3. Plan por commits (10 commits)

> Convención: cada commit se desarrolla y **verifica en `moodle-staging`**
> antes de darse por cerrado. "Instalado limpio" significa: `upgrade.php
> --non-interactive` sin errores + plugin visible en *Site administration →
> Plugins → Plugins overview* + sitio operativo (portada carga, login ok,
> `block_exaaichat` intacto).

### Commit 1 — Esqueleto del plugin + permisos + privacy base ✅ (esta tarea)

Contenido:

- Estructura `public/local/flujos/` según estándares Moodle: `version.php`,
  `db/access.php`, `lang/en/local_flujos.php`, `lang/es/local_flujos.php`,
  `classes/privacy/provider.php` (null provider), `lib.php`.
- Capabilities: `local/flujos:manage` (crear/editar flujos — manager),
  `local/flujos:view` (ejecutar flujos — usuario autenticado),
  `local/flujos:viewresults` (ver resultados de otros — manager).
- Incorporación al build de la imagen (`moodle/Dockerfile` copia el plugin al
  webroot `public/local/flujos`).

Criterios de aceptación:

- [ ] El plugin instala sin errores en staging (upgrade.php exit 0).
- [ ] Aparece como `local_flujos` en la lista de plugins con las cadenas de
      idioma correctas en ES y EN.
- [ ] Las 3 capabilities existen y muestran sus descripciones traducidas en
      *Site administration → Users → Permissions → Define roles*.
- [ ] El registro de privacidad (*Privacy and policies → Plugin privacy
      registry*) lista el plugin declarando que aún no almacena datos.
- [ ] Sitio de staging plenamente operativo; `block_exaaichat` sin cambios.
- [ ] `production` sin cambios (el commit NO se pushea todavía; ver Commit 10).

### Commit 2 — Modelo de datos

Contenido: `db/install.xml` con las 7 tablas de §1.2 (XMLDB, con claves
foráneas e índices), `db/upgrade.php` + bump de versión, clases de persistencia
(`classes/local/...` con la API `$DB`), y actualización del privacy provider de
null a **provider completo** (metadata de todas las tablas; export/delete se
completan cuando existan datos reales, cierre en Commit 6).

Criterios de aceptación:

- [ ] Instalación desde cero Y upgrade desde Commit 1 crean el mismo esquema
      (verificado con la comparación de esquema del admin: *Development → XMLDB
      editor* / check database schema sin diferencias).
- [ ] CRUD básico probado por CLI (crear flujo de prueba, leerlo, borrarlo en
      cascada: etapas/campos/sesiones asociadas desaparecen).
- [ ] Privacy registry declara cada tabla y campo personal.

### Commit 3 — Constructor de flujos (panel de Alicia)

Contenido: páginas de administración (`index.php` de gestión + formularios
moodleform) para: crear/editar/archivar flujos; agregar/reordenar/eliminar
etapas (con tipo y configuración por formulario, sin JSON visible para
Alicia); definir campos a capturar por etapa; editar texto de consentimiento;
previsualizar el flujo. Acceso solo con `local/flujos:manage`. Navegación:
entrada en el menú de administración del sitio.

Criterios de aceptación:

- [ ] Alicia (cuenta manager sin permisos de admin del sitio) puede crear un
      flujo completo de 3 etapas **sin tocar código ni JSON**.
- [ ] Reordenar etapas se refleja en la ejecución.
- [ ] Un usuario sin `manage` recibe error de permiso al abrir el constructor.
- [ ] Validaciones de formulario: no se puede activar un flujo sin al menos 1
      etapa ni sin texto de consentimiento si captura datos.

### Commit 4 — Motor de ejecución (sin IA todavía)

Contenido: página de ejecución (`flujo.php?id=...`) con interfaz por etapas,
barra de progreso, pantalla de consentimiento previa (registra
`consenttime`/`consenttextversion`), persistencia de sesión y **retomar**
donde se quedó; etapas `informativa` y `formulario` funcionales; la etapa
`conversacion` muestra un placeholder ("IA se conecta en el siguiente hito").
Listado "Mis flujos" para el usuario final.

Criterios de aceptación:

- [ ] Un estudiante inicia un flujo, completa 2 etapas, cierra el navegador,
      vuelve a entrar y retoma exactamente donde estaba (transcripción/valores
      previos visibles).
- [ ] Sin aceptar el consentimiento no se muestra ninguna etapa.
- [ ] La barra de progreso refleja etapa actual / total.
- [ ] Un segundo intento crea nueva sesión solo si la anterior se marca
      abandonada/completada.

### Commit 5 — Integración con IA por etapa

Contenido: conexión de la etapa `conversacion` al subsistema `core_ai`
(validación del patrón multi-turno; fallback documentado en §1.4 si no
alcanza), prompt de sistema por etapa desde `configjson`, evaluación de cierre
de etapa (la IA responde JSON estructurado con `etapa_completa` + datos
extraídos hacia `local_flujos_answer`), manejo de errores (proveedor caído →
mensaje amable y sesión intacta), y límite de turnos por etapa.

Criterios de aceptación:

- [ ] Con la API key configurada **manualmente por Mauro** en la admin de
      staging, una etapa conversacional mantiene diálogo coherente y avanza
      sola cuando el criterio se cumple.
- [ ] Los datos que la IA extrae quedan en `local_flujos_answer` asociados a
      los campos correctos.
- [ ] Si la IA no responde, el usuario puede reintentar sin perder la sesión.
- [ ] Ninguna key aparece en el repo, en variables de Railway gestionadas por
      el agente, ni en logs.

### Commit 6 — Datos estructurados + consentimiento + RUT (cierre de privacidad)

Contenido: fieldtypes completos (incl. `rut` con validación de dígito
verificador y enmascaramiento en TODA visualización), flag `sensitive`,
registro de versión de consentimiento, tarea programada de
retención/anonimización según política del flujo, y **privacy provider
completo** (export + delete por usuario y por contexto, probados).

Criterios de aceptación:

- [ ] El RUT jamás se muestra completo en ninguna pantalla (constructor, panel
      de resultados, informe, exportaciones) — patrón `12.XXX.XXX-9`.
- [ ] La exportación de datos de un usuario (herramienta estándar de Moodle)
      incluye sus sesiones, respuestas y transcripciones; el borrado las
      elimina y deja el resto intacto.
- [ ] La tarea de retención borra solo sesiones fuera de política (probado con
      fechas simuladas).

### Commit 7 — Entregable final (informe / plan de acción)

Contenido: al completar la última etapa se genera el resultado
(`local_flujos_result`): síntesis vía IA usando una plantilla configurable por
flujo (estructura de secciones definida por Alicia en el constructor), vista
en pantalla + descarga PDF (reutilizando el enfoque del generador de
certificados: generación al vuelo, sin almacenar PDFs), y reintento manual si
la generación falla.

Criterios de aceptación:

- [ ] Al completar un flujo el usuario ve su informe y puede descargarlo en
      PDF con datos sensibles enmascarados.
- [ ] El informe usa la plantilla del flujo (dos flujos con plantillas
      distintas producen estructuras distintas).
- [ ] Si la generación falla, la sesión queda `completada` con resultado
      pendiente y un botón de regenerar.

### Commit 8 — Panel de resultados para Alicia

Contenido: página con `local/flujos:viewresults`: listado por flujo de quién
lo inició/completó (con filtros y progreso), detalle de sesión (respuestas +
informe, transcripción opcional), descarga de resultados (CSV con datos
estructurados, PDF del informe individual), y borrado de sesiones (derecho de
eliminación, con confirmación y registro en logs de Moodle).

Criterios de aceptación:

- [ ] Alicia ve quién completó cada flujo y descarga el CSV/PDF.
- [ ] El CSV enmascara los campos `sensitive`.
- [ ] Un manager sin `viewresults` no accede; los eventos de
      visualización/borrado quedan en el log estándar de Moodle.

### Commit 9 — Batería de pruebas en staging

Contenido: pruebas end-to-end en `moodle-staging` con **rol Estudiante real**
(usuario `estudiante.prueba` o equivalente), no solo admin: flujo completo de
los 2 casos de uso piloto (creados por el constructor, no por SQL), retomar
sesión, consentimiento, enmascaramiento, panel de resultados, PHPUnit del
plugin (mínimo: motor de avance de etapas, validación RUT, privacy provider)
y revisión con code checker de Moodle (moodle-plugin-ci / codechecker).

Criterios de aceptación:

- [ ] Checklist E2E documentado y ejecutado con capturas/evidencia; sin
      errores bloqueantes.
- [ ] PHPUnit del plugin en verde en staging.
- [ ] `block_exaaichat` sigue funcionando en staging (prueba de humo).
- [ ] Cero warnings/errores PHP en logs de Apache durante la batería.

### Commit 10 — Despliegue controlado a producción

Contenido: merge/push a `main` (dispara rebuild del servicio `moodle` de
producción por sus watchPatterns `moodle/**`), verificación post-deploy,
configuración manual de la API key de producción por Mauro, creación de los
flujos reales por Alicia en el constructor de producción, y actualización de
`OPERACION.md` con la operación del plugin (retención, tareas programadas,
troubleshooting).

Criterios de aceptación:

- [ ] Backup previo verificado (dump de MariaDB de producción antes del push).
- [ ] Deploy de producción sale sano: sitio arriba, upgrade.php aplicó el
      esquema, `block_exaaichat` intacto, cursos existentes intactos.
- [ ] Flujo piloto creado EN producción por el constructor y probado con un
      usuario de prueba.
- [ ] Rollback documentado (imagen anterior + restauración del dump) y
      `moodle-staging` conservado o desmontado según decisión de costos de
      Mauro.

---

## 4. Decisiones pendientes (consultar con Alicia antes del Commit 2/3)

Nada de esto se inventa; se implementa la mecánica y el contenido queda
parametrizable:

1. **Contenido de los flujos piloto:** etapas exactas del diagnóstico CARA
   (nombres, orden, qué evalúa cada una) y de la simulación de entrevista;
   textos de bienvenida y cierre.
2. **RUT: ¿se captura o no?** Postura por defecto: no. Si sí: en qué flujo,
   con qué finalidad declarada.
3. **Texto de consentimiento** definitivo por flujo (se entrega borrador base
   para su revisión legal/comercial).
4. **Política de retención:** cuánto tiempo se guardan sesiones/respuestas
   (propuesta base: 24 meses) y si se anonimiza o se borra.
5. **Formato del entregable final:** secciones del informe/plan de acción, tono,
   si lleva branding (logo/colores) y si se envía también por email.
6. **Audiencia y acceso:** ¿flujos abiertos a cualquier usuario autenticado, o
   por cohorte/curso? ¿Se muestran en la portada, en el dashboard, o ambos?
7. **Idioma de la IA:** ¿solo español? ¿Tono formal (usted) o cercano (tú)?
8. **Precio/monetización** (si aplica): fuera del alcance técnico de estos 10
   commits, pero condiciona la audiencia (punto 6).
9. **Nombre visible del producto** ("Flujos guiados", "Diagnósticos", u otro
   branding) — afecta cadenas de idioma desde el Commit 3.

---

## 5. Referencias del proyecto

- Entorno staging: environment `moodle-staging` de Railway (servicios
  `moodle-stg` + `mariadb-stg`, DB propia y vacía, dominio
  `*.up.railway.app`).
- Gotchas de Moodle 5.x en este stack (ruta de plugins bajo `public/`, caché
  `core_component.php`, upgrade automático en el entrypoint): ver
  `moodle/OPERACION.md` y el entrypoint (`moodle/entrypoint.sh`, paso 5c).
- Modelo de plan previo: hito de certificados (commits C1-C10,
  `README-CERTIFICADOS.md`).
