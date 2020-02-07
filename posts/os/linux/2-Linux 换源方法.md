---
typora-root-url: ../..
tags: linux,ubuntu
createTime: 2020-1-20
updateTime: 2020-1-20
summary: 使用U盘安装 Ubuntu 系统，实现 Windows 和 Linux 双系统。安装需要：可使用的 windows系统、4G及其以上大小的U盘。
---

# Linux 换源方法

## 通用方法

1. 换国内源，最直接的就是上阿里、中科大的镜像官网。

   - [阿里Mirror](https://opsx.alibaba.com/mirror) 
   - [中科大Mirror](http://mirrors.ustc.edu.cn/) 

2. 根据选择自己的Linux发行版，点帮助help就有详细了，复制到sources.list，更新下源就好了。

   ![mirror](/images/os/linux/2/mirror.png)

## Ubuntu 换源方法

> Xubunut、Kubuntu都是ubuntu发行版，只是桌面环境不同，换源也是一样。

> 如果你需要ubuntu cn国区源，请看[Ubuntu cn国内源](/posts/os/linux/3) 

1. 备份原来的 sorces 文件

   ```shell
   $ sudo cp /etc/apt/sources.list /etc/apt/sources.list.bak
   ```

2. 修改 sources.list 文件

   ```shell
   $ sudo gedit /etc/apt/sources.list
   ```

   > gedit 是 ubuntu 自带的图像界面编辑器，xubuntu、kubuntu自带的不是gedit，Kubuntu 自带 kate。
   >
   > 同样你也可以用 vi/vim 去编辑：`sudo vim /etc/apt/sources.list` 

3. 将内容替换为阿里或中科大镜像源

   ```
   # 阿里镜像源
   deb http://mirrors.aliyun.com/ubuntu/ bionic main restricted universe multiverse
   deb http://mirrors.aliyun.com/ubuntu/ bionic-security main restricted universe multiverse
   deb http://mirrors.aliyun.com/ubuntu/ bionic-updates main restricted universe multiverse
   deb http://mirrors.aliyun.com/ubuntu/ bionic-proposed main restricted universe multiverse
   deb http://mirrors.aliyun.com/ubuntu/ bionic-backports main restricted universe multiverse
   deb-src http://mirrors.aliyun.com/ubuntu/ bionic main restricted universe multiverse
   deb-src http://mirrors.aliyun.com/ubuntu/ bionic-security main restricted universe multiverse
   deb-src http://mirrors.aliyun.com/ubuntu/ bionic-updates main restricted universe multiverse
   deb-src http://mirrors.aliyun.com/ubuntu/ bionic-proposed main restricted universe multiverse
   deb-src http://mirrors.aliyun.com/ubuntu/ bionic-backports main restricted universe multiverse
   ```

   ```
   # 中科大镜像源
   deb https://mirrors.ustc.edu.cn/ubuntu/ bionic main restricted universe multiverse
   deb-src https://mirrors.ustc.edu.cn/ubuntu/ bionic main restricted universe multiverse
   deb https://mirrors.ustc.edu.cn/ubuntu/ bionic-updates main restricted universe multiverse
   deb-src https://mirrors.ustc.edu.cn/ubuntu/ bionic-updates main restricted universe multiverse
   deb https://mirrors.ustc.edu.cn/ubuntu/ bionic-backports main restricted universe multiverse
   deb-src https://mirrors.ustc.edu.cn/ubuntu/ bionic-backports main restricted universe multiverse
   deb https://mirrors.ustc.edu.cn/ubuntu/ bionic-security main restricted universe multiverse
   deb-src https://mirrors.ustc.edu.cn/ubuntu/ bionic-security main restricted universe multiverse
   deb https://mirrors.ustc.edu.cn/ubuntu/ bionic-proposed main restricted universe multiverse
   deb-src https://mirrors.ustc.edu.cn/ubuntu/ bionic-proposed main restricted universe multiverse
   ```

4. 替换后记得 保存

5. 更新源：

   ```shell
   $ sudo apt-get update
   ```

## Deepin 换源方法

1. 备份原来的 sorces 文件

   ```shell
   $ sudo cp /etc/apt/sources.list /etc/apt/sources.list.bak
   ```

2. 修改 sources.list 文件

   ```shell
   $ sudo deepin-editor /etc/apt/sources.list
   ```

   > deepin-editor 是 deepin 自带的图像界面编辑器，和 ubuntu 的 gedit 一样。你也可以用vim去编辑。看自己嘛。
   >
   > 用 vi/vim 去编辑：`sudo vim /etc/apt/sources.list` 

3. 将内容替换为阿里或中科大镜像源

   阿里：

   ```
   # aliyun
   deb [by-hash=force] http://mirrors.aliyun.com/deepin panda main contrib non-free
   #deb-src http://mirrors.aliyun.com/deepin panda main contrib non-free
   ```

   中科大：

   ```
   # ustc
   deb [by-hash=force] http://mirrors.ustc.edu.cn/deepin panda main contrib non-free
   #deb-src http://mirrors.ustc.edu.cn/deepin panda main contrib non-free
   ```

4. 替换后记得 保存

5. 更新源：

   ```shell
   $ sudo apt-get update
   ```

## 遇到 lock 问题

> 这里以 deepin 为例，其他的都类似。
>
> 如果出现lock报错，删除lock文件就好了

![lock1](/images/os/linux/2/lock1.png)

![lock2](/images/os/linux/2/lock2.png)

删除上面提示的 lock 文件：

```shell
sudo rm -f /var/lib/apt/lists/lock
```

![lock3](/images/os/linux/2/lock3.png)

再更新源

```shell
$ sudo apt-get update
```

