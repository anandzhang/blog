---
typora-root-url: ../
tags: jailbreak
createTime: 2020-05-07
updateTime: 2020-05-07
keywords: ios越狱,苹果ios越狱,苹果ios怎么越狱,苹果ios用checkra1n怎么越狱
summary: 使用 checkra1n 工具越狱 ios 12.3 以上苹果 iOS 系统。
---

# Jailbreak iPhone 越狱

## 前言

最近娱乐时间玩的手游《光遇》，它里面的乐器15键电子琴我特别喜欢，然后打算模仿着做一个，这样就可以不登游戏弹音乐了（登个游戏这么简单，为什么要做一个？因为......你游戏里弹琴的时候周围会聚集很多的小伙伴给你“伴舞”）。但是IOS系统想要拿到游戏资源是需要越狱的（类似安卓的ROOT），所以我就打算把很久以前用的苹果6尝试进行越狱。

我在谷歌上找到两个工具，`unc0ver` 和 `checkra1n` ，都是单词里夹数字（笑出鹅叫）。

`unc0ver` 听说是可以完美越狱，然后我使用爱思助手安装了官网提供的 `ipa` 包，爱思助手提示这是越狱版，让我安装另一个共享版，直接安装失败我就安装了推荐的共享版，打开它显示 `unsupported` 不支持。官网写的支持 `iOS 11.0 - 13.3` ，应该根我没直接安装有关系，之后我用了下面的 `checkra1n` 。

`checkra1n` 算是不完美越狱了，我通过它越狱后重启系统就退出了越狱状态，需要再次使用这个工具越狱。这篇文章就记录一下我使用 `checkra1n` 工具越狱 `iPhone 6` 。

**注意：** 越狱会导致手机不稳定，耗电增加，隐私信息不安全等问题，而且会**失去保修**。小白越狱需谨慎，请自己承担责任。

## 环境

### checkra1n

由于我还没有买 `MacBook` ，又听说使用虚拟机装的 `macOS` 不能使用 `checkra1n` 越狱（只是听说，我没有试过），因为我一直用的 `ubuntu` 和 `windows` 双系统，所以我下载了 `checkra1n` 的 `Linux` 版。`windows` 版 `checkra1n` 官网还没有提供。

#### 安装

参考链接：[checkra1n linux 官网安装教程](https://checkra.in/linux) 。

1. 添加 `checkra1n` 的 `apt` 源

   ```shell
   echo "deb https://assets.checkra.in/debian /" | sudo tee -a /etc/apt/sources.list
   ```

2. 添加公钥验证

   ```shell
   sudo apt-key adv --fetch-keys https://assets.checkra.in/debian/archive.key
   ```

3. 更新 `apt` 源

   ```shell
   sudo apt update
   ```

4. 安装 `checkra1n` 

   ```shell
   sudo apt install -y checkra1n
   ```

### 爱思助手

爱思助手只有 `Windows` 和 `Mac` 版，[i4.cn 官网下载](https://www.i4.cn/pro_pc.html) 。

## 操作流程

### 1. iOS 刷机

由于 `checkra1n` 需要 `iOS 12.3 and up` ，也就是 `iOS 12.3` 以上。当时我的 `iPhone 6` 只是 `iOS 11.2` ，所以需要刷机。

注意：`iOS` 升级高版本后已无法降级，请谨慎选择。（大牛除外）

连接手机使用爱思助手进行刷机，可参考 [i4.cn 官方刷机教程](https://www.i4.cn/news_3.html) ，这里不赘述。

### 2. checkra1n 越狱

1. 手机处于开机或者恢复模式，然后启动 `checkra1n` 

   ```shell
   sudo checkra1n
   ```

   也可以通过应用中心启动。

2. 左右键切换选项，选择 `Start` 开始。

   ![checkra1n](/images/essay/2/checkra1n.png)

3. 出现设备需要进入 `DFU` 模式的提示，为了避免硬重置带来的文件系统损坏，会先进入恢复模式。选择 `Next` 下一步。

4. 稍等片刻后进入恢复模式，选择 `Start` 开始按照教程进入`DFU` 模式。

   ![dfumode](/images/essay/2/dfumode.png)

5. 等待手机开机启动，输入锁屏密码，越狱完成，如出现错误就需要重头操作。

   ![start](/images/essay/2/start.png)

> 后面再需要越狱，因为已经知道了如何进入 `DFU` 模式，我们可以直接使用 `checkra1n cli` 快速进行越狱。
>
> ```
> sudo checkra1n -c
> ```

### 3. 安装 Cydia

打开越狱后自动安装的 `checkra1n` 工具（如果刚越狱完没有就稍等一会或者重新越狱），点击里面的 `Cydia` 进行安装。

然后在 `Cydia` 中搜索安装自己需要的插件或应用，比如常用的 `Filza File Manager` 文件管理器。

**注意：**

1. 安装 `Cydia` 中的插件或软件需要注意系统兼容性，有一部分都是很老的插件了，`IOS 12` 不支持，打开时出现闪退。
2. 对于搜索不到的插件或软件可以通过添加源来解决。

## 效果图

![result1](/images/essay/2/result.png)

## 补充

因为是不完全越狱，重启会丢失越狱状态，从 `Cydia` 安装好的插件或软件也无法打开，出现闪退。

