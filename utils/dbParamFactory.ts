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
