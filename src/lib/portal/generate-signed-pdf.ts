import type { jsPDF } from 'jspdf';
import type { QuoteJSON, ResolvedStep } from '@/lib/types/admin';

// Local paths avoid CORS issues with external B2 URLs
const LOGO_URL = '/skyfynd-logo.png';
const CARLOS_SIG_URL = '/signatures/carlos-carrero.png';
const JUAN_SIG_URL = '/signatures/juan-carrero.png';

interface SignedPDFData {
  portal: {
    qr_number: string;
    client_name: string;
    client_email: string;
    quote_data?: QuoteJSON;
  };
  signature: { signature_data_url: string; signed_at: string };
  payment?: { amount: number; paid_at: string; confirmation_id: string } | null;
}

function fmt(n: number): string {
  return Number(n).toLocaleString('en-US');
}

async function fetchImageBase64(url: string): Promise<string | null> {
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

// ── Brand colors (opacity-adjusted to match CSS gradient on white) ──
// CSS uses: purple 0.75, blue 0.85, green 0.8 — blended onto white
const BRAND = {
  purple: { r: 189, g: 168, b: 252 },
  blue:   { r: 120, g: 187, b: 251 },
  green:  { r: 130, g: 215, b: 185 },
} as const;

const HEADER_HEIGHT = 18;
const CONTENT_START = HEADER_HEIGHT + 8;

// ── Smooth gradient helpers ──
// Matches the CSS: purple 0% → blue 40% → green 100%
function lerpColor(t: number): [number, number, number] {
  const p = BRAND.purple, b = BRAND.blue, g = BRAND.green;
  if (t <= 0.4) {
    const s = t / 0.4;
    return [
      Math.round(p.r + (b.r - p.r) * s),
      Math.round(p.g + (b.g - p.g) * s),
      Math.round(p.b + (b.b - p.b) * s),
    ];
  }
  const s = (t - 0.4) / 0.6;
  return [
    Math.round(b.r + (g.r - b.r) * s),
    Math.round(b.g + (g.g - b.g) * s),
    Math.round(b.b + (g.b - b.b) * s),
  ];
}

function drawGradientH(doc: jsPDF, x: number, y: number, width: number, height: number) {
  const steps = Math.max(Math.round(width * 2), 20);
  const sliceW = width / steps;
  for (let i = 0; i < steps; i++) {
    const [r, g, b] = lerpColor(i / (steps - 1));
    doc.setFillColor(r, g, b);
    doc.rect(x + i * sliceW, y, sliceW + 0.15, height, 'F');
  }
}

function drawGradientV(doc: jsPDF, x: number, y: number, width: number, height: number) {
  const steps = Math.max(Math.round(height * 2), 10);
  const sliceH = height / steps;
  for (let i = 0; i < steps; i++) {
    const [r, g, b] = lerpColor(i / (steps - 1));
    doc.setFillColor(r, g, b);
    doc.rect(x, y + i * sliceH, width, sliceH + 0.15, 'F');
  }
}

// ── Draw the black header bar + gradient accent on a page ──
function drawPageHeader(
  doc: jsPDF,
  logoBase64: string | null,
  pageWidth: number,
  margin: number,
  qrNumber?: string,
) {
  // Black header bar
  doc.setFillColor(0, 0, 0);
  doc.rect(0, 0, pageWidth, HEADER_HEIGHT, 'F');

  // Logo + "Skyfynd" — compact, matching dashboard navbar
  if (logoBase64) {
    try { doc.addImage(logoBase64, 'PNG', margin, 5, 8, 8); } catch { /* fallback below */ }
  }

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(15);
  doc.setFont('helvetica', 'bold');
  doc.text('Skyfynd', margin + 10, 10.8);

  // QR number right-aligned
  if (qrNumber) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(200, 200, 200);
    doc.text(qrNumber, pageWidth - margin, 12, { align: 'right' });
  }

  // Gradient accent bar under header
  drawGradientH(doc, 0, HEADER_HEIGHT, pageWidth, 0.8);
}

