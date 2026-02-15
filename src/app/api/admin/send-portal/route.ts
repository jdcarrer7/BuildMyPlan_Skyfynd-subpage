import { NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { sessionOptions } from '@/lib/auth/session';
import type { SessionData, QuoteJSON } from '@/lib/types/admin';
import { getSupabaseAdmin } from '@/lib/supabase/client';
import { buildPortalInviteEmail } from '@/lib/portal/email';
import nodemailer from 'nodemailer';
try { require('dns').setDefaultResultOrder('ipv4first'); } catch {}

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

    // Fetch quote from GAS
    const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;
    if (!scriptUrl) {
      return NextResponse.json({ error: 'Script URL not configured' }, { status: 500 });
    }

    const gasRes = await fetch(`${scriptUrl}?action=get_quote&qr=${encodeURIComponent(body.qrNumber)}`, {
      redirect: 'follow',
    });
    const gasText = await gasRes.text();
    let gasData;
    try {
      gasData = JSON.parse(gasText);
    } catch {
      return NextResponse.json({ error: 'Failed to fetch quote data' }, { status: 500 });
    }

    if (gasData.status !== 'success' || !gasData.quote) {
      return NextResponse.json({ error: gasData.message || 'Quote not found' }, { status: 404 });
    }

    const quote: QuoteJSON = gasData.quote;
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

    const gmailUser = process.env.GMAIL_USER;
    const gmailPass = process.env.GMAIL_APP_PASSWORD;
    if (!gmailUser || !gmailPass) {
      return NextResponse.json({ error: 'Email credentials not configured' }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: gmailUser, pass: gmailPass },
    });

    await transporter.sendMail({
      from: `"SkyFynd" <${gmailUser}>`,
      to: clientEmail,
      subject,
      text: `Hi ${clientName},\n\nYour project portal is ready. Visit your portal to review your quote, sign the agreement, and complete your deposit.\n\nQuote: ${quote.qrNumber}\nTotal: $${grandTotal}\n\nSkyFynd — Creative & Digital Marketing`,
      html: htmlBody,
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
