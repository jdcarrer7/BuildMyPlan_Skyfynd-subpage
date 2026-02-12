import { NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { sessionOptions, defaultSession } from '@/lib/auth/session';
import type { SessionData } from '@/lib/types/admin';

export async function GET() {
  try {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);

    if (!session.isLoggedIn) {
      return NextResponse.json(defaultSession);
    }

    return NextResponse.json({
      isLoggedIn: session.isLoggedIn,
      email: session.email,
      name: session.name,
    });
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json(defaultSession);
  }
}
