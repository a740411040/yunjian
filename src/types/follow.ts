export type FollowSummary = {
  targetUserId: string;
  currentUserId: string | null;
  followerCount: number;
  followingCount: number;
  isFollowing: boolean;
  isSelf: boolean;
};
