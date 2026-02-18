'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { CheckCircle2, Loader2, Download } from 'lucide-react';

export default function PaymentSuccessPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const portalId = params?.id as string;
  const sessionId = searchParams?.get('session_id');
  const model = searchParams?.get('model'); // 'subscription' | 'mixed' | null
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
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

      const { generateSignedAgreementPDF } = await import('@/lib/portal/generate-signed-pdf');
      await generateSignedAgreementPDF(data);
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
          <p className="text-[#71717A] text-sm">
            {model === 'subscription' ? 'Activating your subscription...' : 'Confirming your payment...'}
          </p>
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
            {model === 'subscription'
              ? 'Subscription Active!'
              : model === 'mixed'
                ? 'Payment & Subscription Confirmed!'
                : 'Payment Received!'}
          </h1>
          <p className="text-[#A1A1AA]">
            {model === 'subscription'
              ? 'Your subscription is now active. You\'ll be billed monthly going forward. We\'ll be in touch shortly to kick things off.'
              : model === 'mixed'
                ? 'Your deposit has been received and your monthly subscription is now active. We\'ll be in touch shortly to kick things off.'
                : 'Thank you for your deposit. Your project is now officially underway. We\'ll be in touch shortly to kick things off.'}
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
            style={{ background: 'linear-gradient(to right, rgba(167,139,250,0.75) 0%, rgba(96,175,250,0.85) 40%, rgba(52,211,153,0.8) 100%)' }}
          >
            <Download className="w-4 h-4" />
            {downloading ? 'Generating...' : 'Download Signed Agreement'}
          </button>
        </div>

        <p className="text-[#52525B] text-xs">
          A confirmation email will be sent to your inbox.
          {model === 'subscription' && ' Your subscription will renew automatically each month.'}
          {model === 'mixed' && ' Your subscription will renew automatically each month.'} You can close this page.
        </p>
      </div>
    </div>
  );
}
