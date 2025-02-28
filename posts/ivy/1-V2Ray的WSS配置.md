---
typora-root-url: ../
tags: ivy
priority: 0.6
createTime: 2020-03-10
updateTime: 2020-03-10
keywords: v2ray
summary: 使用V2Ray配置 WebSocket + TLS + Nginx 实现https伪装。
---

# V2Ray的WSS配置

关于 V2Ray 是什么有什么用，不赘述。

V2Ray 的配置和概念相对于 Shadowsocks(R) 要复杂，Shadowsocks(R) 简单易用，V2Ray 更复杂但功能强大，所以它更有学习和折腾的意义。

**注意：**

- 该教程是在CentOS 7 64位系统下使用Nginx进行配置。

- 该教程没有提供其他方式的配置。

## Q&A

V2Ray支持那么多协议为什么要用 WebSocket + TLS + Nginx？

> 你可以想想为什么有了 Shadowsocks(R) 还要用 V2Ray，因为“时代”进步。

V2Ray的底层实现是什么？

> V2Ray 是 Project V 下的一个工具，它是免费并开原的，你可以上 GitHub 查看和学习它的源码。

> 你想要实现“查看谷歌资料”的技术总结出来可分为加密和伪装，该教程使用了 V2Ray 的 WebSocket + TLS + Web 配置是一种伪装方式，伪装成https流量。

## 准备工作

