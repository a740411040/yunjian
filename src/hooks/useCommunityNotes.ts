"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { getCommunityNotes } from "@/lib/community";
import type { CommunityNote, CommunitySort } from "@/types/community";
import { useDebounce } from "./useDebounce";

export function useCommunityNotes() {
  const [notes, setNotes] = useState<CommunityNote[]>([]);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sort, setSort] = useState<CommunitySort>("latest");

  const debouncedQuery = useDebounce(query, 280);

  const allTags = useMemo(() => {
    return Array.from(new Set(notes.flatMap((note) => note.tags))).filter(
      Boolean
    );
  }, [notes]);

  const refresh = useCallback(async () => {
    setLoading(true);

    try {
      const data = await getCommunityNotes({
        query: debouncedQuery,
        tag: selectedTag,
        sort
      });

      setNotes(data);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "加载社区笔记失败。";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery, selectedTag, sort]);

  const updateNoteInList = useCallback((nextNote: CommunityNote) => {
    setNotes((currentNotes) =>
      currentNotes.map((note) => {
        if (note.id !== nextNote.id) {
          return note;
        }

        return nextNote;
      })
    );
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    notes,
    loading,
    query,
    selectedTag,
    sort,
    allTags,
    setQuery,
    setSelectedTag,
    setSort,
    refresh,
    updateNoteInList
  };
}