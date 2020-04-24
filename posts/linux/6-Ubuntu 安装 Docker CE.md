---
typora-root-url: ../
tags: docker
createTime: 2020-04-24
updateTime: 2020-04-24
keywords: 安装docker,ubuntu安装docker,ubuntu 安装 docker ce社区版
summary: Ubuntu 安装 Docker Community Edition (Docker社区版)。
---

# Ubuntu 安装 Docker CE

## 简介

使用 `Linux` 发行版 `Ubuntu` 安装 `Docker CE` （Docker社区版）。

参考文章：[ubuntu install docker](https://docs.docker.com/engine/install/ubuntu/) 。

## 安装

### 1. 添加仓库

1. 更新 `apt` 包管理器索引

   ```shell
   sudo apt update
   ```

2. 安装一些需要的工具

   ```shell
   sudo apt install apt-transport-https ca-certificates curl gnupg-agent software-properties-common
   ```

3. 添加 `Docker` 官方 `GPG key` 

   ```shell
   curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
   ```

4. 添加 `Docker stable` 稳定版仓库（Intel、Amd）

   ```shell
   sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
   ```

### 2. 安装 Docker

1. 更新 `apt` 索引

   ```shell
   sudo apt update
   ```

2. 安装最新版

   ```shell
   sudo apt install docker-ce docker-ce-cli containerd.io
   ```

### 3. 添加用户组（待更）

安装好 `docker` 后，需要使用管理员权限进行操作，如：`sudo docker` 。为了更方便的使用 `docker cli` ，我们可以通过用户组的方式进行解决。

```shell
sudo usermod -aG docker ${USER}
```

## 补充

国内使用默认的镜像源拉取镜像会很慢，我们需要修改国内镜像源以更好的使用 `docker` 。请参考 [配置 Docker 镜像加速](https://anandzhang.com/posts/linux/7)。