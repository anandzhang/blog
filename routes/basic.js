const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.render('index', {
    mainClass: 'index'
  })
})

router.get('/about', (req, res) => {
  res.render('about', {
    mainClass: 'about'
  })
})

module.exports = router
