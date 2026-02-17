const LOGO_URL = 'https://f005.backblazeb2.com/file/SKYFYND-assets/Skyfynd+logo.png';

function fmt(n: number): string {
  return Number(n).toLocaleString('en-US');
}

// ── Shared email scaffolding (Outlook / Hotmail / Gmail compatible) ──────────

function emailDocOpen(): string {
  return [
    '<!DOCTYPE html>',
    '<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">',
    '<head>',
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width,initial-scale=1.0">',
    '<meta http-equiv="X-UA-Compatible" content="IE=edge">',
    '<!--[if gte mso 9]><xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]-->',
    '<style>',
    '  body, table, td, a { -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; }',
    '  table, td { mso-table-lspace:0pt; mso-table-rspace:0pt; }',
    '  img { -ms-interpolation-mode:bicubic; border:0; outline:none; text-decoration:none; }',
    '</style>',
    '</head>',
    '<body style="margin:0;padding:0;background-color:#f5f5f5;font-family:Arial,Helvetica,sans-serif;">',
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f5f5f5;padding:20px 0;">',
    '<tr><td align="center">',
    '<!--[if (gte mso 9)|(IE)]><table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" align="center"><tr><td><![endif]-->',
    '<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background-color:#111111;border-radius:8px;overflow:hidden;">',
  ].join('');
}

/**
 * VML gradient block for Outlook.
 * Wraps inner content in a <v:rect> so Outlook renders a real gradient
 * instead of falling back to bgcolor=. Modern clients ignore the VML
 * and use the CSS linear-gradient on the <td>.
 */
function vmlGradientOpen(): string {
  return [
    '<!--[if gte mso 9]>',
    '<v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width:600px;mso-width-percent:1000;">',
    '<v:fill type="gradient" color="#A78BFA" color2="#34D399" colors="0% #A78BFA, 40% #60AFFA, 100% #34D399" angle="90" />',
    '<v:textbox style="mso-fit-shape-to-text:true" inset="0,0,0,0">',
    '<![endif]-->',
  ].join('\n');
}

function vmlGradientClose(): string {
  return [
    '<!--[if gte mso 9]>',
    '</v:textbox>',
    '</v:rect>',
    '<![endif]-->',
  ].join('\n');
}

function emailHeader(title: string, subtitle?: string): string {
  let h = '';
  h += '<tr><td bgcolor="#A78BFA" style="background-color:#A78BFA;background:linear-gradient(to right,#A78BFA 0%,#60AFFA 40%,#34D399 100%);padding:0;text-align:center;">';
  // VML gradient for Outlook
  h += vmlGradientOpen();
  h += '<div style="padding:20px 24px;text-align:center;">';
  h += '<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 10px;"><tr>';
  h += `<td style="vertical-align:middle;"><img src="${LOGO_URL}" alt="Skyfynd" width="36" height="36" style="display:block;border:0;outline:none;" /></td>`;
  h += '<td style="vertical-align:middle;padding-left:10px;"><span style="color:#ffffff;font-size:22px;font-weight:600;font-family:Arial,Helvetica,sans-serif;">Skyfynd</span></td>';
  h += '</tr></table>';
  h += `<h1 style="color:#ffffff;margin:0 0 4px;font-size:20px;font-weight:700;font-family:Arial,Helvetica,sans-serif;">${title}</h1>`;
  if (subtitle) {
    h += `<p style="color:#D4D4D8;margin:0;font-size:13px;">${subtitle}</p>`;
  }
  h += '</div>';
  h += vmlGradientClose();
  h += '</td></tr>';
  return h;
}

function emailFooter(text?: string): string {
  let f = '';
  f += '<tr><td bgcolor="#0D0D0F" style="background-color:#0D0D0F;padding:20px 24px;text-align:center;border-top:1px solid #1F1F23;">';
  f += `<p style="color:#71717A;font-size:12px;margin:0 0 4px;">${text || 'Questions? Reply to this email or reach out to us anytime.'}</p>`;
  f += '<p style="color:#ffffff;font-size:12px;margin:0;font-weight:600;">Skyfynd &#8212; Software for Businesses</p>';
  f += '</td></tr>';
  return f;
}

function emailDocClose(): string {
  return [
    '</table>',
    '<!--[if (gte mso 9)|(IE)]></td></tr></table><![endif]-->',
    '</td></tr></table>',
    '</body></html>',
  ].join('');
}

