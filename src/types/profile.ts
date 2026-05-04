import type { Database } from "./database";

export type ProfileRole = "user" | "admin";

export type Profile = {
  id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  website: string | null;
  location: string | null;
  community_enabled?: boolean | null;
  allow_comments?: boolean | null;
  show_liked_notes?: boolean | null;
  default_note_visibility?: string | null;
  role?: ProfileRole | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type ProfilePayload = {
  username?: string | null;
  display_name?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
  website?: string | null;
  location?: string | null;
  community_enabled?: boolean;
  allow_comments?: boolean;
  show_liked_notes?: boolean;
  default_note_visibility?: "private" | "public";
};