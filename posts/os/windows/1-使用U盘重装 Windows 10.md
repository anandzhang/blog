---
typora-root-url: ../..
tags: windows
createTime: 2018-3-2
updateTime: 2019-12-2
summary: 使用U盘重装 Windows 10，还你一个最纯净的Win10。需求：8G及其以上大小的U盘、一个可用的Windows系统。
---

# 使用U盘重装 Windows 10

> 通过重装Windows可以解决处电脑硬件问题意外的大部分问题，比如系统崩溃不能使用等。
>
> 该文章描述的方法为最纯洁无残留的重装方式。
>
> 教程需求：8G及其以上大小的U盘、一个可用的Windows系统。
>
> 自己电脑已经无法正常开机的情况下，你就需要借用一下他人的Windows系统。

## 准备工作

1. 下载 Windows 镜像

   > Windows 10 官方最新镜像下载方式
   >
   > [MSDN 镜像](https://msdn.itellyou.cn/) ：点击左侧导航栏中“操作系统”，可下载微软官方镜像。包括Windows各版本。

2. [下载 微PE工具箱](http://www.wepe.com.cn/download.html) 

   > 使用 WinPE 系统管理磁盘分区等。
   >
   > 根据系统位数下载 微PE工具箱V2.0 的64/32位版本。

## 制作 U盘 启动器

1. 打开下载的 微PE工具箱，选择 安装PE到U盘

   ![step1](/images/os/windows/1/step1.png)

2. 插入准备好的U盘（备份好U盘的数据），按默认选项就好

   ![step2](/images/os/windows/1/step2.png)

3. 确认制作

   ![step3](/images/os/windows/1/step3.png)

4. 等待制作结束，然后在 我的电脑 中可以看到两个分区

   ![step4](/images/os/windows/1/step4.png)

5. 将下载好的 Windows 10 ISO 镜像复制到pe磁盘上（不是EFI分区）

   ![step5](/images/os/windows/1/step5.png)

6. 等复制完成后，需要的Windows安装介质就制作好了

## 从U盘介质启动电脑

1. 重启电脑进入启动介质选择，选择制作的U盘启动器

   ![step6](/images/os/windows/1/step6.JPG)

2. 进入 PE 系统

   ![step7](/images/os/windows/1/step7.JPG)

## 磁盘分区

> 下面的磁盘分区操作会清楚掉所有数据

1. 删除磁盘上所有分区

   ![step8](/images/os/windows/1/step8.png)

2. 建立新分区

   > 首先建立第一个主分区，也就是常说的C盘（本地磁盘 （C：））。
   >
   > 根据需要分配大小，尽量不要太小。

   ![step9](/images/os/windows/1/step9.png)

   > 首先需要创建磁盘的ESP和MSR分区，如图创建就好。

   ![step10](/images/os/windows/1/step10.png)

   > 这里我只分配了40G给C盘是因为我的Windows不常用

   ![step11](/images/os/windows/1/step11.png)

3. 建立其他分区

   > 建立除了C盘意外的其他分区，按照自己的需要和磁盘的大小建立。

   ![step12](/images/os/windows/1/step12.png)

   > 由于我的工作环境主要在 Linux，所以留了大部分空间剩余给 Ubuntu。如果你只使用Windows 请按照自己的需要进行分区。

4. 保存更改，确定

   ![step13](/images/os/windows/1/step13.png)

## 安装 Windows 10

1. 点击 我的电脑

   ![step14](/images/os/windows/1/step14.png)

2. 打开刚才复制windows10镜像的地方，装载 ISO 文件。

   ![step15](/images/os/windows/1/step15.png)

3. 打开 Window 10 安装程序 setup.exe

   ![step16](/images/os/windows/1/step16.png)

   ![step17](/images/os/windows/1/step17.png)

4. 接受许可条款，然后下一步

   ![step18](/images/os/windows/1/step18.png)

5. 选择 自定义

   ![step19](/images/os/windows/1/step19.png)

6. 选择刚才分好的主分区，然后下一步

   ![step20](/images/os/windows/1/step20.png)

7. 等待安装结束

   ![step21](/images/os/windows/1/step21.png)

8. 按照提示做一些设置就好

   ![step22](/images/os/windows/1/step22.png)

## 安装相关驱动

你需要安装电脑需要的相关驱动，比如显卡、声卡、CPU等

> 比如笔记本无法通过按钮调节屏幕亮度，是显卡驱动问题。

通过 驱动精灵 或者 笔记本驱动管理软件（比如：lenovo驱动管理）进行驱动安装。

> 驱动精灵我在安装过程中出现了一些捆绑安装软件，需要注意取消勾选一下不必要的软件。