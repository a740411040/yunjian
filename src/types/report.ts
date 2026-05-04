// src/types/report.ts

export type ReportTargetType = "note" | "comment" | "user";

export type ReportStatus = "pending" | "reviewing" | "resolved" | "rejected";

export type ReportReason =
  | "spam"
  | "harassment"
  | "inappropriate"
  | "copyright"
  | "misinformation"
  | "other";

export type Report = {
  id: string;
  reporter_id: string;
  target_type: ReportTargetType;
  target_id: string;
  reason: ReportReason | string;
  detail: string | null;
  status: ReportStatus;
  created_at: string;
  updated_at: string;
};

export type CreateReportPayload = {
  targetType: ReportTargetType;
  targetId: string;
  reason: ReportReason;
  detail?: string;
};