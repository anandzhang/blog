---
typora-root-url: ../
tags: server,nginx
createTime: 2021-09-13
updateTime: 2021-09-13
keywords: nginx部署react,nginx部署多个react项目,nginx为react项目配置location块
summary: 在一台服务器上通过 Nginx 部署多个 React 项目。
---

# 使用 Nginx 部署多个 React 项目

## 前言

最近需要重写一个已上线的 React 后台管理项目，但是这个项目比较久远，代码不规范，比较混乱，混杂了很多的 UI 框架，如 material-ui (一个叫 react-admin 的库用到了它)、reactbulma (可能是想丰富下 UI 组件)、antd 等，这让界面看上去风格很不统一，我接手时也一脸懵，不知道现在得用哪一个 UI 组件库。

所以，我提出了另起炉灶，重写项目的想法。为了让项目已上线的功能不受影响，我打算将新项目部署到域名的 `/v2/` 路径上，原来的项目依旧在 `/` 根路径上不受干扰，老项目重写好的功能通过 `location.replace('/v2/')` 方法跳转到新项目进行使用，新加的功能就直接在新项目上开发了。

## 新项目配置

新项目使用了 `create-react-app` 脚手架创建，那么，直接可以在 `package.json` 文件中添加 `homepage` 键：

```json
{
  "name": "admin-v2",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "homepage": "/v2"
}
```

主要就是为了修改 `webpack` 打包时的 `publicPath` 配置，另外 `create-react-app` 也可以通过 `.env` 文件配置 `PUBLIC_URL` 环境变量来改变。

## Nginx 配置

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name localhost;

    index index.html;

    location / {
        root /usr/share/nginx/html;
        try_files $uri $uri/ /index.html =404;
    }

    location /v2/ {
        alias /usr/share/nginx/html_v2/;
        try_files $uri $uri/ /v2/index.html =404;
    }

    error_page 404 /;
}
```

新增了 `/v2` 的 location 配置块，让用户访问 `/v2/` 时使用新的项目。

新项目构建后 `build` 文件夹下的静态文件放在 `/usr/share/nginx/html_v2/` 下，使用 `alias` 代替了 `root` 关键字，当访问 `/v2/` 时会自动访问 `html_v2` 文件夹下的文件。

### [root](http://nginx.org/en/docs/http/ngx_http_core_module.html#root) 和 [alias](http://nginx.org/en/docs/http/ngx_http_core_module.html#alias) 的区别

```nginx
location /v2 {
    root /usr/share/nginx/html;
}
```

我们访问 `/v2` ，实际访问的是 `/usr/share/nginx/html/v2/` ；

我们访问 `/v2/index.html` ，实际访问的是 `/usr/share/nginx/html/v2/index.html`。

**可见，使用 root 会让 location 的路径加到 root 配置的路径后进行访问**

```nginx
location /v2 {
    # 必须以 / 结束
    alias /usr/share/nginx/html/;
}
```

我们访问 `/v2` ，实际访问的是 `/usr/share/nginx/html/`；

我们访问 `/v2/index.html` ，实际访问的是 `/usr/share/nginx/html/index.html` 。

**可见，使用 alias 会让访问 location 路径时就是访问的 alias 配置的路径，也就是一个别名**

所以我们的场景下需要使用 `alias` 进行配置。

