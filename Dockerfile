FROM node:18-alpine

RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./

RUN npm install --build-from-source bcryptjs
RUN npm cache clean --force && \
    npm install --verbose

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["sh", "-c", "npx typeorm-ts-node-commonjs migration:run -d ./src/data-source.ts && node dist/main.js"]
