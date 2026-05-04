import { createClient } from "@/lib/supabase/browser";
import type { CommunityComment } from "@/types/community";
import type { Profile } from "@/types/profile";

export async function getCurrentUserIdForComments() {
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

export async function getComments(noteId: string) {
  const supabase = createClient();

  const { data: commentsData, error: commentsError } = await supabase
    .from("note_comments")
    .select("*")
    .eq("note_id", noteId)
    .eq("is_deleted", false)
    .order("created_at", { ascending: true });

  if (commentsError) {
    throw commentsError;
  }

  const comments = commentsData ?? [];

  if (comments.length === 0) {
    return [];
  }

  const userIds = Array.from(new Set(comments.map((comment) => comment.user_id)));

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

  return comments.map((comment) => ({
    ...comment,
    profiles: profileMap.get(comment.user_id) ?? null
  })) as CommunityComment[];
}

export async function createComment(
  noteId: string,
  content: string,
  parentId?: string | null
) {
  const supabase = createClient();
  const userId = await getCurrentUserIdForComments();

  const cleanContent = content.trim();

  if (!cleanContent) {
    throw new Error("评论内容不能为空。");
  }

  if (cleanContent.length > 500) {
    throw new Error("评论最多 500 字。");
  }

  const { error } = await supabase.from("note_comments").insert({
    note_id: noteId,
    user_id: userId,
    parent_id: parentId ?? null,
    content: cleanContent
  });

  if (error) {
    throw error;
  }
}

export async function deleteMyComment(commentId: string) {
  const supabase = createClient();

  const { error } = await supabase
    .from("note_comments")
    .update({
      is_deleted: true,
      content: "该评论已删除"
    })
    .eq("id", commentId);

  if (error) {
    throw error;
  }
}