import { NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { sessionOptions } from '@/lib/auth/session';
import type { SessionData } from '@/lib/types/admin';
import { reorderTasks } from '@/lib/supabase/projects';

export async function PUT(request: Request) {
  try {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
    if (!session.isLoggedIn) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    if (!Array.isArray(body.taskIds) || body.taskIds.length === 0) {
      return NextResponse.json({ error: 'taskIds array is required' }, { status: 400 });
    }

    await reorderTasks(body.taskIds);
    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('Reorder tasks error:', error);
    return NextResponse.json({ error: 'Failed to reorder tasks' }, { status: 500 });
  }
}
