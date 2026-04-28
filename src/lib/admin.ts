// src/lib/admin.ts

import { createClient } from "@/lib/supabase/browser";
import { createNotification } from "@/lib/notifications";
import type { Profile } from "@/types/profile";
import type { Report, ReportStatus, ReportTargetType } from "@/types/report";

export type AdminReportTargetNote = {
  id: string;
  user_id: string;
  title: string | null;
  content: string | null;
  moderation_status: string | null;
};

export type AdminReportTargetComment = {
  id: string;
  note_id: string;
  user_id: string;
  content: string | null;
  moderation_status: string | null;
};

export type AdminReportItem = Report & {
  reporter: Profile | null;
  target_note: AdminReportTargetNote | null;
  target_comment: AdminReportTargetComment | null;
  target_user: Profile | null;
};

function uniq(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

export async function getAdminReports(): Promise<AdminReportItem[]> {
  const supabase = createClient();

  const { data: reportsData, error: reportsError } = await supabase
    .from("reports")
    .select("*")
    .order("created_at", { ascending: false });

  if (reportsError) {
    throw reportsError;
  }

  const reports = (reportsData ?? []) as Report[];

  if (reports.length === 0) {
    return [];
  }

  const reporterIds = uniq(reports.map((report) => report.reporter_id));

  const noteIds = uniq(
    reports
      .filter((report) => report.target_type === "note")
      .map((report) => report.target_id)
  );

  const commentIds = uniq(
    reports
      .filter((report) => report.target_type === "comment")
      .map((report) => report.target_id)
  );

  const userTargetIds = uniq(
    reports
      .filter((report) => report.target_type === "user")
      .map((report) => report.target_id)
  );

  const [
    reportersResult,
    notesResult,
    commentsResult,
    targetUsersResult
  ] = await Promise.all([
    reporterIds.length > 0
      ? supabase.from("profiles").select("*").in("id", reporterIds)
      : Promise.resolve({ data: [], error: null }),

    noteIds.length > 0
      ? supabase
          .from("notes")
          .select("id,user_id,title,content,moderation_status")
          .in("id", noteIds)
      : Promise.resolve({ data: [], error: null }),

    commentIds.length > 0
      ? supabase
          .from("note_comments")
          .select("id,note_id,user_id,content,moderation_status")
          .in("id", commentIds)
      : Promise.resolve({ data: [], error: null }),

    userTargetIds.length > 0
      ? supabase.from("profiles").select("*").in("id", userTargetIds)
      : Promise.resolve({ data: [], error: null })
  ]);

  if (reportersResult.error) throw reportersResult.error;
  if (notesResult.error) throw notesResult.error;
  if (commentsResult.error) throw commentsResult.error;
  if (targetUsersResult.error) throw targetUsersResult.error;

  const reporterMap = new Map<string, Profile>();

  for (const profile of (reportersResult.data ?? []) as Profile[]) {
    reporterMap.set(profile.id, profile);
  }

  const noteMap = new Map<string, AdminReportTargetNote>();

  for (const note of (notesResult.data ?? []) as AdminReportTargetNote[]) {
    noteMap.set(note.id, note);
  }

  const commentMap = new Map<string, AdminReportTargetComment>();

  for (const comment of (commentsResult.data ??
    []) as AdminReportTargetComment[]) {
    commentMap.set(comment.id, comment);
  }

  const targetUserMap = new Map<string, Profile>();

  for (const profile of (targetUsersResult.data ?? []) as Profile[]) {
    targetUserMap.set(profile.id, profile);
  }

  return reports.map((report) => ({
    ...report,
    reporter: reporterMap.get(report.reporter_id) ?? null,
    target_note:
      report.target_type === "note"
        ? noteMap.get(report.target_id) ?? null
        : null,
    target_comment:
      report.target_type === "comment"
        ? commentMap.get(report.target_id) ?? null
        : null,
    target_user:
      report.target_type === "user"
        ? targetUserMap.get(report.target_id) ?? null
        : null
  }));
}

async function notifyReportStatusChanged(report: Report, status: ReportStatus) {
  if (status !== "resolved" && status !== "rejected") {
    return;
  }

  const targetLabel = getTargetTypeLabel(report.target_type);

  const title =
    status === "resolved" ? "你的举报已处理" : "你的举报已驳回";

  const content =
    status === "resolved"
      ? `你提交的${targetLabel}举报已由管理员处理。`
      : `你提交的${targetLabel}举报经审核后未被采纳。`;

  try {
    await createNotification({
      userId: report.reporter_id,
      type: status === "resolved" ? "report_resolved" : "report_rejected",
      reportId: report.id,
      title,
      content,
      href: "/notifications"
    });
  } catch (error) {
    console.error("[notifyReportStatusChanged]", error);
  }
}

export async function updateReportStatus(
  reportId: string,
  status: ReportStatus
) {
  const supabase = createClient();

  const { data: oldReportData, error: oldReportError } = await supabase
    .from("reports")
    .select("*")
    .eq("id", reportId)
    .maybeSingle();

  if (oldReportError) {
    throw oldReportError;
  }

  const oldReport = oldReportData as Report | null;

  const { data, error } = await supabase
    .from("reports")
    .update({
      status,
      updated_at: new Date().toISOString()
    })
    .eq("id", reportId)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  const updatedReport = data as Report;

  if (oldReport?.status !== status) {
    await notifyReportStatusChanged(updatedReport, status);
  }

  return updatedReport;
}

export async function hideReportedNote(noteId: string) {
  const supabase = createClient();

  const { error } = await supabase
    .from("notes")
    .update({
      moderation_status: "hidden",
      updated_at: new Date().toISOString()
    })
    .eq("id", noteId);

  if (error) {
    throw error;
  }
}

export async function restoreReportedNote(noteId: string) {
  const supabase = createClient();

  const { error } = await supabase
    .from("notes")
    .update({
      moderation_status: "approved",
      updated_at: new Date().toISOString()
    })
    .eq("id", noteId);

  if (error) {
    throw error;
  }
}

export async function hideReportedComment(commentId: string) {
  const supabase = createClient();

  const { error } = await supabase
    .from("note_comments")
    .update({
      moderation_status: "hidden",
      updated_at: new Date().toISOString()
    })
    .eq("id", commentId);

  if (error) {
    throw error;
  }
}

export async function restoreReportedComment(commentId: string) {
  const supabase = createClient();

  const { error } = await supabase
    .from("note_comments")
    .update({
      moderation_status: "approved",
      updated_at: new Date().toISOString()
    })
    .eq("id", commentId);

  if (error) {
    throw error;
  }
}

export function getTargetTypeLabel(type: ReportTargetType) {
  if (type === "note") return "笔记";
  if (type === "comment") return "评论";
  return "用户";
}