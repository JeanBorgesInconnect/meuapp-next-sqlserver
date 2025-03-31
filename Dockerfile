# Etapa 1: build da aplicação
FROM node:20-alpine AS builder

WORKDIR /app

# Copia e instala dependências
COPY package.json package-lock.json ./
RUN npm install

# Copia a pasta do Prisma antes de gerar o client
COPY prisma ./prisma
RUN npx prisma generate

# Copia o restante do código
COPY . .

# Build da aplicação
RUN npm run build

# Etapa 2: imagem final com shell acessível
FROM node:20-alpine

WORKDIR /app

# Instala o shell (bash ou sh)
RUN apk add --no-cache bash

# Copia todos os arquivos da build
COPY --from=builder /app .

# Exporta a porta
EXPOSE 3000

# Define o ambiente de produção
ENV NODE_ENV=production

# Comando para manter o terminal ativo no WebSSH do Azure
CMD ["/bin/sh"]
