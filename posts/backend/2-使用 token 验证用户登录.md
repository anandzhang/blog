---
typora-root-url: ../
tags: backend
priority: 0.9
createTime: 2020-03-26
updateTime: 2020-04-01
keywords: 用户登录验证,token用户登录验证,express设置token验证
summary: 前后端详解如何使用token来做用户登录验证。文章用了bcrypt对用户密码加密，jsonwebtoken颁发token等。
---

# 使用 token 验证用户登录

## 简介

日常开发中经常需要对用户的登录状态进行记录和验证，让用户登录后能保持一段时间的登录状态，让用户能访问自己的用户信息等。

这篇文章主要讲解使用 token 的方式如何做到用户登录验证，文章案例的后端使用了 `nodejs` 的 `express`，前端使用了 `fetch` 请求。

## 服务端

### 依赖

```shell
npm i express mongoose bcrypt jsonwebtoken
```

### 用户模型

定义一个 `mongoose` 的用户模型 `user model`，在 `MongoDB` 中存用户数据。

```javascript
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
mongoose.connect('mongodb://localhost/manage', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
})

const requiredString = {
  type: String,
  required: true
}

const userSchema = mongoose.Schema({
  username: {
    unique: true,
    ...requiredString
  },
  password: {
    set(value) {
      // 存密码时做加密
      // 参数：(散列值, 强度)
      return bcrypt.hashSync(value, 10)
    },
    ...requiredString
  }
})

module.exports = mongoose.model('User', userSchema)
```

### Express 结构

```javascript
const express = require('express')
// bcrypt 用于用户密码加密
const bcrypt = require('bcrypt')
// jsonwebtoken 用于颁发token
const jwt = require('jsonwebtoken')
// User 是 mongoose 的一个 model，用于存用户信息
const User = require('./models/user')
const app = express()
const port = 8000
// secret 是后面用于token的加密密钥
// 这只是案例，实际项目别放这
const secret = 'dflglrsgiv879grejh'

app.use(express.json())

// 案例后面的路由抽离于此处

app.listen(port, () => {
  console.log(`http://localhost:${port}`)
})
```

### CORS 跨域

为了方便我们就做一个简单的方法解决跨域问题，实际开发中会用到 `cors` 这个express的中间件。

对所有 `OPTINOS` 请求进行处理，`OPTIONS` 是预检请求

```javascript
app.options('*', (req, res, next) => {
  // 允许所有来源（跨域请求）
  res.setHeader('Access-Control-Allow-Origin', '*')
  // 允许携带的请求头
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  next()
})

const cors = (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  next()
}
```

### 用户注册

`/register` 路由往数据库中存放用户信息。前端发送POST请求，传入用户名和密码。

```javascript
app.post('/register', cors, async (req, res) => {
  const { username, password } = req.body
  try {
    // 添加用户
    const user = await User.create({ username, password })
    res.json({
      ok: true,
      data: user
    })
  } catch (err) {
    // 错误处理
    res.json({
      ok: false,
      message: '该用户已存在'
    })
  }
})
```

### 用户登录

`/login` 路由进行用户登录。前端发送POST请求，传入用户名和密码。

用户登录需要做的操作：

1. 判断这个用户是否存在
2. 判断用户输入的密码是否正确
3. 颁发 token，这里把 `token` 返回给前端自己进行处理

```javascript
app.post('/login', cors, async (req, res) => {
  const { username, password } = req.body
  // 1. 用户存在?
  const user = await User.findOne({ username })
  if (!user) {
    return res.json({
      ok: false,
      message: '用户名不存在'
    })
  }
  // 2. 密码正确
  // 进行bcrypt密文比对，这里用了同步。参数：(明文, 密文)
  const isPasswordValid = bcrypt.compareSync(
    password,
    user.password
  )
  if (!isPasswordValid) {
    return res.json({
      ok: false,
      message: '密码错误'
    })
  }
  // 3. 生成token
  // 用户的id唯一标识进行token颁发
  // 参数：（加密的字符串/对象，自定义加密的密钥）
  const token = jwt.sign(
    { id: user._id },
    secret
  )
  res.json({
    ok: true,
    data: { user, token }
  })
})
```

### 验证用户登录

比如：`/profile` 这个路由需要用户验证才能获得数据。前端发送 `GET` 请求，添加 `Authorization` 请求头放入前面用户登录时返回的 `token`。

#### `auth` 中间件

将用户验证抽离成一个express中间件，这样在之后需要对用户登录状态进行验证的路由添加 `auth` 这个中间件就行了。

```javascript
const auth = async (req, res, next) => {
  // 从前端发来的请求头中拿到 Authorization
  const { authorization } = req.headers
  // 没传？
  if (authorization) {
    // 拿到前端传来的token
    const token = authorization.split(' ').pop()
    // 使用 jsonwebtoken 进行验证拿到之前颁发token时传入的用户id
    const { id } = jwt.verify(token, secret)
    // 使用id查询用户
    try {
      req.user = await User.findById(id)
      // 拿到了user放到request对象里，并使用next()方法转接到下一个中间件进行处理
      next()
    } catch (error) {
      res.json({
        ok: false,
        message: 'token无效'
      })
    }
  } else {
    res.json({
      ok: false,
      message: '请设置token'
    })
  }
}
```

#### `/profile` 路由

在处理前传了两个中间件， `cors` 用于跨域处理，`auth` 做了用户验证。

```javascript
app.get('/profile', cors, auth, async (req, res) => {
  res.json({
    ok: true,
    data: req.user
  })
})
```

## 客户端

这里使用 `fetch` 方法来发送请求，同样的你可以使用 `XMLHttpRequest` 、`Axios` 等都可以。

### 后端 API

```javascript
const serverURL = 'http://localhost:8000'
const registerURL = `${serverURL}/register`
const loginURL = `${serverURL}/register`
const profileURL = `${serverURL}/register`
```

### 注册用户

向 `registerURL` 后端的登录 `API` 发送 `POST` 请求，传了 `json` 格式用户名和密码。

```javascript
fetch(registerURL, {
  method: 'POST',
  body: JSON.stringify({
    username: 'user',
    password: '1234'
  }),
  headers: new Headers({
    'Content-Type': 'application/json'
  })
})
  .then(res => res.json())
  .then(json => console.log(json))
