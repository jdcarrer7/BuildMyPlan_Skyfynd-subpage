'use client';

import { useState, useEffect } from 'react';
import { useBrandStrategyBuilderStore } from '@/hooks/useBrandStrategyBuilderStore';
import BrandStrategyStepIndicator from '@/components/brand-strategy-builder/BrandStrategyStepIndicator';
import BrandStrategyPriceSidebar from '@/components/brand-strategy-builder/BrandStrategyPriceSidebar';
import CombinedEstimateSidebar from '@/components/builder/CombinedEstimateSidebar';
import Step1StrategyGoal from '@/components/brand-strategy-builder/Step1StrategyGoal';
import Step2Depth from '@/components/brand-strategy-builder/Step2Depth';
import Step3Research from '@/components/brand-strategy-builder/Step3Research';
import Step4Positioning from '@/components/brand-strategy-builder/Step4Positioning';
import Step5Messaging from '@/components/brand-strategy-builder/Step5Messaging';
import Step6Architecture from '@/components/brand-strategy-builder/Step6Architecture';
import Step7Purpose from '@/components/brand-strategy-builder/Step7Purpose';
import Step8Audience from '@/components/brand-strategy-builder/Step8Audience';
import Step9Workshop from '@/components/brand-strategy-builder/Step9Workshop';
import Step10AddOns from '@/components/brand-strategy-builder/Step10AddOns';
import Step11Timeline from '@/components/brand-strategy-builder/Step11Timeline';
import Step12Summary from '@/components/brand-strategy-builder/Step12Summary';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Home, Target } from 'lucide-react';
import Link from 'next/link';

const TOTAL_STEPS = 12;

export default function BuildMyBrandStrategyPage() {
  const { currentStep, setStep, nextStep, prevStep } = useBrandStrategyBuilderStore();
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
        return <Step1StrategyGoal />;
      case 2:
        return <Step2Depth />;
      case 3:
        return <Step3Research />;
      case 4:
        return <Step4Positioning />;
      case 5:
        return <Step5Messaging />;
      case 6:
        return <Step6Architecture />;
      case 7:
        return <Step7Purpose />;
      case 8:
        return <Step8Audience />;
      case 9:
        return <Step9Workshop />;
      case 10:
        return <Step10AddOns />;
      case 11:
        return <Step11Timeline />;
      case 12:
        return <Step12Summary showQuoteForm={showQuoteForm} onCloseQuoteForm={() => setShowQuoteForm(false)} />;
      default:
        return <Step1StrategyGoal />;
    }
  };

  const canProceed = () => {
    const state = useBrandStrategyBuilderStore.getState();
    switch (currentStep) {
      case 1:
        return state.strategyGoal !== null;
      case 2:
        return state.depth !== null;
      case 3:
        return state.research !== null;
      case 4:
        return state.positioning !== null;
      case 5:
        return state.messaging !== null;
      case 6:
        return state.architecture !== null;
      case 7:
        return state.purpose !== null;
      case 8:
        return state.audience !== null;
      case 9:
        return state.workshop !== null;
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
            <Target className="w-5 h-5 text-[var(--accent-purple)]" />
            <h1 className="text-2xl font-semibold gradient-text font-serif">
              Build My Brand Strategy
            </h1>
          </div>
          <div className="w-32" /> {/* Spacer for centering */}
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Step Indicator */}
        <BrandStrategyStepIndicator
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
              <CombinedEstimateSidebar currentService="brand-strategy" onRequestQuote={() => setShowQuoteForm(true)} />
            ) : (
              <BrandStrategyPriceSidebar
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
