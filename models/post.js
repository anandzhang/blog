const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/blog', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const stringRequired = { type: String, required: true }
const postSchema = new mongoose.Schema({
  no: stringRequired,
  title: stringRequired,
  keywords: stringRequired,
  summary: String,
  category: stringRequired,
  requestPath: stringRequired,
  tags: Array,
  createTime: stringRequired,
  updateTime: stringRequired,
  content: stringRequired
})

module.exports = mongoose.model('Post', postSchema)
