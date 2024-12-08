FROM node:18-alpine

RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./

# Добавим ts-node как отдельную зависимость в dependencies (не в devDependencies)
RUN npm install ts-node typeorm @types/node

COPY . .

RUN npm run build
RUN npm run migration:run

CMD [ "node", "dist/main.js" ]