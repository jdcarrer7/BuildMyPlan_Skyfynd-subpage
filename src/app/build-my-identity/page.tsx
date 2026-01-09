'use client';

import { useState, useEffect } from 'react';
import { useVisualIdentityBuilderStore } from '@/hooks/useVisualIdentityBuilderStore';
import VisualIdentityStepIndicator from '@/components/visual-identity-builder/VisualIdentityStepIndicator';
import VisualIdentityPriceSidebar from '@/components/visual-identity-builder/VisualIdentityPriceSidebar';
import CombinedEstimateSidebar from '@/components/builder/CombinedEstimateSidebar';
import Step1VisualIdentityGoal from '@/components/visual-identity-builder/Step1VisualIdentityGoal';
import Step2Logo from '@/components/visual-identity-builder/Step2Logo';
import Step3Colors from '@/components/visual-identity-builder/Step3Colors';
import Step4Typography from '@/components/visual-identity-builder/Step4Typography';
import Step5Photography from '@/components/visual-identity-builder/Step5Photography';
import Step6Icons from '@/components/visual-identity-builder/Step6Icons';
import Step7Patterns from '@/components/visual-identity-builder/Step7Patterns';
import Step8Illustration from '@/components/visual-identity-builder/Step8Illustration';
import Step9Motion from '@/components/visual-identity-builder/Step9Motion';
import Step10Guidelines from '@/components/visual-identity-builder/Step10Guidelines';
import Step11AddOns from '@/components/visual-identity-builder/Step11AddOns';
import Step12Timeline from '@/components/visual-identity-builder/Step12Timeline';
import Step13Summary from '@/components/visual-identity-builder/Step13Summary';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Home, Palette } from 'lucide-react';
import Link from 'next/link';

const TOTAL_STEPS = 13;

export default function BuildMyIdentityPage() {
  const { currentStep, setStep, nextStep, prevStep } = useVisualIdentityBuilderStore();
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
        return <Step1VisualIdentityGoal />;
      case 2:
        return <Step2Logo />;
      case 3:
        return <Step3Colors />;
      case 4:
        return <Step4Typography />;
      case 5:
        return <Step5Photography />;
      case 6:
        return <Step6Icons />;
      case 7:
        return <Step7Patterns />;
      case 8:
        return <Step8Illustration />;
      case 9:
        return <Step9Motion />;
      case 10:
        return <Step10Guidelines />;
      case 11:
        return <Step11AddOns />;
      case 12:
        return <Step12Timeline />;
      case 13:
        return <Step13Summary showQuoteForm={showQuoteForm} onCloseQuoteForm={() => setShowQuoteForm(false)} />;
      default:
        return <Step1VisualIdentityGoal />;
    }
  };

  const canProceed = () => {
    const state = useVisualIdentityBuilderStore.getState();
    switch (currentStep) {
      case 1:
        return state.visualIdentityGoal !== null;
      case 2:
        return state.logo !== null;
      case 3:
        return state.colors !== null;
      case 4:
        return state.typography !== null;
      case 5:
        return state.photography !== null;
      case 6:
        return state.icons !== null;
      case 7:
        return state.patterns !== null;
      case 8:
        return state.illustration !== null;
      case 9:
        return state.motion !== null;
      case 10:
        return state.guidelines !== null;
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
            <Palette className="w-5 h-5 text-[var(--accent-purple)]" />
            <h1 className="text-2xl font-semibold gradient-text font-serif">
              Build My Visual Identity
            </h1>
          </div>
          <div className="w-32" /> {/* Spacer for centering */}
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Step Indicator */}
        <VisualIdentityStepIndicator
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
              <CombinedEstimateSidebar currentService="visual-identity" onRequestQuote={() => setShowQuoteForm(true)} />
            ) : (
              <VisualIdentityPriceSidebar
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
