"use client";

import Link from "next/link";
import { ArrowLeft, Download, Edit3, Pin } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { PosterCaptureCard } from "@/components/poster/PosterCaptureCard";
import { PublishPanel } from "@/components/community/PublishPanel";
import { NoteEditor } from "@/components/workspace/NoteEditor";
import { usePosterExport } from "@/hooks/usePosterExport";
import { updateNote, toggleNotePinned } from "@/lib/notes";
import type { Note, NotePayload } from "@/types/note";

type NoteDetailClientProps = {
  initialNote: Note;
};

export function NoteDetailClient({ initialNote }: NoteDetailClientProps) {
  const [note, setNote] = useState(initialNote);
  const [editorOpen, setEditorOpen] = useState(false);

  const posterRef = useRef<HTMLDivElement>(null);
  const { exporting, exportPoster } = usePosterExport();

  async function handleUpdate(payload: NotePayload) {
    const updated = await updateNote(note.id, payload);
    setNote(updated);
    setEditorOpen(false);
    toast.success("云笺已更新。");
  }

  async function handleTogglePinned() {
    const updated = await toggleNotePinned(note);
    setNote(updated);
    toast.success(updated.is_pinned ? "已置顶。" : "已取消置顶。");
  }

  return (
    <main className="min-h-screen p-4 md:p-6">
      <div className="page-shell">
        <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-center">
          <Link
            href="/workspace"
            className="inline-flex h-11 items-center gap-2 rounded-full border border-border-soft bg-white/70 px-5 text-sm font-semibold text-dai transition hover:bg-white"
          >
            <ArrowLeft className="h-4 w-4" />
            返回工作台
          </Link>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleTogglePinned}
              className="inline-flex h-11 items-center gap-2 rounded-full border border-cinnabar/20 bg-cinnabar-soft px-5 text-sm font-semibold text-cinnabar transition hover:bg-cinnabar hover:text-white"
            >
              <Pin
                className="h-4 w-4"
                fill={note.is_pinned ? "currentColor" : "none"}
              />
              {note.is_pinned ? "取消置顶" : "朱砂置顶"}
            </button>

            <button
              type="button"
              onClick={() => setEditorOpen(true)}
              className="inline-flex h-11 items-center gap-2 rounded-full border border-border-soft bg-white/70 px-5 text-sm font-semibold text-dai transition hover:bg-white"
            >
              <Edit3 className="h-4 w-4" />
              编辑
            </button>

            <button
              type="button"
              onClick={() => exportPoster(posterRef.current, note.title)}
              disabled={exporting}
              className="seal-button h-11 gap-2 px-5 text-sm font-semibold"
            >
              <Download className="h-4 w-4" />
              {exporting ? "生成中..." : "保存海报"}
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
          <article className="paper-card p-6 md:p-9">
            <div className="mb-5 flex flex-wrap gap-2">
              {note.is_pinned && (
                <span className="inline-flex items-center gap-1 rounded-full bg-cinnabar px-3 py-1.5 text-xs font-semibold text-white">
                  <Pin className="h-3.5 w-3.5" />
                  置顶
                </span>
              )}

              {note.visibility === "public" && (
                <span className="inline-flex items-center rounded-full bg-shiqing-soft px-3 py-1.5 text-xs font-semibold text-shiqing-dark">
                  已发布到社区
                </span>
              )}

              {note.tags.map((tag) => (
                <span key={tag} className="bookmark-tag">
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="font-title text-5xl font-black leading-tight text-ink">
              {note.title || "未题"}
            </h1>

            <p className="mt-4 text-sm text-dai/45">
              更新于 {new Date(note.updated_at).toLocaleString("zh-CN")}
            </p>

            <hr className="ink-divider my-8" />

            <div
              className="note-content"
              dangerouslySetInnerHTML={{
                __html: note.content || "<p>这条云笺还没有正文。</p>"
              }}
            />
          </article>

          <aside className="space-y-6">
            <PublishPanel note={note} onUpdated={setNote} />

            <section className="glass-card rounded-[32px] p-5">
              <div className="mb-5">
                <p className="text-sm font-semibold text-cinnabar">
                  小红书分享海报
                </p>
                <h2 className="font-title mt-1 text-2xl font-black text-ink">
                  3:4 新中式卡片
                </h2>
                <p className="mt-2 text-sm leading-loose text-dai/60">
                  点击“保存海报”会将下方节点导出为高清 PNG。
                </p>
              </div>

              <div className="flex justify-center">
                <PosterCaptureCard
  ref={posterRef}
  note={note}
  variant="private"
/>
            </section>
          </aside>
        </div>
      </div>

      {editorOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-ink/30 p-4 backdrop-blur-sm">
          <NoteEditor
            note={note}
            onClose={() => setEditorOpen(false)}
            onSave={handleUpdate}
          />
        </div>
      )}
    </main>
  );
}
