---
typora-root-url: ../..
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

![effect-vim](/images/os/tips/2/effect-vim.png)