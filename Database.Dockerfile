FROM node:22.13.0-alpine AS scriptbuilder

WORKDIR /app

COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json
COPY tsconfig.json /app/tsconfig.json

RUN npm install

COPY sql_init_script /app/sql_init_script
COPY src /app/src

RUN npm run build

FROM mariadb:11.6.2 AS database

WORKDIR /app

COPY --from=scriptbuilder /app/sql_init_script/init.sql /docker-entrypoint-initdb.d/init.sql

EXPOSE 3306
