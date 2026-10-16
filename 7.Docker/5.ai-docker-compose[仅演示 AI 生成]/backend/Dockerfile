FROM docker.m.daocloud.io/library/node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev --registry=https://registry.npmmirror.com

COPY server.js ./

EXPOSE 3000

CMD ["npm", "start"]
