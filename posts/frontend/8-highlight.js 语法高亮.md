---
typora-root-url: ../
tags: markdown,highlight.js
createTime: 2020-03-16
updateTime: 2020-03-16
keywords: 代码语法高亮,html代码块语法高亮,highlight代码块语法高亮显示
summary: 使用 markdown-it 和 highlight.js 完成对博客 Markdown 文件的代码块语法高亮解析。
---

# highlight.js 语法高亮

## 简介

在 `nodejs` 项目中使用第三方库 [highlight.js](https://highlightjs.org/) 实现代码块的高亮显示，`highlight.js` 提供了大量的编程语言和高亮显示样式。

按照我博客文章的代码块高亮显示为例，我首先使用了 `markdown-it` 把 `Markdown` 文章解析为 `html`，然后利用 `highlight.js` 做到代码块的高亮显示。

## 思路

### 配置语法高亮

```javascript
// 引入 highlight.js （包含所有语言）
const hljs = require('highlight.js')
// 定义 markdown-it 的语法高亮函数 highlight
const highlight = (str, lang) => {
  let code = md.utils.escapeHtml(str)
  if (lang && hljs.getLanguage(lang)) {
    code = hljs.highlight(lang, str, true).value
  }
  return `<pre class="hljs"><code>${code}</code></pre>`
}
// 引入 markdown-it
//   在创建实例时传入刚才定义的 highlight函数 来配置语法高亮
const md = require('markdown-it')({ highlight })
```

### highlight 函数

对于 `markdown-it` 的语法高亮函数，`markdown-it` 解析到 `Markdown` 文件的代码块，比如：

```markdown
​```javascript
const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World')
})

app.listen(port, () => {
  console.log(`http://localhost:${port}`)
})
​```
```

上面就是一个 `Markdown` 的代码块语法，`markdown-it` 会把其中的代码传入 `highlight` 函数的第一个参数，而代码块开头标志后的 `javascript` 则会传入到 `highlight` 函数的第二个参数。

所以上面代码中的 `highlight` 函数接受这两个参数 `(str, lang)`，首先`md.utils.escapeHtml(str)` 是用来转义，具体解释请查看文末的补充内容，然后再使用第三方库 `highlight.js` 的 `hljs.highlight(lang, str, true).value`（[查看API详解](https://highlightjs.readthedocs.io/en/latest/api.html#highlight-languagename-code-ignore-illegals-continuation)）把代码解析成 `span` 标签带类名的形式，比如：

```html
<span class="hljs-keyword">const</span> express = 
<span class="hljs-built_in">require</span>
```

这样就只需要在 `html` 中引入样式就可以了。

### css 样式

`highlight.js` 中提供了很多的样式，你可以在 `nodejs` 的 `node_modules` 中拿出来使用。

![style](/images/frontend/8/style.png)

`/node_modules/highlight.js/styles` 中的 `css` 文件复制出来用就好了。

这么多 `css` 找一个自己喜欢的，也可以自己定义，查看 [官方所有样式效果Demo](https://highlightjs.org/static/demo/) 。

## 完整案例

### express

```javascript
const express = require('express')
const app = express()
const port = 3000

// 引入 highlight.js 并配置到 markdown-it
const hljs = require('highlight.js')
const highlight = (str, lang) => {
  let code = md.utils.escapeHtml(str)
  if (lang && hljs.getLanguage(lang)) {
    code = hljs.highlight(lang, str, true).value
  }
  return `<pre class="hljs"><code>${code}</code></pre>`
}
const md = require('markdown-it')({ highlight })

const fs = require('fs')
const path = require('path')

// 配置模板引擎 art-template
app.engine('html', require('express-art-template'))
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
// 静态资源
app.use('/public', express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
  // 读取 example.md Markdown文件
  const fileString = fs.readFileSync('example.md').toString()
  const htmlResult = md.render(fileString)
  // 模板渲染 index.html
  res.render('index', { content: htmlResult })
})

app.listen(port, () => {
  console.log(`http://localhost:${port}`)
})
```

### 模板引擎

`/views/index.html` 文件：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Document</title>
    <link rel="stylesheet" href="/public/css/github.css">
  </head>
  <body>
    <div>{{@content}}</div>
  </body>
</html>
```

### Markdown

`/example.md` 文件：

```markdown
​```javascript
const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World')
})

app.listen(port, () => {
  console.log(`http://localhost:${port}`)
})
​```
```

### 效果

![result](/images/frontend/8/result.png)

## 补充

### MarkdownIt.utils

[官方文档](https://markdown-it.github.io/markdown-it/#MarkdownIt.prototype.utils) 中也没用过多的展开解释 `utils`，让我们查看它的源码：

```javascript
var HTML_ESCAPE_TEST_RE = /[&<>"]/;
var HTML_ESCAPE_REPLACE_RE = /[&<>"]/g;
var HTML_REPLACEMENTS = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;'
};

function replaceUnsafeChar(ch) {
  return HTML_REPLACEMENTS[ch];
}

function escapeHtml(str) {
  if (HTML_ESCAPE_TEST_RE.test(str)) {
    return str.replace(HTML_ESCAPE_REPLACE_RE, replaceUnsafeChar);
  }
  return str;
}
```

代码写的很直观，`MarkdownIt.utils.escapeHtml()` 的用处就是转义HTML，把传来解析的 `Markdown` 内容中的`<`、`>`等进行转义，防止与HTML的标签语法冲突。

那为什么上面的 `highlight` 函数中需要用呢？

> `highlight` 函数中首先判断了参数 `lang` 是否存在，就是 `Markdown` 文件中代码块开头标志后有没有跟代码语言并且这个语言在 `highlight.js` 库能否解析。
>
> 如果 `false` 就不会通过 `highlight.js` 库去解析语法高亮，而只返回了代码块的转义；
>
> 如果 `true` 就会通过 `hightlight.js` 库进行解析，返回的结果在 `highlight.js` 中自己就进行了转义，所以不需要我们再去使用 `escapeHtml()`。