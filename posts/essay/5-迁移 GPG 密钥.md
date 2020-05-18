---
typora-root-url: ../
tags: gpg
createTime: 2020-05-18
updateTime: 2020-05-18
keywords: 导出GPG,导出导入GPG,转移GitHub GPG密钥签名
summary: 转移 GitHub 上使用的 GPG 签名到另外一台电脑。
---

# 迁移 GPG 密钥

## 前言

用了差不多半年的 `Windows` 和 `Ubuntu` 双系统，`Ubuntu Linux` 系统是我这几个月的开发主力机。

由于多个办公软件无法在 `Linux` 上完美的运行，使用 `deepin-wine` 只能解决个别需求，通过 `wine` 勉强运行的个别 `Windows` 应用总是出现占有内存过多，不稳定等现象，再加上最近对钉钉APP有了刚需，不得不换回 `Windows` 进行主力开发。

以前 `Ubuntu` 被我弄崩机时没有备份好 `GitHub` 上使用的 `GPG key`， 导致在项目中出现大量 `Unverified` 的 `commit` 记录，这次记录一下 `GPG key` 的备份迁移。

## 操作

1. 查看存在的 `GPG` 

   ```shell
   gpg --list-keys
   ```

2. 导出密钥文件

   ```shell
   gpg --export-secret-keys -a <keyid> >private_key.asc
   gpg --export -a <keyid> >public_key.asc
   ```

3. 另一台电脑上导入

   ```shell
   gpg --import private_key.asc
   gpg --import public_key.asc
```
   

## 配置 Git 通过 GPG 签名

```shell
git config --global user.signingkey <keyid>
git config --global commit.gpgsign true
```

## 补充

### 签名失败 gpg failed to sign the data

编辑 `/etc/profile` 添加 `export GPG_TTY=$(tty)` 

参考：[failed to sign](https://gist.github.com/repodevs/a18c7bb42b2ab293155aca889d447f1b)