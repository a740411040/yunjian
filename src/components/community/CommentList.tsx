// src/components/community/CommentList.tsx

"use client";

import { useState } from "react";
import { MessageCircle, Trash2, UserRound } from "lucide-react";
import { ReportDialog } from "@/components/community/ReportDialog";
import { createClient } from "@/lib/supabase/browser";
import { formatDate } from "@/lib/date";

export type CommunityCommentItem = {
  id: string;
  note_id: string;
  user_id: string;
  parent_id: string | null;
  content: string;
  is_deleted?: boolean | null;
  created_at: string;
  updated_at: string | null;
  profile: {
    id: string;
    username: string | null;
    display_name: string | null;
    avatar_url: string | null;
  } | null;
};

type CommentListProps = {
  comments: CommunityCommentItem[];
  currentUserId: string | null;
  onDeleted?: () => void | Promise<void>;
};

export function CommentList({
  comments,
  currentUserId,
  onDeleted
}: CommentListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleDelete(comment: CommunityCommentItem) {
    if (!currentUserId) {
      setErrorMessage("请先登录后再删除评论。");
      return;
    }

    if (comment.user_id !== currentUserId) {
      setErrorMessage("只能删除自己的评论。");
      return;
    }

    const ok = window.confirm("确定要删除这条评论吗？");

    if (!ok) {
      return;
    }

    setDeletingId(comment.id);
    setErrorMessage(null);

    const supabase = createClient();

    const { error } = await supabase
      .from("note_comments")
      .update({
        is_deleted: true,
        updated_at: new Date().toISOString()
      })
      .eq("id", comment.id)
      .eq("user_id", currentUserId);

    if (error) {
      console.error("[CommentList:deleteComment]", error);
      setErrorMessage("评论删除失败，请稍后重试。");
      setDeletingId(null);
      return;
    }

    await onDeleted?.();

    setDeletingId(null);
  }

  if (comments.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-border-soft bg-white/45 p-10 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-cinnabar-soft text-cinnabar">
          <MessageCircle className="h-6 w-6" />
        </div>

        <p className="mt-5 text-sm font-semibold text-dai/70">还没有评论</p>

        <p className="mt-2 text-sm text-dai/40">
          做第一个共赏此笺的人吧。
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {errorMessage && (
        <div className="rounded-2xl bg-cinnabar-soft px-4 py-3 text-sm text-cinnabar">
          {errorMessage}
        </div>
      )}

      {comments.map((comment) => {
        const profile = comment.profile;
        const displayName =
          profile?.display_name || profile?.username || "云笺用户";
        const username = profile?.username || "user";
        const isOwnComment = currentUserId === comment.user_id;
        const isDeleting = deletingId === comment.id;

        return (
          <article
            key={comment.id}
            className="rounded-[28px] border border-border-soft bg-white/62 p-5 shadow-sm transition hover:bg-white/78"
          >
            <div className="flex items-start gap-3">
              <div className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full border border-cinnabar/15 bg-cinnabar-soft text-cinnabar">
                {profile?.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profile.avatar_url}
                    alt={displayName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <UserRound className="h-4 w-4" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink">
                      {displayName}
                    </p>

                    <p className="mt-0.5 truncate text-xs text-dai/40">
                      @{username} · {formatDate(comment.created_at)}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    {!isOwnComment && (
                      <ReportDialog
                        targetType="comment"
                        targetId={comment.id}
                        triggerLabel="举报"
                        triggerClassName="inline-flex h-8 shrink-0 items-center justify-center gap-1 rounded-full border border-border-soft bg-white/70 px-3 text-xs font-semibold text-dai/55 transition hover:border-cinnabar/20 hover:bg-white hover:text-cinnabar"
                      />
                    )}

                    {isOwnComment && (
                      <button
                        type="button"
                        onClick={() => handleDelete(comment)}
                        disabled={isDeleting}
                        className="inline-flex h-8 shrink-0 items-center justify-center gap-1 rounded-full border border-border-soft bg-white/70 px-3 text-xs font-semibold text-dai/55 transition hover:border-cinnabar/20 hover:bg-white hover:text-cinnabar disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        {isDeleting ? "删除中" : "删除"}
                      </button>
                    )}
                  </div>
                </div>

                <p className="mt-3 whitespace-pre-wrap break-words rounded-2xl bg-paper/55 px-4 py-3 text-sm leading-7 text-dai/75">
                  {comment.content}
                </p>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}