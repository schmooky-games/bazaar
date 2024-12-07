FROM node:18-alpine

RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package*.json ./

RUN npm install --build-from-source bcryptjs
RUN npm install -g typeorm typescript ts-node @types/node

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["sh", "-c", "npx typeorm-ts-node-commonjs migration:run -d ./src/data-source.ts \
    && npm run start:prod"]
