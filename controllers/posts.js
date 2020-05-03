const Post = require('../models/post')
const Pagination = require('../utils/Pagination')
const { dbSort } = require('../utils/dbParamFactory')

exports.getPosts = async (req, res) => {
  const { page } = req.query
  const pagination = new Pagination(Post)
  const data = await pagination.getPageData(page, {}, {}, dbSort('updateTime', 'DESC'))
  const previousUrl = `${req.baseUrl}?&page=${+data.current - 1}`
  const nextUrl = `${req.baseUrl}?&page=${+data.current + 1}`
  res.render('posts', { route: '/posts', previousUrl, nextUrl, ...data })
}

exports.getPost = async (req, res) => {
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
