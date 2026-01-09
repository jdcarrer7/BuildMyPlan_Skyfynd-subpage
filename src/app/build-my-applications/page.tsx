'use client';

import { useState, useEffect } from 'react';
import { useBrandApplicationsBuilderStore } from '@/hooks/useBrandApplicationsBuilderStore';
import BrandApplicationsStepIndicator from '@/components/brand-applications-builder/BrandApplicationsStepIndicator';
import BrandApplicationsPriceSidebar from '@/components/brand-applications-builder/BrandApplicationsPriceSidebar';
import CombinedEstimateSidebar from '@/components/builder/CombinedEstimateSidebar';
import Step1ApplicationGoal from '@/components/brand-applications-builder/Step1ApplicationGoal';
import Step2Stationery from '@/components/brand-applications-builder/Step2Stationery';
import Step3Digital from '@/components/brand-applications-builder/Step3Digital';
import Step4Social from '@/components/brand-applications-builder/Step4Social';
import Step5Presentations from '@/components/brand-applications-builder/Step5Presentations';
import Step6Marketing from '@/components/brand-applications-builder/Step6Marketing';
import Step7Signage from '@/components/brand-applications-builder/Step7Signage';
import Step8Packaging from '@/components/brand-applications-builder/Step8Packaging';
import Step9Events from '@/components/brand-applications-builder/Step9Events';
import Step10AddOns from '@/components/brand-applications-builder/Step10AddOns';
import Step11Timeline from '@/components/brand-applications-builder/Step11Timeline';
import Step12Summary from '@/components/brand-applications-builder/Step12Summary';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Home, Briefcase } from 'lucide-react';
import Link from 'next/link';

const TOTAL_STEPS = 12;

export default function BuildMyApplicationsPage() {
  const { currentStep, setStep, nextStep, prevStep } = useBrandApplicationsBuilderStore();
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
        return <Step1ApplicationGoal />;
      case 2:
        return <Step2Stationery />;
      case 3:
        return <Step3Digital />;
      case 4:
        return <Step4Social />;
      case 5:
        return <Step5Presentations />;
      case 6:
        return <Step6Marketing />;
      case 7:
        return <Step7Signage />;
      case 8:
        return <Step8Packaging />;
      case 9:
        return <Step9Events />;
      case 10:
        return <Step10AddOns />;
      case 11:
        return <Step11Timeline />;
      case 12:
        return <Step12Summary showQuoteForm={showQuoteForm} onCloseQuoteForm={() => setShowQuoteForm(false)} />;
      default:
        return <Step1ApplicationGoal />;
    }
  };

  const canProceed = () => {
    const state = useBrandApplicationsBuilderStore.getState();
    switch (currentStep) {
      case 1:
        return state.applicationGoal !== null;
      case 2:
        return state.stationery !== null;
      case 3:
        return state.digital !== null;
      case 4:
        return state.social !== null;
      case 5:
        return state.presentations !== null;
      case 6:
        return state.marketing !== null;
      case 7:
        return state.signage !== null;
      case 8:
        return state.packaging !== null;
      case 9:
        return state.events !== null;
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
            <Briefcase className="w-5 h-5 text-[var(--accent-purple)]" />
            <h1 className="text-2xl font-semibold gradient-text font-serif">
              Build My Brand Applications
            </h1>
          </div>
          <div className="w-32" /> {/* Spacer for centering */}
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Step Indicator */}
        <BrandApplicationsStepIndicator
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
              <CombinedEstimateSidebar currentService="brand-applications" onRequestQuote={() => setShowQuoteForm(true)} />
            ) : (
              <BrandApplicationsPriceSidebar
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
