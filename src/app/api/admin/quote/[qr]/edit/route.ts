import { NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { sessionOptions } from '@/lib/auth/session';
import type { SessionData, QuoteJSON } from '@/lib/types/admin';
import { updateQuoteData } from '@/lib/supabase/quotes';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ qr: string }> }
) {
  try {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
    if (!session.isLoggedIn) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { qr } = await params;
    if (!qr) {
      return NextResponse.json({ error: 'QR number is required' }, { status: 400 });
    }

    const body = await request.json();
    const quoteData: QuoteJSON = body.quoteData;
    const adminNotes: string = body.adminNotes ?? '';

    if (!quoteData) {
      return NextResponse.json({ error: 'quoteData is required' }, { status: 400 });
    }

    await updateQuoteData(qr, quoteData, adminNotes);

    return NextResponse.json({ status: 'success', quote: quoteData, adminNotes });
  } catch (error) {
    console.error('Save quote edit error:', error);
    return NextResponse.json({ error: 'Failed to save quote edits' }, { status: 500 });
  }
}
