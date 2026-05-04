// src/components/admin/AdminReportsPageClient.tsx

"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  EyeOff,
  Loader2,
  RotateCcw,
  ShieldAlert,
  XCircle
} from "lucide-react";
import { toast } from "sonner";
import {
  getAdminReports,
  getTargetTypeLabel,
  hideReportedComment,
  hideReportedNote,
  restoreReportedComment,
  restoreReportedNote,
  updateReportStatus,
  type AdminReportItem
} from "@/lib/admin";
import type { ReportReason, ReportStatus } from "@/types/report";

type StatusFilter = "all" | ReportStatus;

const STATUS_OPTIONS: Array<{
  value: StatusFilter;
  label: string;
}> = [
  { value: "all", label: "全部" },
  { value: "pending", label: "待处理" },
  { value: "reviewing", label: "处理中" },
  { value: "resolved", label: "已处理" },
  { value: "rejected", label: "已驳回" }
];

const STATUS_LABEL: Record<ReportStatus, string> = {
  pending: "待处理",
  reviewing: "处理中",
  resolved: "已处理",
  rejected: "已驳回"
};

const REASON_LABEL: Record<ReportReason | string, string> = {
  spam: "垃圾广告",
  harassment: "不友善或骚扰",
  inappropriate: "不适宜内容",
  copyright: "侵犯权益",
  misinformation: "虚假或误导信息",
  other: "其他问题"
};

