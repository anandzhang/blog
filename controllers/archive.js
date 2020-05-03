const Post = require('../models/post')
const Pagination = require('../utils/Pagination')
const { dbFields, dbSort } = require('../utils/dbParamFactory')

exports.getCategoriesAndTags = async (req, res) => {
  const usefulFields = dbFields(['category', 'tags'])
  try {
    const docs = await Post.find({}, usefulFields)
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
  } catch (err) {
    return res.status(500).send(err)
  }
}

exports.archiveByCategory = async (req, res, next) => {
  const { page, category } = req.query
  if (category) {
    const conditions = { category: { $regex: `${category}/*` } }
    const sort = dbSort('updateTime', 'DESC')
    const pagination = new Pagination(Post)
    const data = await pagination.getPageData(page, conditions, {}, sort)
    const previousUrl = `${req.originalUrl}&page=${data.current - 1}`
    const nextUrl = `${req.originalUrl}&page=${data.current + 1}`
    console.log(data.pagesTotal)
    res.render('posts', { category, route: '/archive', previousUrl, nextUrl, ...data })
  } else {
    next()
  }
}

exports.archiveByTag = async (req, res, next) => {
  const { page, tag } = req.query
  console.log(typeof page)
  if (tag) {
    const conditions = { tags: { $elemMatch: { $eq: tag } } }
    const sort = { updateTime: -1 }
    const pagination = new Pagination(Post)
    const data = await pagination.getPageData(page, conditions, {}, sort)
    const previousUrl = `${req.originalUrl}&page=${data.current - 1}`
    const nextUrl = `${req.originalUrl}&page=${data.current + 1}`
    res.render('posts', { tag, route: '/archive', previousUrl, nextUrl, ...data })
  } else {
    next()
  }
}
