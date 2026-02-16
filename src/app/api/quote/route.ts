import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email/resend';

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

    const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;
    if (!scriptUrl) {
      console.error('GOOGLE_APPS_SCRIPT_URL is not configured');
      return NextResponse.json(
        { error: 'Quote submission is not configured. Please contact support.' },
        { status: 500 }
      );
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    try {
      const scriptResponse = await fetch(scriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        redirect: 'follow',
        signal: controller.signal,
      });
      clearTimeout(timeout);

      // Google Apps Script may return HTML on redirect — try JSON parse
      const text = await scriptResponse.text();
      let result;
      try {
        result = JSON.parse(text);
      } catch {
        // If we got a non-JSON response but 200 status, treat as success
        if (scriptResponse.ok) {
          return NextResponse.json({ message: 'Quote submitted successfully!' });
        }
        return NextResponse.json(
          { error: 'Unexpected response from quote service' },
          { status: 500 }
        );
      }

      if (result.status === 'success') {
        // Send admin notification via Resend (non-blocking)
        sendEmail({
          to: ADMIN_EMAIL,
          subject: `New Quote Request — ${body.name}`,
          html: `<p><strong>New quote submitted</strong></p>
<p><strong>Name:</strong> ${body.name}</p>
<p><strong>Email:</strong> ${body.email}</p>
<p><strong>Source:</strong> ${body.source}</p>
${body.qrNumber ? `<p><strong>QR:</strong> ${body.qrNumber}</p>` : ''}`,
          text: `New quote submitted\n\nName: ${body.name}\nEmail: ${body.email}\nSource: ${body.source}${body.qrNumber ? `\nQR: ${body.qrNumber}` : ''}`,
        }).catch((err) => console.error('Admin notification email failed:', err));

        return NextResponse.json({ message: 'Quote submitted successfully!' });
      }

      return NextResponse.json(
        { error: result.message ?? 'Failed to save quote' },
        { status: 500 }
      );
    } finally {
      clearTimeout(timeout);
    }
  } catch (error) {
    console.error('Quote submission error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
