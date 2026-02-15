'use client';

import { useState } from 'react';
import { CreditCard, Loader2, Download } from 'lucide-react';

interface PaymentSectionProps {
  portalId: string;
  grandTotal: number;
  qrNumber: string;
}

function fmt(n: number): string {
  return Number(n).toLocaleString('en-US');
}

export default function PaymentSection({ portalId, grandTotal, qrNumber }: PaymentSectionProps) {
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const depositAmount = Math.round(grandTotal * 0.5);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/portal/${portalId}/checkout`, { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        setError(data.error || 'Failed to start checkout');
        setLoading(false);
      }
    } catch {
      setError('Network error. Please try again.');
      setLoading(false);
    }
  };

  const handleDownloadContract = async () => {
    setDownloading(true);
    try {
      const res = await fetch(`/api/portal/${portalId}/contract-pdf`);
      const data = await res.json();

      if (!res.ok || !data.signature) {
        setDownloading(false);
        return;
      }

      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pw = doc.internal.pageSize.getWidth();
      const ph = doc.internal.pageSize.getHeight();
      const mx = 20;
      const cw = pw - mx * 2;
      const maxY = ph - 15;
      let y = 0;

      const effectiveDate = new Date(data.portal.created_at).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
      });

      // ── helpers ──
      const ensureSpace = (needed: number) => {
        if (y + needed > maxY) { doc.addPage(); y = 20; }
      };

      const writeText = (text: string, opts?: { bold?: boolean; italic?: boolean; size?: number; indent?: number; color?: [number, number, number] }) => {
        const sz = opts?.size ?? 9;
        const ind = opts?.indent ?? 0;
        const lh = sz * 0.42;
        const style = opts?.bold && opts?.italic ? 'bolditalic' : opts?.bold ? 'bold' : opts?.italic ? 'italic' : 'normal';
        doc.setFontSize(sz);
        doc.setFont('helvetica', style);
        const [r, g, b] = opts?.color ?? [26, 26, 46];
        doc.setTextColor(r, g, b);
        const lines: string[] = doc.splitTextToSize(text, cw - ind);
        for (const line of lines) {
          ensureSpace(lh);
          doc.text(line, mx + ind, y);
          y += lh;
        }
        y += 1;
      };

      const writeBullet = (text: string) => {
        const lh = 3.8;
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(26, 26, 46);
        const lines: string[] = doc.splitTextToSize(text, cw - 10);
        ensureSpace(lines.length * lh + 1);
        doc.text('\u2022', mx + 6, y);
        for (let i = 0; i < lines.length; i++) {
          doc.text(lines[i], mx + 10, y);
          y += lh;
        }
        y += 0.5;
      };

      const writeHeading = (num: number, title: string) => {
        ensureSpace(12);
        y += 3;
        doc.setFontSize(10.5);
        doc.setFont('times', 'bold');
        doc.setTextColor(26, 26, 46);
        doc.text(`${num}. ${title.toUpperCase()}`, mx, y);
        y += 1;
        doc.setDrawColor(221, 221, 221);
        doc.line(mx, y, pw - mx, y);
        y += 4;
      };

      // ── HEADER ──
      doc.setFillColor(26, 26, 46);
      doc.rect(0, 0, pw, 32, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18);
      doc.setFont('times', 'bold');
      doc.text('Skyfynd', mx, 16);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('Master Services Agreement', mx, 25);
      doc.setFontSize(9);
      doc.text(qrNumber, pw - mx, 16, { align: 'right' });
      y = 40;

      // ── INTRO ──
      writeText(
        `This Master Services Agreement (\u201CAgreement\u201D) is entered into as of ${effectiveDate} (\u201CEffective Date\u201D), by and between Skyfynd LLC (\u201CService Provider\u201D) and the undersigned client, ${data.portal.client_name} (\u201CClient\u201D).`
      );
      y += 1;
      writeText('By engaging Skyfynd for any services, Client agrees to be bound by this Agreement.', { italic: true, color: [85, 85, 85] });
      y += 2;

      // ── ARTICLES ──

      writeHeading(1, 'Services');
      writeText('Skyfynd provides digital services including, but not limited to, website development, application development, branding, design, marketing, animation, content creation, and related professional services (\u201CServices\u201D). All Services are project-based unless expressly stated otherwise in writing.');

      writeHeading(2, 'Statement of Work (SOW)');
      writeText('Each engagement shall be governed by a written Statement of Work (or formal Quote/Proposal) that specifies:');
      writeBullet('Selected services');
      writeBullet('Tier (Essential, Pro, or Enterprise)');
      writeBullet('Deliverables');
      writeBullet('Timeline');
      writeBullet('Fees and payment terms');
      y += 1;
      writeText('No services are provided without an agreed SOW. In the event of a conflict between this Agreement and an SOW, the SOW shall control regarding scope and fees, but this Agreement shall control regarding legal terms (liability, IP, etc.).');

      writeHeading(3, 'Service Tiers');
      ensureSpace(35);
      const cols = [28, cw * 0.38, cw * 0.22, cw - 28 - cw * 0.38 - cw * 0.22];
      const cx = [mx, mx + cols[0], mx + cols[0] + cols[1], mx + cols[0] + cols[1] + cols[2]];
      const rh = 7;
      doc.setFillColor(26, 26, 46);
      doc.rect(mx, y - 1, cw, rh, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'bold');
      doc.text('TIER', cx[0] + 2, y + 3);
      doc.text('SCOPE', cx[1] + 2, y + 3);
      doc.text('REVISIONS', cx[2] + 2, y + 3);
      doc.text('LICENSE', cx[3] + 2, y + 3);
      y += rh;
      const tiers = [
        ['Essential', 'Limited; template-based or standard designs', 'Two (2) rounds', 'Personal or basic commercial'],
        ['Pro', 'Expanded; custom designs', 'Four (4) rounds', 'Full commercial license'],
        ['Enterprise', 'Comprehensive or unlimited', 'Unlimited reasonable', 'Exclusive ownership upon full payment'],
      ];
      doc.setTextColor(26, 26, 46);
      doc.setFontSize(8);
      tiers.forEach((row, ri) => {
        ensureSpace(rh + 2);
        if (ri === 1) { doc.setFillColor(249, 249, 251); doc.rect(mx, y - 1, cw, rh, 'F'); }
        doc.setFont('helvetica', 'bold');
        doc.text(row[0], cx[0] + 2, y + 3);
        doc.setFont('helvetica', 'normal');
        doc.text(doc.splitTextToSize(row[1], cols[1] - 4)[0], cx[1] + 2, y + 3);
        doc.text(row[2], cx[2] + 2, y + 3);
        doc.text(doc.splitTextToSize(row[3], cols[3] - 4)[0], cx[3] + 2, y + 3);
        if (ri < 2) { doc.setDrawColor(229, 229, 229); doc.line(mx, y + rh - 1, pw - mx, y + rh - 1); }
        y += rh;
      });
      y += 3;

      writeHeading(4, 'Pricing & Payment');
      writeText('All prices are starting prices. Final pricing may vary based on scope. Unless otherwise stated in the SOW, payment terms are:');
      writeBullet('50% non-refundable deposit is required before work begins.');
      writeBullet('50% balance is due upon completion or prior to the release of final files/launch.');
      y += 1;
      writeText('Late Payments: Invoices not paid within 14 days of the due date are subject to a late fee of 1.5% per month or the maximum permitted by law. Skyfynd reserves the right to suspend all work and withhold deliverables until payment is brought current.');

      writeHeading(5, 'Add-Ons & Recurring Services');
      writeText('Add-ons and recurring services must be authorized in writing. Recurring services (e.g., maintenance, hosting) may be canceled with 30 days\' written notice.');

      writeHeading(6, 'Change Orders');
      writeText('Any modification to scope, deliverables, or timeline requires a written Change Order approved by both parties. Skyfynd reserves the right to adjust fees and timelines for any requested changes.');

      writeHeading(7, 'Client Responsibilities');
      writeText('Client agrees to:');
      writeBullet('Provide accurate and timely information, access, and assets.');
      writeBullet('Secure rights to all materials (images, copy, fonts) provided to Skyfynd.');
      writeBullet('Respond to approvals promptly. Delays caused by Client (e.g., failure to provide feedback within 3 business days) will extend timelines day-for-day and may result in a \u201Crestart fee\u201D if the project goes dormant for more than 14 days.');

      writeHeading(8, 'Review & Acceptance');
      writeText('Upon delivery of the final Deliverables, Client shall have a period of five (5) business days (\u201CAcceptance Period\u201D) to review the work.');
      writeBullet('If Client requests corrections within this period, Skyfynd will make the necessary adjustments consistent with the SOW.');
      writeBullet('If Client does not provide specific written corrections within the Acceptance Period, the Deliverables shall be deemed accepted, and the final balance shall become immediately due and payable.');

      writeHeading(9, 'Intellectual Property');
      writeText('Deliverables: Upon full payment, Skyfynd grants Client the rights associated with the selected Tier (Essential, Pro, or Enterprise).');
      y += 1;
      writeText('Background IP: Skyfynd retains all right, title, and interest in and to its pre-existing materials, scripts, code libraries, proprietary tools, and design frameworks (\u201CBackground IP\u201D). Skyfynd grants Client a perpetual, non-exclusive, royalty-free license to use Background IP solely as incorporated into the final Deliverables. Client may not extract, resell, or reverse-engineer Background IP for use in other projects.');
      y += 1;
      writeText('Third-Party Assets: Stock photos, fonts, or plugins purchased on Client\'s behalf remain subject to their respective third-party licenses.');

      writeHeading(10, 'Portfolio Rights');
      writeText('Skyfynd retains the right to display the completed work, Client\'s name, and logo in its portfolio, website, and marketing materials for the purpose of demonstrating its capabilities, unless a specific Non-Disclosure Agreement (NDA) is signed.');

      writeHeading(11, 'No Guarantees & Third-Party Disclaimer');
      writeText('Skyfynd does not guarantee results including sales, traffic, engagement, search ranking, or revenue. Third-Party Services: Skyfynd is not responsible for downtime, data loss, security breaches, or feature changes caused by third-party providers (e.g., AWS, GoDaddy, WordPress plugins, APIs). Client acknowledges that third-party services are subject to their own terms and availability.');

      writeHeading(12, 'Confidentiality');
      writeText('Both parties shall keep confidential all proprietary information exchanged during the project, including trade secrets, business strategies, and customer data.');

      writeHeading(13, 'Termination');
      writeText('Either party may terminate this Agreement with written notice.');
      y += 1;
      writeText('Fees Owed: In the event of termination by Client, Client shall pay Skyfynd for all work performed and expenses incurred up to the date of termination on a pro-rated basis. If the value of work performed exceeds the deposit, Client shall pay the difference within 10 days.');
      y += 1;
      writeText('Non-Refundable: Fees already paid are non-refundable.');

      writeHeading(14, 'Limitation of Liability');
      writeText('To the maximum extent permitted by law, Skyfynd\'s liability is limited to the total fees paid by Client for the specific service giving rise to the claim. In no event shall Skyfynd be liable for indirect, incidental, special, or consequential damages (including lost profits or data).');

      writeHeading(15, 'Indemnification');
      writeText('Client agrees to indemnify and hold Skyfynd harmless from any claims, damages, or legal fees arising from Client\'s materials, breach of this Agreement, or misuse of the Deliverables.');

      writeHeading(16, 'Force Majeure');
      writeText('Neither party is liable for failure or delay in performance due to events beyond reasonable control (e.g., natural disasters, war, strikes, internet service provider failures).');

      writeHeading(17, 'Dispute Resolution');
      writeText('Disputes shall be resolved through good faith negotiation. If unresolved, disputes shall be settled by binding arbitration in the county of Skyfynd\'s principal office.');

      writeHeading(18, 'Governing Law');
      writeText('This Agreement is governed by the laws of the State of California.');

      writeHeading(19, 'Non-Solicitation');
      writeText('During the term of this Agreement and for twelve (12) months thereafter, Client agrees not to directly or indirectly solicit, recruit, or hire any employee, contractor, or agent of Skyfynd. Client agrees that the remedy for a breach of this provision shall be a payment to Skyfynd equal to 100% of the solicited individual\'s annual compensation.');

      writeHeading(20, 'Entire Agreement');
      writeText('This Agreement constitutes the entire agreement between the parties and supersedes all prior agreements.');

      // ── SIGNATURE BLOCK ──
      ensureSpace(65);
      y += 6;
      doc.setDrawColor(200, 200, 200);
      doc.line(mx, y, pw - mx, y);
      y += 8;
      doc.setFontSize(11);
      doc.setFont('times', 'bold');
      doc.setTextColor(26, 26, 46);
      doc.text('Signatures', mx, y);
      y += 8;

      const sigColW = (cw - 10) / 2;
      const lx = mx;
      const rx = mx + sigColW + 10;

      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(26, 26, 46);
      doc.text('CLIENT', lx, y);
      doc.text('SERVICE PROVIDER', rx, y);
      y += 6;

      const sigY = y;
      try {
        doc.addImage(data.signature.signature_data_url, 'PNG', lx, sigY, 55, 22);
      } catch {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(9);
        doc.text('[Signature on file]', lx, sigY + 10);
      }

      doc.setFont('times', 'bolditalic');
      doc.setFontSize(16);
      doc.setTextColor(26, 26, 46);
      doc.text('Skyfynd LLC', rx, sigY + 12);

      y = sigY + 26;
      doc.setDrawColor(180, 180, 180);
      doc.line(lx, y, lx + sigColW, y);
      doc.line(rx, y, rx + sigColW, y);
      y += 4;

      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(80, 80, 80);
      doc.text(data.signature.client_name, lx, y);
      doc.text('Authorized Representative', rx, y);
      y += 4;
      const signedDate = new Date(data.signature.signed_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      doc.text(`Date: ${signedDate}`, lx, y);
      doc.text(`Date: ${effectiveDate}`, rx, y);
      y += 4;
      if (data.portal.client_company) doc.text(data.portal.client_company, lx, y);
      doc.text('Skyfynd LLC', rx, y);

      // ── FOOTER ON EVERY PAGE ──
      const pages = doc.getNumberOfPages();
      for (let i = 1; i <= pages; i++) {
        doc.setPage(i);
        doc.setFontSize(7);
        doc.setTextColor(150, 150, 150);
        doc.text('This is a signed legal document. | Skyfynd LLC \u2014 Creative & Digital Marketing', pw / 2, ph - 8, { align: 'center' });
        doc.text(`Page ${i} of ${pages}`, pw - mx, ph - 8, { align: 'right' });
      }

      doc.save(`${qrNumber}_Signed_Agreement.pdf`);
    } catch (err) {
      console.error('PDF error:', err);
    }
    setDownloading(false);
  };

  return (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-[#A78BFA]/10 flex items-center justify-center mx-auto">
        <CreditCard className="w-8 h-8 text-[#A78BFA]" />
      </div>

      <div>
        <h2
          className="text-2xl font-semibold text-[#FAFAFA] mb-2"
          style={{ fontFamily: "'Source Serif Pro', Georgia, serif" }}
        >
          Pay Your Deposit
        </h2>
        <p className="text-[#A1A1AA] max-w-md mx-auto">
          A 50% deposit is required to begin work on your project. The remaining balance is due upon completion.
        </p>
      </div>

      {/* Amount breakdown */}
      <div className="max-w-sm mx-auto rounded-lg border border-white/[0.06] overflow-hidden">
        <div className="flex justify-between px-5 py-3 text-sm">
          <span className="text-[#71717A]">Project Total</span>
          <span className="text-[#A1A1AA]">${fmt(grandTotal)}</span>
        </div>
        <div className="flex justify-between px-5 py-3 text-sm border-t border-white/[0.06]">
          <span className="text-[#71717A]">Deposit (50%)</span>
          <span className="text-[#FAFAFA] font-semibold">${fmt(depositAmount)}</span>
        </div>
        <div className="flex justify-between px-5 py-3 text-sm border-t border-white/[0.06] bg-white/[0.02]">
          <span className="text-[#71717A]">Due on completion</span>
          <span className="text-[#A1A1AA]">${fmt(grandTotal - depositAmount)}</span>
        </div>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="flex flex-col items-center gap-3">
        <button
          onClick={handleCheckout}
          disabled={loading}
          className="inline-flex items-center gap-2 px-8 py-3 rounded-lg font-semibold text-white transition-all disabled:opacity-50"
          style={{ background: 'linear-gradient(to right, rgba(167,139,250,0.75) 0%, rgba(96,175,250,0.85) 40%, rgba(52,211,153,0.8) 100%)' }}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Redirecting to Stripe...
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4" />
              Pay ${fmt(depositAmount)} Deposit
            </>
          )}
        </button>

        <button
          onClick={handleDownloadContract}
          disabled={downloading}
          className="inline-flex items-center gap-2 text-sm text-[#A78BFA] hover:underline disabled:opacity-50"
        >
          <Download className="w-3.5 h-3.5" />
          {downloading ? 'Generating...' : 'Download Signed Agreement'}
        </button>
      </div>

      <p className="text-[#52525B] text-xs">
        Secure payment powered by Stripe. Your card details are never stored on our servers.
      </p>
    </div>
  );
}
