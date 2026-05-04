"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  createComment,
  deleteMyComment,
  getComments,
  getCurrentUserIdForComments
} from "@/lib/comments";
import type { CommunityComment } from "@/types/community";

export function useComments(noteId: string) {
  const [comments, setComments] = useState<CommunityComment[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  async function refresh() {
    setLoading(true);

    try {
      const [userId, data] = await Promise.all([
        getCurrentUserIdForComments(),
        getComments(noteId)
      ]);

      setCurrentUserId(userId);
      setComments(data);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "加载评论失败。";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  async function addComment(content: string) {
    setSubmitting(true);

    try {
      await createComment(noteId, content);
      await refresh();
      toast.success("评论已发布。");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "评论失败，请稍后重试。";
      toast.error(message);
      throw error;
    } finally {
      setSubmitting(false);
    }
  }

  async function removeComment(commentId: string) {
    try {
      await deleteMyComment(commentId);
      await refresh();
      toast.success("评论已删除。");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "删除失败，请稍后重试。";
      toast.error(message);
    }
  }

  useEffect(() => {
    refresh();
  }, [noteId]);

  return {
    comments,
    currentUserId,
    loading,
    submitting,
    refresh,
    addComment,
    removeComment
  };
}