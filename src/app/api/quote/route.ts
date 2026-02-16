import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email/resend';
import { createQuote } from '@/lib/supabase/quotes';

const VALID_SOURCES = ['Main Page', 'Rent Me a Site', 'RentMe', 'Custom Builder'] as const;
const ADMIN_EMAIL = 'contact@skyfynd.io';

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

    // Send admin notification via Resend (non-blocking)
    sendEmail({
      to: ADMIN_EMAIL,
      subject: `New Quote Request — ${body.name}`,
      html: `<p><strong>New quote submitted</strong></p>
<p><strong>Name:</strong> ${body.name}</p>
<p><strong>Email:</strong> ${body.email}</p>
<p><strong>Source:</strong> ${body.source}</p>
<p><strong>QR:</strong> ${qrNumber}</p>`,
      text: `New quote submitted\n\nName: ${body.name}\nEmail: ${body.email}\nSource: ${body.source}\nQR: ${qrNumber}`,
    }).catch((err) => console.error('Admin notification email failed:', err));

    return NextResponse.json({ message: 'Quote submitted successfully!', qrNumber });
  } catch (error) {
    console.error('Quote submission error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
