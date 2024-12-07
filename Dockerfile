FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache python3 make g++

COPY package*.json ./

RUN npm install --build-from-source bcryptjs
RUN npm install -g ts-node
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["sh", "-c", "npm run typeorm migration:run -- -d src/data-source.ts && npm run start:prod"]

