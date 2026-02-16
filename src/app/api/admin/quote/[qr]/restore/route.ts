import { NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { sessionOptions } from '@/lib/auth/session';
import type { SessionData } from '@/lib/types/admin';
import { restoreQuote } from '@/lib/supabase/quotes';

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ qr: string }> }
) {
  try {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
    if (!session.isLoggedIn) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { qr } = await params;
    await restoreQuote(qr);
    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('Restore quote error:', error);
    return NextResponse.json({ error: 'Failed to restore quote' }, { status: 500 });
  }
}
