###
# BUILD STAGE
###
FROM node:22-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm i

COPY . .
RUN npm run build

###
# RUN STAGE
###
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production

COPY package.json package-lock.json ./
RUN npm i ci --omit=dev

COPY --from=builder app/dist ./src
COPY public ./public
COPY .env.example .env

USER node
EXPOSE 3000
CMD ["node", "src/main.js"]
