/**
 * @file 获得文章标题等数据存入数据库
 */
const fs = require('fs')
const path = require('path')
const Post = require('./models/post')
const postsDir = "posts/";

function readDir(dirPath) {
  fs.readdir(dirPath, (err, files) => {
    if (err) return console.log(err)
    files.forEach((value) => {
      const currentPath = path.join(dirPath, value)
      if (isFile(currentPath)) {
        // 判断是否为 Markdown 文件
        if (path.extname(currentPath) === '.md') {
          const data = getData(currentPath)
          data.createTime = Date.now()
          new Post(data).save((err, doc) => {
            console.log(doc)
          })
        }
      } else {
        readDir(currentPath)
      }
    })
  })
}

function isFile(path) {
  const stat = fs.statSync(path)
  return stat.isFile()
}

/**
 * 从路径中获取文章标题、目录等
 *
 * @param {String} fullPath 从文章所在文件夹根目录起
 */
function getData(fullPath) {
  const category = path.dirname(fullPath).replace(postsDir, '')
  const nameSplit = path.basename(fullPath).split('-')
  const no = nameSplit.shift()
  let title = nameSplit.shift()
  title = title.replace(path.extname(title), '')
  return { no, title, category }
}

readDir(postsDir)