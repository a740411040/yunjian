// src/app/profile/[userId]/page.tsx

import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getPublicProfileById } from "@/lib/profiles-server";
import { getPublicNotesByUserId } from "@/lib/community-server";
import { PublicProfilePageClient } from "@/components/profile/PublicProfilePageClient";

type PageProps = {
  params: Promise<{
    userId: string;
  }>;
};

export default async function ProfilePage({ params }: PageProps) {
  const { userId } = await params;

  const supabase = await createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const [profile, notes] = await Promise.all([
    getPublicProfileById(userId),
    getPublicNotesByUserId(userId)
  ]);

  if (!profile) {
    notFound();
  }

  return <PublicProfilePageClient profile={profile} notes={notes} />;
}