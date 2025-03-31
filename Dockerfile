# Etapa 1: Build da aplicação
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

# Etapa 2: Imagem final e leve
FROM node:20-alpine

WORKDIR /app

# Copia os arquivos da etapa anterior
COPY --from=builder /app ./

ENV NODE_ENV=production
EXPOSE 3000

CMD ["npm", "start"]
