import fs from 'fs'
import md from './markdown'

// m 多行搜索、s 允许 . 匹配换行符
const REG_FRONT_MATTER = /---\s*(.*?)\s*---\s*/ms
// 贪婪匹配拿到需要的数据
const REG_TAGS = /tags:\s*(.*)/
const REG_CREATE_TIME = /createTime:\s*(.*)/
const REG_UPDATE_TIME = /updateTime:\s*(.*)/
const REG_KEYWORDS = /keywords:\s*(.*)/
const REG_SUMMARY = /summary:\s*(.*)/

interface yamlMeta {
  tags: string[],
  createTime: string,
  updateTime: string,
  keywords: string,
  summary: string
}

class MarkdownParser {
  private frontMatter: string
    private content: string
    constructor (path: string) {
      const string = fs.readFileSync(path).toString()
      this.frontMatter = REG_FRONT_MATTER.exec(string)?.[1] || ''
      this.content = string.replace(REG_FRONT_MATTER, '')
    }

    parseYAMLFrontMatter (): yamlMeta {
      return {
        tags: REG_TAGS.exec(this.frontMatter)?.[1].split(',') || [],
        createTime: REG_CREATE_TIME.exec(this.frontMatter)?.[1] || '',
        updateTime: REG_UPDATE_TIME.exec(this.frontMatter)?.[1] || '',
        keywords: REG_KEYWORDS.exec(this.frontMatter)?.[1] || '',
        summary: REG_SUMMARY.exec(this.frontMatter)?.[1] || ''
      }
    }

    parseContent (requestPath: string) {
      // 追加版权声明
      let copyright = fs.readFileSync('copyright.md').toString()
      const postURL = `https://anandzhang.com/${requestPath}`
      copyright = copyright.replace('postURL', postURL).replace('postURL', postURL)
      // 文章末尾空行
      if (this.content.slice(-1) !== '\n') this.content += '\n'
      this.content += copyright
      return md.render(this.content)
    }
}

export default MarkdownParser
