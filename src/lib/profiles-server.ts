// src/lib/profiles-server.ts

import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types/profile";

function createDefaultProfile(userId: string) {
  return {
    id: userId,
    username: `user_${userId.replaceAll("-", "").slice(0, 10)}`,
    display_name: "云笺用户",
    avatar_url: null,
    bio: "这个人还没有留下简介。",
    website: null,
    location: null,
    community_enabled: true,
    allow_comments: true,
    show_liked_notes: false,
    default_note_visibility: "private" as const,
    role: "user" as const
  };
}

export async function getCurrentProfileServer() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (error) throw error;

  if (data) {
    return data as Profile;
  }

  const { data: created, error: createError } = await supabase
    .from("profiles")
    .insert(createDefaultProfile(user.id))
    .select("*")
    .single();

  if (createError) {
    console.error("[getCurrentProfileServer] Create failed:", createError);
    throw createError;
  }

  return created as Profile;
}

export async function getPublicProfileById(
  userId: string
): Promise<Profile | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select(
      `
      id,
      username,
      display_name,
      avatar_url,
      bio,
      website,
      location,
      community_enabled,
      allow_comments,
      show_liked_notes,
      default_note_visibility,
      role,
      created_at,
      updated_at
    `
    )
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    console.error("[getPublicProfileById] Error:", error);
    return null;
  }

  return data as Profile | null;
}

export async function getProfileByIdServer(userId: string) {
  return getPublicProfileById(userId);
}