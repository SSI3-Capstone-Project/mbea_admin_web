FROM node:19 AS stage1
COPY ./ /nodeproj/
WORKDIR /nodeproj/
RUN npm install
RUN npm run build -- --base=/ssi3/

FROM nginx:alpine
COPY ./default.conf /etc/nginx/conf.d/default.conf
COPY --from=stage1 /nodeproj/dist/ /usr/share/nginx/html/