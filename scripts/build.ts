import { exec } from 'child_process'
import path from 'path'
import fs from 'fs/promises'
import { promisify } from 'util'
import { readFileInDir, parseFilename } from '../utils/addPost'
import MarkdownParser from '../utils/MarkdownParser'
import { SitemapStream } from 'sitemap'
import { createWriteStream } from 'node:fs'

const minify = require('@node-minify/core')
const cssMinifier = require('@node-minify/clean-css')
const htmlMinifier = require('@node-minify/html-minifier')

const resolvePath = (relativePath: string) => {
  return path.resolve(__dirname, relativePath)
}

// 1. 扫描所有文章
const readAllPost = async (sitemap?: SitemapStream) => {
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
    sitemap?.write({
      url: requestPath,
      changefreq: 'monthly',
      lastmod: fields.updateTime,
      priority: fields.priority
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

    if (page === 1) {
      result = result.replace('{{ previousClassName }}', 'hidden')
      result = result.replace('{{ previousUrl }}', '')
    } else {
      result = result.replace('{{ previousClassName }}', '')
      result = result.replace('{{ previousUrl }}', `/posts?page=${page - 1}`)
    }

    if (page === len) {
      result = result.replace('{{ nextClassName }}', 'hidden')
      result = result.replace('{{ nextUrl }}', '')
    } else {
      result = result.replace('{{ nextClassName }}', '')
      result = result.replace('{{ nextUrl }}', `/posts?page=${page + 1}`)
    }

    const data = await minify({
      compressor: htmlMinifier,
      content: result
    })
    await fs.writeFile(resolvePath(`../build/posts${page}.html`), data)
  }
}
// readAllPost()

// TODO: 隔太久了，为啥执行两次 readAllPost ？？
const main = async () => {
  await promisify(exec)('mkdir -p ../build/style', { cwd: __dirname })
  await readAllPost()

  // Sitemap 工具
  const sitemap = new SitemapStream({
    hostname: 'https://anandzhang.com',
    lastmodDateOnly: true
  })
  sitemap.pipe(createWriteStream(resolvePath('../build/sitemap.xml')))

  sitemap.write({
    url: '',
    changefreq: 'monthly',
    priority: 1.0
  })
  sitemap.write({
    url: '/posts',
    changefreq: 'weekly',
    priority: 0.8
  })
  sitemap.write({
    url: '/about',
    changefreq: 'monthly',
    priority: 0.5
  })

  // FIXME: posts => posts1，nginx处理query参数page时，set arg_page 1;暂时有问题
  await promisify(exec)('cp ../build/posts1.html ../build/posts.html', { cwd: __dirname })

  await readAllPost(sitemap)
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

  // robots.txt
  await promisify(exec)('cp ../public/root/robots.txt ../build/robots.txt', { cwd: __dirname })

  // 处理图片
  exec('cp -r ../v2/image/ ../build/images/', { cwd: __dirname }, (err) => {
    console.log(err)
  })

  // 生成 html
  await minify({
    compressor: htmlMinifier,
    input: [
      resolvePath('../v2/index.html'),
      resolvePath('../v2/about.html'),
      resolvePath('../v2/not-found.html')
    ],
    output: resolvePath('../build/$1.html')
  })

  sitemap.end()
}

main()
