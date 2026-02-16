import type { jsPDF } from 'jspdf';

const LOGO_URL = 'https://f005.backblazeb2.com/file/SKYFYND-assets/Skyfynd+logo.png';

interface SignedPDFData {
  portal: { qr_number: string; client_name: string; client_email: string };
  signature: { signature_data_url: string; signed_at: string };
  payment?: { amount: number; paid_at: string; confirmation_id: string } | null;
}

async function fetchLogoBase64(): Promise<string | null> {
  try {
    const res = await fetch(LOGO_URL);
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
      'Essential — Limited; template-based or standard designs. Two (2) revision rounds. Personal or basic commercial license.',
      'Pro — Expanded; custom designs. Four (4) revision rounds. Full commercial license.',
      'Enterprise — Comprehensive or unlimited scope. Unlimited reasonable revisions. Exclusive ownership upon full payment.',
    ],
  },
  {
    title: '4. Pricing & Payment',
    paragraphs: [
      'All prices are starting prices. Final pricing may vary based on scope. Unless otherwise stated in the SOW, payment terms are:',
      '• 50% non-refundable deposit is required before work begins.',
      '• 50% balance is due upon completion or prior to the release of final files/launch.',
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
      '• Provide accurate and timely information, access, and assets.',
      '• Secure rights to all materials (images, copy, fonts) provided to Skyfynd.',
      '• Respond to approvals promptly. Delays caused by Client (e.g., failure to provide feedback within 3 business days) will extend timelines day-for-day and may result in a "restart fee" if the project goes dormant for more than 14 days.',
    ],
  },
  {
    title: '8. Review & Acceptance',
    paragraphs: [
      'Upon delivery of the final Deliverables, Client shall have a period of five (5) business days ("Acceptance Period") to review the work.',
      '• If Client requests corrections within this period, Skyfynd will make the necessary adjustments consistent with the SOW.',
      '• If Client does not provide specific written corrections within the Acceptance Period, the Deliverables shall be deemed accepted, and the final balance shall become immediately due and payable.',
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

function checkPage(doc: jsPDF, y: number, needed: number, margin: number): number {
  const pageHeight = doc.internal.pageSize.getHeight();
  if (y + needed > pageHeight - 15) {
    doc.addPage();
    return margin;
  }
  return y;
}

export async function generateSignedAgreementPDF(data: SignedPDFData): Promise<void> {
  const [{ jsPDF }, logoBase64] = await Promise.all([
    import('jspdf'),
    fetchLogoBase64(),
  ]);

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  const effectiveDate = new Date(data.signature.signed_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // ── Page 1: Header ──
  doc.setFillColor(26, 26, 46);
  doc.rect(0, 0, pageWidth, 38, 'F');

  if (logoBase64) {
    try {
      doc.addImage(logoBase64, 'PNG', margin, 6, 32, 22);
    } catch {
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bolditalic');
      doc.text('Skyfynd', margin, 20);
    }
  } else {
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bolditalic');
    doc.text('Skyfynd', margin, 20);
  }

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Master Services Agreement', margin, 34);
  doc.text(data.portal.qr_number, pageWidth - margin, 18, { align: 'right' });

  let y = 46;

  // ── Intro paragraph ──
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  const introText = `This Master Services Agreement ("Agreement") is entered into as of ${effectiveDate} ("Effective Date"), by and between Skyfynd LLC ("Service Provider") and the undersigned client, ${data.portal.client_name} ("Client").`;
  const introLines = doc.splitTextToSize(introText, contentWidth);
  doc.text(introLines, margin, y);
  y += introLines.length * 4 + 2;

  doc.setFont('helvetica', 'italic');
  doc.setTextColor(100, 100, 100);
  const disclaimerText = 'By engaging Skyfynd for any services, Client agrees to be bound by this Agreement.';
  const disclaimerLines = doc.splitTextToSize(disclaimerText, contentWidth);
  doc.text(disclaimerLines, margin, y);
  y += disclaimerLines.length * 4 + 4;

  // ── Articles ──
  doc.setTextColor(0, 0, 0);

  for (const article of ARTICLES) {
    // Check if we need a new page for the title + at least one paragraph
    y = checkPage(doc, y, 14, margin);

    // Article title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.text(article.title.toUpperCase(), margin, y);
    y += 1;
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, y, pageWidth - margin, y);
    y += 4;

    // Paragraphs
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    for (const para of article.paragraphs) {
      const lines = doc.splitTextToSize(para, contentWidth);
      y = checkPage(doc, y, lines.length * 3.5 + 2, margin);
      doc.text(lines, margin, y);
      y += lines.length * 3.5 + 2;
    }
    y += 2;
  }

  // ── Signature Page ──
  y = checkPage(doc, y, 90, margin);
  if (y < margin + 5) y = margin;

  // Divider
  y += 4;
  doc.setDrawColor(26, 26, 46);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += 10;

  const sigBlockWidth = (contentWidth - 10) / 2;

  // SERVICE PROVIDER section
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(0, 0, 0);
  doc.text('SERVICE PROVIDER', margin, y);
  doc.text('CLIENT', margin + sigBlockWidth + 10, y);
  y += 8;

  // Service provider signature (stylized company name)
  doc.setFont('helvetica', 'bolditalic');
  doc.setFontSize(18);
  doc.setTextColor(26, 26, 46);
  doc.text('Skyfynd LLC', margin, y);

  // Client signature image
  try {
    doc.addImage(data.signature.signature_data_url, 'PNG', margin + sigBlockWidth + 10, y - 10, 55, 20);
  } catch {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(12);
    doc.text('[Signature on file]', margin + sigBlockWidth + 10, y);
  }
  y += 14;

  // Signature lines
  doc.setDrawColor(26, 26, 46);
  doc.setLineWidth(0.3);
  doc.line(margin, y, margin + sigBlockWidth, y);
  doc.line(margin + sigBlockWidth + 10, y, pageWidth - margin, y);
  y += 4;

  // Labels under signature lines
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);

  doc.text('Authorized Representative', margin, y);
  doc.text('Client Signature', margin + sigBlockWidth + 10, y);
  y += 4;

  doc.text(`Carlos Carrero & Juan Carrero`, margin, y);
  doc.text(data.portal.client_name, margin + sigBlockWidth + 10, y);
  y += 4;

  doc.text(`Date: ${effectiveDate}`, margin, y);
  doc.text(`Date: ${effectiveDate}`, margin + sigBlockWidth + 10, y);
  y += 4;

  doc.text('Skyfynd LLC', margin, y);
  doc.text(data.portal.client_email, margin + sigBlockWidth + 10, y);

  // ── Payment Confirmation ──
  if (data.payment) {
    y += 12;
    y = checkPage(doc, y, 40, margin);

    doc.setDrawColor(16, 185, 129);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(16, 185, 129);
    doc.text('DEPOSIT PAYMENT RECEIVED', margin, y);
    y += 6;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(0, 0, 0);

    const paidDate = new Date(data.payment.paid_at).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
    const paidTime = new Date(data.payment.paid_at).toLocaleTimeString('en-US', {
      hour: '2-digit', minute: '2-digit',
    });
    const amountFormatted = `$${(data.payment.amount / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

    doc.text(`Amount Paid: ${amountFormatted}`, margin, y);
    y += 4;
    doc.text(`Payment Date: ${paidDate} at ${paidTime}`, margin, y);
    y += 4;
    doc.text(`Confirmation: ${data.payment.confirmation_id}`, margin, y);
    y += 4;
    doc.text(`Paid By: ${data.portal.client_name} (${data.portal.client_email})`, margin, y);
    y += 6;

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    const payNote = 'This deposit payment confirms the commencement of the project as outlined in the agreed Statement of Work. The remaining balance is due upon completion or prior to the release of final deliverables.';
    const payNoteLines = doc.splitTextToSize(payNote, contentWidth);
    doc.text(payNoteLines, margin, y);
  }

  // ── Footer on every page ──
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setTextColor(170, 170, 170);
    doc.setFont('helvetica', 'normal');
    doc.text(
      'Skyfynd LLC — Creative & Digital Marketing — Confidential',
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 8,
      { align: 'center' }
    );
    doc.text(
      `Page ${i} of ${totalPages}`,
      pageWidth - margin,
      doc.internal.pageSize.getHeight() - 8,
      { align: 'right' }
    );
  }

  doc.save(`${data.portal.qr_number}_Signed_Agreement.pdf`);
}
