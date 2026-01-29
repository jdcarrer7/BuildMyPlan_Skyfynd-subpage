'use client';

import { motion } from 'framer-motion';
import { useImageBuilderStore } from '@/hooks/useImageBuilderStore';
import { timelineOptions } from '@/data/imageBuilder';
import { Check, HelpCircle, Clock, Calendar, Zap, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

const iconMap: Record<string, React.ElementType> = {
  flexible: Clock,
  standard: Calendar,
  expedited: Zap,
  rush: AlertTriangle,
};

export default function Step8Timeline() {
  const { timeline, setTimeline } = useImageBuilderStore();
  const [tooltipOpen, setTooltipOpen] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-white mb-2">When do you need this completed?</h2>
        <p className="text-[var(--text-secondary)]">
          Select your timeline. Rush orders include a priority fee.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {timelineOptions.map((option) => {
          const isSelected = timeline === option.id;
          const Icon = iconMap[option.id] || Clock;
          const hasRushFee = option.multiplier > 1;

          return (
            <div key={option.id} className="relative">
              <motion.button
                onClick={() => setTimeline(option.id)}
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
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`
                      p-2 rounded-lg
                      ${isSelected
                        ? 'bg-[var(--accent-blue)]/30'
                        : 'bg-[var(--bg-secondary)]'
                      }
                      ${hasRushFee ? 'text-[var(--accent-orange)]' : ''}
                    `}>
                      <Icon className={`w-5 h-5 ${isSelected ? 'text-[var(--accent-blue)]' : hasRushFee ? 'text-[var(--accent-orange)]' : 'text-[var(--text-secondary)]'}`} />
                    </div>
                    <span className={`font-medium ${isSelected ? 'text-white' : 'text-[var(--text-secondary)] group-hover:text-white'}`}>
                      {option.label}
                    </span>
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
                        setTooltipOpen(tooltipOpen === option.id ? null : option.id);
                      }}
                    >
                      <HelpCircle className="w-5 h-5" />
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {hasRushFee ? (
                    <span className="text-[var(--accent-orange)] font-medium">
                      +{Math.round((option.multiplier - 1) * 100)}% Rush Fee
                    </span>
                  ) : (
                    <span className="text-green-400 font-medium">No Rush Fee</span>
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
