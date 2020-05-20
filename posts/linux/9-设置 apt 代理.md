---
typora-root-url: ../
tags: wsl,docker
createTime: 2020-05-20
updateTime: 2020-05-20
keywords: apt代理,ubuntu设置apt代理
summary: 通过添加 apt 代理来解决 Ubuntu 安装软件或者获取软件源较慢的问题。
---

# 设置 apt 代理

在使用 Ubuntu 的时候总是因为添加了一些国外的软件源，安装的时候很慢，通过配置代理来解决这个问题。

1. 创建并编辑 `proxy.conf` 

   ```shell
   sudo vi /etc/apt/apt.conf.d/proxy.conf
   ```

2. 添加 `HTTP` 规则

   ```
   Acquire::http::Proxy "http://127.0.0.1:6666/";
   ```

其他规则：

 `HTTPS` ：

```
Acquire::https::Proxy "http://127.0.0.1:6666/";
```

`Socks5` ：

```
Acquire::socks5::proxy "socks://127.0.0.1:1080/";
```

多个代理：

```
Acquire {
  HTTP::proxy "http://127.0.0.1:6666";
  HTTPS::proxy "http://127.0.0.1:1080";
}
```

参考：[如何为 ubuntu apt 设置代理](https://www.serverlab.ca/tutorials/linux/administration-linux/how-to-set-the-proxy-for-apt-for-ubuntu-18-04/) 

