import { createClient } from "@/lib/supabase/server";
import type { Note } from "@/types/note";

export async function getNoteByIdServer(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return null;
  }

  return data as Note;
}
