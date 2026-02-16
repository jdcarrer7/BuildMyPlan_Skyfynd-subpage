import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
// Force IPv4 to avoid IPv6 connection timeouts with Google Apps Script
try { require('dns').setDefaultResultOrder('ipv4first'); } catch {}

const VALID_SOURCES = ['Main Page', 'Rent Me a Site', 'RentMe', 'Custom Builder'] as const;
const LOGO_URL = 'https://f005.backblazeb2.com/file/SKYFYND-assets/Skyfynd+logo.png';

function fmt(n: number): string {
  return Number(n).toLocaleString('en-US');
}

function buildAdminNotificationHtml(body: Record<string, unknown>): string {
  const name = String(body.name || '');
  const email = String(body.email || '');
  const company = String(body.company || '');
  const phone = String(body.phone || '');
  const notes = String(body.notes || '');
  const source = String(body.source || '');
  const serviceCount = Number(body.serviceCount || 0);
  const serviceNames = String(body.serviceNames || '');
  const grandTotal = Number(body.grandTotal || 0);
  const oneTimeTotal = Number(body.oneTimeTotal || 0);
  const monthlyTotal = Number(body.monthlyTotal || 0);
  const discountPercentage = Number(body.discountPercentage || 0);

  let html = '';
  html += '<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>';
  html += '<body style="margin:0;padding:0;background-color:#f5f5f5;font-family:Arial,Helvetica,sans-serif;">';
  html += '<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5;padding:20px 0;">';
  html += '<tr><td align="center"><table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#111111;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.4);">';

  // Header
  html += '<tr><td style="background-color:#A78BFA;background:linear-gradient(to right,#A78BFA 0%,#60AFFA 40%,#34D399 100%);padding:20px 40px;text-align:center;">';
  html += '<table cellpadding="0" cellspacing="0" style="margin:0 auto 10px;"><tr>';
  html += `<td style="vertical-align:middle;"><img src="${LOGO_URL}" alt="SkyFynd" width="36" style="display:block;max-width:36px;" /></td>`;
  html += '<td style="vertical-align:middle;padding-left:10px;"><span style="color:#ffffff;font-size:22px;font-weight:600;font-family:Georgia,\'Times New Roman\',serif;">Skyfynd</span></td>';
  html += '</tr></table>';
  html += '<h1 style="color:#ffffff;margin:0 0 4px;font-size:20px;font-weight:700;">New Quote Request</h1>';
  html += `<p style="color:rgba(255,255,255,0.85);margin:0;font-size:13px;">via ${source}</p>`;
  html += '</td></tr>';

  // Client Info
  html += '<tr><td style="padding:24px 40px 16px;">';
  html += '<h2 style="color:#A78BFA;font-size:16px;margin:0 0 12px;border-bottom:2px solid #1F1F23;padding-bottom:8px;">Client Information</h2>';
  html += '<table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;color:#E5E5E5;">';
  const fields: [string, string][] = [['Name', name], ['Email', email], ['Company', company], ['Phone', phone]];
  for (const [label, val] of fields) {
    if (val) {
      html += `<tr><td style="padding:4px 0;color:#71717A;width:100px;">${label}:</td>`;
      html += `<td style="padding:4px 0;font-weight:600;color:#E5E5E5;">${val}</td></tr>`;
    }
  }
  html += '</table></td></tr>';

  // Quote Summary
  html += '<tr><td style="padding:0 40px 24px;">';
  html += '<h2 style="color:#A78BFA;font-size:16px;margin:0 0 12px;border-bottom:2px solid #1F1F23;padding-bottom:8px;">Quote Summary</h2>';
  html += '<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#1C1825;border-radius:8px;overflow:hidden;">';
  html += `<tr><td style="padding:10px 16px;color:#71717A;font-size:13px;">Services (${serviceCount})</td>`;
  html += `<td style="padding:10px 16px;color:#A1A1AA;font-size:13px;text-align:right;">${serviceNames}</td></tr>`;
  html += '<tr><td colspan="2" style="border-top:1px solid #2A2435;"></td></tr>';
  if (oneTimeTotal > 0) {
    html += `<tr><td style="padding:8px 16px;color:#71717A;font-size:13px;">One-Time</td>`;
    html += `<td style="padding:8px 16px;color:#E5E5E5;font-size:13px;font-weight:600;text-align:right;">$${fmt(oneTimeTotal)}</td></tr>`;
  }
  if (monthlyTotal > 0) {
    html += `<tr><td style="padding:8px 16px;color:#71717A;font-size:13px;">Monthly</td>`;
    html += `<td style="padding:8px 16px;color:#E5E5E5;font-size:13px;font-weight:600;text-align:right;">$${fmt(monthlyTotal)}/mo</td></tr>`;
  }
  if (discountPercentage > 0) {
    html += `<tr><td style="padding:8px 16px;color:#34D399;font-size:13px;">Discount</td>`;
    html += `<td style="padding:8px 16px;color:#34D399;font-size:13px;font-weight:600;text-align:right;">${discountPercentage}% off</td></tr>`;
  }
  html += '<tr><td colspan="2" style="border-top:1px solid #2A2435;"></td></tr>';
  html += `<tr><td style="padding:12px 16px;color:#E5E5E5;font-size:14px;font-weight:700;">Grand Total</td>`;
  html += `<td style="padding:12px 16px;color:#A78BFA;font-size:16px;font-weight:700;text-align:right;">$${fmt(grandTotal)}</td></tr>`;
  html += '</table></td></tr>';

  // Notes
  if (notes) {
    html += '<tr><td style="padding:0 40px 24px;">';
    html += '<h2 style="color:#A78BFA;font-size:14px;margin:0 0 8px;">Client Notes</h2>';
    html += `<p style="color:#A1A1AA;font-size:13px;margin:0;background:#1C1825;padding:12px;border-radius:6px;">${notes}</p>`;
    html += '</td></tr>';
  }

  // Footer
  html += '<tr><td style="background-color:#0D0D0F;padding:20px 40px;text-align:center;border-top:1px solid #1F1F23;">';
  html += '<p style="color:#71717A;font-size:12px;margin:0 0 4px;">View details in the admin dashboard.</p>';
  html += '<p style="color:#A78BFA;font-size:12px;margin:0;font-weight:600;">Skyfynd \u2014 Software for Businesses</p>';
  html += '</td></tr>';

  html += '</table></td></tr></table></body></html>';
  return html;
}