/**
 * Bulletproof CTA button — works in Outlook, Hotmail, Gmail, Apple Mail.
 * Background color lives on <td> via bgcolor= (Outlook) and CSS gradient (modern).
 * Padding lives on <td> so the entire cell is clickable.
 */
function ctaButton(url: string, label: string): string {
  let b = '';
  b += '<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr><td align="center" style="padding:0;">';
  b += '<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">';
  b += '<tr>';
  b += `<td align="center" bgcolor="#A78BFA" style="background-color:#A78BFA;background:linear-gradient(to right,#A78BFA 0%,#60AFFA 40%,#34D399 100%);border-radius:8px;padding:0;">`;
  // VML gradient for Outlook button
  b += '<!--[if gte mso 9]>';
  b += `<v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${url}" style="height:48px;v-text-anchor:middle;width:260px;" arcsize="17%" stroke="false" fillcolor="#A78BFA">`;
  b += '<v:fill type="gradient" color="#A78BFA" color2="#34D399" colors="0% #A78BFA, 40% #60AFFA, 100% #34D399" angle="90" />';
  b += '<w:anchorlock/>';
  b += `<center style="color:#ffffff;font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:bold;">${label}</center>`;
  b += '</v:roundrect>';
  b += '<![endif]-->';
  // Non-Outlook link
  b += '<!--[if !mso]><!-->';
  b += `<a href="${url}" target="_blank" style="color:#ffffff;text-decoration:none;font-size:16px;font-weight:700;font-family:Arial,Helvetica,sans-serif;display:inline-block;padding:14px 40px;">${label}</a>`;
  b += '<!--<![endif]-->';
  b += '</td>';
  b += '</tr></table>';
  b += '</td></tr></table>';
  return b;
}

/** Dark info box row (key–value pair) */
function infoRow(label: string, value: string, valueColor?: string): string {
  return `<tr><td style="color:#71717A;font-size:13px;padding:6px 0;">${label}</td><td style="text-align:right;font-weight:600;color:${valueColor || '#ffffff'};font-size:13px;padding:6px 0;">${value}</td></tr>`;
}

// ── Email builders ──────────────────────────────────────────────────────────

export function buildQuoteConfirmationEmail(
  clientName: string,
  qrNumber: string,
  serviceNames?: string,
  serviceCount?: number
): string {
  let html = emailDocOpen();

  html += emailHeader('Quote Request Received', qrNumber);

  // Body
  html += '<tr><td style="padding:24px;">';
  html += `<p style="color:#E5E5E5;font-size:16px;margin:0 0 16px;">Hi ${clientName},</p>`;
  html += '<p style="color:#A1A1AA;font-size:14px;line-height:1.6;margin:0 0 24px;">Thank you for your quote request! We\'ve received your submission and our team will review it shortly. You can expect to hear from us within 24 hours.</p>';

  // Summary box
  if (serviceNames || serviceCount) {
    html += '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">';
    html += '<tr><td bgcolor="#1C1825" style="background-color:#1C1825;border-radius:8px;padding:16px 20px;">';
    html += '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">';
    html += infoRow('Reference', qrNumber);
    if (serviceCount) {
      html += infoRow('Services', `${serviceCount} selected`);
    }
    if (serviceNames) {
      html += `<tr><td colspan="2" style="color:#71717A;font-size:12px;padding:8px 0 0;line-height:1.5;">${serviceNames}</td></tr>`;
    }
    html += '</table></td></tr></table>';
  }

  html += '<p style="color:#A1A1AA;font-size:14px;line-height:1.6;margin:0 0 8px;">Here\'s what happens next:</p>';
  html += '<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">';
  html += '<tr><td style="color:#A78BFA;font-size:14px;font-weight:700;padding:4px 12px 4px 0;vertical-align:top;">1.</td><td style="color:#A1A1AA;font-size:14px;line-height:1.6;padding:4px 0;">We review your request and prepare a detailed quote</td></tr>';
  html += '<tr><td style="color:#60AFFA;font-size:14px;font-weight:700;padding:4px 12px 4px 0;vertical-align:top;">2.</td><td style="color:#A1A1AA;font-size:14px;line-height:1.6;padding:4px 0;">You\'ll receive your personalized portal with pricing and details</td></tr>';
  html += '<tr><td style="color:#34D399;font-size:14px;font-weight:700;padding:4px 12px 4px 0;vertical-align:top;">3.</td><td style="color:#A1A1AA;font-size:14px;line-height:1.6;padding:4px 0;">Review, sign, and get started &#8212; all in one place</td></tr>';
  html += '</table>';

  html += '<p style="color:#71717A;font-size:12px;text-align:center;margin:0;">Keep this email for your records. Your reference number is <strong style="color:#ffffff;">' + qrNumber + '</strong>.</p>';
  html += '</td></tr>';

  html += emailFooter();
  html += emailDocClose();
  return html;
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

  let html = emailDocOpen();

  html += emailHeader('Your Project Portal', qrNumber);

  // Body
  html += '<tr><td style="padding:24px;">';
  html += `<p style="color:#E5E5E5;font-size:16px;margin:0 0 16px;">Hi ${clientName},</p>`;
  html += '<p style="color:#A1A1AA;font-size:14px;line-height:1.6;margin:0 0 24px;">Your quote is ready for review. We\'ve prepared a portal where you can review the details, sign the service agreement, and complete your deposit &#8212; all in one place.</p>';

  // Summary box
  html += '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">';
  html += '<tr><td bgcolor="#1C1825" style="background-color:#1C1825;border-radius:8px;padding:16px 20px;">';
  html += '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">';
  html += infoRow('Services', `${serviceCount} selected`);
  html += infoRow('Estimated Total', `$${fmt(grandTotal)}`);
  html += '</table></td></tr></table>';

  // CTA Button
  html += ctaButton(portalUrl, 'View Your Portal');

  html += '<p style="color:#71717A;font-size:12px;text-align:center;margin:24px 0 0;">This link is unique to you and expires in 30 days.</p>';
  html += '</td></tr>';

  html += emailFooter();
  html += emailDocClose();
  return html;
}

