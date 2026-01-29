'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBuilderStore } from '@/hooks/useBuilderStore';
import { timelineOptions } from '@/data/websiteBuilder';
import { Check, Info, X, Clock, Zap, AlertTriangle } from 'lucide-react';

const timelineIcons: Record<string, React.ReactNode> = {
  flexible: <Clock className="w-6 h-6" />,
  standard: <Clock className="w-6 h-6" />,
  expedited: <Zap className="w-6 h-6" />,
  rush: <AlertTriangle className="w-6 h-6" />,
};

export default function Step7Timeline() {
  const { timeline, setTimeline, subtotal } = useBuilderStore();
  const [tooltipId, setTooltipId] = useState<string | null>(null);

  const selectedTooltip = tooltipId
    ? timelineOptions.find(t => t.id === tooltipId)
    : null;

  const getRushFee = (multiplier: number) => {
    if (multiplier === 1) return 0;
    return Math.round(subtotal * (multiplier - 1));
  };

  return (
    <div className="card p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-white font-serif mb-2">
          Project Timeline
        </h2>
        <p className="text-[var(--text-secondary)]">
          When do you need your website completed? Faster timelines include a rush fee.
        </p>
      </div>

      <div className="space-y-3">
        {timelineOptions.map((option) => {
          const isSelected = timeline === option.id;
          const rushFee = getRushFee(option.multiplier);
          const hasRushFee = option.multiplier > 1;

          return (
            <motion.div
              key={option.id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div
                className={`
                  w-full p-4 rounded-lg text-left transition-all duration-300 relative
                  ${isSelected
                    ? hasRushFee
                      ? 'bg-[var(--accent-orange)]/10 border-2 border-[var(--accent-orange)]'
                      : 'bg-[var(--accent-blue)]/10 border-2 border-[var(--accent-blue)]'
                    : 'bg-[var(--bg-secondary)] border border-[var(--border-subtle)] hover:border-[var(--accent-blue)]/50'
                  }
                `}
              >
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setTimeline(option.id)}
                    className={`
                      p-3 rounded-full transition-all
                      ${isSelected
                        ? hasRushFee
                          ? 'bg-[var(--accent-orange)]/20 text-[var(--accent-orange)]'
                          : 'bg-[var(--accent-blue)]/20 text-[var(--accent-blue)]'
                        : 'bg-[var(--bg-card)] text-[var(--text-muted)]'
                      }
                    `}
                  >
                    {timelineIcons[option.id]}
                  </button>

                  <button
                    onClick={() => setTimeline(option.id)}
                    className="flex-1 text-left"
                  >
                    <div className="flex items-center gap-2">
                      <h3 className={`font-medium ${isSelected ? 'text-white' : 'text-[var(--text-secondary)]'}`}>
                        {option.label}
                      </h3>
                      {hasRushFee && (
                        <span className="text-xs px-2 py-0.5 bg-[var(--accent-orange)] text-black rounded font-medium">
                          +{Math.round((option.multiplier - 1) * 100)}%
                        </span>
                      )}
                    </div>
                  </button>

                  <div className="flex items-center gap-3">
                    {rushFee > 0 ? (
                      <span className="text-[var(--accent-orange)] font-semibold">
                        +${rushFee.toLocaleString()}
                      </span>
                    ) : (
                      <span className={`font-medium ${isSelected ? 'text-green-400' : 'text-[var(--text-muted)]'}`}>
                        No rush fee
                      </span>
                    )}

                    <button
                      onClick={() => setTimeline(option.id)}
                      className={`
                        w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
                        ${isSelected
                          ? hasRushFee
                            ? 'border-[var(--accent-orange)] bg-[var(--accent-orange)]'
                            : 'border-[var(--accent-blue)] bg-[var(--accent-blue)]'
                          : 'border-[var(--border-subtle)]'
                        }
                      `}
                    >
                      {isSelected && <Check className="w-4 h-4 text-white" />}
                    </button>

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

      {timeline && timelineOptions.find(t => t.id === timeline)?.multiplier! > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-[var(--accent-orange)]/10 border border-[var(--accent-orange)]/30 rounded-lg"
        >
          <p className="text-sm text-[var(--accent-orange)]">
            Rush fee applied: A {Math.round((timelineOptions.find(t => t.id === timeline)?.multiplier! - 1) * 100)}% rush fee
            will be added to your project total to prioritize your timeline.
          </p>
        </motion.div>
      )}
    </div>
  );
}
