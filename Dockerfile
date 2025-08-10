FROM registry.cn-beijing.aliyuncs.com/sunjinke/node:20.11.1
WORKDIR /web
COPY  ./ /web
ARG env
ENV NODE_ENV=${env}
RUN npm run build
CMD ["npm", "start"]
