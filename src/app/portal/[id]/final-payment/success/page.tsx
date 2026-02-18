'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, Loader2 } from 'lucide-react';

export default function FinalPaymentSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams?.get('session_id');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-[#60AFFA] mx-auto" />
          <p className="text-[#A1A1AA] text-sm">Confirming your payment...</p>
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
            Payment Complete!
          </h1>
          <p className="text-[#A1A1AA] text-sm sm:text-base">
            Thank you for completing your final payment. Your project balance is now fully settled. We appreciate your trust in Skyfynd!
          </p>
        </div>
        {sessionId && (
          <p className="text-[#52525B] text-xs">
            Confirmation: {sessionId.slice(0, 20)}...
          </p>
        )}
        <p className="text-[#52525B] text-xs">
          A confirmation email will be sent to your inbox. You can close this page.
        </p>
      </div>
    </div>
  );
}
