const Post = require('../models/post')
const Pagination = require('../utils/Pagination')
const { dbSort } = require('../utils/dbParamFactory')

exports.getPosts = async (req, res) => {
  const page = +req.query.page
  const pagination = new Pagination(Post)
  const data = await pagination.getPageData(page, {}, {}, dbSort('updateTime', 'DESC'))
  res.render('posts', { route: '/posts', ...data })
}

exports.getPost = (req, res) => {
  Post.findOne({ requestPath: req.originalUrl }, (err, doc) => {
    if (err) return res.status(500).send(err)
    if (!doc) return res.status(404).send('404 文章不存在')
    res.render('post-template', {
      title: doc.title,
      keywords: doc.keywords,
      description: doc.summary,
      content: doc.content,
      route: '/posts'
    })
  })
}
