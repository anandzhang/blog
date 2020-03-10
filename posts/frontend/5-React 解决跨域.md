---
typora-root-url: ../
tags: react
createTime: 2020-2-23
updateTime: 2020-2-23
keywords: 解决跨域,react跨域问题
summary: 通过 React 反向代理proxy快速解决跨域问题。
---

# React 解决跨域

```shell
npm i http-proxy-middleware --save
```

在 `src/` 下新建文件 `setupProxy.js`： 

```js
const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function (app) {
  app.use(createProxyMiddleware("/api", {
    target: "https://movie.douban.com/",
    changeOrigin: true,
    pathRewrite: {
      "^/api": "/"
    }
  }))
}
```

《具体参数解释待更----》