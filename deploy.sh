#!/bin/bash
BASE_DIR=$(dirname "$0")
cd ${BASE_DIR}

APP_NAME=blog
git pull
yarn install --silent
yarn build

if [ "$(yarn --silent pm2 id ${APP_NAME})" = "[]" ]; then
  yarn start
  yarn pm2 save
fi
