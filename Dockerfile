FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Generar el cliente de Prisma con el schema ya presente (npm install corre antes
# del COPY del schema, y el arranque usa `next dev` que no ejecuta prisma generate).
RUN npx prisma generate
EXPOSE 3000
# Eliminamos las barras invertidas y usamos comillas dobles estándar
CMD ["npm", "run", "dev"]
