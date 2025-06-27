# backend/Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN rm -rf node_modules package-lock.json && npm install --omit=optional

COPY . .

EXPOSE 4000

CMD ["node", "index.js"]