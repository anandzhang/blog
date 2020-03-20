---
typora-root-url: ../
tags: macOS,linux,vim
createTime: 2019-08-05
updateTime: 2019-08-05
keywords: vim显示行号,vim高亮
summary: 经常使用Terminal终端的人来说，vim命令是经常用到的编辑工具，但是很多人也在用vi，两者使用其实也是差别的，通过对vim进行简单配置，使得编辑时带有行号、文本高亮显示。
---

# Vim 简单配置

## 配置步骤

1. 编辑 vim 配置

   ```shell
   $ vim ~/.vimrc
   ```

2. 添加以下内容

   ```
   syntax on
   set number
   set ruler
   set mouse=a
   ```

   > `syntax on` 开启语法高亮显示
   > `set number` 显示左侧的行号
   > `set ruler` 在底部的状态栏显示光标当前位置（几行几列）
   > `set mouse=a` 鼠标可操作，就是让你可以通过鼠标去改变光标的位置
   >
   > 还有很多 vim 的配置项，可以搜一下哈

## 效果图

![effect](/images/macos/2/effect.png)