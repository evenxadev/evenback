FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY apps/api/src ./apps/api/src
COPY tsconfig.json ./

RUN npm install -g tsx

ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

CMD ["tsx", "apps/api/src/server.ts"]