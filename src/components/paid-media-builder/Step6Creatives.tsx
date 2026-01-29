'use client';

import { motion } from 'framer-motion';
import { usePaidMediaBuilderStore } from '@/hooks/usePaidMediaBuilderStore';
import { creativeOptions, landingPageOptions } from '@/data/paidMediaBuilder';
import { Check, HelpCircle } from 'lucide-react';
import { useState } from 'react';

export default function Step6Creatives() {
  const { creatives, setCreatives, landingPage, setLandingPage } = usePaidMediaBuilderStore();
  const [tooltipOpen, setTooltipOpen] = useState<string | null>(null);

  // Format price display for creative options
  const formatCreativePrice = (option: typeof creativeOptions[0]) => {
    if (option.price === 0) {
      return 'Included';
    }
    if (option.startsAt) {
      return `From $${option.price}`;
    }
    return `$${option.price}`;
  };

  // Format price display for landing page options
  const formatLandingPagePrice = (option: typeof landingPageOptions[0]) => {
    if (option.price === 0) {
      return 'Included';
    }
    if (option.startsAt) {
      return `From $${option.price}`;
    }
    return `$${option.price}`;
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-white mb-2">Creative Services</h2>
        <p className="text-[var(--text-secondary)]">
          Choose your ad creative production and landing page needs.
        </p>
      </div>

      {/* Section 1: Ad Creative Production */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-[var(--accent-blue)]/20 flex items-center justify-center text-sm text-[var(--accent-blue)]">1</span>
          Ad Creative Production
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {creativeOptions.map((option) => {
            const isSelected = creatives === option.id;

            return (
              <div key={option.id} className="relative">
                <motion.button
                  onClick={() => setCreatives(option.id)}
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
                          setTooltipOpen(tooltipOpen === `creative-${option.id}` ? null : `creative-${option.id}`);
                        }}
                      >
                        <HelpCircle className="w-5 h-5" />
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold gradient-text">
                      {formatCreativePrice(option)}
                    </span>
                    {option.oneTime && option.price > 0 && (
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-[var(--accent-orange)]/20 text-[var(--accent-orange)] border border-[var(--accent-orange)]/30">
                        One-time
                      </span>
                    )}
                  </div>
                </motion.button>

                {/* Tooltip - Outside the button */}
                {tooltipOpen === `creative-${option.id}` && (
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

      {/* Section 2: Landing Page */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-[var(--accent-teal)]/20 flex items-center justify-center text-sm text-[var(--accent-teal)]">2</span>
          Landing Page
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {landingPageOptions.map((option) => {
            const isSelected = landingPage === option.id;

            return (
              <div key={option.id} className="relative">
                <motion.button
                  onClick={() => setLandingPage(option.id)}
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
                          setTooltipOpen(tooltipOpen === `landing-${option.id}` ? null : `landing-${option.id}`);
                        }}
                      >
                        <HelpCircle className="w-5 h-5" />
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold gradient-text">
                      {formatLandingPagePrice(option)}
                    </span>
                    {option.oneTime && option.price > 0 && (
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-[var(--accent-orange)]/20 text-[var(--accent-orange)] border border-[var(--accent-orange)]/30">
                        One-time
                      </span>
                    )}
                  </div>
                </motion.button>

                {/* Tooltip - Outside the button */}
                {tooltipOpen === `landing-${option.id}` && (
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
    </div>
  );
}
