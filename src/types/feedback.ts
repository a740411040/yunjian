export type FeedbackCategory =
  | "bug"
  | "idea"
  | "theme"
  | "community"
  | "other";

export type FeedbackStatus =
  | "pending"
  | "reviewing"
  | "planned"
  | "resolved";

export type UserFeedback = {
  id: string;
  user_id: string;
  category: FeedbackCategory;
  title: string;
  content: string;
  contact: string | null;
  status: FeedbackStatus;
  created_at: string;
  updated_at: string;
};

export type FeedbackPayload = {
  category: FeedbackCategory;
  title: string;
  content: string;
  contact?: string | null;
};
