'use client';

import { useState, useEffect } from 'react';
import { usePaidMediaBuilderStore } from '@/hooks/usePaidMediaBuilderStore';
import PaidMediaStepIndicator from '@/components/paid-media-builder/PaidMediaStepIndicator';
import PaidMediaPriceSidebar from '@/components/paid-media-builder/PaidMediaPriceSidebar';
import CombinedEstimateSidebar from '@/components/builder/CombinedEstimateSidebar';
import Step1CampaignType from '@/components/paid-media-builder/Step1CampaignType';
import Step2Platforms from '@/components/paid-media-builder/Step2Platforms';
import Step3Budget from '@/components/paid-media-builder/Step3Budget';
import Step4Duration from '@/components/paid-media-builder/Step4Duration';
import Step5Management from '@/components/paid-media-builder/Step5Management';
import Step6Creatives from '@/components/paid-media-builder/Step6Creatives';
import Step7Tracking from '@/components/paid-media-builder/Step7Tracking';
import Step8Reporting from '@/components/paid-media-builder/Step8Reporting';
import Step9AddOns from '@/components/paid-media-builder/Step9AddOns';
import Step10Summary from '@/components/paid-media-builder/Step10Summary';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Home, Megaphone } from 'lucide-react';
import Link from 'next/link';

const TOTAL_STEPS = 10;

export default function BuildMyMediaPage() {
  const { currentStep, setStep, nextStep, prevStep } = usePaidMediaBuilderStore();
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
        return <Step1CampaignType />;
      case 2:
        return <Step2Platforms />;
      case 3:
        return <Step3Budget />;
      case 4:
        return <Step4Duration />;
      case 5:
        return <Step5Management />;
      case 6:
        return <Step6Creatives />;
      case 7:
        return <Step7Tracking />;
      case 8:
        return <Step8Reporting />;
      case 9:
        return <Step9AddOns />;
      case 10:
        return <Step10Summary showQuoteForm={showQuoteForm} onCloseQuoteForm={() => setShowQuoteForm(false)} />;
      default:
        return <Step1CampaignType />;
    }
  };

  const canProceed = () => {
    const state = usePaidMediaBuilderStore.getState();
    switch (currentStep) {
      case 1:
        return state.campaignType !== null;
      case 2:
        return state.platforms !== null;
      case 3:
        return state.budget !== null;
      case 4:
        return state.duration !== null;
      case 5:
        return state.management !== null;
      case 6:
        return state.creatives !== null; // Landing page can be skipped
      case 7:
        return state.tracking !== null;
      case 8:
        return state.reporting !== null;
      case 9:
        return true; // Add-ons are optional
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
            <Megaphone className="w-6 h-6 text-[var(--accent-blue)]" />
            <h1 className="text-2xl font-semibold gradient-text font-serif">
              Build My Media
            </h1>
          </div>
          <div className="w-32" /> {/* Spacer for centering */}
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Step Indicator */}
        <PaidMediaStepIndicator
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
            {currentStep < 10 && (
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
                  {currentStep === 9 ? 'Review Summary' : 'Continue'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Price Sidebar */}
          <div className="lg:col-span-1">
            {currentStep === 10 ? (
              <CombinedEstimateSidebar currentService="paid-media" onRequestQuote={() => setShowQuoteForm(true)} />
            ) : (
              <PaidMediaPriceSidebar
                currentStep={currentStep}
                onGoToSummary={() => setStep(10)}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
