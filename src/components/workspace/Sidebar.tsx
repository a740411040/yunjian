"use client";

import Link from "next/link";
import {
  Bookmark,
  LogOut,
  MessageSquareHeart,
  Plus,
  ScrollText,
  Settings,
  ShieldCheck,
  Tags,
  Users
} from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AppLogo } from "@/components/common/AppLogo";
import { PoeticCopy } from "@/components/common/PoeticCopy";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { getCurrentProfileClient } from "@/lib/profiles";
import { createClient } from "@/lib/supabase/browser";
import { cn } from "@/lib/utils";

type SidebarProps = {
  tags: string[];
  selectedTag: string | null;
  onSelectTag: (tag: string | null) => void;
  onNewNote: () => void;
};

export function Sidebar({
  tags,
  selectedTag,
  onSelectTag,
  onNewNote
}: SidebarProps) {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      try {
        const profile = await getCurrentProfileClient();

        if (!active) {
          return;
        }

        setIsAdmin(profile?.role === "admin");
      } catch {
        if (active) {
          setIsAdmin(false);
        }
      }
    }

    void loadProfile();

    return () => {
      active = false;
    };
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("已退出云笺。");
    router.push("/");
    router.refresh();
  }

  return (
    <aside className="glass-card flex min-h-[240px] flex-col rounded-[32px] p-5 lg:min-h-full">
      <div className="flex items-center justify-between">
        <AppLogo />

        <button
          type="button"
          onClick={handleSignOut}
          className="surface-button grid h-10 w-10 place-items-center rounded-full text-dai transition hover:text-cinnabar"
          aria-label="退出登录"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>

      <button
        type="button"
        onClick={onNewNote}
        className="seal-button mt-8 h-12 gap-2 text-sm font-semibold"
      >
        <Plus className="h-4 w-4" />
        写一条新云笺
      </button>

      <nav className="mt-8 space-y-2">
        <button
          type="button"
          onClick={() => onSelectTag(null)}
          className={cn(
            "flex h-11 w-full items-center gap-3 rounded-2xl px-4 text-sm font-medium transition",
            selectedTag === null
              ? "bg-cinnabar-soft text-cinnabar"
              : "text-dai/70 hover:bg-white/60 hover:text-dai"
          )}
        >
          <ScrollText className="h-4 w-4" />
          全部笔记
        </button>

        <Link
          href="/community"
          className="flex h-11 w-full items-center gap-3 rounded-2xl px-4 text-sm font-medium text-dai/70 transition hover:bg-white/60 hover:text-dai"
        >
          <Users className="h-4 w-4" />
          社区广场
        </Link>

        <NotificationBell />

        <Link
          href="/workspace/favorites"
          className="flex h-11 w-full items-center gap-3 rounded-2xl px-4 text-sm font-medium text-dai/70 transition hover:bg-white/60 hover:text-dai"
        >
          <Bookmark className="h-4 w-4" />
          我的收藏
        </Link>

        <Link
          href="/settings/profile"
          className="flex h-11 w-full items-center gap-3 rounded-2xl px-4 text-sm font-medium text-dai/70 transition hover:bg-white/60 hover:text-dai"
        >
          <Settings className="h-4 w-4" />
          个人设置
        </Link>

        <Link
          href="/feedback"
          className="flex h-11 w-full items-center gap-3 rounded-2xl px-4 text-sm font-medium text-dai/70 transition hover:bg-white/60 hover:text-dai"
        >
          <MessageSquareHeart className="h-4 w-4" />
          用户反馈
        </Link>

        {isAdmin && (
          <Link
            href="/admin/reports"
            className="flex h-11 w-full items-center gap-3 rounded-2xl px-4 text-sm font-medium text-cinnabar transition hover:bg-cinnabar-soft"
          >
            <ShieldCheck className="h-4 w-4" />
            管理后台
          </Link>
        )}
      </nav>

      <div className="mt-8">
        <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-dai">
          <Tags className="h-4 w-4 text-cinnabar" />
          标签书签
        </div>

        <div className="flex flex-wrap gap-2">
          {tags.length === 0 ? (
            <p className="text-sm leading-loose text-dai/55">
              创建笔记并添加标签后，这里会慢慢长出属于你的主题索引。
            </p>
          ) : (
            tags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => onSelectTag(selectedTag === tag ? null : tag)}
                className={cn(
                  "bookmark-tag transition",
                  selectedTag === tag && "scale-[1.02] shadow-seal"
                )}
              >
                {tag}
              </button>
            ))
          )}
        </div>
      </div>

      <div className="mt-auto hidden pt-8 lg:block">
        <div className="rounded-3xl border border-border-soft bg-white/48 p-4">
          <p className="font-title text-lg font-black text-ink">云中留白</p>
          <PoeticCopy
            copyKey="workspace.sidebar"
            className="mt-2 text-xs leading-loose text-dai/62"
          />
        </div>
      </div>
    </aside>
  );
}
