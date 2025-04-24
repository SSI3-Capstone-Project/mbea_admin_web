# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

# ติดตั้ง dependencies และ build
COPY package*.json ./
COPY vite.config.* ./
COPY . .

RUN npm install
RUN npm run build

# Stage 2: Production
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html

# ก๊อป config nginx ถ้าจำเป็น
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
