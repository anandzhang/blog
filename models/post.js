const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/blog', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  summary: String,
  category: Array,
  tags: Array,
  createTime: {
    type: Date,
    required: true
  },
  updateTime: Date
})

module.exports = mongoose.model('Post', postSchema)