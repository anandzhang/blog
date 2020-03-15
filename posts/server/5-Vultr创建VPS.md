---
typora-root-url: ../
tags: server
createTime: 2020-03-10
updateTime: 2020-03-10
keywords: vultr,vps,v2ray
summary: 使用Vultr创建VPS服务器。
---

# Vultr创建VPS

VPS服务器的提供商有很多，文章主要讲解国外提供商Vultr的服务器创建方式。

如果想了解我个人使用国外VPS的经历可以访问 [国外VPS使用经历](https://anandzhang.composts/ivy/2) 。

## Vultr

1. 进入 [官网](https://www.vultr.com/?ref=8484002) 注册账号

2. 创建VPS服务器

   ![create](/images/server/5/create.png)

   登录后点击左侧 Products(产品)，然后点击 +

3. 选择服务器和服务器位置

   ![chooseserver](/images/server/5/chooseserver.png)

   因为Vultr也被用于部署网站和其他业务，它会有很多配置类型，根据需要进行选择就好了。

   ![serverlocation](/images/server/5/serverlocation.png)

   根据需要进行选择，东京和新加坡平均ping值较低，美国地区相对于要高些。
   
4. 设置服务器类型

   ![servertype](/images/server/5/servertype.png)

   本站V2Ray搭建教程使用了CentOS7 x64，你可以按图选择。

5. 设置服务器配置

   ![serversize](/images/server/5/serversize.png)

   根据需要来选择。

6. （建议）添加脚本去开启需要的TCP端口，防止防火墙的原因导致SSH连接问题，顺便也开启web服务需要的端口。

   ![script1](/images/server/5/script1.png)

   ![script2](/images/server/5/script2.png)

   ```shell
   #!/bin/sh
   sshdConfig=/etc/ssh/sshd_config
   # 新的ssh端口
   newPort=21213
   # 修改ssh默认的22端口
   sed -i "/Port 22/d" ${sshdConfig}
   echo "Port ${newPort}" >>${sshdConfig}
   # 重启ssh服务
   systemctl restart sshd
   # 开启ssh端口
   firewall-cmd --permanent --zone=public --add-port=${newPort}/tcp
   # 开启http端口
   firewall-cmd --permanent --zone=public --add-port=80/tcp
   # 开启https端口
   firewall-cmd --permanent --zone=public --add-port=443/tcp
   # 重启防火墙
   firewall-cmd --reload
   ```

   > 这个启动脚本里我修改了SSH默认端口为21213，你可以改为其他值（别忘记改开启的SSH端口），不建议默认端口是因为SSH连接不稳定或者被阻断。
   >
   > 如果后面连接不上修改的端口，可能是SELinux模块导致修改端口失败，需要使用Vultr提供的控制台去查看情况（我用的 CentOS 7 没遇到，但是CentOS 8出错）。
   >
   > ![console](/images/server/5/console.png)
   >
   > 出错查看：[SSH端口修改出错](https://anandzhang.com/posts/server/7) 
   >
   
   ![script3](/images/server/5/script3.png)
   
7. 创建

   ![deploy](/images/server/5/deploy.png)

   ![deploy2](/images/server/5/deploy2.png)

8. 等待安装结束

   ![installing](/images/server/5/installing.png)

## 连接服务器

>创建好服务器后，需要等几分钟；如果ssh没有响应，等一两分钟再试。
>
>你可以选择下载自己电脑系统对应的SSH客户端，比如：Xshell（Windows）、Termius（Windows、macOS）等。

打开 Terminal 终端，输入ssh连接。（Windows可以打开CMD）

```shell
ssh root@<ip>
```

> 替换自己的ip

### Windows CMD 打开方式

1. Win + R 两个键一起按
2. 输入 `cmd` 