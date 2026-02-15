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

      // Generate PDF client-side
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;

      // Header
      doc.setFillColor(26, 26, 46);
      doc.rect(0, 0, pageWidth, 35, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('Skyfynd', margin, 18);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('Master Services Agreement — Signed Copy', margin, 28);
      doc.text(qrNumber, pageWidth - margin, 18, { align: 'right' });

      let y = 45;
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);

      // Signed info
      doc.setFont('helvetica', 'bold');
      doc.text('Agreement Details', margin, y);
      y += 7;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text(`Client: ${data.portal.client_name}`, margin, y); y += 5;
      doc.text(`Email: ${data.portal.client_email}`, margin, y); y += 5;
      if (data.portal.client_company) {
        doc.text(`Company: ${data.portal.client_company}`, margin, y); y += 5;
      }
      doc.text(`Signed: ${new Date(data.signature.signed_at).toLocaleString()}`, margin, y); y += 5;
      doc.text(`IP: ${data.signature.ip_address}`, margin, y); y += 10;

      // Signature
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('Client Signature', margin, y);
      y += 5;

      try {
        doc.addImage(data.signature.signature_data_url, 'PNG', margin, y, 60, 25);
      } catch {
        doc.text('[Signature on file]', margin, y + 10);
      }
      y += 30;

      doc.setDrawColor(200, 200, 200);
      doc.line(margin, y, margin + 60, y);
      y += 5;
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text(data.signature.client_name, margin, y);

      // Footer
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(7);
        doc.setTextColor(150, 150, 150);
        doc.text(
          'This is a signed legal document. | Skyfynd LLC — Creative & Digital Marketing',
          pageWidth / 2, 290, { align: 'center' }
        );
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
