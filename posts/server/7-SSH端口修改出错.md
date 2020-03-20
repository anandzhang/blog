---
typora-root-url: ../
tags: server
createTime: 2020-03-10
updateTime: 2020-03-10
keywords: ssh,ssh修改端口无效
summary: 修改SSH端口没有生效？。
---

# SSH端口修改出错

修改SSH的默认端口后，没有生效，连接不上服务器

1. 查看配置是否修改正确

   ```shell
   cat /etc/ssh/ssd_config | grep Port
   ```

2. 上面没问题就重启sshd服务

   ```shell
   systemctl restart sshd
   ```

3. 查看sshd服务状态

   ```shell
   systemctl status sshd
   ```

4. 如果有报错，查看具体情况

   ```shell
   journalctl -xe
   ```

5. 如果是SELinux阻止，请[关闭SELinux](https://anandzhang.com/posts/linux/4) 