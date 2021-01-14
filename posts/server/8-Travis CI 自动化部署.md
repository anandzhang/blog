---
typora-root-url: ../
tags: ci
createTime: 2021-01-15
updateTime: 2021-01-15
keywords: ci部署,travis ci项目部署,travis ci项目自动化部署
summary: 使用 Travis CI 对项目进行自动化部署，简单配置每次主分支有新的提交，服务器就自动进行更新。
---

# Travis CI 自动化部署

## 前言

现在项目增加新功能后，需要先推送到 GitHub 上提 PR，再等 CI 运行项目单元测试通过后再合并到主分支，最后还需要登上服务器进行部署，感觉有点麻烦呢，就想试试自动化部署。

大致流程就是当项目主分支有新的提交记录后，Travis CI 会运行对应的 `deploy` 配置项，这个配置只需要通过 `ssh` 运行服务器上一个脚本就可以了。

## 创建 travis 用户

先为 CI 部署时 `ssh` 登录服务器新增一个专用用户，这样简单的限制一下用户权限，避免直接使用管理员。最开始我还想过去限制登录这个用户后，把这个用户限制到一个目录里，但是后来使用 `Chroot Jail` 做了尝试，虽然真的限制了用户访问的目录，但是很多基础操作和命令都被受限或缺失，还需要去配置，并不是想要的效果，如果想了解一下的话可以参考 [Restrict SSH User Access to Certain Directory Using Chrooted Jail](https://www.tecmint.com/restrict-ssh-user-to-directory-using-chrooted-jail/) 这个文章去配置。

1. 新增一个 `travis` 用户用来部署登录

   ```shell
   useradd travis
   ```

2. 为这个用户设置一个登录密码

   ```shell
   passwd travis
   ```

## 加密 ssh 私钥文件

因为部署时需要 `ssh` 连接到服务器运行脚本，所以我们需要先使用 Travis CLI 命令行工具对私钥进行加密，之后 Travis 自动化部署时只需要这个加密后的密钥，这样才能确保服务器安全。

1. 使用 `gem` 安装 Travis CLI

   ```shell
   sudo gem install travis
   ```

   如果提示没有 `gem` 就自己安装下哈。

2. 先切换到项目的目录下，再登录 Travis

   ```shell
   travis login --pro g <github token>
   ```

   > `--pro` 是使用 `travis-ci.com` ，之前是 `.org` 的地址，但是现在都是 `.com` 。
   >
   > `-g`   是使用 GitHub 的个人 Token 进行登录，如果你能接受输入用户名和密码登录的话就去掉这个参数，直接使用 `travis login --pro` 也行。怎么创建私人Token可以参考：[Creating a personal access token](https://docs.github.com/en/free-pro-team@latest/github/authenticating-to-github/creating-a-personal-access-token) 

3. 生成一个 SSH 密钥

   ```shell
   ssh-keygen -f ./key -t ecdsa -b 521 -C 'travis'
   ```

   `-f` 创建后密钥文件名称，`-t` 密钥算法，`-b` 密钥大小，`-C` 注释（方便服务器区分密钥）

   运行这个命令后会提示输入密钥加密口令，直接回车不设置。

4. 将生成的 SSH 密钥的公钥拷贝到服务器 `travis` 用户的 `ssh` 授权主机文件上，之后就可以进行免密登录了。

   ```shell
   ssh-copy-id -i ./key travis@<ip>
   ```

5. 使用 Travis CLI 加密 SSH 私钥

   ```shell
   travis encrypt-file --pro key --add
   ```

   `-add` 参数会自动添加需要的配置到 `.travis.yml` 里。需要注意的是自动添加后缩减可以会不习惯，比如我的：

   ```yaml
   language: node_js
   node_js:
     - lts/*
   before_install:
   - openssl aes-256-cbc -K $encrypted_a68f2225bf71_key -iv $encrypted_a68f2225bf71_iv
     -in key.enc -out key -d
   ```

   这里如果你想统一锁进，需要注意 `-in key.enc ...` 这一行是和上一行是一起的，不要调整错了，应该是这样：

   ```yaml
   language: node_js
   node_js:
     - lts/*
   before_install:
     - openssl aes-256-cbc -K $encrypted_a68f2225bf71_key -iv $encrypted_a68f2225bf71_iv -in key.enc -out key -d
   ```

   加密后生成的 `key.enc` 文件之后提交时需要也需要推到 GitHub的。

6. 删除之前生成的 SSH 密钥文件

   ```shell
   rm -f key key.pub
   ```

## 配置自动化部署

最开始我使用的是 `after_success` 这个 Travis 提供的工作周期，但是它会在构建成功之后运行，我们实际需求并不是这样，我们是需要限制是主分支才部署。如果使用 `branches` 去限制构建分支的话也不太对，这样会导致其他分支有新提交不进行 CI 构建了。

所以我们需要使用 `deploy` 去配置，具体解释可参考官方文档：[Script deployment](https://docs.travis-ci.com/user/deployment/script/) 。

1. 将之前获得 SSH 私钥的命令的周期从 `before_install` 修改为 `before_deploy` 。因为这个私钥只在部署的时候才会用到。

2. 配置 `deploy` 的脚本命令，`deploy` 默认在项目主分支触发，你可以自己通过 `on` 进行设置，也可以区分开发环境和生存环境使用不同脚本。

   ```yaml
   language: node_js
   node_js:
     - lts/*
   before_deploy:
     - openssl aes-256-cbc -K $encrypted_a68f2225bf71_key -iv $encrypted_a68f2225bf71_iv -in key.enc -out key -d
     - chmod 600 key
   deploy:
     provider: script
     script: ssh -i key -o StrictHostKeyChecking=no travis@<ip> echo 'hello'>> test
     skip_cleanup: true
   ```

`before_deploy` 的周期里需要添加密钥访问权限的修改命令，因为 `ssh` 连接时会出现密钥不应该被其他人访问的提示，所以我们需要去掉组和其他用户的权限 `chmod 600 key` 。

`-o StrictHostKeyChecking=no` 因为 `ssh` 连接时会出现未知主机提示确认的 `yes | no` 选择，但是没法去交互，我们需要跳出跳过这个提示。

`skip_cleanup` 因为 CI 构建完成后会清除之前构建操作形成的文件，  而 `before_deploy` 生成的密钥也是被清掉了，所以我们需要跳过这个清理步骤。

## 最后

`deploy` 的脚本配置上面只是给 `test` 文件添加一行 `hello` ，每次主分支有新提交就会触发。我们可以设置触发服务器上的一个脚本。

```shell
ssh -i key -o StrictHostKeyChecking=no travis@<ip> ~/deploy.blog.sh
```

其他复杂情况的部署需求，可以直接看 [Travis CI Doc](https://docs.travis-ci.com/) 进行额外的配置。