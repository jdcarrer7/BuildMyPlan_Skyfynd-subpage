import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email/resend';
import { ADMIN_EMAILS } from '@/lib/email/constants';
import { createQuote } from '@/lib/supabase/quotes';
import { buildQuoteConfirmationEmail } from '@/lib/portal/email';

const VALID_SOURCES = ['Main Page', 'Rent Me a Site', 'RentMe', 'Custom Builder'] as const;

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name?.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    if (!body.email?.trim()) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }
    if (!VALID_SOURCES.includes(body.source)) {
      return NextResponse.json({ error: 'Invalid source' }, { status: 400 });
    }

    const { qrNumber } = await createQuote(body);

    // Send emails — must await on Cloudflare Workers (runtime terminates after response)
    await Promise.allSettled([
      sendEmail({
        to: ADMIN_EMAILS,
        subject: `New Quote Request — ${body.name}`,
        html: `<p><strong>New quote submitted</strong></p>
<p><strong>Name:</strong> ${body.name}</p>
<p><strong>Email:</strong> ${body.email}</p>
<p><strong>Source:</strong> ${body.source}</p>
<p><strong>QR:</strong> ${qrNumber}</p>`,
        text: `New quote submitted\n\nName: ${body.name}\nEmail: ${body.email}\nSource: ${body.source}\nQR: ${qrNumber}`,
      }),
      sendEmail({
        to: body.email,
        subject: `We've received your quote request — ${qrNumber}`,
        html: buildQuoteConfirmationEmail(
          body.name,
          qrNumber,
          body.serviceNames,
          body.serviceCount
        ),
        text: `Hi ${body.name},\n\nThank you for your quote request! We've received your submission (${qrNumber}) and our team will review it shortly. You can expect to hear from us within 24 hours.\n\nQuestions? Reply to this email or reach out to us anytime.\n\nSkyfynd — Software for Businesses`,
        replyTo: ADMIN_EMAILS[0],
      }),
    ]);

    return NextResponse.json({ message: 'Quote submitted successfully!', qrNumber });
  } catch (error) {
    console.error('Quote submission error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
