FROM nginx:1.23.4-alpine-slim

COPY dist /usr/share/nginx/html

COPY docker/nginx.conf /etc/nginx/nginx.conf
