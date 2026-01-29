'use client';

import { motion } from 'framer-motion';
import { useSocialMediaBuilderStore } from '@/hooks/useSocialMediaBuilderStore';
import { engagementOptions } from '@/data/socialMediaBuilder';
import { Check, HelpCircle, X } from 'lucide-react';
import { useState } from 'react';

export default function Step5Engagement() {
  const { engagement, setEngagement } = useSocialMediaBuilderStore();
  const [tooltipOpen, setTooltipOpen] = useState<string | null>(null);

  // Format price display
  const formatPrice = (option: typeof engagementOptions[0]) => {
    if (option.customQuote) {
      return 'Custom quote';
    }
    if (option.price === 0) {
      return '$0';
    }
    if (option.startsAt) {
      return `From $${option.price}/mo`;
    }
    return `$${option.price}/mo`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-white mb-2">How should we handle engagement with your audience?</h2>
        <p className="text-[var(--text-secondary)]">
          Choose how you want us to manage community interactions and responses.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {engagementOptions.map((option) => {
          const isSelected = engagement === option.id;

          return (
            <div key={option.id} className="relative">
              <motion.button
                onClick={() => setEngagement(option.id)}
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
                  <span className="text-lg font-semibold gradient-text">
                    {formatPrice(option)}
                  </span>
                  {option.startsAt && (
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-[var(--accent-orange)]/20 text-[var(--accent-orange)] border border-[var(--accent-orange)]/30">
                      Starts at
                    </span>
                  )}
                  {option.customQuote && (
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-[var(--accent-teal)]/20 text-[var(--accent-teal)] border border-[var(--accent-teal)]/30">
                      Custom
                    </span>
                  )}
                  {option.recurring && !option.customQuote && (
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-[var(--accent-blue)]/20 text-[var(--accent-blue)] border border-[var(--accent-blue)]/30">
                      Monthly
                    </span>
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
