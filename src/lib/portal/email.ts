const LOGO_URL = 'https://f005.backblazeb2.com/file/SKYFYND-assets/Skyfynd+logo.png';

function fmt(n: number): string {
  return Number(n).toLocaleString('en-US');
}

export function buildPortalInviteEmail(
  portalId: string,
  clientName: string,
  qrNumber: string,
  grandTotal: number,
  serviceCount: number
): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const portalUrl = `${baseUrl}/portal/${portalId}`;

  let html = '';

  html += '<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>';
  html += '<body style="margin:0;padding:0;background-color:#f4f4f7;font-family:Arial,Helvetica,sans-serif;">';
  html += '<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f7;padding:20px 0;">';
  html += '<tr><td align="center"><table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">';

  // Header
  html += '<tr><td style="background-color:#4a148c;background:linear-gradient(135deg,#4a148c 0%,#7b1fa2 50%,#9c27b0 100%);padding:30px 40px;text-align:center;">';
  html += `<img src="${LOGO_URL}" alt="SkyFynd" width="140" style="display:block;margin:0 auto 12px;max-width:140px;" />`;
  html += '<h1 style="color:#ffffff;margin:0 0 4px;font-size:22px;font-weight:700;">Your Project Portal</h1>';
  html += `<p style="color:#e1bee7;margin:0;font-size:14px;">${qrNumber}</p>`;
  html += '</td></tr>';

  // Body
  html += '<tr><td style="padding:32px 40px;">';
  html += `<p style="color:#333;font-size:16px;margin:0 0 16px;">Hi ${clientName},</p>`;
  html += '<p style="color:#555;font-size:14px;line-height:1.6;margin:0 0 24px;">Your quote is ready for review. We\'ve prepared a portal where you can review the details, sign the service agreement, and complete your deposit — all in one place.</p>';

  // Summary box
  html += '<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f0ff;border-radius:8px;margin-bottom:24px;">';
  html += '<tr><td style="padding:16px 20px;">';
  html += '<table width="100%" cellpadding="0" cellspacing="0">';
  html += `<tr><td style="color:#888;font-size:13px;padding:4px 0;">Services</td><td style="text-align:right;font-weight:600;color:#4a148c;font-size:13px;padding:4px 0;">${serviceCount} selected</td></tr>`;
  html += `<tr><td style="color:#888;font-size:13px;padding:4px 0;">Estimated Total</td><td style="text-align:right;font-weight:600;color:#4a148c;font-size:13px;padding:4px 0;">$${fmt(grandTotal)}</td></tr>`;
  html += '</table></td></tr></table>';

  // CTA Button
  html += '<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">';
  html += `<a href="${portalUrl}" style="display:inline-block;padding:14px 40px;background:linear-gradient(135deg,#4a148c 0%,#7b1fa2 100%);color:#ffffff;text-decoration:none;border-radius:8px;font-size:16px;font-weight:700;">View Your Portal</a>`;
  html += '</td></tr></table>';

  html += '<p style="color:#888;font-size:12px;text-align:center;margin:24px 0 0;">This link is unique to you and expires in 30 days.</p>';
  html += '</td></tr>';

  // Footer
  html += '<tr><td style="background-color:#f9f7fc;padding:20px 40px;text-align:center;border-top:1px solid #e8e0f0;">';
  html += '<p style="color:#888;font-size:12px;margin:0 0 4px;">Questions? Reply to this email or reach out to us anytime.</p>';
  html += '<p style="color:#4a148c;font-size:12px;margin:0;font-weight:600;">SkyFynd \u2014 Creative & Digital Marketing</p>';
  html += '</td></tr>';

  html += '</table></td></tr></table></body></html>';
  return html;
}

export function buildVerificationCodeEmail(clientName: string, code: string): string {
  let html = '';

  html += '<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>';
  html += '<body style="margin:0;padding:0;background-color:#f4f4f7;font-family:Arial,Helvetica,sans-serif;">';
  html += '<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f7;padding:20px 0;">';
  html += '<tr><td align="center"><table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">';

  // Header
  html += '<tr><td style="background-color:#4a148c;background:linear-gradient(135deg,#4a148c 0%,#7b1fa2 50%,#9c27b0 100%);padding:24px 40px;text-align:center;">';
  html += `<img src="${LOGO_URL}" alt="SkyFynd" width="120" style="display:block;margin:0 auto;max-width:120px;" />`;
  html += '</td></tr>';

  // Body
  html += '<tr><td style="padding:32px 40px;text-align:center;">';
  html += `<p style="color:#333;font-size:16px;margin:0 0 8px;">Hi ${clientName},</p>`;
  html += '<p style="color:#555;font-size:14px;margin:0 0 24px;">Enter this code to access your project portal:</p>';

  // Code display
  html += `<div style="background-color:#f5f0ff;border:2px solid #e8e0f0;border-radius:12px;padding:20px;margin:0 auto;max-width:280px;">`;
  html += `<p style="font-size:36px;font-weight:700;color:#4a148c;letter-spacing:8px;margin:0;font-family:monospace;">${code}</p>`;
  html += '</div>';

  html += '<p style="color:#888;font-size:12px;margin:20px 0 0;">This code expires in 10 minutes.</p>';
  html += '</td></tr>';

  // Footer
  html += '<tr><td style="background-color:#f9f7fc;padding:16px 40px;text-align:center;border-top:1px solid #e8e0f0;">';
  html += '<p style="color:#999;font-size:11px;margin:0;">If you didn\'t request this code, you can safely ignore this email.</p>';
  html += '</td></tr>';

  html += '</table></td></tr></table></body></html>';
  return html;
}
