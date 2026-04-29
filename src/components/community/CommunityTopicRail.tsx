"use client";

import { Flame, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CommunityTopic } from "@/types/community";

type CommunityTopicRailProps = {
  topics: CommunityTopic[];
  selectedTag: string | null;
  onSelectTag: (tag: string | null) => void;
};

export function CommunityTopicRail({
  topics,
  selectedTag,
  onSelectTag
}: CommunityTopicRailProps) {
  return (
    <section className="paper-card p-5">
      <div className="mb-4 flex items-center gap-2">
        <Flame className="h-4 w-4 text-cinnabar" />
        <h2 className="font-title text-xl font-black text-ink">今日话题簿</h2>
      </div>

      {topics.length === 0 ? (
        <p className="text-sm leading-loose text-dai/60">
          公开笔记里的标签会在这里汇成话题卡片，方便大家沿着同一条线索继续读下去。
        </p>
      ) : (
        <div className="grid gap-3">
          {topics.slice(0, 6).map((topic) => (
            <button
              key={topic.name}
              type="button"
              onClick={() =>
                onSelectTag(selectedTag === topic.name ? null : topic.name)
              }
              className={cn(
                "rounded-3xl border p-4 text-left transition",
                selectedTag === topic.name
                  ? "border-cinnabar/24 bg-cinnabar-soft"
                  : "border-border-soft bg-white/52 hover:bg-white/70"
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-title text-xl font-black text-ink">
                  #{topic.name}
                </span>
                <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-cinnabar">
                  {topic.count} 篇
                </span>
              </div>

              {topic.sampleTitle && (
                <p className="mt-3 text-sm leading-loose text-dai/62">
                  近来多见于《{topic.sampleTitle}》
                </p>
              )}

              <div className="mt-3 inline-flex items-center gap-2 text-xs text-dai/45">
                <Sparkles className="h-3.5 w-3.5 text-shiqing-dark" />
                点开后会直接筛选相关笔记
              </div>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
