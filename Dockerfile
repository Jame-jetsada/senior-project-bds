FROM node:22.0.0-alpine AS build
WORKDIR /app

COPY . .

RUN npm ci && npm cache clean --force
RUN npm run build

FROM node:22.0.0-alpine

WORKDIR /app

# Only copy the necessary files and build artifacts
COPY --from=build /app/.next ./.next
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/public ./public
COPY --from=build /app/package*.json ./
COPY --from=build /app/tsconfig* ./
COPY --from=build /app/.env* ./
COPY --from=build /app/next.config* ./
COPY --from=build /app/tailwind.config* ./

EXPOSE 3000

CMD ["npm", "run", "start"]