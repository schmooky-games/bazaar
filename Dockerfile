FROM node:18-alpine

RUN apk add --no-cache python3 make g++

RUN npm install -g typescript ts-node typeorm@0.3.17

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./

RUN npm install --build-from-source bcryptjs && \
    npm install

COPY . .

RUN npm run build

EXPOSE 3000

# Исправленный путь к CLI
CMD ["sh", "-c", "typeorm migration:run -d src/data-source.ts && node dist/main.js"]
