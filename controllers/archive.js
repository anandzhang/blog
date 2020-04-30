const Post = require('../models/post')
const pagination = require('../utils/pagination')
const dbFields = require('../utils/dbFields')

exports.getCategoriesAndTags = (req, res) => {
  const usefulFields = dbFields(['category', 'tags'])
  Post.find({}, usefulFields, (err, docs) => {
    if (err) return res.status(500).send(err)
    const sortByCategory = []
    const sortByTag = []
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
    res.render('archive', { sortByCategory, sortByTag, route: '/archive' })
  })
}

exports.archiveByCategory = (req, res) => {
  const pageNumber = +req.query.page
  const { category } = req.params
  const conditions = { category: { $regex: `${category}/*` } }
  const sort = { updateTime: -1 }
  pagination(pageNumber, conditions, null, sort, (err, data) => {
    if (err) console.log(err)
    res.render('posts', { category, route: '/archive', ...data })
  })
}

exports.archiveByTag = (req, res) => {
  const pageNumber = +req.query.page
  const { tag } = req.params
  const conditions = { tags: { $elemMatch: { $eq: tag } } }
  const sort = { updateTime: -1 }
  pagination(pageNumber, conditions, null, sort, (err, data) => {
    if (err) console.log(err)
    res.render('posts', { tag, route: '/archive', ...data })
  })
}
