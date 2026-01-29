'use client';

import { motion } from 'framer-motion';
import { usePaidMediaBuilderStore } from '@/hooks/usePaidMediaBuilderStore';
import { reportingOptions } from '@/data/paidMediaBuilder';
import { Check, HelpCircle } from 'lucide-react';
import { useState } from 'react';

export default function Step8Reporting() {
  const { reporting, setReporting } = usePaidMediaBuilderStore();
  const [tooltipOpen, setTooltipOpen] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-white mb-2">How often do you want reports?</h2>
        <p className="text-[var(--text-secondary)]">
          Select your preferred reporting frequency and communication level.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {reportingOptions.map((option) => {
          const isSelected = reporting === option.id;

          return (
            <div key={option.id} className="relative">
              <motion.button
                onClick={() => setReporting(option.id)}
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

                <div className="text-lg font-semibold gradient-text">
                  {option.price === 0 ? (
                    <span className="text-green-400">Included</span>
                  ) : (
                    <>
                      +${option.price}
                      <span className="text-sm text-[var(--text-muted)] font-normal">/mo</span>
                    </>
                  )}
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
                    {option.tooltip.examples && (
                      <div>
                        <span className="text-[var(--accent-orange)] font-medium">Examples:</span>
                        <p className="text-[var(--text-secondary)] mt-1">{option.tooltip.examples}</p>
                      </div>
                    )}
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
