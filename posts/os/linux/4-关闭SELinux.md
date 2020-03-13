---
typora-root-url: ../../
tags: linux
createTime: 2020-3-13
updateTime: 2020-3-13
keywords: selinux,关闭selinux
summary: 关闭安全增强型 Linux（Security-Enhanced Linux）简称SELinux模块。
---

# 关闭SELinux

## 简介

安全增强型 Linux（Security-Enhanced Linux）简称 SELinux，它是一个 Linux 内核模块，SELinux 的结构及配置非常复杂，我也没有去看，直接关闭它然后重启服务器吧。总是有一些问题会提示SELinux限制等等等。

SELinux 有三种状态：

- `enforcing` 强制执行SELinux安全策略
- `permissive` SELinux打印警告而不是强制执行
- `disabled` 不加载SELinux策略

控制SELinux状态的文件：`/etc/selinux/config`

## 修改状态

> 所有命令复制时请去掉前面的 `$` 

1. 先查看SELinux的状态

   ```shell
   $ sestatus
   SELinux status: disabled
   ```

   如果显示的状态就是上面的 `disabled`，那么你出现的问题并不来自SELinux。

2. 先尝试临时关闭SELinux，也就是把它的状态改到 `permissive`，不需要重启

   ```shell
   $ setenforce 0
   ```

   如果这样没有解决你的问题，你可以尝试下面的禁用操作，但多半也解决不了你的问题。

3. 禁用SELinux，修改状态为 `disabled` ，需要进行重启

   ```shell
   $ sed -i "s/^\(SELINUX=\).*/\1disabled/" /etc/selinux/config
   ```