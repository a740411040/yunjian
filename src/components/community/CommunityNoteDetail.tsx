// src/components/community/CommunityNoteDetail.tsx

"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Download,
  Flag,
  MessageCircle,
  UserRound
} from "lucide-react";
import { useRef, useState } from "react";
import { FavoriteButton } from "@/components/community/FavoriteButton";
import { LikeButton } from "@/components/community/LikeButton";
import { CommentsSection } from "@/components/community/CommentsSection";
import { ReportDialog } from "@/components/community/ReportDialog";
import { PosterCaptureCard } from "@/components/poster/PosterCaptureCard";
import { usePosterExport } from "@/hooks/usePosterExport";
import { formatDate } from "@/lib/date";
import type { CommunityNote } from "@/types/community";

type CommunityNoteDetailProps = {
  note: CommunityNote;
};

export function CommunityNoteDetail({ note }: CommunityNoteDetailProps) {
  const posterRef = useRef<HTMLDivElement>(null);
  const { exporting, exportPoster } = usePosterExport();

  const [commentCount, setCommentCount] = useState(note.comment_count ?? 0);

  const profile = note.profiles;
  const authorName =
    profile?.display_name || profile?.username || "云笺用户";

  function handleCommentCreated() {
    setCommentCount((count) => count + 1);
  }

  function handleCommentDeleted() {
    setCommentCount((count) => Math.max(0, count - 1));
  }

  return (
    <main className="min-h-screen p-4 md:p-6">
      <div className="page-shell">
        <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-center">
          <Link
            href="/community"
            className="inline-flex h-11 items-center gap-2 rounded-full border border-border-soft bg-white/70 px-5 text-sm font-semibold text-dai transition hover:bg-white"
          >
            <ArrowLeft className="h-4 w-4" />
            返回社区
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            <ReportDialog
              targetType="note"
              targetId={note.id}
              triggerLabel="举报笔记"
              triggerClassName="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border-soft bg-white/70 px-5 text-sm font-semibold text-dai transition hover:border-cinnabar/20 hover:bg-white hover:text-cinnabar"
            />

            <button
              type="button"
              onClick={() => exportPoster(posterRef.current, note.title)}
              disabled={exporting}
              className="seal-button h-11 gap-2 px-5 text-sm font-semibold"
            >
              <Download className="h-4 w-4" />
              {exporting ? "生成中..." : "保存小红书海报"}
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
          <div className="space-y-6">
            <article className="paper-card p-6 md:p-9">
              <div className="flex items-center gap-3">
                <Link
                  href={`/profile/${note.user_id}`}
                  className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-full border border-cinnabar/20 bg-cinnabar-soft text-cinnabar"
                >
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
                </Link>

                <div>
                  <Link
                    href={`/profile/${note.user_id}`}
                    className="text-sm font-semibold text-ink hover:text-cinnabar"
                  >
                    {authorName}
                  </Link>

                  <p className="text-xs text-dai/45">
                    发布于 {formatDate(note.published_at ?? note.updated_at)}
                  </p>
                </div>
              </div>

              <div className="mt-7 flex flex-wrap gap-2">
                <span className="rounded-full bg-shiqing-soft px-3 py-1.5 text-xs font-semibold text-shiqing-dark">
                  社区公开
                </span>

                {(note.tags ?? []).map((tag) => (
                  <span key={tag} className="bookmark-tag">
                    {tag}
                  </span>
                ))}
              </div>

              <h1 className="font-title mt-7 text-5xl font-black leading-tight text-ink">
                {note.title || "未题"}
              </h1>

              {note.community_excerpt && (
                <p className="mt-5 rounded-3xl border border-border-soft bg-white/52 p-5 text-sm leading-loose text-dai/72">
                  {note.community_excerpt}
                </p>
              )}

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <LikeButton noteId={note.id} initialCount={note.like_count} />

                <FavoriteButton
                  noteId={note.id}
                  initialCount={note.favorite_count}
                />

                <span className="inline-flex h-11 items-center gap-2 rounded-full border border-border-soft bg-white/70 px-5 text-sm font-semibold text-dai/70">
                  <MessageCircle className="h-4 w-4" />
                  {commentCount} 评论
                </span>

                <ReportDialog
                  targetType="note"
                  targetId={note.id}
                  triggerLabel="举报"
                  triggerClassName="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border-soft bg-white/70 px-5 text-sm font-semibold text-dai/60 transition hover:border-cinnabar/20 hover:bg-white hover:text-cinnabar"
                />
              </div>

              <hr className="ink-divider my-8" />

              <div
                className="note-content"
                dangerouslySetInnerHTML={{
                  __html: note.content || "<p>这条云笺还没有正文。</p>"
                }}
              />
            </article>

            <CommentsSection
              noteId={note.id}
              allowComments={note.allow_comments}
              onCommentCreated={handleCommentCreated}
              onCommentDeleted={handleCommentDeleted}
            />
          </div>

          <aside className="space-y-6">
            <section className="paper-card p-6">
              <p className="text-sm font-semibold text-cinnabar">作者</p>

              <div className="mt-5 flex items-center gap-4">
                <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-full border border-cinnabar/20 bg-cinnabar-soft text-cinnabar">
                  {profile?.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={profile.avatar_url}
                      alt={authorName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <UserRound className="h-6 w-6" />
                  )}
                </div>

                <div className="min-w-0">
                  <h2 className="font-title truncate text-2xl font-black text-ink">
                    {authorName}
                  </h2>

                  <p className="mt-1 truncate text-sm text-dai/45">
                    @{profile?.username ?? "user"}
                  </p>
                </div>
              </div>

              <p className="mt-5 text-sm leading-loose text-dai/65">
                {profile?.bio || "这个人还没有留下简介。"}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={`/profile/${note.user_id}`}
                  className="inline-flex h-10 items-center justify-center rounded-full border border-border-soft bg-white/70 px-5 text-sm font-semibold text-dai transition hover:bg-white"
                >
                  查看主页
                </Link>

                <ReportDialog
                  targetType="user"
                  targetId={note.user_id}
                  triggerLabel="举报用户"
                  triggerClassName="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-border-soft bg-white/70 px-5 text-sm font-semibold text-dai transition hover:border-cinnabar/20 hover:bg-white hover:text-cinnabar"
                />
              </div>
            </section>

            <section className="glass-card rounded-[32px] p-5">
              <div className="mb-5">
                <p className="text-sm font-semibold text-cinnabar">
                  小红书分享海报
                </p>

                <h2 className="font-title mt-1 text-2xl font-black text-ink">
                  3:4 新中式卡片
                </h2>

                <p className="mt-2 text-sm leading-loose text-dai/60">
                  点击上方“保存小红书海报”即可导出。
                </p>
              </div>

              <div className="flex justify-center">
                <PosterCaptureCard
                  ref={posterRef}
                  note={note}
                  profile={profile}
                  variant="community"
                  stats={{
                    likeCount: note.like_count,
                    favoriteCount: note.favorite_count,
                    commentCount
                  }}
                />
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}