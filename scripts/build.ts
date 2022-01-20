import { exec } from 'child_process'
import path from 'path'
import fs from 'fs/promises'
import { promisify } from 'util'
import { readFileInDir, parseFilename } from '../utils/addPost'
import MarkdownParser from '../utils/MarkdownParser'
const minify = require('@node-minify/core')
const cssMinifier = require('@node-minify/clean-css')
const htmlMinifier = require('@node-minify/html-minifier')

const resolvePath = (relativePath: string) => {
  return path.resolve(__dirname, relativePath)
}

// 1. 扫描所有文章
const readAllPost = async () => {
  const files = await readFileInDir('posts')
  const result = []
  const template = await fs.readFile(resolvePath('../v2/template/post.html'))
  for (const file of files) {
    let html = template.toString()
    const [no, title] = parseFilename(file.name)
    const category = path.basename(file.directory)
    const requestPath = path.resolve('/', file.directory, no)
    const mdParser = new MarkdownParser(file.path)
    const fields = mdParser.parseYAMLFrontMatter()
    const content = mdParser.parseContent(requestPath)
    html = html.replace('{{ title }}', title)
    html = html.replace('{{ keywords }}', fields.keywords)
    html = html.replace('{{ summary }}', fields.summary)
    html = html.replace('{{ content }}', content)
    const data = await minify({
      compressor: htmlMinifier,
      content: html
    })
    const storeDir = resolvePath(`../build/posts/${category}`)
    try {
      await fs.mkdir(storeDir, { recursive: true })
    } catch (error) {
      console.log(error)
    }
    await fs.writeFile(`${storeDir}/${no}.html`, data)
    // 方便后面生成 posts.html
    result.push({
      title,
      createTime: fields.createTime,
      updateTime: fields.updateTime,
      summary: fields.summary,
      requestPath
    })
  }

  // 生成文章页
  const sorted = result.sort((a, b) => {
    if (a.createTime > b.createTime) {
      return -1
    }
    if (a.createTime < b.createTime) {
      return 1
    }
    return 0
  })
  // 每页显示 8 个文章
  let len = Math.floor(sorted.length / 8)
  // 有余数说明需要加一页
  if (sorted.length % 8) {
    len += 1
  }
  const itemTemplate = await fs.readFile(resolvePath('../v2/template/item.html'))
  for (let page = 1; page <= len; page++) {
    const posts = sorted.slice((page - 1) * 8, page * 8)
    let content = ''
    posts.forEach(post => {
      let liElement = itemTemplate.toString()
      liElement = liElement.replace('{{ postUrl }}', post.requestPath)
      liElement = liElement.replace('{{ postTitle }}', post.title)
      liElement = liElement.replace('{{ time }}', post.createTime)
      liElement = liElement.replace('{{ summary }}', post.summary)
      content = content + liElement
    })
    const postsHtml = await fs.readFile(resolvePath('../v2/posts.html'))
    let result = postsHtml.toString()
    result = result.replace('{{ content }}', content)
    result = result.replace('{{ current }}', page + '')
    result = result.replace('{{ total }}', len + '')
    const data = await minify({
      compressor: htmlMinifier,
      content: result
    })
    await fs.writeFile(resolvePath(`../build/posts${page}.html`), data)
  }
}
readAllPost()

const main = async () => {
  await promisify(exec)('mkdir -p ../build/style', { cwd: __dirname })
  await readAllPost()

  // FIXME: posts => posts1，nginx处理query参数page时，set arg_page 1;暂时有问题
  await promisify(exec)('cp ../build/posts1.html ../build/posts.html', { cwd: __dirname })

  await readAllPost()
  // 文章图片
  await promisify(exec)('cp -r ../posts/images/ ../build/images/', { cwd: __dirname })

  // 处理 CSS
  await minify({
    compressor: cssMinifier,
    input: [
      resolvePath('../v2/style/reset.css'),
      resolvePath('../v2/style/style.css')
    ],
    output: resolvePath('../build/style/bundle.css')
  })

  // Markdown css
  await promisify(exec)('cp ../public/dist/markdown.css ../build/style/markdown.css', { cwd: __dirname })

  // 处理图片
  exec('cp -r ../v2/image/ ../build/images/', { cwd: __dirname }, (err) => {
    console.log(err)
  })

  // 生成 html
  await minify({
    compressor: htmlMinifier,
    input: [
      resolvePath('../v2/index.html'),
      resolvePath('../v2/about.html')
    ],
    output: resolvePath('../build/$1.html')
  })
}

main()
