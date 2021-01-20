import Post from '../models/post'
import Pagination from '../utils/Pagination'
import { dbFields, dbSort } from '../utils/dbParamFactory'

export const getCategoriesAndTags = async (req: any, res: any) => {
  const usefulFields = dbFields(['category', 'tags'])
  try {
    const docs = await Post.find({}, usefulFields)
    const data = docs.reduce((pre: any, cur: any) => {
      const { category, tags } = cur
      // 只需要一级目录
      const dir = category.split('/').shift()
      if (!pre.categories.includes(dir)) pre.categories.push(dir)
      // 添加标签
      tags.forEach((tag:any) => {
        if (!pre.tags.includes(tag)) pre.tags.push(tag)
      })
      return pre
    }, { categories: [], tags: [] })
    res.render('archive', { ...data, route: '/archive' })
  } catch (err) {
    return res.status(500).send(err)
  }
}

export const archiveByCategory = async (req: any, res: any, next: any) => {
  const { page, category } = req.query
  if (category) {
    const conditions = { category: { $regex: `${category}/*` } }
    const sort = dbSort('updateTime', 'DESC')
    const pagination = new Pagination(Post)
    const data = await pagination.getPageData(page, conditions, {}, sort)
    const previousUrl = `${req.baseUrl}?category=${category}&page=${+data.current - 1}`
    const nextUrl = `${req.baseUrl}?category=${category}&page=${+data.current + 1}`
    res.render('posts', { category, route: '/archive', previousUrl, nextUrl, ...data })
  } else {
    next()
  }
}

export const archiveByTag = async (req: any, res: any, next: any) => {
  const { page, tag } = req.query
  if (tag) {
    const conditions = { tags: { $elemMatch: { $eq: tag } } }
    const sort = { updateTime: -1 }
    const pagination = new Pagination(Post)
    const data = await pagination.getPageData(page, conditions, {}, sort)
    const previousUrl = `${req.baseUrl}?tag=${tag}&page=${+data.current - 1}`
    const nextUrl = `${req.baseUrl}?tag=${tag}&page=${+data.current + 1}`
    res.render('posts', { tag, route: '/archive', previousUrl, nextUrl, ...data })
  } else {
    next()
  }
}
