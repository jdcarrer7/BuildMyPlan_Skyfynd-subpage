'use client';

import { useState, useEffect } from 'react';
import { useMessagingCopywritingBuilderStore } from '@/hooks/useMessagingCopywritingBuilderStore';
import MessagingCopywritingStepIndicator from '@/components/messaging-copywriting-builder/MessagingCopywritingStepIndicator';
import MessagingCopywritingPriceSidebar from '@/components/messaging-copywriting-builder/MessagingCopywritingPriceSidebar';
import CombinedEstimateSidebar from '@/components/builder/CombinedEstimateSidebar';
import Step1MessagingGoal from '@/components/messaging-copywriting-builder/Step1MessagingGoal';
import Step2MessagingFramework from '@/components/messaging-copywriting-builder/Step2MessagingFramework';
import Step3Voice from '@/components/messaging-copywriting-builder/Step3Voice';
import Step4WebsiteCopy from '@/components/messaging-copywriting-builder/Step4WebsiteCopy';
import Step5MarketingCopy from '@/components/messaging-copywriting-builder/Step5MarketingCopy';
import Step6SalesCopy from '@/components/messaging-copywriting-builder/Step6SalesCopy';
import Step7ProductCopy from '@/components/messaging-copywriting-builder/Step7ProductCopy';
import Step8ContentWriting from '@/components/messaging-copywriting-builder/Step8ContentWriting';
import Step9UxWriting from '@/components/messaging-copywriting-builder/Step9UxWriting';
import Step10Retainer from '@/components/messaging-copywriting-builder/Step10Retainer';
import Step11AddOns from '@/components/messaging-copywriting-builder/Step11AddOns';
import Step12Timeline from '@/components/messaging-copywriting-builder/Step12Timeline';
import Step13Summary from '@/components/messaging-copywriting-builder/Step13Summary';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Home, PenTool } from 'lucide-react';
import Link from 'next/link';

const TOTAL_STEPS = 13;

export default function BuildMyMessagingPage() {
  const { currentStep, setStep, nextStep, prevStep } = useMessagingCopywritingBuilderStore();
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
        return <Step1MessagingGoal />;
      case 2:
        return <Step2MessagingFramework />;
      case 3:
        return <Step3Voice />;
      case 4:
        return <Step4WebsiteCopy />;
      case 5:
        return <Step5MarketingCopy />;
      case 6:
        return <Step6SalesCopy />;
      case 7:
        return <Step7ProductCopy />;
      case 8:
        return <Step8ContentWriting />;
      case 9:
        return <Step9UxWriting />;
      case 10:
        return <Step10Retainer />;
      case 11:
        return <Step11AddOns />;
      case 12:
        return <Step12Timeline />;
      case 13:
        return <Step13Summary showQuoteForm={showQuoteForm} onCloseQuoteForm={() => setShowQuoteForm(false)} />;
      default:
        return <Step1MessagingGoal />;
    }
  };

  const canProceed = () => {
    const state = useMessagingCopywritingBuilderStore.getState();
    switch (currentStep) {
      case 1:
        return state.messagingGoal !== null;
      case 2:
        return state.messaging !== null;
      case 3:
        return state.voice !== null;
      case 4:
        return state.website !== null;
      case 5:
        return state.marketing !== null;
      case 6:
        return state.sales !== null;
      case 7:
        return state.product !== null;
      case 8:
        return state.content !== null;
      case 9:
        return state.ux !== null;
      case 10:
        return state.retainer !== null;
      case 11:
        return true; // Add-ons are optional
      case 12:
        return state.timeline !== null;
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
            <PenTool className="w-5 h-5 text-[var(--accent-blue)]" />
            <h1 className="text-2xl font-semibold gradient-text font-serif">
              Build My Messaging & Copy
            </h1>
          </div>
          <div className="w-32" /> {/* Spacer for centering */}
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Step Indicator */}
        <MessagingCopywritingStepIndicator
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
            {currentStep < 13 && (
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
                  {currentStep === 12 ? 'Review Summary' : 'Continue'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Price Sidebar */}
          <div className="lg:col-span-1">
            {currentStep === 13 ? (
              <CombinedEstimateSidebar currentService="messaging-copywriting" onRequestQuote={() => setShowQuoteForm(true)} />
            ) : (
              <MessagingCopywritingPriceSidebar
                currentStep={currentStep}
                onGoToSummary={() => setStep(13)}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
