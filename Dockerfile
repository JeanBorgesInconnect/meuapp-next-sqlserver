# Etapa 1: Build da aplicação
FROM node:18 AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

# Copia o restante do projeto, incluindo schema.prisma
COPY . .

# Gera o cliente Prisma
RUN npx prisma generate

RUN npm run build

# Etapa 2: Imagem final
FROM node:18-slim

WORKDIR /app

COPY --from=builder /app ./

EXPOSE 3000

CMD ["npm", "start"]
