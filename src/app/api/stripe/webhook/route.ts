import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe/client';
import { getSupabaseAdmin } from '@/lib/supabase/client';
import { buildPaymentConfirmationEmail } from '@/lib/portal/email';
import { sendEmail } from '@/lib/email/resend';
import { ADMIN_EMAILS } from '@/lib/email/constants';
import { generateSignedAgreementPDFBuffer } from '@/lib/portal/generate-signed-pdf';
import { getPaymentModel } from '@/lib/portal/payment-model';

async function sendConfirmationEmail(
  clientEmail: string,
  clientName: string,
  qrNumber: string,
  amountCents: number,
  paymentType: 'deposit' | 'final' | 'subscription',
  grandTotal?: number,
  depositAmountDollars?: number,
  monthlyAmountDollars?: number,
  attachments?: { filename: string; content: Uint8Array }[]
) {
  const amountDollars = amountCents / 100;

  const subjectMap: Record<string, string> = {
    deposit: `Deposit Confirmation — ${qrNumber}`,
    final: `Payment Confirmation — ${qrNumber}`,
    subscription: `Subscription Confirmed — ${qrNumber}`,
  };
  const subject = subjectMap[paymentType];

  const adminSubjectMap: Record<string, string> = {
    deposit: `Deposit Received — ${qrNumber} (${clientName})`,
    final: `Final Payment Received — ${qrNumber} (${clientName})`,
    subscription: `Subscription Started — ${qrNumber} (${clientName})`,
  };

  const htmlBody = buildPaymentConfirmationEmail(
    clientName,
    qrNumber,
    amountDollars,
    paymentType,
    grandTotal,
    depositAmountDollars,
    monthlyAmountDollars
  );

  const textMap: Record<string, string> = {
    deposit: `Hi ${clientName},\n\nWe've received your deposit of $${amountDollars.toLocaleString()} for ${qrNumber}.\n\nThank you!\nSkyfynd`,
    final: `Hi ${clientName},\n\nWe've received your final payment of $${amountDollars.toLocaleString()} for ${qrNumber}.\n\nThank you!\nSkyfynd`,
    subscription: `Hi ${clientName},\n\nYour subscription of $${(monthlyAmountDollars || amountDollars).toLocaleString()}/mo for ${qrNumber} is now active.\n\nThank you!\nSkyfynd`,
  };
  const textBody = textMap[paymentType];

  await Promise.allSettled([
    sendEmail({
      to: clientEmail,
      subject,
      html: htmlBody,
      text: textBody,
      attachments,
    }),
    sendEmail({
      to: ADMIN_EMAILS,
      subject: adminSubjectMap[paymentType],
      html: htmlBody,
      text: textBody,
      attachments,
    }),
  ]);
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
      const paymentType = (session.metadata?.payment_type || 'deposit') as 'deposit' | 'final' | 'subscription';
      const stripeSessionId = session.id;
      const paymentIntentId = typeof session.payment_intent === 'string'
        ? session.payment_intent
        : session.payment_intent?.id || null;
      const subscriptionId = typeof session.subscription === 'string'
        ? session.subscription
        : (session.subscription as { id?: string })?.id || null;

      if (!portalId) {
        console.error('No portal_id in session metadata');
        return NextResponse.json({ received: true });
      }

      const supabase = getSupabaseAdmin();

      if (paymentType === 'subscription') {
        // Subscription: update payment record + set portal to payment_completed
        await supabase
          .from('portal_payments')
          .update({
            status: 'completed',
            stripe_subscription_id: subscriptionId,
            paid_at: new Date().toISOString(),
          })
          .eq('stripe_session_id', stripeSessionId);

        await supabase
          .from('portals')
          .update({
            status: 'payment_completed',
            updated_at: new Date().toISOString(),
          })
          .eq('id', portalId);

      } else if (paymentType === 'deposit') {
        // Deposit: update payment record
        await supabase
          .from('portal_payments')
          .update({
            status: 'completed',
            stripe_payment_intent_id: paymentIntentId,
            paid_at: new Date().toISOString(),
          })
          .eq('stripe_session_id', stripeSessionId);

        // For mixed quotes, keep portal at contract_signed (subscription step next).
        // For one-time quotes, set to payment_completed.
        const { data: portal } = await supabase
          .from('portals')
          .select('quote_data')
          .eq('id', portalId)
          .single();

        const totals = portal?.quote_data?.totals || { oneTimeTotal: 0, monthlyTotal: 0 };
        const model = getPaymentModel(totals);

        if (model !== 'mixed') {
          await supabase
            .from('portals')
            .update({
              status: 'payment_completed',
              updated_at: new Date().toISOString(),
            })
            .eq('id', portalId);
        }

      } else {
        // Final payment: existing behavior
        await supabase
          .from('portal_payments')
          .update({
            status: 'completed',
            stripe_payment_intent_id: paymentIntentId,
            paid_at: new Date().toISOString(),
          })
          .eq('stripe_session_id', stripeSessionId);
      }

      // ── Send confirmation email ──
      try {
        const { data: portalData } = await supabase
          .from('portals')
          .select('client_email, client_name, qr_number, quote_data')
          .eq('id', portalId)
          .single();

        if (portalData) {
          const amountCents = session.amount_total || 0;
          const grandTotal = portalData.quote_data?.totals?.grandTotal || 0;
          const monthlyTotal = portalData.quote_data?.totals?.monthlyTotal || 0;

          if (paymentType === 'subscription') {
            await sendConfirmationEmail(
              portalData.client_email, portalData.client_name, portalData.qr_number,
              amountCents, 'subscription', undefined, undefined, monthlyTotal
            );
          } else if (paymentType === 'final') {
            const { data: deposit } = await supabase
              .from('portal_payments')
              .select('amount')
              .eq('portal_id', portalId)
              .eq('payment_type', 'deposit')
              .eq('status', 'completed')
              .single();

            const depositDollars = deposit ? deposit.amount / 100 : 0;
            await sendConfirmationEmail(
              portalData.client_email, portalData.client_name, portalData.qr_number,
              amountCents, 'final', grandTotal, depositDollars
            );
          } else {
            // Deposit — generate signed agreement PDF for email attachment
            let pdfAttachment: { filename: string; content: Uint8Array }[] | undefined;
            try {
              const [{ data: sig }, { data: paymentRecord }] = await Promise.all([
                supabase
                  .from('portal_signatures')
                  .select('signature_data_url, signed_at')
                  .eq('portal_id', portalId)
                  .single(),
                supabase
                  .from('portal_payments')
                  .select('amount, paid_at, stripe_session_id')
                  .eq('portal_id', portalId)
                  .eq('payment_type', 'deposit')
                  .eq('status', 'completed')
                  .single(),
              ]);

              if (sig && paymentRecord) {
                const pdfBytes = await generateSignedAgreementPDFBuffer({
                  portal: {
                    qr_number: portalData.qr_number,
                    client_name: portalData.client_name,
                    client_email: portalData.client_email,
                    quote_data: portalData.quote_data,
                  },
                  signature: {
                    signature_data_url: sig.signature_data_url,
                    signed_at: sig.signed_at,
                  },
                  payment: {
                    amount: paymentRecord.amount,
                    paid_at: paymentRecord.paid_at,
                    confirmation_id: paymentRecord.stripe_session_id,
                  },
                });
                pdfAttachment = [{
                  filename: `${portalData.qr_number}_Signed_Agreement.pdf`,
                  content: pdfBytes,
                }];
              }
            } catch (pdfErr) {
              console.error('Failed to generate PDF attachment:', pdfErr);
            }

            await sendConfirmationEmail(
              portalData.client_email, portalData.client_name, portalData.qr_number,
              amountCents, 'deposit', undefined, undefined, undefined, pdfAttachment
            );
          }
        }
      } catch (emailErr) {
        console.error('Failed to send confirmation email:', emailErr);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook failed' }, { status: 400 });
  }
}
