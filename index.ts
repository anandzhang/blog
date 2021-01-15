import Database from './utils/Database'

const path = require('path')
const express = require('express')
const app = express()
const port = 3000

// 配置模板引擎
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

// 静态资源
app.use('/public', express.static(path.join(__dirname, 'public')))
app.use('/', express.static(path.join(__dirname, 'public/root')))
app.use('/images', express.static(path.join(__dirname, 'posts/images')))

// 加载路由
app.use(require('./routes/basic'))
app.use('/posts', require('./routes/posts'))
app.use('/archive', require('./routes/archive'))

Database.connect(() => {
  app.listen(port, () => {
    console.log(`app is running on the http://localhost:${port}`)
  })
})
