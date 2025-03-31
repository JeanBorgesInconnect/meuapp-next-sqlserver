# Etapa 1: Build da aplicação
FROM node:18 AS builder

WORKDIR /app

# Instala dependências
COPY package.json package-lock.json ./
RUN npm install

# Copia apenas a pasta prisma antes do generate
COPY prisma ./prisma
RUN npx prisma generate

# Agora sim, copia o resto do código
COPY . .

# Build da aplicação
RUN npm run build

# Etapa 2: Imagem final
FROM node:18-slim

WORKDIR /app

COPY --from=builder /app ./

EXPOSE 3000

CMD ["npm", "start"]
