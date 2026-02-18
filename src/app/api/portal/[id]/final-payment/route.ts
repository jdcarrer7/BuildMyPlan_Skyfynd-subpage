import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/client';
import { getPaymentModel } from '@/lib/portal/payment-model';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: portalId } = await params;
    const supabase = getSupabaseAdmin();

    // Get portal
    const { data: portal, error } = await supabase
      .from('portals')
      .select('id, qr_number, client_name, client_email, quote_data, status, expires_at')
      .eq('id', portalId)
      .single();

    if (error || !portal) {
      return NextResponse.json({ error: 'Portal not found' }, { status: 404 });
    }

    // Check expiry
    if (new Date(portal.expires_at) < new Date()) {
      return NextResponse.json({ error: 'This portal has expired' }, { status: 410 });
    }

    // Must be in payment_completed state (deposit paid, project in progress)
    if (portal.status !== 'payment_completed') {
      return NextResponse.json({ error: 'Portal not eligible for final payment' }, { status: 400 });
    }

    // Subscription-only portals have no final payment
    const totals = portal.quote_data?.totals || { oneTimeTotal: 0, monthlyTotal: 0, grandTotal: 0 };
    const paymentModel = getPaymentModel(totals);
    if (paymentModel === 'subscription-only') {
      return NextResponse.json({ error: 'Subscription-only portals have no final payment' }, { status: 400 });
    }

    // Get completed deposit payment
    const { data: deposit } = await supabase
      .from('portal_payments')
      .select('amount, paid_at')
      .eq('portal_id', portalId)
      .eq('payment_type', 'deposit')
      .eq('status', 'completed')
      .single();

    if (!deposit) {
      return NextResponse.json({ error: 'No deposit payment found' }, { status: 400 });
    }

    // Check if final payment already exists
    const { data: finalPayment } = await supabase
      .from('portal_payments')
      .select('status, paid_at')
      .eq('portal_id', portalId)
      .eq('payment_type', 'final')
      .single();

    // For mixed quotes, remaining balance is based on one-time total only
    const baseForDeposit = paymentModel === 'mixed'
      ? (totals.oneTimeTotal || 0)
      : (totals.grandTotal || 0);
    const depositAmountCents = deposit.amount;
    const remainingCents = Math.round(baseForDeposit * 100) - depositAmountCents;

    return NextResponse.json({
      status: 'success',
      qrNumber: portal.qr_number,
      clientName: portal.client_name,
      grandTotal: baseForDeposit,
      depositAmount: depositAmountCents,
      depositPaidAt: deposit.paid_at,
      remainingAmount: remainingCents,
      finalPaymentStatus: finalPayment?.status || null,
      finalPaymentPaidAt: finalPayment?.paid_at || null,
    });
  } catch (error) {
    console.error('Final payment data error:', error);
    return NextResponse.json({ error: 'Failed to load payment data' }, { status: 500 });
  }
}
