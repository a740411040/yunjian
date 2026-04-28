"use client";

import { AnimatePresence, motion } from "motion/react";
import { Plus, RefreshCcw } from "lucide-react";
import { useState } from "react";
import { EmptyState } from "@/components/common/EmptyState";
import { NoteEditor } from "@/components/workspace/NoteEditor";
import { NoteMasonryGrid } from "@/components/workspace/NoteMasonryGrid";
import { SearchBox } from "@/components/workspace/SearchBox";
import { Sidebar } from "@/components/workspace/Sidebar";
import { TagFilterBar } from "@/components/workspace/TagFilterBar";
import { useNotes } from "@/hooks/useNotes";
import type { Note } from "@/types/note";

export default function WorkspacePage() {
  const {
    notes,
    allTags,
    loading,
    query,
    selectedTag,
    setQuery,
    setSelectedTag,
    createNote,
    updateNote,
    deleteNote,
    togglePinned,
    refresh
  } = useNotes();

  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);


  function handleNewNote() {
    setEditingNote(null);
    setEditorOpen(true);
  }

  return (
    <div className="min-h-screen p-3 md:p-5">
      <div className="grid min-h-[calc(100vh-24px)] gap-4 lg:grid-cols-[280px_1fr]">
        <Sidebar
          tags={allTags}
          selectedTag={selectedTag}
          onSelectTag={setSelectedTag}
          onNewNote={handleNewNote}
        />

        <main className="glass-card overflow-hidden rounded-[32px]">
          <div className="sticky top-0 z-20 border-b border-border-soft/80 bg-paper/70 px-5 py-4 backdrop-blur-xl md:px-8">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <p className="text-sm font-medium text-cinnabar">云笺工作台</p>
                <h1 className="font-title mt-1 text-3xl font-black tracking-tight text-ink md:text-4xl">
                  今日所思，皆可入笺
                </h1>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <SearchBox value={query} onChange={setQuery} />
                <button
                  type="button"
                  onClick={refresh}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border-soft bg-white/70 px-4 text-sm font-medium text-dai transition hover:bg-white"
                >
                  <RefreshCcw className="h-4 w-4" />
                  刷新
                </button>
                <button
                  type="button"
                  onClick={handleNewNote}
                  className="seal-button h-11 gap-2 px-5 text-sm font-semibold"
                >
                  <Plus className="h-4 w-4" />
                  新建云笺
                </button>
              </div>
            </div>

            <TagFilterBar
              tags={allTags}
              selectedTag={selectedTag}
              onSelectTag={setSelectedTag}
            />
          </div>

          <div className="px-5 py-6 md:px-8">
            {loading ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-56 animate-pulse rounded-3xl border border-border-soft bg-white/50"
                  />
                ))}
              </div>
            ) : notes.length === 0 ? (
              <EmptyState
                title={query || selectedTag ? "没有找到匹配的笔记" : "还没有任何云笺"}
                description={
                  query || selectedTag
                    ? "换一个关键词，或者清除标签筛选试试。"
                    : "写下第一条灵感，让它像一枚朱砂印，留在今日。"
                }
                actionLabel="新建第一条"
                onAction={handleNewNote}
              />
            ) : (
              <NoteMasonryGrid
                notes={notes}
                onEdit={(note) => {
                  setEditingNote(note);
                  setEditorOpen(true);
                }}
                onDelete={deleteNote}
                onTogglePinned={togglePinned}
              />
            )}
          </div>
        </main>
      </div>

      <AnimatePresence>
        {editorOpen && (
          <motion.div
            className="fixed inset-0 z-50 grid place-items-center bg-ink/30 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <NoteEditor
              note={editingNote}
              onClose={() => setEditorOpen(false)}
              onSave={async (payload) => {
                if (editingNote) {
                  await updateNote(editingNote.id, payload);
                } else {
                  await createNote(payload);
                }
                setEditorOpen(false);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
