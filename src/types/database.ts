export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      note_favorites: {
  Row: {
    id: string;
    note_id: string;
    user_id: string;
    created_at: string;
  };
  Insert: {
    id?: string;
    note_id: string;
    user_id: string;
    created_at?: string;
  };
  Update: {
    id?: string;
    note_id?: string;
    user_id?: string;
    created_at?: string;
  };
  Relationships: [];
};

note_comments: {
  Row: {
    id: string;
    note_id: string;
    user_id: string;
    parent_id: string | null;
    content: string;
    is_deleted: boolean;
    created_at: string;
    updated_at: string;
  };
  Insert: {
    id?: string;
    note_id: string;
    user_id: string;
    parent_id?: string | null;
    content: string;
    is_deleted?: boolean;
    created_at?: string;
    updated_at?: string;
  };
  Update: {
    id?: string;
    note_id?: string;
    user_id?: string;
    parent_id?: string | null;
    content?: string;
    is_deleted?: boolean;
    created_at?: string;
    updated_at?: string;
  };
  Relationships: [];
};
      note_likes: {
  Row: {
    id: string;
    note_id: string;
    user_id: string;
    created_at: string;
  };
  Insert: {
    id?: string;
    note_id: string;
    user_id: string;
    created_at?: string;
  };
  Update: {
    id?: string;
    note_id?: string;
    user_id?: string;
    created_at?: string;
  };
  Relationships: [
    {
      foreignKeyName: "note_likes_note_id_fkey";
      columns: ["note_id"];
      referencedRelation: "notes";
      referencedColumns: ["id"];
    },
    {
      foreignKeyName: "note_likes_user_id_fkey";
      columns: ["user_id"];
      referencedRelation: "users";
      referencedColumns: ["id"];
    }
  ];
};
      // 1. 用户信息表
      profiles: {
  Row: {
    id: string;
    username: string | null;
    display_name: string | null;
    avatar_url: string | null;
    bio: string | null;
    website: string | null;
    location: string | null;
    community_enabled: boolean;
    allow_comments: boolean;
    show_liked_notes: boolean;
    default_note_visibility: "private" | "public";
    created_at: string;
    updated_at: string;
  };
  Insert: {
    id: string;
    username?: string | null;
    display_name?: string | null;
    avatar_url?: string | null;
    bio?: string | null;
    website?: string | null;
    location?: string | null;
    community_enabled?: boolean;
    allow_comments?: boolean;
    show_liked_notes?: boolean;
    default_note_visibility?: "private" | "public";
    created_at?: string;
    updated_at?: string;
  };
  Update: {
    id?: string;
    username?: string | null;
    display_name?: string | null;
    avatar_url?: string | null;
    bio?: string | null;
    website?: string | null;
    location?: string | null;
    community_enabled?: boolean;
    allow_comments?: boolean;
    show_liked_notes?: boolean;
    default_note_visibility?: "private" | "public";
    created_at?: string;
    updated_at?: string;
  };
  Relationships: [
    {
      foreignKeyName: "profiles_id_fkey";
      columns: ["id"];
      referencedRelation: "users";
      referencedColumns: ["id"];
    }
  ];
};
      // 2. 更新后的笔记表
    notes: {
  Row: {
    id: string;
    user_id: string;
    title: string;
    content: string;
    tags: string[];
    is_pinned: boolean;

    visibility: "private" | "public";
    published_at: string | null;
    community_excerpt: string | null;
    cover_image_url: string | null;
    allow_comments: boolean;
    view_count: number;
    share_count: number;

    created_at: string;
    updated_at: string;
  };
  Insert: {
    id?: string;
    user_id: string;
    title?: string;
    content?: string;
    tags?: string[];
    is_pinned?: boolean;

    visibility?: "private" | "public";
    published_at?: string | null;
    community_excerpt?: string | null;
    cover_image_url?: string | null;
    allow_comments?: boolean;
    view_count?: number;
    share_count?: number;

    created_at?: string;
    updated_at?: string;
  };
  Update: {
    id?: string;
    user_id?: string;
    title?: string;
    content?: string;
    tags?: string[];
    is_pinned?: boolean;

    visibility?: "private" | "public";
    published_at?: string | null;
    community_excerpt?: string | null;
    cover_image_url?: string | null;
    allow_comments?: boolean;
    view_count?: number;
    share_count?: number;

    created_at?: string;
    updated_at?: string;
  };
  Relationships: [
    {
      foreignKeyName: "notes_user_id_fkey";
      columns: ["user_id"];
      referencedRelation: "users";
      referencedColumns: ["id"];
    }
  ];
};

      // 3. 笔记评论表
      note_comments: {
        Row: {
          id: string;
          note_id: string;
          user_id: string;
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          note_id: string;
          user_id: string;
          content: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          note_id?: string;
          user_id?: string;
          content?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "note_comments_note_id_fkey";
            columns: ["note_id"];
            referencedRelation: "notes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "note_comments_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };

      // 4. 笔记点赞表 (多对多中间表)
      note_likes: {
        Row: {
          note_id: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          note_id: string;
          user_id: string;
          created_at?: string;
        };
        Update: {
          note_id?: string;
          user_id?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "note_likes_note_id_fkey";
            columns: ["note_id"];
            referencedRelation: "notes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "note_likes_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };

      // 5. 笔记收藏表 (多对多中间表)
      note_favorites: {
        Row: {
          note_id: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          note_id: string;
          user_id: string;
          created_at?: string;
        };
        Update: {
          note_id?: string;
          user_id?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "note_favorites_note_id_fkey";
            columns: ["note_id"];
            referencedRelation: "notes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "note_favorites_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};