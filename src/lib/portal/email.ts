import type { ResolvedServiceConfig, ResolvedStep } from '@/lib/types/admin';

const LOGO_URL = 'https://f005.backblazeb2.com/file/SKYFYND-assets/Skyfynd+logo.png';
const GRADIENT_IMG_URL = 'https://f004.backblazeb2.com/file/carrero-biz/email-header-gradient.png';

function fmt(n: number): string {
  return Number(n).toLocaleString('en-US');
}

/** Escape user-provided text before interpolating into HTML emails. */
function esc(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function money(n: number): string {
  return '$' + fmt(Math.round(n || 0));
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
    '  .sf-grad { background-image:linear-gradient(to right,#A78BFA 0%,#60AFFA 40%,#34D399 100%) !important; }',
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
  h += `<tr><td class="sf-grad" bgcolor="#A78BFA" style="background-color:#A78BFA;background-image:url(${GRADIENT_IMG_URL});background-size:cover;background-repeat:no-repeat;padding:0;text-align:center;">`;
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
  b += `<td align="center" class="sf-grad" bgcolor="#A78BFA" style="background-color:#A78BFA;background-image:url(${GRADIENT_IMG_URL});background-size:cover;background-repeat:no-repeat;border-radius:8px;padding:0;">`;
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

// ── Configured-quote breakdown (itemized service cards + totals strip) ────────
// Skyfynd-dark analog of the Solid Rock quote card: a gradient-outlined panel
// with one row per service (colored dot · service + selected options · price)
// and a totals footer (subtotal → bundle discount → total, plus recurring).

/** Shape consumed by the quote-request email builders (matches QuoteRequestPayload). */
export interface QuoteEmailData {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  notes?: string;
  source?: string;
  serviceNames?: string;
  serviceCount?: number;
  hasCustomQuote?: boolean;
  oneTimeTotal?: number;
  monthlyTotal?: number;
  discountPercentage?: number;
  grandTotal?: number;
  resolvedServices?: ResolvedServiceConfig[];
}

// Per-service dot, cycling the Skyfynd gradient stops.
const DOT_COLORS = ['#A78BFA', '#60AFFA', '#34D399'];

/** Flatten a service's steps to the meaningful selected-option labels (skips "Included" features). */
function collectStepLabels(steps?: ResolvedStep[]): string[] {
  const out: string[] = [];
  const walk = (arr: ResolvedStep[]) => {
    for (const s of arr) {
      if (s.selectedLabel && s.selectedLabel !== 'Included' && s.selectedId !== null) {
        out.push(s.selectedLabel);
      }
      if (s.children) walk(s.children);
    }
  };
  walk(steps || []);
  return out;
}

function servicePriceHtml(svc: ResolvedServiceConfig): string {
  if (svc.hasCustomQuote) return '<span style="color:#F59E0B;">Custom</span>';
  const parts: string[] = [];
  if (svc.oneTimeTotal > 0) parts.push(money(svc.oneTimeTotal));
  if (svc.monthlyTotal > 0) parts.push(money(svc.monthlyTotal) + '<span style="font-size:11px;font-weight:500;color:#71717A;">/mo</span>');
  return parts.join(' + ') || '<span style="color:#71717A;">Included</span>';
}

/** One row in the dark totals strip. `emphasis` enlarges it; `divider` rules a line above. */
function quoteTotalRow(
  label: string,
  valueHtml: string,
  opts: { emphasis?: boolean; color?: string; divider?: boolean } = {}
): string {
  const { emphasis = false, color, divider = false } = opts;
  const top = divider ? 'border-top:1px solid #2A2A33;' : '';
  const pad = emphasis ? '10px 0 6px;' : '5px 0;';
  const labelStyle = emphasis ? 'font-size:15px;font-weight:700;color:#FAFAFA;' : 'font-size:13px;color:#A1A1AA;';
  const valueStyle = emphasis ? `font-size:18px;font-weight:700;color:${color || '#60AFFA'};` : `font-size:14px;font-weight:600;color:${color || '#FAFAFA'};`;
  return `<tr><td style="padding:${pad}${top}${labelStyle}vertical-align:bottom;">${esc(label)}</td>` +
    `<td style="padding:${pad}${top}text-align:right;${valueStyle}vertical-align:bottom;">${valueHtml}</td></tr>`;
}

/**
 * The visual quote — itemized service cards + a totals strip — in the Skyfynd
 * dark palette. Returns '' when there are no resolved services so callers can
 * append unconditionally (and fall back to a simple summary).
 */
function buildServiceBreakdown(
  services: ResolvedServiceConfig[] | undefined,
  totals: { oneTimeTotal?: number; monthlyTotal?: number; discountPercentage?: number },
  heading = 'Your configured quote'
): string {
  const resolved = (services || []).filter(Boolean);
  if (!resolved.length) return '';

  const oneTimeTotal = totals.oneTimeTotal || 0;
  const monthlyTotal = totals.monthlyTotal || 0;
  const discount = totals.discountPercentage || 0;

  let h = '';
  h += `<p style="color:#71717A;font-size:12px;text-transform:uppercase;letter-spacing:0.6px;margin:0 0 10px;">${esc(heading)}</p>`;

  // Bundle-discount ribbon (only when one applies).
  if (discount > 0) {
    h += '<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 10px;"><tr>';
    h += `<td bgcolor="#34D399" style="background-color:#34D399;border-radius:999px;padding:5px 13px;font-size:12px;font-weight:700;color:#0D0D0F;">&#9733;&nbsp; Bundle discount applied &middot; ${discount}% off</td>`;
    h += '</tr></table>';
  }

  // Line-item rows: colored dot · service + selected options · price.
  let itemRows = '';
  resolved.forEach((svc, i) => {
    const color = DOT_COLORS[i % DOT_COLORS.length];
    const border = 'border-bottom:1px solid #232323;';
    const labels = collectStepLabels(svc.steps).slice(0, 3).join(' · ');
    itemRows += '<tr>';
    itemRows += `<td width="11" style="padding:13px 0 13px 18px;${border}vertical-align:top;"><span style="display:inline-block;width:9px;height:9px;border-radius:50%;background-color:${color};">&nbsp;</span></td>`;
    itemRows += `<td style="padding:13px 10px 13px 9px;${border}vertical-align:top;">`;
    itemRows += `<span style="font-size:14px;font-weight:700;color:#FAFAFA;line-height:1.3;">${esc(svc.serviceLabel)}</span>`;
    if (labels) itemRows += `<br><span style="font-size:12px;color:#71717A;">${esc(labels)}</span>`;
    itemRows += '</td>';
    itemRows += `<td style="padding:13px 18px 13px 0;${border}text-align:right;vertical-align:top;white-space:nowrap;font-size:15px;font-weight:700;color:#FAFAFA;">${servicePriceHtml(svc)}</td>`;
    itemRows += '</tr>';
  });

  // Totals — separate project (one-time) and recurring (monthly) buckets, each
  // showing subtotal → discount → total when a bundle discount applies.
  const subOne = resolved.reduce((a, s) => a + (s.oneTimeTotal || 0), 0);
  const subMon = resolved.reduce((a, s) => a + (s.monthlyTotal || 0), 0);
  const rows: string[] = [];
  if (subOne > 0) {
    if (discount > 0 && subOne > oneTimeTotal) {
      rows.push(quoteTotalRow('Project subtotal', money(subOne)));
      rows.push(quoteTotalRow(`Bundle discount (${discount}%)`, '&minus;' + money(subOne - oneTimeTotal), { color: '#F87171' }));
      rows.push(quoteTotalRow('Project total', money(oneTimeTotal), { emphasis: true, divider: true }));
    } else {
      rows.push(quoteTotalRow('Project total', money(oneTimeTotal || subOne), { emphasis: true }));
    }
  }
  if (subMon > 0) {
    if (discount > 0 && subMon > monthlyTotal) {
      rows.push(quoteTotalRow('Monthly subtotal', money(subMon) + '/mo', { divider: subOne > 0 }));
      rows.push(quoteTotalRow(`Bundle discount (${discount}%)`, '&minus;' + money(subMon - monthlyTotal) + '/mo', { color: '#F87171' }));
      rows.push(quoteTotalRow('Monthly total', money(monthlyTotal) + '/mo', { emphasis: true, color: '#34D399' }));
    } else {
      rows.push(quoteTotalRow('Monthly total', money(monthlyTotal || subMon) + '/mo', { emphasis: true, color: '#34D399', divider: subOne > 0 }));
    }
  }
  const totalsFooter = rows.length
    ? `<tr><td colspan="3" bgcolor="#0D0D0F" style="background-color:#0D0D0F;padding:10px 18px;">` +
      '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">' + rows.join('') + '</table></td></tr>'
    : '';

  // Gradient-outlined panel: a 2px gradient ring around the dark card.
  h += '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 12px;">';
  h += `<tr><td class="sf-grad" bgcolor="#60AFFA" style="background-color:#60AFFA;background-image:url(${GRADIENT_IMG_URL});background-size:cover;background-repeat:no-repeat;border-radius:14px;padding:2px;">`;
  h += '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#141418;border-radius:12px;overflow:hidden;">';
  h += itemRows + totalsFooter;
  h += '</table></td></tr></table>';

  h += '<p style="color:#52525B;font-size:11px;font-style:italic;line-height:1.5;margin:0 0 4px;">Estimate from the Skyfynd plan builder &#8212; final pricing confirmed after our team reviews your project.</p>';
  return h;
}

/** Plain-text rendering of the configured quote (deliverability + non-HTML clients). */
export function buildQuoteBreakdownText(data: QuoteEmailData): string {
  const resolved = (data.resolvedServices || []).filter(Boolean);
  if (!resolved.length) return '';
  const lines = ['Configured quote:'];
  for (const svc of resolved) {
    const opts = collectStepLabels(svc.steps).slice(0, 3).join(' / ');
    let price = svc.hasCustomQuote ? 'Custom' : [
      svc.oneTimeTotal > 0 ? money(svc.oneTimeTotal) : null,
      svc.monthlyTotal > 0 ? money(svc.monthlyTotal) + '/mo' : null,
    ].filter(Boolean).join(' + ') || 'Included';
    lines.push(`  - ${svc.serviceLabel}${opts ? ' (' + opts + ')' : ''}: ${price}`);
  }
  if ((data.oneTimeTotal || 0) > 0) lines.push(`Project total: ${money(data.oneTimeTotal || 0)}`);
  if ((data.monthlyTotal || 0) > 0) lines.push(`Monthly total: ${money(data.monthlyTotal || 0)}/mo`);
  if ((data.discountPercentage || 0) > 0) lines.push(`(Bundle discount: ${data.discountPercentage}% off)`);
  return lines.join('\n');
}

// ── Email builders ──────────────────────────────────────────────────────────

/**
 * Customer-facing quote-request confirmation. Renders the full itemized quote
 * the customer configured (when resolvedServices is present), then the
 * what-happens-next steps. Falls back to a simple summary box otherwise.
 */
export function buildQuoteRequestConfirmationEmail(data: QuoteEmailData, qrNumber: string): string {
  let html = emailDocOpen();
  html += emailHeader('Quote Request Received', qrNumber);

  html += '<tr><td style="padding:24px;">';
  html += `<p style="color:#E5E5E5;font-size:16px;margin:0 0 16px;">Hi ${esc((data.name || '').trim().split(/\s+/)[0] || data.name)},</p>`;
  html += '<p style="color:#A1A1AA;font-size:14px;line-height:1.6;margin:0 0 24px;">Thank you for your quote request! We\'ve received the details below and our team will review them shortly. You can expect to hear from us within 24 hours.</p>';

  const breakdown = buildServiceBreakdown(data.resolvedServices, data, 'The quote you built');
  if (breakdown) {
    html += breakdown;
  } else if (data.serviceNames || data.serviceCount) {
    // Fallback summary when no resolved services were captured.
    html += '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">';
    html += '<tr><td bgcolor="#1C1825" style="background-color:#1C1825;border-radius:8px;padding:16px 20px;">';
    html += '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">';
    html += infoRow('Reference', esc(qrNumber));
    if (data.serviceCount) html += infoRow('Services', `${data.serviceCount} selected`);
    if (data.serviceNames) html += `<tr><td colspan="2" style="color:#71717A;font-size:12px;padding:8px 0 0;line-height:1.5;">${esc(data.serviceNames)}</td></tr>`;
    html += '</table></td></tr></table>';
  }

  html += '<p style="color:#A1A1AA;font-size:14px;line-height:1.6;margin:14px 0 8px;">Here\'s what happens next:</p>';
  html += '<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">';
  html += '<tr><td style="color:#A78BFA;font-size:14px;font-weight:700;padding:4px 12px 4px 0;vertical-align:top;">1.</td><td style="color:#A1A1AA;font-size:14px;line-height:1.6;padding:4px 0;">We review your request and prepare a detailed quote</td></tr>';
  html += '<tr><td style="color:#60AFFA;font-size:14px;font-weight:700;padding:4px 12px 4px 0;vertical-align:top;">2.</td><td style="color:#A1A1AA;font-size:14px;line-height:1.6;padding:4px 0;">You\'ll receive your personalized portal with pricing and details</td></tr>';
  html += '<tr><td style="color:#34D399;font-size:14px;font-weight:700;padding:4px 12px 4px 0;vertical-align:top;">3.</td><td style="color:#A1A1AA;font-size:14px;line-height:1.6;padding:4px 0;">Review, sign, and get started &#8212; all in one place</td></tr>';
  html += '</table>';

  html += '<p style="color:#71717A;font-size:12px;text-align:center;margin:0;">Keep this email for your records. Your reference number is <strong style="color:#ffffff;">' + esc(qrNumber) + '</strong>.</p>';
  html += '</td></tr>';

  html += emailFooter();
  html += emailDocClose();
  return html;
}

/**
 * Admin-facing new-quote notification. Contact card + the same itemized quote
 * breakdown the customer sees, plus their notes and a one-tap reply CTA.
 */
export function buildQuoteRequestNotificationEmail(data: QuoteEmailData, qrNumber: string): string {
  let html = emailDocOpen();
  html += emailHeader('New Quote Request', qrNumber);

  html += '<tr><td style="padding:24px;">';
  html += `<p style="color:#E5E5E5;font-size:15px;line-height:1.6;margin:0 0 20px;">A new quote just came in through the <strong style="color:#ffffff;">${esc(data.source || 'website')}</strong>. Here are the details:</p>`;

  // Contact card
  html += '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:20px;">';
  html += '<tr><td bgcolor="#1C1825" style="background-color:#1C1825;border-radius:8px;padding:8px 20px;">';
  html += '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">';
  html += infoRow('Name', esc(data.name));
  html += infoRow('Email', `<a href="mailto:${esc(data.email)}" style="color:#60AFFA;text-decoration:none;">${esc(data.email)}</a>`);
  if (data.phone) html += infoRow('Phone', `<a href="tel:${esc((data.phone || '').replace(/[^0-9+]/g, ''))}" style="color:#60AFFA;text-decoration:none;">${esc(data.phone)}</a>`);
  if (data.company) html += infoRow('Company', esc(data.company));
  html += infoRow('Reference', esc(qrNumber));
  html += '</table></td></tr></table>';

  const breakdown = buildServiceBreakdown(data.resolvedServices, data, 'Configured quote');
  if (breakdown) {
    html += breakdown;
  } else if (data.serviceNames) {
    html += '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:20px;">';
    html += '<tr><td bgcolor="#1C1825" style="background-color:#1C1825;border-radius:8px;padding:16px 20px;">';
    html += '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">';
    if (data.serviceCount) html += infoRow('Services', `${data.serviceCount} selected`);
    html += `<tr><td colspan="2" style="color:#71717A;font-size:12px;padding:8px 0 0;line-height:1.5;">${esc(data.serviceNames)}</td></tr>`;
    if ((data.grandTotal || 0) > 0) html += infoRow('Estimated total', money(data.grandTotal || 0));
    html += '</table></td></tr></table>';
  }

  // Customer notes
  if (data.notes && data.notes.trim()) {
    html += '<p style="color:#71717A;font-size:12px;text-transform:uppercase;letter-spacing:0.6px;margin:0 0 8px;">Customer notes</p>';
    html += '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">';
    html += '<tr><td style="background-color:#15151A;border:1px solid #232323;border-left:3px solid #A78BFA;border-radius:8px;padding:14px 16px;">';
    html += `<p style="color:#E5E5E5;font-size:14px;line-height:1.6;margin:0;">${esc(data.notes).replace(/\r?\n/g, '<br>')}</p>`;
    html += '</td></tr></table>';
  }

  html += ctaButton(`mailto:${esc(data.email)}`, 'Reply to Customer');
  html += '</td></tr>';

  html += emailFooter('New lead from the Skyfynd quote builder.');
  html += emailDocClose();
  return html;
}

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
  serviceCount: number,
  monthlyTotal?: number
): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const portalUrl = `${baseUrl}/portal/${portalId}`;
  const hasMonthly = (monthlyTotal || 0) > 0;
  const oneTimeTotal = grandTotal - (monthlyTotal || 0);
  const isSubscriptionOnly = hasMonthly && oneTimeTotal <= 0;

  let html = emailDocOpen();

  html += emailHeader('Your Project Portal', qrNumber);

  // Body
  html += '<tr><td style="padding:24px;">';
  html += `<p style="color:#E5E5E5;font-size:16px;margin:0 0 16px;">Hi ${clientName},</p>`;
  if (isSubscriptionOnly) {
    html += '<p style="color:#A1A1AA;font-size:14px;line-height:1.6;margin:0 0 24px;">Your quote is ready for review. We\'ve prepared a portal where you can review the details, sign the service agreement, and start your subscription &#8212; all in one place.</p>';
  } else {
    html += '<p style="color:#A1A1AA;font-size:14px;line-height:1.6;margin:0 0 24px;">Your quote is ready for review. We\'ve prepared a portal where you can review the details, sign the service agreement, and complete your deposit &#8212; all in one place.</p>';
  }

  // Summary box
  html += '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">';
  html += '<tr><td bgcolor="#1C1825" style="background-color:#1C1825;border-radius:8px;padding:16px 20px;">';
  html += '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">';
  html += infoRow('Services', `${serviceCount} selected`);
  if (isSubscriptionOnly) {
    html += infoRow('Monthly', `$${fmt(monthlyTotal!)}/mo`);
  } else if (hasMonthly) {
    html += infoRow('Estimated Total', `$${fmt(oneTimeTotal)} + $${fmt(monthlyTotal!)}/mo`);
  } else {
    html += infoRow('Estimated Total', `$${fmt(grandTotal)}`);
  }
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
  paymentType: 'deposit' | 'final' | 'subscription',
  grandTotal?: number,
  depositAmount?: number,
  monthlyAmount?: number
): string {
  const titleMap: Record<string, string> = {
    deposit: 'Deposit Received',
    final: 'Final Payment Received',
    subscription: 'Subscription Confirmed',
  };
  const messageMap: Record<string, string> = {
    deposit: 'We\'ve received your deposit and your project is now underway. We\'ll be in touch with next steps soon.',
    final: 'Your final payment has been received and your project balance is fully settled. Thank you for your trust in Skyfynd!',
    subscription: 'Your monthly subscription is now active. You\'ll be billed automatically each month.',
  };

  let html = emailDocOpen();

  html += emailHeader(titleMap[paymentType], qrNumber);

  // Body
  html += '<tr><td style="padding:24px;">';
  html += `<p style="color:#E5E5E5;font-size:16px;margin:0 0 16px;">Hi ${clientName},</p>`;
  html += `<p style="color:#A1A1AA;font-size:14px;line-height:1.6;margin:0 0 24px;">${messageMap[paymentType]}</p>`;

  // Payment summary
  html += '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">';
  html += '<tr><td bgcolor="#1C1825" style="background-color:#1C1825;border-radius:8px;padding:16px 20px;">';
  html += '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">';

  if (paymentType === 'subscription') {
    html += `<tr><td style="color:#ffffff;font-size:14px;font-weight:700;padding:8px 0;">Monthly Subscription</td><td style="text-align:right;font-weight:700;color:#10B981;font-size:16px;padding:8px 0;">$${fmt(monthlyAmount || amountPaid)}/mo</td></tr>`;
  } else if (paymentType === 'final' && grandTotal && depositAmount) {
    html += infoRow('Project Total', `$${fmt(grandTotal)}`);
    html += `<tr><td style="color:#71717A;font-size:13px;padding:6px 0;">Deposit Paid</td><td style="text-align:right;font-weight:600;color:#10B981;font-size:13px;padding:6px 0;">-$${fmt(depositAmount)}</td></tr>`;
    html += '<tr><td colspan="2" style="border-top:1px solid #2A2435;padding:0;font-size:1px;line-height:1px;">&#160;</td></tr>';
    html += `<tr><td style="color:#ffffff;font-size:14px;font-weight:700;padding:8px 0;">Final Payment</td><td style="text-align:right;font-weight:700;color:#10B981;font-size:16px;padding:8px 0;">$${fmt(amountPaid)}</td></tr>`;
  } else {
    // Deposit
    html += `<tr><td style="color:#ffffff;font-size:14px;font-weight:700;padding:8px 0;">Deposit Paid</td><td style="text-align:right;font-weight:700;color:#10B981;font-size:16px;padding:8px 0;">$${fmt(amountPaid)}</td></tr>`;
  }

  html += '</table></td></tr></table>';

  html += '<p style="color:#71717A;font-size:12px;text-align:center;margin:0;">This is your payment confirmation. No further action is needed.</p>';
  html += '</td></tr>';

  html += emailFooter();
  html += emailDocClose();
  return html;
}