// ── Draw footer on a page ──
function drawPageFooter(doc: jsPDF, pageWidth: number, margin: number, pageNum: number, totalPages: number) {
  const footerY = doc.internal.pageSize.getHeight() - 8;

  // Gradient line above footer
  drawGradientH(doc, margin, footerY - 4, pageWidth - margin * 2, 0.4);

  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(160, 160, 160);
  doc.text(
    'Skyfynd LLC \u2014 Software for Businesses \u2014 Confidential',
    pageWidth / 2,
    footerY,
    { align: 'center' },
  );
  doc.text(`Page ${pageNum} of ${totalPages}`, pageWidth - margin, footerY, { align: 'right' });
}

// ── Page break helper ──
function checkPage(
  doc: jsPDF,
  y: number,
  needed: number,
  margin: number,
  logoBase64: string | null,
  qrNumber?: string,
): number {
  const pageHeight = doc.internal.pageSize.getHeight();
  if (y + needed > pageHeight - 15) {
    doc.addPage();
    const pw = doc.internal.pageSize.getWidth();
    drawPageHeader(doc, logoBase64, pw, margin, qrNumber);
    return CONTENT_START;
  }
  return y;
}

// ── Section title with gradient underline ──
function drawSectionTitle(doc: jsPDF, title: string, x: number, y: number, pageWidth: number, margin: number): number {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 30, 30);
  doc.text(title, x, y);
  y += 2;
  drawGradientH(doc, x, y, pageWidth - margin - x, 0.5);
  y += 6;
  return y;
}

