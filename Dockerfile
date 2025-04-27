FROM node:19 AS stage1
COPY ./ /nodeproj/
WORKDIR /nodeproj/
RUN npm install
RUN npm run build

FROM nginx:alpine
COPY --from=stage1 /nodeproj/dist/ /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY ./nginx.conf /etc/nginx/conf.d/
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
