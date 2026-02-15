import { NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { portalSessionOptions } from '@/lib/auth/portal-session';
import type { PortalSessionData } from '@/lib/auth/portal-session';
import { getSupabaseAdmin } from '@/lib/supabase/client';
import { canTransitionTo } from '@/lib/portal/status';

const MAX_ATTEMPTS = 5;

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: portalId } = await params;
    const body = await request.json();
    const { code } = body;

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    // Get the latest unverified code for this portal
    const { data: verification, error: fetchError } = await supabase
      .from('portal_verification')
      .select('*')
      .eq('portal_id', portalId)
      .eq('verified', false)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (fetchError || !verification) {
      return NextResponse.json({ error: 'No verification code found. Please request a new one.' }, { status: 400 });
    }

    // Check attempts
    if (verification.attempts >= MAX_ATTEMPTS) {
      return NextResponse.json({ error: 'Too many attempts. Please request a new code.' }, { status: 429 });
    }

    // Check expiry
    if (new Date(verification.expires_at) < new Date()) {
      return NextResponse.json({ error: 'Code expired. Please request a new one.' }, { status: 410 });
    }

    // Increment attempts
    await supabase
      .from('portal_verification')
      .update({ attempts: verification.attempts + 1 })
      .eq('id', verification.id);

    // Check code
    if (verification.code !== code.trim()) {
      const remaining = MAX_ATTEMPTS - verification.attempts - 1;
      return NextResponse.json({
        error: `Invalid code. ${remaining} attempt${remaining !== 1 ? 's' : ''} remaining.`,
      }, { status: 400 });
    }

    // Mark as verified
    await supabase
      .from('portal_verification')
      .update({ verified: true })
      .eq('id', verification.id);

    // Update portal status
    const { data: portal } = await supabase
      .from('portals')
      .select('status')
      .eq('id', portalId)
      .single();

    if (portal && canTransitionTo(portal.status, 'email_verified')) {
      await supabase
        .from('portals')
        .update({ status: 'email_verified', updated_at: new Date().toISOString() })
        .eq('id', portalId);
    }

    // Set portal session cookie
    const session = await getIronSession<PortalSessionData>(await cookies(), portalSessionOptions);
    session.portalId = portalId;
    session.email = verification.email;
    session.verified = true;
    await session.save();

    return NextResponse.json({ status: 'success', message: 'Email verified' });
  } catch (error) {
    console.error('Verify code error:', error);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
