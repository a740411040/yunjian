# 云笺 Yun Jian

> A serene Chinese-inspired cloud notebook for personal notes, community sharing, and aesthetic poster creation.
> 新中式云端笔记，承载灵感、记录思绪、生成可分享的小红书风格海报。

---

## ✨ Features / 功能亮点

| Feature | 说明 |
|---------|------|
| **新中式 Landing Page** — 8 randomized Chinese aesthetic variants | 首页支持 8 种随机国风配色，刷新即换 |
| **Email + Password Auth** | 邮箱密码注册 / 登录 / 登出 |
| **Personal Workspace** | 登录后进入个人笔记工作台 |
| **CRUD + Pin** | 笔记新建、编辑、删除、置顶 |
| **Tags & Search** | 自定义标签、标题/正文搜索、标签快速筛选 |
| **Community Sharing** | 将笔记发布至社区，查看他人公开内容 |
| **Like & Favorite** | 对社区笔记点赞、收藏 |
| **Comment** | 对社区笔记发表评论 |
| **小红书 Poster Export** | 一键生成 3:4 小红书风格分享海报，支持下载 |
| **PWA Support** | 支持添加到手机桌面，离线可用 |
| **3 Theme Modes** | 昼白 / 夜墨（深色）/ 月绢（浅色夜间）三种主题 |

---

## 🛠 Tech Stack / 技术栈

```
Next.js 16 (App Router, Turbopack)
TypeScript
Tailwind CSS v4 + @tailwindcss/postcss
Supabase (Auth + PostgreSQL + RLS)
Tiptap (rich text editor)
html2canvas (poster generation)
Framer Motion (landing animations)
Lucide React (icons)
Sonner (toasts)
PWA (next-pwa)
```

---

## 🚀 Quick Start / 快速开始

```bash
# 1. Clone / 克隆
git clone https://github.com/a740411040/yun-jian.git
cd yun-jian

# 2. Install dependencies / 安装依赖
npm install

# 3. Configure environment / 配置环境变量
cp .env.local.example .env.local
# Then fill in your Supabase credentials below.

# 4. Start development server / 启动开发服务器
npm run dev
# → http://localhost:3000
```

### 🔧 Supabase Setup / Supabase 配置

1. Create a new project at [supabase.com](https://supabase.com)
2. Run `supabase/schema.sql` in the SQL Editor
3. Copy **Project URL** and **anon public key** from Project Settings → API
4. Fill `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## 📁 Database Schema / 数据库表结构

### `public.notes`

| Field | Type | Description |
|-------|------|-------------|
| `id` | uuid | Primary key |
| `user_id` | uuid | Foreign key → auth.users |
| `title` | text | Note title |
| `content` | text | Tiptap JSON content |
| `community_excerpt` | text | Short excerpt for community feed |
| `tags` | text[] | Array of tag strings |
| `is_pinned` | boolean | Pin status |
| `is_published` | boolean | Published to community |
| `published_at` | timestamptz | Publish timestamp |
| `like_count` | integer | Cached like count |
| `favorite_count` | integer | Cached favorite count |
| `comment_count` | integer | Cached comment count |
| `created_at` | timestamptz | Creation time |
| `updated_at` | timestamptz | Last update time |

Row Level Security (RLS) is enabled — users can only access their own notes unless published to community.

---

## 📁 Project Structure / 项目结构

```
src/
├── app/                      # Next.js App Router pages
│   ├── page.tsx              # Landing page (unauthenticated)
│   ├── workspace/            # Personal workspace (authenticated)
│   ├── community/            # Community feed & note detail
│   ├── profile/              # User profile page
│   ├── auth/                 # Login / Register pages
│   └── ...
├── components/
│   ├── landing/              # Landing page components
│   ├── community/            # Community page components
│   ├── workspace/            # Workspace components
│   ├── poster/               # Poster generation
│   └── common/               # Shared UI components
├── lib/
│   ├── supabase/             # Supabase client (server + browser)
│   ├── community.ts          # Community data fetching
│   ├── site-theme.ts         # Landing variant definitions
│   └── poetic-copy.ts        # Chinese poetic microcopy
├── hooks/
│   └── useCommunityNotes.ts  # Community notes state management
└── types/
    └── database.ts           # Supabase generated types
```

---

## 🌏 Roadmap

- [ ] Real-time subscriptions for community feed
- [ ] Following / followers system
- [ ] Rich text formatting toolbar (Tiptap extensions)
- [ ] Image upload for notes
- [ ] Collaborative/community notebooks
- [ ] Public profile page with stats

---

## 📄 License

MIT

---

## 🙏 Credits

Built with [Supabase](https://supabase.com), [Next.js](https://nextjs.org), and [Tailwind CSS](https://tailwindcss.com).
