import { NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { portalSessionOptions } from '@/lib/auth/portal-session';
import type { PortalSessionData } from '@/lib/auth/portal-session';
import { getSupabaseAdmin } from '@/lib/supabase/client';
import { canTransitionTo } from '@/lib/portal/status';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: portalId } = await params;

    // Verify portal session
    const session = await getIronSession<PortalSessionData>(await cookies(), portalSessionOptions);
    if (!session.verified || session.portalId !== portalId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = getSupabaseAdmin();

    // Get current status
    const { data: portal, error } = await supabase
      .from('portals')
      .select('status')
      .eq('id', portalId)
      .single();

    if (error || !portal) {
      return NextResponse.json({ error: 'Portal not found' }, { status: 404 });
    }

    if (!canTransitionTo(portal.status, 'quote_accepted')) {
      return NextResponse.json({
        error: `Cannot accept quote from current status: ${portal.status}`,
      }, { status: 400 });
    }

    // Update status
    const { error: updateError } = await supabase
      .from('portals')
      .update({ status: 'quote_accepted', updated_at: new Date().toISOString() })
      .eq('id', portalId);

    if (updateError) {
      return NextResponse.json({ error: 'Failed to accept quote' }, { status: 500 });
    }

    return NextResponse.json({ status: 'success', message: 'Quote accepted' });
  } catch (error) {
    console.error('Accept error:', error);
    return NextResponse.json({ error: 'Failed to accept quote' }, { status: 500 });
  }
}
