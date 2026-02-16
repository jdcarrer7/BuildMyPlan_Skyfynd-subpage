import { NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { sessionOptions } from '@/lib/auth/session';
import type { SessionData, QuoteJSON } from '@/lib/types/admin';
import { getSupabaseAdmin } from '@/lib/supabase/client';
import { buildPortalInviteEmail } from '@/lib/portal/email';
import { sendEmail } from '@/lib/email/resend';

export async function POST(request: Request) {
  try {
    // Auth check
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
    if (!session.isLoggedIn) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    if (!body.qrNumber) {
      return NextResponse.json({ error: 'QR number is required' }, { status: 400 });
    }

    // Fetch quote data (checks Supabase overrides first, then GAS)
    const { getQuoteData } = await import('@/lib/admin/getQuoteData');
    const quoteResult = await getQuoteData(body.qrNumber);
    if (!quoteResult) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
    }
    const quote: QuoteJSON = quoteResult.quote;
    const clientEmail = quote.customer?.email;
    const clientName = quote.customer?.name;
    if (!clientEmail || !clientName) {
      return NextResponse.json({ error: 'No client email/name found for this quote' }, { status: 400 });
    }

    // Create portal record in Supabase
    const supabase = getSupabaseAdmin();
    const { data: portal, error: dbError } = await supabase
      .from('portals')
      .insert({
        qr_number: quote.qrNumber,
        client_name: clientName,
        client_email: clientEmail,
        client_company: quote.customer.company || '',
        client_phone: quote.customer.phone || '',
        quote_data: quote,
        status: 'sent',
      })
      .select('id')
      .single();

    if (dbError || !portal) {
      console.error('Supabase insert error:', dbError);
      return NextResponse.json({ error: 'Failed to create portal' }, { status: 500 });
    }

    // Build and send email
    const serviceCount = quote.services?.length || 0;
    const grandTotal = quote.totals?.grandTotal || 0;
    const htmlBody = buildPortalInviteEmail(portal.id, clientName, quote.qrNumber, grandTotal, serviceCount);
    const subject = `Your SkyFynd Project Portal \u2014 ${quote.qrNumber}`;

    await sendEmail({
      to: clientEmail,
      subject,
      html: htmlBody,
      text: `Hi ${clientName},\n\nYour project portal is ready. Visit your portal to review your quote, sign the agreement, and complete your deposit.\n\nQuote: ${quote.qrNumber}\nTotal: $${grandTotal}\n\nSkyfynd — Software for Businesses`,
    });

    return NextResponse.json({
      status: 'success',
      portalId: portal.id,
      message: `Portal sent to ${clientEmail}`,
    });
  } catch (error) {
    console.error('Send portal error:', error);
    return NextResponse.json({ error: 'Failed to send portal' }, { status: 500 });
  }
}