export function buildChangeRequestNotificationEmail(
  clientName: string,
  qrNumber: string,
  message: string
): string {
  let html = emailDocOpen();

  html += emailHeader('Change Request Received', qrNumber);

  html += '<tr><td style="padding:24px;">';
  html += `<p style="color:#E5E5E5;font-size:16px;margin:0 0 16px;">${clientName} has requested changes to their quote.</p>`;

  // Client message box
  html += '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">';
  html += '<tr><td bgcolor="#1C1825" style="background-color:#1C1825;border-radius:8px;padding:16px 20px;border-left:4px solid #F59E0B;">';
  html += '<p style="color:#71717A;font-size:11px;text-transform:uppercase;letter-spacing:1px;margin:0 0 8px;">Client Message</p>';
  html += `<p style="color:#E5E5E5;font-size:14px;line-height:1.6;margin:0;white-space:pre-wrap;">${message}</p>`;
  html += '</td></tr></table>';

  // Info box
  html += '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">';
  html += '<tr><td bgcolor="#1C1825" style="background-color:#1C1825;border-radius:8px;padding:16px 20px;">';
  html += '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">';
  html += infoRow('Quote', qrNumber);
  html += infoRow('Client', clientName);
  html += infoRow('Status', 'Changes Requested', '#F59E0B');
  html += '</table></td></tr></table>';

  html += '<p style="color:#A1A1AA;font-size:14px;line-height:1.6;margin:0 0 8px;">Review this request in the admin dashboard, update the quote if needed, then click &ldquo;Send Updated Quote&rdquo; to notify the client.</p>';
  html += '</td></tr>';

  html += emailFooter();
  html += emailDocClose();
  return html;
}

