import {
  BookMarked,
  Brush,
  LockKeyhole,
  Pin,
  Search,
  Share2
} from "lucide-react";

const features = [
  {
    icon: LockKeyhole,
    title: "邮箱账户体系",
    description: "支持注册、登录与权限隔离，每个人只看见自己的云笺。"
  },
  {
    icon: BookMarked,
    title: "笔记 CRUD",
    description: "快速新增、编辑、删除笔记，支持轻量级富文本排版。"
  },
  {
    icon: Pin,
    title: "朱砂置顶",
    description: "用印章式视觉标记重要笔记，置顶内容优先展示。"
  },
  {
    icon: Brush,
    title: "书签标签",
    description: "为每篇笔记添加多个自定义标签，分类像传统书签一样优雅。"
  },
  {
    icon: Search,
    title: "搜索筛选",
    description: "支持标题、正文关键字检索，并可点击标签快速筛选。"
  },
  {
    icon: Share2,
    title: "小红书海报",
    description: "一键生成 3:4 新中式分享海报，可保存到本地。"
  }
];

export function FeatureSection() {
  return (
    <section id="features" className="page-shell py-24">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold text-cinnabar">功能模块</p>
        <h2 className="font-title mt-3 text-4xl font-black text-ink md:text-5xl">
          从灵感记录到美学分享
        </h2>
        <p className="mt-5 text-base leading-loose text-dai/70">
          云笺不只是笔记工具，也是一套可持续扩展的内容管理与视觉分享系统。
        </p>
      </div>

      <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <article key={feature.title} className="paper-card p-7">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-cinnabar-soft text-cinnabar">
              <feature.icon className="h-5 w-5" />
            </div>
            <h3 className="font-title mt-6 text-2xl font-black text-ink">
              {feature.title}
            </h3>
            <p className="mt-3 text-sm leading-loose text-dai/70">
              {feature.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
