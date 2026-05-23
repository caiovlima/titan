FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build:prod

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/dist/titan ./dist/titan
COPY --from=build /app/package*.json ./
RUN npm ci --omit=dev
EXPOSE 4000
CMD ["node", "dist/titan/server/server.mjs"]
