import { NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { sessionOptions } from '@/lib/auth/session';
import type { SessionData } from '@/lib/types/admin';
import { listNotes, createNote, bulkCreateNotes } from '@/lib/supabase/notes';

export async function GET() {
  try {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
    if (!session.isLoggedIn) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const notes = await listNotes();
    return NextResponse.json({ status: 'success', notes });
  } catch (error) {
    console.error('List notes error:', error);
    return NextResponse.json({ error: 'Failed to list notes' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
    if (!session.isLoggedIn) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Bulk import (for localStorage migration)
    if (Array.isArray(body.notes)) {
      const notes = await bulkCreateNotes(body.notes);
      return NextResponse.json({ status: 'success', notes });
    }

    const note = await createNote(body);
    return NextResponse.json({ status: 'success', note });
  } catch (error) {
    console.error('Create note error:', error);
    return NextResponse.json({ error: 'Failed to create note' }, { status: 500 });
  }
}
