import { NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { sessionOptions } from '@/lib/auth/session';
import type { SessionData } from '@/lib/types/admin';
import { getQuote, deleteQuote } from '@/lib/supabase/quotes';

export async function GET(
  _request: Request,
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

    const result = await getQuote(qr);
    if (!result) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
    }

    return NextResponse.json({
      status: 'success',
      quote: result.quote,
      adminNotes: result.adminNotes,
      isEdited: result.isEdited,
    });
  } catch (error) {
    console.error('Get quote error:', error);
    return NextResponse.json({ error: 'Failed to get quote' }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ qr: string }> }
) {
  try {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
    if (!session.isLoggedIn) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { qr } = await params;
    await deleteQuote(qr);
    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('Delete quote error:', error);
    return NextResponse.json({ error: 'Failed to delete quote' }, { status: 500 });
  }
}
