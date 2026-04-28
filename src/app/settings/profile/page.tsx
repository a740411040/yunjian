import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ProfileSettingsForm } from "@/components/settings/ProfileSettingsForm";
import { getCurrentProfileServer } from "@/lib/profiles-server";
import { createClient } from "@/lib/supabase/server";

export default async function ProfileSettingsPage() {
  const supabase = await createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const profile = await getCurrentProfileServer();

  return (
    <main className="min-h-screen p-4 md:p-6">
      <div className="page-shell">
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <section>
            <p className="text-sm font-semibold text-cinnabar">个人设置</p>
            <h1 className="font-title mt-2 text-4xl font-black text-ink">
              修改头像与社区资料
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-loose text-dai/70">
              这里的信息会展示在社区笔记卡片、评论区和个人主页中。
            </p>
          </section>

          <Link
            href="/workspace"
            className="inline-flex h-11 items-center gap-2 rounded-full border border-border-soft bg-white/70 px-5 text-sm font-semibold text-dai transition hover:bg-white"
          >
            <ArrowLeft className="h-4 w-4" />
            返回工作台
          </Link>
        </div>

        <ProfileSettingsForm initialProfile={profile} />
      </div>
    </main>
  );
}