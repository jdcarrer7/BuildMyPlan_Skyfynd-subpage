import { NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { sessionOptions } from '@/lib/auth/session';
import type { SessionData } from '@/lib/types/admin';
import { getSupabaseAdmin } from '@/lib/supabase/client';
import { buildFinalPaymentEmail } from '@/lib/portal/email';
import { sendEmail } from '@/lib/email/resend';
import { getPaymentModel } from '@/lib/portal/payment-model';

export async function POST(request: Request) {
  try {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
    if (!session.isLoggedIn) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    if (!body.qrNumber) {
      return NextResponse.json({ error: 'QR number is required' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    // Find the portal with payment_completed status for this QR
    const { data: portal, error: portalError } = await supabase
      .from('portals')
      .select('*')
      .eq('qr_number', body.qrNumber)
      .eq('status', 'payment_completed')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (portalError || !portal) {
      return NextResponse.json({ error: 'No in-progress portal found for this quote' }, { status: 404 });
    }

    // Get the completed deposit payment
    const { data: deposit, error: depositError } = await supabase
      .from('portal_payments')
      .select('amount, paid_at')
      .eq('portal_id', portal.id)
      .eq('payment_type', 'deposit')
      .eq('status', 'completed')
      .single();

    if (depositError || !deposit) {
      return NextResponse.json({ error: 'No completed deposit found' }, { status: 400 });
    }

    // Check if final payment already completed
    const { data: existingFinal } = await supabase
      .from('portal_payments')
      .select('status')
      .eq('portal_id', portal.id)
      .eq('payment_type', 'final')
      .eq('status', 'completed')
      .single();

    if (existingFinal) {
      return NextResponse.json({ error: 'Final payment has already been completed' }, { status: 400 });
    }

    // Subscription-only portals have no final payment
    const totals = portal.quote_data?.totals || { oneTimeTotal: 0, monthlyTotal: 0, grandTotal: 0 };
    const paymentModel = getPaymentModel(totals);
    if (paymentModel === 'subscription-only') {
      return NextResponse.json({ error: 'Subscription-only portals have no final payment' }, { status: 400 });
    }

    // Build and send email — for mixed quotes, base on one-time total only
    const baseForDeposit = paymentModel === 'mixed'
      ? (totals.oneTimeTotal || 0)
      : (totals.grandTotal || 0);
    const depositDollars = deposit.amount / 100;
    const clientEmail = portal.client_email;
    const clientName = portal.client_name;

    const htmlBody = buildFinalPaymentEmail(
      portal.id,
      clientName,
      portal.qr_number,
      baseForDeposit,
      depositDollars,
      deposit.paid_at || portal.created_at
    );

    const subject = `Final Payment \u2014 ${portal.qr_number}`;
    const remainingBalance = baseForDeposit - depositDollars;

    await sendEmail({
      to: clientEmail,
      subject,
      html: htmlBody,
      text: `Hi ${clientName},\n\nYour project is nearing completion. Please complete your final payment of $${remainingBalance.toLocaleString()}.\n\nProject Total: $${baseForDeposit.toLocaleString()}\nDeposit Paid: $${depositDollars.toLocaleString()}\nRemaining Balance: $${remainingBalance.toLocaleString()}\n\nSkyfynd — Software for Businesses`,
    });

    return NextResponse.json({
      status: 'success',
      message: `Final payment request sent to ${clientEmail}`,
    });
  } catch (error) {
    console.error('Send final payment error:', error);
    return NextResponse.json({ error: 'Failed to send final payment request' }, { status: 500 });
  }
}