```

### 登录用户

向 `loginURL` 后端的登录 `API` 发送 `POST` 请求，传了 `json` 格式用户名和密码。

```javascript
fetch(loginURL, {
  method: 'POST',
  body: JSON.stringify({
    username: 'user',
    password: '1234'
  }),
  headers: new Headers({
    'Content-Type': 'application/json'
  })
})
  .then(res => res.json())
  .then(json => console.log(json))
```

### 用户信息

后端的对 `/profile` 做了用户登录验证，我们就需要按照要求在请求头中添加 `Authorization` 字段来传 `token` 给后端去做验证。

 `Authorization` 请求头的 `type` 类型 `Bearer` 在 `OAuth 2.0` 中进行了相应的说明。

```javascript
const token = ''
fetch(profileURL, {
  method: 'GET',
  headers: new Headers({
    'Authorization': `Bearer ${token}`
  })
})
  .then(res => res.json())
  .then(json => console.log(json))
```

## 补充：服务端直接设置 Cookie

通常情况后端都不会把 `token` 交给前端来处理，让前端自己去存放和删除。下面就使用简单的例子说明通过后端来设置 `cookie` 并且从 `cookie` 中做用户登录验证。

### 服务端

#### CORS 跨域

在跨域的情况下，前端的请求不会自动带上 `cookie` 传递给后端，那么前端需要设置 `Credentials` 字段做相应的处理。

这时后端同样需要添加额外的相应头 `Access-Control-Allow-Credentials` 为 `true`，而且 `Access-Control-Allow-Origin` 不允许再设为 `*` 所有域，这里假设前端运行在 `3000` 端口上。

```javascript
app.options('*', (req, res, next) => {
  // 允许的源不能再是 *
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
  // 允许携带Cookie
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  next()
})

const cors = (req, res, next) => {
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
  next()
}
```

#### 用户登录

这时用户登录返回到前端的结果中就不要有 `token` 字段了，我们直接把 `token` 通过响应头 `Set-Cookie` 设置到 `cookie` 中。

在 `express` 中提供了 `Respone.cookie()` 这个方法去设置 `cookie` ，这样就变得十分方便。

你仍然可以使用 `res.setHeader('Set-Cookie', 'user=dssfrgsrgh; path=/; HttpOnly')` 这样的方式在 `express` 中设置响应头去设置 `Cookie` 。

```javascript
app.post('/login', cors, async (req, res) => {
  // ...省略部分代码
  // 3. 生成token
  const token = jwt.sign(
    { id: user._id },
    secret
  )

  // => 不再返回给客户端token让客户端处理
  // res.json({
  //   ok: true,
  //   data: { user, token }
  // })

  // => 把token颁发到cookie
  res.cookie('user', token, {
    httpOnly: true
  })
  res.json({
    ok: true,
    data: user
  })
})
```

#### 用户信息

我们就不再需要从 `Authorization` 请求头中拿 `token` 了，现在就要从 `cookie` 中获得 `token` 。

```javascript
const auth = async (req, res, next) => {
  const { cookie } = req.headers
  // 没有任何 Cookie?
  if (cookie) {
    // 使用一个简单的正则拿到token
    let matchReg = /user=(.*?);/
    // 只有一个cookie就贪婪匹配
    if (cookie.split(';').length === 1) {
      matchReg = /user=(.*)/
    }
    const matchResult = cookie.match(matchReg)
    // 没有token？
    if (matchResult) {
      const token = matchResult[1]
      const { id } = jwt.verify(token, secret)
      // 查询用户
      try {
        req.user = await User.findById(id)
        next()
      } catch (err) {
        res.json({
          ok: false,
          message: 'token无效'
        })
      }
    } else {
      res.json({
        ok: false,
        message: '请先登录'
      })
    }
  } else {
    res.json({
      ok: false,
      message: '没有Cookie'
    })
  }
}

app.get('/profile', cors, auth, async (req, res) => {
  res.json({
    ok: true,
    data: req.user
  })
})
```

### 客户端

#### 用户登录

现在前端的登录请求不会拿到 `token` ，也就不再需要对 `token` 进行存放、删除等操作了。

发送 `POST` 请求，跨域携带 `cookie` 。

`fetch` 方法在跨源请求中携带 `cookie` 需要设置 `credentials` 字段。

另外，对于 `axios` 就是 `withCredentials` 字段。

```javascript
fetch(loginURL, {
  method: 'POST',
  body: JSON.stringify({
    username: 'user',
    password: '1234'
  }),
  credentials: 'include'
})
```

#### 需要授权的请求

发送 `GET` 请求，跨域携带 `cookie` 。

```javascript
fetch(profileURL, { credentials: 'include' })
```

