import { NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { portalSessionOptions } from '@/lib/auth/portal-session';
import type { PortalSessionData } from '@/lib/auth/portal-session';
import { getSupabaseAdmin } from '@/lib/supabase/client';
import { canTransitionTo } from '@/lib/portal/status';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: portalId } = await params;

    const supabase = getSupabaseAdmin();
    const { data: portal, error } = await supabase
      .from('portals')
      .select('*')
      .eq('id', portalId)
      .single();

    if (error || !portal) {
      return NextResponse.json({ error: 'Portal not found' }, { status: 404 });
    }

    // Check expiry
    if (new Date(portal.expires_at) < new Date()) {
      return NextResponse.json({ error: 'Portal expired' }, { status: 410 });
    }

    // Check portal session
    const session = await getIronSession<PortalSessionData>(await cookies(), portalSessionOptions);
    if (!session.verified || session.portalId !== portalId) {
      // Return limited info for unverified access
      const email = portal.client_email;
      const maskedEmail = email[0] + '***@' + email.split('@')[1];
      return NextResponse.json({
        status: 'unverified',
        maskedEmail,
        portalId,
      }, { status: 403 });
    }

    // Update status to quote_viewed if currently email_verified
    if (portal.status === 'email_verified' && canTransitionTo('email_verified', 'quote_viewed')) {
      await supabase
        .from('portals')
        .update({ status: 'quote_viewed', updated_at: new Date().toISOString() })
        .eq('id', portalId);
      portal.status = 'quote_viewed';
    }

    return NextResponse.json({ status: 'success', portal });
  } catch (error) {
    console.error('Portal fetch error:', error);
    return NextResponse.json({ error: 'Failed to load portal' }, { status: 500 });
  }
}
