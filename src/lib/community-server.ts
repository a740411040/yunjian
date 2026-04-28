// src/lib/community-server.ts

import { createClient } from "@/lib/supabase/server";
import type { CommunityNote } from "@/types/community";
import type { Note } from "@/types/note";
import type { Profile } from "@/types/profile";

export type PublicProfileNote = Note & {
  like_count: number;
  favorite_count: number;
  comment_count: number;
};

function countRows(rows: unknown[] | null | undefined) {
  return rows?.length ?? 0;
}

function countByNoteId(rows: { note_id: string }[]) {
  return rows.reduce<Record<string, number>>((acc, row) => {
    acc[row.note_id] = (acc[row.note_id] ?? 0) + 1;
    return acc;
  }, {});
}

export async function getCommunityNoteByIdServer(
  noteId: string
): Promise<CommunityNote | null> {
  const supabase = await createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  const currentUserId = user?.id ?? null;

  const { data: noteData, error: noteError } = await supabase
    .from("notes")
    .select("*")
    .eq("id", noteId)
    .eq("visibility", "public")
    .eq("moderation_status", "approved")
    .maybeSingle();

  if (noteError) throw noteError;
  if (!noteData) return null;

  const note = noteData as Note;

  const [
    profileRes,
    likesRes,
    favsRes,
    commentsRes,
    myLikeRes,
    myFavoriteRes
  ] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", note.user_id).maybeSingle(),

    supabase.from("note_likes").select("id").eq("note_id", note.id),

    supabase.from("note_favorites").select("id").eq("note_id", note.id),

    supabase
      .from("note_comments")
      .select("id")
      .eq("note_id", note.id)
      .eq("is_deleted", false)
      .eq("moderation_status", "approved"),

    currentUserId
      ? supabase
          .from("note_likes")
          .select("id")
          .eq("note_id", note.id)
          .eq("user_id", currentUserId)
          .maybeSingle()
      : Promise.resolve({ data: null, error: null }),

    currentUserId
      ? supabase
          .from("note_favorites")
          .select("id")
          .eq("note_id", note.id)
          .eq("user_id", currentUserId)
          .maybeSingle()
      : Promise.resolve({ data: null, error: null })
  ]);

  return {
    ...note,
    profiles: (profileRes.data as Profile | null) ?? null,
    like_count: countRows(likesRes.data),
    favorite_count: countRows(favsRes.data),
    comment_count: countRows(commentsRes.data),
    has_liked: Boolean(myLikeRes.data),
    has_favorited: Boolean(myFavoriteRes.data)
  };
}

export async function getPublicNotesByUserId(
  userId: string
): Promise<PublicProfileNote[]> {
  const supabase = await createClient();

  const { data: notes, error } = await supabase
    .from("notes")
    .select(
      `
      id,
      user_id,
      title,
      content,
      tags,
      is_pinned,
      created_at,
      updated_at,
      visibility,
      published_at,
      community_excerpt,
      cover_image_url,
      allow_comments,
      view_count,
      share_count,
      moderation_status
    `
    )
    .eq("user_id", userId)
    .eq("visibility", "public")
    .eq("moderation_status", "approved")
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("[getPublicNotesByUserId]", error);
    return [];
  }

  const rawNotes = (notes ?? []) as Note[];

  if (rawNotes.length === 0) {
    return [];
  }

  const noteIds = rawNotes.map((note) => note.id);

  const [likesResult, favoritesResult, commentsResult] = await Promise.all([
    supabase.from("note_likes").select("note_id").in("note_id", noteIds),

    supabase.from("note_favorites").select("note_id").in("note_id", noteIds),

    supabase
      .from("note_comments")
      .select("note_id")
      .in("note_id", noteIds)
      .eq("is_deleted", false)
      .eq("moderation_status", "approved")
  ]);

  const likeMap = countByNoteId(likesResult.data ?? []);
  const favoriteMap = countByNoteId(favoritesResult.data ?? []);
  const commentMap = countByNoteId(commentsResult.data ?? []);

  return rawNotes.map((note) => ({
    ...note,
    like_count: likeMap[note.id] ?? 0,
    favorite_count: favoriteMap[note.id] ?? 0,
    comment_count: commentMap[note.id] ?? 0
  }));
}