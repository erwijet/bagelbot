LABEL org.opencontainers.image.source https://github.com/bagelbotdev/my

FROM docker.io/node:latest AS build
WORKDIR /app

COPY package.json /app
RUN npm install
COPY . /app
RUN npm run build

FROM docker.io/erwijet/nginx:alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist /usr/share/nginx
