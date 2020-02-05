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
  Post.find({ category: { '$regex': `${req.params.category}/*` } }, (err, docArr) => {
    docArr.forEach((value) => {
      const time = value.createTime.getFullYear() + '-' + (value.createTime.getMonth() + 1) + '-' + value.createTime.getDate()
      value.createTimeString = time
    })
    res.render('posts', { docArr })
  })
})

router.get('/tag/:tag', (req, res) => {
  Post.find({ tags: { '$elemMatch': { '$eq': req.params.tag } } }, (err, docArr) => {
    docArr.forEach((value) => {
      const time = value.createTime.getFullYear() + '-' + (value.createTime.getMonth() + 1) + '-' + value.createTime.getDate()
      value.createTimeString = time
    })
    res.render('posts', { docArr })
  })
})

module.exports = router