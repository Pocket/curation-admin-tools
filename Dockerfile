# development build - build app
FROM node:16@sha256:ca9d3abb9e2228bf849afad8f861e0b446fd62d9f8ba85385e18f31f20cb58b8 as builder
WORKDIR /usr/src/app
ARG GIT_SHA
ARG APP_ENV

COPY . .
ENV NODE_ENV=production
ENV REACT_APP_GIT_SHA=${GIT_SHA}
RUN npm install --silent \
    && REACT_APP_ENV=${APP_ENV} npm run build

# production environment
FROM nginx:1.21.6@sha256:e1211ac17b29b585ed1aee166a17fad63d344bc973bc63849d74c6452d549b3e
# Copy collections build into nginx html directory for now,
# collections will be at the root of the server
COPY --from=builder /usr/src/app/build /usr/share/nginx/html
COPY --from=builder /usr/src/app/.docker/nginx.conf /etc/nginx/nginx.conf
ENV PORT 80
EXPOSE ${PORT}
CMD ["nginx", "-g", "daemon off;"]
