---
typora-root-url: ../
tags: eslint
createTime: 2020-04-20
updateTime: 2020-04-21
keywords: eslint怎么用,eslint怎么配置,eslint git提交时进行检测
summary: ESLint 怎么使用？如何在 git commit 时强制通过 ESLint 代码检测规则？
---

# 配置使用 ESLint

## 简介

最开始认识 `ESLint` 是在别人的项目中，那时它给我带来了很多的苦恼，完全没有发现它有啥用，也没带来什么便利，只有一堆错误。

最头大的一次是使用 `git commit` 提交代码时出现了一些报错，当时很小白的我真的很蒙蔽，感觉有点莫名奇妙，为什么那么多问题，然后一个一个去修改。而且有一些还不知道怎么修改，真的觉得谁没事弄个这个，很想吐槽。

过了这么长一段时间，我竟然主动往自己的项目中配置它，这就是生活吧，不过现在我会认为 `ESLint` 是一个非常棒的工具，但是，当你在一个写好的项目里添加 `ESLint` 时，还是可以让你崩溃，你会收获一堆 `error` 。

简单的说，`ESLint` 是一套 `javascript` 代码检测规则，避免代码错误，也利于统一团队代码风格。

## 配置

### 1. 安装

```shell
npm i eslint -D
```

`eslint` 作为一个开发依赖，不需要放在生产环境中，所以需要 `--save-dev` （简写：`-D`）保存为开发环境依赖 `devDependencies` 。

### 2. 初始化

```shell
npx eslint --init
```

然后根据向导提示来配置自己需要的代码语法和风格等

```shell
1. How would you like to use ESLint?
// 你想如何使用 ESLint？一般选三个一起
// 检测语法、查找问题、强制代码风格

2. What type of modules does your project use?
// 你项目使用的模块类型？
// JavaScript modules (import/export) Eg: React/Vue等
// CommonJS (require/exports) Eg: Nodejs项目

3. Which framework does your project use?
// 你项目使用的哪一个框架？

4. Does your project use TypeScript?
// 你的项目使用了 TypeScript？

5. Where does your code run?
// 你的代码运行在哪里？一般只需Browser
// 空格键 选中； a 全选；i 反选。
// Browser 浏览器
// Node nodejs环境

6. How would you like to define a style for your project?
// 你想定义一个怎样的代码风格？个人喜欢Standard
// Use a popular style guide 使用一个流行的代码风格
// 包含 Airbnb，Standard，Google 代码规范

7. What format do you want your config file to be in?
// 你想要配置文件保存为哪一个格式？一般选JavaScript
// JavaScript 产生一个 .eslintrc.js 文件
// YAML 产生一个 .eslintrc.yml 文件

8. Would you like to install them now with npm?
// 现在就安装配置的需要的 eslint 插件？一般选Y
```

我自己常用的 `React` 环境 `Standardjs` 代码规范配置

依赖：

```shell
npm i eslint babel-eslint eslint-config-standard eslint-plugin-import eslint-plugin-node eslint-plugin-promise eslint-plugin-react eslint-plugin-standard -D
```

`.eslintrc.js`：

```javascript
module.exports = {
  env: {
    browser: true,
    es6: true
  },
  extends: [
    'plugin:react/recommended',
    'standard'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  plugins: [
    'react'
  ],
  settings: {
    react: {
      version: 'detect'
    }
  },
  ignorePatterns: [
    'src/serviceWorker.js'
  ],
  rules: {
    'no-console': 'error',
    'no-alert': 'error'
  }
}
```

`no-console` 和 `no-alert` 这两个规则我也喜欢，提交代码时经常忘记去掉不需要的 `console.log` 等。特殊情况需要你可以通过行注释来禁用这个规则：

```javascript
/* eslint-disable no-alert, no-console */
console.log("welcome anand's blog")
alert("welcome anand's blog")
```

### 3. 忽略文件或文件夹（可选）

可以在配置文件（.eslintrc.*）中添加 `ignorePatterns` 字段或者创建一个 `.eslintignore` 文件。

 在项目根目录的 `node_modules/` 、`bower_components/` 、`build/` （除了里面的 `index.js` ），这些默认被忽略。

#### ignorePatterns

