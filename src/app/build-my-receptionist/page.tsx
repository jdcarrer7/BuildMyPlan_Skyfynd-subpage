'use client';

import { useState, useEffect } from 'react';
import { useAIReceptionistBuilderStore } from '@/hooks/useAIReceptionistBuilderStore';
import AIReceptionistStepIndicator from '@/components/ai-receptionist-builder/AIReceptionistStepIndicator';
import AIReceptionistPriceSidebar from '@/components/ai-receptionist-builder/AIReceptionistPriceSidebar';
import CombinedEstimateSidebar from '@/components/builder/CombinedEstimateSidebar';
import Step1Overview from '@/components/ai-receptionist-builder/Step1Overview';
import Step2PhoneSetup from '@/components/ai-receptionist-builder/Step2PhoneSetup';
import Step3CallHandling from '@/components/ai-receptionist-builder/Step3CallHandling';
import Step4AICapabilities from '@/components/ai-receptionist-builder/Step4AICapabilities';
import Step5Integrations from '@/components/ai-receptionist-builder/Step5Integrations';
import Step6Reporting from '@/components/ai-receptionist-builder/Step6Reporting';
import Step7Support from '@/components/ai-receptionist-builder/Step7Support';
import Step8Summary from '@/components/ai-receptionist-builder/Step8Summary';
import { isPromoActive } from '@/data/aiReceptionistBuilder';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Home, Phone, Sparkles } from 'lucide-react';
import Link from 'next/link';

const TOTAL_STEPS = 8;

export default function BuildMyReceptionistPage() {
  const { currentStep, setStep, nextStep, prevStep, basePackage, saveToUnifiedQuote, loadFromUnifiedQuote } = useAIReceptionistBuilderStore();
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const promoActive = isPromoActive();

  // Load from unified quote on mount (edit mode) and check for summary param
  useEffect(() => {
    // First, try to load any existing config from the unified quote store
    loadFromUnifiedQuote();

    // Check URL for ?summary=true to navigate directly to summary
    const params = new URLSearchParams(window.location.search);
    if (params.get('summary') === 'true') {
      setStep(TOTAL_STEPS);
    }
  }, [loadFromUnifiedQuote, setStep]);

  // Handle navigation to step 8 (summary) with save
  const handleGoToSummary = () => {
    if (basePackage) {
      saveToUnifiedQuote();
    }
    setStep(8);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1Overview />;
      case 2:
        return <Step2PhoneSetup />;
      case 3:
        return <Step3CallHandling />;
      case 4:
        return <Step4AICapabilities />;
      case 5:
        return <Step5Integrations />;
      case 6:
        return <Step6Reporting />;
      case 7:
        return <Step7Support />;
      case 8:
        return <Step8Summary showQuoteForm={showQuoteForm} onCloseQuoteForm={() => setShowQuoteForm(false)} />;
      default:
        return <Step1Overview />;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return basePackage !== null;
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
        // Options have defaults from package preset
        return true;
      case 8:
        return true;
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
            <Phone className="w-5 h-5 text-[var(--accent-purple)]" />
            <h1 className="text-xl font-semibold gradient-text font-serif">
              Build My AI Receptionist
            </h1>
          </div>
          <div className="w-32" /> {/* Spacer for centering */}
        </div>
      </header>

      {/* Promotional Banner */}
      {promoActive && (
        <div className="bg-gradient-to-r from-[var(--accent-purple)]/10 via-[var(--accent-pink)]/10 to-[var(--accent-orange)]/10 border-b border-[var(--accent-purple)]/20">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-center gap-3 text-center">
              <Sparkles className="w-5 h-5 text-[var(--accent-purple)]" />
              <p className="text-sm md:text-base">
                <span className="font-bold text-white">LIMITED TIME OFFER</span>
                <span className="text-[var(--text-secondary)]"> — Ends March 1st, 2026: </span>
                <span className="font-semibold text-[var(--accent-purple)]">50% OFF Activation Fee</span>
                <span className="text-[var(--text-secondary)]"> for Starter & Business Plans</span>
              </p>
              <Sparkles className="w-5 h-5 text-[var(--accent-pink)]" />
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Step Indicator */}
        <AIReceptionistStepIndicator
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

            {/* Navigation Buttons - Hidden on step 8 */}
            {currentStep < 8 && (
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
                  onClick={currentStep === 7 ? handleGoToSummary : nextStep}
                  disabled={!canProceed()}
                  className={`
                    flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all
                    ${!canProceed()
                      ? 'bg-[var(--bg-card)] text-[var(--text-muted)] cursor-not-allowed'
                      : 'btn-primary'
                    }
                  `}
                >
                  {currentStep === 7 ? 'Review Summary' : 'Continue'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Price Sidebar */}
          <div className="lg:col-span-1">
            {currentStep === 8 ? (
              <CombinedEstimateSidebar currentService="ai-receptionist" onRequestQuote={() => setShowQuoteForm(true)} />
            ) : (
              <AIReceptionistPriceSidebar
                currentStep={currentStep}
                onGoToSummary={handleGoToSummary}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
