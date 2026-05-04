"use client";

import Link from "next/link";
import {
  ExternalLink,
  FileUp,
  Globe2,
  Lock,
  MessageCircle,
  Save,
  Undo2
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  getCommunityNoteHref,
  publishNote,
  unpublishNote,
  updatePublishedNoteSettings
} from "@/lib/community";
import type { Note } from "@/types/note";

type PublishPanelProps = {
  note: Note;
  onUpdated: (note: Note) => void;
};

export function PublishPanel({ note, onUpdated }: PublishPanelProps) {
  const isPublished = note.visibility === "public";

  const [excerpt, setExcerpt] = useState(note.community_excerpt ?? "");
  const [allowComments, setAllowComments] = useState(note.allow_comments);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setExcerpt(note.community_excerpt ?? "");
    setAllowComments(note.allow_comments);
  }, [note.id, note.community_excerpt, note.allow_comments]);

  async function handlePublish() {
    setSaving(true);

    try {
      const updated = await publishNote(note.id, {
  community_excerpt: excerpt,
  allow_comments: allowComments ?? true
});

      onUpdated(updated);
      toast.success("已发布到社区。");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "发布失败，请稍后重试。";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  }

  async function handleUnpublish() {
    setSaving(true);

    try {
      const updated = await unpublishNote(note.id);
      onUpdated(updated);
      toast.success("已取消社区发布。");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "取消发布失败，请稍后重试。";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveSettings() {
    setSaving(true);

    try {
      const updated = await updatePublishedNoteSettings(note.id, {
        community_excerpt: excerpt,
        allow_comments: allowComments?? true
      });

      onUpdated(updated);
      toast.success("发布设置已保存。");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "保存失败，请稍后重试。";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="paper-card p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-cinnabar">发布系统</p>
          <h2 className="font-title mt-2 text-2xl font-black text-ink">
            社区发布
          </h2>
        </div>

        <div
          className={
            isPublished
              ? "inline-flex items-center gap-1 rounded-full bg-shiqing-soft px-3 py-1.5 text-xs font-semibold text-shiqing-dark"
              : "inline-flex items-center gap-1 rounded-full bg-cinnabar-soft px-3 py-1.5 text-xs font-semibold text-cinnabar"
          }
        >
          {isPublished ? (
            <>
              <Globe2 className="h-3.5 w-3.5" />
              已公开
            </>
          ) : (
            <>
              <Lock className="h-3.5 w-3.5" />
              私密
            </>
          )}
        </div>
      </div>

      <p className="mt-4 text-sm leading-loose text-dai/65">
        发布后，这篇笔记会出现在社区广场。你可以随时取消发布，取消后其他用户将无法继续访问。
      </p>

      <label className="mt-5 block">
        <span className="mb-2 block text-sm font-semibold text-dai">
          社区摘要
        </span>
        <textarea
          value={excerpt}
          onChange={(event) => setExcerpt(event.target.value)}
          rows={4}
          maxLength={180}
          placeholder="写一段展示在社区卡片上的摘要，不填则后续默认截取正文。"
          className="w-full rounded-2xl border border-border-soft bg-white/70 px-4 py-3 text-sm leading-loose outline-none transition focus:border-cinnabar/50 focus:ring-4 focus:ring-cinnabar/10"
        />
        <p className="mt-2 text-xs text-dai/45">{excerpt.length}/180</p>
      </label>

      <label className="mt-5 flex items-start justify-between gap-4 rounded-2xl border border-border-soft bg-white/52 p-4">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold text-dai">
            <MessageCircle className="h-4 w-4 text-cinnabar" />
            允许评论
          </p>
          <p className="mt-1 text-xs leading-relaxed text-dai/50">
            开启后，其他登录用户可以在社区详情页评论这篇笔记。
          </p>
        </div>

        <input
          type="checkbox"
          checked={allowComments}
          onChange={(event) => setAllowComments(event.target.checked)}
          className="mt-1 h-5 w-5 accent-cinnabar"
        />
      </label>

      <div className="mt-6 grid gap-3">
        {isPublished ? (
          <>
            <button
              type="button"
              onClick={handleSaveSettings}
              disabled={saving}
              className="seal-button h-11 gap-2 text-sm font-semibold"
            >
              <Save className="h-4 w-4" />
              {saving ? "保存中..." : "保存发布设置"}
            </button>

            <Link
              href={getCommunityNoteHref(note.id)}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border-soft bg-white/70 px-5 text-sm font-semibold text-dai transition hover:bg-white"
            >
              <ExternalLink className="h-4 w-4" />
              查看社区页面
            </Link>

            <button
              type="button"
              onClick={handleUnpublish}
              disabled={saving}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-cinnabar/20 bg-cinnabar-soft px-5 text-sm font-semibold text-cinnabar transition hover:bg-cinnabar hover:text-white"
            >
              <Undo2 className="h-4 w-4" />
              取消发布
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={handlePublish}
            disabled={saving}
            className="seal-button h-11 gap-2 text-sm font-semibold"
          >
            <FileUp className="h-4 w-4" />
            {saving ? "发布中..." : "发布到社区"}
          </button>
        )}
      </div>

      {isPublished && note.published_at && (
        <p className="mt-4 text-xs leading-relaxed text-dai/45">
          发布时间：{new Date(note.published_at).toLocaleString("zh-CN")}
        </p>
      )}
    </section>
  );
}