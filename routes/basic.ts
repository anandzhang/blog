import express, { Request, Response } from 'express'
const router = express.Router()

router.get('/', (req: Request, res: Response) => {
  res.render('index', {
    route: req.path
  })
})

router.get('/about', (req: Request, res: Response) => {
  res.render('about', {
    route: req.path
  })
})

export default router
