FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production || npm install

COPY server ./server
COPY data ./data
COPY lib ./lib
COPY tsconfig.json ./

EXPOSE 1234
ENV WS_PORT=1234

CMD ["npx", "tsx", "server/websocket.ts"]
