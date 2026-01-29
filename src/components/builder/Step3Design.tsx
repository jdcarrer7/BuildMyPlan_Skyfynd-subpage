'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBuilderStore } from '@/hooks/useBuilderStore';
import { designOptions } from '@/data/websiteBuilder';
import { Check, Info, X, Sparkles, Palette, Zap } from 'lucide-react';

const designIcons: Record<string, React.ReactNode> = {
  clean: <Palette className="w-6 h-6" />,
  modern: <Sparkles className="w-6 h-6" />,
  premium: <Zap className="w-6 h-6" />,
};

export default function Step3Design() {
  const { designComplexity, setDesignComplexity } = useBuilderStore();
  const [tooltipId, setTooltipId] = useState<string | null>(null);

  const selectedTooltip = tooltipId
    ? designOptions.find(d => d.id === tooltipId)
    : null;

  return (
    <div className="card p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-white font-serif mb-2">
          Choose your design style
        </h2>
        <p className="text-[var(--text-secondary)]">
          Select the level of design complexity that matches your vision.
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {designOptions.map((option) => {
          const isSelected = designComplexity === option.id;
          return (
            <motion.div
              key={option.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div
                className={`
                  w-full p-6 rounded-lg text-center transition-all duration-300 relative
                  ${isSelected
                    ? 'bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-teal)] text-white'
                    : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)] hover:text-white border border-[var(--border-subtle)]'
                  }
                `}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2">
                    <Check className="w-5 h-5" />
                  </div>
                )}

                <button
                  onClick={() => setDesignComplexity(option.id)}
                  className="w-full"
                >
                  <div className="flex justify-center mb-3">
                    <div className={`p-3 rounded-full ${isSelected ? 'bg-white/20' : 'bg-[var(--accent-blue)]/20'}`}>
                      {designIcons[option.id]}
                    </div>
                  </div>

                  <h3 className="font-semibold text-lg mb-2">{option.label}</h3>
                  <p className="text-2xl font-bold mb-3">${option.price}</p>
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setTooltipId(tooltipId === option.id ? null : option.id);
                  }}
                  className={`
                    inline-flex items-center gap-1 text-xs transition-colors
                    ${isSelected ? 'text-white/70 hover:text-white' : 'text-[var(--text-muted)] hover:text-[var(--accent-blue)]'}
                  `}
                >
                  <Info className="w-3 h-3" />
                  Learn more
                </button>
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
