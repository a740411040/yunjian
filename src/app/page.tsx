import { redirect } from "next/navigation";
import { FeatureSection } from "@/components/landing/FeatureSection";
import { HeroSection } from "@/components/landing/HeroSection";
import { InkDecorations } from "@/components/landing/InkDecorations";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/workspace");
  }

  return (
    <main className="relative min-h-screen overflow-hidden">
      <InkDecorations />
      <HeroSection />
      <FeatureSection />
    </main>
  );
}
