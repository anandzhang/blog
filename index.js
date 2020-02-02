const path = require('path')
const fs = require('fs')
const express = require('express')
const app = express()
const port = 3000
const Post = require('./models/post')

// 配置模板引擎
app.engine('html', require('express-art-template'))
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

// 静态资源
app.use('/public', express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
  res.render('index')
})

app.get('/posts', (req, res) => {
  Post.find((err, docArr) => {
    docArr.forEach((value) => {
      const time = value.createTime.getFullYear() + '-' + (value.createTime.getMonth() + 1) + '-' + value.createTime.getDate()
      value.createTimeString = time
    })
    res.render('posts', { docArr })
  })
})

app.listen(port, () => {
  console.log(`app is running on the http://localhost:${port}`)
})