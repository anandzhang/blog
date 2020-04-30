/**
 * /posts 路由
 */
const express = require('express')
const router = express.Router()
const controllers = require('../controllers/posts')

router.get('/', controllers.getPosts)

// Eg: /posts/frontend/1
router.get('/*/\\d+', controllers.getPost)

module.exports = router
