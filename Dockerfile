FROM registry.cn-beijing.aliyuncs.com/sunjinke/node:12.22.12
WORKDIR /web
COPY  ./ /web
ARG env
ENV NODE_ENV=${env}
RUN npm run build
CMD ["npm", "start"]
