"use client";

import { motion } from "motion/react";
import { EmptyState } from "@/components/common/EmptyState";
import { CommunityNoteCard } from "@/components/community/CommunityNoteCard";
import type { CommunityNote } from "@/types/community";

type CommunityNoteGridProps = {
  notes: CommunityNote[];
  loading: boolean;
  hasFilter: boolean;
  onClearFilter: () => void;
  onNoteChange?: (note: CommunityNote) => void;
  emptyTitle?: string;
  emptyDescription?: string;
};

export function CommunityNoteGrid({
  notes,
  loading,
  hasFilter,
  onClearFilter,
  onNoteChange,
  emptyTitle,
  emptyDescription
}: CommunityNoteGridProps) {
  if (loading) {
    return (
      <div className="columns-1 gap-5 md:columns-2 2xl:columns-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="mb-5 h-64 break-inside-avoid animate-pulse rounded-3xl border border-border-soft bg-white/52"
          />
        ))}
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <EmptyState
        title={
          emptyTitle ??
          (hasFilter ? "没有找到匹配的社区云笺" : "社区暂时还没有公开云笺")
        }
        description={
          emptyDescription ??
          (hasFilter
            ? "换一个关键词或标签试试，也可以先清除当前筛选。"
            : "从工作台进入笔记详情，点一下“发布到社区”，第一条公开云笺就会出现在这里。")
        }
        actionLabel={hasFilter ? "清除筛选" : undefined}
        onAction={hasFilter ? onClearFilter : undefined}
      />
    );
  }

  return (
    <motion.div
      className="columns-1 gap-5 md:columns-2 2xl:columns-3"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.04
          }
        }
      }}
    >
      {notes.map((note) => (
        <CommunityNoteCard
          key={note.id}
          note={note}
          onNoteChange={onNoteChange}
        />
      ))}
    </motion.div>
  );
}