export function AdminReportsPageClient() {
  const [reports, setReports] = useState<AdminReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("pending");
  const [workingId, setWorkingId] = useState<string | null>(null);

  const filteredReports = useMemo(() => {
    if (statusFilter === "all") {
      return reports;
    }

    return reports.filter((report) => report.status === statusFilter);
  }, [reports, statusFilter]);

  async function loadReports() {
    setLoading(true);

    try {
      const data = await getAdminReports();
      setReports(data);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "加载举报列表失败。";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadReports();
  }, []);

  async function handleUpdateStatus(report: AdminReportItem, status: ReportStatus) {
    setWorkingId(report.id);

    try {
      await updateReportStatus(report.id, status);
      toast.success(`已标记为：${STATUS_LABEL[status]}`);
      await loadReports();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "更新举报状态失败。";
      toast.error(message);
    } finally {
      setWorkingId(null);
    }
  }

  async function handleHideTarget(report: AdminReportItem) {
    setWorkingId(report.id);

    try {
      if (report.target_type === "note") {
        await hideReportedNote(report.target_id);
        await updateReportStatus(report.id, "resolved");
        toast.success("已隐藏该笔记，并标记举报已处理。");
      } else if (report.target_type === "comment") {
        await hideReportedComment(report.target_id);
        await updateReportStatus(report.id, "resolved");
        toast.success("已隐藏该评论，并标记举报已处理。");
      } else {
        toast.message("用户举报暂不支持一键隐藏，请人工核查。");
      }

      await loadReports();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "隐藏举报对象失败。";
      toast.error(message);
    } finally {
      setWorkingId(null);
    }
  }

  async function handleRestoreTarget(report: AdminReportItem) {
    setWorkingId(report.id);

    try {
      if (report.target_type === "note") {
        await restoreReportedNote(report.target_id);
        toast.success("已恢复该笔记。");
      } else if (report.target_type === "comment") {
        await restoreReportedComment(report.target_id);
        toast.success("已恢复该评论。");
      } else {
        toast.message("用户举报暂不支持恢复操作。");
      }

      await loadReports();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "恢复举报对象失败。";
      toast.error(message);
    } finally {
      setWorkingId(null);
    }
  }

  return (
    <main className="min-h-screen p-4 md:p-6">
      <div className="page-shell space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <Link
              href="/workspace"
              className="inline-flex h-10 items-center gap-2 rounded-full border border-border-soft bg-white/70 px-4 text-sm font-semibold text-dai transition hover:bg-white"
            >
              <ArrowLeft className="h-4 w-4" />
              返回工作台
            </Link>

            <div className="mt-6">
              <p className="text-sm font-semibold text-cinnabar">管理后台</p>
              <h1 className="font-title mt-2 text-4xl font-black text-ink">
                举报审核
              </h1>
              <p className="mt-3 text-sm leading-loose text-dai/65">
                查看用户提交的举报，处理违规笔记与评论。
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => loadReports()}
            disabled={loading}
            className="seal-button h-11 gap-2 px-5 text-sm font-semibold"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ShieldAlert className="h-4 w-4" />
            )}
            刷新列表
          </button>
        </div>

        <section className="paper-card p-5">
          <div className="flex flex-wrap gap-2">
            {STATUS_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setStatusFilter(option.value)}
                className={[
                  "h-10 rounded-full px-4 text-sm font-semibold transition",
                  statusFilter === option.value
                    ? "bg-cinnabar text-white"
                    : "border border-border-soft bg-white/70 text-dai hover:bg-white"
                ].join(" ")}
              >
                {option.label}
              </button>
            ))}
          </div>
        </section>

        {loading ? (
          <div className="paper-card p-10 text-center text-sm text-dai/60">
            正在加载举报列表...
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="paper-card p-10 text-center">
            <p className="text-base font-semibold text-ink">暂无举报记录</p>
            <p className="mt-2 text-sm text-dai/50">
              当前筛选条件下没有需要处理的举报。
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReports.map((report) => (
              <AdminReportCard
                key={report.id}
                report={report}
                working={workingId === report.id}
                onUpdateStatus={handleUpdateStatus}
                onHideTarget={handleHideTarget}
                onRestoreTarget={handleRestoreTarget}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function AdminReportCard({
  report,
  working,
  onUpdateStatus,
  onHideTarget,
  onRestoreTarget
}: {
  report: AdminReportItem;
  working: boolean;
  onUpdateStatus: (report: AdminReportItem, status: ReportStatus) => void;
  onHideTarget: (report: AdminReportItem) => void;
  onRestoreTarget: (report: AdminReportItem) => void;
}) {
  const reporterName =
    report.reporter?.display_name || report.reporter?.username || "未知用户";

  const targetLabel = getTargetTypeLabel(report.target_type);
  const targetHref = getTargetHref(report);
  const targetTitle = getTargetTitle(report);
  const targetStatus = getTargetModerationStatus(report);
  const canModerateTarget =
    report.target_type === "note" || report.target_type === "comment";

  return (
    <article className="paper-card p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-cinnabar-soft px-3 py-1 text-xs font-semibold text-cinnabar">
              {STATUS_LABEL[report.status]}
            </span>

            <span className="rounded-full bg-shiqing-soft px-3 py-1 text-xs font-semibold text-shiqing-dark">
              {targetLabel}
            </span>

            {targetStatus && (
              <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-dai/55">
                内容状态：{targetStatus === "hidden" ? "已隐藏" : "正常展示"}
              </span>
            )}
          </div>

          <h2 className="font-title mt-4 text-2xl font-black text-ink">
            {REASON_LABEL[report.reason] ?? report.reason}
          </h2>

          <p className="mt-2 text-sm text-dai/55">
            举报人：{reporterName} · {formatDateTime(report.created_at)}
          </p>

          {report.detail && (
            <p className="mt-4 rounded-2xl border border-border-soft bg-white/60 p-4 text-sm leading-7 text-dai/75">
              {report.detail}
            </p>
          )}

          <div className="mt-5 rounded-2xl border border-border-soft bg-white/45 p-4">
            <p className="text-xs font-semibold text-dai/45">被举报内容</p>

            <p className="mt-2 line-clamp-3 text-sm leading-7 text-dai/75">
              {targetTitle}
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {targetHref ? (
                <Link
                  href={targetHref}
                  className="inline-flex h-9 items-center rounded-full border border-border-soft bg-white/70 px-4 text-xs font-semibold text-dai transition hover:bg-white hover:text-cinnabar"
                >
                  查看对象
                </Link>
              ) : (
                <span className="inline-flex h-9 items-center rounded-full border border-border-soft bg-white/70 px-4 text-xs font-semibold text-dai/40">
                  对象不存在或已删除
                </span>
              )}

              <span className="inline-flex h-9 items-center rounded-full border border-border-soft bg-white/70 px-4 text-xs font-semibold text-dai/40">
                ID: {report.target_id}
              </span>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-2 lg:w-44">
          <button
            type="button"
            disabled={working}
            onClick={() => onUpdateStatus(report, "reviewing")}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-border-soft bg-white/70 px-4 text-sm font-semibold text-dai transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {working ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            标记处理中
          </button>

          <button
            type="button"
            disabled={working}
            onClick={() => onUpdateStatus(report, "resolved")}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <CheckCircle2 className="h-4 w-4" />
            标记已处理
          </button>

          <button
            type="button"
            disabled={working}
            onClick={() => onUpdateStatus(report, "rejected")}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-stone-200 bg-white/70 px-4 text-sm font-semibold text-stone-500 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <XCircle className="h-4 w-4" />
            驳回举报
          </button>

          {canModerateTarget && targetStatus !== "hidden" && (
            <button
              type="button"
              disabled={working}
              onClick={() => onHideTarget(report)}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-cinnabar/20 bg-cinnabar-soft px-4 text-sm font-semibold text-cinnabar transition hover:bg-cinnabar-soft/80 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <EyeOff className="h-4 w-4" />
              隐藏内容
            </button>
          )}

          {canModerateTarget && targetStatus === "hidden" && (
            <button
              type="button"
              disabled={working}
              onClick={() => onRestoreTarget(report)}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-shiqing-dark/15 bg-shiqing-soft px-4 text-sm font-semibold text-shiqing-dark transition hover:bg-shiqing-soft/80 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RotateCcw className="h-4 w-4" />
              恢复内容
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

function getTargetHref(report: AdminReportItem) {
  if (report.target_type === "note" && report.target_note) {
    return `/community/notes/${report.target_note.id}`;
  }

  if (report.target_type === "comment" && report.target_comment) {
    return `/community/notes/${report.target_comment.note_id}`;
  }

  if (report.target_type === "user" && report.target_user) {
    return `/profile/${report.target_user.id}`;
  }

  return null;
}

function getTargetTitle(report: AdminReportItem) {
  if (report.target_type === "note") {
    return report.target_note?.title || "该笔记不存在或已删除。";
  }

  if (report.target_type === "comment") {
    return report.target_comment?.content || "该评论不存在或已删除。";
  }

  if (report.target_type === "user") {
    return (
      report.target_user?.display_name ||
      report.target_user?.username ||
      "该用户不存在或已删除。"
    );
  }

  return "未知对象";
}

function getTargetModerationStatus(report: AdminReportItem) {
  if (report.target_note) {
    return report.target_note.visibility === "public" ? "approved" : "hidden";
  }

  if (report.target_comment) {
    return report.target_comment.is_deleted ? "hidden" : "approved";
  }

  return null;
}

function formatDateTime(value?: string | null) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}