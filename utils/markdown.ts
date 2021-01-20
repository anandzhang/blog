import hljs from 'highlight.js'
const highlight = (str: string, lang: string) => {
  let code = markdown.utils.escapeHtml(str)
  if (lang && hljs.getLanguage(lang)) {
    code = hljs.highlight(lang, str, true).value
  }
  return `<pre class="hljs"><code>${code}</code></pre>`
}
const markdown = require('markdown-it')({ highlight })
export default markdown
