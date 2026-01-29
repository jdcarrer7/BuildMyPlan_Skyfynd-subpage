'use client';

import { useState, useEffect } from 'react';
import { useEmailMarketingBuilderStore } from '@/hooks/useEmailMarketingBuilderStore';
import EmailMarketingStepIndicator from '@/components/email-marketing-builder/EmailMarketingStepIndicator';
import EmailMarketingPriceSidebar from '@/components/email-marketing-builder/EmailMarketingPriceSidebar';
import CombinedEstimateSidebar from '@/components/builder/CombinedEstimateSidebar';
import Step1EmailGoal from '@/components/email-marketing-builder/Step1EmailGoal';
import Step2Volume from '@/components/email-marketing-builder/Step2Volume';
import Step3Design from '@/components/email-marketing-builder/Step3Design';
import Step4Automation from '@/components/email-marketing-builder/Step4Automation';
import Step5Sequences from '@/components/email-marketing-builder/Step5Sequences';
import Step6List from '@/components/email-marketing-builder/Step6List';
import Step7Copy from '@/components/email-marketing-builder/Step7Copy';
import Step8Reporting from '@/components/email-marketing-builder/Step8Reporting';
import Step9AddOns from '@/components/email-marketing-builder/Step9AddOns';
import Step10Duration from '@/components/email-marketing-builder/Step10Duration';
import Step11Summary from '@/components/email-marketing-builder/Step11Summary';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Home, Mail } from 'lucide-react';
import Link from 'next/link';

const TOTAL_STEPS = 11;

export default function BuildMyEmailPage() {
  const { currentStep, setStep, nextStep, prevStep } = useEmailMarketingBuilderStore();
  const [showQuoteForm, setShowQuoteForm] = useState(false);

  // Check for summary param on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('summary') === 'true') {
      setStep(TOTAL_STEPS);
    }
  }, [setStep]);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1EmailGoal />;
      case 2:
        return <Step2Volume />;
      case 3:
        return <Step3Design />;
      case 4:
        return <Step4Automation />;
      case 5:
        return <Step5Sequences />;
      case 6:
        return <Step6List />;
      case 7:
        return <Step7Copy />;
      case 8:
        return <Step8Reporting />;
      case 9:
        return <Step9AddOns />;
      case 10:
        return <Step10Duration />;
      case 11:
        return <Step11Summary showQuoteForm={showQuoteForm} onCloseQuoteForm={() => setShowQuoteForm(false)} />;
      default:
        return <Step1EmailGoal />;
    }
  };

  const canProceed = () => {
    const state = useEmailMarketingBuilderStore.getState();
    switch (currentStep) {
      case 1:
        return state.emailGoal !== null;
      case 2:
        return state.volume !== null;
      case 3:
        return state.design !== null;
      case 4:
        return state.automation !== null;
      case 5:
        return state.sequences !== null;
      case 6:
        return state.list !== null;
      case 7:
        return state.copy !== null;
      case 8:
        return state.reporting !== null;
      case 9:
        return true; // Add-ons are optional
      case 10:
        return state.duration !== null;
      default:
        return true;
    }
  };

  return (
    <main className="min-h-screen bg-[var(--bg-primary)]">
      {/* Header */}
      <header className="border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)]">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-white transition-colors"
          >
            <Home className="w-5 h-5" />
            <span className="text-sm">Back to Services</span>
          </Link>
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-[var(--accent-blue)]" />
            <h1 className="text-2xl font-semibold gradient-text font-serif">
              Build My Email
            </h1>
          </div>
          <div className="w-32" /> {/* Spacer for centering */}
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Step Indicator */}
        <EmailMarketingStepIndicator
          currentStep={currentStep}
          totalSteps={TOTAL_STEPS}
          onStepClick={(step) => step < currentStep && setStep(step)}
        />

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8 mt-8">
          {/* Step Content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            {currentStep < 11 && (
              <div className="flex justify-between mt-8">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className={`
                    flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all
                    ${currentStep === 1
                      ? 'bg-[var(--bg-card)] text-[var(--text-muted)] cursor-not-allowed'
                      : 'bg-[var(--bg-card)] text-white hover:bg-[var(--bg-card-hover)] border border-[var(--border-subtle)]'
                    }
                  `}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Previous
                </button>

                <button
                  onClick={nextStep}
                  disabled={!canProceed()}
                  className={`
                    flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all
                    ${!canProceed()
                      ? 'bg-[var(--bg-card)] text-[var(--text-muted)] cursor-not-allowed'
                      : 'btn-primary'
                    }
                  `}
                >
                  {currentStep === 10 ? 'Review Summary' : 'Continue'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Price Sidebar */}
          <div className="lg:col-span-1">
            {currentStep === 11 ? (
              <CombinedEstimateSidebar currentService="email-marketing" onRequestQuote={() => setShowQuoteForm(true)} />
            ) : (
              <EmailMarketingPriceSidebar
                currentStep={currentStep}
                onGoToSummary={() => setStep(11)}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
