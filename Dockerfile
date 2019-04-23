FROM node:10.15 as build
ENV NODE_ENV dev
ADD . app/
WORKDIR /app
RUN yarn --production

FROM node:10.15-alpine
EXPOSE 80 443
COPY --from=build /app /app
ENTRYPOINT [ "node", "/app/index.js" ]