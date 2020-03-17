---
typora-root-url: ../
tags: webpack
createTime: 2020-03-17
updateTime: 2020-03-17
keywords: webpack打包,webpack打包CSS,webpack打包压缩多个CSS
summary: 使用 webpack 前端热门打包工具对多个CSS文件进行打包压缩，最后生成一个单一的CSS文件。
---

# webpack 打包CSS

## 简介

由于建立了很多CSS样式文件，比如：`reset.css`、`layout.css`、`posts.css` 等等。如果在HTML的 `head` 标签中一个个引入，就会导致访问网页时会向服务器发出很多请求，一方面增大了服务器负担，另一方面也会影响用户体验。

所以我需要对网站的多个CSS文件进行打包，把多个文件合为一个并且对CSS代码进行压缩，减小体积，这里我开始尝试使用了 `webpack` 这个热门的打包工具进行打包。

## 安装

### webpack

```shell
npm i webpack webpack-cli -D
```

> 加上 `--save-dev` （简写 `-D`） 参数，将 `webpack` 相关依赖保存到 `package.json` 文件的 `devDependencies` 开发依赖中，表示我们只在开发环境中使用该依赖（对于生产环境我们之只需要它打包后的东西，但它在生产环境不是必须的）。

### loader、plugins

只安装了 `webpack` 是不足够的，我们需要安装一些CSS相关的插件和加载器。

```shell
npm i css-loader mini-css-extract-plugin optimize-css-assets-webpack-plugin -D
```

> `css-loader` 解析CSS文件的一些语法，比如 `@import` 等。
>
> `mini-css-extract-plugin` 用来将CSS文件的内容抽离成一个CSS文件。
>
> `optimize-css-assets-webpack-plugin` 用来优化CSS文件，我们这里用它来压缩CSS代码。

## 配置

### webpack.config.js

在项目根目录，也就是和 `package.json` 同级的地方创建 `webpack` 的配置文件：`webpack.config.js` 。

```javascript
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
module.exports = {
  mode: 'production',
  entry: './minify-css.js',  // 入口文件
  output: {
    filename: 'needless.js',  // 输出文件名
    path: path.resolve(__dirname, 'dist')  // 输出文件路径
  },
  plugins: [
    // 使用 mini-css-extract-plugin 插件
    new MiniCssExtractPlugin({
      filename: 'bundle.css'  // 打包后CSS文件名
    })
  ],
  module: {
    rules: [
      // 添加 CSS 打包规则
      {
        test: /\.css$/,
        // 从后往前加载，先使用 css-loader 处理CSS
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      }
    ]
  },
  optimization: {
    // 使用 optimize-css-assets-webpack-plugin 优化
    minimizer: [
      new OptimizeCSSAssetsPlugin()
    ]
  }
}
```

> 这个配置文件没有加 `JavaScript` 的优化压缩，如果需要请加：
>
> 安装 `npm i terser-webpack-plugin -D` 后，添加
>
> ```javascript
> const TerserJSPlugin = require('terser-webpack-plugin')
> ```
>
> 然后在 `optimization` 的 `minimizer` 中加 `new TerserJSPlugin()` 就可以了。

### minify-css.js

```javascript
require('./stylesheets/reset.css')
require('./stylesheets/layout.css')
require('./stylesheets/posts.css')
```

我在根目录有 `stylesheets` 文件夹，并存放了三个CSS文件，在这个 `webpack.config.js` 配置的入口文件中像上面这样引入这些CSS文件。

## 运行

```shell
npx webpack
```

然后会在 `dist` 文件夹中生成一个 `bundle.css` 和 `bundle.js` ，这些都是上面 `webpack.config.js` 中配置的，你可以修改。

然后就有了打包好了我们需要的 `bundle.css` ，Emmm，这个 `bundle.js` 我们不需要。

## 补充

我们有一些需要分开打包，不是把所有的都全部打包在一个文件里，需要分开组合。

那么我们只需要修改 `webpack.config.js` 的入口 `entry` 值为多个：

```javascript
module.exports = {
  // 省略了其他的配置
  entry: {
    layout: './minify-css-group1.js',
    other: './minify-css-group2.js'
  },
  output: {
    filename: '[name].needless.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].bundle.css'
    })
  ]
}
```

这时产生的打包CSS文件就是 `layout.bundle.css` 和 `other.bundle.css` ，也就是 `[name]` 取了 `entry` 对象中的对应键。