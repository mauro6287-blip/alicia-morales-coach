# Sistema de Certificación Digital

Módulo de emisión de certificados con QR de verificación institucional, para
cumplir con los requisitos de Mercado Público (Compras Ágiles y licitaciones).

## Variables de entorno necesarias

```
ADMIN_SESSION_SECRET   # mínimo 32 chars, generar con: openssl rand -hex 32
CERT_ADMIN_EMAIL        # email de login del panel admin (ej: alicia@aliciamoralescoach.com)
CERT_ADMIN_PASSWORD     # contraseña de login del panel admin
CERT_ADMIN_NOMBRE       # nombre a mostrar (ej: "Alicia Morales")
NEXT_PUBLIC_SITE_URL    # ej: https://aliciamoralescoach.com (se usa para armar la URL del QR)
RESEND_API_KEY          # ya existente en el proyecto
```

Estas variables deben configurarse en Railway antes del primer deploy. La
migración de base de datos (5 tablas nuevas, aditiva) se aplica automáticamente
en cada deploy: el comando de arranque (`nixpacks.toml`) corre
`npx prisma migrate deploy` antes de `npm start`.

## Crear el usuario admin

```bash
CERT_ADMIN_EMAIL=alicia@aliciamoralescoach.com \
CERT_ADMIN_PASSWORD=xxxx \
CERT_ADMIN_NOMBRE="Alicia Morales" \
npm run seed-admin
```

## Crear la plantilla por defecto

```bash
npm run seed-plantilla
```

## Cómo emitir certificados

1. Ingresar a `/admin/login` con las credenciales del admin.
2. Ir a `/admin/certificados`.
3. Subir el Excel con los alumnos aprobados (la primera fila debe tener los
   nombres de columna).
4. Mapear las columnas: Nombre, RUT, Email, Fecha de aprobación, Horas (Curso
   es opcional).
5. Elegir curso y plantilla.
6. Revisar la previsualización (filas con errores se marcan en rojo).
7. Click en "Emitir X certificados".
8. Desde `/admin/emisiones/{id}` se puede descargar el ZIP con todos los PDFs
   o enviar cada certificado por email individualmente.

Si un alumno (RUT) ya tenía un certificado emitido en el mismo curso, esa fila
se salta automáticamente (no se duplica) y se reporta en el resultado.

## Cómo anular un certificado

1. Ir a `/admin/emisiones/{id}` de la emisión que contiene el certificado (se
   puede ubicar también con el buscador en `/admin/emisiones`).
2. Click en "Anular" en la fila del certificado.
3. Ingresar motivo (mínimo 10 caracteres).
4. Confirmar. El certificado queda marcado como anulado: `/verificar/{codigo}`
   mostrará "Certificado anulado" con la fecha y el motivo.

## Verificación pública

Cada certificado incluye un QR que apunta a
`aliciamoralescoach.com/verificar/{codigo}`. Esa página:

- Es pública (no requiere login).
- Muestra el RUT ofuscado (ej: `12.XXX.XXX-9`), nunca el email.
- Registra cada consulta (fecha, IP, navegador) en `VerificacionLog` para
  fines de auditoría.
- Tiene un límite de 30 consultas por minuto por IP (más allá de eso responde
  `429 Demasiadas consultas`).
- Está marcada `noindex, nofollow` y bloqueada en `robots.txt`.

## Retención de logs

Correr manualmente cada 6 meses (o configurar como cron en Railway):

```bash
npm run limpiar-logs
```

Elimina los registros de `VerificacionLog` con más de 12 meses de antigüedad.

## Cumplimiento legal

- **Ley 19.886** (Compras Públicas): la verificación vive en el dominio
  institucional `aliciamoralescoach.com`, no en Drive/Dropbox.
- **Ley 19.628** (Protección Vida Privada): RUT ofuscado en la vista pública;
  el email nunca se muestra en `/verificar`.
- **Ley 19.799** (Documentos Electrónicos): cada certificado guarda un hash
  SHA-256 de sus datos (`hashIntegridad`) y una fecha de creación inmutable;
  toda anulación queda registrada con motivo, fecha y quién la realizó.
- **Ley 21.719** (Datos Personales, vigencia dic-2026): aviso de tratamiento
  visible en `/verificar` y retención de logs limitada a 12 meses.

**Nota SENCE:** Alicia Morales Coach SPA no está registrada como OTEC, por lo
que el certificado no lleva código ni logotipo SENCE. Se emite como
certificado privado de la escuela, válido para Compras Ágiles y licitaciones
que no exijan OTEC.

## Notas técnicas

- Los PDFs se generan al vuelo en cada descarga/envío; no se almacenan en
  disco ni en un bucket.
- El generador de PDF usa las fuentes base del PDF (Helvetica) en vez de
  registrar Montserrat/Roboto desde un CDN externo, para no depender de la
  disponibilidad de esa URL al momento de emitir un certificado. Ver
  `lib/cert/pdf-generator.tsx`.
- El rate limiting de `/verificar` es en memoria (por instancia); si se
  escala a múltiples instancias, conviene migrar a un store compartido
  (Redis) — ver `lib/rate-limit.ts`.
