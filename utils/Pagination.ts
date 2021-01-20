import Post from '../models/Post'

const pageField = {
  _id: 0,
  title: 1,
  createTime: 1,
  updateTime: 1,
  summary: 1,
  requestPath: 1
}

class Pagination {
  private static pageSize: number = 8

  static async getPagesTotal (conditions: object = {}) {
    const docsTotal = await Post.countDocuments(conditions)
    return Math.ceil(docsTotal / this.pageSize)
  }

  static async getPageData (current = 1, conditions = {}, sort = { updateTime: -1 }) {
    const start = (current - 1) * this.pageSize
    return await Post.find(conditions, pageField).sort(sort).skip(start).limit(this.pageSize)
  }
}

export default Pagination
