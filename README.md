# site-lishi · 溧水历史志站点库

溧水知识站群「溧水历史志」分站的站点库。内容在 `lishui-history`，共享底座在 `lishui-kit`，本站只写历史志特有的部分。

- 域名：`lishi.lishui.org`（中文在根路径，英文在 `/en/` 下）
- 生成器：Astro 5（静态输出，产物是纯 HTML）
- 规划依据：《溧水知识站群建设规划 v1.3》《溧水历史志分站计划 v1.0》，技术选型见《技术选型详解》

## 三个库的关系

| 库 | 放什么 | 本站怎么用 |
| --- | --- | --- |
| `lishui-history` | 内容：来源层与成果层的 Markdown | 构建时读取，一条都不复制进本站 |
| `lishui-kit` | 设计系统、知识组件、多语言、校验引擎 | 以 `file:../lishui-kit` 依赖引入，不重写 |
| `site-lishi` | 本站的页面、站点常量、分类与分期规则 | 本库 |

内容库位置按 `LISHUI_CONTENT_DIR` → 本站 `content/` 子模块 → 同级目录 `../lishui-history` 依次查找。

## 目录

| 路径 | 放什么 |
| --- | --- |
| `src/pages/` | 路由。中文在根下（`index.astro`、`events/index.astro`…），英文在 `en/` 下的对称路径 |
| `src/pages/[dir]/[slug].astro` | 条目详情页，路径由内容库的目录名与 ID 尾段决定 |
| `src/pages/sitemap.xml.js` | 站点地图，构建时从内容库枚举路由，中英同页互标 hreflang |
| `src/views/` | 页面正文：首页、列表、详情、时间轴、索引、关于、404 |
| `src/layouts/Base.astro` | 站点外壳：把站点常量、界面串、导航交给 kit 的 `Layout` |
| `src/site/config.mjs` | 本站常量、六类内容、五期分期、板块说明、编纂凡例 |
| `src/site/content.mjs` | 读内容库并套上本站规则（六类归属、分期、街镇筛选值） |
| `src/site/context.mjs` | 渲染上下文，由 kit 的 `makeContext` 生成，页面共用 |
| `src/i18n/ui.zh.json`、`ui.en.json` | 界面串。英文用 `: `、中文用 `：`（`labelSep`） |
| `public/` | 原样拷贝进产物的静态件：`CNAME`、`robots.txt`、`.nojekyll`、`assets/img/` |
| `scripts/` | 本站的检查入口，实现都在 kit |

## 命令

```bash
npm install          # 首次；lishui-kit 以 file: 依赖装在 node_modules 下
npm run dev          # 本地开发，http://localhost:4321/
npm run build        # 生成 dist/
npm run preview      # 预览 dist/，同样 4321 端口
npm run validate     # 内容校验（调内容库的校验脚本）
npm run check-links  # 站内链接自检
npm run check-pages  # 页面自检：语言互指、hreflang、主题脚本、英文页中文残留
npm run check        # 以上四步串起来，发布前跑这一条
```

`lishui-kit` 是符号链接依赖，改动 kit 后本站立即生效，不必重装。

## 本站只写这些

1. **页面与视图**：`src/views/` 与 `src/pages/`。样式与知识组件一律用 kit 的，不在本站写 CSS。
2. **分类与分期**：六类内容（`CATEGORIES`）与五期分期（`PERIODS`）是历史志特有的，属站点层；kit 不认这套分类，只提供 `catLabel` 这类通用助手。
3. **附加校验**：`event` 必须有时间字段、古迹的文保级别与批次配套、年代落在置县至今区间等，由内容库的 `scripts/validate.mjs` 以 `extra` 回调注入 kit 的校验引擎。

改样式、改组件、改双语路由规则，都去 `lishui-kit` 改；本站只填数据。

## 发布

产物是纯静态文件，`dist/` 交给 GitHub Pages。中英路径一一对应，`/en/` 下的页面与中文页镜像；404 页在根路径兜底，`/en/404/` 供英文读者直接访问，两份都标 `noindex`。
