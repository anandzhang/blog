---
typora-root-url: ../
tags: linux,cpu
createTime: 2020-03-21
updateTime: 2020-03-21
keywords: 查看CPU信息,CPU使用情况
summary: 前天尝试挖矿的时候，想要观察CPU使用情况。另外又注意到ECS服务器写的两核，但是 /proc/cpuinfo 只有1个核心，然后就去了解了一下，顺便记录记录。
---

# CPU原来如此

## 简介

Linux 系统如何查看CPU信息？我的Linux到底是几核、几个CPU？为什么购买的Linux服务器写的两核却只有一个CPU？

## CPU信息

查看CPU（Central Processing Unit 中央处理单元）信息有很多相关的命令，我只介绍 `/proc/cpuinfo` 。

### 概况

在 `/proc/cpuinfo` 中记录了 cpu 相关信息，使用终端查看：

```shell
cat /proc/cpuinfo
```

上面命令会列出每一个处理器的相关信息会很长，你可以配合 `more` 或者 `less` 查看，比如：`more /proc/cpuinfo` 或者 `less /proc/cpuinfo` ，`less` 可以滚动查看。

`processor` CPU处理器，从0开始编号。

`model_name` CPU型号。

`physical id` CPU物理ID，也就是CPU个数，从0开始编号。每个处理器的 `physical id` 都是0的话就是说这个Linux只有一个CPU。

`core id` CPU核心ID，从0开始编号。

`cpu cores` CPU核心个数。

### 具体个数

通过过滤 `physical id` 、`core id` 、`processor` 他们的编号，然后去重再统计数量来得到CPU、核心、处理器的个数。

使用管道 `|` 来进行操作：`grep` 进行对应的筛选，`uniq` 取唯一值，`wc -l` 计算出行数。

#### 1. 查看CPU个数

```shell
cat /proc/cpuinfo |grep 'physical id' |uniq |wc -l
```

#### 2. 查看核心个数（cores）

```shell
cat /proc/cpuinfo |grep 'core id' |uniq |wc -l
```

#### 3. 查看处理器个数（线程 threads）

```shell
cat /proc/cpuinfo |grep 'processor' |uniq |wc -l
```

### 理解

一个CPU能有多个核心，而每一个CPU核心（core）可以通过超线程技术实现出两个线程（thread），线程的数量依赖于CPU核心数量。

比如：一个单一处理器核心，虽然他可以每秒钟处理成千上万的指令，但是在某一时刻，它只能处理一条指令，这就是单线程；而超线程技术可以把一个物理处理器变成两个逻辑处理器，这时处理器在某一时刻就会有另一个线程在处理指令，它们可以并行处理更多的指令，这就是多线程。

线程（thread）是操作系统能够进行运算调动的最小单位，它被包含在进程（process）之中，是进程中的实际运作单位。想要创建线程就需要先创建一个进程，每一个进程至少有一个线程。

那么，阿里云的ECS服务器有的写的两核，为什么查看核心数只有一个，因为实际上它是单一处理器核心上的两个逻辑处理器。

## CPU使用情况

简单介绍下 `top` 命令，终端输入 `top` ：

![top](/images/linux/5/top.png)

第三行可以看见CPU使用占比 %Cpu：

- `us` 用户进程使用占比
- `sy` 系统进程使用占比（那些维持操作系统正常工作的进程）
- `ni` 非系统默认优先级的进程占比（修改过进程优先级的哪些）
- `id` 空闲可用占比（剩下还没有使用的）

下方显示了各进程的状态监控：

- `PID` 进程ID，可以使用 `kill` 跟上这个ID来杀死这个进程

- `USER` 进程所有者（是谁开启的这个进程）

- `PR` 优先级

- `NI` nice值，负值表示高优先级。

- `S` 进程状态（`R` 运行状态、`S` 睡眠状态、`D` 不可中断的睡眠状态、`Z` 僵尸进程）

- `%CPU` 上次更新到现在的CPU时间占用比

  这个百分比可以超过100%，最大值取决于线程数，比如4线程就可以是400%。

  同样的你可以按 `1` 让第三行显示出所有线程的使用情况。

- `%MEM` 进程使用的物理内存占比

- `TIME+` 进程使用CPU的时间

- `COMMAND` 进程名称

你也可以使用 `vmstat` 去定时打印CPU使用情况：

```shell
vmstat <间隔秒> <次数>
```

比如：`vmstat 1 5` 每隔1秒打印一次，一共只打印5次。