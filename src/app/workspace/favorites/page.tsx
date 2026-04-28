import { redirect } from "next/navigation";
import { FavoriteNotesClient } from "@/components/workspace/FavoriteNotesClient";
import { createClient } from "@/lib/supabase/server";

export default async function FavoritesPage() {
  const supabase = await createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  return <FavoriteNotesClient />;
}