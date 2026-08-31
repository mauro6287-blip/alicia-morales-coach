FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# `npm run build` ya corre `prisma generate` antes de `next build`, así que el
# cliente de Prisma queda generado con el schema definitivo.
RUN npm run build

EXPOSE 3000

# Las migraciones se aplican al arrancar, no al construir: durante el build la
# base de datos no es alcanzable. Si `migrate deploy` falla, el contenedor no
# levanta, y así un despliegue con la base sin migrar no llega a producción.
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
