/**
 * 需要显示的数据库字段
 *
 * @param {Array} fields
 * @param {Boolean} showId
 * @return {Object}
 */
export const dbFields = (fields: any, hideId = true) => {
  const result = fields.reduce((pre: any, cur: any) => {
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
export const dbSort = (field: any, mode = 'ASC') => {
  if (mode === 'ASC') return { [field]: 1 }
  else return { [field]: -1 }
}
