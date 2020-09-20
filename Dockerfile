FROM node:14 as checkpoint

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY ./ /app/

RUN npm run build:all

FROM nginx:1.19.1-alpine

RUN apk add --no-cache bash

COPY --from=checkpoint /app/build/ /usr/share/nginx/html

COPY --from=checkpoint /app/Docker/bin/nginx.conf /etc/nginx/nginx.conf

COPY --from=checkpoint /app/Docker/env.sh /usr/share/nginx/html

CMD ["/bin/bash", "-c", "/usr/share/nginx/html/env.sh && nginx -g \"daemon off;\""]
