---
typora-root-url: ../../
tags: windows,VMware
createTime: 2018-02-21
updateTime: 2018-02-21
keywords: VMware安装Win7,windows7虚拟机安装
summary: 使用 VMware 安装 Windows 7 虚拟机。
---

# 虚拟机安装 Windows 7

通过 VMware 安装 Win7 虚拟机

## 准备工作

1. 下载 [VMware workstation pro](https://my.vmware.com/en/web/vmware/info/slug/desktop_end_user_computing/vmware_workstation_pro/15_0) ，下好windows版并安装。

2. 下载 [Win7 系统镜像](http://www.deepinghost.com/win7/) ：选择最新的 win7镜像下载。

   > 链接的网站提供的不是官方镜像，它对 win7 作了一些修改和预装，并带有激活工具。

## VMware 步骤

2. 打开 VMware，文件 > 新建虚拟机  > 典型

   ![vmware1](/images/os/windows/3/vmware1.png)

3. 下一步，选择好下载的Win7镜像文件

   ![vmware2](/images/os/windows/3/vmware2.png)

4. 下一步，给虚拟机命名并选择安装路径

   ![vmware3](/images/os/windows/3/vmware3.png)

5. 下一步，设置要分给Win7虚拟机的磁盘容量

   ![vmware4](/images/os/windows/3/vmware4.png)

6. 通过“自定义硬件”来设置给虚拟机分配的内存空间大小

   ![vmware5](/images/os/windows/3/vmware5.png)

7. 修改硬盘接口类型为IDE

   ![vmware6](/images/os/windows/3/vmware6.png)

## BIOS 设置

1. 使虚拟机进入BIOS界面

   ![bios1](/images/os/windows/3/bios1.png)

2. 在BOOT中修改启动顺序 将CD启动移动到第一位： （通过下方相应按键来修改 修改后按F10保存

   ![bios2](/images/os/windows/3/bios2.png)

## 磁盘分区

1. 对分给虚拟机的磁盘进行分区（这里我使用的是PQ 8.05）

   ![bios3](/images/os/windows/3/disk1.png)

2. 右击 未分配->建立

   ![disk2](/images/os/windows/3/disk2.png)

3. 选择 主要分割区 NTFS ；再设置大小 （为系统盘C的大小）

   ![disk3](/images/os/windows/3/disk3.png)

4. 按同样的步骤建立“逻辑分割磁区”；并设置大小（非系统盘）

   ![disk4](/images/os/windows/3/disk4.png)

   ![disk5](/images/os/windows/3/disk5.png)

5. 右键 第一个分区—进阶—设定为作用

   ![disk6](/images/os/windows/3/disk6.png)

   ![disk7](/images/os/windows/3/disk7.png)

## 开始安装 Win 7

1. 安装Win7系统镜像

   ![install1](/images/os/windows/3/install1.png)

2. 安装好win7镜像后 再次修改BIOS中BOOT下的启动顺序： 将CD启动的位置还原

   ![install2](/images/os/windows/3/install2.png)

   ![install3](/images/os/windows/3/install3.png)

3. 安装Win7虚拟机已经大功告成

   ![install4](/images/os/windows/3/install4.jpg)