FROM node:18-alpine

RUN apk add --no-cache python3 make g++

WORKDIR /app

RUN npm install -g ts-node typeorm

COPY package*.json ./
COPY tsconfig.json ./

RUN npm install --build-from-source bcryptjs
RUN npm cache clean --force && \
    npm install --verbose

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["sh", "-c", "./node_modules/.bin/typeorm-ts-node-commonjs migration:run -d ./src/data-source.ts && node dist/main.js"]
