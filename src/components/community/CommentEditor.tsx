// src/components/community/CommentEditor.tsx

"use client";

import { FormEvent, useState } from "react";
import { Send } from "lucide-react";
import { createNotification } from "@/lib/notifications";
import { createClient } from "@/lib/supabase/browser";

type CommentEditorProps = {
  noteId: string;
  onCreated?: () => void | Promise<void>;
};

type NoteForNotification = {
  id: string;
  user_id: string;
  title: string | null;
};

type CreatedComment = {
  id: string;
  note_id: string;
  user_id: string;
  content: string;
};

const MAX_COMMENT_LENGTH = 500;

export function CommentEditor({ noteId, onCreated }: CommentEditorProps) {
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const trimmedContent = content.trim();
  const canSubmit = trimmedContent.length > 0 && !submitting;

  async function notifyNoteCommented(comment: CreatedComment) {
    const supabase = createClient();

    const { data: noteData, error } = await supabase
      .from("notes")
      .select("id,user_id,title")
      .eq("id", comment.note_id)
      .maybeSingle();

    if (error) {
      console.error("[CommentEditor:notifyNoteCommented:getNote]", error);
      return;
    }

    const note = noteData as NoteForNotification | null;

    if (!note || note.user_id === comment.user_id) {
      return;
    }

    try {
      await createNotification({
        userId: note.user_id,
        type: "note_commented",
        noteId: note.id,
        commentId: comment.id,
        title: "有人评论了你的云笺",
        content: trimmedContent,
        href: `/community/notes/${note.id}`
      });
    } catch (error) {
      console.error(
        "[CommentEditor:notifyNoteCommented:createNotification]",
        error
      );
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!trimmedContent) {
      setErrorMessage("评论内容不能为空。");
      return;
    }

    if (trimmedContent.length > MAX_COMMENT_LENGTH) {
      setErrorMessage(`评论最多 ${MAX_COMMENT_LENGTH} 个字符。`);
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    const supabase = createClient();

    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("[CommentEditor:getUser]", userError);
      setErrorMessage("请先登录后再发表评论。");
      setSubmitting(false);
      return;
    }

    const { data: createdComment, error } = await supabase
      .from("note_comments")
      .insert({
        note_id: noteId,
        user_id: user.id,
        parent_id: null,
        content: trimmedContent,
        is_deleted: false,
        moderation_status: "approved"
      })
      .select("id,note_id,user_id,content")
      .single();

    if (error) {
      console.error("[CommentEditor:createComment]", error);
      setErrorMessage("评论发布失败，请稍后重试。");
      setSubmitting(false);
      return;
    }

    await notifyNoteCommented(createdComment as CreatedComment);

    setContent("");

    await onCreated?.();

    setSubmitting(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-border-soft bg-white/55 p-4"
    >
      <label htmlFor="community-comment-editor" className="sr-only">
        写下评论
      </label>

      <textarea
        id="community-comment-editor"
        value={content}
        onChange={(event) => {
          setContent(event.target.value);

          if (errorMessage) {
            setErrorMessage(null);
          }
        }}
        maxLength={MAX_COMMENT_LENGTH}
        placeholder="写下你的想法，与此笺共鸣..."
        className="min-h-28 w-full resize-none rounded-2xl border border-border-soft bg-white/80 px-4 py-3 text-sm leading-7 text-ink outline-none transition placeholder:text-dai/35 focus:border-cinnabar/30 focus:bg-white"
      />

      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-xs text-dai/40">
          {trimmedContent.length}/{MAX_COMMENT_LENGTH}
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-cinnabar px-5 text-sm font-semibold text-white transition hover:bg-cinnabar/90 disabled:cursor-not-allowed disabled:bg-dai/20 disabled:text-dai/40"
        >
          <Send className="h-4 w-4" />
          {submitting ? "发布中..." : "发表评论"}
        </button>
      </div>

      {errorMessage && (
        <p className="mt-3 rounded-2xl bg-cinnabar-soft px-4 py-3 text-sm text-cinnabar">
          {errorMessage}
        </p>
      )}
    </form>
  );
}