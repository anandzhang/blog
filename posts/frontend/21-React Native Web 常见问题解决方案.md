---
typora-root-url: ../
tags: react-native
createTime: 2021-09-15
updateTime: 2021-09-15
keywords: react-native-web,react-native-web问题,react-native-web Cannot read properties of undefined style,Buffer is not defined
summary: 解决在使用 react-native-web 对原有 react-native 项目提供网页端支持时遇到的一些问题。
---

# React Native Web 常见问题解决方案

## 前言

总结一下在给公司 `react-native` 项目使用 `react-native-web` 添加网页端支持时遇到的一些问题，至于添加 WEB 支持的方案可查看 [如何让 React Native 项目支持 WEB 网页端](https://anandzhang.com/posts/frontend/20)。

## undefined (reading 'style')

```
Uncaught TypeError: Cannot read properties of undefined (reading 'style')
```

`webpack` 构建时没有输出错误，在浏览器的日志中提示不能在 `undefined` 上读取 `style` 属性。

这是由于 `react-native` 0.62 版本移出了 `propTypes` ，可见 [0.62 Breaking changes](https://reactnative.dev/blog/2020/03/26/version-0.62#breaking-changes) ，因此 `react-native-web` 也同样移出了 `propTypes` 。

所以 `ViewPropTypes` 、`Text.propTypes` 等都是不存在的，而一些三分包中并没有跟随着改变，就导致了这个问题，比如 `react-native-easy-toast 2.0` 库中：

```javascript
import {
    View,
    ViewPropTypes as RNViewPropTypes,
} from 'react-native'
const ViewPropTypes = RNViewPropTypes || View.propTypes;

Toast.propTypes = {
    // ViewPropTypes 为 undefined
    style: ViewPropTypes.style,
}
```

### 解决方案

修改 `react-native-web` 依赖包中的文件，添加需要的 `propTypes` ，例子可见 [react-native-web-example/patches](https://github.com/anandzhang/react-native-web-example/blob/main/patches/react-native-web%2B0.17.1.patch) 。

1. `node_modules/react-native-web/dist/index.js` 中添加导出：

   ```javascript
   export const ViewPropTypes = { style: () => {} };
   ```

2. `node_modules/react-native-web/dist/exports/Image/index.js` 中添加：

   ```javascript
   Image.propTypes = { style: () => {}, source: () => {}};
   ```

3. `node_modules/react-native-web/dist/exports/Text/index.js` 中添加：

   ```javascript
   Text.propTypes = { style: () => {} };
   ```

推荐使用 `patch-package` 创建补丁文件，方便管理依赖包的修改。

1. 安装 `patch-package` 依赖

   ```shell
   npm i patch-package
   ```

   > 或 `yarn add patch-package` 。

2. 创建补丁文件

   ```shell
   npx patch-package react-native-web
   ```

   > 或 `yarn patch-package react-native-web` 。

更多使用请看它的官方文档 [patch-package](https://github.com/ds300/patch-package) 。

## `__DEV__` is not defined

```
Uncaught ReferenceError: __DEV__ is not defined
```

一些依赖库使用到 `__DEV__` 的环境变量，如`react-native-gesture-handler` 库，在 `react-native` 中它是存在的，但是我们用 `webpack` 打包时没有定义这个变量，所以我们添加一下配置就可以了。

### 解决方案

在 `webpack` 配置文件添加 `DefinePlugin` 插件来定义 `__DEV__` 变量：

```javascript
const webpack = require('webpack')

return {
    // 省略其他设置
    plugins: [
        new webpack.DefinePlugin({
            __DEV__: true
        }),
    ],
}
```

你也可以根据 `process.env.NODE_ENV` 去设置 `__DEV__` 的值，不过影响并不大。

## 图片不显示

在 `react-native` 运行原生应用时正常显示，但是网页端不显示，主要是因为在使用 `Image` 组件时没有设置图片的宽高属性，或者在 `webpack` 的图片加载器没有设置 `esModule: false` 。

### 解决方案

建议在 `webpack` 解析图片时直接使用 `react-native-web-image-loader` 加载器，它可以将图片素材解析成 `react-native` 需要的对象，包含了 `width` 、`height` 等属性。

```javascript
return {
    // 省略其他配置
    module: {
        rules: [
            {
                test: /\.(png|jpe?g|gif)$/,
                options: {
                    name: '[name].[hash:8].[ext]',
                    outputPath: 'images',
                    scalings: { '@2x': 2, '@3x': 3 },
                    esModule: false,
                },
                loader: 'react-native-web-image-loader',
            }
        ],
    },
}
```

## 样式失效或异常

网页端显示效果和原生APP显示不一样，或者从 `StyleSheet.create` 创建的样式对象取值报错，这是因为 `react-native-web` 解析 `StyleSheet.create` 方法创建的样式后是一个样式 `id` ，是一个 `number` 数字并不是对象，请看下方例子：

```javascript
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    textWrapper: {
        width: 100
    }
})

const Example = () => {
    console.log(styles.container)
    // WEB 输出: number
    // Native 输出: {"flex": 1}

    const { width } = styles.textWrapper
    console.log(width)
    // WEB: undefined
    // Native: 100

    return (
        <View style={styles.container}>
            <Text style={styles.textWrapper}>
                Hello, Anand's Blog!
            </Text>
        </View>
    )
}

export default Example
```

在 `react-native-web` 上 `StyleSheet.create` 返回的是一个样式对象的 `id` ，是为了优化性能。

### 解决方案

所以，如果项目存在从样式对象里取值，你需要使用 `StyleSheet.flatten` 方法包裹一下：

```javascript
console.log(StyleSheet.flatten(styles.container))
// WEB、Native: {"flex": 1}

const { width } = StyleSheet.flatten(styles.textWrapper)
console.log(width)
// WEB、Native: 100
```

`StyleSheet.flatten` 方法可以让样式 `id` 取得真正的样式对象。

## 使用 Nodejs 内建模块

比如公司的项目使用了 `jwt-simple` 库，这个库用到了 `crypto` 模块，就需要让网页上也能使用，通常使用 `crypto-browserify` 就可以了。

### 解决方案

`webpack 5` 不会自动添加 `node` 的内建模块，我们通过配置 `fallback` 进行添加。

```javascript
return {
    // 省略其他配置
    resolve: {
        fallback: {
            crypto: require.resolve('crypto-browserify'),
            // 我的项目在处理 crypto 时，还用到了 stream 和 vm
            stream: require.resolve('stream-browserify'),
            vm: require.resolve("vm-browserify"),
        },
        extensions: ['.web.js', '.js'],
    },
}
```

自己安装下用到的依赖，另外，如果使用了 `rn-nodeify` 对依赖进行了 `hack` 的话，在运行网页端时需要重新装依赖。

## Buffer is not defined

```
Uncaught ReferenceError: Buffer is not defined
```

### 解决方案

使用 `webpack` 提供的 `ProvidePlugin` 插件配置一下，让项目使用 `Buffer` 时调用依赖 `buffer` 库的 `Buffer` 对象。

```javascript
return {
    plugins: [
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
            process: 'process/browser',
        }),
    ],
}
```

## 字体资源缺失

比如依赖库 `react-native-vector-icons` 会使用到 `ttf` 字体进行图标显示，如果缺失字体就会只显示一个方块。

### 解决方案

首先我们需要将字体文件通过 `copy-webpack-plugin` 插件拷贝到打包后到文件夹里让网页端可以请求到。

```javascript
return {
    // 省略其他配置
    plugins: [
        new CopyPlugin({
            patterns: [
                // 添加用到的字体，或者直接将 Fonts 文件夹全拷贝过来
                { from: getResolvePath('node_modules/react-native-vector-icons/Fonts/Ionicons.ttf') },
                { from: getResolvePath('node_modules/react-native-vector-icons/Fonts/MaterialIcons.ttf') },
            ],
        }),
    ],
}
```

然后在项目引入的 `index.css` 文件添加 `@font-face` :

```javascript
// index..web.js
import 'index.css'
```

```css
/* index.css */
@font-face {
    src: url(/Ionicons.ttf);
    font-family: Ionicons;
}
```

## Alert 方法无效

到现在 `react-native-web 0.17.1` 版本，`Alert` 方法也是没用实现的，是一个空壳，可见 [react-native-web#1026](https://github.com/necolas/react-native-web/issues/1026) 状态，所以你在使用 `Alert.alert` 这些方法时，实际是没用任何作用的。

### 解决方案

我们可以自己实现一个简单的 `Alert` 或者使用另外一个代替 `react-native-web` 的 `Alert` 。因为使用 `alert` 方法会阻塞应用，不推荐使用，我们可以使用 `Modal` 组件进行显示。

首先修改 `webpack` 配置，通过 `alias` 别名让使用 `Alert` 时不使用 `react-native-web` 库导出的，而使用我们自定义的组件。

```javascript
return {
    resolve: {
        alias: {
            // 省略其他
            'react-native-web/dist/exports/Alert': resolvePath('web/polyfills/Alert')
        },
    },
}
```

实现一个简单的 `Modal` 组件，可参考 [react-native-web-example](https://github.com/anandzhang/react-native-web-example) 案例。

