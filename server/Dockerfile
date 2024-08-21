FROM nginx:latest
COPY nginx.conf /etc/nginx/conf.d/default.conf

FROM openjdk:17-oracle
VOLUME /tmp
COPY build/libs/gates-0.0.1.jar app.jar
CMD ["sh","-c","java -jar app.jar"]