// Full MSA articles
const ARTICLES: { title: string; paragraphs: string[] }[] = [
  {
    title: '1. Services',
    paragraphs: [
      'Skyfynd provides digital services including, but not limited to, website development, application development, branding, design, marketing, animation, content creation, and related professional services ("Services"). All Services are project-based unless expressly stated otherwise in writing.',
    ],
  },
  {
    title: '2. Statement of Work (SOW)',
    paragraphs: [
      'Each engagement shall be governed by a written Statement of Work (or formal Quote/Proposal) that specifies: selected services, tier (Essential, Pro, or Enterprise), deliverables, timeline, and fees and payment terms.',
      'No services are provided without an agreed SOW. In the event of a conflict between this Agreement and an SOW, the SOW shall control regarding scope and fees, but this Agreement shall control regarding legal terms (liability, IP, etc.).',
    ],
  },
  {
    title: '3. Service Tiers',
    paragraphs: [
      'Essential \u2014 Limited; template-based or standard designs. Two (2) revision rounds. Personal or basic commercial license.',
      'Pro \u2014 Expanded; custom designs. Four (4) revision rounds. Full commercial license.',
      'Enterprise \u2014 Comprehensive or unlimited scope. Unlimited reasonable revisions. Exclusive ownership upon full payment.',
    ],
  },
  {
    title: '4. Pricing & Payment',
    paragraphs: [
      'All prices are starting prices. Final pricing may vary based on scope. Unless otherwise stated in the SOW, payment terms are:',
      '\u2022 50% non-refundable deposit is required before work begins.',
      '\u2022 50% balance is due upon completion or prior to the release of final files/launch.',
      'Late Payments: Invoices not paid within 14 days of the due date are subject to a late fee of 1.5% per month or the maximum permitted by law. Skyfynd reserves the right to suspend all work and withhold deliverables until payment is brought current.',
    ],
  },
  {
    title: '5. Add-Ons & Recurring Services',
    paragraphs: [
      'Add-ons and recurring services must be authorized in writing. Recurring services (e.g., maintenance, hosting) may be canceled with 30 days\' written notice.',
    ],
  },
  {
    title: '6. Change Orders',
    paragraphs: [
      'Any modification to scope, deliverables, or timeline requires a written Change Order approved by both parties. Skyfynd reserves the right to adjust fees and timelines for any requested changes.',
    ],
  },
  {
    title: '7. Client Responsibilities',
    paragraphs: [
      'Client agrees to:',
      '\u2022 Provide accurate and timely information, access, and assets.',
      '\u2022 Secure rights to all materials (images, copy, fonts) provided to Skyfynd.',
      '\u2022 Respond to approvals promptly. Delays caused by Client (e.g., failure to provide feedback within 3 business days) will extend timelines day-for-day and may result in a "restart fee" if the project goes dormant for more than 14 days.',
    ],
  },
  {
    title: '8. Review & Acceptance',
    paragraphs: [
      'Upon delivery of the final Deliverables, Client shall have a period of five (5) business days ("Acceptance Period") to review the work.',
      '\u2022 If Client requests corrections within this period, Skyfynd will make the necessary adjustments consistent with the SOW.',
      '\u2022 If Client does not provide specific written corrections within the Acceptance Period, the Deliverables shall be deemed accepted, and the final balance shall become immediately due and payable.',
    ],
  },
  {
    title: '9. Intellectual Property',
    paragraphs: [
      'Deliverables: Upon full payment, Skyfynd grants Client the rights associated with the selected Tier (Essential, Pro, or Enterprise).',
      'Background IP: Skyfynd retains all right, title, and interest in and to its pre-existing materials, scripts, code libraries, proprietary tools, and design frameworks ("Background IP"). Skyfynd grants Client a perpetual, non-exclusive, royalty-free license to use Background IP solely as incorporated into the final Deliverables. Client may not extract, resell, or reverse-engineer Background IP for use in other projects.',
      'Third-Party Assets: Stock photos, fonts, or plugins purchased on Client\'s behalf remain subject to their respective third-party licenses.',
    ],
  },
  {
    title: '10. Portfolio Rights',
    paragraphs: [
      'Skyfynd retains the right to display the completed work, Client\'s name, and logo in its portfolio, website, and marketing materials for the purpose of demonstrating its capabilities, unless a specific Non-Disclosure Agreement (NDA) is signed.',
    ],
  },
  {
    title: '11. No Guarantees & Third-Party Disclaimer',
    paragraphs: [
      'Skyfynd does not guarantee results including sales, traffic, engagement, search ranking, or revenue. Third-Party Services: Skyfynd is not responsible for downtime, data loss, security breaches, or feature changes caused by third-party providers (e.g., AWS, GoDaddy, WordPress plugins, APIs). Client acknowledges that third-party services are subject to their own terms and availability.',
    ],
  },
  {
    title: '12. Confidentiality',
    paragraphs: [
      'Both parties shall keep confidential all proprietary information exchanged during the project, including trade secrets, business strategies, and customer data.',
    ],
  },
  {
    title: '13. Termination',
    paragraphs: [
      'Either party may terminate this Agreement with written notice.',
      'Fees Owed: In the event of termination by Client, Client shall pay Skyfynd for all work performed and expenses incurred up to the date of termination on a pro-rated basis. If the value of work performed exceeds the deposit, Client shall pay the difference within 10 days.',
      'Non-Refundable: Fees already paid are non-refundable.',
    ],
  },
  {
    title: '14. Limitation of Liability',
    paragraphs: [
      'To the maximum extent permitted by law, Skyfynd\'s liability is limited to the total fees paid by Client for the specific service giving rise to the claim. In no event shall Skyfynd be liable for indirect, incidental, special, or consequential damages (including lost profits or data).',
    ],
  },
  {
    title: '15. Indemnification',
    paragraphs: [
      'Client agrees to indemnify and hold Skyfynd harmless from any claims, damages, or legal fees arising from Client\'s materials, breach of this Agreement, or misuse of the Deliverables.',
    ],
  },
  {
    title: '16. Force Majeure',
    paragraphs: [
      'Neither party is liable for failure or delay in performance due to events beyond reasonable control (e.g., natural disasters, war, strikes, internet service provider failures).',
    ],
  },
  {
    title: '17. Dispute Resolution',
    paragraphs: [
      'Disputes shall be resolved through good faith negotiation. If unresolved, disputes shall be settled by binding arbitration in the county of Skyfynd\'s principal office.',
    ],
  },
  {
    title: '18. Governing Law',
    paragraphs: ['This Agreement is governed by the laws of the State of California.'],
  },
  {
    title: '19. Non-Solicitation',
    paragraphs: [
      'During the term of this Agreement and for twelve (12) months thereafter, Client agrees not to directly or indirectly solicit, recruit, or hire any employee, contractor, or agent of Skyfynd. Client agrees that the remedy for a breach of this provision shall be a payment to Skyfynd equal to 100% of the solicited individual\'s annual compensation.',
    ],
  },
  {
    title: '20. Entire Agreement',
    paragraphs: [
      'This Agreement constitutes the entire agreement between the parties and supersedes all prior agreements.',
    ],
  },
];

