// src/components/community/CommentsSection.tsx

"use client";

import { useCallback, useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/browser";
import { CommentEditor } from "@/components/community/CommentEditor";
import {
  CommentList,
  type CommunityCommentItem
} from "@/components/community/CommentList";

type CommentsSectionProps = {
  noteId: string;
  allowComments?: boolean | null;
  onCommentCreated?: () => void;
  onCommentDeleted?: () => void;
};

type CommentRow = {
  id: string;
  note_id: string;
  user_id: string;
  parent_id: string | null;
  content: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string | null;
};

type ProfileRow = {
  id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
};

export function CommentsSection({
  noteId,
  allowComments = true,
  onCommentCreated,
  onCommentDeleted
}: CommentsSectionProps) {
  const [comments, setComments] = useState<CommunityCommentItem[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadComments = useCallback(async () => {
    setLoading(true);
    setLoadError(null);

    const supabase = createClient();

    const {
      data: { user }
    } = await supabase.auth.getUser();

    setCurrentUserId(user?.id ?? null);

    const { data: commentRows, error: commentError } = await supabase
      .from("note_comments")
      .select(
        `
        id,
        note_id,
        user_id,
        parent_id,
        content,
        is_deleted,
        created_at,
        updated_at
      `
      )
      .eq("note_id", noteId)
      .eq("is_deleted", false)
      .order("created_at", { ascending: false });

    if (commentError) {
      console.error("[CommentsSection:loadComments]", commentError);
      setLoadError("评论加载失败，请稍后重试。");
      setComments([]);
      setLoading(false);
      return;
    }

    const rows = (commentRows ?? []) as CommentRow[];

    if (rows.length === 0) {
      setComments([]);
      setLoading(false);
      return;
    }

    const userIds = Array.from(new Set(rows.map((row) => row.user_id)));

    const { data: profileRows, error: profileError } = await supabase
      .from("profiles")
      .select(
        `
        id,
        username,
        display_name,
        avatar_url
      `
      )
      .in("id", userIds);

    if (profileError) {
      console.error("[CommentsSection:loadProfiles]", profileError);
    }

    const profiles = (profileRows ?? []) as ProfileRow[];

    const profileMap = new Map<string, ProfileRow>(
      profiles.map((profile) => [profile.id, profile])
    );

    const nextComments: CommunityCommentItem[] = rows.map((row) => ({
      id: row.id,
      note_id: row.note_id,
      user_id: row.user_id,
      parent_id: row.parent_id,
      content: row.content,
      is_deleted: row.is_deleted,
      created_at: row.created_at,
      updated_at: row.updated_at,
      profile: profileMap.get(row.user_id) ?? null
    }));

    setComments(nextComments);
    setLoading(false);
  }, [noteId]);

  useEffect(() => {
    void loadComments();
  }, [loadComments]);

  async function handleCreated() {
    await loadComments();
    onCommentCreated?.();
  }

  async function handleDeleted() {
    await loadComments();
    onCommentDeleted?.();
  }

  return (
    <section className="overflow-hidden rounded-[32px] border border-border-soft bg-white/48 shadow-sm">
      <div className="border-b border-border-soft bg-white/55 px-6 py-5 md:px-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-cinnabar">评论</p>

            <h2 className="font-title mt-1 text-2xl font-black text-ink">
              共赏此笺
            </h2>
          </div>

          <div className="inline-flex h-10 items-center gap-2 rounded-full border border-border-soft bg-paper/80 px-4 text-sm font-semibold text-dai/60">
            <MessageCircle className="h-4 w-4" />
            {comments.length}
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8">
        {allowComments === false ? (
          <div className="rounded-3xl border border-border-soft bg-white/60 p-5 text-sm leading-loose text-dai/60">
            作者已关闭这篇云笺的评论。
          </div>
        ) : (
          <CommentEditor noteId={noteId} onCreated={handleCreated} />
        )}

        <div className="mt-7">
          {loading ? (
            <div className="rounded-3xl border border-border-soft bg-white/55 p-6 text-center text-sm text-dai/55">
              正在载入评论...
            </div>
          ) : loadError ? (
            <div className="rounded-3xl border border-cinnabar/15 bg-cinnabar-soft/40 p-6 text-center text-sm text-cinnabar">
              {loadError}
            </div>
          ) : (
            <CommentList
              comments={comments}
              currentUserId={currentUserId}
              onDeleted={handleDeleted}
            />
          )}
        </div>
      </div>
    </section>
  );
}