FROM node:18-alpine3.15 as build
RUN apk add yarn
RUN apk add curl
RUN yarn add create-react-app

#RUN apk add xz-utils
WORKDIR /app
COPY . .
RUN yarn install
RUN yarn build:production
#COPY ./node-v18.16.0.tar.xz .
#RUN tar xvfJ node-v18.16.0.tar.xz
#RUN yarn install
#CMD yarn start