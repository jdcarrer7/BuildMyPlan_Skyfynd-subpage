'use client';

import { motion } from 'framer-motion';
import { useBrandApplicationsBuilderStore } from '@/hooks/useBrandApplicationsBuilderStore';
import { applicationGoalOptions } from '@/data/brandApplicationsBuilder';
import { Check, HelpCircle, X, Briefcase } from 'lucide-react';
import { useState } from 'react';

export default function Step1ApplicationGoal() {
  const { applicationGoal, setApplicationGoal, applyRecommendations } = useBrandApplicationsBuilderStore();
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const handleGoalSelect = (goalId: string) => {
    setApplicationGoal(goalId);
    applyRecommendations(goalId);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-white mb-2">What&apos;s driving your need for brand applications?</h2>
        <p className="text-[var(--text-secondary)]">
          This helps us recommend the best options for your needs. No pricing impact at this step.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {applicationGoalOptions.map((option) => {
          const isSelected = applicationGoal === option.id;

          return (
            <div key={option.id} className="relative">
              <motion.button
                onClick={() => handleGoalSelect(option.id)}
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
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`
                      p-2 rounded-lg
                      ${isSelected
                        ? 'bg-[var(--accent-blue)]/30'
                        : 'bg-[var(--bg-secondary)]'
                      }
                    `}>
                      <Briefcase className={`w-5 h-5 ${isSelected ? 'text-[var(--accent-blue)]' : 'text-[var(--text-secondary)]'}`} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className={`font-medium ${isSelected ? 'text-white' : 'text-[var(--text-secondary)] group-hover:text-white'}`}>
                        {option.label}
                      </span>
                    </div>
                  </div>

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
                        setActiveTooltip(activeTooltip === option.id ? null : option.id);
                      }}
                    >
                      <HelpCircle className="w-5 h-5" />
                    </span>
                  </div>
                </div>
              </motion.button>

              {/* Tooltip - Outside the button */}
              {activeTooltip === option.id && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 top-full mt-2 z-50 w-80 p-4 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-lg shadow-xl"
                >
                  <button
                    onClick={() => setActiveTooltip(null)}
                    className="absolute top-2 right-2 text-[var(--text-muted)] hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
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

      {applicationGoal && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-[var(--accent-blue)]/10 border border-[var(--accent-blue)]/30 rounded-lg"
        >
          <p className="text-sm text-[var(--text-secondary)]">
            Based on your selection, we&apos;ve pre-selected recommended options for the next steps. You can adjust these at any time.
          </p>
        </motion.div>
      )}
    </div>
  );
}
