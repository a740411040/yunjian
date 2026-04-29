"use client";

import { Loader2, UserPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { toggleFollowUser } from "@/lib/follows";
import type { FollowSummary } from "@/types/follow";

type FollowButtonProps = {
  summary: FollowSummary;
  onChange: (summary: FollowSummary) => void;
};

export function FollowButton({ summary, onChange }: FollowButtonProps) {
  const [submitting, setSubmitting] = useState(false);

  if (summary.isSelf) {
    return (
      <div className="rounded-2xl border border-border-soft bg-white/52 px-4 py-3 text-sm leading-relaxed text-dai/60">
        这是你的公开名片页，关注关系会在其他人的页面上显示。
      </div>
    );
  }

  async function handleToggleFollow() {
    if (submitting) {
      return;
    }

    setSubmitting(true);

    try {
      const next = await toggleFollowUser(
        summary.targetUserId,
        summary.isFollowing
      );

      onChange(next);
      toast.success(
        next.isFollowing ? "已加入关注清单。" : "已从关注清单中移出。"
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "关注操作失败，请稍后重试。";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleToggleFollow}
      disabled={submitting}
      className={`inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition ${
        summary.isFollowing
          ? "surface-button text-dai hover:text-cinnabar"
          : "seal-button"
      }`}
    >
      {submitting ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <UserPlus className="h-4 w-4" />
      )}
      {summary.isFollowing ? "已关注" : "关注此人"}
    </button>
  );
}
