# Anand's Blog 🚀  

这是我的个人博客项目，访问 [Anand's Blog](https://anandzhang.com/) 了解更多。  

2025 年2月底，决定开源这个小仓库，你可以查看博客的演进历程：  

📖 [博客渐冷，代码开源：我的个人站点演进史](https://anandzhang.com/posts/essay/7)  

---

## 📂 目录结构  

```bash
📦 blog
├── 📂 controllers       # 处理 Web 请求（已废弃）
├── 📂 docker            # Docker 相关配置
├── 📂 models            # 数据库模型（已废弃）
├── 📂 posts             # Markdown 博客文章
├── 📂 public            # 静态资源
├── 📂 routes            # 路由定义（已废弃）
├── 📂 scripts           # 构建脚本
├── 📂 utils             # 工具函数
├── 📂 v2                # 当前博客的静态文件（终极躺平）
├── 📂 views             # 旧版 Pug 模板（历史遗留）
├── 📄 README.md         # 项目介绍和使用说明
├── 📄 copyright.md      # 版权声明
├── 📄 default-v2.conf   # v2 版本的 Nginx 配置
├── 📄 default.conf      # 旧版 Nginx 配置
├── 📄 index.ts          # v1 入口文件（已废弃）
├── 📄 package.json      # 依赖和项目信息
├── 📄 tsconfig.json     # TypeScript 配置
└── 📄 webpack.config.js # Webpack 配置
```

📌 **/v2 是当前使用的静态博客**，根目录仍遗留部分 v1 代码，如需查看首版 `Markdown + Express + MongoDB + Pug` 版本，可切换至 [tag:v1.0.0](https://github.com/anandzhang/blog/tree/v1.0.0)。

⚠️ **遗留代码将逐步删除，项目结构会进一步整理。**

---

## 🌱 v2 终极躺平架构  

- **Markdown 解析**：转换 Markdown 为 HTML  
- **自动生成静态页面**：脚本批量构建博客  
- **极简设计**：无复杂 UI，仅保留阅读体验  
- **优化 SEO**：自动生成 Sitemap 等

核心逻辑很简单：  
利用 **YAML Front Matter** 在 Markdown 文章顶部添加 `tag`、`keywords`、`description` 等元数据，取代数据库存储。`scripts/build.ts` 解析 Markdown，并替换 `/v2/template` 中的 HTML 模板内容，最终生成静态页面。同时，脚本还会拷贝资源目录、压缩文件，优化加载速度。  

文章编写直接使用 **Typora**，并配置 `typora-root-url: ../` 以控制图片解析目录。这样就能直接使用 `![image](/images/essay/7/anand.png)` 引用资源文件，并在 Typora 中正常预览，最终打包时再拷贝资源目录即可。  

🚀 **部署极其简单**，只需执行脚本生成 `/build` 目录，并用 **Nginx** 或其他静态资源托管服务托管即可，无需后端。  

---

## 🔧 TODO & 未来优化  

- 📌 **增量构建**：当前是全量构建，文章多时效率不高  
- ✨ **Markdown 扩展**：支持更多格式增强  

这个博客的目标就是 **极简、低成本、纯静态、无后端**，只需写 Markdown 并执行脚本，希望它能给你提供一些参考 🎯

