# ---- Dependencies stage ----
FROM node:22-alpine3.22 as deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

# ---- Runner stage ----
FROM node:22-alpine3.22 as runner
WORKDIR /app

# Copy only necessary files
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production
ENV PORT=3001
EXPOSE 3001

# Run as non-root user
RUN addgroup -S app && adduser -S app -G app
USER app

CMD ["npm", "start"]
