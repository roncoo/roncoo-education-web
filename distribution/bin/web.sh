#!/bin/bash
# Copyright 2016-现在 LingKe, Co., Ltd.
export NODE_HOME=/opt/node
export PM2="$NODE_HOME/bin/pm2"
export BASE_DIR=`cd $(dirname $0)/..; pwd`
export SERVER="web"

case "$1" in
start)
  cd ${BASE_DIR}
  if [ ! -d "node_modules" ];then
    yarn -y
  fi
  ${PM2} start
  echo "${SERVER} start success"
  ;;
stop)
  ${PM2} stop ${SERVER}
  ${PM2} delete ${SERVER}
  echo "${SERVER} stop success"
  ;;
*)
  $0 stop
  sleep 1
  $0 start
  ;;
esac
