# MariaDB para Moodle en Railway.
# Moodle 5.2 requiere MariaDB >= 10.11; usamos 11.4 LTS.
#
# Imagen propia (no la oficial cruda) por UN motivo concreto: la red privada de
# Railway es IPv6 (entornos legacy = solo IPv6). La imagen oficial de MariaDB
# escucha por defecto en bind-address = 0.0.0.0 (solo IPv4), así que Moodle no
# podría conectarse por <servicio>.railway.internal. Forzamos bind-address = *
# (IPv4 + IPv6) con un fichero de config que se carga después del 50-server.cnf.
# Ref: https://docs.railway.com/private-networking
FROM mariadb:11.4

# El 99- garantiza que se lea después de /etc/mysql/mariadb.conf.d/50-server.cnf
# y gane su bind-address por orden alfabético.
RUN printf '[mysqld]\nbind-address = *\n' \
    > /etc/mysql/mariadb.conf.d/99-railway-ipv6.cnf
