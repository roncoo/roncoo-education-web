FROM daocloud.io/library/node:12.18
MAINTAINER roncoo
# 环境配置
ENV cross-env NODE_ENV=production
ENV cross-env HOST 0.0.0.0
RUN mkdir -p /web
COPY . /web
WORKDIR /web
EXPOSE 3000
# 这里使用yarn
RUN yarn install
RUN yarn run build:modern
# 或者使用npm
#RUN npm install
#RUN npm run build:modern
CMD ["npm","start"]
