/**
 * /posts 路由
 */
import express from 'express'
import { getPosts, getPost } from '../controllers/posts'

const router = express.Router()

router.get('/', getPosts)

// Eg: /posts/frontend/1
router.get('/*/\\d+', getPost)

export default router
