FROM node:18-alpine

RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./

RUN npm install -g typescript ts-node && \
    npm install --build-from-source bcryptjs && \
    npm install

COPY . .

RUN npm run build

EXPOSE 3000

# Исправленный путь к CLI
CMD ["sh", "-c", "npx typeorm-ts-node-commonjs migration:run -d src/data-source.ts && node dist/main.js"]