# develop stage
FROM node:14.15.5-alpine as develop-stage
WORKDIR /app
COPY . .
RUN npm install
# build stage
FROM develop-stage as build-stage
RUN npx quasar build -m ssr
# production stage
FROM node:14.15.5-alpine as production-stage
COPY --from=build-stage /app/dist/ssr .
RUN npm install
EXPOSE 3000
CMD ["npm", "start"]
