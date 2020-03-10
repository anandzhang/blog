---
typora-root-url: ../
tags: html
createTime: 2019-4-20
updateTime: 2019-4-20
keywords: html教程,学习html
summary: 简单介绍HTML，迅速上手HTML。
---

# 初识 HTML

## 简介

HTML 也就是**超文本标记语言**（HyperText Markup Language），是WEB网页的**构成结构**，是学习前端的第一步。

学习HTMLCSS需要一个文本编辑器或者IDE，推荐安装 [VScode](https://code.visualstudio.com/download)、[WebStorm](https://www.jetbrains.com/webstorm/download/)、[Sublime Text](https://www.sublimetext.com/3) 等，安装其一就好，教程笔记使用 VScode。

## 创建 HTML 文件

1. 创建一个文件夹 demo

2. 打开 VScode，打开刚才创建的demo文件夹

   ![vscode](/images/htmlcss/1/vscode.png)

3. 创建一个后缀为html的文件：index.html

   ![newfile](/images/htmlcss/1/newfile.png)

4. 复制以下内容到创建的文件内，然后保存

   ```html
   <!DOCTYPE html>
   <html>
       <head>
           <meta charset="utf-8">
           <title>Demo</title>
       </head>
       <body>
           <h1>Hello World!</h1>
       </body>
   </html>
   ```

   ![index](/images/htmlcss/1/index.png)

5. 在创建的demo文件夹内双击打开 index.html

这样就成功运行了一个纯HTML网页。

## HTML 基本结构

这是我们刚才复制和使用的 HTML 最基本的模板结构：

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>Demo</title>
    </head>
    <body>
        <h1>Hello World!</h1>
    </body>
</html>
```

现在简单的了解一下它们代表的用意：

`<!DOCTYPE html>` 告诉浏览器这个html文档使用的html标签版本。

`<html></html>` 是整个网页的载体，网页的所有内容都放在html标签中。

`<head></head>` 告诉浏览器/搜索引擎的一些信息会放在头部head里，不会展示给用户看。

`<meta>` 元数据，放在head标签里，记载一些关于文档的信息。

`<title></title>` 网页的标题，放在head标签里，展示在浏览器标签栏的内容。

`<body></body>` 网页的主体，网页需要展示的内容都放在这里 。

> **html 是载体。head 是网页头部，body 是网页主体。**头部的内容是提供给浏览器/搜索引擎的一些信息，主体的内容是展示给用户的内容，也可以说是网页所有能看到的内容都在body标签里，head标签里放的是信息。

## 总结

HTML 是一门标记语言，它在前端中是最好入门的部分，这一篇文章就简单的记录了创建和运行一个纯html编写的网页。文章中记录的HTML最基本结构就是学习HTML第一步需要记住和掌握的知识，后面对HTML的学习都会在这个的基础上一步一步成长。