FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install --only=development

COPY --chown=node:node . .
RUN npm run build


USER node

FROM node:20-alpine

WORKDIR /app

COPY --from=build --chown=node:node /app/package*.json ./
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist
COPY .env .env

EXPOSE 8080

CMD ["node", "dist/main.js"]