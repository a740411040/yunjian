import { createClient } from "@/lib/supabase/server";
import type { FollowSummary } from "@/types/follow";

async function countByColumn(
  column: "follower_id" | "following_id",
  userId: string
) {
  const supabase = await createClient();
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

export async function getFollowSummaryServer(
  targetUserId: string
): Promise<FollowSummary> {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const currentUserId = user?.id ?? null;

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
