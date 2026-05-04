"use client";

import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  getNoteLikeState,
  toggleNoteLike
} from "@/lib/likes";
import { cn } from "@/lib/utils";

type LikeButtonProps = {
  noteId: string;
  initialCount?: number;
};

export function LikeButton({
  noteId,
  initialCount = 0
}: LikeButtonProps) {
  const [count, setCount] = useState(initialCount);
  const [hasLiked, setHasLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadState() {
      setLoading(true);

      try {
        const state = await getNoteLikeState(noteId);

        if (!mounted) return;

        setCount(state.count);
        setHasLiked(state.hasLiked);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "加载点赞状态失败。";
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

    const previousLiked = hasLiked;
    const previousCount = count;

    const nextLiked = !previousLiked;

    setHasLiked(nextLiked);
    setCount((current) => Math.max(0, current + (nextLiked ? 1 : -1)));
    setSubmitting(true);

    try {
      const state = await toggleNoteLike(noteId, previousLiked);

      setHasLiked(state.hasLiked);
      setCount(state.count);

      toast.success(state.hasLiked ? "已喜欢这条云笺。" : "已取消喜欢。");
    } catch (error) {
      setHasLiked(previousLiked);
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
        hasLiked
          ? "border-cinnabar bg-cinnabar text-white shadow-seal"
          : "border-cinnabar/20 bg-cinnabar-soft text-cinnabar hover:bg-cinnabar hover:text-white"
      )}
    >
      <Heart
        className="h-4 w-4"
        fill={hasLiked ? "currentColor" : "none"}
      />
      {loading ? "加载中" : `${count} 喜欢`}
    </button>
  );
}