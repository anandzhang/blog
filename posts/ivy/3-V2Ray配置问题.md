---
typora-root-url: ../
tags: ivy
createTime: 2020-03-10
updateTime: 2020-03-10
keywords: v2ray
summary: V2Ray配置 WebSocket + TLS + Nginx 出现的问题。
---

# V2Rray配置问题

这篇文章是配置V2Ray的WSS方案中出现的一些问题的解决方案。

查看V2Ray状态

```shell
systemctl status v2ray
```

尝试重启解决

```shell
systemctl restart v2ray
```

在nginx的配置中添加日志：

```shell
access_log /root/access.log main;
error_log /root/error.log info;
```

再次尝试使用v2ray，然后查看日志内容，如果出现很多 `Permission Denied` 权限限制，尝试 [关闭SELinux](https://anandzhang.com/posts/os/linux/2) 。

