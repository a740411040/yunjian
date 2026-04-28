"use client";

import { Bookmark } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  getNoteFavoriteState,
  toggleNoteFavorite
} from "@/lib/favorites";
import { cn } from "@/lib/utils";

type FavoriteButtonProps = {
  noteId: string;
  initialCount?: number;
};

export function FavoriteButton({
  noteId,
  initialCount = 0
}: FavoriteButtonProps) {
  const [count, setCount] = useState(initialCount);
  const [hasFavorited, setHasFavorited] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadState() {
      setLoading(true);

      try {
        const state = await getNoteFavoriteState(noteId);

        if (!mounted) return;

        setCount(state.count);
        setHasFavorited(state.hasFavorited);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "加载收藏状态失败。";
        toast.error(message);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadState();

    return () => {
      mounted = false;
    };
  }, [noteId]);

  async function handleClick() {
    if (submitting || loading) return;

    const previousFavorited = hasFavorited;
    const previousCount = count;
    const nextFavorited = !previousFavorited;

    setHasFavorited(nextFavorited);
    setCount((current) =>
      Math.max(0, current + (nextFavorited ? 1 : -1))
    );
    setSubmitting(true);

    try {
      const state = await toggleNoteFavorite(noteId, previousFavorited);

      setHasFavorited(state.hasFavorited);
      setCount(state.count);

      toast.success(state.hasFavorited ? "已收藏这条云笺。" : "已取消收藏。");
    } catch (error) {
      setHasFavorited(previousFavorited);
      setCount(previousCount);

      const message =
        error instanceof Error ? error.message : "操作失败，请稍后重试。";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading || submitting}
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-full border px-5 text-sm font-semibold transition",
        hasFavorited
          ? "border-shiqing bg-shiqing text-white shadow-soft"
          : "border-shiqing/20 bg-shiqing-soft text-shiqing-dark hover:bg-shiqing hover:text-white"
      )}
    >
      <Bookmark
        className="h-4 w-4"
        fill={hasFavorited ? "currentColor" : "none"}
      />
      {loading ? "加载中" : `${count} 收藏`}
    </button>
  );
}