import type { Note } from "./note";
import type { Profile } from "./profile";

export type CommunitySort = "latest" | "popular";
export type CommunityScope = "all" | "following";

export type CommunityNote = Note & {
  profiles: Profile | null;
  like_count: number;
  favorite_count: number;
  comment_count: number;

  /**
   * 当前登录用户是否已经点赞。
   * 未登录时为 false。
   */
  has_liked: boolean;

  /**
   * 当前登录用户是否已经收藏。
   * 未登录时为 false。
   */
  has_favorited: boolean;
};

export type CommunityNoteQuery = {
  query?: string;
  tag?: string | null;
  sort?: CommunitySort;
  scope?: CommunityScope;
};

export type CommunityTopic = {
  name: string;
  count: number;
  sampleTitle: string | null;
};

export type CommunityComment = {
  id: string;
  note_id: string;
  user_id: string;
  parent_id: string | null;
  content: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  profiles: Profile | null;
};
