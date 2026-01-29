'use client';

import { motion } from 'framer-motion';
import { useMessagingCopywritingBuilderStore } from '@/hooks/useMessagingCopywritingBuilderStore';
import { retainerOptions, retainerTooltips } from '@/data/messagingCopywritingBuilder';
import { Check, HelpCircle, RefreshCw } from 'lucide-react';
import { useState } from 'react';

export default function Step10Retainer() {
  const { retainer, setRetainer } = useMessagingCopywritingBuilderStore();
  const [tooltipOpen, setTooltipOpen] = useState<string | null>(null);

  const formatMonthlyPrice = (option: typeof retainerOptions[0]) => {
    if (option.price === 0) return '$0/mo';
    if (option.startsAt) return `Starts at $${option.price.toLocaleString()}/mo+`;
    return `$${option.price.toLocaleString()}/mo`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-white mb-2">Do you need ongoing copywriting support?</h2>
        <p className="text-[var(--text-secondary)]">
          Select a monthly retainer for continuous copywriting needs. This is a recurring monthly cost.
        </p>
      </div>

      <div className="flex items-center gap-2 p-3 bg-[var(--accent-teal)]/10 border border-[var(--accent-teal)]/30 rounded-lg">
        <RefreshCw className="w-4 h-4 text-[var(--accent-teal)]" />
        <span className="text-sm text-[var(--accent-teal)]">
          Retainer pricing is MONTHLY recurring. Your team is billed each month.
        </span>
      </div>

      <div className="space-y-3">
        {retainerOptions.map((option) => {
          const isSelected = retainer === option.id;
          const tooltip = retainerTooltips[option.id];

          return (
            <div key={option.id} className="relative">
              <motion.button
                onClick={() => setRetainer(option.id)}
                className={`
                  w-full p-4 rounded-xl text-left transition-all group
                  ${isSelected
                    ? 'bg-gradient-to-br from-[var(--accent-blue)]/20 to-[var(--accent-teal)]/20 border-2 border-[var(--accent-blue)]'
                    : 'bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--accent-blue)]/50'
                  }
                `}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {isSelected ? (
                      <div className="w-5 h-5 rounded-full bg-[var(--accent-blue)] flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-[var(--border-subtle)] group-hover:border-[var(--accent-blue)]" />
                    )}
                    <span className={`font-medium ${isSelected ? 'text-white' : 'text-[var(--text-secondary)] group-hover:text-white'}`}>
                      {option.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      {option.startsAt ? (
                        <div>
                          <span className="text-xs text-[var(--text-muted)]">Starts at</span>
                          <div className="text-lg font-semibold text-[var(--accent-teal)]">
                            ${option.price.toLocaleString()}/mo+
                          </div>
                        </div>
                      ) : option.price === 0 ? (
                        <span className="text-lg font-semibold text-[var(--text-muted)]">$0/mo</span>
                      ) : (
                        <span className="text-lg font-semibold text-[var(--accent-teal)]">
                          ${option.price.toLocaleString()}/mo
                        </span>
                      )}
                    </div>
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
              </motion.button>

              {/* Tooltip */}
              {tooltipOpen === option.id && tooltip && (
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

      {/* Monthly Summary */}
      {retainer && retainer !== 'none' && (
        <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-[var(--accent-teal)]" />
              <span className="text-[var(--text-secondary)]">Monthly retainer</span>
            </div>
            <span className="font-semibold text-[var(--accent-teal)]">
              {formatMonthlyPrice(retainerOptions.find((o) => o.id === retainer)!)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
