# Etapa 1: Base com dependências
FROM node:18 AS builder

WORKDIR /app

# Copia os arquivos de dependência e instala os pacotes
COPY package.json package-lock.json ./
RUN npm install

# Copia apenas a pasta do Prisma e gera o client
COPY prisma ./prisma
RUN npx prisma generate

# Copia o restante do projeto
COPY . .

# Garante que a build seja do tipo standalone (ajuste no next.config.js)
RUN npm run build

# Etapa 2: Imagem final e leve
FROM node:18-slim

WORKDIR /app

# Instala dependência nativa necessária para o SQL Server
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Copia os artefatos gerados na build
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules

# Define variáveis padrão
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

EXPOSE 3000

# Inicia a aplicação
CMD ["node", "server.js"]
