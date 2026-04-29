"use client";

import Link from "next/link";
import type { PublicProfileNote } from "@/lib/community-server";
import { PublicProfileHeader } from "@/components/profile/PublicProfileHeader";
import { PublicProfileNoteList } from "@/components/profile/PublicProfileNoteList";
import type { FollowSummary } from "@/types/follow";
import type { Profile } from "@/types/profile";

type PublicProfilePageClientProps = {
  profile: Profile;
  notes: PublicProfileNote[];
  followSummary: FollowSummary;
};

export function PublicProfilePageClient({
  profile,
  notes,
  followSummary
}: PublicProfilePageClientProps) {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <Link
            href="/community"
            className="surface-button rounded-full px-4 py-2 text-sm text-dai transition hover:text-cinnabar"
          >
            返回社区
          </Link>

          <Link
            href="/workspace"
            className="surface-button rounded-full px-4 py-2 text-sm text-dai transition hover:text-cinnabar"
          >
            回到工作台
          </Link>
        </div>

        <PublicProfileHeader
          profile={profile}
          noteCount={notes.length}
          followSummary={followSummary}
        />

        <section className="mt-8">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-ink">公开云笺</h2>
              <p className="mt-1 text-sm text-dai/55">
                这里展示 TA 发布到社区的公开笔记。
              </p>
            </div>

            <div className="text-sm text-dai/42">共 {notes.length} 篇</div>
          </div>

          <PublicProfileNoteList notes={notes} />
        </section>
      </div>
    </main>
  );
}
