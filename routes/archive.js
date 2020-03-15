const express = require('express')
const router = express.Router()
const Post = require('../models/post')

router.get('/', (req, res) => {
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

router.get('/category/:category', (req, res) => {
  Post.countDocuments({ category: { '$regex': `${req.params.category}/*` } }, (err, count) => {
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
    Post.find({ category: { '$regex': `${req.params.category}/*` } }, null, {
      sort: { updateTime: -1 }
    }, (err, docArr) => {
      res.render('posts', { docArr, current, total })
    })
  })
})

router.get('/tag/:tag', (req, res) => {
  Post.countDocuments({ tags: { '$elemMatch': { '$eq': req.params.tag } } }, (err, count) => {
    Post.find({ tags: { '$elemMatch': { '$eq': req.params.tag } } }, (err, docArr) => {
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
      res.render('posts', { docArr, current, total })
    })
  })
})

module.exports = router