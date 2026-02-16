import { NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { sessionOptions } from '@/lib/auth/session';
import type { SessionData } from '@/lib/types/admin';
import { getSupabaseAdmin } from '@/lib/supabase/client';
import { buildFinalPaymentEmail } from '@/lib/portal/email';
import nodemailer from 'nodemailer';
try { require('dns').setDefaultResultOrder('ipv4first'); } catch {}

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

    // Build and send email
    const grandTotal = portal.quote_data?.totals?.grandTotal || 0;
    const depositDollars = deposit.amount / 100;
    const clientEmail = portal.client_email;
    const clientName = portal.client_name;

    const htmlBody = buildFinalPaymentEmail(
      portal.id,
      clientName,
      portal.qr_number,
      grandTotal,
      depositDollars,
      deposit.paid_at || portal.created_at
    );

    const subject = `Final Payment \u2014 ${portal.qr_number}`;

    const gmailUser = process.env.GMAIL_USER;
    const gmailPass = process.env.GMAIL_APP_PASSWORD;
    if (!gmailUser || !gmailPass) {
      return NextResponse.json({ error: 'Email credentials not configured' }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: gmailUser, pass: gmailPass },
    });

    const remainingBalance = grandTotal - depositDollars;

    await transporter.sendMail({
      from: `"SkyFynd" <${gmailUser}>`,
      to: clientEmail,
      subject,
      text: `Hi ${clientName},\n\nYour project is nearing completion. Please complete your final payment of $${remainingBalance.toLocaleString()}.\n\nProject Total: $${grandTotal.toLocaleString()}\nDeposit Paid: $${depositDollars.toLocaleString()}\nRemaining Balance: $${remainingBalance.toLocaleString()}\n\nSkyfynd — Software for Businesses`,
      html: htmlBody,
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
