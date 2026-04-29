import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { FeedbackPageClient } from "@/components/feedback/FeedbackPageClient";
import { createClient } from "@/lib/supabase/server";

export default async function FeedbackPage() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <main className="min-h-screen p-4 md:p-6">
      <div className="page-shell">
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <section>
            <p className="text-sm font-semibold text-cinnabar">反馈系统</p>
            <h1 className="font-title mt-2 text-4xl font-black text-ink">
              让改动有来处，也有回音
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-loose text-dai/70">
              功能建议、视觉感受、社区问题和使用中的卡点，都可以在这里留下来。
            </p>
          </section>

          <Link
            href="/workspace"
            className="surface-button inline-flex h-11 items-center gap-2 rounded-full px-5 text-sm font-semibold text-dai transition hover:text-cinnabar"
          >
            <ArrowLeft className="h-4 w-4" />
            返回工作台
          </Link>
        </div>

        <FeedbackPageClient />
      </div>
    </main>
  );
}
