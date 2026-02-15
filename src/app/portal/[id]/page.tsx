'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Loader2, FileText, PenLine, CreditCard, CheckCircle2, AlertCircle } from 'lucide-react';
import type { Portal } from '@/lib/supabase/types';
import EmailVerification from '@/components/portal/EmailVerification';
import QuoteSummary from '@/components/portal/QuoteSummary';
import QuoteActions from '@/components/portal/QuoteActions';
import ContractViewer from '@/components/portal/ContractViewer';
import SignatureCanvas from '@/components/portal/SignatureCanvas';
import PaymentSection from '@/components/portal/PaymentSection';

type PortalStep = 'verify' | 'review' | 'sign' | 'pay' | 'complete';

function getStepFromStatus(status: Portal['status']): PortalStep {
  switch (status) {
    case 'sent':
    case 'email_verified':
      return 'verify';
    case 'quote_viewed':
    case 'change_requested':
      return 'review';
    case 'quote_accepted':
      return 'sign';
    case 'contract_signed':
      return 'pay';
    case 'payment_completed':
      return 'complete';
    default:
      return 'verify';
  }
}

const STEPS = [
  { key: 'review', label: 'Review Quote', icon: FileText },
  { key: 'sign', label: 'Sign Agreement', icon: PenLine },
  { key: 'pay', label: 'Pay Deposit', icon: CreditCard },
] as const;

export default function PortalPage() {
  const params = useParams();
  const portalId = params?.id as string;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [portal, setPortal] = useState<Portal | null>(null);
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
      setPortal(data.portal);
      setCurrentStep(getStepFromStatus(data.portal.status));
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

  const handleVerified = () => {
    // Re-fetch portal data now that session is set
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
    setCurrentStep('pay');
    if (portal) {
      setPortal({ ...portal, status: 'contract_signed' });
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
      <div className="flex items-center justify-center gap-2">
        {STEPS.map((step, index) => {
          const stepIndex = STEPS.findIndex(s => s.key === currentStep);
          const isActive = step.key === currentStep;
          const isCompleted = index < stepIndex || currentStep === 'complete';
          const Icon = isCompleted ? CheckCircle2 : step.icon;

          return (
            <div key={step.key} className="flex items-center gap-2">
              {index > 0 && (
                <div className={`w-12 h-px ${isCompleted ? 'bg-[#10B981]' : 'bg-white/[0.06]'}`} />
              )}
              <div className="flex items-center gap-2">
                <Icon
                  className={`w-5 h-5 ${
                    isCompleted ? 'text-[#10B981]' :
                    isActive ? 'text-[#3B82F6]' :
                    'text-[#71717A]'
                  }`}
                />
                <span className={`text-sm font-medium hidden sm:inline ${
                  isCompleted ? 'text-[#10B981]' :
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
      <div className="rounded-2xl bg-[#111113] border border-white/[0.06] p-6 lg:p-8">
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
              />
            )}
          </div>
        )}

        {currentStep === 'sign' && portal && (
          <div className="space-y-8">
            <div className="text-center">
              <PenLine className="w-10 h-10 text-[#A78BFA] mx-auto mb-3" />
              <h2
                className="text-2xl font-semibold text-[#FAFAFA] mb-2"
                style={{ fontFamily: "'Source Serif Pro', Georgia, serif" }}
              >
                Review &amp; Sign Agreement
              </h2>
              <p className="text-[#A1A1AA] text-sm max-w-lg mx-auto">
                Please read the Master Services Agreement below, then sign at the bottom to proceed.
              </p>
            </div>

            {/* Contract + Signature overlay */}
            <div className="relative">
              <div className="max-h-[60vh] overflow-y-auto rounded-lg border border-white/[0.06]">
                <ContractViewer
                  clientName={portal.client_name}
                  effectiveDate={new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                />
              </div>
              {/* Fade overlay + Signature pinned over the contract bottom */}
              <div className="sticky bottom-0 -mt-16 relative z-10">
                <div className="absolute -top-20 left-0 right-0 h-20 pointer-events-none" style={{ background: 'linear-gradient(to bottom, transparent, #111113)' }} />
                <div className="bg-[#111113] rounded-b-lg pt-4">
                  <SignatureCanvas
                    clientName={portal.client_name}
                    portalId={portalId}
                    onSigned={handleSigned}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 'pay' && portal && (
          <div className="py-8">
            <PaymentSection
              portalId={portalId}
              grandTotal={portal.quote_data?.totals?.grandTotal || 0}
              qrNumber={portal.qr_number}
            />
          </div>
        )}

        {currentStep === 'complete' && (
          <div className="text-center py-12">
            <CheckCircle2 className="w-12 h-12 text-[#10B981] mx-auto mb-4" />
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
