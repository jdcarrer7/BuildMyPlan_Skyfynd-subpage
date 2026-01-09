'use client';

import { useEffect, useState } from 'react';
import { useBuilderStore } from '@/hooks/useBuilderStore';
import StepIndicator from '@/components/builder/StepIndicator';
import PriceSidebar from '@/components/builder/PriceSidebar';
import CombinedEstimateSidebar from '@/components/builder/CombinedEstimateSidebar';
import Step1ProjectType from '@/components/builder/Step1ProjectType';
import Step2SiteSize from '@/components/builder/Step2SiteSize';
import Step3Design from '@/components/builder/Step3Design';
import Step4CMS from '@/components/builder/Step4CMS';
import Step5Features from '@/components/builder/Step5Features';
import Step6AIFeatures from '@/components/builder/Step6AIFeatures';
import Step7Services from '@/components/builder/Step7Services';
import Step8Timeline from '@/components/builder/Step8Timeline';
import Step9Summary from '@/components/builder/Step9Summary';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Home } from 'lucide-react';
import Link from 'next/link';

const TOTAL_STEPS = 9;

export default function BuildMySitePage() {
  const { currentStep, setStep, nextStep, prevStep, loadFromUnifiedQuote } = useBuilderStore();
  const [showQuoteForm, setShowQuoteForm] = useState(false);

  // Load from unified quote on mount (edit mode) and check for summary param
  useEffect(() => {
    loadFromUnifiedQuote();
    // Check URL for ?summary=true to navigate directly to summary
    const params = new URLSearchParams(window.location.search);
    if (params.get('summary') === 'true') {
      setStep(TOTAL_STEPS);
    }
  }, [loadFromUnifiedQuote, setStep]);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1ProjectType />;
      case 2:
        return <Step2SiteSize />;
      case 3:
        return <Step3Design />;
      case 4:
        return <Step4CMS />;
      case 5:
        return <Step5Features />;
      case 6:
        return <Step6AIFeatures />;
      case 7:
        return <Step7Services />;
      case 8:
        return <Step8Timeline />;
      case 9:
        return <Step9Summary showQuoteForm={showQuoteForm} onCloseQuoteForm={() => setShowQuoteForm(false)} />;
      default:
        return <Step1ProjectType />;
    }
  };

  const canProceed = () => {
    const state = useBuilderStore.getState();
    switch (currentStep) {
      case 1:
        return state.projectType !== null;
      case 2:
        return state.siteSize !== null;
      case 3:
        return state.designComplexity !== null;
      case 4:
        return state.cms !== null;
      case 5:
        return true; // Features are optional
      case 6:
        return true; // AI Features are optional
      case 7:
        return true; // Services are optional
      case 8:
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
          <h1 className="text-2xl font-semibold gradient-text font-serif">
            Build My Site
          </h1>
          <div className="w-32" /> {/* Spacer for centering */}
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Step Indicator */}
        <StepIndicator
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
            {currentStep < 9 && (
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
                  {currentStep === 8 ? 'Review Summary' : 'Continue'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Price Sidebar */}
          <div className="lg:col-span-1">
            {currentStep === 9 ? (
              <CombinedEstimateSidebar currentService="website" onRequestQuote={() => setShowQuoteForm(true)} />
            ) : (
              <PriceSidebar
                currentStep={currentStep}
                onGoToSummary={() => setStep(9)}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
