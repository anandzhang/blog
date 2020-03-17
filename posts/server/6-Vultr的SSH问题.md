---
typora-root-url: ../
tags: server
createTime: 2020-03-10
updateTime: 2020-03-10
keywords: vultr,ssh
summary: 在使用Vultr服务器时，SSH连接的问题。
---

# Vultr的SSH问题

## 问题

最开始使用Vultr经常创建好实例后通过SSH连接服务器一直没有反应。

```shell
$ ssh root@<ip>
Connection closed by 198.13.59.17 port 22
```

或者

```shell
$ ssh root@<ip>
ssh: connect to host 45.76.206.253 port 22: Connection timed out
```

然后过一会又连接上了，然后一会又不行了。

## IP检测

> [IP检测工具](https://www.toolsdaquan.com/ipcheck/) 
>
> `ping` 是ICMP协议，`ssh` 是TCP协议。

- 国内外TCP均不可用，检查是不是防火墙问题

  ```shell
  firewall-cmd --list-port
  ```

- 国外可用，国内不可用，可能IP或者端口被封，换一个端口试一下

  ```shell
  vi /etc/sshd/sshd_config
  ```

  找到里面的 `Port` 修改后面的值，然后重启sshd

  ```shell
  systemctl restart sshd
  ```

## 防火墙设置

- 添加端口，以80端口为例

  ```shell
  firewall-cmd --permanent --zone=public --add-port=80/tcp
  ```

- 重启防火墙服务

  ```shell
  firewall-cmd --reload
  ```