'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Loader2, FileText, PenLine, CreditCard, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import type { Portal } from '@/lib/supabase/types';
import EmailVerification from '@/components/portal/EmailVerification';
import QuoteSummary from '@/components/portal/QuoteSummary';
import QuoteActions from '@/components/portal/QuoteActions';
import ContractViewer from '@/components/portal/ContractViewer';
import SignatureCanvas from '@/components/portal/SignatureCanvas';
import PaymentSection from '@/components/portal/PaymentSection';
import { getPaymentModel } from '@/lib/portal/payment-model';

type PortalStep = 'verify' | 'review' | 'sign' | 'pay' | 'subscribe' | 'complete';

type PaymentRecord = { payment_type: string; status: string };

function getStepFromStatus(
  status: Portal['status'],
  paymentModel: ReturnType<typeof getPaymentModel>,
  payments: PaymentRecord[]
): PortalStep {
  switch (status) {
    case 'sent':
    case 'email_verified':
      return 'verify';
    case 'quote_viewed':
    case 'change_requested':
      return 'review';
    case 'quote_accepted':
      return 'sign';
    case 'contract_signed': {
      // For mixed quotes: if deposit is already paid, go to subscribe step
      if (paymentModel === 'mixed') {
        const depositDone = payments.some(p => p.payment_type === 'deposit' && p.status === 'completed');
        if (depositDone) return 'subscribe';
      }
      // Subscription-only goes straight to subscribe
      if (paymentModel === 'subscription-only') return 'subscribe';
      return 'pay';
    }
    case 'payment_completed':
      return 'complete';
    default:
      return 'verify';
  }
}

function getSteps(totals?: { oneTimeTotal: number; monthlyTotal: number }) {
  const pm = totals ? getPaymentModel(totals) : 'one-time';

  if (pm === 'subscription-only') {
    return [
      { key: 'review' as const, label: 'Review Quote', icon: FileText },
      { key: 'sign' as const, label: 'Sign Agreement', icon: PenLine },
      { key: 'subscribe' as const, label: 'Subscribe', icon: RefreshCw },
    ];
  }

  if (pm === 'mixed') {
    return [
      { key: 'review' as const, label: 'Review Quote', icon: FileText },
      { key: 'sign' as const, label: 'Sign Agreement', icon: PenLine },
      { key: 'pay' as const, label: 'Pay Deposit', icon: CreditCard },
      { key: 'subscribe' as const, label: 'Subscribe', icon: RefreshCw },
    ];
  }

  return [
    { key: 'review' as const, label: 'Review Quote', icon: FileText },
    { key: 'sign' as const, label: 'Sign Agreement', icon: PenLine },
    { key: 'pay' as const, label: 'Pay Deposit', icon: CreditCard },
  ];
}

