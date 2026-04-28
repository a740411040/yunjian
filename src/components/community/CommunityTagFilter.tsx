"use client";

import { Hash } from "lucide-react";
import { cn } from "@/lib/utils";

type CommunityTagFilterProps = {
  tags: string[];
  selectedTag: string | null;
  onSelectTag: (tag: string | null) => void;
};

export function CommunityTagFilter({
  tags,
  selectedTag,
  onSelectTag
}: CommunityTagFilterProps) {
  return (
    <section className="paper-card p-5">
      <div className="mb-4 flex items-center gap-2">
        <Hash className="h-4 w-4 text-cinnabar" />
        <h2 className="font-title text-xl font-black text-ink">标签书签</h2>
      </div>

      {tags.length === 0 ? (
        <p className="text-sm leading-loose text-dai/60">
          暂无社区标签。发布带标签的笔记后，这里会自动生成筛选入口。
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onSelectTag(null)}
            className={cn(
              "rounded-full border px-4 py-2 text-xs font-semibold transition",
              selectedTag === null
                ? "border-cinnabar bg-cinnabar text-white"
                : "border-border-soft bg-white/70 text-dai/65 hover:bg-white"
            )}
          >
            全部
          </button>

          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => onSelectTag(selectedTag === tag ? null : tag)}
              className={cn(
                "bookmark-tag transition",
                selectedTag === tag && "scale-[1.03] shadow-seal"
              )}
            >
              {tag}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}