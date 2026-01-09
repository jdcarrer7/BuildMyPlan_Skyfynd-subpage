'use client';

import { useEffect, useState } from 'react';
import { useAppBuilderStore } from '@/hooks/useAppBuilderStore';
import AppPriceSidebar from '@/components/app-builder/AppPriceSidebar';
import AppStepIndicator from '@/components/app-builder/AppStepIndicator';
import CombinedEstimateSidebar from '@/components/builder/CombinedEstimateSidebar';
import Step1AppType from '@/components/app-builder/Step1AppType';
import Step2Platform from '@/components/app-builder/Step2Platform';
import Step3Screens from '@/components/app-builder/Step3Screens';
import Step4Design from '@/components/app-builder/Step4Design';
import Step5Auth from '@/components/app-builder/Step5Auth';
import Step6Backend from '@/components/app-builder/Step6Backend';
import Step7Features from '@/components/app-builder/Step7Features';
import Step8AIFeatures from '@/components/app-builder/Step8AIFeatures';
import Step9Services from '@/components/app-builder/Step9Services';
import Step10Timeline from '@/components/app-builder/Step10Timeline';
import Step11Summary from '@/components/app-builder/Step11Summary';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Home } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const TOTAL_STEPS = 11;

export default function BuildMyAppPage() {
  const { currentStep, setStep, nextStep, prevStep, loadFromUnifiedQuote } = useAppBuilderStore();
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
        return <Step1AppType />;
      case 2:
        return <Step2Platform />;
      case 3:
        return <Step3Screens />;
      case 4:
        return <Step4Design />;
      case 5:
        return <Step5Auth />;
      case 6:
        return <Step6Backend />;
      case 7:
        return <Step7Features />;
      case 8:
        return <Step8AIFeatures />;
      case 9:
        return <Step9Services />;
      case 10:
        return <Step10Timeline />;
      case 11:
        return <Step11Summary showQuoteForm={showQuoteForm} onCloseQuoteForm={() => setShowQuoteForm(false)} />;
      default:
        return <Step1AppType />;
    }
  };

  const canProceed = () => {
    const state = useAppBuilderStore.getState();
    switch (currentStep) {
      case 1:
        return state.appType !== null;
      case 2:
        return state.platform !== null;
      case 3:
        return state.screens !== null;
      case 4:
        return state.design !== null;
      case 5:
        return state.auth !== null;
      case 6:
        return state.backend !== null;
      case 7:
        return true; // Features are optional
      case 8:
        return true; // AI Features are optional
      case 9:
        return true; // Services are optional
      case 10:
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
            Build My App
          </h1>
          <div className="w-32" /> {/* Spacer for centering */}
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Step Indicator */}
        <AppStepIndicator
          currentStep={currentStep}
          totalSteps={TOTAL_STEPS}
          onStepClick={(step) => step < currentStep && setStep(step)}
        />

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
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
              <CombinedEstimateSidebar currentService="app" onRequestQuote={() => setShowQuoteForm(true)} />
            ) : (
              <AppPriceSidebar
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
