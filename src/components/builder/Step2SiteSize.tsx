'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBuilderStore } from '@/hooks/useBuilderStore';
import { siteSizeOptions } from '@/data/websiteBuilder';
import { Check, Info, X } from 'lucide-react';

export default function Step2SiteSize() {
  const { siteSize, setSiteSize } = useBuilderStore();
  const [tooltipId, setTooltipId] = useState<string | null>(null);

  const selectedTooltip = tooltipId
    ? siteSizeOptions.find(s => s.id === tooltipId)
    : null;

  return (
    <div className="card p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-white font-serif mb-2">
          How many pages do you need?
        </h2>
        <p className="text-[var(--text-secondary)]">
          Select the size that best matches your content needs. This affects base pricing.
        </p>
      </div>

      <div className="space-y-3">
        {siteSizeOptions.map((option) => {
          const isSelected = siteSize === option.id;
          return (
            <motion.div
              key={option.id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div
                className={`
                  w-full p-4 rounded-lg text-left transition-all duration-300 flex items-center justify-between
                  ${isSelected
                    ? 'bg-gradient-to-r from-[var(--accent-blue)]/20 to-[var(--accent-teal)]/20 border-2 border-[var(--accent-blue)]'
                    : 'bg-[var(--bg-secondary)] border border-[var(--border-subtle)] hover:border-[var(--accent-blue)]/50'
                  }
                `}
              >
                <button
                  onClick={() => setSiteSize(option.id)}
                  className="flex items-center gap-4 flex-1"
                >
                  <div
                    className={`
                      w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
                      ${isSelected
                        ? 'border-[var(--accent-blue)] bg-[var(--accent-blue)]'
                        : 'border-[var(--border-subtle)]'
                      }
                    `}
                  >
                    {isSelected && <Check className="w-4 h-4 text-white" />}
                  </div>
                  <div>
                    <p className={`font-medium ${isSelected ? 'text-white' : 'text-[var(--text-secondary)]'}`}>
                      {option.label}
                    </p>
                  </div>
                </button>

                <div className="flex items-center gap-3">
                  <span className={`font-semibold ${isSelected ? 'text-white' : 'text-[var(--text-secondary)]'}`}>
                    {option.price === null ? 'Custom Quote' : `$${option.price}`}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setTooltipId(tooltipId === option.id ? null : option.id);
                    }}
                    className="p-1 rounded-full hover:bg-[var(--accent-blue)]/20 transition-colors"
                  >
                    <Info className="w-4 h-4 text-[var(--text-muted)]" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {selectedTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-4 p-4 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg"
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold text-white mb-1">{selectedTooltip.label}</h4>
                <p className="text-sm text-[var(--text-secondary)]">{selectedTooltip.tooltip}</p>
              </div>
              <button
                onClick={() => setTooltipId(null)}
                className="text-[var(--text-muted)] hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
