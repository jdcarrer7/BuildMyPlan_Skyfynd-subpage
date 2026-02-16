import { NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { portalSessionOptions } from '@/lib/auth/portal-session';
import type { PortalSessionData } from '@/lib/auth/portal-session';
import { getSupabaseAdmin } from '@/lib/supabase/client';
import { getStripe } from '@/lib/stripe/client';
// Force IPv4 to avoid IPv6 connection timeouts with Stripe API
try { require('dns').setDefaultResultOrder('ipv4first'); } catch {}

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

    const supabase = getSupabaseAdmin();

    // Get portal data
    const { data: portal, error } = await supabase
      .from('portals')
      .select('*')
      .eq('id', portalId)
      .single();

    if (error || !portal) {
      return NextResponse.json({ error: 'Portal not found' }, { status: 404 });
    }

    if (portal.status !== 'contract_signed') {
      return NextResponse.json({
        error: 'Contract must be signed before payment',
      }, { status: 400 });
    }

    // Calculate 50% deposit in cents
    const grandTotal = portal.quote_data?.totals?.grandTotal || 0;
    const depositAmount = Math.round(grandTotal * 0.5 * 100); // 50% in cents

    if (depositAmount < 50) {
      return NextResponse.json({ error: 'Amount too low for payment' }, { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const stripe = getStripe();

    // Create Stripe Checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: portal.client_email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `SkyFynd Project Deposit — ${portal.qr_number}`,
              description: `50% deposit for ${portal.quote_data?.services?.length || 0} service(s)`,
            },
            unit_amount: depositAmount,
          },
          quantity: 1,
        },
      ],
      metadata: {
        portal_id: portalId,
        qr_number: portal.qr_number,
        payment_type: 'deposit',
      },
      success_url: `${baseUrl}/portal/${portalId}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/portal/${portalId}`,
    });

    // Record payment in Supabase (upsert in case of retry)
    await supabase
      .from('portal_payments')
      .upsert({
        portal_id: portalId,
        stripe_session_id: checkoutSession.id,
        amount: depositAmount,
        currency: 'usd',
        status: 'pending',
        payment_type: 'deposit',
      }, { onConflict: 'portal_id,payment_type' });

    return NextResponse.json({
      status: 'success',
      checkoutUrl: checkoutSession.url,
    });
  } catch (error: unknown) {
    console.error('Checkout error:', error);
    const message = error instanceof Error ? error.message : 'Failed to create checkout session';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
