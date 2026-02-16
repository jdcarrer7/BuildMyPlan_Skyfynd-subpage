import { NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { portalSessionOptions } from '@/lib/auth/portal-session';
import type { PortalSessionData } from '@/lib/auth/portal-session';
import { getSupabaseAdmin } from '@/lib/supabase/client';

export async function GET(
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

    const supabase = getSupabaseAdmin();

    // Get portal + signature data
    const { data: portal, error: portalError } = await supabase
      .from('portals')
      .select('*')
      .eq('id', portalId)
      .single();

    if (portalError || !portal) {
      return NextResponse.json({ error: 'Portal not found' }, { status: 404 });
    }

    const { data: signature, error: sigError } = await supabase
      .from('portal_signatures')
      .select('*')
      .eq('portal_id', portalId)
      .single();

    if (sigError || !signature) {
      return NextResponse.json({ error: 'No signature found' }, { status: 404 });
    }

    // Get payment data if available
    const { data: payment } = await supabase
      .from('portal_payments')
      .select('amount, status, paid_at, stripe_session_id')
      .eq('portal_id', portalId)
      .eq('status', 'completed')
      .single();

    // Return data needed for client-side PDF generation
    return NextResponse.json({
      status: 'success',
      portal: {
        id: portal.id,
        qr_number: portal.qr_number,
        client_name: portal.client_name,
        client_email: portal.client_email,
        client_company: portal.client_company,
        quote_data: portal.quote_data,
        created_at: portal.created_at,
      },
      signature: {
        signature_data_url: signature.signature_data_url,
        client_name: signature.client_name,
        signed_at: signature.signed_at,
        ip_address: signature.ip_address,
      },
      payment: payment ? {
        amount: payment.amount,
        paid_at: payment.paid_at,
        confirmation_id: payment.stripe_session_id,
      } : null,
    });
  } catch (error) {
    console.error('Contract PDF error:', error);
    return NextResponse.json({ error: 'Failed to generate contract' }, { status: 500 });
  }
}
