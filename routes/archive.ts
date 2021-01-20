/**
 * /archive 路由
 */
import express from 'express'
import {
  archiveByCategory,
  archiveByTag,
  getCategoriesAndTags
} from '../controllers/archive'
const router = express.Router()

router.get('/', archiveByCategory, archiveByTag, getCategoriesAndTags)

export default router
