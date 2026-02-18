'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { CheckCircle2, Loader2, Download, ArrowRight } from 'lucide-react';

export default function PaymentSuccessPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const portalId = params?.id as string;
  const sessionId = searchParams?.get('session_id');
  const model = searchParams?.get('model'); // 'subscription' | 'deposit' | null
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
    <div className="flex items-center justify-center min-h-[60vh] px-2">
      <div className="text-center max-w-md mx-auto space-y-6">
        <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-full bg-[#10B981]/10 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 sm:w-10 h-8 sm:h-10 text-[#10B981]" />
        </div>

        <div>
          <h1
            className="text-2xl sm:text-3xl font-semibold text-[#FAFAFA] mb-3"
            style={{ fontFamily: "'Source Serif Pro', Georgia, serif" }}
          >
            {model === 'subscription'
              ? 'Subscription Active!'
              : model === 'deposit'
                ? 'Deposit Received!'
                : 'Payment Received!'}
          </h1>
          <p className="text-[#A1A1AA] text-sm sm:text-base">
            {model === 'subscription'
              ? 'Your subscription is now active. You\'ll be billed monthly going forward. We\'ll be in touch shortly to kick things off.'
              : model === 'deposit'
                ? 'Thank you for your deposit. One more step \u2014 let\u2019s set up your monthly subscription.'
                : 'Thank you for your deposit. Your project is now officially underway. We\'ll be in touch shortly to kick things off.'}
          </p>
        </div>

        {sessionId && (
          <p className="text-[#52525B] text-xs">
            Confirmation: {sessionId.slice(0, 20)}...
          </p>
        )}

        <div className="flex flex-col items-center gap-3 pt-4">
          {model === 'deposit' ? (
            <a
              href={`/portal/${portalId}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition-all"
              style={{ background: 'linear-gradient(to right, rgba(167,139,250,0.75) 0%, rgba(96,175,250,0.85) 40%, rgba(52,211,153,0.8) 100%)' }}
            >
              Continue to Subscription
              <ArrowRight className="w-4 h-4" />
            </a>
          ) : (
            <button
              onClick={handleDownloadContract}
              disabled={downloading}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition-all disabled:opacity-50"
              style={{ background: 'linear-gradient(to right, rgba(167,139,250,0.75) 0%, rgba(96,175,250,0.85) 40%, rgba(52,211,153,0.8) 100%)' }}
            >
              <Download className="w-4 h-4" />
              {downloading ? 'Generating...' : 'Download Signed Agreement'}
            </button>
          )}
        </div>

        <p className="text-[#52525B] text-xs">
          A confirmation email will be sent to your inbox.
          {model === 'subscription' && ' Your subscription will renew automatically each month.'}
          {model === 'deposit' ? '' : ' You can close this page.'}
        </p>
      </div>
    </div>
  );
}
