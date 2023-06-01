FROM node:18-alpine3.15 as build
RUN apk add yarn
RUN apk add curl
RUN apk add xz-utils
WORKDIR /app
#RUN npm install create-react-app
COPY ./node-v18.16.0.tar.xz .
RUN tar xvfJ node-v18.16.0.tar.xz
#RUN yarn install
#CMD yarn start