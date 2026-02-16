import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/client';
import { buildVerificationCodeEmail } from '@/lib/portal/email';
import { sendEmail } from '@/lib/email/resend';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: portalId } = await params;
    const supabase = getSupabaseAdmin();

    // Fetch portal
    const { data: portal, error } = await supabase
      .from('portals')
      .select('id, client_email, client_name, expires_at, quote_data')
      .eq('id', portalId)
      .single();

    if (error || !portal) {
      return NextResponse.json({ error: 'Portal not found' }, { status: 404 });
    }

    if (new Date(portal.expires_at) < new Date()) {
      return NextResponse.json({ error: 'Portal expired' }, { status: 410 });
    }

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Insert verification record
    const { error: insertError } = await supabase
      .from('portal_verification')
      .insert({
        portal_id: portalId,
        email: portal.client_email,
        code,
      });

    if (insertError) {
      console.error('Verification insert error:', insertError);
      return NextResponse.json({ error: 'Failed to create verification' }, { status: 500 });
    }

    // Send code via email
    const clientName = (portal.quote_data as Record<string, unknown>)?.customer
      ? ((portal.quote_data as Record<string, unknown>).customer as Record<string, string>)?.name || portal.client_name
      : portal.client_name;
    const htmlBody = buildVerificationCodeEmail(clientName, code);

    await sendEmail({
      to: portal.client_email,
      subject: 'Your Skyfynd Verification Code',
      html: htmlBody,
      text: `Hi ${clientName},\n\nYour verification code is: ${code}\n\nThis code expires in 10 minutes.\n\nSkyfynd`,
    });

    // Mask email for response
    const email = portal.client_email;
    const maskedEmail = email[0] + '***@' + email.split('@')[1];

    return NextResponse.json({
      status: 'success',
      maskedEmail,
      message: 'Verification code sent',
    });
  } catch (error) {
    console.error('Verify error:', error);
    return NextResponse.json({ error: 'Failed to send verification code' }, { status: 500 });
  }
}
