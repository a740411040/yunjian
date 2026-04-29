"use client";

import { Search, X } from "lucide-react";

type CommunitySearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

export function CommunitySearchBar({
  value,
  onChange
}: CommunitySearchBarProps) {
  return (
    <label className="relative block w-full">
      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-dai/45" />

      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="搜索标题、正文、标签或作者"
        className="surface-input h-12 w-full rounded-2xl pl-11 pr-12 text-sm text-dai outline-none transition focus:border-cinnabar/50 focus:ring-4 focus:ring-cinnabar/10"
      />

      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-dai/45 transition hover:bg-paper-deep hover:text-dai"
          aria-label="清除搜索"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </label>
  );
}
