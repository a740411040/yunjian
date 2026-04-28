"use client";

import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { motion } from "motion/react";
import { Bold, Heading2, Italic, List, Quote, Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import { parseTags } from "@/lib/utils";
import type { Note, NotePayload } from "@/types/note";

type NoteEditorProps = {
  note: Note | null;
  onClose: () => void;
  onSave: (payload: NotePayload) => Promise<void>;
};

export function NoteEditor({ note, onClose, onSave }: NoteEditorProps) {
  const [title, setTitle] = useState(note?.title ?? "");
  const [tagsInput, setTagsInput] = useState(note?.tags.join("，") ?? "");
  const [submitting, setSubmitting] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "写下此刻的灵感、摘录、实验记录或日常所思..."
      })
    ],
    content: note?.content ?? "",
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none"
      }
    },
    immediatelyRender: false
  });

  useEffect(() => {
    setTitle(note?.title ?? "");
    setTagsInput(note?.tags.join("，") ?? "");

    if (editor) {
      editor.commands.setContent(note?.content ?? "");
    }
  }, [note, editor]);

  async function handleSubmit() {
    if (!editor) return;

    setSubmitting(true);

    try {
      await onSave({
        title: title.trim() || "未题",
        content: editor.getHTML(),
        tags: parseTags(tagsInput)
      });
    } finally {
      setSubmitting(false);
    }
  }

  const menuItems = [
    {
      label: "粗体",
      icon: Bold,
      active: editor?.isActive("bold"),
      onClick: () => editor?.chain().focus().toggleBold().run()
    },
    {
      label: "斜体",
      icon: Italic,
      active: editor?.isActive("italic"),
      onClick: () => editor?.chain().focus().toggleItalic().run()
    },
    {
      label: "标题",
      icon: Heading2,
      active: editor?.isActive("heading", { level: 2 }),
      onClick: () => editor?.chain().focus().toggleHeading({ level: 2 }).run()
    },
    {
      label: "列表",
      icon: List,
      active: editor?.isActive("bulletList"),
      onClick: () => editor?.chain().focus().toggleBulletList().run()
    },
    {
      label: "引用",
      icon: Quote,
      active: editor?.isActive("blockquote"),
      onClick: () => editor?.chain().focus().toggleBlockquote().run()
    }
  ];

  return (
    <motion.section
      className="glass-card flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-[32px]"
      initial={{ opacity: 0, y: 28, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 18, scale: 0.98 }}
      transition={{ duration: 0.24, ease: "easeOut" }}
    >
      <header className="flex items-center justify-between border-b border-border-soft bg-white/42 px-5 py-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-cinnabar">
            {note ? "编辑云笺" : "新建云笺"}
          </p>
          <h2 className="font-title mt-1 text-2xl font-black text-ink">
            以字为舟，渡一念之云
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="grid h-10 w-10 place-items-center rounded-full border border-border-soft bg-white/70 text-dai transition hover:bg-white"
          aria-label="关闭"
        >
          <X className="h-4 w-4" />
        </button>
      </header>

      <div className="flex-1 overflow-auto p-5">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-dai">标题</span>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="给这条云笺起个题目"
            className="h-12 w-full rounded-2xl border border-border-soft bg-white/70 px-4 font-title text-lg font-bold text-ink outline-none transition focus:border-cinnabar/50 focus:ring-4 focus:ring-cinnabar/10"
          />
        </label>

        <label className="mt-4 block">
          <span className="mb-2 block text-sm font-semibold text-dai">
            标签
            <span className="ml-2 font-normal text-dai/45">
              用逗号、空格或顿号分隔
            </span>
          </span>
          <input
            value={tagsInput}
            onChange={(event) => setTagsInput(event.target.value)}
            placeholder="例如：科研，读书，灵感"
            className="h-11 w-full rounded-2xl border border-border-soft bg-white/70 px-4 text-sm text-dai outline-none transition focus:border-cinnabar/50 focus:ring-4 focus:ring-cinnabar/10"
          />
        </label>

        <div className="editor-shell mt-5 overflow-hidden rounded-3xl border border-border-soft bg-white/72">
          <div className="flex flex-wrap gap-2 border-b border-border-soft bg-paper/60 p-3">
            {menuItems.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={item.onClick}
                className={`inline-flex h-9 items-center gap-2 rounded-full px-3 text-xs font-medium transition ${
                  item.active
                    ? "bg-cinnabar text-white"
                    : "bg-white/70 text-dai hover:bg-white"
                }`}
              >
                <item.icon className="h-3.5 w-3.5" />
                {item.label}
              </button>
            ))}
          </div>

          <div className="px-4 py-3">
            <EditorContent editor={editor} />
          </div>
        </div>
      </div>

      <footer className="flex justify-end gap-3 border-t border-border-soft bg-white/44 px-5 py-4">
        <button
          type="button"
          onClick={onClose}
          className="h-11 rounded-full border border-border-soft bg-white/70 px-5 text-sm font-medium text-dai transition hover:bg-white"
        >
          取消
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="seal-button h-11 gap-2 px-5 text-sm font-semibold"
        >
          <Save className="h-4 w-4" />
          {submitting ? "保存中..." : "保存云笺"}
        </button>
      </footer>
    </motion.section>
  );
}
