import { NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { sessionOptions } from '@/lib/auth/session';
import type { SessionData } from '@/lib/types/admin';
import type { QuoteJSON, ResolvedServiceConfig, ResolvedStep } from '@/lib/types/admin';
import nodemailer from 'nodemailer';
try { require('dns').setDefaultResultOrder('ipv4first'); } catch {}

const LOGO_URL = 'https://f005.backblazeb2.com/file/SKYFYND-assets/Skyfynd+logo.png';

function fmt(n: number): string {
  return Number(n).toLocaleString('en-US');
}

function buildQuoteHtml(q: QuoteJSON): string {
  const customer = q.customer || { name: '', email: '', company: '', phone: '', notes: '' };
  const services: ResolvedServiceConfig[] = q.services || [];
  const totals = q.totals || { oneTimeTotal: 0, monthlyTotal: 0, grandTotal: 0, discountPercentage: 0, hasCustomQuote: false };
  const discounts = q.discounts || null;
  const dateStr = q.submittedAt
    ? new Date(q.submittedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : '';

  let html = '';

  html += '<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>';
  html += '<body style="margin:0;padding:0;background-color:#f4f4f7;font-family:Arial,Helvetica,sans-serif;">';
  html += '<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f7;padding:20px 0;">';
  html += '<tr><td align="center"><table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">';

  // Header
  html += '<tr><td style="background-color:#4a148c;background:linear-gradient(135deg,#4a148c 0%,#7b1fa2 50%,#9c27b0 100%);padding:30px 40px;text-align:center;">';
  html += `<img src="${LOGO_URL}" alt="SkyFynd" width="140" style="display:block;margin:0 auto 12px;max-width:140px;" />`;
  html += '<h1 style="color:#ffffff;margin:0 0 4px;font-size:22px;font-weight:700;">Quote Estimate</h1>';
  html += `<p style="color:#e1bee7;margin:0;font-size:14px;">${q.qrNumber} &bull; ${dateStr}</p>`;
  html += '</td></tr>';

  // Client Info
  html += '<tr><td style="padding:24px 40px 16px;">';
  html += '<h2 style="color:#4a148c;font-size:16px;margin:0 0 12px;border-bottom:2px solid #f0e6ff;padding-bottom:8px;">Client Information</h2>';
  html += '<table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;color:#333;">';
  const fields: [string, string][] = [
    ['Name', customer.name],
    ['Email', customer.email],
    ['Company', customer.company],
    ['Phone', customer.phone],
  ];
  for (const [label, val] of fields) {
    if (val) {
      html += `<tr><td style="padding:4px 0;color:#888;width:100px;">${label}:</td>`;
      html += `<td style="padding:4px 0;font-weight:600;">${val}</td></tr>`;
    }
  }
  html += '</table></td></tr>';

  // Service Breakdown
  html += '<tr><td style="padding:16px 40px;">';
  html += '<h2 style="color:#4a148c;font-size:16px;margin:0 0 16px;border-bottom:2px solid #f0e6ff;padding-bottom:8px;">Service Breakdown</h2>';

  for (const svc of services) {
    html += '<div style="margin-bottom:20px;">';
    html += '<table width="100%" cellpadding="0" cellspacing="0"><tr>';
    html += `<td style="background-color:#f5f0ff;padding:8px 12px;border-radius:6px;font-weight:700;color:#4a148c;font-size:14px;">${svc.serviceLabel}</td>`;
    html += '<td style="background-color:#f5f0ff;padding:8px 12px;border-radius:6px;text-align:right;font-weight:700;color:#4a148c;font-size:14px;">';
    const prices: string[] = [];
    if (svc.oneTimeTotal > 0) prices.push('$' + fmt(svc.oneTimeTotal));
    if (svc.monthlyTotal > 0) prices.push('$' + fmt(svc.monthlyTotal) + '/mo');
    html += prices.join(' + ') || '$0';
    html += '</td></tr></table>';

    const renderStep = (step: ResolvedStep, indent: number) => {
      if (step.selectedId === null && step.children) {
        html += `<tr><td colspan="3" style="padding:6px 0 2px;font-weight:700;color:#666;font-size:12px;text-transform:uppercase;">${step.stepName}</td></tr>`;
        for (const child of step.children) {
          html += '<tr>';
          html += `<td style="padding:2px 0 2px ${indent + 12}px;color:#888;width:35%;">${child.stepName}</td>`;
          html += `<td style="padding:2px 0;">${child.selectedLabel}</td>`;
          html += '<td style="padding:2px 0;text-align:right;color:#4a148c;font-weight:600;white-space:nowrap;">';
          if (child.priceImpact !== null && child.priceImpact > 0) {
            html += child.isRecurring ? '$' + fmt(child.priceImpact) + '/mo' : '$' + fmt(child.priceImpact);
          }
          html += '</td></tr>';
        }
      } else {
        html += '<tr>';
        html += `<td style="padding:2px 0 2px ${indent + 4}px;color:#888;width:35%;">${step.stepName}</td>`;
        html += `<td style="padding:2px 0;">${step.selectedLabel}</td>`;
        html += '<td style="padding:2px 0;text-align:right;color:#4a148c;font-weight:600;white-space:nowrap;">';
        if (step.priceImpact !== null && step.priceImpact > 0) {
          html += step.isRecurring ? '$' + fmt(step.priceImpact) + '/mo' : '$' + fmt(step.priceImpact);
        }
        html += '</td></tr>';
      }
    };

    if (svc.steps.length > 0) {
      html += '<table width="100%" cellpadding="0" cellspacing="0" style="font-size:13px;color:#555;margin-top:6px;">';
      for (const step of svc.steps) renderStep(step, 0);
      html += '</table>';
    }
    html += '</div>';
  }
  html += '</td></tr>';

  // Price Summary
  html += '<tr><td style="padding:0 40px 24px;">';
  html += '<h2 style="color:#4a148c;font-size:16px;margin:0 0 12px;border-bottom:2px solid #f0e6ff;padding-bottom:8px;">Price Summary</h2>';
  html += '<table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e8e0f0;border-radius:8px;overflow:hidden;">';

  html += '<tr style="background-color:#f5f0ff;">';
  html += '<td style="padding:10px 14px;font-weight:700;color:#4a148c;font-size:13px;">Service</td>';
  html += '<td style="padding:10px 14px;font-weight:700;color:#4a148c;font-size:13px;text-align:center;">One-Time</td>';
  html += '<td style="padding:10px 14px;font-weight:700;color:#4a148c;font-size:13px;text-align:right;">Monthly</td></tr>';

  services.forEach((svc, i) => {
    const bg = i % 2 === 0 ? '#ffffff' : '#faf8fd';
    html += `<tr style="background-color:${bg};">`;
    html += `<td style="padding:8px 14px;font-size:13px;color:#333;">${svc.serviceLabel}</td>`;
    html += `<td style="padding:8px 14px;font-size:13px;color:#333;text-align:center;">${svc.oneTimeTotal > 0 ? '$' + fmt(svc.oneTimeTotal) : '\u2014'}</td>`;
    html += `<td style="padding:8px 14px;font-size:13px;color:#333;text-align:right;">${svc.monthlyTotal > 0 ? '$' + fmt(svc.monthlyTotal) + '/mo' : '\u2014'}</td></tr>`;
  });

  html += '<tr style="background-color:#f5f0ff;border-top:2px solid #e8e0f0;">';
  html += `<td style="padding:8px 14px;font-weight:700;font-size:13px;color:#333;">Total One-Time</td>`;
  html += `<td style="padding:8px 14px;font-weight:700;font-size:13px;color:#333;text-align:center;">$${fmt(totals.oneTimeTotal || 0)}</td>`;
  html += '<td style="padding:8px 14px;font-size:13px;color:#888;text-align:right;"></td></tr>';

  if ((totals.monthlyTotal || 0) > 0) {
    html += '<tr style="background-color:#f5f0ff;">';
    html += '<td style="padding:8px 14px;font-weight:700;font-size:13px;color:#333;">Total Monthly</td>';
    html += '<td style="padding:8px 14px;font-size:13px;color:#888;text-align:center;"></td>';
    html += `<td style="padding:8px 14px;font-weight:700;font-size:13px;color:#333;text-align:right;">$${fmt(totals.monthlyTotal)}/mo</td></tr>`;
  }

  if (discounts && discounts.totalSaved > 0) {
    html += '<tr style="background-color:#f0fff0;">';
    html += `<td style="padding:8px 14px;font-weight:700;font-size:13px;color:#2e7d32;">Discount (${totals.discountPercentage || 0}%)</td>`;
    html += `<td colspan="2" style="padding:8px 14px;font-weight:700;font-size:13px;color:#2e7d32;text-align:right;">-$${fmt(discounts.totalSaved)}</td></tr>`;
  }

  html += '<tr style="background-color:#4a148c;background:linear-gradient(135deg,#4a148c 0%,#7b1fa2 100%);">';
  html += '<td style="padding:14px;font-weight:700;font-size:16px;color:#ffffff;">DUE TODAY</td>';
  html += `<td colspan="2" style="padding:14px;font-weight:700;font-size:20px;color:#ffffff;text-align:right;">$${fmt(totals.grandTotal || 0)}</td></tr>`;
  html += '</table></td></tr>';

  // Notes
  if (customer.notes) {
    html += '<tr><td style="padding:0 40px 24px;">';
    html += '<h2 style="color:#4a148c;font-size:14px;margin:0 0 8px;">Client Notes</h2>';
    html += `<p style="color:#555;font-size:13px;margin:0;background:#faf8fd;padding:12px;border-radius:6px;">${customer.notes}</p>`;
    html += '</td></tr>';
  }

  // Footer
  html += '<tr><td style="background-color:#f9f7fc;padding:20px 40px;text-align:center;border-top:1px solid #e8e0f0;">';
  html += '<p style="color:#888;font-size:12px;margin:0 0 6px;font-style:italic;">Price may vary based on final project specifications.</p>';
  html += '<p style="color:#999;font-size:11px;margin:0 0 4px;">This is an estimate and not a binding contract.</p>';
  html += '<p style="color:#4a148c;font-size:12px;margin:0;font-weight:600;">SkyFynd \u2014 Creative & Digital Marketing</p>';
  html += '</td></tr>';

  html += '</table></td></tr></table></body></html>';
  return html;
}

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

    // Fetch quote JSON from GAS
    const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;
    if (!scriptUrl) {
      return NextResponse.json({ error: 'Script URL not configured' }, { status: 500 });
    }

    const gasRes = await fetch(`${scriptUrl}?action=get_quote&qr=${encodeURIComponent(body.qrNumber)}`, {
      redirect: 'follow',
    });
    const gasText = await gasRes.text();
    let gasData;
    try {
      gasData = JSON.parse(gasText);
    } catch {
      return NextResponse.json({ error: 'Failed to fetch quote data' }, { status: 500 });
    }

    if (gasData.status !== 'success' || !gasData.quote) {
      return NextResponse.json({ error: gasData.message || 'Quote not found' }, { status: 404 });
    }

    const quote: QuoteJSON = gasData.quote;
    const clientEmail = quote.customer?.email;
    if (!clientEmail) {
      return NextResponse.json({ error: 'No client email found for this quote' }, { status: 400 });
    }

    // Build HTML email
    const htmlBody = buildQuoteHtml(quote);
    const subject = `Your Quote from SkyFynd \u2014 ${quote.qrNumber}`;

    // Send via Nodemailer + Gmail SMTP
    const gmailUser = process.env.GMAIL_USER;
    const gmailPass = process.env.GMAIL_APP_PASSWORD;
    if (!gmailUser || !gmailPass) {
      return NextResponse.json({ error: 'Email credentials not configured' }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailPass,
      },
    });

    await transporter.sendMail({
      from: `"SkyFynd" <${gmailUser}>`,
      to: clientEmail,
      subject,
      text: `Your SkyFynd Quote\n\nQR Number: ${quote.qrNumber}\nOne-Time Total: $${quote.totals.oneTimeTotal || 0}\nMonthly Total: $${quote.totals.monthlyTotal || 0}\nDue Today: $${quote.totals.grandTotal || 0}`,
      html: htmlBody,
    });

    return NextResponse.json({ status: 'success', message: `Quote sent to ${clientEmail}` });
  } catch (error) {
    console.error('Send quote error:', error);
    return NextResponse.json({ error: 'Failed to send quote' }, { status: 500 });
  }
}
