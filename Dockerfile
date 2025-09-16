# Multi-stage build pro React aplikaci
FROM node:18-alpine AS builder

WORKDIR /app

# Kopírování package files
COPY package*.json ./

# Instalace závislostí
RUN npm ci --only=production

# Kopírování zdrojového kódu
COPY . .

# Build aplikace
RUN npm run build

# Produkční stage s nginx
FROM nginx:alpine

# Kopírování buildu z předchozího stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Kopírování nginx konfigurace
COPY nginx.conf /etc/nginx/nginx.conf

# Kopírování CNAME souboru pro custom doménu
COPY public/CNAME /usr/share/nginx/html/CNAME

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