1. 创建VPS服务器

   > 可参考 [Vultr创建VPS服务器](https://anandzhang.com/posts/server/5) 

2. 获取域名并解析到服务器

   可以获取免费域名，但是免费的东西能不能好好的用我也不清楚。
   
   建议在国外域名注册商购买，比如GoDaddy、NameCheap等，搭建这个不建议国内。因为这个域名只是拿来配置V2Ray，所以随便输一个域名，后缀选便宜的就好了，一般就 $1。
   
   > 域名解析可参考 [域名购买和解析](https://anandzhang.com/posts/server/3)

## 连接服务器

打开终端（Windows可以使用CMD），使用SSH连接到服务器：

```shell
ssh root@<ip>
```

> 请替换为自己服务器ip地址

> 如果ssh端口不是默认的22，就需要使用参数指定。
>
> 比如：搬瓦工的ssh端口在创建服务器时会生成
>
> ```shell
> ssh -p <port> root@<ip>
> ```
>
> 替换 `-p` 参数后的port为自己的ssh端口

## 安装 Nginx

1. 添加CentOS 7 Nginx yum库

   ```shell
   echo '[nginx]
   name=nginx repo
   baseurl=http://nginx.org/packages/mainline/centos/7/$basearch/
   gpgcheck=0
   enabled=1' >/etc/yum.repos.d/nginx.repo
   ```

2. 安装Nginx

   ```shell
   yum install -y nginx
   ```
   
3. 启动nginx并设置自启

   ```shell
   systemctl start nginx && systemctl enable nginx
   ```
   
4. （可选）浏览器打开`http://<domain name>` 可看到nginx已正常启动。

   ![nginx](/images/ivy/1/nginx.png)

## 获取SSL证书

我们可以使用 Certbot 获取由 [Let's Encrypt](https://letsencrypt.org/) 提供的免费SSL证书。

> Cerbot 的 CentOS 7 + Nginx 官方教程：[certbot-nginx-centos7](https://certbot.eff.org/lets-encrypt/centosrhel7-nginx) 

### 前提

- 已安装并启动 Nginx
- 域名已解析到服务器
- 防火墙未阻止http(80)、https(443)端口

### 使用 Certbot

> Certbot 会使用80端口进行域名验证

1. 安装epel拓展包库

   ```shell
   yum install -y epel-release
   ```

2. 安装 Cerbot

   ```shell
   yum install -y certbot python2-certbot-nginx
   ```

3. 只获得证书，不需要自动安装

   ```shell
   certbot certonly -n --nginx -d <domain name> --agree-tos --register-unsafely-without-email
   ```

   > 上面的命令使用了非交互操作，请使用自己的域名替换 `<domain name>` 。
   >
   > 你可以不使用上面的命令而使用下面这条命令来进行交互式获取证书：
   >
   > ```shell
   > certbot certonly --nginx
   > ```
   >
   > 这样会一步一步提示你填写域名、邮箱等信息。

获取的SSL证书位置：`/etc/letsencrypt/live/<domain name>` 

> `<domain name>` 为填的域名。

## 配置 Nginx

1. 清除 nginx 的默认配置我们自己配

   ```shell
   >/etc/nginx/conf.d/default.conf && vi /etc/nginx/conf.d/default.conf
   ```
   
2. 填写以下内容

   ```nginx
   # http
   # 把所有http的请求永久重定向到https
   server {
     listen 80;
     server_name <domain name>;
     return 301 https://$host$request_uri;
   }
   
   # https
   # 将访问 /anand/zhang 的请求反向代理给 V2Ray
   server {
     listen 443 ssl;
     server_name <domain name>;
       
     ssl_certificate /etc/letsencrypt/live/<domain name>/fullchain.pem;
     ssl_certificate_key /etc/letsencrypt/live/<domain name>/privkey.pem;
       
     ssl_session_timeout 10m;
     ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
     ssl_ciphers ALL:!ADH:!EXPORT56:RC4+RSA:+HIGH:+MEDIUM:+LOW:+SSLv2:+EXP;
     ssl_prefer_server_ciphers on;
     
     root /usr/share/nginx/html;
     index index.html;
   
     location /anand/zhang {
       proxy_redirect off;
       proxy_pass http://127.0.0.1:<v2ray port>;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection "upgrade";
       proxy_set_header Host $http_host;
     }
   }
   ```

   > 配置文件中需要替换的一共有：
   >
   > `<domain name>` 替换成自己的域名，共4处。
   >
   > `<v2ray port>`  替换为自己的v2ray监听的服务端口，先自己编一个，建议使用大端口（比如：21132、15342等），共一处。
   >
   > `/anand/zhang` 这个请求路经请自己编，比如：`/demo` 、`/images/info` 等等。
   
3. 重启nginx

   ```shell
   systemctl restart nginx
   ```

4. （可选）浏览器打开 `https://<domain name>` 会发现地址栏有安全提示锁。

   ![nginx1](/images/ivy/1/nginx1.png)

5. （可选）浏览器打开 `https://<domain name><path>` 会发现是502，因为我们的v2ray还没有配置和启动起来。

   ![nginx2](/images/ivy/1/nginx2.png)

## 安装并配置 V2Ray

1. 安装 V2ray，使用官方一键脚本安装：

   ```shell
   bash <(curl -L -s https://install.direct/go.sh)
   ```

2. 清除默认配置并编辑配置文件：

   ```shell
   >/etc/v2ray/config.json && vi /etc/v2ray/config.json
   ```
   
3. 填写以下内容（注意JSON格式）：

   ```json
   {
     "inbounds": [
       {
         "port": "<v2ray port>",
         "listen":"127.0.0.1",
         "protocol": "vmess",
         "settings": {
           "clients": [
             {
               "id": "<uuid>",
               "alterId": 64
             }
           ]
         },
         "streamSettings": {
           "network": "ws",
           "wsSettings": {
           "path": "<path>"
           }
         }
       }
     ],
     "outbounds": [
       {
         "protocol": "freedom",
         "settings": {}
       }
     ]
   }
   ```

   > 修改这些地方：
   >
   > `<v2ray port>` 为前面配置nginx时编的大端口号，两个必须保持一致。
   >
   > `<uuid>` 需要一个UUID，你可以使用在线工具生成：[UUID在线生成](https://www.uuidgenerator.net/) 。（比如：e75ee72f-22ec-4a81-a0fd-18a1bb5a8b16）
   >
   > `<path>` 为前面配置nginx时location后的路径，两个必须保持一致。（比如：/anand/zhang）
   
4. 启动 v2ray 并设置自启

   ```shell
   systemctl start v2ray && systemctl enable v2ray
   ```

## 检查配置结果

浏览器打开 `https://<domain name><path>` 会发现不再是502状态码，而是经过v2ray后返回的一个响应。服务器上的配置已经结束。

![nginx3](/images/ivy/1/nginx3.png)

> 如果还是502，说明[v2ray配置有问题](https://anandzhang.com/posts/ivy/3)，修改好配置后重启v2ray：
>
> ```shell
> systemctl restart v2ray
> ```

## 开始使用

## PC

```json
{
  "inbounds": [
    {
      "port": 1080,
      "listen": "127.0.0.1",
      "protocol": "socks",
      "sniffing": {
        "enabled": true,
        "destOverride": ["http", "tls"]
      },
      "settings": {
        "auth": "noauth",
        "udp": false
      }
    }
  ],
  "outbounds": [
    {
      "protocol": "vmess",
      "settings": {
        "vnext": [
          {
            "address": "<domain name>",
            "port": 443,
            "users": [
              {
                "id": "<uuid>",
                "alterId": 64
              }
            ]
          }
        ]
      },
      "streamSettings": {
        "network": "ws",
        "security": "tls",
        "wsSettings": {
          "path": "<path>"
        }
      }
    }
  ]
}
```

> 修改3处：
>
> `<domain name>` 为上面配置的域名
>
> `<uuid>` 为上面v2ray配置中的UUID
>
> `<path>` 为上面v2ray配置中的path

## Andriod

v2rayNG，待更。

## IOS

Shadowrocket 也就是小火箭，国区没有，可以注册一个美区ID然后登录Appstore进行下载，多少$忘记了。

待更。
