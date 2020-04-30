const Post = require('../models/post')
const pagination = require('../utils/pagination')
const dbFields = require('../utils/dbFields')

exports.getCategoriesAndTags = (req, res) => {
  const usefulFields = dbFields(['category', 'tags'])
  Post.find({}, usefulFields, (err, docs) => {
    if (err) return res.status(500).send(err)
    const data = docs.reduce((pre, cur) => {
      const { category, tags } = cur
      // 只需要一级目录
      const dir = category.split('/').shift()
      if (!pre.categories.includes(dir)) pre.categories.push(dir)
      // 添加标签
      tags.forEach(tag => {
        if (!pre.tags.includes(tag)) pre.tags.push(tag)
      })
      return pre
    }, { categories: [], tags: [] })
    res.render('archive', { ...data, route: '/archive' })
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
