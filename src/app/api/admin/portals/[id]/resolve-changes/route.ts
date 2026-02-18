import { NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { sessionOptions } from '@/lib/auth/session';
import type { SessionData } from '@/lib/types/admin';
import { getSupabaseAdmin } from '@/lib/supabase/client';
import { getQuoteData } from '@/lib/admin/getQuoteData';
import { sendEmail } from '@/lib/email/resend';
import { buildQuoteUpdatedEmail } from '@/lib/portal/email';

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
    const body = await request.json().catch(() => ({}));
    const adminResponse = body.adminResponse?.trim() || null;

    const supabase = getSupabaseAdmin();

    // Fetch portal
    const { data: portal, error } = await supabase
      .from('portals')
      .select('id, qr_number, client_name, client_email, status')
      .eq('id', portalId)
      .single();

    if (error || !portal) {
      return NextResponse.json({ error: 'Portal not found' }, { status: 404 });
    }

    if (portal.status !== 'change_requested') {
      return NextResponse.json({
        error: 'No pending change request to resolve',
      }, { status: 400 });
    }

    // Fetch latest quote data from quotes table
    const quoteResult = await getQuoteData(portal.qr_number);
    if (!quoteResult) {
      return NextResponse.json({ error: 'Quote data not found' }, { status: 404 });
    }

    // Update portal: sync quote_data + reset status to quote_viewed
    const { error: updateError } = await supabase
      .from('portals')
      .update({
        quote_data: quoteResult.quote,
        status: 'quote_viewed',
        updated_at: new Date().toISOString(),
      })
      .eq('id', portalId);

    if (updateError) {
      console.error('Portal update error:', updateError);
      return NextResponse.json({ error: 'Failed to update portal' }, { status: 500 });
    }

    // Mark all pending change requests as resolved
    await supabase
      .from('portal_change_requests')
      .update({
        status: 'resolved',
        admin_response: adminResponse,
      })
      .eq('portal_id', portalId)
      .eq('status', 'pending');

    // Send client email notifying them their quote was updated
    const htmlBody = buildQuoteUpdatedEmail(portalId, portal.client_name, portal.qr_number);
    await sendEmail({
      to: portal.client_email,
      subject: `Your Quote Has Been Updated \u2014 ${portal.qr_number}`,
      html: htmlBody,
      text: `Hi ${portal.client_name},\n\nWe've reviewed your feedback and updated your quote. Please visit your portal to review the changes.\n\nSkyfynd — Software for Businesses`,
    });

    return NextResponse.json({
      status: 'success',
      message: `Updated quote sent to ${portal.client_email}`,
    });
  } catch (error) {
    console.error('Resolve changes error:', error);
    return NextResponse.json({ error: 'Failed to resolve change request' }, { status: 500 });
  }
}
