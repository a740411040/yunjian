"use client";

import Link from "next/link";
import { ArrowLeft, Compass, RefreshCcw } from "lucide-react";
import type { CommunityScope, CommunitySort } from "@/types/community";

type CommunityHeaderProps = {
  sort: CommunitySort;
  scope: CommunityScope;
  onSortChange: (sort: CommunitySort) => void;
  onScopeChange: (scope: CommunityScope) => void;
  onRefresh: () => void;
};

export function CommunityHeader({
  sort,
  scope,
  onSortChange,
  onScopeChange,
  onRefresh
}: CommunityHeaderProps) {
  return (
    <header className="glass-card rounded-[28px] p-4 md:rounded-[32px] md:p-7">
      <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-center">
        <div>
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-cinnabar">
            <Compass className="h-4 w-4" />
            云笺社区
          </p>

          <h1 className="font-title mt-2 text-3xl font-black tracking-tight text-ink md:text-5xl">
            共赏一方灵感
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-loose text-dai/70">
            可以按热度或最新查看公开笔记，也可以切到只看关注，把社区收拢成更贴近你审美的清单。
          </p>
        </div>

        <div className="grid gap-3 sm:flex sm:flex-wrap sm:items-center">
          <div className="inline-flex w-full rounded-full border border-border-soft bg-white/60 p-1 sm:w-auto">
            <button
              type="button"
              onClick={() => onScopeChange("all")}
              className={`h-9 flex-1 rounded-full px-4 text-sm font-semibold transition sm:flex-none ${
                scope === "all"
                  ? "bg-shiqing-dark text-white shadow-soft"
                  : "text-dai/60 hover:bg-white hover:text-dai"
              }`}
            >
              全部
            </button>

            <button
              type="button"
              onClick={() => onScopeChange("following")}
              className={`h-9 flex-1 rounded-full px-4 text-sm font-semibold transition sm:flex-none ${
                scope === "following"
                  ? "bg-shiqing-dark text-white shadow-soft"
                  : "text-dai/60 hover:bg-white hover:text-dai"
              }`}
            >
              只看关注
            </button>
          </div>

          <div className="inline-flex w-full rounded-full border border-border-soft bg-white/60 p-1 sm:w-auto">
            <button
              type="button"
              onClick={() => onSortChange("latest")}
              className={`h-9 flex-1 rounded-full px-4 text-sm font-semibold transition sm:flex-none ${
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
              className={`h-9 flex-1 rounded-full px-4 text-sm font-semibold transition sm:flex-none ${
                sort === "popular"
                  ? "bg-cinnabar text-white shadow-seal"
                  : "text-dai/60 hover:bg-white hover:text-dai"
              }`}
            >
              最热
            </button>
          </div>

          <div className="grid gap-3 sm:flex">
            <button
              type="button"
              onClick={onRefresh}
              className="surface-button inline-flex h-11 w-full items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold text-dai transition hover:text-cinnabar sm:w-auto"
            >
              <RefreshCcw className="h-4 w-4" />
              刷新
            </button>

            <Link
              href="/workspace"
              className="surface-button inline-flex h-11 w-full items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold text-dai transition hover:text-cinnabar sm:w-auto"
            >
              <ArrowLeft className="h-4 w-4" />
              返回工作台
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
