/**
 * 需要显示的数据库字段
 *
 * @param {Array} fields
 * @param {Boolean} showId
 * @return {Object}
 */
exports.dbFields = (fields, hideId = true) => {
  const result = fields.reduce((pre, cur) => {
    pre[cur] = 1
    return pre
  }, {})
  if (hideId) result._id = 0
  return result
}

/**
 * 按字段进行升/降序
 *
 * @param {Array} field
 * @param {String} mode 'ASC', 'DESC'
 * @return {Object}
 */
exports.dbSort = (field, mode = 'ASC') => {
  if (mode === 'ASC') return { [field]: 1 }
  else return { [field]: -1 }
}
