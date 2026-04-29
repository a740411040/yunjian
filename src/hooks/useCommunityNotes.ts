"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { getCommunityNotes } from "@/lib/community";
import type {
  CommunityNote,
  CommunityScope,
  CommunitySort,
  CommunityTopic
} from "@/types/community";
import { useDebounce } from "./useDebounce";

export function useCommunityNotes() {
  const [notes, setNotes] = useState<CommunityNote[]>([]);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sort, setSort] = useState<CommunitySort>("latest");
  const [scope, setScope] = useState<CommunityScope>("all");

  const debouncedQuery = useDebounce(query, 280);

  const allTags = useMemo(() => {
    return Array.from(new Set(notes.flatMap((note) => note.tags))).filter(
      Boolean
    );
  }, [notes]);

  const topics = useMemo<CommunityTopic[]>(() => {
    const topicMap = new Map<
      string,
      {
        count: number;
        sampleTitle: string | null;
      }
    >();

    for (const note of notes) {
      for (const tag of note.tags) {
        const current = topicMap.get(tag) ?? {
          count: 0,
          sampleTitle: null
        };

        topicMap.set(tag, {
          count: current.count + 1,
          sampleTitle: current.sampleTitle ?? note.title ?? null
        });
      }
    }

    return Array.from(topicMap.entries())
      .map(([name, meta]) => ({
        name,
        count: meta.count,
        sampleTitle: meta.sampleTitle
      }))
      .sort((left, right) => right.count - left.count);
  }, [notes]);

  const refresh = useCallback(async () => {
    setLoading(true);

    try {
      const data = await getCommunityNotes({
        query: debouncedQuery,
        tag: selectedTag,
        sort,
        scope
      });

      setNotes(data);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "加载社区笔记失败。";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery, selectedTag, sort, scope]);

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
    scope,
    allTags,
    topics,
    setQuery,
    setSelectedTag,
    setSort,
    setScope,
    refresh,
    updateNoteInList
  };
}
