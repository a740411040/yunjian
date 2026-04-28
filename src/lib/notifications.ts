// src/lib/notifications.ts

import { createClient } from "@/lib/supabase/browser";
import type {
  CreateNotificationPayload,
  Notification,
  NotificationWithActor
} from "@/types/notification";
import type { Profile } from "@/types/profile";

function uniqueIds(values: Array<string | null | undefined>) {
  return Array.from(new Set(values.filter(Boolean))) as string[];
}

export async function createNotification(
  payload: CreateNotificationPayload
): Promise<Notification | null> {
  const supabase = createClient() as any;

  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!user) {
    throw new Error("请先登录。");
  }

  if (payload.userId === user.id) {
    return null;
  }

  const { data, error } = await supabase
    .from("notifications")
    .insert({
      user_id: payload.userId,
      actor_id: user.id,
      type: payload.type,
      note_id: payload.noteId ?? null,
      comment_id: payload.commentId ?? null,
      report_id: payload.reportId ?? null,
      title: payload.title,
      content: payload.content?.trim() || null,
      href: payload.href ?? null,
      is_read: false
    })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data as Notification;
}

export async function getNotifications(): Promise<NotificationWithActor[]> {
 const supabase = createClient() as any;

  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!user) {
    return [];
  }

  const { data: rows, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(80);

  if (error) {
    throw error;
  }

  const notifications = (rows ?? []) as Notification[];

  if (notifications.length === 0) {
    return [];
  }

  const actorIds = uniqueIds(notifications.map((item) => item.actor_id));

  if (actorIds.length === 0) {
    return notifications.map((item) => ({
      ...item,
      actor: null
    }));
  }

  const { data: profilesData, error: profilesError } = await supabase
    .from("profiles")
    .select("*")
    .in("id", actorIds);

  if (profilesError) {
    throw profilesError;
  }

  const profileMap = new Map<string, Profile>();

  for (const profile of (profilesData ?? []) as Profile[]) {
    profileMap.set(profile.id, profile);
  }

  return notifications.map((item) => ({
    ...item,
    actor: item.actor_id ? profileMap.get(item.actor_id) ?? null : null
  }));
}

export async function getUnreadNotificationCount(): Promise<number> {
  const supabase = createClient() as any;

  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!user) {
    return 0;
  }

  const { count, error } = await supabase
    .from("notifications")
    .select("id", {
      count: "exact",
      head: true
    })
    .eq("user_id", user.id)
    .eq("is_read", false);

  if (error) {
    throw error;
  }

  return count ?? 0;
}

export async function markNotificationAsRead(notificationId: string) {
  const supabase = createClient() as any;

  const { error } = await supabase
    .from("notifications")
    .update({
      is_read: true
    })
    .eq("id", notificationId);

  if (error) {
    throw error;
  }
}

export async function markAllNotificationsAsRead() {
  const supabase = createClient() as any;

  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!user) {
    return;
  }

  const { error } = await supabase
    .from("notifications")
    .update({
      is_read: true
    })
    .eq("user_id", user.id)
    .eq("is_read", false);

  if (error) {
    throw error;
  }
}