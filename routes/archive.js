const express = require('express')
const router = express.Router()
const Post = require('../models/post')
const pagination = require('../utils/pagination')

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
    res.render('archive', { sortByCategory, sortByTag, mainClass: 'archive' })
  })
})

router.get('/category/:category', (req, res) => {
  const pageNumber = +req.query.page
  const { category } = req.params
  const conditions = { category: { '$regex': `${category}/*` } }
  const sort = { updateTime: -1 }
  pagination(pageNumber, conditions, null, sort, (err, data) => {
    res.render('posts', { category, ...data })
  })
})

router.get('/tag/:tag', (req, res) => {
  const pageNumber = +req.query.page
  const { tag } = req.params
  const conditions = { tags: { '$elemMatch': { '$eq': tag } } }
  const sort = { updateTime: -1 }
  pagination(pageNumber, conditions, null, sort, (err, data) => {
    res.render('posts', { tag, ...data })
  })
})

module.exports = router