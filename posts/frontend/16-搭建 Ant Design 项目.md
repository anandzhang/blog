---
typora-root-url: ../
tags: antd
createTime: 2020-04-20
updateTime: 2020-04-20
keywords: antd怎么用 ant design怎么使用,ant design怎么按需加载
summary: 使用 create-react-app 脚手架创建 Ant Design 项目，并配置好 antd 的按需加载。
---

# 搭建 Ant Design 项目

## 简介

使用 `create-react-app` 脚手架搭建 `React + Antd`  项目，并配置好 `Ant Design` 的按需加载。

[Ant Design官方文档](https://ant.design/docs/react/use-with-create-react-app-cn) 中在 `create-react-app` 中使用 `antd` 的教程写的太散了，每次创建一个 `antd` 项目需要的操作有点麻烦，一会儿 `+` 一会`-` ，那我直接把官方教程的步骤全部提出来，方便以后创建 `antd` 项目。

## 搭建

### 1. 创建 React 项目

```shell
create-react-app ant-demo
```

没有安装 `create-react-app` 需要先安装 `npm i -g create-react` 。

然后进入到创建的项目内 :

```shell
cd ant-demo
```

### 2. 安装所有需要的依赖

```shell
npm i antd react-app-rewired customize-cra babel-plugin-import
```

> `react-app-rewired` 用来自定义 `create-react-app` 配置
>
> `customize-cra` 是 `react-app-rewired` 版本关系需要
>
> `babel-plugin-import` 用于按需加载组件代码和样式

### 3. 自定义配置

1. 修改 `package.json` 文件的 `script` ：

   ```json
   {
     // 省略其他键
     "scripts": {
       "start": "react-app-rewired start",
       "build": "react-app-rewired build",
       "test": "react-app-rewired test",
       "eject": "react-scripts eject"
     }
   }
   ```

2. 项目根目录（和 `package.json` 平级）创建 `config-overrides.js` 用来自定义配置：

   ```javascript
   const { override, fixBabelImports } = require('customize-cra')
   
   module.exports = override(
     fixBabelImports('import', {
       libraryName: 'antd',
       libraryDirectory: 'es',
       style: 'css',
     })
   )
   ```

### 4. 使用 Antd

在 `App.js` 组件中使用 `antd` ，然后 `npm start` 启动项目，`antd` 组件的 `js` 和 `css` 代码都会按需加载了。

```jsx
import React from 'react'
import { Button } from 'antd'

function App() {
  return (
    <Button type='primary'>Hello</Button>
  )
}

export default App
```