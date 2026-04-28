// src/lib/likes.ts

import { createClient } from "@/lib/supabase/browser";
import { createNotification } from "@/lib/notifications";

export type NoteLikeState = {
  count: number;
  hasLiked: boolean;
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

export async function getNoteLikeState(noteId: string): Promise<NoteLikeState> {
  const supabase = createClient();
  const userId = await getCurrentUserId();

  const { count, error: countError } = await supabase
    .from("note_likes")
    .select("id", {
      count: "exact",
      head: true
    })
    .eq("note_id", noteId);

  if (countError) {
    throw countError;
  }

  const { data: likedRow, error: likedError } = await supabase
    .from("note_likes")
    .select("id")
    .eq("note_id", noteId)
    .eq("user_id", userId)
    .maybeSingle();

  if (likedError) {
    throw likedError;
  }

  return {
    count: count ?? 0,
    hasLiked: Boolean(likedRow)
  };
}

async function notifyNoteLiked(noteId: string, actorId: string) {
  const supabase = createClient();

  const { data: noteData, error } = await supabase
    .from("notes")
    .select("id,user_id,title")
    .eq("id", noteId)
    .maybeSingle();

  if (error) {
    console.error("[notifyNoteLiked:getNote]", error);
    return;
  }

  const note = noteData as NoteForNotification | null;

  if (!note || note.user_id === actorId) {
    return;
  }

  try {
    await createNotification({
      userId: note.user_id,
      type: "note_liked",
      noteId: note.id,
      title: "有人喜欢了你的云笺",
      content: note.title || "未题",
      href: `/community/notes/${note.id}`
    });
  } catch (error) {
    console.error("[notifyNoteLiked:createNotification]", error);
  }
}

export async function likeNote(noteId: string) {
  const supabase = createClient();
  const userId = await getCurrentUserId();

  const { error } = await supabase.from("note_likes").insert({
    note_id: noteId,
    user_id: userId
  });

  if (error) {
    if (error.code === "23505") {
      return;
    }

    throw error;
  }

  await notifyNoteLiked(noteId, userId);
}

export async function unlikeNote(noteId: string) {
  const supabase = createClient();
  const userId = await getCurrentUserId();

  const { error } = await supabase
    .from("note_likes")
    .delete()
    .eq("note_id", noteId)
    .eq("user_id", userId);

  if (error) {
    throw error;
  }
}

export async function toggleNoteLike(noteId: string, currentlyLiked: boolean) {
  if (currentlyLiked) {
    await unlikeNote(noteId);
  } else {
    await likeNote(noteId);
  }

  return await getNoteLikeState(noteId);
}