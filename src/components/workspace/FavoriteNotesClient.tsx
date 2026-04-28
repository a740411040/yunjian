"use client";

import Link from "next/link";
import { ArrowLeft, RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { EmptyState } from "@/components/common/EmptyState";
import { CommunityNoteGrid } from "@/components/community/CommunityNoteGrid";
import { getMyFavoriteNotes } from "@/lib/favorites";
import type { CommunityNote } from "@/types/community";

export function FavoriteNotesClient() {
  const [notes, setNotes] = useState<CommunityNote[]>([]);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    setLoading(true);

    try {
      const data = await getMyFavoriteNotes();
      setNotes(data);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "加载收藏列表失败。";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  return (
    <main className="min-h-screen p-4 md:p-6">
      <div className="page-shell space-y-6">
        <section className="glass-card rounded-[32px] p-5 md:p-7">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <div>
              <p className="text-sm font-semibold text-cinnabar">我的收藏</p>
              <h1 className="font-title mt-2 text-4xl font-black text-ink">
                收藏的社区云笺
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-loose text-dai/70">
                这里会展示你收藏过的公开笔记。若作者取消公开，笔记会自动从这里消失。
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={refresh}
                className="inline-flex h-11 items-center gap-2 rounded-full border border-border-soft bg-white/70 px-5 text-sm font-semibold text-dai transition hover:bg-white"
              >
                <RefreshCcw className="h-4 w-4" />
                刷新
              </button>

              <Link
                href="/workspace"
                className="inline-flex h-11 items-center gap-2 rounded-full border border-border-soft bg-white/70 px-5 text-sm font-semibold text-dai transition hover:bg-white"
              >
                <ArrowLeft className="h-4 w-4" />
                返回工作台
              </Link>
            </div>
          </div>
        </section>

        {loading || notes.length > 0 ? (
          <CommunityNoteGrid
            notes={notes}
            loading={loading}
            hasFilter={false}
            onClearFilter={() => undefined}
          />
        ) : (
          <EmptyState
            title="还没有收藏任何云笺"
            description="去社区广场浏览公开笔记，点击收藏后就会出现在这里。"
          />
        )}
      </div>
    </main>
  );
}