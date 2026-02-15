import { NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { sessionOptions } from '@/lib/auth/session';
import type { SessionData, QuoteJSON } from '@/lib/types/admin';
import { getSupabaseAdmin } from '@/lib/supabase/client';

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

    const supabase = getSupabaseAdmin();

    const { error } = await supabase
      .from('quote_overrides')
      .upsert(
        {
          qr_number: qr,
          quote_data: quoteData,
          admin_notes: adminNotes,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'qr_number' }
      );

    if (error) {
      console.error('Supabase upsert error:', error);
      return NextResponse.json({ error: 'Failed to save quote edits' }, { status: 500 });
    }

    return NextResponse.json({ status: 'success', quote: quoteData, adminNotes });
  } catch (error) {
    console.error('Save quote edit error:', error);
    return NextResponse.json({ error: 'Failed to save quote edits' }, { status: 500 });
  }
}
