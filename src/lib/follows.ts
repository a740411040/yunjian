import { createNotification } from "@/lib/notifications";
import { createClient } from "@/lib/supabase/browser";
import type { FollowSummary } from "@/types/follow";

async function getCurrentUserId() {
  const supabase = createClient();
  const {
    data: { user },
    error
  } = await supabase.auth.getUser();

  if (error) {
    throw error;
  }

  return user?.id ?? null;
}

async function countByColumn(
  column: "follower_id" | "following_id",
  userId: string
) {
  const supabase = createClient();
  const { count, error } = await supabase
    .from("user_follows")
    .select("id", {
      count: "exact",
      head: true
    })
    .eq(column, userId);

  if (error) {
    throw error;
  }

  return count ?? 0;
}

export async function getFollowedUserIds() {
  const supabase = createClient();
  const currentUserId = await getCurrentUserId();

  if (!currentUserId) {
    return [];
  }

  const { data, error } = await supabase
    .from("user_follows")
    .select("following_id")
    .eq("follower_id", currentUserId);

  if (error) {
    throw error;
  }

  return (data ?? []).map((item) => item.following_id as string);
}

export async function getFollowSummary(
  targetUserId: string
): Promise<FollowSummary> {
  const supabase = createClient();
  const currentUserId = await getCurrentUserId();

  const [followerCount, followingCount, followRow] = await Promise.all([
    countByColumn("following_id", targetUserId),
    countByColumn("follower_id", targetUserId),
    currentUserId
      ? supabase
          .from("user_follows")
          .select("id")
          .eq("follower_id", currentUserId)
          .eq("following_id", targetUserId)
          .maybeSingle()
      : Promise.resolve({ data: null, error: null })
  ]);

  if (followRow.error) {
    throw followRow.error;
  }

  return {
    targetUserId,
    currentUserId,
    followerCount,
    followingCount,
    isFollowing: Boolean(followRow.data),
    isSelf: currentUserId === targetUserId
  };
}

export async function toggleFollowUser(
  targetUserId: string,
  currentlyFollowing: boolean
): Promise<FollowSummary> {
  const supabase = createClient();
  const currentUserId = await getCurrentUserId();

  if (!currentUserId) {
    throw new Error("请先登录后再关注作者。");
  }

  if (currentUserId === targetUserId) {
    throw new Error("不能关注自己。");
  }

  if (currentlyFollowing) {
    const { error } = await supabase
      .from("user_follows")
      .delete()
      .eq("follower_id", currentUserId)
      .eq("following_id", targetUserId);

    if (error) {
      throw error;
    }
  } else {
    const { error } = await supabase.from("user_follows").insert({
      follower_id: currentUserId,
      following_id: targetUserId
    });

    if (error) {
      throw error;
    }

    await createNotification({
      userId: targetUserId,
      type: "user_followed",
      title: "有人将你收入了关注清单",
      content: "对方希望更快读到你接下来的公开云笺。",
      href: `/profile/${currentUserId}`
    });
  }

  return getFollowSummary(targetUserId);
}
