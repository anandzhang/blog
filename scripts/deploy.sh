#!/bin/bash

readonly APP_NAME=blog
readonly SERVER_FILE=build/index.js

if !(command -v pm2 >/dev/null 2>&1); then 
  yarn global add --silent pm2
  # pm2 install typescript
fi

cd ${APP_NAME}
git pull
yarn install --silent
yarn build
yarn addPost

if [ "$(pm2 id ${APP_NAME})" = "[]" ]; then
  pm2 start ${SERVER_FILE} -n ${APP_NAME} --watch
  pm2 save
fi
