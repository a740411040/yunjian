import type { Database } from "./database";

export type NoteVisibility = "private" | "public";

export type NoteModerationStatus = "approved" | "hidden";

export type Note = {
  id: string;
  user_id: string;
  title: string;
  content: string;
  tags: string[];
  is_pinned: boolean;
  created_at: string;
  updated_at: string;

  visibility?: "private" | "public";
  published_at?: string | null;
  community_excerpt?: string | null;
  cover_image_url?: string | null;
  allow_comments?: boolean;
  view_count?: number;
  share_count?: number;

};

export type NotePayload = {
  title: string;
  content: string;
  tags: string[];
};

export type PublishNotePayload = {
  community_excerpt?: string | null;
  allow_comments: boolean;
};