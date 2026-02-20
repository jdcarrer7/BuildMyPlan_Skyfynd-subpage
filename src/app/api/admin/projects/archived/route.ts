import { NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { sessionOptions } from '@/lib/auth/session';
import type { SessionData } from '@/lib/types/admin';
import { listArchivedProjects } from '@/lib/supabase/projects';

export async function GET() {
  try {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
    if (!session.isLoggedIn) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const projects = await listArchivedProjects();
    return NextResponse.json({ status: 'success', projects });
  } catch (error) {
    console.error('List archived projects error:', error);
    return NextResponse.json({ error: 'Failed to list archived projects' }, { status: 500 });
  }
}
