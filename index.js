const path = require('path')
const fs = require('fs')
const md = require('markdown-it')()
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
app.use('/images', express.static(path.join(__dirname, 'posts/images')))

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

app.get('/posts/*/\\d+', (req, res) => {
  Post.findOne({ requestPath: req.path }, (err, doc) => {
    if (err) return res.status(500).send(err)
    if (!doc) return res.status(404).send('404 文章不存在')
    res.render('post-template', { title: doc.title, content: md.render(doc.content) })
  })
})

app.get('/archive', (req, res) => {
  Post.find({}, { _id: 0, category: 1, tags: 1 }, (err, docs) => {
    if (err) return res.status(500).send(err)
    const sortByCategory = []
    let sortByTag = []
    docs.forEach((value) => {
      const category = value.category.split('/').shift()
      if (sortByCategory.indexOf(category) < 0) {
        sortByCategory.push(value.category.split('/').shift())
      }
      // 已存在的标签不再重复添加
      value.tags.forEach((value) => {
        if (sortByTag.indexOf(value) < 0) {
          sortByTag.push(value)
        }
      })
    })
    res.render('archive', { sortByCategory, sortByTag })
  })
})

app.get('/archive/category/:category', (req, res) => {
  Post.find({ category: { '$regex': `${req.params.category}/*` } }, (err, docArr) => {
    docArr.forEach((value) => {
      const time = value.createTime.getFullYear() + '-' + (value.createTime.getMonth() + 1) + '-' + value.createTime.getDate()
      value.createTimeString = time
    })
    res.render('posts', { docArr })
  })
})

app.get('/archive/tag/:tag', (req, res) => {
  Post.find({ tags: { '$elemMatch': { '$eq': req.params.tag } } }, (err, docArr) => {
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