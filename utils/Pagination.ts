/**
 * 分页
 *
 * @class Pagination
 */
class Pagination {
  dataSource: any
  pageSize: any
  constructor (dataSource: any, pageSize = 8) {
    this.dataSource = dataSource
    this.pageSize = pageSize
  }

  async getPageData (current = 1, conditions: any, fields: any, sort: any) {
    const docsTotal = await this.dataSource.countDocuments(conditions)
    const pagesTotal = Math.ceil(docsTotal / this.pageSize)
    const start = (current - 1) * this.pageSize
    const pageData = await this.dataSource.find(conditions, fields).sort(sort).skip(start).limit(this.pageSize)
    return { pageData, current, pagesTotal }
  }
}

export default Pagination
