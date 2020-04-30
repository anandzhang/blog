/**
 * 需要显示的数据库字段
 *
 * @param {Array} fields
 * @param {Boolean} showId
 * @return {Object}
 */
module.exports = (fields, hideId = true) => {
  const result = fields.reduce((pre, cur) => {
    pre[cur] = 1
    return pre
  }, {})
  if (hideId) result._id = 0
  return result
}
