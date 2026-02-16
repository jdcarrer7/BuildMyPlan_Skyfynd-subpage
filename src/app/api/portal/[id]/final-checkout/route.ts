import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/client';
import { getStripe } from '@/lib/stripe/client';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: portalId } = await params;
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

    if (portal.status !== 'payment_completed') {
      return NextResponse.json({ error: 'Portal not eligible for final payment' }, { status: 400 });
    }

    // Get deposit payment to calculate remaining balance
    const { data: deposit } = await supabase
      .from('portal_payments')
      .select('amount')
      .eq('portal_id', portalId)
      .eq('payment_type', 'deposit')
      .eq('status', 'completed')
      .single();

    if (!deposit) {
      return NextResponse.json({ error: 'No deposit payment found' }, { status: 400 });
    }

    // Check if final payment already completed
    const { data: existingFinal } = await supabase
      .from('portal_payments')
      .select('status')
      .eq('portal_id', portalId)
      .eq('payment_type', 'final')
      .eq('status', 'completed')
      .single();

    if (existingFinal) {
      return NextResponse.json({ error: 'Final payment has already been completed' }, { status: 400 });
    }

    const grandTotal = portal.quote_data?.totals?.grandTotal || 0;
    const grandTotalCents = Math.round(grandTotal * 100);
    const remainingAmount = grandTotalCents - deposit.amount;

    if (remainingAmount < 50) {
      return NextResponse.json({ error: 'Amount too low for payment' }, { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const stripe = getStripe();

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: portal.client_email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `SkyFynd Final Payment \u2014 ${portal.qr_number}`,
              description: `Remaining balance for ${portal.quote_data?.services?.length || 0} service(s)`,
            },
            unit_amount: remainingAmount,
          },
          quantity: 1,
        },
      ],
      metadata: {
        portal_id: portalId,
        qr_number: portal.qr_number,
        payment_type: 'final',
      },
      success_url: `${baseUrl}/portal/${portalId}/final-payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/portal/${portalId}/final-payment`,
    });

    // Record payment in Supabase
    await supabase
      .from('portal_payments')
      .upsert({
        portal_id: portalId,
        stripe_session_id: checkoutSession.id,
        amount: remainingAmount,
        currency: 'usd',
        status: 'pending',
        payment_type: 'final',
      }, { onConflict: 'portal_id,payment_type' });

    return NextResponse.json({
      status: 'success',
      checkoutUrl: checkoutSession.url,
    });
  } catch (error: unknown) {
    console.error('Final checkout error:', error);
    const message = error instanceof Error ? error.message : 'Failed to create checkout session';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
