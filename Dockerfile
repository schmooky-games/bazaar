FROM node:18-alpine

RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package*.json ./

RUN npm install --build-from-source bcryptjs && \
    npm install -g typescript ts-node && \
    npm install --save-dev @types/node && \
    npm install typeorm @nestjs/typeorm @nestjs/config pg

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["sh", "-c", "npx typeorm-ts-node-commonjs migration:run -d /dist/data-source.js \
    && npm run start:prod"]
