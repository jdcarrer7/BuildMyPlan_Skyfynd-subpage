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

    const body = await request.json();
    const { message } = body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    if (message.length > 2000) {
      return NextResponse.json({ error: 'Message too long (max 2000 characters)' }, { status: 400 });
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

    if (!canTransitionTo(portal.status, 'change_requested')) {
      return NextResponse.json({
        error: `Cannot request changes from current status: ${portal.status}`,
      }, { status: 400 });
    }

    // Insert change request
    const { error: insertError } = await supabase
      .from('portal_change_requests')
      .insert({
        portal_id: portalId,
        message: message.trim(),
      });

    if (insertError) {
      console.error('Change request insert error:', insertError);
      return NextResponse.json({ error: 'Failed to submit change request' }, { status: 500 });
    }

    // Update portal status
    await supabase
      .from('portals')
      .update({ status: 'change_requested', updated_at: new Date().toISOString() })
      .eq('id', portalId);

    return NextResponse.json({ status: 'success', message: 'Change request submitted' });
  } catch (error) {
    console.error('Change request error:', error);
    return NextResponse.json({ error: 'Failed to submit change request' }, { status: 500 });
  }
}
