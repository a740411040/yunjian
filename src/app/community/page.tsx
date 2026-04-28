import { redirect } from "next/navigation";
import { CommunityPageClient } from "@/components/community/CommunityPageClient";
import { createClient } from "@/lib/supabase/server";

export default async function CommunityPage() {
  const supabase = await createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  return <CommunityPageClient />;
}