FROM node:18-alpine

RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./

# Устанавливаем зависимости локально
RUN npm install --build-from-source bcryptjs && \
    npm install

COPY . .

RUN npm run build

EXPOSE 3000

# Используем node для запуска скомпилированных миграций
CMD ["sh", "-c", "node dist/data-source.js migration:run && node dist/main.js"]