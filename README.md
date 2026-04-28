# 云笺 Yun Jian

一方宣纸，安放灵感。  
“云笺”是一个基于 Next.js、Tailwind CSS、Motion、Supabase 与 html2canvas 的新中式云端笔记网站 MVP。

## 功能

- 新中式 Landing Page
- 邮箱密码注册 / 登录 / 退出
- 登录后进入个人笔记工作台
- 笔记新增、编辑、删除、置顶
- 自定义标签
- 标题与正文搜索
- 标签快速筛选
- 笔记详情页
- 3:4 小红书分享海报生成与下载

## 本地启动

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

打开：

```txt
http://localhost:3000
```

## Supabase 配置

1. 新建 Supabase 项目。
2. 在 Supabase SQL Editor 中执行 `supabase/schema.sql`。
3. 在 Supabase Dashboard 找到 Project URL 与 anon public key。
4. 填写 `.env.local`：

```env
NEXT_PUBLIC_SUPABASE_URL=你的 Supabase URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的 anon key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 数据表

主表：`public.notes`

字段：

- `id`
- `user_id`
- `title`
- `content`
- `tags`
- `is_pinned`
- `created_at`
- `updated_at`

已开启 Row Level Security，每个用户只能访问自己的笔记。

## 技术栈

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Motion for React
- Supabase Auth / Database
- Tiptap
- html2canvas
- lucide-react
- sonner
