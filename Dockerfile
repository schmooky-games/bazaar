FROM node:18-alpine

RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./

# Устанавливаем зависимости локально
RUN npm install --build-from-source bcryptjs
RUN npm cache clean --force && \
    npm install --verbose

COPY . .

RUN npm run build

EXPOSE 3000

# Используем node для запуска скомпилированных миграций
CMD ["sh", "-c", "cd /app && NODE_PATH=/app/node_modules npm run migration:run && node dist/main.js"]
