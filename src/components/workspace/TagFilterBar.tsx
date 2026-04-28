"use client";

import { cn } from "@/lib/utils";

type TagFilterBarProps = {
  tags: string[];
  selectedTag: string | null;
  onSelectTag: (tag: string | null) => void;
};

export function TagFilterBar({
  tags,
  selectedTag,
  onSelectTag
}: TagFilterBarProps) {
  if (tags.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
      <button
        type="button"
        onClick={() => onSelectTag(null)}
        className={cn(
          "shrink-0 rounded-full border px-4 py-2 text-xs font-medium transition",
          selectedTag === null
            ? "border-cinnabar bg-cinnabar text-white"
            : "border-border-soft bg-white/64 text-dai/70 hover:bg-white"
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
            "shrink-0 rounded-full border px-4 py-2 text-xs font-medium transition",
            selectedTag === tag
              ? "border-cinnabar bg-cinnabar text-white"
              : "border-border-soft bg-white/64 text-dai/70 hover:bg-white"
          )}
        >
          #{tag}
        </button>
      ))}
    </div>
  );
}
