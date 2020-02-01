const path = require('path')
const fs = require('fs')
const express = require('express')
const app = express()
const port = 3000

// 静态资源
app.use('/public', express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
  fs.readFile('views/index.html', (err, data) => {
    if (err) return res.status(500).send('index.html error')
    res.send(data.toString())
  })
})

app.get('/posts', (req, res) => {
  fs.readFile('views/posts.html', (err, data) => {
    if (err) return res.status(500).send('posts.html error')
    res.send(data.toString())
  })
})

app.listen(port, () => {
  console.log(`app is running on the http://localhost:${port}`)
})