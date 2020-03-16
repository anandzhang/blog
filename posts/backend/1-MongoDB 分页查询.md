---
typora-root-url: ../
tags: mongodb
createTime: 2020-03-15
updateTime: 2020-03-15
keywords: mongodb分页查询,mongoose实现分页功能
summary: 使用第三方库 mongoose 完成博客文章的分页功能，避免在一页上展示出全部文章。
---

# MongoDB 分页查询

## 简介

想对博客的文章列表进行一个简单的分页，避免在一页显示出所有文章。

使用第三方库 `mongoose` 完成分页功能，主要用了 `Model` 下的两个API，`Model.countDocuments()` 和 `Model.find()` 。

## API 解释

> 详细的解释请查看官方文档：[Model.countDocuments()](https://mongoosejs.com/docs/api/model.html#model_Model.countDocuments)、[Model.find](https://mongoosejs.com/docs/api/model.html#model_Model.find)。

`Model.countDocuments(conditions, callback)` 传一个查询条件和回调函数，回调函数中会返回满足条件的文档总数

`Model.find(conditions, fields, options, callback)` 一般的查询只传了两个参数，一个查询条件一个回调函数。 但是这次需要进行分页查询，需要传第三个参数，用到 `skip` 和 `limit` 的功能。

`skip` 跳过一定数量的文档结果。

`limit` 限制回调函数中返回的满足查询条件的文档个数。

> 需要排序的话还会用到 `sort` ，比如按照年龄顺排：
>
> ```javascript
> Model.find({}, null, { sort: { age: 1 }, limit: 10 }, (err, docs) => {
>   console.log(docs)
> })
> ```

## 代码

### 路由

通过路由得到 `GET` 传的 `page` 参数返回相应页的结果。比如：`/posts?page=1` 。

```javascript
const express = require('express')
const router = express.Router()
const Post = require('../models/post')

const pageLimit = 10
router.get('/', (req, res) => {
  Post.countDocuments({}, (err, count) => {
    let current = +req.query.page || 1
    const total = Math.ceil(count / pageLimit)
    // 处理人为传入的非法数据
    if (current < 1) current = 1
    if (current > total) current = total
    // 分页查询
    const docQuery = Post.find({}, null, {
      skip: (current - 1) * pageLimit,
      limit: pageLimit
    })
    docQuery.exec((err, docs) => {
      // 使用模板引擎渲染 posts 页面
      res.render('posts', { docs, current, total })
    })
  })
})

module.exports = router
```

### 模板视图

我使用的是 `art-template` 模板引擎，`{{}}` 这种都是它的语法，其他模板引擎中循环、判断的语法可以去对应的官网看。

```html
<ul class="posts-list">
  {{each docs}}
  <li>
    <h2><a href="">{{$value.title}}</a></h2>
    <p class="time">{{$value.updateTime}}</p>
    <p>{{$value.summary}}</p>
  </li>
  {{/each}}
</ul>
<div class="pagination">
  {{if current>1}}
  <a href="/posts?page={{current-1}}">&larr; 最近</a>
  {{/if}}
  <span>{{current}} / {{total}}</span>
  {{if current!=total}}
  <a href="/posts?page={{current+1}}">更早 &rarr;</a>
  {{/if}}
</div>
```

直接使用了模板引擎的 `if` 判断语句去判断是否是第一页或最后一页。

## 思考

### 复用

因为博客存在太多的文章查询，每个查询结果都需要分页显示，这样就会出现很多的代码重复，所以简单的抽离一下。

```javascript
const Post = require('../models/post')
/**
 * Post 模块的简单的分页
 * 
 * @param {Object} page {pageNumer, pageLimit}
 * @param {Object} conditions 查询条件
 * @param {Object} fields 需要返回的文档字段
 * @param {Function} callback 回调函数 callback(err, data)
 */
function pagination(page, conditions, fields, callback) {
  const { pageNumber, pageLimit } = page
  Post.countDocuments(conditions, (err, count) => {
    // 当前页
    let current = +pageNumber || 1
    // 总页数
    const total = Math.ceil(count / pageLimit)
    // 避免人为传来非法数据
    if (current < 1) current = 1
    if (current > total) current = total
    // 分页查询
    const options = {
      skip: (current - 1) * pageLimit,
      limit: pageLimit
    }
    Post.find(conditions, fields, options, (err, docs) => {
      callback(err, { docs, current, total })
    })
  })
}
module.exports = pagination
```

```javascript
const pagination = require('../utils/pagination')
// 路由中部分代码
const page = {
  pageNumber: +req.query.page,
  pageLimit: 10
}
pagination(page, {}, null, (err, data) => {
  res.render('posts', data)
})
```

### 性能

因为总是需要符合条件的文档总数，依赖 `Model.countDocuments()` 的文档总数，这样看上去就做了两次异步的查询，会不会影响到性能呢？Emmm，我想知道。