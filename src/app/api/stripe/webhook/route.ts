import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe/client';
import { getSupabaseAdmin } from '@/lib/supabase/client';

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json({ error: 'No signature' }, { status: 400 });
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error('Missing STRIPE_WEBHOOK_SECRET');
      return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 });
    }

    const stripe = getStripe();
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const portalId = session.metadata?.portal_id;
      const stripeSessionId = session.id;
      const paymentIntentId = typeof session.payment_intent === 'string'
        ? session.payment_intent
        : session.payment_intent?.id || null;

      if (!portalId) {
        console.error('No portal_id in session metadata');
        return NextResponse.json({ received: true });
      }

      const supabase = getSupabaseAdmin();

      // Update payment record
      await supabase
        .from('portal_payments')
        .update({
          status: 'completed',
          stripe_payment_intent_id: paymentIntentId,
          paid_at: new Date().toISOString(),
        })
        .eq('stripe_session_id', stripeSessionId);

      // Update portal status
      await supabase
        .from('portals')
        .update({
          status: 'payment_completed',
          updated_at: new Date().toISOString(),
        })
        .eq('id', portalId);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook failed' }, { status: 400 });
  }
}
