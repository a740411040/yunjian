"use client";

import Link from "next/link";
import { ArrowLeft, Compass, RefreshCcw } from "lucide-react";
import type { CommunitySort } from "@/types/community";

type CommunityHeaderProps = {
  sort: CommunitySort;
  onSortChange: (sort: CommunitySort) => void;
  onRefresh: () => void;
};

export function CommunityHeader({
  sort,
  onSortChange,
  onRefresh
}: CommunityHeaderProps) {
  return (
    <header className="glass-card rounded-[32px] p-5 md:p-7">
      <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-center">
        <div>
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-cinnabar">
            <Compass className="h-4 w-4" />
            云笺社区
          </p>

          <h1 className="font-title mt-2 text-4xl font-black tracking-tight text-ink md:text-5xl">
            共赏一方灵感
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-loose text-dai/70">
            这里汇集所有公开发布的云笺。你可以搜索主题、查看标签，也可以进入详情页点赞、收藏和评论。
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex rounded-full border border-border-soft bg-white/60 p-1">
            <button
              type="button"
              onClick={() => onSortChange("latest")}
              className={`h-9 rounded-full px-4 text-sm font-semibold transition ${
                sort === "latest"
                  ? "bg-cinnabar text-white shadow-seal"
                  : "text-dai/60 hover:bg-white hover:text-dai"
              }`}
            >
              最新
            </button>

            <button
              type="button"
              onClick={() => onSortChange("popular")}
              className={`h-9 rounded-full px-4 text-sm font-semibold transition ${
                sort === "popular"
                  ? "bg-cinnabar text-white shadow-seal"
                  : "text-dai/60 hover:bg-white hover:text-dai"
              }`}
            >
              最热
            </button>
          </div>

          <button
            type="button"
            onClick={onRefresh}
            className="inline-flex h-11 items-center gap-2 rounded-full border border-border-soft bg-white/70 px-5 text-sm font-semibold text-dai transition hover:bg-white"
          >
            <RefreshCcw className="h-4 w-4" />
            刷新
          </button>

          <Link
            href="/workspace"
            className="inline-flex h-11 items-center gap-2 rounded-full border border-border-soft bg-white/70 px-5 text-sm font-semibold text-dai transition hover:bg-white"
          >
            <ArrowLeft className="h-4 w-4" />
            返回工作台
          </Link>
        </div>
      </div>
    </header>
  );
}