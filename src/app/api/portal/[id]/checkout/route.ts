import { NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { portalSessionOptions } from '@/lib/auth/portal-session';
import type { PortalSessionData } from '@/lib/auth/portal-session';
import { getSupabaseAdmin } from '@/lib/supabase/client';
import { getStripe, findOrCreateStripeCustomer } from '@/lib/stripe/client';
import { getPaymentModel } from '@/lib/portal/payment-model';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: portalId } = await params;
    const body = await request.json().catch(() => ({}));

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

    // Allow checkout from contract_signed OR payment_completed (for mixed: deposit done, subscription next)
    if (portal.status !== 'contract_signed' && portal.status !== 'payment_completed') {
      return NextResponse.json({
        error: 'Contract must be signed before payment',
      }, { status: 400 });
    }

    const totals = portal.quote_data?.totals || { oneTimeTotal: 0, monthlyTotal: 0, grandTotal: 0 };
    const paymentModel = getPaymentModel(totals);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const stripe = getStripe();
    const serviceCount = portal.quote_data?.services?.length || 0;

    // Determine checkout type:
    // - Explicit from body (for mixed quotes doing step-by-step)
    // - Auto-detect: subscription-only → subscription, otherwise → deposit
    const checkoutType: 'deposit' | 'subscription' =
      body.checkoutType ||
      (paymentModel === 'subscription-only' ? 'subscription' : 'deposit');

    // ── Subscription checkout ──
    if (checkoutType === 'subscription') {
      const monthlyCents = Math.round(totals.monthlyTotal * 100);
      if (monthlyCents < 50) {
        return NextResponse.json({ error: 'Amount too low for payment' }, { status: 400 });
      }

      const customer = await findOrCreateStripeCustomer(stripe, portal.client_email, portal.client_name);

      const checkoutSession = await stripe.checkout.sessions.create({
        mode: 'subscription',
        customer: customer.id,
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: `Skyfynd Monthly Service — ${portal.qr_number}`,
                description: `Monthly subscription for ${serviceCount} service(s)`,
              },
              unit_amount: monthlyCents,
              recurring: { interval: 'month' },
            },
            quantity: 1,
          },
        ],
        metadata: {
          portal_id: portalId,
          qr_number: portal.qr_number,
          payment_type: 'subscription',
        },
        success_url: `${baseUrl}/portal/${portalId}/success?session_id={CHECKOUT_SESSION_ID}&model=subscription`,
        cancel_url: `${baseUrl}/portal/${portalId}`,
      });

      await supabase
        .from('portal_payments')
        .upsert({
          portal_id: portalId,
          stripe_session_id: checkoutSession.id,
          amount: monthlyCents,
          currency: 'usd',
          status: 'pending',
          payment_type: 'subscription',
        }, { onConflict: 'portal_id,payment_type' });

      return NextResponse.json({
        status: 'success',
        checkoutUrl: checkoutSession.url,
      });
    }

    // ── Deposit checkout ──
    const isOneTimeOnly = paymentModel === 'one-time';
    const depositBase = isOneTimeOnly ? (totals.grandTotal || 0) : (totals.oneTimeTotal || 0);
    const depositAmount = Math.round(depositBase * 0.5 * 100);

    if (depositAmount < 50) {
      return NextResponse.json({ error: 'Amount too low for payment' }, { status: 400 });
    }

    const depositDescription = isOneTimeOnly
      ? `50% deposit for ${serviceCount} service(s)`
      : `50% deposit on one-time services`;

    // For mixed quotes, after deposit redirect back to portal (subscription step next).
    // For one-time quotes, go to success page.
    const successUrl = paymentModel === 'mixed'
      ? `${baseUrl}/portal/${portalId}/success?session_id={CHECKOUT_SESSION_ID}&model=deposit`
      : `${baseUrl}/portal/${portalId}/success?session_id={CHECKOUT_SESSION_ID}`;

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: portal.client_email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Skyfynd Project Deposit — ${portal.qr_number}`,
              description: depositDescription,
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
      success_url: successUrl,
      cancel_url: `${baseUrl}/portal/${portalId}`,
    });

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
