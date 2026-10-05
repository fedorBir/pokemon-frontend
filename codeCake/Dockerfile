FROM node:20-alpine AS builder
WORKDIR /app

# Install deps
COPY package*.json ./
RUN npm install

# Build
COPY . .
# Call the backend through this server's /api (see nginx.conf), not localhost:3001
ENV REACT_APP_API_URL=
RUN npm run build

# --- runtime stage ---
FROM nginx:alpine
# minimal nginx config
COPY ./codeCake/nginx.conf /etc/nginx/conf.d/default.conf
# copy built static files
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/build/ /usr/share/nginx/html/