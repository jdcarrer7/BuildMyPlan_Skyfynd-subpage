import { NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { portalSessionOptions } from '@/lib/auth/portal-session';
import type { PortalSessionData } from '@/lib/auth/portal-session';
import { getSupabaseAdmin } from '@/lib/supabase/client';
import { canTransitionTo } from '@/lib/portal/status';
import { sendEmail } from '@/lib/email/resend';
import { ADMIN_EMAILS } from '@/lib/email/constants';
import { buildChangeRequestNotificationEmail } from '@/lib/portal/email';

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

    // Get current status + info for admin notification
    const { data: portal, error } = await supabase
      .from('portals')
      .select('status, client_name, qr_number')
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

    // Notify admin via email
    const trimmedMessage = message.trim();
    const htmlBody = buildChangeRequestNotificationEmail(
      portal.client_name,
      portal.qr_number,
      trimmedMessage
    );
    await sendEmail({
      to: ADMIN_EMAILS,
      subject: `Change Request \u2014 ${portal.qr_number} (${portal.client_name})`,
      html: htmlBody,
      text: `Change request from ${portal.client_name} (${portal.qr_number}):\n\n${trimmedMessage}`,
    });

    return NextResponse.json({ status: 'success', message: 'Change request submitted' });
  } catch (error) {
    console.error('Change request error:', error);
    return NextResponse.json({ error: 'Failed to submit change request' }, { status: 500 });
  }
}
