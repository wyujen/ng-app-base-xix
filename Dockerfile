##### Stage 1: Build Angular #####
FROM node:18-alpine AS ng_builder
WORKDIR /app

# Angular 專案輸出名稱（dist/<APP_NAME>/browser）
ARG APP_NAME=ng-app-base-xix
# 部署子路徑（URL path token，不要帶斜線）
ARG SUB_URL=ng-base-xix

COPY package*.json ./
RUN npm install

COPY . .

# Angular base-href 一律由 SUB_URL 衍生
RUN npm run build -- --base-href /${SUB_URL}/

##### Stage 2: Nginx Serve #####
FROM nginx:alpine

# Stage 2 也需要 SUB_URL（給 envsubst / 路徑用）
ARG SUB_URL=ng-base-xix
ENV SUB_URL=${SUB_URL}

RUN rm -rf /usr/share/nginx/html/*
RUN apk --no-cache add gettext

# Nginx 設定模板
COPY nginx.template.conf /etc/nginx/templates/default.conf.template

# dist 用 APP_NAME 取，但「放到 SUB_URL 資料夾」(方案 A 核心)
ARG APP_NAME=ng-app-base-xix
COPY --from=ng_builder /app/dist/${APP_NAME}/browser /usr/share/nginx/html/${SUB_URL}

# 啟動時產出 nginx conf + env.js
# 只替換 ${SUB_URL}，避免動到 nginx 的 $uri 等變數
CMD ["/bin/sh", "-c", "\
  envsubst '${SUB_URL}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && \
  envsubst < /usr/share/nginx/html/${SUB_URL}/env/env.template.js > /usr/share/nginx/html/${SUB_URL}/env/env.js && \
  exec nginx -g 'daemon off;' \
"]

EXPOSE 80
