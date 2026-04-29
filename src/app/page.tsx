import { redirect } from "next/navigation";
import { LandingExperience } from "@/components/landing/LandingExperience";
import { getRandomLandingVariant } from "@/lib/site-theme";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/workspace");
  }

  return <LandingExperience variant={getRandomLandingVariant()} />;
}