export function buildFinalPaymentEmail(
  portalId: string,
  clientName: string,
  qrNumber: string,
  grandTotal: number,
  depositAmount: number,
  depositPaidAt: string
): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const paymentUrl = `${baseUrl}/portal/${portalId}/final-payment`;
  const remainingBalance = grandTotal - depositAmount;
  const paidDate = new Date(depositPaidAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  let html = emailDocOpen();

  html += emailHeader('Final Payment Request', qrNumber);

  // Body
  html += '<tr><td style="padding:24px;">';
  html += `<p style="color:#E5E5E5;font-size:16px;margin:0 0 16px;">Hi ${clientName},</p>`;
  html += '<p style="color:#A1A1AA;font-size:14px;line-height:1.6;margin:0 0 24px;">Your project is nearing completion! Below is a summary of your account. Please click the button below to complete your final payment.</p>';

  // Summary box
  html += '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">';
  html += '<tr><td bgcolor="#1C1825" style="background-color:#1C1825;border-radius:8px;padding:16px 20px;">';
  html += '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">';
  html += infoRow('Project Total', `$${fmt(grandTotal)}`);
  html += `<tr><td style="color:#71717A;font-size:13px;padding:6px 0;">Deposit Paid <span style="color:#52525B;font-size:11px;">(${paidDate})</span></td><td style="text-align:right;font-weight:600;color:#10B981;font-size:13px;padding:6px 0;">-$${fmt(depositAmount)}</td></tr>`;
  html += '<tr><td colspan="2" style="border-top:1px solid #2A2435;padding:0;font-size:1px;line-height:1px;">&#160;</td></tr>';
  html += `<tr><td style="color:#ffffff;font-size:14px;font-weight:700;padding:8px 0;">Remaining Balance</td><td style="text-align:right;font-weight:700;color:#ffffff;font-size:16px;padding:8px 0;">$${fmt(remainingBalance)}</td></tr>`;
  html += '</table></td></tr></table>';

  // CTA Button
  html += ctaButton(paymentUrl, 'Pay Remaining Balance');

  html += '<p style="color:#71717A;font-size:12px;text-align:center;margin:24px 0 0;">This link is unique to you.</p>';
  html += '</td></tr>';

  html += emailFooter();
  html += emailDocClose();
  return html;
}

