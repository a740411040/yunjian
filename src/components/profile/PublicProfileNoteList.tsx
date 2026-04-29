"use client";

import Link from "next/link";
import { stripHtml } from "@/lib/utils";
import type { PublicProfileNote } from "@/lib/community-server";

type PublicProfileNoteListProps = {
  notes: PublicProfileNote[];
};

export function PublicProfileNoteList({ notes }: PublicProfileNoteListProps) {
  if (notes.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-border-soft bg-white/52 px-6 py-16 text-center">
        <div className="text-lg font-medium text-ink">暂无公开云笺</div>
        <p className="mt-2 text-sm text-dai/45">
          这位作者还没有把笔记公开到社区。
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {notes.map((note) => (
        <PublicProfileNoteCard key={note.id} note={note} />
      ))}
    </div>
  );
}

function PublicProfileNoteCard({ note }: { note: PublicProfileNote }) {
  const excerpt =
    note.community_excerpt ||
    stripHtml(note.content || "").replace(/\s+/g, " ").trim() ||
    "这是一条安静的云笺。";

  const date = note.published_at || note.updated_at || note.created_at;

  return (
    <Link
      href={`/community/notes/${note.id}`}
      className="group block rounded-3xl border border-border-soft bg-white/62 p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-cinnabar/18 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="line-clamp-2 text-lg font-semibold leading-7 text-ink group-hover:text-cinnabar">
          {note.title || "未题"}
        </h3>

        <span className="shrink-0 rounded-full bg-cinnabar-soft px-3 py-1 text-xs font-medium text-cinnabar">
          公开
        </span>
      </div>

      <p className="mt-3 line-clamp-3 text-sm leading-6 text-dai/62">
        {excerpt}
      </p>

      {note.tags && note.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {note.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-white/76 px-3 py-1 text-xs text-dai/60"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-5 flex items-center justify-between border-t border-border-soft pt-4 text-xs text-dai/45">
        <span>{formatDate(date)}</span>

        <div className="flex items-center gap-3">
          <span>{note.like_count} 喜欢</span>
          <span>{note.favorite_count} 收藏</span>
          <span>{note.comment_count} 评论</span>
        </div>
      </div>
    </Link>
  );
}

function formatDate(value?: string | null) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });
}
