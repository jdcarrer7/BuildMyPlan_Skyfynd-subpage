import { NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { sessionOptions } from '@/lib/auth/session';
import type { SessionData } from '@/lib/types/admin';
import dns from 'dns';

dns.setDefaultResultOrder('ipv4first');

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

      return NextResponse.json(result);
    } finally {
      clearTimeout(timeout);
    }
  } catch (error) {
    console.error('List quotes error:', error);
    return NextResponse.json({ error: 'Failed to list quotes' }, { status: 500 });
  }
}
