import { getSupabaseAdmin } from './client';
import type { Note, CreateNoteInput } from '@/lib/types/project';

export async function listNotes(): Promise<Note[]> {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) throw new Error(`Failed to list notes: ${error.message}`);
  return data || [];
}

export async function createNote(data: CreateNoteInput): Promise<Note> {
  const supabase = getSupabaseAdmin();

  const { data: note, error } = await supabase
    .from('notes')
    .insert({
      title: data.title || '',
      content: data.content || '',
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to create note: ${error.message}`);
  return note;
}

export async function updateNote(id: string, data: Partial<Note>): Promise<Note> {
  const supabase = getSupabaseAdmin();

  const updates: Record<string, unknown> = {};
  if (data.title !== undefined) updates.title = data.title;
  if (data.content !== undefined) updates.content = data.content;
  updates.updated_at = new Date().toISOString();

  const { data: note, error } = await supabase
    .from('notes')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(`Failed to update note: ${error.message}`);
  return note;
}

export async function deleteNote(id: string): Promise<void> {
  const supabase = getSupabaseAdmin();

  const { error } = await supabase
    .from('notes')
    .delete()
    .eq('id', id);

  if (error) throw new Error(`Failed to delete note: ${error.message}`);
}

export async function bulkCreateNotes(notes: CreateNoteInput[]): Promise<Note[]> {
  const supabase = getSupabaseAdmin();

  const rows = notes.map((n) => ({
    title: n.title || '',
    content: n.content || '',
  }));

  const { data, error } = await supabase
    .from('notes')
    .insert(rows)
    .select();

  if (error) throw new Error(`Failed to bulk create notes: ${error.message}`);
  return data || [];
}
