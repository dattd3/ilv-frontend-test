FROM node:18-alpine3.15 as build
RUN apk add yarn
WORKDIR /app
RUN npm install create-react-app
COPY . .
RUN yarn install
CMD yarn start