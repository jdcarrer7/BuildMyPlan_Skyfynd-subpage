'use client';

import { useState, useEffect } from 'react';
import { useContentStrategyBuilderStore } from '@/hooks/useContentStrategyBuilderStore';
import ContentStrategyStepIndicator from '@/components/content-strategy-builder/ContentStrategyStepIndicator';
import ContentStrategyPriceSidebar from '@/components/content-strategy-builder/ContentStrategyPriceSidebar';
import CombinedEstimateSidebar from '@/components/builder/CombinedEstimateSidebar';
import Step1ContentGoal from '@/components/content-strategy-builder/Step1ContentGoal';
import Step2Depth from '@/components/content-strategy-builder/Step2Depth';
import Step3Audit from '@/components/content-strategy-builder/Step3Audit';
import Step4Audience from '@/components/content-strategy-builder/Step4Audience';
import Step5Channels from '@/components/content-strategy-builder/Step5Channels';
import Step6Editorial from '@/components/content-strategy-builder/Step6Editorial';
import Step7Seo from '@/components/content-strategy-builder/Step7Seo';
import Step8Governance from '@/components/content-strategy-builder/Step8Governance';
import Step9Measurement from '@/components/content-strategy-builder/Step9Measurement';
import Step10AddOns from '@/components/content-strategy-builder/Step10AddOns';
import Step11Timeline from '@/components/content-strategy-builder/Step11Timeline';
import Step12Summary from '@/components/content-strategy-builder/Step12Summary';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Home, FileText } from 'lucide-react';
import Link from 'next/link';

const TOTAL_STEPS = 12;

export default function BuildMyContentStrategyPage() {
  const { currentStep, setStep, nextStep, prevStep } = useContentStrategyBuilderStore();
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
        return <Step1ContentGoal />;
      case 2:
        return <Step2Depth />;
      case 3:
        return <Step3Audit />;
      case 4:
        return <Step4Audience />;
      case 5:
        return <Step5Channels />;
      case 6:
        return <Step6Editorial />;
      case 7:
        return <Step7Seo />;
      case 8:
        return <Step8Governance />;
      case 9:
        return <Step9Measurement />;
      case 10:
        return <Step10AddOns />;
      case 11:
        return <Step11Timeline />;
      case 12:
        return <Step12Summary showQuoteForm={showQuoteForm} onCloseQuoteForm={() => setShowQuoteForm(false)} />;
      default:
        return <Step1ContentGoal />;
    }
  };

  const canProceed = () => {
    const state = useContentStrategyBuilderStore.getState();
    switch (currentStep) {
      case 1:
        return state.contentGoal !== null;
      case 2:
        return state.depth !== null;
      case 3:
        return state.audit !== null;
      case 4:
        return state.audience !== null;
      case 5:
        return state.channels !== null;
      case 6:
        return state.editorial !== null;
      case 7:
        return state.seo !== null;
      case 8:
        return state.governance !== null;
      case 9:
        return state.measurement !== null;
      case 10:
        return true; // Add-ons are optional
      case 11:
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
            <FileText className="w-5 h-5 text-[var(--accent-purple)]" />
            <h1 className="text-2xl font-semibold gradient-text font-serif">
              Build My Content Strategy
            </h1>
          </div>
          <div className="w-32" /> {/* Spacer for centering */}
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Step Indicator */}
        <ContentStrategyStepIndicator
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
            {currentStep < 12 && (
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
                  {currentStep === 11 ? 'Review Summary' : 'Continue'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Price Sidebar */}
          <div className="lg:col-span-1">
            {currentStep === 12 ? (
              <CombinedEstimateSidebar currentService="content-strategy" onRequestQuote={() => setShowQuoteForm(true)} />
            ) : (
              <ContentStrategyPriceSidebar
                currentStep={currentStep}
                onGoToSummary={() => setStep(12)}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
