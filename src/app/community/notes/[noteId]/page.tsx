import { notFound, redirect } from "next/navigation";
import { CommunityNoteDetail } from "@/components/community/CommunityNoteDetail";
import { getCommunityNoteByIdServer } from "@/lib/community-server";
import { createClient } from "@/lib/supabase/server";

type PageProps = {
  params: Promise<{
    noteId: string;
  }>;
};

export default async function CommunityNotePage({ params }: PageProps) {
  const { noteId } = await params;

  const supabase = await createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const note = await getCommunityNoteByIdServer(noteId);

  if (!note) {
    notFound();
  }

  return <CommunityNoteDetail note={note} />;
}