// src/lib/favorites.ts

import { createClient } from "@/lib/supabase/browser";
import { createNotification } from "@/lib/notifications";
import type { CommunityNote } from "@/types/community";
import type { Note } from "@/types/note";
import type { Profile } from "@/types/profile";

export type NoteFavoriteState = {
  count: number;
  hasFavorited: boolean;
};

type NoteForNotification = {
  id: string;
  user_id: string;
  title: string | null;
};

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
    throw new Error("请先登录。");
  }

  return user.id;
}

function countByNoteId(rows: Array<{ note_id: string }> | null | undefined) {
  const map = new Map<string, number>();

  for (const row of rows ?? []) {
    map.set(row.note_id, (map.get(row.note_id) ?? 0) + 1);
  }

  return map;
}

async function notifyNoteFavorited(noteId: string, actorId: string) {
  const supabase = createClient();

  const { data: noteData, error } = await supabase
    .from("notes")
    .select("id,user_id,title")
    .eq("id", noteId)
    .maybeSingle();

  if (error) {
    console.error("[notifyNoteFavorited:getNote]", error);
    return;
  }

  const note = noteData as NoteForNotification | null;

  if (!note || note.user_id === actorId) {
    return;
  }

  try {
    await createNotification({
      userId: note.user_id,
      type: "note_favorited",
      noteId: note.id,
      title: "有人收藏了你的云笺",
      content: note.title || "未题",
      href: `/community/notes/${note.id}`
    });
  } catch (error) {
    console.error("[notifyNoteFavorited:createNotification]", error);
  }
}

export async function getNoteFavoriteState(
  noteId: string
): Promise<NoteFavoriteState> {
  const supabase = createClient();
  const userId = await getCurrentUserId();

  const { count, error: countError } = await supabase
    .from("note_favorites")
    .select("id", {
      count: "exact",
      head: true
    })
    .eq("note_id", noteId);

  if (countError) {
    throw countError;
  }

  const { data: favoriteRow, error: favoriteError } = await supabase
    .from("note_favorites")
    .select("id")
    .eq("note_id", noteId)
    .eq("user_id", userId)
    .maybeSingle();

  if (favoriteError) {
    throw favoriteError;
  }

  return {
    count: count ?? 0,
    hasFavorited: Boolean(favoriteRow)
  };
}

export async function favoriteNote(noteId: string) {
  const supabase = createClient();
  const userId = await getCurrentUserId();

  const { error } = await supabase.from("note_favorites").insert({
    note_id: noteId,
    user_id: userId
  });

  if (error) {
    if (error.code === "23505") {
      return;
    }

    throw error;
  }

  await notifyNoteFavorited(noteId, userId);
}

export async function unfavoriteNote(noteId: string) {
  const supabase = createClient();
  const userId = await getCurrentUserId();

  const { error } = await supabase
    .from("note_favorites")
    .delete()
    .eq("note_id", noteId)
    .eq("user_id", userId);

  if (error) {
    throw error;
  }
}

export async function toggleNoteFavorite(
  noteId: string,
  currentlyFavorited: boolean
) {
  if (currentlyFavorited) {
    await unfavoriteNote(noteId);
  } else {
    await favoriteNote(noteId);
  }

  return await getNoteFavoriteState(noteId);
}

export async function getMyFavoriteNotes() {
  const supabase = createClient();
  const userId = await getCurrentUserId();

  const { data: favoriteRows, error: favoriteError } = await supabase
    .from("note_favorites")
    .select("note_id, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (favoriteError) {
    throw favoriteError;
  }

  const noteIds = (favoriteRows ?? []).map((row) => row.note_id);

  if (noteIds.length === 0) {
    return [];
  }

  const favoriteOrderMap = new Map<string, number>();
  noteIds.forEach((id, index) => favoriteOrderMap.set(id, index));

  const { data: notesData, error: notesError } = await supabase
    .from("notes")
    .select("*")
    .in("id", noteIds)
    .eq("visibility", "public")
    .eq("moderation_status", "approved");

  if (notesError) {
    throw notesError;
  }

  const notes = (notesData ?? []) as Note[];

  if (notes.length === 0) {
    return [];
  }

  const publicNoteIds = notes.map((note) => note.id);
  const userIds = Array.from(new Set(notes.map((note) => note.user_id)));

  const { data: profilesData } = await supabase
    .from("profiles")
    .select("*")
    .in("id", userIds);

  const profileMap = new Map<string, Profile>();

  for (const profile of (profilesData ?? []) as Profile[]) {
    profileMap.set(profile.id, profile);
  }

  const { data: likesData } = await supabase
    .from("note_likes")
    .select("note_id")
    .in("note_id", publicNoteIds);

  const { data: favoritesData } = await supabase
    .from("note_favorites")
    .select("note_id")
    .in("note_id", publicNoteIds);

  const { data: commentsData } = await supabase
    .from("note_comments")
    .select("note_id")
    .eq("is_deleted", false)
    .eq("moderation_status", "approved")
    .in("note_id", publicNoteIds);

  const { data: myLikesData } = await supabase
    .from("note_likes")
    .select("note_id")
    .eq("user_id", userId)
    .in("note_id", publicNoteIds);

  const likeMap = countByNoteId(likesData);
  const favoriteMap = countByNoteId(favoritesData);
  const commentMap = countByNoteId(commentsData);

  const myLikedNoteIds = new Set(
    (myLikesData ?? []).map((row) => row.note_id)
  );

  const communityNotes: CommunityNote[] = notes.map((note) => ({
    ...note,
    profiles: profileMap.get(note.user_id) ?? null,
    like_count: likeMap.get(note.id) ?? 0,
    favorite_count: favoriteMap.get(note.id) ?? 0,
    comment_count: commentMap.get(note.id) ?? 0,
    has_liked: myLikedNoteIds.has(note.id),
    has_favorited: true
  }));

  return communityNotes.sort((a, b) => {
    return (
      (favoriteOrderMap.get(a.id) ?? 999999) -
      (favoriteOrderMap.get(b.id) ?? 999999)
    );
  });
}