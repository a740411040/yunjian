// src/lib/community.ts

import { createClient } from "@/lib/supabase/browser";
import { getFollowedUserIds } from "@/lib/follows";
import { stripHtml } from "@/lib/utils";
import type { CommunityNote, CommunityNoteQuery } from "@/types/community";
import type { Note, PublishNotePayload } from "@/types/note";
import type { Profile } from "@/types/profile";

export async function publishNote(
  noteId: string,
  payload: PublishNotePayload
) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("notes")
    .update({
      visibility: "public",
      published_at: new Date().toISOString(),
      community_excerpt: payload.community_excerpt?.trim() || null,
      allow_comments: payload.allow_comments,
    })
    .eq("id", noteId)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data as Note;
}

export async function unpublishNote(noteId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("notes")
    .update({
      visibility: "private",
      published_at: null
    })
    .eq("id", noteId)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data as Note;
}

export async function updatePublishedNoteSettings(
  noteId: string,
  payload: PublishNotePayload
) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("notes")
    .update({
      community_excerpt: payload.community_excerpt?.trim() || null,
      allow_comments: payload.allow_comments
    })
    .eq("id", noteId)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data as Note;
}

function countByNoteId(rows: Array<{ note_id: string }> | null | undefined) {
  const map = new Map<string, number>();

  for (const row of rows ?? []) {
    map.set(row.note_id, (map.get(row.note_id) ?? 0) + 1);
  }

  return map;
}

function idSet(rows: Array<{ note_id: string }> | null | undefined) {
  return new Set((rows ?? []).map((row) => row.note_id));
}

export async function getCommunityNotes(
  params: CommunityNoteQuery = {}
): Promise<CommunityNote[]> {
  const supabase = createClient();

  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError) {
    console.error("[getCommunityNotes:getUser]", userError);
  }

  const currentUserId = user?.id ?? null;

  let notesRequest = supabase
    .from("notes")
    .select("*")
    .eq("visibility", "public")
    .order("published_at", { ascending: false });

  if (params.scope === "following") {
    const followedUserIds = await getFollowedUserIds();

    if (followedUserIds.length === 0) {
      return [];
    }

    notesRequest = notesRequest.in("user_id", followedUserIds);
  }

  if (params.tag) {
    notesRequest = notesRequest.contains("tags", [params.tag]);
  }

  const { data: notesData, error: notesError } = await notesRequest;

  if (notesError) {
    throw notesError;
  }

  const notes = (notesData ?? []) as Note[];

  if (notes.length === 0) {
    return [];
  }

  const userIds = Array.from(new Set(notes.map((note) => note.user_id)));
  const noteIds = notes.map((note) => note.id);

  const { data: profilesData, error: profilesError } = await supabase
    .from("profiles")
    .select("*")
    .in("id", userIds);

  if (profilesError) {
    throw profilesError;
  }

  const profileMap = new Map<string, Profile>();

  for (const profile of (profilesData ?? []) as Profile[]) {
    profileMap.set(profile.id, profile);
  }

  const [
    likesResult,
    favoritesResult,
    commentsResult,
    myLikesResult,
    myFavoritesResult
  ] = await Promise.all([
    supabase.from("note_likes").select("note_id").in("note_id", noteIds),

    supabase.from("note_favorites").select("note_id").in("note_id", noteIds),

    supabase
      .from("note_comments")
      .select("note_id")
      .eq("is_deleted", false)
      .in("note_id", noteIds),

    currentUserId
      ? supabase
          .from("note_likes")
          .select("note_id")
          .eq("user_id", currentUserId)
          .in("note_id", noteIds)
      : Promise.resolve({
          data: [],
          error: null
        }),

    currentUserId
      ? supabase
          .from("note_favorites")
          .select("note_id")
          .eq("user_id", currentUserId)
          .in("note_id", noteIds)
      : Promise.resolve({
          data: [],
          error: null
        })
  ]);

  if (likesResult.error) throw likesResult.error;
  if (favoritesResult.error) throw favoritesResult.error;
  if (commentsResult.error) throw commentsResult.error;
  if (myLikesResult.error) throw myLikesResult.error;
  if (myFavoritesResult.error) throw myFavoritesResult.error;

  const likeMap = countByNoteId(likesResult.data);
  const favoriteMap = countByNoteId(favoritesResult.data);
  const commentMap = countByNoteId(commentsResult.data);

  const myLikedNoteIds = idSet(myLikesResult.data);
  const myFavoritedNoteIds = idSet(myFavoritesResult.data);

  let communityNotes: CommunityNote[] = notes.map((note) => {
    return {
      ...note,
      profiles: profileMap.get(note.user_id) ?? null,
      like_count: likeMap.get(note.id) ?? 0,
      favorite_count: favoriteMap.get(note.id) ?? 0,
      comment_count: commentMap.get(note.id) ?? 0,
      has_liked: myLikedNoteIds.has(note.id),
      has_favorited: myFavoritedNoteIds.has(note.id)
    };
  });

  const keyword = params.query?.trim().toLowerCase();

  if (keyword) {
    communityNotes = communityNotes.filter((note) => {
      const plainContent = stripHtml(note.content).toLowerCase();
      const title = note.title.toLowerCase();
      const tags = note.tags.join(" ").toLowerCase();
      const excerpt = (note.community_excerpt ?? "").toLowerCase();
      const author = (
        note.profiles?.display_name ??
        note.profiles?.username ??
        ""
      ).toLowerCase();

      return (
        title.includes(keyword) ||
        plainContent.includes(keyword) ||
        tags.includes(keyword) ||
        excerpt.includes(keyword) ||
        author.includes(keyword)
      );
    });
  }

  if (params.sort === "popular") {
    communityNotes = [...communityNotes].sort((a, b) => {
      const scoreA = a.like_count * 3 + a.favorite_count * 2 + a.comment_count;
      const scoreB = b.like_count * 3 + b.favorite_count * 2 + b.comment_count;

      if (scoreA !== scoreB) {
        return scoreB - scoreA;
      }

      return (
        new Date(b.published_at ?? b.updated_at).getTime() -
        new Date(a.published_at ?? a.updated_at).getTime()
      );
    });
  }

  return communityNotes;
}

export function getCommunityNoteHref(noteId: string) {
  return `/community/notes/${noteId}`;
}
