import { createClient } from "@/lib/supabase/browser";
import type { Profile, ProfilePayload } from "@/types/profile";

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
    default_note_visibility: "private" as const
  };
}

export async function getCurrentProfileClient() {
  const supabase = createClient();

  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (data) {
    return data as Profile;
  }

  const { data: created, error: createError } = await supabase
    .from("profiles")
    .insert(createDefaultProfile(user.id))
    .select("*")
    .single();

  if (createError) {
    throw createError;
  }

  return created as Profile;
}

export async function updateCurrentProfile(payload: ProfilePayload) {
  const supabase = createClient();

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

  const { data, error } = await supabase
    .from("profiles")
    .update(payload)
    .eq("id", user.id)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data as Profile;
}