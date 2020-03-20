---
typora-root-url: ../
tags: macOS,terminal,iTerm
createTime: 2019-08-05
updateTime: 2019-08-05
keywords: mac终端,iTerm,macOS配置终端
summary: 使用 macOS 开发当然也需要一个漂亮优雅的终端。通过 iTerm 和 oh-my-zsh 让终端具有更好的使用效果。
---

# macOS 配置漂亮的终端

> 今天我也 `rm -rf` 了，但不是删库跑路。好像删了什么配置文件，然后 node npm homebrew 等等等都搞不好，谷歌了很久也没有解决，然后还是重装了mac，顺便记录一下用了很久的终端配置。

## 效果图

![effect-terminal](/images/macos/1/effect.png)

## iTerm 终端配置

### 安装 [iTerm2](https://www.iterm2.com/) 

[点击下载](https://iterm2.com/downloads/stable/latest) 后，双击.zip下载文件解压后是一个可直接运行的 iterm 应用程序，可以把它拖到应用程序里，以后便可以通过启动器来运行。

![step1](/images/macos/1/step1.png)

### 配置准备

1. 设置终端可配色

   > 此处参考了简书作者 Bill_Wang 的文章 - [iTerm2配色方案](https://www.jianshu.com/p/33deff6b8a63) 非常感谢，嘻嘻

   编辑终端配置：

   ```shell
   $ vim ~/.bash_profile
   ```

   复制以下内容，粘贴到里面：

   ```
   #enables colorin the terminal bash shell export
   export CLICOLOR=1
   
   #setsup thecolor scheme for list export
   export LSCOLORS=gxfxcxdxbxegedabagacad
    
   #sets up theprompt color (currently a green similar to linux terminal)
   export PS1='\[\033[01;32m\]\u@\h\[\033[00m\]:\[\033[01;36m\]\w\[\033[00m\]\$     '
   
   #enables colorfor iTerm
   export TERM=xterm-256color
   ```

2. 下载 iTerm 主题包 [iterm2-color-schemes](https://iterm2colorschemes.com/) ，然后双击解压

   > [点击下载 .zip 包](https://github.com/mbadolato/iTerm2-Color-Schemes/zipball/master)

### 设置 iTerm 主题

1. 打开 iTerm 首选项

   ![step2](/images/macos/1/step2.png)

2. 引入解压主题文件中 `/schemes/Solarized Dark Higher Contrast.itermcolors` 

   ![step3](/images/macos/1/step3.png)

   ![step4](/images/macos/1/step4.png)

3. 引入完成后 再选择引入的它：Solarized Dark Higher Contrast

   ![step5](/images/macos/1/step5.png)

### 安装 oh-my-zsh 来升华终端

1. 下载安装

   ```shell
   $ sh -c "$(curl -fsSL https://raw.github.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
   ```

   > 如果是 Mac OS Sierra 可能会没装git，如果提示安装，安装下就ok。macOS 一般都装了 git。

   ![step6](/images/macos/1/step6.png)

2. 编辑 zsh 配置，修改其中的 ZSH_THEME="agnoster"

   ```shell
   $ vim ~/.zshrc
   ```

   ![step7](/images/macos/1/step7.png)

3. 这个时候 agnoster 主题会有乱码，安装字体解决

   ![step8](/images/macos/1/step8.png)

### 安装字体来解决乱码

1. 安装 [下载 Meslo 字体](https://github.com/powerline/fonts/blob/master/Meslo%20Slashed/Meslo%20LG%20M%20Regular%20for%20Powerline.ttf)

   ![step9](/images/macos/1/step9.png)

2. 双击下载的.ttf文件，添加到字体库

3. 设置 iTerm 字体为 Meslo

   ![step10](/images/macos/1/step10.png)

4. 重启下 iTerm

   ![step11](/images/macos/1/step11.png)

### 隐藏过长的路径

做完上面的步骤，终端已经不错了，但是我觉得这并不符合我的审美，那么长的路径再加上用户名和主机名就更长了，不舒服～。

1. **将全路径隐藏为当前文件名**：

   这个是agnoster配色主题的方式：

   ```shell
   $ vim ~/.oh-my-zsh/themes/agnoster.zsh-theme
   ```

   修改前：

   ![more1](/images/macos/1/more1.png)

   修改后：

   ![more2](/images/macos/1/more2.png)

   然后更新配置：

   ```shell
   $ source ~/.zshrc
   ```

   效果：需要当前位置 `pwd` 一下就好

   ![more3](/images/macos/1/more3.png)

2. **隐藏用户和主机名**

   1. 编辑配置

      ```shell
      $ vim ~/.zshrc
      ```

      任意位置添加 `DEFAULT_USER=$USER` 

      ![more4](/images/macos/1/more4.png)

   2. 刷新配置

      ```shell
      source ~/.zshrc
      ```

      ![more5](/images/macos/1/more5.png)

### 完成结果

![result](/images/macos/1/result.png)

## Vim 简单配置

![effect](/images/macos/1/effect.png)

请看 [vim 简单配置](https://anandzhang.com/posts/macos/2)