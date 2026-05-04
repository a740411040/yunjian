// src/components/community/ReportDialog.tsx

"use client";

import { FormEvent, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, Flag, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { createReport } from "@/lib/reports";
import type { ReportReason, ReportTargetType } from "@/types/report";

type ReportDialogProps = {
  targetType: ReportTargetType;
  targetId: string;
  triggerLabel?: string;
  triggerClassName?: string;
};

const REPORT_REASONS: Array<{
  value: ReportReason;
  label: string;
  description: string;
}> = [
  {
    value: "spam",
    label: "垃圾广告",
    description: "广告、引流、重复刷屏或无关内容。"
  },
  {
    value: "harassment",
    label: "不友善或骚扰",
    description: "攻击、辱骂、骚扰或恶意挑衅。"
  },
  {
    value: "inappropriate",
    label: "不适宜内容",
    description: "包含不适宜公开展示的文字、图片或表达。"
  },
  {
    value: "copyright",
    label: "侵犯权益",
    description: "疑似侵犯版权、署名权、隐私权或其他权益。"
  },
  {
    value: "misinformation",
    label: "虚假或误导信息",
    description: "疑似虚假、误导、伪科学或不准确内容。"
  },
  {
    value: "other",
    label: "其他问题",
    description: "其他需要管理员关注的问题。"
  }
];

function getTargetLabel(targetType: ReportTargetType) {
  if (targetType === "note") {
    return "笔记";
  }

  if (targetType === "comment") {
    return "评论";
  }

  return "用户";
}

export function ReportDialog({
  targetType,
  targetId,
  triggerLabel = "举报",
  triggerClassName
}: ReportDialogProps) {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<ReportReason>("spam");
  const [detail, setDetail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const targetLabel = getTargetLabel(targetType);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeDialog();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, submitting]);

  function closeDialog() {
    if (submitting) {
      return;
    }

    setOpen(false);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSubmitting(true);

    try {
      await createReport({
        targetType,
        targetId,
        reason,
        detail
      });

      toast.success("举报已提交，我们会尽快处理。");

      setOpen(false);
      setReason("spam");
      setDetail("");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "举报提交失败，请稍后重试。";

      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  const dialog = open ? (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`举报${targetLabel}`}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999
      }}
    >
      <div
        onClick={closeDialog}
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(28, 28, 30, 0.46)"
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          minHeight: "100vh",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          padding: 16,
          boxSizing: "border-box"
        }}
      >
        <div
          onClick={(event) => event.stopPropagation()}
          className="w-full max-w-lg overflow-hidden rounded-[32px] border border-border-soft bg-paper shadow-2xl"
          style={{
            maxHeight: "calc(100vh - 32px)"
          }}
        >
          <div className="flex items-start justify-between gap-4 border-b border-border-soft bg-white/80 p-6">
            <div>
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-cinnabar-soft text-cinnabar">
                <AlertTriangle className="h-5 w-5" />
              </div>

              <h2 className="font-title mt-4 text-2xl font-black text-ink">
                举报{targetLabel}
              </h2>

              <p className="mt-2 text-sm leading-relaxed text-dai/60">
                请告诉我们你认为这条{targetLabel}存在什么问题。举报提交后，管理员会进行审核。
              </p>
            </div>

            <button
              type="button"
              onClick={closeDialog}
              disabled={submitting}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/70 text-dai/60 transition hover:bg-white hover:text-cinnabar disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="关闭举报窗口"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="overflow-y-auto p-6"
            style={{
              maxHeight: "calc(100vh - 190px)"
            }}
          >
            <div className="space-y-3">
              {REPORT_REASONS.map((item) => (
                <label
                  key={item.value}
                  className={[
                    "flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition",
                    reason === item.value
                      ? "border-cinnabar/30 bg-cinnabar-soft/55"
                      : "border-border-soft bg-white/55 hover:bg-white"
                  ].join(" ")}
                >
                  <input
                    type="radio"
                    name={`report-reason-${targetType}-${targetId}`}
                    value={item.value}
                    checked={reason === item.value}
                    onChange={() => setReason(item.value)}
                    className="mt-1 h-4 w-4 accent-cinnabar"
                  />

                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-ink">
                      {item.label}
                    </span>

                    <span className="mt-1 block text-xs leading-relaxed text-dai/55">
                      {item.description}
                    </span>
                  </span>
                </label>
              ))}
            </div>

            <label className="mt-5 block">
              <span className="mb-2 block text-sm font-semibold text-dai">
                补充说明
                <span className="ml-1 text-xs font-normal text-dai/40">
                  可选
                </span>
              </span>

              <textarea
                value={detail}
                onChange={(event) => setDetail(event.target.value)}
                maxLength={500}
                rows={4}
                placeholder="可以补充说明具体问题，帮助管理员更快判断。"
                className="w-full resize-none rounded-2xl border border-border-soft bg-white/70 px-4 py-3 text-sm leading-7 text-ink outline-none transition placeholder:text-dai/35 focus:border-cinnabar/40 focus:ring-4 focus:ring-cinnabar/10"
              />

              <span className="mt-1 block text-right text-xs text-dai/40">
                {detail.trim().length}/500
              </span>
            </label>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeDialog}
                disabled={submitting}
                className="inline-flex h-11 items-center justify-center rounded-full border border-border-soft bg-white/70 px-5 text-sm font-semibold text-dai transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                取消
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-cinnabar px-5 text-sm font-semibold text-white transition hover:bg-cinnabar/90 disabled:cursor-not-allowed disabled:bg-dai/20 disabled:text-dai/40"
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Flag className="h-4 w-4" />
                )}

                {submitting ? "提交中..." : "提交举报"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          triggerClassName ??
          "inline-flex h-10 items-center justify-center gap-2 rounded-full border border-border-soft bg-white/70 px-4 text-sm font-semibold text-dai transition hover:border-cinnabar/20 hover:bg-white hover:text-cinnabar"
        }
      >
        <Flag className="h-4 w-4" />
        {triggerLabel}
      </button>

      {mounted && dialog ? createPortal(dialog, document.body) : null}
    </>
  );
}