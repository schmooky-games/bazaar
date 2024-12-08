FROM node:18-alpine

RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./

RUN npm install --build-from-source bcryptjs
RUN npm install

# Добавим ts-node как отдельную зависимость в dependencies (не в devDependencies)
RUN npm install ts-node typeorm @types/node

COPY . .

RUN npm run build

# Создадим скрипт для запуска миграций
COPY <<EOF /app/run-migrations.js
const { exec } = require('child_process');
const path = require('path');

const command = 'node -r ts-node/register ./node_modules/typeorm/cli.js migration:run -d src/data-source.ts';

exec(command, { cwd: '/app' }, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error}`);
    return;
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
});
EOF

EXPOSE 3000

CMD ["sh", "-c", "node run-migrations.js && node dist/main.js"]