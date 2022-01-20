#!/bin/zsh

docker run \
    -v /Users/anand/Workspaces/blog/docker/nginx.conf:/etc/nginx/conf.d/default.conf \
    -v /Users/anand/Workspaces/blog/build/:/usr/share/nginx/html/ \
    -p 3000:80 \
    -it nginx:1.19.10 bash
