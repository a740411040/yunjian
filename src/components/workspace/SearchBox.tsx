"use client";

import { Search, X } from "lucide-react";

type SearchBoxProps = {
  value: string;
  onChange: (value: string) => void;
};

export function SearchBox({ value, onChange }: SearchBoxProps) {
  return (
    <label className="relative block min-w-0 sm:w-[320px]">
      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-dai/45" />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="搜索标题或正文..."
        className="h-11 w-full rounded-full border border-border-soft bg-white/72 pl-11 pr-11 text-sm text-dai outline-none transition focus:border-cinnabar/50 focus:ring-4 focus:ring-cinnabar/10"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full text-dai/45 transition hover:bg-paper-deep hover:text-dai"
          aria-label="清除搜索"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </label>
  );
}
