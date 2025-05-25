 # syntax=docker/dockerfile:1
 # Build stage: install dependencies and build the Next.js app
 FROM node:22-alpine AS builder
 WORKDIR /app

 # Install dependencies
 COPY package.json package-lock.json ./
 RUN npm ci --quiet

 # Copy application source
 COPY . .

 # Build the Next.js application
 RUN npm run build

 # Production stage: minimal image to run the app
 FROM node:22-alpine AS runner
 WORKDIR /app
 ENV NODE_ENV=production

 # Copy only necessary files for production
 COPY --from=builder /app/.next ./.next
 COPY --from=builder /app/public ./public
 COPY --from=builder /app/node_modules ./node_modules
 COPY --from=builder /app/package.json ./package.json

 # Expose application port
 EXPOSE 3000

 # Start the Next.js application
 CMD ["npm", "start"]