"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { CalendarDays, Edit3, Eye, Pin, Trash2 } from "lucide-react";
import { useState } from "react";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { formatDate } from "@/lib/date";
import { stripHtml } from "@/lib/utils";
import type { Note } from "@/types/note";

type NoteCardProps = {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => Promise<void>;
  onTogglePinned: (note: Note) => Promise<void>;
};

export function NoteCard({
  note,
  onEdit,
  onDelete,
  onTogglePinned
}: NoteCardProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const preview = stripHtml(note.content).slice(0, 180);

  return (
    <>
      <motion.article
        className="paper-card mb-5 break-inside-avoid p-6"
        variants={{
          hidden: { opacity: 0, y: 18 },
          visible: { opacity: 1, y: 0 }
        }}
        whileHover={{ y: -3 }}
        transition={{ duration: 0.24, ease: "easeOut" }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              {note.is_pinned && (
                <span className="inline-flex items-center gap-1 rounded-full bg-cinnabar px-2.5 py-1 text-[11px] font-semibold text-white shadow-seal">
                  <Pin className="h-3 w-3" />
                  朱砂置顶
                </span>
              )}
              <span className="inline-flex items-center gap-1 text-xs text-dai/48">
                <CalendarDays className="h-3.5 w-3.5" />
                {formatDate(note.updated_at)}
              </span>
            </div>

            <h2 className="font-title text-2xl font-black leading-snug text-ink">
              {note.title || "未题"}
            </h2>
          </div>

          <button
            type="button"
            onClick={() => onTogglePinned(note)}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-cinnabar/20 bg-cinnabar-soft text-cinnabar transition hover:bg-cinnabar hover:text-white"
            aria-label={note.is_pinned ? "取消置顶" : "置顶"}
            title={note.is_pinned ? "取消置顶" : "置顶"}
          >
            <Pin className="h-4 w-4" fill={note.is_pinned ? "currentColor" : "none"} />
          </button>
        </div>

        <p className="mt-4 whitespace-pre-wrap text-sm leading-loose text-dai/72">
          {preview || "这条云笺还没有正文。"}
          {preview.length >= 180 ? "..." : ""}
        </p>

        {note.tags.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {note.tags.map((tag) => (
              <span key={tag} className="bookmark-tag">
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-6 flex items-center justify-between border-t border-border-soft/80 pt-4">
          <Link
            href={`/workspace/notes/${note.id}`}
            className="inline-flex items-center gap-2 rounded-full bg-white/64 px-3 py-2 text-xs font-semibold text-dai transition hover:bg-white"
          >
            <Eye className="h-3.5 w-3.5" />
            详情 / 海报
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onEdit(note)}
              className="grid h-9 w-9 place-items-center rounded-full border border-border-soft bg-white/64 text-dai transition hover:bg-white"
              aria-label="编辑"
            >
              <Edit3 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setConfirmOpen(true)}
              className="grid h-9 w-9 place-items-center rounded-full border border-cinnabar/20 bg-cinnabar-soft text-cinnabar transition hover:bg-cinnabar hover:text-white"
              aria-label="删除"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.article>

      <ConfirmDialog
        open={confirmOpen}
        title="确定删除这条云笺？"
        description="删除后无法恢复。这枚文字印记将从你的云端书案中移除。"
        confirmText="删除"
        cancelText="再想想"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={async () => {
          await onDelete(note.id);
          setConfirmOpen(false);
        }}
      />
    </>
  );
}
