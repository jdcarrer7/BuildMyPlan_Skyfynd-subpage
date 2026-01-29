'use client';

import { motion } from 'framer-motion';
import {
  Check,
  Target,
  Layers,
  MessageCircle,
  Globe,
  Megaphone,
  Briefcase,
  Package,
  FileText,
  Layout,
  RefreshCw,
  Sparkles,
  Clock,
  FileCheck,
  PenTool,
} from 'lucide-react';

interface MessagingCopywritingStepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  onStepClick?: (step: number) => void;
}

const stepLabels = [
  'Messaging Goal',
  'Framework',
  'Voice & Tone',
  'Website Copy',
  'Marketing Copy',
  'Sales Copy',
  'Product Copy',
  'Content Writing',
  'UX Writing',
  'Retainer',
  'Add-ons',
  'Timeline',
  'Summary',
];

const stepIcons = [
  Target,
  Layers,
  MessageCircle,
  Globe,
  Megaphone,
  Briefcase,
  Package,
  FileText,
  Layout,
  RefreshCw,
  Sparkles,
  Clock,
  FileCheck,
];

export default function MessagingCopywritingStepIndicator({
  currentStep,
  totalSteps,
  onStepClick,
}: MessagingCopywritingStepIndicatorProps) {
  const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="relative">
      {/* Progress Bar Background */}
      <div className="absolute top-5 left-0 right-0 h-0.5 bg-[var(--bg-secondary)]" />

      {/* Progress Bar Fill */}
      <motion.div
        className="absolute top-5 left-0 h-0.5 bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-teal)]"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.3 }}
      />

      {/* Steps */}
      <div className="relative flex justify-between">
        {Array.from({ length: totalSteps }, (_, i) => {
          const stepNumber = i + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          const isClickable = stepNumber < currentStep && onStepClick;

          return (
            <div
              key={stepNumber}
              className="flex flex-col items-center"
              style={{ width: `${100 / totalSteps}%` }}
            >
              <button
                onClick={() => isClickable && onStepClick(stepNumber)}
                disabled={!isClickable}
                className={`
                  relative w-10 h-10 rounded-full flex items-center justify-center
                  transition-all duration-300 z-10
                  ${isCompleted
                    ? 'bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-teal)] cursor-pointer hover:scale-110'
                    : isCurrent
                    ? 'bg-[var(--accent-orange)] text-black'
                    : 'bg-[var(--bg-secondary)] text-[var(--text-muted)]'
                  }
                  ${!isClickable && !isCurrent ? 'cursor-default' : ''}
                `}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5 text-white" />
                ) : (
                  <span className={`text-sm font-semibold ${isCurrent ? 'text-black' : ''}`}>
                    {stepNumber}
                  </span>
                )}
              </button>

              {/* Step Label - Only visible on larger screens */}
              <span
                className={`
                  hidden md:block mt-2 text-xs text-center max-w-[80px]
                  ${isCurrent ? 'text-white font-medium' : 'text-[var(--text-muted)]'}
                `}
              >
                {stepLabels[i]}
              </span>
            </div>
          );
        })}
      </div>

      {/* Service Badge */}
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1 bg-[var(--bg-secondary)] rounded-full border border-[var(--border-subtle)]">
        <PenTool className="w-3 h-3 text-[var(--accent-blue)]" />
        <span className="text-xs text-[var(--text-secondary)]">Messaging & Copywriting Builder</span>
      </div>
    </div>
  );
}
