---
typora-root-url: ../
tags: express
createTime: 2020-04-19
updateTime: 2020-04-19
keywords: express 上传文件,express怎么上次文件,multer怎么使用
summary: Ant Design的Upload组件怎么上传图片到服务端，使用Nodejs Express搭建一个服务端。
---

# Antd 4 Upload 图片上传（后端篇）

## 简介

这篇文章是 [Antd 4 Upload 图片上传（前端篇）](https://anandzhang.com/posts/frontend/14) 的后续，使用 `nodejs` 的 `express` 搭建服务端，使用 `multer` 处理文件上传，将前端上传的文件保存到服务端。

## 实现

创建一个新的文件夹作为后端服务：

1. 初始化 `npm` 

   ```shell
   npm init -y
   ```

2. 安装 `express` 和 `multer` 

   ```shell
   npm i express multer
   ```

### 运行简单的服务

创建入口文件 `index.js` ，创建一个简单的 `Web` 服务：

```javascript
const express = require('express')
const app = express()
const port = 8000

app.listen(port, () => {
  console.log(`http://localhost:${port}`)
})
```

### CORS 和 路由

#### 1. CORS 跨域

由于前后端运行在不同的端口上，属于跨域请求，我就直接在后端做操作吧。

首先前端使用了 `Ant Design` 的 `Upload` 组件，它的 `action` 属性是通过 `POST` 请求提交 `FormData` 数据，并且带有 `x-requested-with` 请求头，那么我们先处理 `OPTION` 检请求：

```javascript
// 处理所有的 OPTIONS 预检请求
app.options('*', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
  res.setHeader('Access-Control-Allow-Headers', 'x-requested-with')
  next()
})
```

然后在写一个用来允许跨域的中间件 `cors` ：

```javascript
// 跨域中间件
const cors = (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
  next()
}
```

#### 2. 路由

我们先定义好一个 `multer` 用来文件上传的中间件，创建好文件夹 `public` ，还有子文件夹 `uploads` ：

```javascript
const path = require('path')
const multer = require('multer')
const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      // 上传文件存在 public/uploads 下
      cb(null, 'public/uploads')
    },
    filename(req, file, cb) {
      // 使用时间戳作为上传的文件名
      const extname = path.extname(file.originalname)
      cb(null, Date.now() + extname)
    }
  })
})
```

然后添加前端请求的 `/upload` 路由来处理文件上传，给前端返回 `JSON` 数据，数据包含上传文件的文件名以及该文件在服务端的存储位置。

```javascript
// 使用前面定义好的 cors 中间件和 upload 中间件
app.post('/upload', cors, upload.single('file'), (req, res) => {
  const { file: { filename, path } } = req
  res.json({
    ok: true,
    message: '图片上传成功',
    data: {
      name: filename,
      url: path
    }
  })
})
```

然后我们还需要让这些上传的静态资源可以访问：

```javascript
app.use('/public', express.static(path.join(__dirname, 'public')))
```

### 错误处理

比如前面的中间件 `upload` 出现错误，我们可以在路由后面添加一个错误处理，返回给前端。

```javascript
// 处理前面发生的错误
app.use((err, req, res, next) => {
  console.log(err + '')
  res.json({
    ok: false,
    message: '服务器错误'
  })
})
```

### 补充：删除文件

添加一个删除上传的文件的API：

```javascript
const fs = require('fs')

// 客户端请求体的JSON
app.use(express.json())

// delete删除请求
app.delete('/delete', cors, async (req, res,next) => {
  const { path } = req.body
  fs.unlink(path, (err) => {
    if (err) return next(err)
    res.json({
      ok: true,
      message: '删除图片成功'
    })
  })
})
```

这个路由使用了 `DELETE` 请求方法，而且传了 `JSON` 数据，我们需要修改下 `OPTIONS` 处理的响应头：

```javascript
app.options('*', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
  // 追加允许的请求方法
  res.setHeader('Access-Control-Allow-Methods', 'POST, DELETE')
  // 客户端发了JSON 追加允许的请求头 Content-Type
  res.setHeader('Access-Control-Allow-Headers', 'x-requested-with,Content-Type')
  next()
})
```

## 完整代码

```javascript
const express = require('express')
const app = express()
const port = 8000
const path = require('path')
const multer = require('multer')
const fs = require('fs')

// 文件上传
const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      // 上传文件存在 public/uploads 下
      cb(null, 'public/uploads')
    },
    filename(req, file, cb) {
      // 使用时间戳作为上传的文件名
      const extname = path.extname(file.originalname)
      cb(null, Date.now() + extname)
    }
  })
})

// 静态资源
app.use('/public', express.static(path.join(__dirname, 'public')))

// 处理所有的 OPTIONS 预检请求
app.options('*', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
  // 追加允许的请求方法
  res.setHeader('Access-Control-Allow-Methods', 'POST, DELETE')
  // 客户端发了JSON 追加允许的请求头 Content-Type
  res.setHeader('Access-Control-Allow-Headers', 'x-requested-with,Content-Type')
  next()
})

// 跨域中间件
const cors = (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
  next()
}

// 使用前面定义好的 cors 中间件和 upload 中间件
app.post('/upload', cors, upload.single('file'), (req, res) => {
  const { file: { filename, path } } = req
  res.json({
    ok: true,
    message: '图片上传成功',
    data: {
      name: filename,
      url: path
    }
  })
})

// 解析客户端请求的JSON数据
app.use(express.json())

// 删除文件
app.delete('/delete', cors, async (req, res, next) => {
  // const { path } = req.body
  const path = '11'
  fs.unlink(path, (err) => {
    if (err) return next(err)
    res.json({
      ok: true,
      message: '删除图片成功'
    })
  })
})

// 处理前面发生的错误
app.use((err, req, res, next) => {
  console.log(err + '')
  res.json({
    ok: false,
    message: '服务器错误'
  })
})

app.listen(port, () => {
  console.log(`http://localhost:${port}`)
})
```

