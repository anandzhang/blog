const express = require('express')
const router = express.Router()
const Post = require('../models/post')
const md = require('markdown-it')()

router.get('/', (req, res) => {
  Post.countDocuments({}, function (err, count) {
    const pagesLimit = 10
    let current = +req.query.page || 1
    const total = Math.ceil(count / pagesLimit)
    if (current < 1) {
      current = 1
    }
    if (current > total) {
      current = total
    }
    let docQuery = Post.find({}, null, {
      sort: { updateTime: -1 },
      skip: (current - 1) * pagesLimit,
      limit: pagesLimit
    })
    docQuery.exec((err, docArr) => {
      res.render('posts', { docArr, current, total })
    })
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