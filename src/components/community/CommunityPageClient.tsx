"use client";

import { useEffect } from "react";
import { BookOpenCheck, Feather } from "lucide-react";
import { PoeticCopy } from "@/components/common/PoeticCopy";
import { CommunityHeader } from "@/components/community/CommunityHeader";
import { CommunityNoteGrid } from "@/components/community/CommunityNoteGrid";
import { CommunitySearchBar } from "@/components/community/CommunitySearchBar";
import { CommunityTagFilter } from "@/components/community/CommunityTagFilter";
import { CommunityTopicRail } from "@/components/community/CommunityTopicRail";
import { useCommunityNotes } from "@/hooks/useCommunityNotes";

export function CommunityPageClient() {
  const {
    notes,
    loading,
    query,
    selectedTag,
    sort,
    scope,
    allTags,
    topics,
    setQuery,
    setSelectedTag,
    setSort,
    setScope,
    refresh,
    updateNoteInList
  } = useCommunityNotes();

  const hasFilter = Boolean(query.trim() || selectedTag || scope === "following");

  function clearFilter() {
    setQuery("");
    setSelectedTag(null);
  }

  useEffect(() => {
    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        void refresh();
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [refresh]);

  return (
    <main className="min-h-screen p-4 md:p-6">
      <div className="page-shell space-y-6">
        <CommunityHeader
          sort={sort}
          scope={scope}
          onSortChange={setSort}
          onScopeChange={setScope}
          onRefresh={refresh}
        />

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="space-y-6">
            <section className="paper-card p-5">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-cinnabar-soft text-cinnabar">
                <Feather className="h-5 w-5" />
              </div>

              <h2 className="font-title mt-5 text-2xl font-black text-ink">
                社区说明
              </h2>

              <PoeticCopy
                copyKey="community.guide"
                className="mt-3 text-sm leading-loose text-dai/65"
              />
            </section>

            <CommunityTagFilter
              tags={allTags}
              selectedTag={selectedTag}
              onSelectTag={setSelectedTag}
            />

            <CommunityTopicRail
              topics={topics}
              selectedTag={selectedTag}
              onSelectTag={setSelectedTag}
            />

            <section className="paper-card p-5">
              <div className="flex items-center gap-2">
                <BookOpenCheck className="h-4 w-4 text-shiqing-dark" />

                <h2 className="font-title text-xl font-black text-ink">
                  创作提示
                </h2>
              </div>

              <PoeticCopy
                copyKey="community.prompt"
                className="mt-3 text-sm leading-loose text-dai/65"
              />
            </section>
          </aside>

          <section className="space-y-5">
            <CommunitySearchBar value={query} onChange={setQuery} />

            <CommunityNoteGrid
              notes={notes}
              loading={loading}
              hasFilter={hasFilter}
              onClearFilter={clearFilter}
              onNoteChange={updateNoteInList}
              emptyTitle={
                scope === "following" && !query.trim() && !selectedTag
                  ? "你关注的人还没有公开新内容"
                  : undefined
              }
              emptyDescription={
                scope === "following" && !query.trim() && !selectedTag
                  ? "先去作者主页点下关注，之后这里会更像一条属于你的清雅订阅流。"
                  : undefined
              }
            />
          </section>
        </div>
      </div>
    </main>
  );
}
