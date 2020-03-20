---
typora-root-url: ../
tags: XMR
createTime: 2020-03-20
updateTime: 2020-03-20
keywords: XMR挖矿
summary: 最近因为好奇别人提到的挖矿，而且自己也有闲置的服务器，就想自己也去尝试了一下，现在就说说挖矿的真实情况吧。
---

# XMR挖矿实录

## 简介

**XMR？**

> XMR 就是门罗币。官方解释门罗币是一个安全的，私密的，不可追溯的货币。我觉得就是和比特币类似，但是更安全（个人理解：所有节点组成一个环，这样就不知道交易的发起者来自哪里，也不知道交易的接受者是谁），也是区块链的产物。

**挖矿？**

> 挖矿就是通过我们计算机CPU/GPU去做大量的哈希计算，去勘探区块链系统节点产生的那个随机哈希，也就是去发现区块，从而获得一些门罗币的奖励。

## 尝试挖矿

最近太好奇别人提到的挖矿了，而且由于疫情的原因在阿里云那里拿到了一个2核4G的服务器，也就突然多了一个暂时闲置的服务器，然后我就想去试试这个挖矿到底怎么样，“薅羊毛”。文章以下内容的门罗币全使用XMR简写。

### 获取XMR钱包

#### 1. 分类

想要挖矿，就需要先获得一个钱包去存自己的XMR收益。获取XMR钱包的方法常见的有：本地钱包、在线钱包。

本地钱包需要在 [官网](https://www.getmonero.org/) 下载GUI/CLI客户端，GUI为图形界面的客户端，CLI是命令行的客户端。

在线钱包是一种很轻便的方式，第三方 [MyMonero](https://mymonero.com/) 。

#### 2. 客户端

GUI客户端下载后就通过对应的指引创建一个新钱包就可以了。创建前会有几个模式问你要不要下载区块链到本地，区块链下下来接近50G吧，还会越来越大的，下载下来后就是一个所谓的区块链本地节点了，这样会很安全；另外就是不下载，不下载就需要用到远程节点，你可以去 [moneroworld](https://moneroworld.com/) 找一个用，这种方式较方便，但是会丧失一定的安全性。

CLI客户端的话我也试过，下载后里面有很多可执行程序，比如 `monero-wallet-cli` 管理钱包的、`monerod` XMR的守护进程等，创建钱包有这几个命令（Linux为例）：

```shell
./monero-wallet-cli --daemon-address <远程节点位置和端口>
```

创建好了通过 `refresh` 刷新钱包就OK。

**钱包地址：** 钱包地址就是在挖矿的时候需要填写的，以4开头。命令行通过 `address` 得到。

#### 3. 注意项

备份好创建钱包时显示的25个字或词，也就是 seed（易记种子），这个就像是找回QQ号码的密保，以后需要恢复这个钱包就需要用到。

在挖矿之前必须同步了区块链，这样会把自己添加到区块链中，才可以使用。

#### 4. 补充

Linux 下载客户端后是一个 `bz2` 的包，使用命令 `tar jvfx <包名>` 进行解压。

因为网上有很多获取钱包的图文详细教程，那我就只文字描述下过程咯。

### 下载挖矿软件

我下了 XMRig 去挖矿，[XMRig官方安装教程](https://github.com/xmrig/xmrig/wiki) 。选自己的系统，然后按照教程安装就可以了。

![xmrig](/images/essay/1/xmrig.png)

以我的CentOS7为例，官方提供教程我做个解释：

```shell
# 安装 epel-release yum的扩展库
sudo yum install -y epel-release
# 安装编译需要的依赖和环境
sudo yum install -y git make cmake gcc gcc-c++ libstdc++-static libuv-static hwloc-devel openssl-devel
# 克隆 xmrig 项目得到编译需要的源码
git clone https://github.com/xmrig/xmrig.git
# 切换到下好的 xmrig 文件夹，并创建 build 文件夹再进入其中
cd xmrig && mkdir build && cd build
# 通过 cmake 配置编译，进行预编译
cmake .. -DUV_LIBRARY=/usr/lib64/libuv.a
# 编译安装 xmrig
make
```

教程里 `cd xmrig && mkdir build && cd build` 命令把 XMRig 安装编译到了下载文件的 `build` 目录中，所以以后你启动需要的运行程序在 `build` 里。

### 寻找矿池

有很多的矿池，至于怎么选，国内的服务器建议选国内的矿池， 使用国外的也可以；国外的同理选择国外的矿池。

> 为什么？因为国内的服务器去选择国外的矿池开始挖矿的话，会存在比较大的延时，虽然不会影响到计算机进行哈希运行，但是有时候会导致算出的哈希任务传过去的时候出现有一部分过期了的情况。

国外的我用过 `minexmr.com` ，国内的用过 `f2pool.com` 鱼池 、`c3pool.com` 猫池，他们怎么样我没有发言权，因为我没怎么用，但是你需要注意几个点：费率、模式（PPS还是PPLNS）、提XMR的最低额。

![minexmr](/images/essay/1/minexmr.png)

### 开始挖矿

 #### 1. 配置 XMRig

简单方式：[Configuration wizard](https://xmrig.com/wizard) 这个网站去得到配置结果，一种是 config file 配置文件形式，一种是 command line 命令行形式。 

配置文件：在 xmrig 执行程序同目录创建一个 `config.json`，粘贴进配置结果。

#### 2. 启动 XMRig

Linux：使用 nohup 在后台挂起这个程序

```shell
nohup ./xmrig &
```

### 查看收益

#### mineXMR

在对应的矿池网站中会有 `Dashboard` 这一栏，点击后填写自己钱包地址就可以了。

![dashboard](/images/essay/1/dashboard.png)

#### F2Pool

点击右上角的搜索，然后输入钱包地址，选择XMR就行了。

![f2pool](/images/essay/1/f2pool.png)

## 我的收益

我在阿里云 2核（2线程）ECS服务器和国外 4核心8线程服务器运行了这个XMRig进行挖矿，阿里云算力400H/s，国外 3000H/s。

![4th](/images/essay/1/4th.png)

最开始直接运行是4线程，使用了50%的CPU，然后我改了配置文件，修改了参数，拉满8个线程：

![cpu](/images/essay/1/cpu.png)

然后一晚上过后，XMR的数量是数字的还有4个零。E...，呃呃呃，算一算收益，几毛哟。

如何看请CPU的真实情况，几个CPU几核心，可以看 [CPU原来如此](https://anandzhang.com/posts/linux/5) 。

## 个人感想

我用了一天了解和弄好这个XMR挖矿，然后第二天查看了一晚上的收益，太残忍了吧，太少了，别说日积月累了，日积月累帕是几年一个XMR哟，而且我服务器又不会一直闲置。

所以：CPU挖矿还是收益太低了，除非你的闲置服务器够多（想多了），GPU显卡挖矿应该才是主力，而且还出现了什么专业矿机去挖矿，可想而知我们这种业余的CPU挖矿能像别人说的随便几百收益？醒醒啊兄弟。

那么，就在这第二天....我直接退坑了，我的服务器适合部署更有价值的业务。