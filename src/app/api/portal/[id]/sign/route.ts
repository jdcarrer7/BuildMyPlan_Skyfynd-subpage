import { NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { portalSessionOptions } from '@/lib/auth/portal-session';
import type { PortalSessionData } from '@/lib/auth/portal-session';
import { getSupabaseAdmin } from '@/lib/supabase/client';
import { canTransitionTo } from '@/lib/portal/status';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: portalId } = await params;

    // Verify portal session
    const session = await getIronSession<PortalSessionData>(await cookies(), portalSessionOptions);
    if (!session.verified || session.portalId !== portalId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { signatureDataUrl, clientName } = body;

    if (!signatureDataUrl || !clientName) {
      return NextResponse.json({ error: 'Signature and client name are required' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    // Get current portal status
    const { data: portal, error } = await supabase
      .from('portals')
      .select('status, client_email')
      .eq('id', portalId)
      .single();

    if (error || !portal) {
      return NextResponse.json({ error: 'Portal not found' }, { status: 404 });
    }

    if (!canTransitionTo(portal.status, 'contract_signed')) {
      return NextResponse.json({
        error: `Cannot sign contract from current status: ${portal.status}`,
      }, { status: 400 });
    }

    // Extract audit trail info from request headers
    const forwarded = request.headers.get('x-forwarded-for');
    const ipAddress = forwarded ? forwarded.split(',')[0].trim() : request.headers.get('x-real-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Insert signature record
    const { error: sigError } = await supabase
      .from('portal_signatures')
      .insert({
        portal_id: portalId,
        signature_data_url: signatureDataUrl,
        client_name: clientName,
        client_email: portal.client_email,
        ip_address: ipAddress,
        user_agent: userAgent,
      });

    if (sigError) {
      console.error('Signature insert error:', sigError);
      return NextResponse.json({ error: 'Failed to save signature' }, { status: 500 });
    }

    // Update portal status
    await supabase
      .from('portals')
      .update({ status: 'contract_signed', updated_at: new Date().toISOString() })
      .eq('id', portalId);

    return NextResponse.json({ status: 'success', message: 'Contract signed' });
  } catch (error) {
    console.error('Sign error:', error);
    return NextResponse.json({ error: 'Failed to sign contract' }, { status: 500 });
  }
}
