const Post = require('../models/post')
const pageLimit = 10
/**
 * Post 模块的简单的分页
 * 
 * @param {Object} page {pageNumer, pageLimit}
 * @param {Object} conditions 查询条件
 * @param {Object} fields 需要返回的文档字段
 * @param {Object} sort 排序规则
 * @param {Function} callback 回调函数 callback(err, data)
 */
function pagination(pageNumber, conditions, fields, sort, callback) {
  Post.countDocuments(conditions, (err, count) => {
    // 当前页
    let current = +pageNumber || 1
    // 总页数
    const total = Math.ceil(count / pageLimit)
    // 避免人为传来非法数据
    if (current < 1) current = 1
    if (current > total) current = total
    // 分页查询
    const options = {
      skip: (current - 1) * pageLimit,
      limit: pageLimit
    }
    if (sort) options.sort = sort
    Post.find(conditions, fields, options, (err, docs) => {
      callback(err, { docs, current, total })
    })
  })
}
module.exports = pagination