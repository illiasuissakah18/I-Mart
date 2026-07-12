# Production-ready Dockerfile for I MART
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy app source
COPY . .

# Environment
ENV NODE_ENV=production

EXPOSE 5000

CMD ["node", "server.js"]
