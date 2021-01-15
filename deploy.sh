#!/bin/bash
BASE_DIR=$(dirname "$0")
cd ${BASE_DIR}

if !(command -v pm2 >/dev/null 2>&1); then 
  yarn global add --silent pm2
  # pm2 install typescript
fi

APP_NAME=blog
git pull
yarn install --silent
yarn build

if [ "$(pm2 id ${APP_NAME})" = "[]" ]; then
  yarn start
  pm2 save
fi
