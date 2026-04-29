"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import {
  Bookmark,
  Heart,
  Loader2,
  MessageCircle,
  ScrollText,
  UserRound
} from "lucide-react";
import { toast } from "sonner";
import { formatDate } from "@/lib/date";
import { getCommunityNoteHref } from "@/lib/community";
import { toggleNoteFavorite } from "@/lib/favorites";
import { toggleNoteLike } from "@/lib/likes";
import { stripHtml } from "@/lib/utils";
import type { CommunityNote } from "@/types/community";

type CommunityNoteCardProps = {
  note: CommunityNote;
  onNoteChange?: (note: CommunityNote) => void;
};

export function CommunityNoteCard({
  note,
  onNoteChange
}: CommunityNoteCardProps) {
  const profile = note.profiles;

  const authorName =
    profile?.display_name || profile?.username || "云笺用户";

  const excerpt =
    note.community_excerpt?.trim() ||
    stripHtml(note.content).slice(0, 160) ||
    "这条云笺暂时没有摘要。";

  const [likeCount, setLikeCount] = useState(note.like_count);
  const [favoriteCount, setFavoriteCount] = useState(note.favorite_count);
  const [hasLiked, setHasLiked] = useState(note.has_liked);
  const [hasFavorited, setHasFavorited] = useState(note.has_favorited);
  const [liking, setLiking] = useState(false);
  const [favoriting, setFavoriting] = useState(false);

  useEffect(() => {
    setLikeCount(note.like_count);
    setFavoriteCount(note.favorite_count);
    setHasLiked(note.has_liked);
    setHasFavorited(note.has_favorited);
  }, [
    note.like_count,
    note.favorite_count,
    note.has_liked,
    note.has_favorited
  ]);

  function emitNoteChange(next: Partial<CommunityNote>) {
    onNoteChange?.({
      ...note,
      like_count: likeCount,
      favorite_count: favoriteCount,
      has_liked: hasLiked,
      has_favorited: hasFavorited,
      ...next
    });
  }

  async function handleToggleLike() {
    if (liking) return;

    const previousLiked = hasLiked;
    const previousCount = likeCount;

    const optimisticLiked = !previousLiked;
    const optimisticCount = optimisticLiked
      ? previousCount + 1
      : Math.max(0, previousCount - 1);

    setHasLiked(optimisticLiked);
    setLikeCount(optimisticCount);
    setLiking(true);

    emitNoteChange({
      has_liked: optimisticLiked,
      like_count: optimisticCount
    });

    try {
      const nextState = await toggleNoteLike(note.id, previousLiked);

      setHasLiked(nextState.hasLiked);
      setLikeCount(nextState.count);

      emitNoteChange({
        has_liked: nextState.hasLiked,
        like_count: nextState.count
      });
    } catch (error) {
      setHasLiked(previousLiked);
      setLikeCount(previousCount);

      emitNoteChange({
        has_liked: previousLiked,
        like_count: previousCount
      });

      const message =
        error instanceof Error ? error.message : "点赞失败，请稍后重试。";
      toast.error(message);
    } finally {
      setLiking(false);
    }
  }

  async function handleToggleFavorite() {
    if (favoriting) return;

    const previousFavorited = hasFavorited;
    const previousCount = favoriteCount;

    const optimisticFavorited = !previousFavorited;
    const optimisticCount = optimisticFavorited
      ? previousCount + 1
      : Math.max(0, previousCount - 1);

    setHasFavorited(optimisticFavorited);
    setFavoriteCount(optimisticCount);
    setFavoriting(true);

    emitNoteChange({
      has_favorited: optimisticFavorited,
      favorite_count: optimisticCount
    });

    try {
      const nextState = await toggleNoteFavorite(
        note.id,
        previousFavorited
      );

      setHasFavorited(nextState.hasFavorited);
      setFavoriteCount(nextState.count);

      emitNoteChange({
        has_favorited: nextState.hasFavorited,
        favorite_count: nextState.count
      });
    } catch (error) {
      setHasFavorited(previousFavorited);
      setFavoriteCount(previousCount);

      emitNoteChange({
        has_favorited: previousFavorited,
        favorite_count: previousCount
      });

      const message =
        error instanceof Error ? error.message : "收藏失败，请稍后重试。";
      toast.error(message);
    } finally {
      setFavoriting(false);
    }
  }

  return (
    <motion.article
      className="paper-card mb-5 break-inside-avoid p-5 sm:p-6"
      variants={{
        hidden: { opacity: 0, y: 18 },
        visible: { opacity: 1, y: 0 }
      }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.24, ease: "easeOut" }}
    >
      <Link
        href={`/profile/${note.user_id}`}
        className="-ml-2 flex w-fit max-w-full items-center gap-3 rounded-2xl p-2 transition hover:bg-cinnabar-soft/60"
      >
        <div className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full border border-cinnabar/20 bg-cinnabar-soft text-sm font-black text-cinnabar">
          {profile?.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatar_url}
              alt={authorName}
              className="h-full w-full object-cover"
            />
          ) : (
            <UserRound className="h-5 w-5" />
          )}
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-ink transition group-hover:text-cinnabar">
            {authorName}
          </p>

          <p className="truncate text-xs text-dai/45">
            发布于 {formatDate(note.published_at ?? note.updated_at)}
          </p>
        </div>
      </Link>

      <Link href={getCommunityNoteHref(note.id)} className="group mt-4 block">
        <h2 className="font-title text-2xl font-black leading-snug text-ink transition group-hover:text-cinnabar">
          {note.title || "未题"}
        </h2>

        <p className="mt-4 text-sm leading-loose text-dai/72">
          {excerpt}
          {excerpt.length >= 160 ? "..." : ""}
        </p>
      </Link>

      {note.tags.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {note.tags.map((tag) => (
            <span key={tag} className="bookmark-tag">
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-6 space-y-3 border-t border-border-soft/80 pt-4">
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-dai/55">
          <button
            type="button"
            onClick={handleToggleLike}
            disabled={liking}
            className={[
              "inline-flex h-8 min-w-14 items-center justify-center gap-1.5 rounded-full border px-3 text-xs font-semibold transition",
              hasLiked
                ? "border-cinnabar/20 bg-cinnabar-soft text-cinnabar"
                : "border-transparent bg-white/50 text-dai/55 hover:bg-white hover:text-cinnabar",
              liking ? "cursor-wait opacity-70" : ""
            ].join(" ")}
            aria-label={hasLiked ? "取消点赞" : "点赞"}
          >
            {liking ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Heart
                className={[
                  "h-3.5 w-3.5",
                  hasLiked ? "fill-current" : ""
                ].join(" ")}
              />
            )}
            {likeCount}
          </button>

          <button
            type="button"
            onClick={handleToggleFavorite}
            disabled={favoriting}
            className={[
              "inline-flex h-8 min-w-14 items-center justify-center gap-1.5 rounded-full border px-3 text-xs font-semibold transition",
              hasFavorited
                ? "border-shiqing-dark/15 bg-shiqing-soft text-shiqing-dark"
                : "border-transparent bg-white/50 text-dai/55 hover:bg-white hover:text-shiqing-dark",
              favoriting ? "cursor-wait opacity-70" : ""
            ].join(" ")}
            aria-label={hasFavorited ? "取消收藏" : "收藏"}
          >
            {favoriting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Bookmark
                className={[
                  "h-3.5 w-3.5",
                  hasFavorited ? "fill-current" : ""
                ].join(" ")}
              />
            )}
            {favoriteCount}
          </button>

          <span className="inline-flex h-8 min-w-14 items-center justify-center gap-1.5 rounded-full bg-white/50 px-3 text-xs font-semibold text-dai/55">
            <MessageCircle className="h-3.5 w-3.5" />
            {note.comment_count}
          </span>
        </div>

        <Link
          href={getCommunityNoteHref(note.id)}
          className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-full bg-white/75 px-4 text-xs font-semibold text-dai transition hover:bg-white hover:text-cinnabar"
        >
          <ScrollText className="h-3.5 w-3.5" />
          阅读全文
        </Link>
      </div>
    </motion.article>
  );
}