export default function PortalPage() {
  const params = useParams();
  const portalId = params?.id as string;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [portal, setPortal] = useState<Portal | null>(null);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [currentStep, setCurrentStep] = useState<PortalStep>('verify');
  const [maskedEmail, setMaskedEmail] = useState<string>('');

  const fetchPortal = useCallback(async () => {
    try {
      const res = await fetch(`/api/portal/${portalId}`);
      if (res.status === 410) {
        setError('This portal link has expired.');
        setLoading(false);
        return;
      }
      if (res.status === 403) {
        const data = await res.json();
        setMaskedEmail(data.maskedEmail || '');
        setCurrentStep('verify');
        setLoading(false);
        return;
      }
      if (!res.ok) {
        setError('Portal not found.');
        setLoading(false);
        return;
      }
      const data = await res.json();
      const p = data.portal;
      const pays: PaymentRecord[] = data.payments || [];
      setPortal(p);
      setPayments(pays);

      const totals = p.quote_data?.totals || { oneTimeTotal: 0, monthlyTotal: 0 };
      const pm = getPaymentModel(totals);
      setCurrentStep(getStepFromStatus(p.status, pm, pays));
      setLoading(false);
    } catch {
      setError('Failed to load portal.');
      setLoading(false);
    }
  }, [portalId]);

  useEffect(() => {
    if (!portalId) return;
    fetchPortal();
  }, [portalId, fetchPortal]);

  // Re-fetch portal when page is restored from browser bfcache (back/forward nav)
  useEffect(() => {
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        fetchPortal();
      }
    };
    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, [fetchPortal]);

  const handleVerified = () => {
    setLoading(true);
    fetchPortal();
  };

  const handleAccepted = () => {
    setCurrentStep('sign');
    if (portal) {
      setPortal({ ...portal, status: 'quote_accepted' });
    }
  };

  const handleChangeRequested = () => {
    if (portal) {
      setPortal({ ...portal, status: 'change_requested' });
    }
  };

  const handleSigned = () => {
    if (portal) {
      setPortal({ ...portal, status: 'contract_signed' });
      const totals = portal.quote_data?.totals || { oneTimeTotal: 0, monthlyTotal: 0 };
      const pm = getPaymentModel(totals);
      // After signing: subscription-only goes to subscribe, otherwise pay deposit
      setCurrentStep(pm === 'subscription-only' ? 'subscribe' : 'pay');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#3B82F6] mx-auto mb-4" />
          <p className="text-[#71717A] text-sm">Loading your portal...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-[#FAFAFA] mb-2">Unavailable</h2>
          <p className="text-[#71717A]">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-1.5 sm:gap-2 overflow-x-auto px-2 -mx-2 scrollbar-none">
        {getSteps(portal?.quote_data?.totals).map((step, index) => {
          const steps = getSteps(portal?.quote_data?.totals);
          const stepIndex = steps.findIndex(s => s.key === currentStep);
          const isActive = step.key === currentStep;
          const isCompleted = index < stepIndex || currentStep === 'complete';
          const Icon = isCompleted ? CheckCircle2 : step.icon;

          return (
            <div key={step.key} className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {index > 0 && (
                <div className={`w-6 sm:w-12 h-px ${isCompleted ? 'bg-[var(--accent-blue)]' : 'bg-white/[0.06]'}`} />
              )}
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Icon
                  className={`w-5 h-5 shrink-0 ${
                    isCompleted ? 'text-[var(--accent-blue-light)]' :
                    isActive ? 'text-[#3B82F6]' :
                    'text-[#71717A]'
                  }`}
                />
                <span className={`text-xs sm:text-sm font-medium hidden sm:inline whitespace-nowrap ${
                  isCompleted ? 'text-[var(--accent-blue-light)]' :
                  isActive ? 'text-[#FAFAFA]' :
                  'text-[#71717A]'
                }`}>
                  {step.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Step Content */}
      <div className="rounded-xl sm:rounded-2xl bg-[#111113] border border-white/[0.06] p-4 sm:p-6 lg:p-8">
        {currentStep === 'verify' && (
          <EmailVerification
            portalId={portalId}
            maskedEmail={maskedEmail}
            onVerified={handleVerified}
          />
        )}

        {currentStep === 'review' && portal && (
          <div>
            <QuoteSummary quote={portal.quote_data} />
            {portal.status === 'change_requested' ? (
              <div className="border-t border-white/[0.06] pt-6 mt-6 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F59E0B]/10 text-[#F59E0B] text-sm font-medium">
                  <AlertCircle className="w-4 h-4" />
                  Change request submitted — we&apos;ll send you an updated quote
                </div>
              </div>
            ) : (
              <QuoteActions
                portalId={portalId}
                onAccepted={handleAccepted}
                onChangeRequested={handleChangeRequested}
                onStale={fetchPortal}
              />
            )}
          </div>
        )}

        {currentStep === 'sign' && portal && (() => {
          const clientName = portal.quote_data?.customer?.name || portal.client_name;
          return (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-[#A1A1AA]">
                <PenLine className="w-4 h-4 text-[#3B82F6] shrink-0" />
                <span className="text-[#FAFAFA] font-medium">Review &amp; Sign Agreement</span>
                <span className="hidden sm:inline">— Read the contract below, then sign at the bottom to proceed.</span>
              </div>

              <div className="max-h-[60vh] sm:max-h-[75vh] overflow-y-auto rounded-lg border border-white/[0.06] -webkit-overflow-scrolling-touch">
                <ContractViewer
                  clientName={clientName}
                  effectiveDate={new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                />
              </div>

              <div className="rounded-lg border border-white/[0.06] bg-[#0D0D0F] p-3 sm:p-4 max-w-lg mx-auto">
                <SignatureCanvas
                  clientName={clientName}
                  portalId={portalId}
                  onSigned={handleSigned}
                />
              </div>
            </div>
          );
        })()}

        {currentStep === 'pay' && portal && (
          <div className="py-8">
            <PaymentSection
              portalId={portalId}
              checkoutType="deposit"
              grandTotal={portal.quote_data?.totals?.grandTotal || 0}
              oneTimeTotal={portal.quote_data?.totals?.oneTimeTotal || 0}
              monthlyTotal={portal.quote_data?.totals?.monthlyTotal || 0}
              services={(portal.quote_data?.services || []).map((s: { serviceLabel: string; oneTimeTotal: number; monthlyTotal: number }) => ({
                label: s.serviceLabel,
                oneTimeTotal: s.oneTimeTotal || 0,
                monthlyTotal: s.monthlyTotal || 0,
              }))}
            />
          </div>
        )}

        {currentStep === 'subscribe' && portal && (
          <div className="py-8">
            <PaymentSection
              portalId={portalId}
              checkoutType="subscription"
              grandTotal={portal.quote_data?.totals?.grandTotal || 0}
              oneTimeTotal={portal.quote_data?.totals?.oneTimeTotal || 0}
              monthlyTotal={portal.quote_data?.totals?.monthlyTotal || 0}
              services={(portal.quote_data?.services || []).map((s: { serviceLabel: string; oneTimeTotal: number; monthlyTotal: number }) => ({
                label: s.serviceLabel,
                oneTimeTotal: s.oneTimeTotal || 0,
                monthlyTotal: s.monthlyTotal || 0,
              }))}
            />
          </div>
        )}

        {currentStep === 'complete' && (
          <div className="text-center py-12">
            <CheckCircle2 className="w-12 h-12 text-[var(--accent-blue-light)] mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-[#FAFAFA] mb-2" style={{ fontFamily: "'Source Serif Pro', Georgia, serif" }}>
              All Done!
            </h2>
            <p className="text-[#A1A1AA]">
              Your project is underway. We&apos;ll be in touch soon.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
