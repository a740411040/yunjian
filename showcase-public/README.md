# Public Showcase Repo Guide

这个文件夹用于整理“适合公开展示到新 GitHub 仓库”的内容范围。

目标不是把当前私有项目完整公开，而是抽取一套：

- 能体现设计能力
- 能体现前端实现能力
- 不暴露私密配置
- 不暴露完整业务后端细节
- 不暴露可直接复用的项目私有结构

## 建议公开的内容

优先公开“表现层”和“体验层”：

- 国风视觉主题
- 昼夜模式与主题切换
- PWA 安装体验
- 首页随机界面
- 诗意文案随机逻辑
- 移动端适配
- 纯展示型组件

## 不建议公开的内容

以下内容建议继续保留在私有仓库：

- `.env*`
- `src/lib/supabase/*`
- 直接读写数据库的 `src/lib/*.ts`
- 完整 `supabase/schema.sql`
- 管理后台相关实现
- 举报、通知、关注、评论、收藏、点赞的完整业务链路
- 和真实用户数据结构强绑定的服务端文件

## 推荐公开仓结构

你可以新建一个展示仓，比如：

```txt
yun-jian-showcase/
  README.md
  public/
  src/
    app/
    components/
    lib/
    types/
```

但只拷贝 `SAFE_FILES.txt` 里列出的那部分文件，再把数据层改成 mock 数据或静态演示。

## 建议新的公开仓 README 写法

建议 README 重点写：

- 项目定位：新中式笔记/PWA/移动端体验展示
- 技术栈：Next.js、TypeScript、Tailwind、Motion
- 亮点功能：随机首页、夜间模式、PWA、移动端优化
- 截图/GIF
- 说明这是“展示版”，不包含完整后端与生产配置

## 当前文件夹内容

- `SAFE_FILES.txt`
  适合优先复制到新公开仓库的文件清单

- `DO_NOT_PUBLISH.txt`
  不建议直接公开的目录和文件类型
