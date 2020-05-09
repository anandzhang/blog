/**
 * /archive 路由
 */
const express = require('express')
const router = express.Router()
const {
  archiveByCategory,
  archiveByTag,
  getCategoriesAndTags
} = require('../controllers/archive')

router.get('/', archiveByCategory, archiveByTag, getCategoriesAndTags)

module.exports = router
