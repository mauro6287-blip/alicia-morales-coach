# Moodle 5.2 — imagen propia (sin Bitnami)
# Base: PHP 8.3 + Apache (Debian bookworm).
# Moodle 5.2 requiere PHP 8.3.0 mínimo (8.4.x soportado) y MariaDB >= 10.11.
# Ref: https://moodledev.io/general/releases/5.2
FROM php:8.3-apache

# --- Versión de Moodle (rama estable) ---
# Cambiar esta rama para upgrades (ver moodle/OPERACION.md).
ARG MOODLE_BRANCH=MOODLE_502_STABLE

# --- Dependencias del sistema para compilar las extensiones PHP ---
RUN apt-get update && apt-get install -y --no-install-recommends \
        git \
        libpng-dev \
        libjpeg62-turbo-dev \
        libfreetype6-dev \
        libwebp-dev \
        libicu-dev \
        libonig-dev \
        libzip-dev \
        libxml2-dev \
        libcurl4-openssl-dev \
        libsodium-dev \
        unzip \
        ghostscript \
        cron \
        ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# --- Extensiones PHP requeridas/recomendadas por Moodle ---
# Lista base del plan: gd intl mbstring mysqli zip soap xml curl opcache exif
# + sodium (lo exige el checker de entorno de Moodle 5.x).
RUN docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp \
    && docker-php-ext-install -j"$(nproc)" \
        gd \
        intl \
        mbstring \
        mysqli \
        zip \
        soap \
        xml \
        curl \
        opcache \
        exif \
        sodium

# --- Apache: mod_rewrite + headers (necesarios para Moodle) ---
RUN a2enmod rewrite headers
# Silencia el warning "Could not reliably determine the server's fully qualified domain name"
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

# --- php.ini recomendado por Moodle ---
RUN { \
        echo 'memory_limit = 256M'; \
        echo 'max_input_vars = 5000'; \
        echo 'post_max_size = 100M'; \
        echo 'upload_max_filesize = 100M'; \
        echo 'max_execution_time = 300'; \
        echo 'opcache.enable = 1'; \
        echo 'opcache.memory_consumption = 128'; \
        echo 'opcache.max_accelerated_files = 8000'; \
        echo 'opcache.revalidate_freq = 60'; \
    } > /usr/local/etc/php/conf.d/moodle.ini

# --- Código de Moodle 5.2 desde la fuente oficial (git) ---
# El código vive en /var/www/html; el DocumentRoot se ajusta más abajo a /public.
RUN git clone --depth 1 --branch "${MOODLE_BRANCH}" \
        https://github.com/moodle/moodle.git /var/www/html \
    && rm -rf /var/www/html/.git

# --- Exabis AI Chat Block: bloque de chat con RAG real (analiza documentos subidos
# por curso vía un vector store del proveedor de IA). Autocontenido, sin dependencias.
# En Moodle 5.x el código de plugins vive bajo /var/www/html/public (ver nota DocumentRoot
# más abajo), NO en /var/www/html directamente. NO se agrega a ningún curso por defecto;
# eso se hace manualmente desde el curso cuando se quiera activar.
RUN git clone --depth 1 --branch v5.1-2026061900 \
        https://github.com/gtn/moodle-block_exaaichat.git /var/www/html/public/blocks/exaaichat \
    && rm -rf /var/www/html/public/blocks/exaaichat/.git

# --- moodledata FUERA del docroot ---
RUN mkdir -p /var/www/moodledata \
    && chown -R www-data:www-data /var/www/moodledata /var/www/html \
    && chmod -R 0775 /var/www/moodledata

# --- DocumentRoot al webroot de Moodle 5.x: /var/www/html/public ---
# Desde Moodle 5.0 el código vive en la raíz y SOLO /public es accesible públicamente.
# config.php real queda en /var/www/html/config.php; public/config.php lo carga.
# (Va al final, tras el chown pesado, para no invalidar capas caras en cada cambio.)
# FallbackResource /r.php + DirectoryIndex index.php habilitan el Router de Moodle 5.x.
RUN sed -ri 's!DocumentRoot /var/www/html!DocumentRoot /var/www/html/public!' \
        /etc/apache2/sites-available/000-default.conf \
    && printf '<Directory /var/www/html/public>\n    Options FollowSymLinks\n    AllowOverride None\n    Require all granted\n    DirectoryIndex index.php\n    FallbackResource /r.php\n</Directory>\n' \
        > /etc/apache2/conf-available/moodle-docroot.conf \
    && a2enconf moodle-docroot

# Garantiza un ÚNICO MPM: prefork (requerido por mod_php). Instalar paquetes apt
# arrastra el meta-paquete apache2, que habilita mpm_event; con prefork ya activo
# eso produce "apache2: Configuration error: More than one MPM loaded" y crash-loop.
RUN a2dismod mpm_event mpm_worker 2>/dev/null || true; a2enmod mpm_prefork

# --- Scripts CLI de administración (fuera de /public, no accesibles por web) ---
COPY cli/ /var/www/html/cli_custom/

# --- Plugin a medida: local_flujos (motor de flujos guiados, ver PLAN_FLUJOS.md) ---
# En Moodle 5.x los plugins viven bajo public/ (public/local/<nombre>).
# Va al final para no invalidar las capas caras en cada iteración del plugin.
COPY plugins/local/flujos/ /var/www/html/public/local/flujos/
RUN chown -R www-data:www-data /var/www/html/public/local/flujos

# --- Entrypoint: genera config.php, espera la DB, instala si hace falta, arranca Apache ---
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
# Normaliza fin de línea (por si se editó en Windows) y da permisos de ejecución.
RUN sed -i 's/\r$//' /usr/local/bin/entrypoint.sh \
    && chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 80
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
