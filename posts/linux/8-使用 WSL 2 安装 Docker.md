---
typora-root-url: ../
tags: wsl,docker
createTime: 2020-05-20
updateTime: 2020-05-20
keywords: 安装 wsl,在wsl安装docker,使用wsl 2搭建docker开发环境
summary: 安装 WSL 2 来使用 Docker 运行后端项目接口，可以更好的在 Windows 上进行项目开发。
---

# 使用 WSL 2 安装 Docker

## 前言

WSL（Windows Subsystem for Linux）也就是适用于 Windows 的 Linux 子系统。很多人都不愿意折腾这个，因为费力不讨好，还不如装个虚拟机。但是我认为使用好它之后是能带来生产力的，也能提高效率，跑项目、做测试都是不错的。

### 折腾记录

在折腾它时，我最开始用的是 WSL 1，在安装 Docker 的时候出现了一些问题，尽管我通过谷歌解决了这些问题，但是最后启动 Docker 显示成功，但是查看状态却是没有运行。

后来通过微软官方文档的帮助了解到 WSL 2，并再次尝试入坑。使用 WSL 2 安装 Docker 却是一路畅通，只能说明我打开 WSL 的方式错了，所以我个人建议直接使用 WSL 2。

最后的使用感受还是很不错的，作为一名前端开发人员，我可以在 WSL 上运行后端的 Docker 项目，然后在 Windows 上进行前端开发，嘿嘿。

### 使用条件

使用 WSL 2 需要 Windows 10 2004 版本以上，不然你会发现 `wsl -l -v` 、`--set-default-version` 这些命令都是不可用的，更别说切换到 WSL 2了。

如何查看 Windows 10 版本？

1. 使用 Win + R 打开运行窗口，输入 `winver` 然后回车就可以看到了
2. 或者：设置 -> 系统 -> 关于 也可以看到 Windows 10 系统版本

![windows-version](/images/linux/8/windows-version.png)

如何更新到 2004 版本？请查看文章底部的补充内容。

另外，你需要留给系统盘（C盘）足够的空间，建议 20G 以上空闲。

## 安装

### 1. 安装 WSL 2

1. 启动 Windows 功能：适用于 Linux 的 Windows 子系统、虚拟机平台

   ![windows-feature](/images/linux/8/windows-feature.png)

   不使用搜索的话，它的具体位置：应用 -> 程序和功能（右侧/底部相关设置下）-> 启用或关闭 Windows 功能。

   勾选其中的 适用于 Linux 的 Windows 子系统 和 虚拟机平台 这两项：

   ![open-sub](/images/linux/8/open-sub.png)

2. 重启电脑之后，进入 PowerShell（Win + X  或者 在启动菜单中搜索)，设置 WSL 2

   ```shell
   wsl --set-default-version 2
   ```

   如果提示更新内核的话，可以查看 [升级 WSL 2 内核](https://aka.ms/wsl2kernel) 官方教程，[直接下载 WSL 升级内核](https://wslstorestorage.blob.core.windows.net/wslblob/wsl_update_x64.msi) 。安装好内核之后，重新执行上面的命令。

3. 在 Microsoft Store 搜索 Ubuntu 并安装

   ![store-ubuntu](/images/linux/8/store-ubuntu.png)

4. 启动安装的 ubuntu，稍等片刻后设置用户名和密码，然后可以考虑进行 [Linux 换源](https://anandzhang.com/posts/linux/2)。

> 需要注意的是安装 ubuntu 后要确认是装了 WSL 2，通过命令 `wsl -l -v` 可以查看。
>
> ![wsl-version](/images/linux/8/wsl-version.png)
>
> 由于文章的时效性，你可以选择参考 [微软官方安装子系统教程](https://docs.microsoft.com/en-us/windows/wsl/install-win10) 。

### 2. 安装 Docker

这个教程参见 [Ubuntu 安装 Docker CE](https://anandzhang.com/posts/linux/6) ，这里不重复写了。

直接使用 `sudo systemctl start docker` 出现错误：

```
System has not been booted with systemd as init system (PID 1). Can't operate.
Failed to connect to bus: Host is down
```

请使用 `sudo /etc/init.d/docker start` 来启动 Docker。

## 效果

![wsl](/images/linux/8/wsl.png)

或者使用 VS Code 的 WSL remote 插件：

![vscode-wsl](/images/linux/8/vscode-wsl.png)

## 补充

WSL 和 主机是互通的，你可以在 WSL 中访问 Windows CDE 等磁盘，它们已经挂载好了的，比如 `/mnt/c/` 就是 C盘。

另外，启动或进入 WSL 不需要那么麻烦，直接在命令行输入 `wsl` 就进入了。我用的 Windows Terminal ，你也可以使用 Cmder、git bash 等命令行工具。Windows Terminal 可以直接在 Microsoft Store 中搜索下载。

### 如何升级 Windows 10 2004？

在微软官方安装子系统的教程中提到如今更新 Windows 10 2004 版 需要 [加入预览计划](https://insider.windows.com/insidersigninboth/) ，你可以在 [“开始”>“设置”>“更新和安全”>“Windows 预览体验计划”](ms-settings:windowsinsider) 中进行获取。

![insider-program](/images/linux/8/insider-program.png)

然后在 [Windows 更新](ms-settings:windowsupdate) 中检测更新就可以更新安装到 2004 版了。

![windows-insider](/images/linux/8/windows-insider.png)