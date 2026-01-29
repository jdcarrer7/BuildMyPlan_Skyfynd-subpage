'use client';

import { motion } from 'framer-motion';
import { usePaidMediaBuilderStore } from '@/hooks/usePaidMediaBuilderStore';
import { durationOptions } from '@/data/paidMediaBuilder';
import { Check, HelpCircle } from 'lucide-react';
import { useState } from 'react';

export default function Step4Duration() {
  const { duration, setDuration } = usePaidMediaBuilderStore();
  const [tooltipOpen, setTooltipOpen] = useState<string | null>(null);

  // Calculate multiplier display text
  const getMultiplierText = (multiplier: number) => {
    if (multiplier > 1) {
      return `+${Math.round((multiplier - 1) * 100)}%`;
    } else if (multiplier < 1) {
      return `-${Math.round((1 - multiplier) * 100)}%`;
    }
    return '0%';
  };

  // Get the color for the multiplier badge
  const getMultiplierColor = (multiplier: number) => {
    if (multiplier > 1) {
      return 'bg-red-500/20 text-red-400 border-red-500/30';
    } else if (multiplier < 1) {
      return 'bg-green-500/20 text-green-400 border-green-500/30';
    }
    return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-white mb-2">How long do you want to run your campaign?</h2>
        <p className="text-[var(--text-secondary)]">
          Longer commitments come with better pricing. Select your campaign duration.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {durationOptions.map((option) => {
          const isSelected = duration === option.id;
          const multiplierText = getMultiplierText(option.multiplier);
          const multiplierColor = getMultiplierColor(option.multiplier);

          return (
            <div key={option.id} className="relative">
              <motion.button
                onClick={() => setDuration(option.id)}
                className={`
                  w-full p-4 rounded-xl text-left transition-all group
                  ${isSelected
                    ? 'bg-gradient-to-br from-[var(--accent-blue)]/20 to-[var(--accent-teal)]/20 border-2 border-[var(--accent-blue)]'
                    : 'bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--accent-blue)]/50'
                  }
                `}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className={`font-medium ${isSelected ? 'text-white' : 'text-[var(--text-secondary)] group-hover:text-white'}`}>
                    {option.label}
                  </span>
                  <div className="flex items-center gap-2">
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-[var(--accent-blue)] flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                    <span
                      className="p-1 text-[var(--text-muted)] hover:text-[var(--accent-blue)] transition-colors cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setTooltipOpen(tooltipOpen === option.id ? null : option.id);
                      }}
                    >
                      <HelpCircle className="w-5 h-5" />
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded-md text-sm font-medium border ${multiplierColor}`}>
                    {multiplierText}
                  </span>
                  <span className="text-sm text-[var(--text-muted)]">
                    {option.multiplier < 1 ? 'Savings on monthly fees' : option.multiplier > 1 ? 'Premium on monthly fees' : 'Standard pricing'}
                  </span>
                </div>
              </motion.button>

              {/* Tooltip - Outside the button */}
              {tooltipOpen === option.id && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 top-full mt-2 z-50 w-80 p-4 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-lg shadow-xl"
                >
                  <button
                    onClick={() => setTooltipOpen(null)}
                    className="absolute top-2 right-2 text-[var(--text-muted)] hover:text-white text-xl leading-none"
                  >
                    &times;
                  </button>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-[var(--accent-blue)] font-medium">What it is:</span>
                      <p className="text-[var(--text-secondary)] mt-1">{option.tooltip.whatItIs}</p>
                    </div>
                    <div>
                      <span className="text-[var(--accent-teal)] font-medium">Ideal if:</span>
                      <p className="text-[var(--text-secondary)] mt-1">{option.tooltip.idealIf}</p>
                    </div>
                    <div>
                      <span className="text-[var(--accent-orange)] font-medium">Examples:</span>
                      <p className="text-[var(--text-secondary)] mt-1">{option.tooltip.examples}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
