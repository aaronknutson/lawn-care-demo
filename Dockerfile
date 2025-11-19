# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application files
COPY . .

# Accept build arguments for environment variables
ARG VITE_API_URL=https://lawnserver.aknovusdemos.cloud/api
ARG VITE_GOOGLE_MAPS_API_KEY=AIzaSyBETgNjD-b_ajsyw3FWbL_CPqpjnfzinpM
ARG VITE_APP_ENV=production

# Set environment variables for build
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_GOOGLE_MAPS_API_KEY=$VITE_GOOGLE_MAPS_API_KEY
ENV VITE_APP_ENV=$VITE_APP_ENV

# Build application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built application from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Health check - use nginx pgrep to verify process is running
HEALTHCHECK --interval=30s --timeout=3s --start-period=15s --retries=3 \
  CMD pgrep -f "nginx: master" || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
