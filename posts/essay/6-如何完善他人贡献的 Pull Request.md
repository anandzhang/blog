---
typora-root-url: ../
tags: github
createTime: 2024-12-18
updateTime: 2024-12-18
keywords: GitHub PR 修改, 修改他人 Pull Request, 管理开源仓库 PR, GitHub 协作指南, PR 调整
summary: 当别人给我们开源仓库提交 Pull Request 时，Review 审查贡献者提交的代码可能会发现需要进行一些调整，结合贡献者情况我们可以追加 Commit 来协助完善。
---

# 如何完善他人贡献的 Pull Request

## 前言

前段时间，博客使用的 [markdown-css](https://github.com/anandzhang/markdown-css) 仓库有好兄弟提交了 PR，有点意外 😯，哈哈哈哈，因为很久没更新啦。

所以，当别人给我们开源仓库提交 Pull Request 时，Review 审查贡献者提交的代码可能会发现需要进行一些调整。但是由于自己或者贡献者的空闲时间等原因，可能无法及时进行修改。这时，我们作为维护者，在尊重贡献者的代码的前提下，可以在原 PR 基础上进行修改和完善，以确保代码质量和功能的实现符合项目的要求。

## 添加贡献者远程仓库

我们需要先添加贡献者提交 PR 时 Fork 下来的远程仓库地址到自己项目：

```
git remote add pr10 https://github.com/contributor/repo.git
```

`pr10` 是远程源的取名，根据自己需要能辨识就行。另外 `contributor/repo` 需要替换为贡献者具体仓库路径，比如下图我的 Pull Request，您可以点击 from 之后的复制按钮获取仓库部分路径来替换。

![pull request](/images/essay/6/pr.jpg)

添加后，您可以通过如下命令查看当前仓库存在的远程链接：

```
git remote -v
```

除去原本已经有的 `origin` 以外，会多出刚才添加的远程库。

## 切换到贡献者分支

我们先拉取贡献者的代码分支，然后切换到对应分支上。比如之前的图中 `xxxxx:master` 我们需要拉取后切换到这个分支：

```
git fetch pr10 master
git checkout -b pr10-patch pr10/master
```

>`pr10` 为之前添加的远程源的命名
>
>`master` 为贡献者 Fork 仓库上他的开发分支
>
>`pr10-patch` 为新建的本地分支名
>
>您也可以直接 `git fetch <远程名>` 拉取后来查看分支情况。

## 完善代码并提交

按照贡献者的协助需要，我们对仓库代码进行具体修改。修改后正常走提交流程添加 Commit 提交记录就好：

```
git commit -am "chore: change XXXX"
```

> `-a` 自动添加所有已跟踪的已修改文件。未跟踪的，比如新增文件，你依然需要 `git add` 来操作。

然后，推送添加的提交到远程仓库：

```
git push pr10 HEAD:master
```

> `pr10` 为之前添加的远程源的命名
> `master` 需要替换为贡献者具体的分支名，上面流程中是 `XXXXX/master` 。如果是 `XXXXX/add-ci` 那么您需要换为 `add-ci` 。

之后 PR 地址上您就能看到自己追加的 Commit 了。

## 补充

参考链接：

[Adding Commits to Someone Else's Pull Request](https://tighten.com/insights/adding-commits-to-a-pull-request/)

[How to Push to Someone Else's Pull Request](https://gist.github.com/wtbarnes/56b942641d314522094d312bbaf33a81)
