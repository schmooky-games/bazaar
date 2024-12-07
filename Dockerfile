FROM node:18-alpine

RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./

RUN npm install -g ts-node typescript

RUN npm install --build-from-source bcryptjs && \
    npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["sh", "-c", "ts-node ./node_modules/typeorm/cli.js migration:run -d ./src/data-source.ts && node dist/main.js"]