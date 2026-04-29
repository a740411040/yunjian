"use client";

import { useState } from "react";
import { PoeticCopy } from "@/components/common/PoeticCopy";
import { FollowButton } from "@/components/profile/FollowButton";
import type { FollowSummary } from "@/types/follow";
import type { Profile } from "@/types/profile";

type PublicProfileHeaderProps = {
  profile: Profile;
  noteCount: number;
  followSummary: FollowSummary;
};

export function PublicProfileHeader({
  profile,
  noteCount,
  followSummary
}: PublicProfileHeaderProps) {
  const [summary, setSummary] = useState(followSummary);
  const displayName = profile.display_name || profile.username || "云笺用户";
  const username = profile.username || "user";
  const firstChar = displayName.slice(0, 1);

  return (
    <section className="overflow-hidden rounded-3xl border border-border-soft bg-white/72 shadow-soft">
      <div className="relative h-36 bg-gradient-to-br from-cinnabar-soft via-paper to-shiqing-soft">
        <div className="absolute -left-12 top-8 h-36 w-36 rounded-full border border-cinnabar/10" />
        <div className="absolute -right-10 top-10 h-32 w-32 rounded-full border border-shiqing/14" />
      </div>

      <div className="relative px-6 pb-6 sm:px-8">
        <div className="-mt-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-end gap-4">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-cinnabar-soft text-3xl font-bold text-cinnabar shadow-sm">
              {profile.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
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
              <h1 className="font-title text-3xl font-black text-ink">
                {displayName}
              </h1>
              <p className="mt-1 text-sm tracking-wide text-dai/45">
                @{username}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "公开云笺", value: noteCount },
              { label: "关注者", value: summary.followerCount },
              { label: "正在关注", value: summary.followingCount }
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-border-soft bg-white/60 px-4 py-3 text-center"
              >
                <div className="text-2xl font-bold text-cinnabar">
                  {item.value}
                </div>
                <div className="mt-1 text-xs text-dai/45">{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-[1fr_auto]">
          <div>
            {profile.bio ? (
              <p className="max-w-2xl text-sm leading-7 text-dai/70">
                {profile.bio}
              </p>
            ) : (
              <PoeticCopy
                copyKey="profile.empty"
                className="max-w-2xl text-sm leading-7 text-dai/45"
              />
            )}

            <div className="mt-4 flex flex-wrap gap-2 text-xs text-dai/55">
              {profile.location && (
                <span className="rounded-full bg-white/64 px-3 py-1">
                  {profile.location}
                </span>
              )}

              {profile.website && (
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-white/64 px-3 py-1 transition hover:bg-cinnabar-soft hover:text-cinnabar"
                >
                  {profile.website}
                </a>
              )}
            </div>
          </div>

          <FollowButton summary={summary} onChange={setSummary} />
        </div>
      </div>
    </section>
  );
}
