FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
COPY client/package.json client/
COPY server/package.json server/
RUN npm ci
COPY shared shared
COPY client client
RUN npm run build

# Node runs the server's TypeScript directly (type stripping), so there is no server build step.
FROM node:24-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY package.json package-lock.json ./
COPY client/package.json client/
COPY server/package.json server/
RUN npm ci --omit=dev --workspace server
COPY shared shared
COPY server/src server/src
COPY --from=build /app/client/dist client/dist
USER node
EXPOSE 3000
CMD ["node", "server/src/index.ts"]
