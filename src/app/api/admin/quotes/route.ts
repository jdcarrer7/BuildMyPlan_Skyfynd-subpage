import { NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { sessionOptions } from '@/lib/auth/session';
import type { SessionData } from '@/lib/types/admin';
import { getSupabaseAdmin } from '@/lib/supabase/client';
try { require('dns').setDefaultResultOrder('ipv4first'); } catch {}

export async function GET() {
  try {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
    if (!session.isLoggedIn) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;
    if (!scriptUrl) {
      return NextResponse.json({ error: 'Script URL not configured' }, { status: 500 });
    }

    const url = `${scriptUrl}?action=list_quotes`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    try {
      const response = await fetch(url, {
        method: 'GET',
        redirect: 'follow',
        signal: controller.signal,
      });
      clearTimeout(timeout);

      const text = await response.text();
      let result;
      try {
        result = JSON.parse(text);
      } catch {
        if (response.ok) {
          return NextResponse.json({ status: 'success', quotes: [] });
        }
        return NextResponse.json({ error: 'Unexpected response' }, { status: 500 });
      }

      // Merge Supabase quote overrides into the GAS quotes list
      if (result.status === 'success' && Array.isArray(result.quotes) && result.quotes.length > 0) {
        try {
          const supabase = getSupabaseAdmin();
          const qrNumbers = result.quotes.map((q: { qrNumber: string }) => q.qrNumber);
          const { data: overrides } = await supabase
            .from('quote_overrides')
            .select('qr_number, quote_data')
            .in('qr_number', qrNumbers);

          if (overrides && overrides.length > 0) {
            const overrideMap = new Map(overrides.map((o: { qr_number: string; quote_data: { totals?: { grandTotal?: number } } }) => [o.qr_number, o.quote_data]));
            for (const quote of result.quotes) {
              const override = overrideMap.get(quote.qrNumber) as { totals?: { grandTotal?: number } } | undefined;
              if (override?.totals?.grandTotal !== undefined) {
                quote.grandTotal = override.totals.grandTotal;
              }
            }
          }
        } catch (e) {
          console.error('Failed to merge quote overrides:', e);
        }
      }

      return NextResponse.json(result);
    } finally {
      clearTimeout(timeout);
    }
  } catch (error) {
    console.error('List quotes error:', error);
    return NextResponse.json({ error: 'Failed to list quotes' }, { status: 500 });
  }
}
