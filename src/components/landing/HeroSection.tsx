import { ArrowRight, Cloud, FileText, Sparkles } from "lucide-react";
import Link from "next/link";
import { AppLogo } from "@/components/common/AppLogo";
import { PosterPreview } from "@/components/poster/PosterPreview";

export function HeroSection() {
  return (
    <section className="page-shell relative grid min-h-screen items-center gap-12 py-10 lg:grid-cols-[1.05fr_0.95fr]">
      <div>
        <nav className="mb-20 flex items-center justify-between lg:mb-24">
          <AppLogo />

          <div className="flex items-center gap-3">
            <Link
              href="/auth/login"
              className="rounded-full border border-border-soft bg-white/60 px-5 py-2.5 text-sm font-medium text-dai transition hover:bg-white"
            >
              登录
            </Link>
            <Link
              href="/auth/register"
              className="seal-button px-5 py-2.5 text-sm font-semibold"
            >
              注册
            </Link>
          </div>
        </nav>

        <div className="inline-flex items-center gap-2 rounded-full border border-cinnabar/20 bg-cinnabar-soft/80 px-4 py-2 text-sm font-medium text-cinnabar">
          <Sparkles className="h-4 w-4" />
          新中式云端笔记 · 小红书海报分享
        </div>

        <h1 className="font-title mt-7 max-w-3xl text-balance text-6xl font-black leading-tight tracking-tight text-ink md:text-7xl">
          一方宣纸，
          <span className="text-cinnabar">安放灵感</span>
        </h1>

        <p className="mt-7 max-w-2xl text-lg leading-loose text-dai/72">
          云笺是一款高颜值、可对外展示的云端笔记网站。以宣纸白为底，
          朱砂红为印，融入留白、书签、印章与水墨纹理，让每一次记录都有东方审美的温度。
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/auth/register"
            className="seal-button h-12 gap-2 px-6 text-sm font-semibold"
          >
            开始写第一笺
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="#features"
            className="inline-flex h-12 items-center justify-center rounded-full border border-border-soft bg-white/70 px-6 text-sm font-semibold text-dai transition hover:bg-white"
          >
            查看功能
          </Link>
        </div>

        <div className="mt-12 grid max-w-xl gap-3 sm:grid-cols-3">
          {[
            { icon: Cloud, label: "云端同步" },
            { icon: FileText, label: "富文本笔记" },
            { icon: Sparkles, label: "海报生成" }
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-3xl border border-border-soft bg-white/52 p-4 backdrop-blur"
            >
              <item.icon className="h-5 w-5 text-cinnabar" />
              <p className="mt-3 text-sm font-semibold text-dai">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-[520px]">
        <div className="absolute -left-8 top-10 h-24 w-24 rounded-full border border-cinnabar/20 bg-cinnabar/10 blur-sm" />
        <div className="absolute -right-10 bottom-10 h-32 w-32 rounded-full border border-shiqing/20 bg-shiqing/20 blur-sm" />
        <PosterPreview />
      </div>
    </section>
  );
}
