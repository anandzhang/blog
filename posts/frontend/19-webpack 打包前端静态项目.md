---
typora-root-url: ../
tags: webpack
createTime: 2021-01-13
updateTime: 2021-01-13
keywords: webpack打包,webpack打包前端项目,webpack打包前端静态资源项目
summary: 使用 webpack 对前端项目进行打包、代码压缩等，方便了静态项目的部署，极其舒服。
---

# webpack 打包前端静态项目

## 前言

最近新写了一个 H5 项目，不需要后端交互，使用了原生 `js`，然后再次体会到 [webpack](https://webpack.js.org/) 的强大。

最开始项目只有一个 `index.html` 和 几个 `js` 文件，`js` 文件直接在 `index.html` 通过 `<script>` 标签进行依次引入，感觉没有太大问题。之后这个项目在服务器使用 `nginx` 做个简单托管也就部署好了，但是部署的时候我需要对这些 `js` 文件进行压缩来缩小资源体积，同时转换ES6、ES7语法到浏览器普遍支持的 ES5，我当时就想反正就几个 `js` 文件嘛，按照在 `index.html` 的引入顺序全部复制到一个 `js` 文件里，再把这个文件复制到一个 `js` 在线压缩工具进行压缩就OK啦。

```html
<script src="preset.js"></script>
<script src="utils.js"></script>
<script src="features.js"></script>
<script src="main.js"></script>
<!-- 最初傻瓜想法：按引入顺序把其内容复制到一个新js文件里，再压缩好了复制回这里只留一个 script 标签 -->
```

之后为了进一步减小项目体积，我又把 `html` 、`css` 也复制到对应的在线压缩工具进行压缩，最后又为了减少网络请求，又将 `css` 内容直接放到 `head` 的 `style` 下，而不使用 `link` 标签。

后来 `js` 逻辑变多了，得使用模块语法了，Oops！这可怎么办呢，然后我就想到了 [webpack](https://webpack.js.org/)~。我最后只需要 `yarn build` 一下，一切问题都搞定了。

## 配置 webpack

可参考 [webpack 中文文档](https://webpack.docschina.org/guides/getting-started/) 。

1. 使用 `yarn` 添加一下 `webpack` ，顺便生成 `package.json` 。

   ```shell
   yarn add -D webpack webpack-cli
   ```

2. 写一个简单的配置文件 `webpack.config.js` 设置一下入口文件和输出文件。

   ```javascript
   const path = require('path')
   
   module.exports = {
     entry: './src/index.js',
     output: {
       filename: 'bundle.js',
       path: path.resolve(__dirname, 'dist'),
     },
   }
   ```

   项目 `src/index.js` 这个入口文件就使用了模块语法，举个例：

   ```javascript
   import AudioController from './AudioController'
   import { refreshAll } from './Timer'
   
   const canvas = document.getElementById('content')
   const ctx = canvas.getContext('2d')
   
   canvas.onclick = event => {
     const relativeY = event.pageY - canvas.offsetTop
     if (relativeY > 200 && relativeY < 400) {
       refreshAll()
       ctx.fillText('Welcome to Anand\'s Blog', 120, 120)
     }
   }
   ```

3. 为 webpack 打包写一个 `script` ，在 `package.json` 的 `scripts` 添加 `build` 操作，这样之后打包只需要运行 `yarn build` 就好啦。

   ```json
   {
     "private": true,
     "scripts": {
       "build": "webpack"
     },
     "devDependencies": {
       "webpack": "^5.13.0",
       "webpack-cli": "^4.3.1"
     }
   }
   ```

4. 使用 `yarn build` 命令进行打包，在 `dist` 目录会生成 `bundle.js` 文件，然后去除 `index.html` 里之前引入 `js` 文件的 `script` 标签，现在不需要再像之前一样还要考虑引入顺序，只需要引入这个 `bundle.js` 就好啦。

   ```html
   <script src="dist/bundle.js"></script>
   ```

Nice! 这样简单的配置，就解决了之前复制几个 `js` 文件到一起然后再压缩、转语法的操作了。

## 丰富 webpack

虽然现在已经能满足 `js` 文件打包、压缩等需求了，但是 `js` 文件里使用图片、音频等文件等路径怎么办呢？

### 图片、音频资源

如何项目只有图片资源，只需要简单添加 `module` 规则配置。

```javascript
const path = require('path')

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource'
      }
    ]
  }
}
```

但是我的这个项目还会用到音频资源，所以就需要借助 `file-loader` 了，先安装一下。

```shell
yarn add -D file-loader
```

顺便配置一下资源解析，每次引入图片、音频这些资源的路径都需要 `./`、 `../../` 慢慢去找，这也太麻烦了吧。我们配置一下 `resolve`。

```javascript
const path = require('path')

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        // 只加了 mp3 格式，其他的也可以，继续加就好啦
        test: /\.(png|svg|jpg|jpeg|gif|mp3)$/i,
        loader: 'file-loader',
        options: {
          // [path]、[hash] 这些都是占位符，其他的可以看 file-loader 文档
          name: '[path][hash:18].[ext]'
        }
      }
    ]
  },
  resolve: {
    alias: {
      // assets/ 是我项目资源的位置
      // 之后使用 import titleImage from 'Assets/images/title.png' 就可以啦，require 也一样
      Assets: path.resolve(__dirname, 'assets/')
    }
  }
}
```

但是项目中 `new Audio('Assets/audios/demo.mp3')` 会存在问题，在 `chrome` 的开发工具看请求是 `[object%20Module]`，挺奇怪。

![object20module](/images/frontend/19/object20module.png)

之后发现这些资源的解析不需要使用到 `ES modules` 语法，我们把它关掉：

```javascript
const path = require('path')

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|jpeg|gif|mp3)$/i,
        loader: 'file-loader',
        options: {
          name: '[path][hash:18].[ext]',
          // 还有一个解决方案是使用 require('Assets/audios/demo.mp3').default 而不用关闭这个配置
          esModule: false
        }
      }
    ]
  },
  resolve: {
    alias: {
      Assets: path.resolve(__dirname, 'assets/')
    }
  }
}
```

### 配置需要的插件

现在还存在其他需求：`html` 文件的压缩，`js` 文件自动引入到 `html`、`css` 文件的压缩等。

#### html-webpack-plugin

如果修改了打包输出文件名，或者文件名使用了 `hash` ，这样打包都都需要手动去修改 `index.html` 里 `js` 文件的引入，太麻烦了，我们使用 `html-webpack-plugin` 插件来解决，同时解决了压缩需求。

1. 安装一下

   ```shell
   yarn add -D html-webpack-plugin clean-webpack-plugin
   ```

   `clean-webpack-plugin` 插件可以每次打包前自动删除打包生成的 `dist` 文件夹，可以不用。

2. 配置一下

   ```javascript
   const { CleanWebpackPlugin } = require('clean-webpack-plugin')
   const HtmlWebpackPlugin = require('html-webpack-plugin')
   
   module.exports = {
     // 为了避免代码块太长，这里省略啦其他配置项
     plugins: [
       new CleanWebpackPlugin(),
       // 使用项目的 index.html 作为模板，打包后会在 dist 生成一个新的 index.html（插入了 bundle.js 的 <script> 引入标签）
       new HtmlWebpackPlugin({
         template: 'index.html'
       })
     ]
   }
   ```

#### mini-css-extract-plugin

使用 `mini-css-extract-plugin` 插件整合项目使用的多个 `css` 文件到一个文件。简单使用可以看它的文档，这里我的需求是项目不存在 `import 'Assets/styles/main.css'` 这样的资源使用，只在 `index.html` 中通过 `link` 加载。所以我们需要在 webpack 的 `entry` 入口配置中添加 `css` 文件，然后再利用这个插件，并且 `html-webpack-plugin` 插件也自动把输出文件引入到了 `index.html` ，完美。

1. 安装一下，同时需要用到  `css-loader`。

   ```shell
   yarn add -D mini-css-extract-plugin css-loader
   ```

2.  webpack 配置中添加这个插件

   ```javascript
   const { CleanWebpackPlugin } = require('clean-webpack-plugin')
   const HtmlWebpackPlugin = require('html-webpack-plugin')
   const MiniCssExtractPlugin = require('mini-css-extract-plugin')
   
   module.exports = {
     // 为了避免代码块太长，这里省略啦其他配置项
     entry: [
       './src/index.js',
       './assets/styles/main.css'
     ],
     plugins: [
       new CleanWebpackPlugin(),
       new MiniCssExtractPlugin(),
       new HtmlWebpackPlugin({
         template: 'index.html'
       })
     ],
     module: {
       rules: [
         // ... 其他已省略
         {
           test: /\.css$/,
           use: [MiniCssExtractPlugin.loader, 'css-loader']
         }
       ]
     }
   }
   ```

#### css-minimizer-webpack-plugin

你或许发现了 `mini-css-extract-plugin` 插件并没有压缩输出的 `css` 文件。之前这个需求我们一般用的 `optimize-css-assets-webpack-plugin` ，但是 webpack 5 及更高版本建议使用了 `css-minimizer-webpack-plugin`。

1. 安装一下

   ```shell
   yarn add -D css-minimizer-webpack-plugin
   ```

2. 配置一下

   ```javascript
   const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
   
   module.exports = {
     // 为了避免代码块太长，这里省略啦其他配置项
     optimization: {
       minimize: true,
       minimizer: [
         new CssMinimizerPlugin(),
       ]
     },
   }
   ```

但是使用它之后出现了一下新问题，那就是之前打包的生成的 `bundle.js` 文件不是之前压缩的样子了，这里设置了 `minimizer` 后需要加上 webpack 5 本身带有的 `terser-webpack-plugin` 优化。

```javascript
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserWebpackPlugin = require("terser-webpack-plugin")

module.exports = {
  // 为了避免代码块太长，这里省略啦其他配置项
  optimization: {
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin(),
      new TerserWebpackPlugin(),
    ]
  },
}
```

另外，`bundle.js` 文件中其实会存在一些项目依赖打包后的 `license` 许可注释，但是我们并不需要它存在，可以这样简单的配置一下 `terser-webpack-plugin` 插件。

```javascript
new TerserWebpackPlugin({
  terserOptions: {
    format: {
      comments: false
    }
  },
  extractComments: false
})
```

#### html-inline-css-webpack-plugin

因为我们需要打包压缩生成好的 `css` 文件直接插入到 `index.html` 文件的 `head` 的 `style` ，而不是使用 `link` 方式，所以我们还可以再使用一个插件 `html-inline-css-webpack-plugin`。

1. 安装一下

   ```shell
   yarn add -D html-inline-css-webpack-plugin
   ```

2. 配置一下

   ```javascript
   const HTMLInlineCSSWebpackPlugin = require('html-inline-css-webpack-plugin').default
   
   module.exports = {
     // 为了避免代码块太长，这里省略啦其他配置项
     plugins: [
       // ...省略了其他项
       new HTMLInlineCSSWebpackPlugin()
     ],
   }
   ```

### 完成需求的 webpack 配置

```javascript
const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const HTMLInlineCSSWebpackPlugin = require('html-inline-css-webpack-plugin').default
const TerserWebpackPlugin = require("terser-webpack-plugin")

module.exports = {
  mode: 'production',
  entry: [
    './src/index.js',
    './assets/styles/main.css'
  ],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: ''
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      template: 'index.html'
    }),
    new HTMLInlineCSSWebpackPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|jpeg|gif|mp3)$/i,
        loader: 'file-loader',
        options: {
          name: '[path][hash:18].[ext]',
          esModule: false
        }
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      }
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin(),
      new TerserWebpackPlugin()
    ]
  },
  resolve: {
    alias: {
      Assets: path.resolve(__dirname, 'assets/')
    }
  }
}
```

## 最后

🦢 Oops！太舒服了，现在只需要 `yarn build` 一下，部署需要的资源就在 `dist` 文件里满意的放着了。