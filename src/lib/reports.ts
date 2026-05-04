// src/lib/reports.ts

import { createClient } from "@/lib/supabase/browser";
import type { CreateReportPayload, Report } from "@/types/report";

export async function createReport(payload: CreateReportPayload) {
  const supabase = createClient() as any;

  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!user) {
    throw new Error("请先登录后再提交举报。");
  }

  const { data, error } = await supabase
    .from("reports")
    .insert({
      reporter_id: user.id,
      target_type: payload.targetType,
      target_id: payload.targetId,
      reason: payload.reason,
      detail: payload.detail?.trim() || null,
      status: "pending"
    })
    .select("*")
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new Error("你已经举报过该内容，我们会尽快处理。");
    }

    throw error;
  }

  return data as Report;
}