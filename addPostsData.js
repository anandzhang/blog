const fs = require('fs')
const path = require('path')
const Post = require('./models/post')
const md = require('./utils/markdown')
const postsDirectory = './posts'
const skipDirectories = ['images']

const traverseDirectory = async (directory, skipDirectories) => {
  const dir = await fs.promises.opendir(directory)
  for await (const dirent of dir) {
    const { name } = dirent
    if (dirent.isFile() && path.extname(name) === '.md') {
      const doc = parseMarkdown(name, directory)
      new Post(doc).save((err, doc) => {
        if (err) throw new Error(err)
        console.log('ok')
      })
    } else if (skipDirectories.indexOf(name)) {
      traverseDirectory(path.join(directory, name), skipDirectories)
    }
  }
}

const parseMarkdown = (name, directory) => {
  const filePath = path.join(directory, name)
  const { no, title } = parseMDFilename(name)
  const category = path.basename(directory)
  const requestPath = path.resolve('/', directory, no)
  const mdData = parseMDContent(filePath)
  return { no, title, category, requestPath, ...mdData }
}

const parseMDFilename = filename => {
  const extname = path.extname(filename)
  filename = filename.replace(extname, '').split('-')
  const no = filename.shift()
  const title = filename.shift()
  return { no, title }
}

const parseMDContent = filePath => {
  const fileString = fs.readFileSync(filePath).toString()
  let { content, ...mdData } = parseMDYAMLFrontMatter(fileString)
  // 追加版权声明
  let copyright = fs.readFileSync('copyright.md').toString()
  const postURL = `https://anandzhang.com/${filePath.split('-').shift()}`
  copyright = copyright.replace('postURL', postURL).replace('postURL', postURL)
  // 文章末尾空行
  if (content.slice(-1) !== '\n') content += '\n'
  content += copyright
  mdData.content = md.render(content)
  return mdData
}

const parseMDYAMLFrontMatter = mdString => {
  const regs = {
    // m 多行搜索、s 允许 . 匹配换行符
    frontMatter: /---\s*(.*?)\s*---\s*/ms,
    // 贪婪匹配拿到需要的数据
    tags: /tags:\s*(.*)/,
    createTime: /createTime:\s*(.*)/,
    updateTime: /updateTime:\s*(.*)/,
    keywords: /keywords:\s*(.*)/,
    summary: /summary:\s*(.*)/
  }
  const frontMatter = mdString.match(regs.frontMatter)[1]
  const tags = frontMatter.match(regs.tags)[1].split(',')
  const createTime = frontMatter.match(regs.createTime)[1]
  const updateTime = frontMatter.match(regs.updateTime)[1]
  const keywords = frontMatter.match(regs.keywords)[1]
  const summary = frontMatter.match(regs.summary)[1]
  const content = mdString.replace(regs.frontMatter, '')
  return { tags, createTime, updateTime, keywords, summary, content }
}

Post.deleteMany(() => {
  console.log('Deleted successfully')
  traverseDirectory(postsDirectory, skipDirectories)
})
