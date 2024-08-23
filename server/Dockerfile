FROM nginx:latest
COPY nginx.conf /etc/nginx/conf.d/default.conf

FROM gradle:jdk17 AS BUILD
WORKDIR /usr/app/
COPY . .

ARG GITHUB_CLIENT_SECRET
ENV GITHUB_CLIENT_ID=Ov23liLCaGD0wQUlBANE
ENV GITHUB_CLIENT_SECRET=${GITHUB_CLIENT_SECRET}}

RUN gradle build

FROM openjdk:17-oracle
WORKDIR /usr/app/
COPY --from=BUILD /usr/app/ .

ENTRYPOINT exec java -jar /usr/app/build/libs/logic-gates.jar
