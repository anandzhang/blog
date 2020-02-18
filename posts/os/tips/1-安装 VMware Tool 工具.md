---
typora-root-url: ../..
tags: VMware
createTime: 2018-1-4
updateTime: 2018-1-4
keywords: VMware Tool,安装Vmware工具
summary: 使用 VMware 虚拟机时，经常需要从外面主机复制文件或文件夹到虚拟机内，或者复制粘贴一段文字进虚拟机，安装 Vmware Tool 可以更高效的使用虚拟机来工作。
---

# 安装 VMware Tool 工具

使用 VMware 时，安装好VMware Tool工具可以更好的复制粘贴、从虚拟机内拉取文件等

## 准备工作

![vmwaretool](/images/os/tips/1/vmwaretool.png)

## Windows

双击光盘安装就好

## Linux

1. 打开光盘

   ![linux](/images/os/tips/1/linux.png)

2. 空白处右键，在该位置打开终端

3. 移动这个文件到 `/usr/local/src` 下：

   ```shell
   $ sudo mv XXXX.tar.gz /usr/local/src
   ```

4. 解压该文件：

   ```shell
   $ cd /usr/local/src
   $ sudo tar -xzvf VMwareToolsXXXXXX.tar.gz
   ```

5. 进入到解压后的文件内：

   ```shell
   $ cd XXX
   ```

6. 安装VMwareTool ：

   ```shell
   $ sudo ./vmware-install.pl
   ```