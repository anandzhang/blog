import { Request, Response } from 'express'
import Post from '../models/Post'
import Pagination from '../utils/Pagination'

export const getPosts = async (req: Request, res: Response) => {
  const { page = 1 } = req.query
  const pagesTotal = await Pagination.getPagesTotal()
  const pageData = await Pagination.getPageData(+page)
  const previousUrl = `${req.baseUrl}?page=${+page - 1}`
  const nextUrl = `${req.baseUrl}?page=${+page + 1}`
  res.render('posts', { route: '/posts', previousUrl, nextUrl, pageData, pagesTotal, current: +page })
}

export const getPost = async (req: Request, res: Response) => {
  try {
    const doc = await Post.findOne({ requestPath: req.originalUrl })
    if (!doc) return res.status(404).send('404 文章不存在')
    res.render('post-template', {
      title: doc.title,
      keywords: doc.keywords,
      description: doc.summary,
      content: doc.content,
      route: '/posts'
    })
  } catch (err) {
    return res.status(500).send(err)
  }
}
