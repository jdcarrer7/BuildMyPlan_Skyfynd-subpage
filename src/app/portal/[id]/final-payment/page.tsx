'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { CreditCard, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

interface FinalPaymentData {
  qrNumber: string;
  clientName: string;
  grandTotal: number;
  depositAmount: number;
  depositPaidAt: string;
  remainingAmount: number;
  finalPaymentStatus: string | null;
  finalPaymentPaidAt: string | null;
}

function fmt(n: number): string {
  return Number(n).toLocaleString('en-US');
}

export default function FinalPaymentPage() {
  const params = useParams();
  const portalId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<FinalPaymentData | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/portal/${portalId}/final-payment`);
        const json = await res.json();
        if (!res.ok) {
          setError(json.error || 'Failed to load payment data');
        } else {
          setData(json);
        }
      } catch {
        setError('Failed to load payment data');
      } finally {
        setLoading(false);
      }
    }
    if (portalId) fetchData();
  }, [portalId]);

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/portal/${portalId}/final-checkout/`, { method: 'POST' });
      const json = await res.json();
      if (res.ok && json.checkoutUrl) {
        window.location.href = json.checkoutUrl;
      } else {
        setError(json.error || 'Failed to start checkout');
        setCheckoutLoading(false);
      }
    } catch {
      setError('Failed to start checkout');
      setCheckoutLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-[#60AFFA]" />
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md mx-auto space-y-4">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  // Already paid
  if (data.finalPaymentStatus === 'completed') {
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
              Payment Complete
            </h1>
            <p className="text-[#A1A1AA]">
              Your final payment has already been received. Thank you!
            </p>
          </div>
        </div>
      </div>
    );
  }

  const depositDollars = data.depositAmount / 100;
  const remainingDollars = data.remainingAmount / 100;
  const depositDate = data.depositPaidAt
    ? new Date(data.depositPaidAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : '';

  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4">
      <div className="w-full max-w-lg space-y-8">
        {/* Header */}
        <div className="text-center">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: 'linear-gradient(to right, rgba(167,139,250,0.75) 0%, rgba(96,175,250,0.85) 40%, rgba(52,211,153,0.8) 100%)' }}
          >
            <CreditCard className="w-8 h-8 text-white" />
          </div>
          <h1
            className="text-3xl font-semibold text-[#FAFAFA] mb-2"
            style={{ fontFamily: "'Source Serif Pro', Georgia, serif" }}
          >
            Final Payment
          </h1>
          <p className="text-[#A1A1AA]">
            Complete your remaining balance to finalize your project.
          </p>
        </div>

        {/* Payment Breakdown Card */}
        <div className="rounded-2xl bg-[#111113] border border-white/[0.06] p-4 sm:p-6 lg:p-8">
          <div className="text-center mb-6">
            <p className="text-[#71717A] text-sm">{data.qrNumber}</p>
          </div>

          <div className="rounded-lg border border-white/[0.06] overflow-hidden">
            {/* Project Total */}
            <div className="flex justify-between px-3 sm:px-5 py-3.5 text-sm">
              <span className="text-[#71717A]">Project Total</span>
              <span className="text-[#A1A1AA] font-medium">${fmt(data.grandTotal)}</span>
            </div>

            {/* Deposit Paid */}
            <div className="flex justify-between px-3 sm:px-5 py-3.5 text-sm border-t border-white/[0.06]">
              <div>
                <span className="text-[#71717A]">Deposit Paid</span>
                {depositDate && (
                  <p className="text-[#52525B] text-xs mt-0.5">{depositDate}</p>
                )}
              </div>
              <span className="text-[#10B981] font-semibold">-${fmt(depositDollars)}</span>
            </div>

            {/* Remaining Balance */}
            <div
              className="flex justify-between items-center px-3 sm:px-5 py-4 text-sm border-t border-white/[0.06]"
              style={{ background: 'linear-gradient(to right, rgba(167,139,250,0.08), rgba(52,211,153,0.08))' }}
            >
              <span className="text-[#FAFAFA] font-semibold">Remaining Balance</span>
              <span className="text-[#FAFAFA] font-bold text-lg">${fmt(remainingDollars)}</span>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-4 text-xs text-red-400 bg-red-500/10 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          {/* Pay button */}
          <div className="mt-6 flex flex-col items-center gap-3">
            <button
              onClick={handleCheckout}
              disabled={checkoutLoading}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-lg font-semibold text-white transition-all disabled:opacity-50 hover:opacity-90 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(96,175,250,0.25)] border border-white/[0.15]"
              style={{ background: 'linear-gradient(to right, rgba(167,139,250,0.75) 0%, rgba(96,175,250,0.85) 40%, rgba(52,211,153,0.8) 100%)' }}
            >
              {checkoutLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CreditCard className="w-4 h-4" />
              )}
              {checkoutLoading ? 'Processing...' : `Pay $${fmt(remainingDollars)}`}
            </button>
            <p className="text-[#52525B] text-xs">Secure payment powered by Stripe.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
