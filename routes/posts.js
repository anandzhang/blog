const express = require('express')
const router = express.Router()
const Post = require('../models/post')
const md = require('markdown-it')()

router.get('/', (req, res) => {
  Post.find((err, docArr) => {
    docArr.forEach((value) => {
      const time = value.createTime.getFullYear() + '-' + (value.createTime.getMonth() + 1) + '-' + value.createTime.getDate()
      value.createTimeString = time
    })
    res.render('posts', { docArr })
  })
})

router.get('/*/\\d+', (req, res) => {
  Post.findOne({ requestPath: req.originalUrl }, (err, doc) => {
    if (err) return res.status(500).send(err)
    if (!doc) return res.status(404).send('404 文章不存在')
    res.render('post-template', { title: doc.title, content: md.render(doc.content) })
  })
})

module.exports = router