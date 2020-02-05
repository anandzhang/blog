---
typora-root-url: ../..
---

# CC校园网 VMware NAT上网

## 使用问题

使用皇家东软 校园网客户端 NSUCC，Virtual Box 的虚拟机可以正常使用NAT上网，但是VMware不行。

根据多次试验发现：CC客户端会自动阻断VMware NAT Service服务。也就是说即使你手动开启了VMware NAT Service但过一会儿又会被自动关闭，这样就导致不管你在虚拟机里面怎么设置都无法上网。

## 一键脚本

[脚本下载](https://anand-blog.oss-cn-chengdu.aliyuncs.com/myscript/nsucc-vmware-nat.bat) 

[Github 查看](https://github.com/anandzhang/myscript-pub/blob/master/nsucc-vmware-nat.bat) 

## 手动解决

1. Win + R 快捷键打开快速启动工具，输入 `regedit` 进入注册表编辑器

   ![regedit](/images/os/windows/4/regedit.jpg)

2. 打开 `\HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services` 找到 `VMware NAT Service` 

   ![modify](/images/os/windows/4/modify.png)

3. 双击 `Display name` 修改原来的名字，比如：修改为 `MMware NAT Service` 

4. 重启下电脑

5. Win + R 输入 `services.msc` 确保修改的 VMware NAT Service 处于运行状态

   ![services](/images/os/windows/4/services.png)

6. 连接CC，打开虚拟机，OK