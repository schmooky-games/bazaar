FROM node:18-alpine

RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package*.json ./

RUN npm install --build-from-source bcryptjs && \
    npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["sh", "-c", "node --require ts-node/register ./node_modules/typeorm/cli.js migration:run -d ./dist/data-source.js && node dist/main.js"]

