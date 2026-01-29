'use client';

import { motion } from 'framer-motion';
import { Check, Film } from 'lucide-react';

interface AnimationStepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  onStepClick: (step: number) => void;
}

const stepLabels = [
  'Animation Type',
  'Duration',
  'Style',
  'Complexity',
  'Sound',
  'Add-ons',
  'Deliverables',
  'Timeline',
  'Summary',
];

export default function AnimationStepIndicator({ currentStep, totalSteps, onStepClick }: AnimationStepIndicatorProps) {
  return (
    <div className="w-full mb-8">
      {/* Service Badge */}
      <div className="hidden md:flex items-center mb-4">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-full">
          <Film className="w-4 h-4 text-[var(--accent-blue)]" />
          <span className="text-sm font-medium text-white">Animation</span>
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden md:flex items-center justify-between max-w-4xl mx-auto">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => {
          const isCompleted = step < currentStep;
          const isCurrent = step === currentStep;
          const isClickable = step < currentStep;

          return (
            <div key={step} className="flex items-center">
              <button
                onClick={() => isClickable && onStepClick(step)}
                disabled={!isClickable}
                className={`
                  relative flex items-center justify-center w-10 h-10 rounded-full font-medium text-sm transition-all
                  ${isCompleted
                    ? 'bg-green-500 text-white cursor-pointer hover:bg-green-600'
                    : isCurrent
                      ? 'bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-teal)] text-white'
                      : 'bg-[var(--bg-card)] text-[var(--text-muted)] border border-[var(--border-subtle)]'
                  }
                `}
              >
                {isCompleted ? <Check className="w-5 h-5" /> : step}
              </button>

              {step < totalSteps && (
                <div
                  className={`w-12 lg:w-20 h-0.5 mx-2 ${
                    step < currentStep ? 'bg-green-500' : 'bg-[var(--border-subtle)]'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Film className="w-4 h-4 text-[var(--accent-blue)]" />
            <span className="text-sm font-medium text-white">Animation</span>
          </div>
          <span className="text-sm text-[var(--text-muted)]">
            Step {currentStep} of {totalSteps}
          </span>
        </div>
        <div className="text-sm font-medium text-[var(--text-secondary)] mb-2">
          {stepLabels[currentStep - 1]}
        </div>
        <div className="w-full bg-[var(--bg-card)] rounded-full h-2 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-teal)]"
            initial={{ width: 0 }}
            animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Step Label (Desktop) */}
      <div className="hidden md:block text-center mt-4">
        <h2 className="text-xl font-semibold text-white">
          {stepLabels[currentStep - 1]}
        </h2>
      </div>
    </div>
  );
}
