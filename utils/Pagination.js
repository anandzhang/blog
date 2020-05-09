/**
 * 分页
 *
 * @class Pagination
 */
class Pagination {
  constructor (dataSource, pageSize = 2) {
    this.dataSource = dataSource
    this.pageSize = pageSize
  }

  async getPageData (current = 1, conditions, fields, sort) {
    const docsTotal = await this.dataSource.countDocuments(conditions)
    const pagesTotal = Math.ceil(docsTotal / this.pageSize)
    const start = (current - 1) * this.pageSize
    const pageData = await this.dataSource.find(conditions, fields).sort(sort).skip(start).limit(this.pageSize)
    return { pageData, current, pagesTotal }
  }
}

module.exports = Pagination
