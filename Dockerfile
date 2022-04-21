# development build - build app
FROM node:16@sha256:040f0041f373b872246e3cb33f5192e2852dde03f90fe137892ed3036760d2c7 as builder
WORKDIR /usr/src/app
ARG GIT_SHA
ARG APP_ENV

COPY . .
ENV NODE_ENV=production
ENV REACT_APP_GIT_SHA=${GIT_SHA}
RUN npm install --silent \
    && REACT_APP_ENV=${APP_ENV} npm run build

# production environment
FROM nginx:1.21.6@sha256:694f2ecdb88498325d70dbcb4016e90ab47b5a8e6cd97aaeec53f71f62536f99
# Copy collections build into nginx html directory for now,
# collections will be at the root of the server
COPY --from=builder /usr/src/app/build /usr/share/nginx/html
COPY --from=builder /usr/src/app/.docker/nginx.conf /etc/nginx/nginx.conf
ENV PORT 80
EXPOSE ${PORT}
CMD ["nginx", "-g", "daemon off;"]
