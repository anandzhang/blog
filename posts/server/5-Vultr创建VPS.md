---
typora-root-url: ../
tags: server
createTime: 2020-3-10
updateTime: 2020-3-10
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

7. 创建

   ![deploy](/images/server/5/deploy.png)

   ![deploy2](/images/server/5/deploy2.png)
   
7. 等待安装结束

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