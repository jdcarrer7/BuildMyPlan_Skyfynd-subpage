'use client';

import { useState, useEffect } from 'react';
import { useSocialMediaBuilderStore } from '@/hooks/useSocialMediaBuilderStore';
import SocialMediaStepIndicator from '@/components/social-media-builder/SocialMediaStepIndicator';
import SocialMediaPriceSidebar from '@/components/social-media-builder/SocialMediaPriceSidebar';
import CombinedEstimateSidebar from '@/components/builder/CombinedEstimateSidebar';
import Step1ManagementGoal from '@/components/social-media-builder/Step1ManagementGoal';
import Step2Platforms from '@/components/social-media-builder/Step2Platforms';
import Step3Frequency from '@/components/social-media-builder/Step3Frequency';
import Step4Content from '@/components/social-media-builder/Step4Content';
import Step5Engagement from '@/components/social-media-builder/Step5Engagement';
import Step6Strategy from '@/components/social-media-builder/Step6Strategy';
import Step7Reporting from '@/components/social-media-builder/Step7Reporting';
import Step8AddOns from '@/components/social-media-builder/Step8AddOns';
import Step9Duration from '@/components/social-media-builder/Step9Duration';
import Step10Summary from '@/components/social-media-builder/Step10Summary';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Home, Share2 } from 'lucide-react';
import Link from 'next/link';

const TOTAL_STEPS = 10;

export default function BuildMySocialPage() {
  const { currentStep, setStep, nextStep, prevStep } = useSocialMediaBuilderStore();
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
        return <Step1ManagementGoal />;
      case 2:
        return <Step2Platforms />;
      case 3:
        return <Step3Frequency />;
      case 4:
        return <Step4Content />;
      case 5:
        return <Step5Engagement />;
      case 6:
        return <Step6Strategy />;
      case 7:
        return <Step7Reporting />;
      case 8:
        return <Step8AddOns />;
      case 9:
        return <Step9Duration />;
      case 10:
        return <Step10Summary showQuoteForm={showQuoteForm} onCloseQuoteForm={() => setShowQuoteForm(false)} />;
      default:
        return <Step1ManagementGoal />;
    }
  };

  const canProceed = () => {
    const state = useSocialMediaBuilderStore.getState();
    switch (currentStep) {
      case 1:
        return state.managementGoal !== null;
      case 2:
        return state.platforms !== null;
      case 3:
        return state.frequency !== null;
      case 4:
        return state.content !== null;
      case 5:
        return state.engagement !== null;
      case 6:
        return state.strategy !== null;
      case 7:
        return state.reporting !== null;
      case 8:
        return true; // Add-ons are optional
      case 9:
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
            <Share2 className="w-5 h-5 text-[var(--accent-blue)]" />
            <h1 className="text-2xl font-semibold gradient-text font-serif">
              Build My Social
            </h1>
          </div>
          <div className="w-32" /> {/* Spacer for centering */}
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Step Indicator */}
        <SocialMediaStepIndicator
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
              <CombinedEstimateSidebar currentService="social-media" onRequestQuote={() => setShowQuoteForm(true)} />
            ) : (
              <SocialMediaPriceSidebar
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
