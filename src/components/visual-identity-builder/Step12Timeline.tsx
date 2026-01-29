'use client';

import { motion } from 'framer-motion';
import { useVisualIdentityBuilderStore } from '@/hooks/useVisualIdentityBuilderStore';
import { timelineOptions } from '@/data/visualIdentityBuilder';
import { Check, HelpCircle, Clock, Zap, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

const iconMap: Record<string, React.ElementType> = {
  flexible: Clock,
  standard: Clock,
  accelerated: Zap,
  rush: AlertTriangle,
};

export default function Step12Timeline() {
  const { timeline, setTimeline, projectSubtotal } = useVisualIdentityBuilderStore();
  const [tooltipOpen, setTooltipOpen] = useState<string | null>(null);

  const getMultiplierLabel = (multiplier: number) => {
    if (multiplier === 1) return '1.0x';
    return `${multiplier.toFixed(2)}x`;
  };

  const getPercentLabel = (multiplier: number) => {
    if (multiplier === 1) return '0%';
    const percent = Math.round((multiplier - 1) * 100);
    return `+${percent}%`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-white mb-2">When do you need this completed?</h2>
        <p className="text-[var(--text-secondary)]">
          Select your preferred timeline. Faster delivery options include priority production premiums.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {timelineOptions.map((option) => {
          const isSelected = timeline === option.id;
          const Icon = iconMap[option.id] || Clock;
          const premiumAmount = option.multiplier > 1 ? Math.round(projectSubtotal * (option.multiplier - 1)) : 0;

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
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`
                      p-2 rounded-lg
                      ${isSelected
                        ? 'bg-[var(--accent-blue)]/30'
                        : 'bg-[var(--bg-secondary)]'
                      }
                    `}>
                      <Icon className={`w-5 h-5 ${isSelected ? 'text-[var(--accent-blue)]' : 'text-[var(--text-secondary)]'}`} />
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

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`text-lg font-semibold ${option.multiplier === 1 ? 'text-green-400' : 'text-[var(--accent-orange)]'}`}>
                      {getMultiplierLabel(option.multiplier)}
                    </span>
                    <span className="text-sm text-[var(--text-muted)]">
                      ({getPercentLabel(option.multiplier)})
                    </span>
                  </div>
                  {premiumAmount > 0 && projectSubtotal > 0 && (
                    <span className="text-sm text-[var(--text-muted)]">
                      +${premiumAmount.toLocaleString()}
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

      {/* Timeline Premium Info */}
      {timeline && projectSubtotal > 0 && (
        <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-[var(--text-secondary)]">Timeline premium</span>
            {timelineOptions.find((t) => t.id === timeline)?.multiplier === 1 ? (
              <span className="text-green-400 font-medium">No premium</span>
            ) : (
              <span className="text-[var(--accent-orange)] font-medium">
                +${Math.round(projectSubtotal * ((timelineOptions.find((t) => t.id === timeline)?.multiplier || 1) - 1)).toLocaleString()}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
