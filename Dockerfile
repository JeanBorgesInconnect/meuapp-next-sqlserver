# Etapa 1: Build da aplicação
FROM node:18 AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

# Copia schema do Prisma e gera o client
COPY prisma ./prisma
RUN npx prisma generate

# Copia o restante do projeto
COPY . .
RUN npm run build

# Etapa 2: Imagem final
FROM node:18-slim

WORKDIR /app

# 🛠️ Instala certificados para conexões HTTPS/TLS
RUN apt-get update && \
    apt-get install -y ca-certificates curl && \
    apt-get clean

# Copia os arquivos da etapa de build
COPY --from=builder /app .

EXPOSE 3000

CMD ["npm", "start"]
