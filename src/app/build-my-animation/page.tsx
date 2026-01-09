'use client';

import { useState, useEffect } from 'react';
import { useAnimationBuilderStore } from '@/hooks/useAnimationBuilderStore';
import AnimationStepIndicator from '@/components/animation-builder/AnimationStepIndicator';
import AnimationPriceSidebar from '@/components/animation-builder/AnimationPriceSidebar';
import CombinedEstimateSidebar from '@/components/builder/CombinedEstimateSidebar';
import Step1AnimationType from '@/components/animation-builder/Step1AnimationType';
import Step2Duration from '@/components/animation-builder/Step2Duration';
import Step3Style from '@/components/animation-builder/Step3Style';
import Step4Complexity from '@/components/animation-builder/Step4Complexity';
import Step5Sound from '@/components/animation-builder/Step5Sound';
import Step6AddOns from '@/components/animation-builder/Step6AddOns';
import Step7Deliverables from '@/components/animation-builder/Step7Deliverables';
import Step8Timeline from '@/components/animation-builder/Step8Timeline';
import Step9Summary from '@/components/animation-builder/Step9Summary';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Home, Film } from 'lucide-react';
import Link from 'next/link';

const TOTAL_STEPS = 9;

export default function BuildMyAnimationPage() {
  const { currentStep, setStep, nextStep, prevStep } = useAnimationBuilderStore();
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
        return <Step1AnimationType />;
      case 2:
        return <Step2Duration />;
      case 3:
        return <Step3Style />;
      case 4:
        return <Step4Complexity />;
      case 5:
        return <Step5Sound />;
      case 6:
        return <Step6AddOns />;
      case 7:
        return <Step7Deliverables />;
      case 8:
        return <Step8Timeline />;
      case 9:
        return <Step9Summary showQuoteForm={showQuoteForm} onCloseQuoteForm={() => setShowQuoteForm(false)} />;
      default:
        return <Step1AnimationType />;
    }
  };

  const canProceed = () => {
    const state = useAnimationBuilderStore.getState();
    switch (currentStep) {
      case 1:
        return state.animationType !== null;
      case 2:
        return state.duration !== null;
      case 3:
        return state.style !== null;
      case 4:
        return state.complexity !== null;
      case 5:
        return state.sound !== null;
      case 6:
        return true; // Add-ons have defaults
      case 7:
        return true; // Deliverables have defaults
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
          <div className="flex items-center gap-2">
            <Film className="w-5 h-5 text-[var(--accent-purple)]" />
            <h1 className="text-2xl font-semibold gradient-text font-serif">
              Build My Animation
            </h1>
          </div>
          <div className="w-32" /> {/* Spacer for centering */}
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Step Indicator */}
        <AnimationStepIndicator
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
              <CombinedEstimateSidebar currentService="animation" onRequestQuote={() => setShowQuoteForm(true)} />
            ) : (
              <AnimationPriceSidebar
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
