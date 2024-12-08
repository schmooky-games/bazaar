FROM node:18-alpine

RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./

RUN npm install --build-from-source bcryptjs
RUN npm cache clean --force && \
    npm install --verbose

RUN npm install -D ts-node typeorm @types/node

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["sh", "-c", "node --require ts-node/register ./node_modules/typeorm/cli.js migration:run -d ./src/data-source.ts && node dist/main.js"]