以 `.eslintrc.js` 为例，我们忽略 `React` 的 `serviceWorker.js` ：

```javascript
module.exports = {
  // 省略其他字段
  ignorePatterns: [
    'src/serviceWorker.js'
  ],
  rules: {}
}
```

#### .eslintignore

写法和 `.gitignore` 类似，`#` 可以进行注释。

```
# React serviceWorker
src/serviceWorker.js
```

### cli

```shell
npx eslint --ignore-pattern <ignore file/dir> <file/dir> 
```

### 4. 使用

```shell
npx eslint <file>
```

`eslint --fix` 对出现的问题尽可能多修复，剩余的问题会进行输出。

`eslint` 后根需要检查的文件就可以了，常用的泛匹配（glob 模式）：

```
*.js 所有js后缀文件，不会匹配子目录
**/*.js 子目录里的js文件
```

```
npx eslint *.js
```

想要匹配所有的 `js` 或 `jsx` 文件，可以使用 `--ext` 参数，比如：

```shell
npx eslint --ext .js,.jsx <dir>
```

## 使用 git hook

绝大多数项目都使用了 `git` 进行团队开发协作，所以在代码提交时要求对代码错误和规范进行检测和修复是必要的。

很多项目都使用了 `husky` 和 `lint-staged` 进行配置，我暂时觉得 `lint-staged` 是不必要的，可能是我没有 `GET` 到它的点吧。

### husky

#### 1. 安装

```shell
npm i husky -D
```

#### 2. 配置

`husky` 的配置可以在 `package.json` 中也可以创建一个 `.huskyrc.js` 或者 `husky.config.js`。

1. `package.json` 添加 `husky` 键：

   ```json
   {
     "name": "demo",
     "version": "1.0.0",
     "description": "",
     "main": "index.js",
     "dependencies": {},
     "devDependencies": {
       "eslint": "^6.8.0",
       "eslint-config-standard": "^14.1.1",
       "eslint-plugin-import": "^2.20.2",
       "eslint-plugin-node": "^11.1.0",
       "eslint-plugin-promise": "^4.2.1",
       "eslint-plugin-react": "^7.19.0",
       "eslint-plugin-standard": "^4.0.1",
       "husky": "^4.2.5",
       "lint-staged": "^10.1.6"
     },
     "husky": {
       "hooks": {
         "pre-commit": "eslint --fix --ext .js,.jsx . && git add ."
       }
     }
   }
   ```

2. `.huskyrc.js` 或者 `husky.config.js` ：

   ```javascript
   const tasks = arr => arr.join(' && ')
    
   module.exports = {
     'hooks': {
       'pre-commit': tasks([
         'eslint --fix --ext .js,.jsx .',
         'git add .'
       ])
     }
   }
   ```

#### 3. 直接提交

有时候往一个写好了的项目中加 `ESLint` ，你会有很多的 `error` 需要处理，但是想先提交代码，后面再对代码问题进行修复，这时你可以添加 `--no-verify` 先提交代码。

```
git commit -m "添加ESLint工具" --no-verify
```

SO：

上面使用的 `pre-commit` ，是在 `git commit` 操作执行之前先执行 `husky` 的任务，使用 `&&` 连接了两个命令，第一个 `eslint` 修复代码问题后仍有报错时就不会执行后面的 `git add` 。

其他的HOOK： [git hook](https://git-scm.com/docs/githooks) 。

## 补充1：没有指定React版本？

运行 `eslint` 后如果存在没有指定 `React` 版本的警告：

```shell
Warning: React version not specified in eslint-plugin-react settings. 
```

在配置文件中添加 `settings` 字段指定 `React` 版本，`detect` 为跟随项目安装的 `React` 版本。

```javascript
module.exports = {
  // 省略其他字段
  settings: {
    react: {
      version: 'detect'
    }
  },
  rules: {}
}
```

## 补充2：React 有些语法特性无法解析

```
class App extends Component {
  state = {}
  // 省略其他
}
```

出现错误：

```
error  Parsing error: Unexpected token =
```

需要使用到 `babel-eslint` 解析器：

```
npm i babel-eslint -D
```

在 `.eslintrc.*` 配置文件中添加 `parser` 字段：

```
parser: 'babel-eslint'
```