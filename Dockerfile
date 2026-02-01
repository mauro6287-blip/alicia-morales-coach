FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
# Eliminamos las barras invertidas y usamos comillas dobles estándar
CMD ["npm", "run", "dev"]
