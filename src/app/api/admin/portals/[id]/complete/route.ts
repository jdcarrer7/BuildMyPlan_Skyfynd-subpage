import { NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { sessionOptions } from '@/lib/auth/session';
import type { SessionData } from '@/lib/types/admin';
import { getSupabaseAdmin } from '@/lib/supabase/client';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
    if (!session.isLoggedIn) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: portalId } = await params;
    const supabase = getSupabaseAdmin();

    const { data: portal, error } = await supabase
      .from('portals')
      .select('id, status')
      .eq('id', portalId)
      .single();

    if (error || !portal) {
      return NextResponse.json({ error: 'Portal not found' }, { status: 404 });
    }

    if (portal.status !== 'payment_completed') {
      return NextResponse.json({
        error: 'Only paid projects can be marked as completed',
      }, { status: 400 });
    }

    await supabase
      .from('portals')
      .update({ status: 'project_completed', updated_at: new Date().toISOString() })
      .eq('id', portalId);

    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('Complete portal error:', error);
    return NextResponse.json({ error: 'Failed to complete portal' }, { status: 500 });
  }
}
