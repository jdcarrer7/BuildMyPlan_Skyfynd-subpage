import { NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { sessionOptions } from '@/lib/auth/session';
import type { SessionData } from '@/lib/types/admin';
import dns from 'dns';

dns.setDefaultResultOrder('ipv4first');

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

    const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;
    if (!scriptUrl) {
      return NextResponse.json({ error: 'Script URL not configured' }, { status: 500 });
    }

    const url = `${scriptUrl}?action=get_quote&qr=${encodeURIComponent(qr)}`;
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
        return NextResponse.json({ error: 'Unexpected response' }, { status: 500 });
      }

      return NextResponse.json(result);
    } finally {
      clearTimeout(timeout);
    }
  } catch (error) {
    console.error('Get quote error:', error);
    return NextResponse.json({ error: 'Failed to get quote' }, { status: 500 });
  }
}
