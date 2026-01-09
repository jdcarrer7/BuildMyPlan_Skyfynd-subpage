'use client';

import { useState, useEffect } from 'react';
import { useImageBuilderStore } from '@/hooks/useImageBuilderStore';
import ImageStepIndicator from '@/components/image-builder/ImageStepIndicator';
import ImagePriceSidebar from '@/components/image-builder/ImagePriceSidebar';
import CombinedEstimateSidebar from '@/components/builder/CombinedEstimateSidebar';
import Step1ImageType from '@/components/image-builder/Step1ImageType';
import Step2Quantity from '@/components/image-builder/Step2Quantity';
import Step3Style from '@/components/image-builder/Step3Style';
import Step4CreationMethod from '@/components/image-builder/Step4CreationMethod';
import Step5EditingLevel from '@/components/image-builder/Step5EditingLevel';
import Step6AddOns from '@/components/image-builder/Step6AddOns';
import Step7Deliverables from '@/components/image-builder/Step7Deliverables';
import Step8Timeline from '@/components/image-builder/Step8Timeline';
import Step9Summary from '@/components/image-builder/Step9Summary';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Home, Image } from 'lucide-react';
import Link from 'next/link';

const TOTAL_STEPS = 9;

export default function BuildMyImagesPage() {
  const { currentStep, setStep, nextStep, prevStep } = useImageBuilderStore();
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
        return <Step1ImageType />;
      case 2:
        return <Step2Quantity />;
      case 3:
        return <Step3Style />;
      case 4:
        return <Step4CreationMethod />;
      case 5:
        return <Step5EditingLevel />;
      case 6:
        return <Step6AddOns />;
      case 7:
        return <Step7Deliverables />;
      case 8:
        return <Step8Timeline />;
      case 9:
        return <Step9Summary showQuoteForm={showQuoteForm} onCloseQuoteForm={() => setShowQuoteForm(false)} />;
      default:
        return <Step1ImageType />;
    }
  };

  const canProceed = () => {
    const state = useImageBuilderStore.getState();
    switch (currentStep) {
      case 1:
        return state.imageType !== null;
      case 2:
        return state.quantity !== null;
      case 3:
        return state.style !== null;
      case 4:
        return state.creation !== null;
      case 5:
        return state.editing !== null;
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
            <Image className="w-5 h-5 text-[var(--accent-purple)]" />
            <h1 className="text-2xl font-semibold gradient-text font-serif">
              Build My Images
            </h1>
          </div>
          <div className="w-32" /> {/* Spacer for centering */}
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Step Indicator */}
        <ImageStepIndicator
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
              <CombinedEstimateSidebar currentService="image" onRequestQuote={() => setShowQuoteForm(true)} />
            ) : (
              <ImagePriceSidebar
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
