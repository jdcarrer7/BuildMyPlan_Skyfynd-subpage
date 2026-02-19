import { NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { sessionOptions } from '@/lib/auth/session';
import type { SessionData } from '@/lib/types/admin';
import { listProjects, listAllTasks, createProject } from '@/lib/supabase/projects';

export async function GET() {
  try {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
    if (!session.isLoggedIn) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [projects, tasks] = await Promise.all([listProjects(), listAllTasks()]);
    return NextResponse.json({ status: 'success', projects, tasks });
  } catch (error) {
    console.error('List projects error:', error);
    return NextResponse.json({ error: 'Failed to list projects' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
    if (!session.isLoggedIn) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    if (!body.name?.trim()) {
      return NextResponse.json({ error: 'Project name is required' }, { status: 400 });
    }

    const project = await createProject(body);
    return NextResponse.json({ status: 'success', project });
  } catch (error) {
    console.error('Create project error:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
