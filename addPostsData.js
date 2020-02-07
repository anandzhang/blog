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
          let data = getDataFromPath(currentPath)
          fs.readFile(currentPath, (err, file) => {
            const result = parseYAMLFrontMatter(file.toString())
            data = Object.assign(data, result)
            new Post(data).save((err, doc) => {
              console.log(doc)
            })
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
 * @return {Object}
 */
function getDataFromPath(fullPath) {
  const category = path.dirname(fullPath).replace(postsDir, '')
  const nameSplit = path.basename(fullPath).split('-')
  const no = nameSplit.shift()
  const requestPath = path.join('/', path.dirname(fullPath), no)
  let title = nameSplit.shift()
  title = title.replace(path.extname(title), '')
  const content = fs.readFileSync(fullPath).toString()
  return { no, title, category, requestPath, content }
}

/**
 * 从 Markdown 文件的 YAML前提 中提取数据
 *
 * @param {String} markdownFileString
 * @return {Object}
 */
function parseYAMLFrontMatter(markdownFileString) {
  const regs = {
    // m 多行搜索、s 允许 . 匹配换行符
    frontMatter: /---\s*(.*?)\s*---\s*/ms,
    // 贪婪匹配拿到需要的数据
    tags: /tags:\s*(.*)/,
    createTime: /createTime:\s*(.*)/,
    updateTime: /updateTime:\s*(.*)/,
    summary: /summary:\s(.*)/
  }
  const frontMatter = markdownFileString.match(regs.frontMatter)[1]
  const tags = frontMatter.match(regs.tags)[1]
  const createTime = frontMatter.match(regs.createTime)[1]
  const updateTime = frontMatter.match(regs.updateTime)[1]
  const summary = frontMatter.match(regs.summary)[1]
  return { tags: tags.split(','), createTime, updateTime, summary }
}

Post.deleteMany({}, err => console.log(err))
readDir(postsDir)