import { createClient } from "@/lib/supabase/browser";
import type { Note, NotePayload } from "@/types/note";

function sortNotes(notes: Note[]) {
  return notes.sort((a, b) => {
    if (a.is_pinned !== b.is_pinned) {
      return a.is_pinned ? -1 : 1;
    }

    return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
  });
}

export async function getNotes() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .order("is_pinned", { ascending: false })
    .order("updated_at", { ascending: false });

  if (error) {
    throw error;
  }

  return sortNotes((data ?? []) as Note[]);
}

export async function getNoteById(id: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  return data as Note;
}

export async function createNote(payload: NotePayload) {
  const supabase = createClient();

  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!user) {
    throw new Error("请先登录。");
  }

  const { data, error } = await supabase
    .from("notes")
    .insert({
      user_id: user.id,
      title: payload.title,
      content: payload.content,
      tags: payload.tags,
      is_pinned: false
    })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data as Note;
}

export async function updateNote(id: string, payload: NotePayload) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("notes")
    .update({
      title: payload.title,
      content: payload.content,
      tags: payload.tags
    })
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data as Note;
}

export async function toggleNotePinned(note: Note) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("notes")
    .update({
      is_pinned: !note.is_pinned
    })
    .eq("id", note.id)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data as Note;
}

export async function deleteNote(id: string) {
  const supabase = createClient();

  const { error } = await supabase.from("notes").delete().eq("id", id);

  if (error) {
    throw error;
  }
}
