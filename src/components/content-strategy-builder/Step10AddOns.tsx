'use client';

import { motion } from 'framer-motion';
import { useContentStrategyBuilderStore } from '@/hooks/useContentStrategyBuilderStore';
import { addOnServices } from '@/data/contentStrategyBuilder';
import { Check, HelpCircle, Plus, Sparkles } from 'lucide-react';
import { useState } from 'react';

export default function Step10AddOns() {
  const { selectedAddOns, toggleAddOn } = useContentStrategyBuilderStore();
  const [tooltipOpen, setTooltipOpen] = useState<string | null>(null);

  const isSelected = (id: string) => selectedAddOns.some((a) => a.id === id);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-white mb-2">Select any additional services you need.</h2>
        <p className="text-[var(--text-secondary)]">
          Enhance your content strategy with specialized add-on services. Select as many as you need.
        </p>
      </div>

      <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
        <Sparkles className="w-4 h-4" />
        <span>Toggle on/off to select multiple services</span>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {addOnServices.map((option) => {
          const selected = isSelected(option.id);

          return (
            <div key={option.id} className="relative">
              <motion.button
                onClick={() => toggleAddOn(option.id)}
                className={`
                  w-full p-4 rounded-xl text-left transition-all group
                  ${selected
                    ? 'bg-gradient-to-br from-[var(--accent-blue)]/20 to-[var(--accent-teal)]/20 border-2 border-[var(--accent-blue)]'
                    : 'bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--accent-blue)]/50'
                  }
                `}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className={`font-medium ${selected ? 'text-white' : 'text-[var(--text-secondary)] group-hover:text-white'}`}>
                    {option.label}
                  </span>
                  <div className="flex items-center gap-2">
                    {selected ? (
                      <div className="w-5 h-5 rounded-full bg-[var(--accent-blue)] flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full border border-[var(--border-subtle)] flex items-center justify-center group-hover:border-[var(--accent-blue)]">
                        <Plus className="w-3 h-3 text-[var(--text-muted)] group-hover:text-[var(--accent-blue)]" />
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

                <div className="text-lg font-semibold">
                  <span className="gradient-text">${option.price.toLocaleString()}</span>
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

      {selectedAddOns.length > 0 && (
        <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-[var(--text-secondary)]">
              {selectedAddOns.length} add-on{selectedAddOns.length !== 1 ? 's' : ''} selected
            </span>
            <span className="font-semibold gradient-text">
              +${selectedAddOns.reduce((sum, a) => sum + a.price, 0).toLocaleString()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
