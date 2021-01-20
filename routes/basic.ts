import express from 'express'
const router = express.Router()

router.get('/', (req, res) => {
  res.render('index', {
    route: req.path
  })
})

router.get('/about', (req, res) => {
  res.render('about', {
    route: req.path
  })
})

export default router
