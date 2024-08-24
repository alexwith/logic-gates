FROM node:latest as build-stage

ARG GITHUB_CLIENT_ID
ENV REACT_APP_PROXY=https://logicgates.alexwith.com
ENV REACT_APP_GITHUB_CLIENT_ID=${GITHUB_CLIENT_ID}
ENV REACT_APP_BASE_URI=https://logicgates.alexwith.com
ENV PROXY=https://logicgates.alexwith.com

WORKDIR /app

COPY package*.json ./

RUN yarn install
COPY . .

RUN yarn run build

FROM nginx:latest
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build-stage /app/build/ /usr/share/nginx/html

WORKDIR /app
WORKDIR /app
RUN chown -R nginx:nginx /app && chmod -R 755 /app && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d
RUN touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid


USER nginx

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
