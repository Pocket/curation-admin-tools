# development build - build app
FROM node:16@sha256:051b68ed341fee26f4c08b15815ac4bff6a5351c68e7b33c66912677cc4be7ac as builder
WORKDIR /usr/src/app
ARG GIT_SHA
ARG APP_ENV

COPY . .
ENV NODE_ENV=production
ENV REACT_APP_GIT_SHA=${GIT_SHA}
RUN npm install --silent \
    && REACT_APP_ENV=${APP_ENV} npm run build

# production environment
FROM nginx:1.21.6@sha256:2bcabc23b45489fb0885d69a06ba1d648aeda973fae7bb981bafbb884165e514
# Copy collections build into nginx html directory for now,
# collections will be at the root of the server
COPY --from=builder /usr/src/app/build /usr/share/nginx/html
COPY --from=builder /usr/src/app/.docker/nginx.conf /etc/nginx/nginx.conf
ENV PORT 80
EXPOSE ${PORT}
CMD ["nginx", "-g", "daemon off;"]
