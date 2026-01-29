'use client';

import { motion } from 'framer-motion';
import { useImageBuilderStore } from '@/hooks/useImageBuilderStore';
import { styleOptions } from '@/data/imageBuilder';
import { Check, HelpCircle, AlertCircle } from 'lucide-react';
import { useState } from 'react';

export default function Step3Style() {
  const { style, setStyle } = useImageBuilderStore();
  const [tooltipOpen, setTooltipOpen] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-white mb-2">What visual style fits your project?</h2>
        <p className="text-[var(--text-secondary)]">
          Choose the aesthetic direction for your images.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {styleOptions.map((option) => {
          const isSelected = style === option.id;
          const isCustom = option.customQuote;

          return (
            <div key={option.id} className="relative">
              <motion.button
                onClick={() => setStyle(option.id)}
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

                <div className="flex items-center gap-2">
                  {isCustom ? (
                    <div className="flex items-center gap-1 text-[var(--accent-orange)]">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Custom quote</span>
                    </div>
                  ) : (
                    <span className="text-xl font-bold gradient-text">${option.price}</span>
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
