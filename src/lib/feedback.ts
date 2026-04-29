import { createClient } from "@/lib/supabase/browser";
import type {
  FeedbackPayload,
  UserFeedback
} from "@/types/feedback";

async function getCurrentUserId() {
  const supabase = createClient();
  const {
    data: { user },
    error
  } = await supabase.auth.getUser();

  if (error) {
    throw error;
  }

  if (!user) {
    throw new Error("请先登录后再提交反馈。");
  }

  return user.id;
}

export async function submitFeedback(payload: FeedbackPayload) {
  const supabase = createClient();
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from("user_feedback")
    .insert({
      user_id: userId,
      category: payload.category,
      title: payload.title.trim(),
      content: payload.content.trim(),
      contact: payload.contact?.trim() || null
    })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data as UserFeedback;
}

export async function getMyFeedbackList() {
  const supabase = createClient();
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from("user_feedback")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    throw error;
  }

  return (data ?? []) as UserFeedback[];
}
