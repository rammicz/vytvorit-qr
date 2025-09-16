#!/bin/sh

# Nahradit PORT v nginx konfiguraci
export PORT=${PORT:-8080}
sed -i "s/listen 80;/listen $PORT;/g" /etc/nginx/nginx.conf

# Spustit nginx
nginx -g "daemon off;"
