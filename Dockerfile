FROM node:19 AS stage1
COPY ./ /nodeproj/
WORKDIR /nodeproj/
RUN npm install
RUN npm run build

FROM nginx:alpine
COPY ./default.conf /etc/nginx/conf.d/default.conf
RUN rm /etc/nginx/conf.d/default.conf.default || true
COPY --from=stage1 /nodeproj/dist/ /usr/share/nginx/html
