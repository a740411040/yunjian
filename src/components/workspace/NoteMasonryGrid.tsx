"use client";

import { motion } from "motion/react";
import { NoteCard } from "@/components/workspace/NoteCard";
import type { Note } from "@/types/note";

type NoteMasonryGridProps = {
  notes: Note[];
  onEdit: (note: Note) => void;
  onDelete: (id: string) => Promise<void>;
  onTogglePinned: (note: Note) => Promise<void>;
};

export function NoteMasonryGrid({
  notes,
  onEdit,
  onDelete,
  onTogglePinned
}: NoteMasonryGridProps) {
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
        <NoteCard
          key={note.id}
          note={note}
          onEdit={onEdit}
          onDelete={onDelete}
          onTogglePinned={onTogglePinned}
        />
      ))}
    </motion.div>
  );
}
