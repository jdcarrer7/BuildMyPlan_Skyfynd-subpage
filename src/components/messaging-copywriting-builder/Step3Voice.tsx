'use client';

import { motion } from 'framer-motion';
import { useMessagingCopywritingBuilderStore } from '@/hooks/useMessagingCopywritingBuilderStore';
import { voiceOptions, voiceTooltips } from '@/data/messagingCopywritingBuilder';
import { Check, HelpCircle, X } from 'lucide-react';
import { useState } from 'react';

export default function Step3Voice() {
  const { voice, setVoice } = useMessagingCopywritingBuilderStore();
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const formatPrice = (option: typeof voiceOptions[0]) => {
    if (option.price === 0) {
      return 'Not Needed';
    }
    if (option.startsAt) {
      return `Starts at $${option.price.toLocaleString()}+`;
    }
    return `$${option.price.toLocaleString()}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-white mb-2">What level of brand voice development do you need?</h2>
        <p className="text-[var(--text-secondary)]">
          Define how your brand sounds across all communications.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {voiceOptions.map((option) => {
          const isSelected = voice === option.id;
          const tooltip = voiceTooltips[option.id];

          return (
            <div key={option.id} className="relative">
              <motion.button
                onClick={() => setVoice(option.id)}
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
                  <div className="flex flex-col gap-1">
                    <span className={`font-medium ${isSelected ? 'text-white' : 'text-[var(--text-secondary)] group-hover:text-white'}`}>
                      {option.label}
                    </span>
                    {option.startsAt && (
                      <span className="text-xs text-[var(--accent-orange)] bg-[var(--accent-orange)]/10 px-2 py-0.5 rounded-full w-fit">
                        Starts at
                      </span>
                    )}
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

                <div className="mt-2">
                  <span className={`text-lg font-semibold ${option.price === 0 ? 'text-[var(--text-muted)]' : 'gradient-text'}`}>
                    {formatPrice(option)}
                  </span>
                  {option.oneTime && option.price > 0 && (
                    <span className="text-xs text-[var(--text-muted)] ml-1">one-time</span>
                  )}
                </div>
              </motion.button>

              {/* Tooltip - Outside the button */}
              {activeTooltip === option.id && tooltip && (
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
                      <p className="text-[var(--text-secondary)] mt-1">{tooltip.whatItIs}</p>
                    </div>
                    <div>
                      <span className="text-[var(--accent-teal)] font-medium">Ideal if:</span>
                      <p className="text-[var(--text-secondary)] mt-1">{tooltip.idealIf}</p>
                    </div>
                    {tooltip.examples && (
                      <div>
                        <span className="text-[var(--accent-orange)] font-medium">Examples:</span>
                        <p className="text-[var(--text-secondary)] mt-1">{tooltip.examples}</p>
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
