---
typora-root-url: ../
tags: react-native,webpack
createTime: 2021-09-14
updateTime: 2021-09-14
keywords: react-native-web,react-native支持web,react-native-web和webpack网页端支持
summary: 通过 react-native-web 库搭配 webpack 为 react-native 项目拓展 H5 网页端支持。
---

# 如何让 React Native 项目支持 WEB 网页端

## 前言

不同于 `expo-cli` 脚手架创建的项目，以前使用 `react-native` 脚手架创建的 React Native 项目并不能直接运行在网页端。幸运的是，社区中已经有大佬提供了解决方案 [react-native-web](https://github.com/necolas/react-native-web) ，他实现了一套支持网页端的 `react-native` 组件。我们可以通过打包工具将 `react-native` 库的引用替换为 `react-native-web` 然后再解决一些小问题，就可以将我们的项目打包到网页端运行了。

## 安装依赖

```shell
npm i react-dom react-native-web
```

> 或 `yarn add react-dom react-native-web ` 。

再安装 `webpack` 打包工具和一些插件：

```shell
npm i -D webpack webpack-cli webpack-dev-server babel-loader babel-plugin-react-native-web file-loader react-native-web-image-loader mini-css-extract-plugin css-minimizer-webpack-plugin clean-webpack-plugin html-webpack-plugin
```

> 同样的，你可以使用 `yarn` 。
>

### 依赖简要说明

1. `webpack` 、`webpack-cli` 是打包工具所需依赖，`webpack-dev-server` 是启动开发环境（在一个端口上运行网页应用）所需依赖。

2. `babel-loader` 是为了解析 `JavaScript` 不同 ECMAScript 语法和语法糖，让浏览器可以识别并运行的关键。

   `babel-plugin-react-native-web` 是 `react-native-web` 的一个插件，可以自动设置别名，把 `react-native` 的引用换为 `react-native-web` 。

3. `file-loader` 是为了让 `webpack` 解析项目中引入的除 `.js` 外的一些文件，比如图片`.jpg` 音频 `.mp3` 视频 `.mp4` 等等。

4. `react-native-web-image-loader` 是为了让 `webpack` 解析 `react-native` 中使用的 `@2x` `@3x` 的图片资源，并且能解决项目代码中使用 `Image` 组件图片没有设置宽高属性导致运行在网页端后图片不显示的问题。这个加载器很好的将项目中用到的图片解析成一个对象：

   ```javascript
   AdaptiveImage {
       "data": {
           "uri": "static/media/pic1.abcd1234.png",
           "uri@2x": "static/media/pic1@2x.4321dcba.png",
           "uri@3x": "static/media/pic1-3x.efgh5678.png",
           "width": 128,
           "height": 64
       },
       get uri(),       // returns uri based on pixel ratio
       get width(),     // returns this.data.width
       get height(),    // returns this.data.height
   }
   ```

   项目运行在网页端时，会根据 `window.devicePixelRatio` 的值拿到不同 `@2x` `@3x` 的图片。

5. `mini-css-extract-plugin`  `css-minimizer-webpack-plugin` 是用来解析 `.css` 文件的，并压缩优化样式。

6. `clean-webpack-plugin` 插件会在每次运行 `webpack` 打包前删除之前打包产生的文件。

7. `html-webpack-plugin` 是为了生成网页的 `index.html` 供应用访问。

## 添加 Webpack 配置

创建一个 `web` 文件夹，和 `ios` `android` 文件夹平级，这样方便进行项目管理。

在 `web` 文件夹下创建 `webpack.config.js` 文件，进行 `webpack` 配置。

```javascript
const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const resolvePath = (relativePath) => path.resolve(__dirname, relativePath);

module.exports = {
    mode: 'development',
    entry: resolvePath('../index.js'),
    output: {
        filename: '[name].[contenthash:8].js',
        path: resolvePath('build'),
        publicPath: '/',
    },
    // 也可以用 source-map，但是在启动时如果项目很大会比较耗时，好处是显示的错误信息更加充分
    // 可以参考：https://webpack.js.org/configuration/devtool/
    devtool: 'cheap-module-source-map',
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            inject: 'body',
            template: resolvePath('index.html'),
        }),
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash:8].css',
        }),
    ],
    module: {
        rules: [
            // 解析 js 文件
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true,
                        presets: ['module:metro-react-native-babel-preset'],
                        // 如果项目用到了装饰器等语法糖，可能需要添加相应的插件进行解析
                        plugins: ['react-native-web'],
                        configFile: false,
                    },
                },
            },
            // 解析项目用到的音频等素材
            {
                test: /\.(mp3|mp4)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'sounds',
                        esModule: false,
                    },
                },
            },
            // 解析项目使用的图片资源
            {
                test: /\.(png|jpe?g|gif)$/,
                options: {
                    name: '[name].[hash:8].[ext]',
                    outputPath: 'images',
                    scalings: { '@2x': 2, '@3x': 3 },
                    esModule: false,
                },
                loader: 'react-native-web-image-loader',
            },
            // 解析项目用到的css样式
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
        ],
    },
    resolve: {
        alias: {
            'react-native$': 'react-native-web'
        },
        // 优先使用 .web.js 后缀的文件
        extensions: ['.web.js', '.js'],
    },
};
```

## 添加 index.html

在 `web` 文件夹下添加 `index.html` 网页端访问时的入口文件：

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        <noscript>You need to enable JavaScript to run this app.</noscript>
        <div id="root"></div>
    </body>
</html>
```

## 添加快捷脚本

在 `package.json` 的 `scripts` 中添加 `start:web` ，方便之后启动网页端项目开发。

```json
{
  "scripts": {
    "这只是注释": "在存在的其他项后面添加下面的内容",
    "start:web": "webpack serve --config web/webpack.config.js"
  }
}
```

然后就可以通过 `npm run start:web` 或者 `yarn start:web` 命令启动网页端开发环境了。

## 运行网页端应用

在项目根目录 `index.js` 入口文件调用运行应用的方法 `AppRegistry.runApplication`：

```javascript
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
AppRegistry.runApplication(appName, { rootTag: document.getElementById('root') });
```

如果项目 `index.js` 配置了很多原生端才有的东西，可以新建一个 `index.web.js` 文件针对网页端进行特殊处理。

然后使用 `npm run start:web` 或 `yarn start:web` 启动应用。

## 调试

![start_web_error](/images/frontend/20/start_web_error.png)

如果你的项目安装了很多三方组件库，可能存在一些依赖库是只适用于原生平台，调用了 `NativeModule` 原生模块，并不适用于网页端，那么我们可以先使用一个空壳组件代替它。

1. 先确定是哪一个依赖库报错

   ![library_error](/images/frontend/20/library_error.png)

   找到每个报错末尾出模块来源，分析依赖关系，比如上图 `react-native-sound` 库存在报错。

2. 在 `web` 文件夹下创建一个 `polyfills` 文件夹，再在其中创建 `Sound.js` 文件，方便对这类文件进行管理。

   ```javascript
   export default {}
   ```

3. 然后在 `webpack` 配置中添加 `alias` 配置：

   ```javascript
   // webpack.config.js 文件
   // .... 省略大部分配置，可看上文
   module.exports = {
       mode: 'development',
       entry: resolvePath('../index.js'),
       module: {
           // 省略
       },
       resolve: {
           alias: {
               'react-native$': 'react-native-web',
               'react-native-sound': resolvePath('polyfills/Sound.js')
           },
           // 省略
       },
   };
   ```

   也就是将 `react-native-sound` 组件先用一个空壳代替，让项目先运行起来，之后再去实现可用于网页端的特定代码。

## 生产环境优化

实际情况下，我们需要将项目打包为静态文件，也需要对项目文件进行必要的压缩和处理。

1. 添加 `build:web` 命令打包项目为静态文件

   ```json
   {
     "scripts": {
       "start:web": "webpack serve --config web/webpack.config.js",
       "build:web": "webpack --env production --config web/webpack.config.js"
     }
   }
   ```

2. 配置 `webpack` 生产做一些优化

   ```javascript
   const TerserPlugin = require('terser-webpack-plugin');
   const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
   
   // 从上文导出一个对象修改为导出一个函数
   module.exports = (env) => {
       const isProduction = !!env.production;
   
       return {
           mode: isProduction ? 'production' : 'development',
           entry: resolvePath('../index.js'),
           // 省略其他没有区分生产的配置，可见上文
           devtool: isProduction ? false : 'cheap-module-source-map',
           optimization: {
               // 开发环境不需要进行压缩
               minimize: isProduction,
               minimizer: [
                   // CSS 样式压缩
                   new CssMinimizerPlugin(),
                   // JS 文件优化
                   new TerserPlugin({
                       extractComments: 'all',
                       terserOptions: {
                           compress: {
                               // 生产上去掉日志输出
                               drop_console: true,
                           },
                       },
                   }),
               ],
           },
       }
   }
   ```

### 代码分割、拆包（可选）

有时项目太大会导致打包生产的 `bundle` 文件较大，我们可以通过代码分割进行一个拆包。详细配置可见 [Code Splitting](https://webpack.js.org/guides/code-splitting/) 。

```javascript
return {
    // 省略
    optimization: {
        // 省略
        minimizer: [
            // 省略
        ],
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                default: {
                    name: 'common',
                    // 模块被引用2次以上的才拆分
                    minChunks: 2,
                    priority: -10,
                },
                // 拆分第三方库（node_modules 中的模块都会拆到一起）
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor',
                    priority: -9,
                },
                // 把 node_modules 中的一个库单独拆出来
                checkbox_module: {
                    // 有的库小于 20kb 不会被单独拆出来，因为默认 minSize 值为 20000 (bytes)
                    // 所以如果你也想拆出来就需要降低 miniSize
                    minSize: 0,
                    test: /[\\/]node_modules[\\/]react-native-check-box[\\/]/,
                    name: 'checkbox_module',
                    priority: -8,
                },
            },
        },
        // 运行时模块
        runtimeChunk: {
            name: (entrypoint) => `runtime-${entrypoint.name}`,
        },
    },
}
```

## 补充

可参考案例项目 [react-native-web-example](https://github.com/anandzhang/react-native-web-example) ，实际情况下，我们需要添加网页端支持的项目都较为复杂，大概率会出现一些小问题，就需要我们耐心的一个一个解决。我自己在使用中遇到的很多问题汇总在 [React Native Web 常见问题解决方案](https://anandzhang.com/posts/frontend/21) 大家可以参考。



