"use client";

import { AnimatePresence, motion } from "motion/react";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
};

export function ConfirmDialog({
  open,
  title,
  description,
  confirmText = "确认",
  cancelText = "取消",
  onConfirm,
  onCancel
}: ConfirmDialogProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] grid place-items-center bg-ink/32 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
        >
          <motion.section
            className="paper-card w-full max-w-sm p-6"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <p className="text-sm font-medium text-cinnabar">朱砂确认</p>
            <h2 className="font-title mt-2 text-2xl font-black text-ink">
              {title}
            </h2>
            <p className="mt-3 text-sm leading-loose text-dai/70">
              {description}
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={onCancel}
                className="h-10 rounded-full border border-border-soft bg-white/70 px-5 text-sm font-medium text-dai transition hover:bg-white"
              >
                {cancelText}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className="seal-button h-10 px-5 text-sm font-semibold"
              >
                {confirmText}
              </button>
            </div>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
