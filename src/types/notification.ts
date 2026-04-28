// src/types/notification.ts

import type { Profile } from "@/types/profile";

export type NotificationType =
  | "note_liked"
  | "note_favorited"
  | "note_commented"
  | "report_resolved"
  | "report_rejected"
  | "system";

export type Notification = {
  id: string;
  user_id: string;
  actor_id: string | null;
  type: NotificationType;
  note_id: string | null;
  comment_id: string | null;
  report_id: string | null;
  title: string;
  content: string | null;
  href: string | null;
  is_read: boolean;
  created_at: string;
};

export type NotificationWithActor = Notification & {
  actor: Profile | null;
};

export type CreateNotificationPayload = {
  userId: string;
  type: NotificationType;
  title: string;
  content?: string | null;
  href?: string | null;
  noteId?: string | null;
  commentId?: string | null;
  reportId?: string | null;
};