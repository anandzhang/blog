---
typora-root-url: ../
tags: linux,ubuntu
createTime: 2020-01-20
updateTime: 2020-01-20
keywords: 安装Ubuntu,安装Linux Ubuntu双系统
summary: 使用U盘安装 Ubuntu 系统，实现 Windows 和 Linux 双系统。安装需要：可使用的 windows系统、4G及其以上大小的U盘。
---

# 使用U盘安装 Ubuntu

使用U盘安装ubuntu linux系统，实现 Windows 和 Ubuntu 双系统。

安装需要：可使用的 windows系统、4G及其以上大小的U盘

> 参考：
>
> https://tutorials.ubuntu.com/tutorial/tutorial-create-a-usb-stick-on-windows

## 准备工作

1. 下载 Ubuntu IOS 镜像文件

   > [官网下载地址](https://ubuntu.com/download/desktop) 选择自己需要的Ubuntu版本进行下载，分为最新版和长期支持版（LTS），没有特殊需求推荐下载 LTS 版。
   >
   > [直接下载 Ubuntu 18.04.3 LTS](https://ubuntu.com/download/desktop/thank-you?version=18.04.3&architecture=amd64) 

2. 下载USB启动盘制作工具 [Rufus](https://rufus.ie/)

   > Rufus 是 Ubuntu 官网教程中提到的一款开源免费的写入工具。
   >
   > [直接下载 Rufus 3.8](https://github.com/pbatard/rufus/releases/download/v3.8/rufus-3.8.exe)

## 制作 USB启动盘

插入准备的U盘（需要事先转移U盘上的数据），直接打开下载的 Rufus。

选择插入的U盘设备，然后点击选择，选择下载的 Ubuntu IOS 镜像文件。

![refus](/images/linux/1/refus.png)

点击开始，然后OK或者确定。等待制作完成后点击关闭。

## 磁盘分区

> 如果你想和我一样安装 Windows 和 Ubuntu 双系统，那么对磁盘进行分区时有必要的，如果不是的话，请跳过这一部分。

我的笔记本的磁盘只有一块256G固态，我决定留给Windows系统80G（一个C盘作为系统盘，一个D盘放软件和文件），剩下的150几个G留给 Ubuntu。

按下 Win + X，在出现的菜单中选择 磁盘管理，打开 Windows 自带的磁盘管理工具。

通过选择选择磁盘和磁盘上的分区进行删除或者压缩卷，我完成的磁盘情况如下：

![image-20200126135622701](/images/linux/1/diskmgmt.png)

## 启动制作的 Ubuntu启动器

关闭电脑，进入启动菜单或者BIOS，选择U盘启动。

> 我的笔记本是 Lenovo 小新潮7000，方法是按下开机键，然后按住 F12。

![image-20200130174027772](/images/linux/1/bios.png)

第一个为windows启动管理器，第二个为我们制作的ubuntu启动器，选择第二个并回车。

## 安装 Ubuntu

> 为了节省网页加载成本，简单的步骤不再进行贴图，请谅解。

1. 根据需要选择自己使用的语言

   ![install1](/images/linux/1/install1.JPG)

2. 设置键盘布局：默认就行

3. 设置网络，可以稍后设置wifi

4. 选择安装方式

   > 莫有什么特殊要求就选择 正常安装 就好。

   ![install2](/images/linux/1/install2.JPG)

5. 安装类型：选择 其他选项

   ![install3](/images/linux/1/install3.JPG)

6. 双击刚才留出的空闲磁盘区

   > 主分区：挂载点 /
   >
   > 逻辑分区：挂载点 /home等，除 / 以外 。可以选择使用不同的分区挂载。

   ![install4](/images/linux/1/install4.JPG)

   ![install5](/images/linux/1/install5.JPG)

   ![install6](/images/linux/1/install6.JPG)

   ![install7](/images/linux/1/install7.JPG)

7. 选择地区：点击祖国母亲的位置

   ![install8](/images/linux/1/install8.JPG)

8. 设置用户名等

   > 你的姓名：显示在开机后用户登录上的名字
   >
   > 您的计算机名：显示在终端 Terminal 后面部分
   >
   > 选择一个用户名：显示在终端 Terminal 前面部分
   >
   > 也就是：anand@lenovo 前面是设置的用户名，后面是设置的计算机名。

   ![install9](/images/linux/1/install9.JPG)

9. 等待安装

   ![ubuntu](/images/linux/1/ubuntu.JPG)

## 重启后的启动菜单

![bootmeau](/images/linux/1/bootmeau.JPG)

启动菜单第一个为ubuntu，通过ubuntu的启动菜单可以选择进入ubuntu还是windows。

## 驱动问题

安装ubuntu完成后提示重新启动系统，点击后长时间无响应，没有重启操作，这是显卡驱动问题，你可以先通过长按电源键进行强制关机。

使用ubuntu时，出现以下情况：

1. 登录界面输入了用户密码后，等待较长时间才进入桌面。
2. 点击关机、重启按钮后，进入登录界面，没有出现关机、重启的相关操作。

这些情况是我遇到过的，来自显卡驱动未安装或者兼容问题。

### 安装显卡驱动

1. `Ctrl + Alt + T` 快捷键打开终端 Terminal
2. 输入 `ubuntu-drivers devices` 显示硬件及推荐驱动
3. 才安装的Ubuntu，要输入 `sudo apt-get update` 更新软件源
4. 输入 `sudo ubuntu-drivers autoinstall` 安装推荐的驱动

> 这样解决了我出现的问题，我的显卡是英伟达Nvida，如果你无法解决，可以搜索：ubuntu 安装显卡驱动
>
> 参考：https://zhuanlan.zhihu.com/p/59618999

