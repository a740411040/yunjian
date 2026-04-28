// src/components/profile/PublicProfilePageClient.tsx

"use client";

import Link from "next/link";
import type { Profile } from "@/types/profile";
import type { PublicProfileNote } from "@/lib/community-server";
import { PublicProfileHeader } from "@/components/profile/PublicProfileHeader";
import { PublicProfileNoteList } from "@/components/profile/PublicProfileNoteList";

type PublicProfilePageClientProps = {
  profile: Profile;
  notes: PublicProfileNote[];
};

export function PublicProfilePageClient({
  profile,
  notes
}: PublicProfilePageClientProps) {
  return (
    <main className="min-h-screen bg-stone-50">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <Link
            href="/community"
            className="rounded-full border border-stone-200 bg-white px-4 py-2 text-sm text-stone-600 shadow-sm transition hover:border-red-200 hover:text-red-500"
          >
            返回社区
          </Link>

          <Link
            href="/workspace"
            className="rounded-full border border-stone-200 bg-white px-4 py-2 text-sm text-stone-600 shadow-sm transition hover:border-red-200 hover:text-red-500"
          >
            回到工作台
          </Link>
        </div>

        <PublicProfileHeader profile={profile} noteCount={notes.length} />

        <section className="mt-8">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-stone-900">
                公开云笺
              </h2>
              <p className="mt-1 text-sm text-stone-500">
                这里展示 TA 发布到社区的公开笔记。
              </p>
            </div>

            <div className="text-sm text-stone-400">
              共 {notes.length} 篇
            </div>
          </div>

          <PublicProfileNoteList notes={notes} />
        </section>
      </div>
    </main>
  );
}