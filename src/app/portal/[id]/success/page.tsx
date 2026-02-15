'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { CheckCircle2, Loader2, Download } from 'lucide-react';

export default function PaymentSuccessPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const portalId = params?.id as string;
  const sessionId = searchParams?.get('session_id');
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    // Brief loading state for UX
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

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
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;

      doc.setFillColor(26, 26, 46);
      doc.rect(0, 0, pageWidth, 35, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('Skyfynd', margin, 18);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('Master Services Agreement — Signed Copy', margin, 28);
      doc.text(data.portal.qr_number, pageWidth - margin, 18, { align: 'right' });

      let y = 45;
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('Agreement Details', margin, y);
      y += 7;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text(`Client: ${data.portal.client_name}`, margin, y); y += 5;
      doc.text(`Email: ${data.portal.client_email}`, margin, y); y += 5;
      doc.text(`Signed: ${new Date(data.signature.signed_at).toLocaleString()}`, margin, y); y += 10;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('Client Signature', margin, y);
      y += 5;
      try {
        doc.addImage(data.signature.signature_data_url, 'PNG', margin, y, 60, 25);
      } catch {
        doc.text('[Signature on file]', margin, y + 10);
      }

      doc.setFontSize(7);
      doc.setTextColor(150, 150, 150);
      doc.text(
        'Skyfynd LLC — Creative & Digital Marketing',
        pageWidth / 2, 290, { align: 'center' }
      );

      doc.save(`${data.portal.qr_number}_Signed_Agreement.pdf`);
    } catch (err) {
      console.error('PDF error:', err);
    }
    setDownloading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#10B981] mx-auto mb-4" />
          <p className="text-[#71717A] text-sm">Confirming your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-md mx-auto space-y-6">
        <div className="w-20 h-20 rounded-full bg-[#10B981]/10 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10 text-[#10B981]" />
        </div>

        <div>
          <h1
            className="text-3xl font-semibold text-[#FAFAFA] mb-3"
            style={{ fontFamily: "'Source Serif Pro', Georgia, serif" }}
          >
            Payment Received!
          </h1>
          <p className="text-[#A1A1AA]">
            Thank you for your deposit. Your project is now officially underway. We&apos;ll be in touch shortly to kick things off.
          </p>
        </div>

        {sessionId && (
          <p className="text-[#52525B] text-xs">
            Confirmation: {sessionId.slice(0, 20)}...
          </p>
        )}

        <div className="flex flex-col items-center gap-3 pt-4">
          <button
            onClick={handleDownloadContract}
            disabled={downloading}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition-all disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)' }}
          >
            <Download className="w-4 h-4" />
            {downloading ? 'Generating...' : 'Download Signed Agreement'}
          </button>
        </div>

        <p className="text-[#52525B] text-xs">
          A confirmation email will be sent to your inbox. You can close this page.
        </p>
      </div>
    </div>
  );
}
