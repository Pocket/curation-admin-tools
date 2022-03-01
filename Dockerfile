# development build - build app
FROM node:16@sha256:4c1e36b70fc464b74fb6824f15416f851982d2708412d0076786434b075d9a49 as builder
WORKDIR /usr/src/app
ARG GIT_SHA
ARG APP_ENV

COPY . .
ENV NODE_ENV=production
ENV REACT_APP_GIT_SHA=${GIT_SHA}
RUN npm install --silent \
    && REACT_APP_ENV=${APP_ENV} npm run build

# production environment
FROM nginx:1.21.6@sha256:6a9f18391bb80b75ce50472168ea38e4050f7f56aff8ad08cb4d38b43df1aab2
# Copy collections build into nginx html directory for now,
# collections will be at the root of the server
COPY --from=builder /usr/src/app/build /usr/share/nginx/html
COPY --from=builder /usr/src/app/.docker/nginx.conf /etc/nginx/nginx.conf
ENV PORT 80
EXPOSE ${PORT}
CMD ["nginx", "-g", "daemon off;"]
