FROM node:24

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

CMD ["sh", "-c", "npm ci && npm run start:test"]