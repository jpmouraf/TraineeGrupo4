FROM node:18-alpine

RUN mkdir /api

WORKDIR /api

COPY package*.json ./

RUN npm install

COPY . /api 

RUN npx prisma generate

EXPOSE 3030
