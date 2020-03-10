---
typora-root-url: ../
tags: api
createTime: 2020-2-24
updateTime: 2020-2-24
keywords: 豆瓣电影api
summary: 面向开发者的豆瓣API很早就下线了，现在的v2版需要有apikey，而且豆瓣不再向个人用户开放，为了学习开发，没有数据真的很难。
---

# 豆瓣电影API

在 [豆瓣电影](https://movie.douban.com/) 中，有几个接口，我用来写小案例能用，有学习需要可以试试。我写的小案例 [项目地址](https://github.com/anandzhang/microproject-react/tree/master/movie-search) 。

## 获取标签

**请求方法：** GET

**请求URL：** https://movie.douban.com/j/search_tags

**请求参数：**

| 参数名 | 类型   | 必要 | 缺省  | 说明               |
| ------ | ------ | ---- | ----- | ------------------ |
| type   | string | 否   | movie | 电影/电视剧/(不明) |
| source | 不明   | 否   | index | 不明               |

**请求示例：**

- 电影

```
GET https://movie.douban.com/j/search_tags
```

- 电视剧

```
GET https://movie.douban.com/j/search_tags?type=tv
```

```json
{
	"tags": ["热门", "美剧", "英剧", "韩剧", "日剧", "国产剧", "港剧", "日本动画", "综艺", "纪录片"]
}
```

## 获取电影

**请求方法：** GET

**请求URL：** https://movie.douban.com/j/subject_suggest

**请求参数：**

| 参数名     | 类型   | 必要 | 缺省  | 说明                   |
| ---------- | ------ | ---- | ----- | ---------------------- |
| type       | string | 否   | movie | 电影/电视剧/(不明)     |
| tag        | string | 是   |       | 标签                   |
| page_limit | number | 否   | 20    | 返回的电影条目数量     |
| page_start | number | 否   | 0     | 返回电影条目的开始位置 |

**请求示例：**

- 电影

```
GET https://movie.douban.com/j/search_subjects?tag=热门
```

```json
{
	"subjects": [{
		"rate": "8.5",
		"cover_x": 3158,
		"title": "1917",
		"url": "https://movie.douban.com/subject/30252495/",
		"playable": false,
		"cover": "https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2570243317.webp",
		"id": "30252495",
		"cover_y": 5000,
		"is_new": false
	}]
}
```

- 电视剧

```
https://movie.douban.com/j/search_subjects?type=tv&tag=热门
```

```json
{
	"subjects": [{
		"rate": "9.2",
		"cover_x": 2953,
		"title": "想见你",
		"url": "https://movie.douban.com/subject/30468961/",
		"playable": true,
		"cover": "https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2576977981.webp",
		"id": "30468961",
		"cover_y": 4134,
		"is_new": false
	}]
}
```

> 标签不需要按照获取的来，直接传想搜的电影也OK
>
> ```
> GET https://movie.douban.com/j/search_subjects?tag=当幸福来敲门
> ```
>
> ```
> GET https://movie.douban.com/j/search_subjects?tag=钢铁侠
> ```

## 获取电影条目详情

**请求方法：** GET

**请求URL：** https://movie.douban.com/j/subject_abstract

**请求参数：**

| 参数名     | 类型   | 必要 | 缺省 | 说明          |
| ---------- | ------ | ---- | ---- | ------------- |
| subject_id | number | 是   |      | 电影条目的 ID |

**请求示例：**

```
GET https://movie.douban.com/j/subject_abstract?subject_id=4917832
```

