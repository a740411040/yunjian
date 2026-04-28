"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  createNote as createNoteService,
  deleteNote as deleteNoteService,
  getNotes,
  toggleNotePinned,
  updateNote as updateNoteService
} from "@/lib/notes";
import { stripHtml } from "@/lib/utils";
import type { Note, NotePayload } from "@/types/note";
import { useDebounce } from "./useDebounce";

export function useNotes() {
  const [allNotes, setAllNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const debouncedQuery = useDebounce(query, 260);

  async function refresh() {
    setLoading(true);

    try {
      const data = await getNotes();
      setAllNotes(data);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "加载笔记失败。";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  const allTags = useMemo(() => {
    return Array.from(new Set(allNotes.flatMap((note) => note.tags))).filter(Boolean);
  }, [allNotes]);

  const notes = useMemo(() => {
    const keyword = debouncedQuery.trim().toLowerCase();

    return allNotes.filter((note) => {
      const matchesTag = selectedTag ? note.tags.includes(selectedTag) : true;
      const plain = stripHtml(note.content).toLowerCase();
      const matchesQuery = keyword
        ? note.title.toLowerCase().includes(keyword) || plain.includes(keyword)
        : true;

      return matchesTag && matchesQuery;
    });
  }, [allNotes, debouncedQuery, selectedTag]);

  async function createNote(payload: NotePayload) {
    try {
      const created = await createNoteService(payload);
      setAllNotes((current) => [created, ...current]);
      toast.success("新云笺已保存。");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "创建失败，请稍后重试。";
      toast.error(message);
      throw error;
    }
  }

  async function updateNote(id: string, payload: NotePayload) {
    try {
      const updated = await updateNoteService(id, payload);
      setAllNotes((current) =>
        current
          .map((note) => (note.id === id ? updated : note))
          .sort((a, b) => {
            if (a.is_pinned !== b.is_pinned) {
              return a.is_pinned ? -1 : 1;
            }

            return (
              new Date(b.updated_at).getTime() -
              new Date(a.updated_at).getTime()
            );
          })
      );
      toast.success("云笺已更新。");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "更新失败，请稍后重试。";
      toast.error(message);
      throw error;
    }
  }

  async function deleteNote(id: string) {
    try {
      await deleteNoteService(id);
      setAllNotes((current) => current.filter((note) => note.id !== id));
      toast.success("云笺已删除。");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "删除失败，请稍后重试。";
      toast.error(message);
      throw error;
    }
  }

  async function togglePinned(note: Note) {
    try {
      const updated = await toggleNotePinned(note);
      setAllNotes((current) =>
        current
          .map((item) => (item.id === note.id ? updated : item))
          .sort((a, b) => {
            if (a.is_pinned !== b.is_pinned) {
              return a.is_pinned ? -1 : 1;
            }

            return (
              new Date(b.updated_at).getTime() -
              new Date(a.updated_at).getTime()
            );
          })
      );
      toast.success(updated.is_pinned ? "已置顶。" : "已取消置顶。");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "操作失败，请稍后重试。";
      toast.error(message);
      throw error;
    }
  }

  return {
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
  };
}
