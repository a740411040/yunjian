import { ArrowRight, BookOpenCheck, MessageSquareHeart, MoonStar, Tags, Users } from "lucide-react";
import Link from "next/link";
import { AppLogo } from "@/components/common/AppLogo";
import { PosterPreview } from "@/components/poster/PosterPreview";
import { pickPoeticCopy } from "@/lib/poetic-copy";
import type { LandingVariant } from "@/lib/site-theme";

type LandingExperienceProps = {
  variant: LandingVariant;
};

const featureCards = [
  {
    icon: MoonStar,
    title: "三重光影",
    description: "支持昼白、深色夜间与浅色夜间，让写作和浏览在不同时辰都舒展。"
  },
  {
    icon: Users,
    title: "关注往来",
    description: "看见喜欢的作者，就把对方收进你的关注清单，后续新作更容易寻见。"
  },
  {
    icon: Tags,
    title: "标签话题",
    description: "从个人标签延展到社区话题，让笔记不仅可记，也更容易被找到与回应。"
  },
  {
    icon: MessageSquareHeart,
    title: "反馈回音",
    description: "任何建议、问题与灵感都能递进反馈箱，形成可追踪的改进回路。"
  },
  {
    icon: BookOpenCheck,
    title: "国风随机首页",
    description: "主页会在数种素雅界面间随机切换，像翻开不同封面的同一本手札。"
  }
];

export function LandingExperience({ variant }: LandingExperienceProps) {
  const heroCopy = pickPoeticCopy("landing.hero", variant.id);
  const footerCopy = pickPoeticCopy("landing.footer", variant.id);

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div
          className="absolute left-[6%] top-[12%] h-72 w-72 rounded-full blur-3xl"
          style={{ backgroundColor: variant.palette.glowA }}
        />
        <div
          className="absolute right-[8%] top-[10%] h-80 w-80 rounded-full blur-3xl"
          style={{ backgroundColor: variant.palette.glowB }}
        />
        <div
          className="absolute bottom-[10%] left-[38%] h-96 w-96 rounded-full blur-3xl"
          style={{ backgroundColor: variant.palette.glowC }}
        />
        <div className="absolute right-24 top-44 h-48 w-48 rounded-full border border-white/30" />
        <div className="absolute bottom-32 left-16 h-64 w-64 rounded-full border border-white/24" />
      </div>

      <section className="page-shell grid min-h-screen items-center gap-12 py-10 lg:grid-cols-[1.02fr_0.98fr]">
        <div>
          <nav className="mb-18 flex items-center justify-between lg:mb-24">
            <AppLogo />

            <div className="flex items-center gap-3">
              <Link
                href="/auth/login"
                className={`rounded-full px-5 py-2.5 text-sm font-medium transition ${variant.palette.secondaryButton}`}
              >
                登录
              </Link>
              <Link
                href="/auth/register"
                className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${variant.palette.primaryButton}`}
              >
                注册
              </Link>
            </div>
          </nav>

          <div
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ${variant.palette.badge}`}
          >
            <span className="inline-block h-2 w-2 rounded-full bg-current opacity-70" />
            {variant.badge}
          </div>

          <h1 className="font-title mt-7 max-w-4xl text-balance text-6xl font-black leading-tight tracking-tight text-ink md:text-7xl">
            {variant.heading}
            <span className="block text-cinnabar">{variant.highlight}</span>
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-loose text-dai/76">
            {variant.description}
          </p>

          <p className="mt-5 max-w-2xl rounded-[24px] border border-white/35 px-5 py-4 text-sm leading-loose text-dai/68 backdrop-blur-sm">
            {heroCopy}
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/auth/register"
              className={`inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold transition ${variant.palette.primaryButton}`}
            >
              开始写第一笺
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="#features"
              className={`inline-flex h-12 items-center justify-center rounded-full px-6 text-sm font-semibold transition ${variant.palette.secondaryButton}`}
            >
              看看新功能
            </Link>
          </div>

          <div className="mt-12 grid max-w-xl gap-3 sm:grid-cols-3">
            {[
              "随机国风首页",
              "关注与话题",
              "双夜间模式"
            ].map((item) => (
              <div
                key={item}
                className={`rounded-3xl px-4 py-4 text-sm font-semibold backdrop-blur ${variant.palette.chip}`}
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[540px]">
          <div
            className="glass-card rounded-[36px] p-5 md:p-6"
            style={{ background: variant.palette.shell }}
          >
            <div
              className="rounded-[30px] p-5 md:p-6"
              style={{ background: variant.palette.frame }}
            >
              <PosterPreview />
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="paper-card p-5">
              <p className="text-xs font-semibold tracking-[0.16em] text-cinnabar">
                {variant.featureLead}
              </p>
              <p className="mt-3 text-sm leading-loose text-dai/68">
                {variant.featureBody}
              </p>
            </div>

            <div className="paper-card p-5">
              <p className="text-xs font-semibold tracking-[0.16em] text-cinnabar">
                本次随机界面
              </p>
              <h2 className="font-title mt-3 text-2xl font-black text-ink">
                {variant.name}
              </h2>
              <p className="mt-2 text-sm leading-loose text-dai/68">
                {variant.heroNote}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="page-shell pb-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold text-cinnabar">新功能已入画</p>
          <h2 className="font-title mt-3 text-4xl font-black text-ink md:text-5xl">
            从记事到共鸣，界面也更懂时辰
          </h2>
          <p className="mt-5 text-base leading-loose text-dai/70">
            这次改版把视觉、社交与反馈放在同一张纸上，让个人创作、社区往来和产品成长彼此照应。
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {featureCards.map((feature) => (
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

        <div className="mt-10 rounded-[32px] border border-border-soft bg-white/44 px-6 py-5 text-center backdrop-blur-sm">
          <p className="text-sm leading-loose text-dai/68">{footerCopy}</p>
          <p className="mt-2 text-xs tracking-[0.18em] text-cinnabar/85">
            {variant.footerNote}
          </p>
        </div>
      </section>
    </main>
  );
}