export async function generateSignedAgreementPDF(data: SignedPDFData): Promise<void> {
  const [{ jsPDF }, logoBase64, carlosSigBase64, juanSigBase64] = await Promise.all([
    import('jspdf'),
    fetchImageBase64(LOGO_URL),
    fetchImageBase64(CARLOS_SIG_URL),
    fetchImageBase64(JUAN_SIG_URL),
  ]);

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  const qr = data.portal.qr_number;

  const effectiveDate = new Date(data.signature.signed_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // ── Page 1 header ──
  drawPageHeader(doc, logoBase64, pageWidth, margin, qr);

  // ── Title — centered below header ──
  let y = CONTENT_START;
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Master Services Agreement', pageWidth / 2, y, { align: 'center' });
  y += 3;

  // Centered gradient divider
  drawGradientH(doc, pageWidth / 2 - 40, y, 80, 0.6);
  y += 8;

  // ── Intro paragraph ──
  doc.setTextColor(40, 40, 40);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  const introText = `This Master Services Agreement ("Agreement") is entered into as of ${effectiveDate} ("Effective Date"), by and between Skyfynd LLC ("Service Provider") and the undersigned client, ${data.portal.client_name} ("Client").`;
  const introLines = doc.splitTextToSize(introText, contentWidth);
  doc.text(introLines, margin, y);
  y += introLines.length * 4 + 2;

  doc.setFont('helvetica', 'italic');
  doc.setTextColor(120, 120, 120);
  const disclaimerText = 'By engaging Skyfynd for any services, Client agrees to be bound by this Agreement.';
  const disclaimerLines = doc.splitTextToSize(disclaimerText, contentWidth);
  doc.text(disclaimerLines, margin, y);
  y += disclaimerLines.length * 4 + 4;

  // ── Articles ──
  for (const article of ARTICLES) {
    y = checkPage(doc, y, 14, margin, logoBase64, qr);

    // Article title — black text, gradient underline
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(30, 30, 30);
    doc.text(article.title.toUpperCase(), margin, y);
    y += 1.5;
    drawGradientH(doc, margin, y, 60, 0.3);
    y += 4;

    // Article body
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(50, 50, 50);
    for (const para of article.paragraphs) {
      const lines = doc.splitTextToSize(para, contentWidth);
      y = checkPage(doc, y, lines.length * 3.5 + 2, margin, logoBase64, qr);
      doc.text(lines, margin, y);
      y += lines.length * 3.5 + 2;
    }
    y += 2;
  }

  // ═══════════════════════════════════════════
  // ── Signature Page ──
  // ═══════════════════════════════════════════
  y = checkPage(doc, y, 100, margin, logoBase64, qr);
  if (y < CONTENT_START) y = CONTENT_START;

  y += 2;
  y = drawSectionTitle(doc, 'SIGNATURES', margin, y, pageWidth, margin);

  const sigBlockWidth = (contentWidth - 12) / 2;
  const clientX = margin + sigBlockWidth + 12;

  // Column labels
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(30, 30, 30);
  doc.text('SERVICE PROVIDER', margin, y);
  doc.text('CLIENT', clientX, y);
  y += 8;

  // Service provider signatures — Carlos & Juan images (natural 3:2 ratio)
  const sigW = 33;
  const sigH = 22;
  const lineY = y + sigH - 4;
  if (carlosSigBase64) {
    try { doc.addImage(carlosSigBase64, 'PNG', margin, lineY - sigH, sigW, sigH); } catch { /* ignore */ }
  }
  if (juanSigBase64) {
    try { doc.addImage(juanSigBase64, 'PNG', margin + sigW + 2, lineY - sigH, sigW, sigH); } catch { /* ignore */ }
  }

  // Client signature image (natural proportions, sitting above line)
  const clientSigW = 50;
  const clientSigH = 22;
  try {
    doc.addImage(data.signature.signature_data_url, 'PNG', clientX, lineY - clientSigH, clientSigW, clientSigH);
  } catch {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(12);
    doc.setTextColor(150, 150, 150);
    doc.text('[Signature on file]', clientX, lineY - 6);
  }
  y = lineY + 2;

  // Signature lines — gradient
  drawGradientH(doc, margin, y, sigBlockWidth, 0.5);
  drawGradientH(doc, clientX, y, pageWidth - margin - clientX, 0.5);
  y += 4;

  // Labels under lines
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);

  doc.text('Authorized Representatives', margin, y);
  doc.text('Client Signature', clientX, y);
  y += 4;

  doc.setTextColor(30, 30, 30);
  doc.setFont('helvetica', 'bold');
  doc.text('Carlos Carrero & Juan Carrero', margin, y);
  doc.text(data.portal.client_name, clientX, y);
  y += 4;

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text('Skyfynd LLC', margin, y);
  doc.text(data.portal.client_email, clientX, y);
  y += 4;

  doc.text(`Date: ${effectiveDate}`, margin, y);
  doc.text(`Date: ${effectiveDate}`, clientX, y);

  // ═══════════════════════════════════════════
  // ── Payment Confirmation ──
  // ═══════════════════════════════════════════
  if (data.payment) {
    y += 14;
    y = checkPage(doc, y, 45, margin, logoBase64, qr);

    // Light background box
    doc.setFillColor(245, 250, 248);
    doc.roundedRect(margin, y - 4, contentWidth, 40, 2, 2, 'F');

    // Gradient accent left bar
    drawGradientV(doc, margin, y - 4, 1.5, 40);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(30, 30, 30);
    doc.text('DEPOSIT PAYMENT RECEIVED', margin + 6, y + 2);
    y += 10;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(50, 50, 50);

    const paidDate = new Date(data.payment.paid_at).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
    const paidTime = new Date(data.payment.paid_at).toLocaleTimeString('en-US', {
      hour: '2-digit', minute: '2-digit',
    });
    const amountFormatted = `$${(data.payment.amount / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

    doc.text(`Amount Paid: ${amountFormatted}`, margin + 6, y); y += 4;
    doc.text(`Payment Date: ${paidDate} at ${paidTime}`, margin + 6, y); y += 4;
    doc.text(`Confirmation: ${data.payment.confirmation_id}`, margin + 6, y); y += 4;
    doc.text(`Paid By: ${data.portal.client_name} (${data.portal.client_email})`, margin + 6, y); y += 8;

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7.5);
    doc.setTextColor(120, 120, 120);
    const payNote = 'This deposit payment confirms the commencement of the project as outlined in the agreed Statement of Work. The remaining balance is due upon completion or prior to the release of final deliverables.';
    const payNoteLines = doc.splitTextToSize(payNote, contentWidth - 10);
    doc.text(payNoteLines, margin + 6, y);
  }

  // ═══════════════════════════════════════════
  // ── Quote Summary (new pages) ──
  // ═══════════════════════════════════════════
  const quote = data.portal.quote_data;
  if (quote) {
    doc.addPage();
    drawPageHeader(doc, logoBase64, pageWidth, margin, qr);
    y = CONTENT_START;

    // Title
    doc.setTextColor(30, 30, 30);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Statement of Work \u2014 Quote Summary', pageWidth / 2, y, { align: 'center' });
    y += 3;
    drawGradientH(doc, pageWidth / 2 - 45, y, 90, 0.6);
    y += 8;

    // Date
    const dateStr = quote.submittedAt
      ? new Date(quote.submittedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
      : '';
    if (dateStr) {
      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(120, 120, 120);
      doc.text(`Quote Date: ${dateStr}`, margin, y);
      y += 7;
    }

    // ── Client info box ──
    const customer = quote.customer || { name: '', email: '', company: '', phone: '', notes: '' };
    const clientFields: [string, string][] = [
      ['Name', customer.name],
      ['Email', customer.email],
      ['Company', customer.company],
      ['Phone', customer.phone],
    ].filter(([, val]) => val) as [string, string][];

    const clientInfoHeight = 8 + clientFields.length * 5;
    doc.setFillColor(248, 248, 250);
    doc.roundedRect(margin, y - 4, contentWidth, clientInfoHeight, 2, 2, 'F');

    // Gradient accent left bar
    drawGradientV(doc, margin, y - 4, 1.5, clientInfoHeight);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 30, 30);
    doc.text('Client Information', margin + 6, y + 1);
    y += 7;

    doc.setFontSize(8.5);
    doc.setTextColor(60, 60, 60);
    for (const [label, val] of clientFields) {
      doc.setFont('helvetica', 'bold');
      doc.text(`${label}:`, margin + 6, y);
      doc.setFont('helvetica', 'normal');
      doc.text(val, margin + 28, y);
      y += 5;
    }
    y += 6;

    // ── Service Breakdown ──
    y = drawSectionTitle(doc, 'SERVICE BREAKDOWN', margin, y, pageWidth, margin);

    const services = quote.services || [];

    for (const svc of services) {
      y = checkPage(doc, y, 16, margin, logoBase64, qr);

      // Service header row — light tinted background
      doc.setFillColor(245, 245, 250);
      doc.roundedRect(margin, y - 4.5, contentWidth, 9, 1, 1, 'F');

      // Gradient accent on left
      drawGradientV(doc, margin, y - 4.5, 1.2, 9);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(30, 30, 30);
      doc.text(svc.serviceLabel, margin + 5, y);

      const prices: string[] = [];
      if (svc.oneTimeTotal > 0) prices.push(`$${fmt(svc.oneTimeTotal)}`);
      if (svc.monthlyTotal > 0) prices.push(`$${fmt(svc.monthlyTotal)}/mo`);
      if (prices.length > 0) {
        doc.setTextColor(50, 50, 50);
        doc.text(prices.join(' + '), pageWidth - margin - 3, y, { align: 'right' });
      }
      y += 8;

      // Steps
      doc.setFontSize(8);
      const renderStep = (step: ResolvedStep, indent: number) => {
        if (step.selectedId === null && step.children) {
          y = checkPage(doc, y, 6, margin, logoBase64, qr);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(60, 60, 60);
          doc.text(step.stepName, margin + indent + 5, y);
          y += 4;
          doc.setFont('helvetica', 'normal');
          for (const child of step.children) {
            y = checkPage(doc, y, 4, margin, logoBase64, qr);
            doc.setTextColor(90, 90, 90);
            doc.text(child.stepName, margin + indent + 9, y);
            doc.setTextColor(50, 50, 50);
            doc.text(child.selectedLabel, margin + 55, y);
            if (child.priceImpact !== null && child.priceImpact > 0) {
              doc.setTextColor(50, 50, 50);
              const pLabel = child.isRecurring
                ? `$${fmt(child.priceImpact)}/mo`
                : `$${fmt(child.priceImpact)}`;
              doc.text(pLabel, pageWidth - margin - 3, y, { align: 'right' });
            }
            y += 4;
          }
        } else {
          y = checkPage(doc, y, 4, margin, logoBase64, qr);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(90, 90, 90);
          doc.text(step.stepName, margin + indent + 5, y);
          doc.setTextColor(50, 50, 50);
          doc.text(step.selectedLabel, margin + 55, y);
          if (step.priceImpact !== null && step.priceImpact > 0) {
            doc.setTextColor(50, 50, 50);
            const pLabel = step.isRecurring
              ? `$${fmt(step.priceImpact)}/mo`
              : `$${fmt(step.priceImpact)}`;
            doc.text(pLabel, pageWidth - margin - 3, y, { align: 'right' });
          }
          y += 4;
        }
      };

      for (const step of svc.steps) {
        renderStep(step, 0);
      }
      y += 4;
    }

    // ═══════════════════════════════════════════
    // ── Price Summary Table ──
    // ═══════════════════════════════════════════
    y += 2;
    y = checkPage(doc, y, 55, margin, logoBase64, qr);

    y = drawSectionTitle(doc, 'PRICE SUMMARY', margin, y, pageWidth, margin);

    const col1X = margin;
    const col2X = margin + 90;
    const col3X = pageWidth - margin;

    // Table header row — dark background
    doc.setFillColor(30, 30, 40);
    doc.roundedRect(margin, y - 4, contentWidth, 8, 1, 1, 'F');
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('Service', col1X + 3, y);
    doc.text('One-Time', col2X, y);
    doc.text('Monthly', col3X - 3, y, { align: 'right' });
    y += 7;

    // Service rows — alternating backgrounds
    doc.setFontSize(9);
    for (let i = 0; i < services.length; i++) {
      const svc = services[i];
      y = checkPage(doc, y, 7, margin, logoBase64, qr);

      if (i % 2 === 0) {
        doc.setFillColor(250, 250, 252);
        doc.rect(margin, y - 4, contentWidth, 7, 'F');
      }

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(50, 50, 50);
      doc.text(svc.serviceLabel, col1X + 3, y);
      doc.text(
        svc.oneTimeTotal > 0 ? `$${fmt(svc.oneTimeTotal)}` : '\u2014',
        col2X, y,
      );
      doc.text(
        svc.monthlyTotal > 0 ? `$${fmt(svc.monthlyTotal)}/mo` : '\u2014',
        col3X - 3, y, { align: 'right' },
      );
      y += 7;
    }

    // Subtotal line
    y += 1;
    drawGradientH(doc, margin, y, contentWidth, 0.3);
    y += 6;

    const totals = quote.totals || { oneTimeTotal: 0, monthlyTotal: 0, grandTotal: 0, discountPercentage: 0, hasCustomQuote: false };

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(50, 50, 50);

    if (totals.oneTimeTotal > 0) {
      doc.text('Total One-Time', col1X + 3, y);
      doc.text(`$${fmt(totals.oneTimeTotal)}`, col2X, y);
      y += 6;
    }

    if (totals.monthlyTotal > 0) {
      doc.text('Total Monthly', col1X + 3, y);
      doc.text(`$${fmt(totals.monthlyTotal)}/mo`, col3X - 3, y, { align: 'right' });
      y += 6;
    }

    // Discount
    const discounts = quote.discounts || null;
    if (discounts && discounts.totalSaved > 0) {
      doc.setTextColor(BRAND.green.r, BRAND.green.g, BRAND.green.b);
      doc.text(`Discount (${totals.discountPercentage || 0}%)`, col1X + 3, y);
      doc.text(`-$${fmt(discounts.totalSaved)}`, col3X - 3, y, { align: 'right' });
      y += 6;
    }

    // Grand Total — highlighted box
    y += 2;
    doc.setFillColor(245, 245, 250);
    doc.roundedRect(margin, y - 5, contentWidth, 12, 1.5, 1.5, 'F');

    // Gradient accent left bar
    drawGradientV(doc, margin, y - 5, 1.5, 12);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 30, 30);
    doc.setFontSize(12);
    doc.text('ESTIMATED TOTAL', col1X + 5, y + 2);
    doc.text(`$${fmt(totals.grandTotal || 0)}`, col3X - 3, y + 2, { align: 'right' });
    y += 14;

    // Notes
    if (customer.notes) {
      y = checkPage(doc, y, 20, margin, logoBase64, qr);

      const noteLines = doc.splitTextToSize(customer.notes, contentWidth - 14);
      const noteBoxH = 10 + noteLines.length * 3.5;

      doc.setFillColor(252, 251, 248);
      doc.roundedRect(margin, y - 4, contentWidth, noteBoxH, 2, 2, 'F');

      // Gradient accent left bar
      drawGradientV(doc, margin, y - 4, 1.5, noteBoxH);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(30, 30, 30);
      doc.text('Client Notes', margin + 6, y + 1);
      y += 7;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(80, 80, 80);
      doc.text(noteLines, margin + 6, y);
      y += noteLines.length * 3.5 + 4;
    }

    // Disclaimer
    y += 6;
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7.5);
    doc.setTextColor(160, 160, 160);
    doc.text(
      'Price may vary based on final project specifications. This is an estimate and not a binding contract.',
      pageWidth / 2, y, { align: 'center' },
    );
  }

  // ═══════════════════════════════════════════
  // ── Footer on every page ──
  // ═══════════════════════════════════════════
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    drawPageFooter(doc, pageWidth, margin, i, totalPages);
  }

  doc.save(`${data.portal.qr_number}_Signed_Agreement.pdf`);
}
