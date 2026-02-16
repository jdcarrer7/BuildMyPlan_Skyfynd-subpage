import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe/client';
import { getSupabaseAdmin } from '@/lib/supabase/client';
import { buildPaymentConfirmationEmail } from '@/lib/portal/email';
import nodemailer from 'nodemailer';

async function sendConfirmationEmail(
  clientEmail: string,
  clientName: string,
  qrNumber: string,
  amountCents: number,
  paymentType: 'deposit' | 'final',
  grandTotal?: number,
  depositAmountDollars?: number
) {
  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;
  if (!gmailUser || !gmailPass) {
    console.error('Email credentials not configured, skipping confirmation email');
    return;
  }

  const amountDollars = amountCents / 100;
  const subject = paymentType === 'deposit'
    ? `Deposit Confirmation — ${qrNumber}`
    : `Payment Confirmation — ${qrNumber}`;

  const htmlBody = buildPaymentConfirmationEmail(
    clientName,
    qrNumber,
    amountDollars,
    paymentType,
    grandTotal,
    depositAmountDollars
  );

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: gmailUser, pass: gmailPass },
  });

  await transporter.sendMail({
    from: `"SkyFynd" <${gmailUser}>`,
    to: clientEmail,
    subject,
    text: `Hi ${clientName},\n\nWe've received your ${paymentType === 'deposit' ? 'deposit' : 'final'} payment of $${amountDollars.toLocaleString()} for ${qrNumber}.\n\nThank you!\nSkyfynd`,
    html: htmlBody,
  });
}

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
      const paymentType = (session.metadata?.payment_type || 'deposit') as 'deposit' | 'final';
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

      // Only update portal status for deposit payments
      if (paymentType === 'deposit') {
        await supabase
          .from('portals')
          .update({
            status: 'payment_completed',
            updated_at: new Date().toISOString(),
          })
          .eq('id', portalId);
      }

      // Send confirmation email
      try {
        const { data: portal } = await supabase
          .from('portals')
          .select('client_email, client_name, qr_number, quote_data')
          .eq('id', portalId)
          .single();

        if (portal) {
          const amountCents = session.amount_total || 0;
          const grandTotal = portal.quote_data?.totals?.grandTotal || 0;

          if (paymentType === 'final') {
            // Get deposit amount for the breakdown
            const { data: deposit } = await supabase
              .from('portal_payments')
              .select('amount')
              .eq('portal_id', portalId)
              .eq('payment_type', 'deposit')
              .eq('status', 'completed')
              .single();

            const depositDollars = deposit ? deposit.amount / 100 : 0;
            await sendConfirmationEmail(
              portal.client_email, portal.client_name, portal.qr_number,
              amountCents, 'final', grandTotal, depositDollars
            );
          } else {
            await sendConfirmationEmail(
              portal.client_email, portal.client_name, portal.qr_number,
              amountCents, 'deposit'
            );
          }
        }
      } catch (emailErr) {
        console.error('Failed to send confirmation email:', emailErr);
        // Don't fail the webhook for email errors
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook failed' }, { status: 400 });
  }
}
