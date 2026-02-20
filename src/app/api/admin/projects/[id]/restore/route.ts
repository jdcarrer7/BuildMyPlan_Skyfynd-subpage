import { NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { sessionOptions } from '@/lib/auth/session';
import type { SessionData } from '@/lib/types/admin';
import { restoreProject } from '@/lib/supabase/projects';

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
    if (!session.isLoggedIn) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await restoreProject(id);
    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('Restore project error:', error);
    return NextResponse.json({ error: 'Failed to restore project' }, { status: 500 });
  }
}
