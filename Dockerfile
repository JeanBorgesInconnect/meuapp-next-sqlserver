# Etapa 1: Build da aplicação
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

# Etapa 2: Imagem final e leve com SSH
FROM node:20-alpine

WORKDIR /app

# Instala o OpenSSH no Alpine
RUN apk update && apk add --no-cache openssh

# Cria o diretório do SSH
RUN mkdir /var/run/sshd

# Copia os arquivos da etapa anterior
COPY --from=builder /app ./

ENV NODE_ENV=production
EXPOSE 3000

# Comando para manter o container "vivo" e com terminal aberto
CMD ["/bin/sh"]