export function buildQuoteUpdatedEmail(
  portalId: string,
  clientName: string,
  qrNumber: string
): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const portalUrl = `${baseUrl}/portal/${portalId}`;

  let html = emailDocOpen();

  html += emailHeader('Your Quote Has Been Updated', qrNumber);

  html += '<tr><td style="padding:24px;">';
  html += `<p style="color:#E5E5E5;font-size:16px;margin:0 0 16px;">Hi ${clientName},</p>`;
  html += '<p style="color:#A1A1AA;font-size:14px;line-height:1.6;margin:0 0 24px;">We\'ve reviewed your feedback and updated your quote. Please visit your portal to review the changes.</p>';

  // CTA Button
  html += ctaButton(portalUrl, 'Review Updated Quote');

  html += '<p style="color:#71717A;font-size:12px;text-align:center;margin:24px 0 0;">This link is unique to you.</p>';
  html += '</td></tr>';

  html += emailFooter();
  html += emailDocClose();
  return html;
}

export function buildVerificationCodeEmail(clientName: string, code: string): string {
  let html = emailDocOpen();

  // Verification header — just logo, no title bar (with VML gradient for Outlook)
  html += `<tr><td class="sf-grad" bgcolor="#A78BFA" style="background-color:#A78BFA;background-image:url(${GRADIENT_IMG_URL});background-size:cover;background-repeat:no-repeat;padding:0;text-align:center;">`;
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
