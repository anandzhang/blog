---
typora-root-url: ../
tags: backend
createTime: 2021-01-20
updateTime: 2021-01-20
keywords: express 项目使用 typescript,生成环境是否使用 ts-node 启动 express,ts-node 在 typescript 的 express 生成环境使用
summary: 使用了 TypeScript 的 Express Web 项目，生成环境是否应该使用 ts-node 启动服务呢？
---

# Express TypeScript 项目

## 前言

是否应该在生产环境中使用 `ts-node` 运行服务呢？现在服务端使用 `Express` 搭建了 `web` 服务，项目使用了 `TypeScript` ，开发时使用 `ts-node app.js` 可以十分方便的启动和调试项目，但是 `ts-node` 是否要用在生产环境呢？

找到 `ts-node` 仓库的一个 Issue [Should I use it in production?](https://github.com/TypeStrong/ts-node/issues/104) ，[TypeStrong/ts-node#104 (comment) ](https://github.com/TypeStrong/ts-node/issues/104#issuecomment-337144823) 中提到加载类型信息会存在很大的开销，但是不应该影响性能，一旦启动了就只占用内存。然后又看了下其他来源的回答，我想的是部署到生产环境的代码已经不需要做类型检查这个操作了，所有生产环境启动项目还是使用 `tsc` 编译好的 `js` 文件吧。

## 处理编译后缺失的静态资源

使用 `tsc` 编译后，`Express` 项目的视图文件 `views` 和静态资源 `public` 并不存在编译 `ts` 输出的文件夹内，项目没法正常运行。简单的查看了 `tsconfig.json` 配置选项，没有找到可以自动关联这些资源的配置项，所以就手动复制下。

为了简化这个过程，我们可以写一个简单的 `nodejs` 脚本 `build.ts` 去操作：

```typescript
import { exec } from 'child_process'
import { promisify } from 'util'

(
  async () => {
    try {
      // webpack 打包一下前端资源
      await promisify(exec)('yarn webpack')

      // 先删除之前 tsc 编译生成的文件夹
      await promisify(exec)('rm -rf build')
      // 执行 tsc 进行编译
      await promisify(exec)('yarn tsc')
      // 拷贝静态资源文件夹到 tsc 编译产生到文件夹下
      // 静态文件夹 public、views
      await promisify(exec)('cp -r public views build')
    } catch (error) {
      console.log(error)
    }
  }
)()
```

> `child_process` 是 `Nodejs` 内置的一个模块，可以用来执行 `shell` 命令。
>
> `promisify` 这个工具函数是用来生成 `Promise` 操作，也可以不用这个函数，直接这样使用回调的方式：
>
> ```javascript
> exec('rm -rf build', (error, stdout, stderr) => {
>   if (error) {
>     console.log(stdout, stderr)
>   }
> })
> ```
>
> `Nodejs` 去使用 `shell` 命令还有其他三方包，如：[ShellJs](https://www.npmjs.com/package/shelljs) 等。

然后只需要 `ts-node build.ts` 就可以完成项目需要的编译操作了。

## 补充

1. 这个项目的 `tsconfig.json` 文件

   ```json
   {
       "compilerOptions": {
           "target": "ES2015",
           "module": "commonjs",
           "strict": true,
           "esModuleInterop": true,
           "skipLibCheck": true,
           "forceConsistentCasingInFileNames": true,
           "outDir": "./build",
       },
       "exclude": [
           "node_modules",
           // scripts 文件夹是存放脚本的，包含了上面创建的 build.ts 文件
           // 这个文件夹下的ts文件都是不需要编译的
           "scripts"
       ]
   }
   ```

2. 可以将编译命令添加到 `package.json` 的 `scripts` 字段里方便使用

   ```json
   {
     "scripts": {
       "build": "ts-node scripts/build.ts"
     }
     // 省略了其他配置
   }
   ```

