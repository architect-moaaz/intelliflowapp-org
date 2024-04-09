FROM node:16.17.1-alpine3.16 as build
WORKDIR /usr/app
COPY . /usr/app
RUN npm i --legacy-peer-deps
RUN npm run build

FROM nginx:1.17.8-alpine
EXPOSE 80
COPY ./docker/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /usr/app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
