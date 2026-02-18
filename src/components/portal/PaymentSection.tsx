'use client';

import { useState } from 'react';
import { CreditCard, Loader2, RefreshCw } from 'lucide-react';
import { getPaymentModel } from '@/lib/portal/payment-model';

interface PaymentSectionProps {
  portalId: string;
  grandTotal: number;
  oneTimeTotal: number;
  monthlyTotal: number;
}

function fmt(n: number): string {
  return Number(n).toLocaleString('en-US');
}

export default function PaymentSection({ portalId, grandTotal, oneTimeTotal, monthlyTotal }: PaymentSectionProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const paymentModel = getPaymentModel({ oneTimeTotal, monthlyTotal });
  const depositAmount = paymentModel === 'mixed'
    ? Math.round(oneTimeTotal * 0.5)
    : Math.round(grandTotal * 0.5);

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

  // ── Subscription-only ──
  if (paymentModel === 'subscription-only') {
    return (
      <div className="text-center space-y-6">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto"
          style={{ background: 'linear-gradient(to right, rgba(167,139,250,0.75) 0%, rgba(96,175,250,0.85) 40%, rgba(52,211,153,0.8) 100%)' }}
        >
          <RefreshCw className="w-8 h-8 text-white" />
        </div>

        <div>
          <h2
            className="text-2xl font-semibold text-[#FAFAFA] mb-2"
            style={{ fontFamily: "'Source Serif Pro', Georgia, serif" }}
          >
            Start Your Subscription
          </h2>
          <p className="text-[#A1A1AA] max-w-md mx-auto">
            Your selected services are billed monthly. No upfront deposit required.
          </p>
        </div>

        <div className="max-w-sm mx-auto rounded-lg border border-white/[0.06] overflow-hidden">
          <div className="flex justify-between px-5 py-3 text-sm">
            <span className="text-[#71717A]">Monthly Subscription</span>
            <span className="text-[#FAFAFA] font-semibold">${fmt(monthlyTotal)}/mo</span>
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
                <RefreshCw className="w-4 h-4" />
                Pay ${fmt(monthlyTotal)}/mo
              </>
            )}
          </button>
        </div>

        <p className="text-[#52525B] text-xs">
          Secure payment powered by Stripe. You can cancel anytime.
        </p>
      </div>
    );
  }

  // ── Mixed: deposit + subscription ──
  if (paymentModel === 'mixed') {
    const todayTotal = depositAmount + monthlyTotal;

    return (
      <div className="text-center space-y-6">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto"
          style={{ background: 'linear-gradient(to right, rgba(167,139,250,0.75) 0%, rgba(96,175,250,0.85) 40%, rgba(52,211,153,0.8) 100%)' }}
        >
          <CreditCard className="w-8 h-8 text-white" />
        </div>

        <div>
          <h2
            className="text-2xl font-semibold text-[#FAFAFA] mb-2"
            style={{ fontFamily: "'Source Serif Pro', Georgia, serif" }}
          >
            Pay &amp; Subscribe
          </h2>
          <p className="text-[#A1A1AA] max-w-md mx-auto">
            A 50% deposit on one-time services is required to begin, plus your monthly subscription.
          </p>
        </div>

        <div className="max-w-sm mx-auto rounded-lg border border-white/[0.06] overflow-hidden">
          <div className="flex justify-between px-5 py-3 text-sm">
            <span className="text-[#71717A]">One-Time Services</span>
            <span className="text-[#A1A1AA]">${fmt(oneTimeTotal)}</span>
          </div>
          <div className="flex justify-between px-5 py-3 text-sm border-t border-white/[0.06]">
            <span className="text-[#71717A]">Deposit (50%)</span>
            <span className="text-[#FAFAFA] font-semibold">${fmt(depositAmount)}</span>
          </div>
          <div className="flex justify-between px-5 py-3 text-sm border-t border-white/[0.06]">
            <span className="text-[#71717A]">Monthly Subscription</span>
            <span className="text-[#FAFAFA] font-semibold">${fmt(monthlyTotal)}/mo</span>
          </div>
          <div
            className="flex justify-between px-5 py-3 text-sm border-t border-white/[0.06] font-semibold"
            style={{ background: 'linear-gradient(to right, rgba(167,139,250,0.15) 0%, rgba(96,175,250,0.15) 40%, rgba(52,211,153,0.15) 100%)' }}
          >
            <span className="text-[#FAFAFA]">Due Today</span>
            <span className="text-[#FAFAFA]">${fmt(todayTotal)}</span>
          </div>
          <div className="flex justify-between px-5 py-3 text-sm border-t border-white/[0.06] bg-white/[0.02]">
            <span className="text-[#71717A]">Due on completion</span>
            <span className="text-[#A1A1AA]">${fmt(oneTimeTotal - depositAmount)}</span>
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
                Pay ${fmt(todayTotal)}
              </>
            )}
          </button>
        </div>

        <p className="text-[#52525B] text-xs">
          Secure payment powered by Stripe. Your card details are never stored on our servers.
        </p>
      </div>
    );
  }

  // ── One-time only: unchanged ──
  return (
    <div className="text-center space-y-6">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto"
        style={{ background: 'linear-gradient(to right, rgba(167,139,250,0.75) 0%, rgba(96,175,250,0.85) 40%, rgba(52,211,153,0.8) 100%)' }}
      >
        <CreditCard className="w-8 h-8 text-white" />
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
      </div>

      <p className="text-[#52525B] text-xs">
        Secure payment powered by Stripe. Your card details are never stored on our servers.
      </p>
    </div>
  );
}
