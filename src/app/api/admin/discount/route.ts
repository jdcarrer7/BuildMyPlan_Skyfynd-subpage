import { NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { sessionOptions } from '@/lib/auth/session';
import type { SessionData } from '@/lib/types/admin';
import { updateQuoteDiscount } from '@/lib/supabase/quotes';

export async function POST(request: Request) {
  try {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
    if (!session.isLoggedIn) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    if (!body.qrNumber) {
      return NextResponse.json({ error: 'QR number is required' }, { status: 400 });
    }

    const updatedQuote = await updateQuoteDiscount(
      body.qrNumber,
      body.serviceDiscounts || [],
      body.quoteDiscount || null
    );

    return NextResponse.json({ status: 'success', quote: updatedQuote });
  } catch (error) {
    console.error('Save discount error:', error);
    return NextResponse.json({ error: 'Failed to save discount' }, { status: 500 });
  }
}
