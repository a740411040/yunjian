// src/components/profile/PublicProfileHeader.tsx

"use client";

import type { Profile } from "@/types/profile";

type PublicProfileHeaderProps = {
  profile: Profile;
  noteCount: number;
};

export function PublicProfileHeader({
  profile,
  noteCount
}: PublicProfileHeaderProps) {
  const displayName =
    profile.display_name || profile.username || "云笺用户";

  const username = profile.username || "user";

  const firstChar = displayName.slice(0, 1);

  return (
    <section className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
      <div className="relative h-32 bg-gradient-to-br from-red-50 via-stone-50 to-emerald-50">
        <div className="absolute -left-12 top-8 h-36 w-36 rounded-full border border-red-100" />
        <div className="absolute -right-10 top-10 h-32 w-32 rounded-full border border-emerald-100" />
      </div>

      <div className="relative px-6 pb-6 sm:px-8">
        <div className="-mt-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-end gap-4">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-red-50 text-3xl font-bold text-red-500 shadow-sm">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={displayName}
                  className="h-full w-full object-cover"
                />
              ) : (
                firstChar
              )}
            </div>

            <div className="pb-1">
              <h1 className="text-2xl font-bold text-stone-900">
                {displayName}
              </h1>

              <p className="mt-1 text-sm tracking-wide text-stone-400">
                @{username}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-stone-100 bg-stone-50 px-5 py-3 text-center">
            <div className="text-2xl font-bold text-red-500">
              {noteCount}
            </div>
            <div className="mt-1 text-xs text-stone-400">
              公开云笺
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-[1fr_auto]">
          <div>
            {profile.bio ? (
              <p className="max-w-2xl text-sm leading-7 text-stone-600">
                {profile.bio}
              </p>
            ) : (
              <p className="max-w-2xl text-sm leading-7 text-stone-400">
                这个人还没有写简介。
              </p>
            )}

            <div className="mt-4 flex flex-wrap gap-2 text-xs text-stone-500">
              {profile.location && (
                <span className="rounded-full bg-stone-100 px-3 py-1">
                  {profile.location}
                </span>
              )}

              {profile.website && (
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-stone-100 px-3 py-1 transition hover:bg-red-50 hover:text-red-500"
                >
                  {profile.website}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}