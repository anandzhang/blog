/**
 * /archive 路由
 */
const express = require('express')
const router = express.Router()
const controllers = require('../controllers/archive')

router.get('/', controllers.getCategoriesAndTags)
router.get('/category/:category', controllers.archiveByCategory)
router.get('/tag/:tag', controllers.archiveByTag)

module.exports = router