export function buildPaymentConfirmationEmail(
  clientName: string,
  qrNumber: string,
  amountPaid: number,
  paymentType: 'deposit' | 'final',
  grandTotal?: number,
  depositAmount?: number
): string {
  const isDeposit = paymentType === 'deposit';
  const title = isDeposit ? 'Deposit Received' : 'Final Payment Received';
  const message = isDeposit
    ? 'We\'ve received your deposit and your project is now underway. We\'ll be in touch with next steps soon.'
    : 'Your final payment has been received and your project balance is fully settled. Thank you for your trust in Skyfynd!';

  let html = emailDocOpen();

  html += emailHeader(title, qrNumber);

  // Body
  html += '<tr><td style="padding:24px;">';
  html += `<p style="color:#E5E5E5;font-size:16px;margin:0 0 16px;">Hi ${clientName},</p>`;
  html += `<p style="color:#A1A1AA;font-size:14px;line-height:1.6;margin:0 0 24px;">${message}</p>`;

  // Payment summary
  html += '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">';
  html += '<tr><td bgcolor="#1C1825" style="background-color:#1C1825;border-radius:8px;padding:16px 20px;">';
  html += '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">';

  if (!isDeposit && grandTotal && depositAmount) {
    html += infoRow('Project Total', `$${fmt(grandTotal)}`);
    html += `<tr><td style="color:#71717A;font-size:13px;padding:6px 0;">Deposit Paid</td><td style="text-align:right;font-weight:600;color:#10B981;font-size:13px;padding:6px 0;">-$${fmt(depositAmount)}</td></tr>`;
    html += '<tr><td colspan="2" style="border-top:1px solid #2A2435;padding:0;font-size:1px;line-height:1px;">&#160;</td></tr>';
  }

  html += `<tr><td style="color:#ffffff;font-size:14px;font-weight:700;padding:8px 0;">${isDeposit ? 'Deposit Paid' : 'Final Payment'}</td><td style="text-align:right;font-weight:700;color:#10B981;font-size:16px;padding:8px 0;">$${fmt(amountPaid)}</td></tr>`;
  html += '</table></td></tr></table>';

  html += '<p style="color:#71717A;font-size:12px;text-align:center;margin:0;">This is your payment confirmation. No further action is needed.</p>';
  html += '</td></tr>';

  html += emailFooter();
  html += emailDocClose();
  return html;
}

export function buildVerificationCodeEmail(clientName: string, code: string): string {
  let html = emailDocOpen();

  // Verification header — just logo, no title bar (with VML gradient for Outlook)
  html += '<tr><td bgcolor="#A78BFA" style="background-color:#A78BFA;background:linear-gradient(to right,#A78BFA 0%,#60AFFA 40%,#34D399 100%);padding:0;text-align:center;">';
  html += vmlGradientOpen();
  html += '<div style="padding:16px 24px;text-align:center;">';
  html += '<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;"><tr>';
  html += `<td style="vertical-align:middle;"><img src="${LOGO_URL}" alt="Skyfynd" width="36" height="36" style="display:block;border:0;outline:none;" /></td>`;
  html += '<td style="vertical-align:middle;padding-left:10px;"><span style="color:#ffffff;font-size:22px;font-weight:600;font-family:Arial,Helvetica,sans-serif;">Skyfynd</span></td>';
  html += '</tr></table>';
  html += '</div>';
  html += vmlGradientClose();
  html += '</td></tr>';

  // Body
  html += '<tr><td style="padding:24px;text-align:center;">';
  html += `<p style="color:#E5E5E5;font-size:16px;margin:0 0 8px;">Hi ${clientName},</p>`;
  html += '<p style="color:#A1A1AA;font-size:14px;margin:0 0 24px;">Enter this code to access your project portal:</p>';

  // Code display — table-based for Outlook (not <div>)
  html += '<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;" width="280">';
  html += '<tr><td align="center" bgcolor="#1C1825" style="background-color:#1C1825;border:2px solid #2A2435;border-radius:12px;padding:20px;">';
  html += `<p style="font-size:28px;font-weight:700;color:#ffffff;letter-spacing:6px;margin:0;font-family:Courier New,Courier,monospace;">${code}</p>`;
  html += '</td></tr></table>';

  html += '<p style="color:#71717A;font-size:12px;margin:20px 0 0;">This code expires in 10 minutes.</p>';
  html += '</td></tr>';

  html += emailFooter('If you didn\'t request this code, you can safely ignore this email.');
  html += emailDocClose();
  return html;
}
