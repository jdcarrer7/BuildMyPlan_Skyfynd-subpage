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

    const totals = portal.quote_data?.totals || { oneTimeTotal: 0, monthlyTotal: 0, grandTotal: 0 };
    const paymentModel = getPaymentModel(totals);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const stripe = getStripe();
    const serviceCount = portal.quote_data?.services?.length || 0;

    // ── Subscription-only: start a Stripe subscription, no deposit ──
    if (paymentModel === 'subscription-only') {
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

    // ── Mixed: deposit (50% of one-time) + subscription, single checkout ──
    if (paymentModel === 'mixed') {
      const depositCents = Math.round(totals.oneTimeTotal * 0.5 * 100);
      const monthlyCents = Math.round(totals.monthlyTotal * 100);

      if (depositCents < 50 && monthlyCents < 50) {
        return NextResponse.json({ error: 'Amount too low for payment' }, { status: 400 });
      }

      const customer = await findOrCreateStripeCustomer(stripe, portal.client_email, portal.client_name);

      // Add the one-time deposit as a pending invoice item on the customer.
      // Stripe attaches it to the first subscription invoice automatically.
      if (depositCents >= 50) {
        await stripe.invoiceItems.create({
          customer: customer.id,
          amount: depositCents,
          currency: 'usd',
          description: `Project Deposit (50%) — ${portal.qr_number}`,
        });
      }

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
          payment_type: 'mixed',
          deposit_amount: String(depositCents),
        },
        success_url: `${baseUrl}/portal/${portalId}/success?session_id={CHECKOUT_SESSION_ID}&model=mixed`,
        cancel_url: `${baseUrl}/portal/${portalId}`,
      });

      // Record both payment types
      await Promise.all([
        supabase
          .from('portal_payments')
          .upsert({
            portal_id: portalId,
            stripe_session_id: checkoutSession.id,
            amount: depositCents,
            currency: 'usd',
            status: 'pending',
            payment_type: 'deposit',
          }, { onConflict: 'portal_id,payment_type' }),
        supabase
          .from('portal_payments')
          .upsert({
            portal_id: portalId,
            stripe_session_id: checkoutSession.id,
            amount: monthlyCents,
            currency: 'usd',
            status: 'pending',
            payment_type: 'subscription',
          }, { onConflict: 'portal_id,payment_type' }),
      ]);

      return NextResponse.json({
        status: 'success',
        checkoutUrl: checkoutSession.url,
      });
    }

    // ── One-time only: unchanged 50% deposit flow ──
    const grandTotal = totals.grandTotal || 0;
    const depositAmount = Math.round(grandTotal * 0.5 * 100);

    if (depositAmount < 50) {
      return NextResponse.json({ error: 'Amount too low for payment' }, { status: 400 });
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: portal.client_email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Skyfynd Project Deposit — ${portal.qr_number}`,
              description: `50% deposit for ${serviceCount} service(s)`,
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