async function sendAdminNotification(body: Record<string, unknown>) {
  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || gmailUser;
  if (!gmailUser || !gmailPass || !adminEmail) return;

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: gmailUser, pass: gmailPass },
    });

    const name = String(body.name || 'Unknown');
    const source = String(body.source || '');
    const grandTotal = Number(body.grandTotal || 0);

    await transporter.sendMail({
      from: `"SkyFynd" <${gmailUser}>`,
      to: adminEmail,
      subject: `New Quote Request \u2014 ${name} ($${fmt(grandTotal)}) via ${source}`,
      text: `New quote request from ${name} (${body.email})\nGrand Total: $${fmt(grandTotal)}\nServices: ${body.serviceNames}\n\nView in admin dashboard.`,
      html: buildAdminNotificationHtml(body),
    });
  } catch (err) {
    console.error('Admin notification email failed:', err);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name?.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    if (!body.email?.trim()) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }
    if (!VALID_SOURCES.includes(body.source)) {
      return NextResponse.json({ error: 'Invalid source' }, { status: 400 });
    }

    const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;
    if (!scriptUrl) {
      console.error('GOOGLE_APPS_SCRIPT_URL is not configured');
      return NextResponse.json(
        { error: 'Quote submission is not configured. Please contact support.' },
        { status: 500 }
      );
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    try {
      const scriptResponse = await fetch(scriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        redirect: 'follow',
        signal: controller.signal,
      });
      clearTimeout(timeout);

      // Google Apps Script may return HTML on redirect — try JSON parse
      const text = await scriptResponse.text();
      let result;
      try {
        result = JSON.parse(text);
      } catch {
        // If we got a non-JSON response but 200 status, treat as success
        if (scriptResponse.ok) {
          sendAdminNotification(body);
          return NextResponse.json({ message: 'Quote submitted successfully!' });
        }
        return NextResponse.json(
          { error: 'Unexpected response from quote service' },
          { status: 500 }
        );
      }

      if (result.status === 'success') {
        sendAdminNotification(body);
        return NextResponse.json({ message: 'Quote submitted successfully!' });
      }

      return NextResponse.json(
        { error: result.message ?? 'Failed to save quote' },
        { status: 500 }
      );
    } finally {
      clearTimeout(timeout);
    }
  } catch (error) {
    console.error('Quote submission error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
