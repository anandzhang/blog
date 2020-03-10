---
typora-root-url: ../
tags: html
createTime: 2019-4-22
updateTime: 2019-4-22
keywords: html教程,学习css
summary: 学习HTML的常用标签，进一步学习和掌握HTML。
---

# 认识CSS

为什么div会独占一行

元素嵌套

父级/子级/兄弟

直接子元素：是儿子不是孙子

```html
<div>
    <ul>
        <li></li>
    </ul>
    <p></p>
</div>
```

父级：ul的父级是div、li的父级是ul、p的父级是div

子级：ul、li、p都是div的子元素；ul、p是div的直接子元素

兄弟：ul是p的兄弟元素、p同样是ul的兄弟元素

> 被包裹的是子元素，同一个父级就是兄弟元素。

## CSS

层叠样式表Cascading style sheets，是一种用来给HTML文档添加样式（颜色、字号、距离等）的语言。

HTML展示内容，CSS装饰内容

### CSS写法

内联样式

`<style></style>` 在head标签中建立style标签，存放网页中的CSS代码。

注释/**/

外联样式

外部引用CSS文件

在head标签中新建一个link标签，通过href属性设置外部css文件地址

rel是relationship的缩写，指定当前文档与被链接文档的关系，rel="stylesheet"表示引用的是一个样式表文件。

行内样式

> 实际开发中建议样式和结构分离，
>
> 后面的样式覆盖前面的样式

### 选择器

标签选择器

class类名选择器

id选择器

后代/兄弟选择器

 选择器{ 属性: 属性值}  选择器 + 样式集合

```html
<style>
    div {
        color: red;
    }
</style>
```

《有事停更------》