import { notFound, redirect } from "next/navigation";
import { NoteDetailClient } from "@/components/workspace/NoteDetailClient";
import { getNoteByIdServer } from "@/lib/notes-server";
import { createClient } from "@/lib/supabase/server";

type PageProps = {
  params: Promise<{
    noteId: string;
  }>;
};

export default async function NoteDetailPage({ params }: PageProps) {
  const { noteId } = await params;

  const supabase = await createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const note = await getNoteByIdServer(noteId);

  if (!note) {
    notFound();
  }

  return <NoteDetailClient initialNote={note} />;
}