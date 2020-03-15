const express = require('express')
const router = express.Router()
const Post = require('../models/post')
const md = require('markdown-it')()
const pagination = require('../utils/pagination')

router.get('/', (req, res) => {
  pagination(+req.query.page, {}, null, { updateTime: -1 }, (err, data) => {
    res.render('posts', data)
  })
})

router.get('/*/\\d+', (req, res) => {
  Post.findOne({ requestPath: req.originalUrl }, (err, doc) => {
    if (err) return res.status(500).send(err)
    if (!doc) return res.status(404).send('404 文章不存在')
    res.render('post-template', {
      title: doc.title,
      description: doc.summary,
      content: md.render(doc.content)
    })
  })
})

module.exports = router