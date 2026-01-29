'use client';

import { motion } from 'framer-motion';
import { useAnimationBuilderStore } from '@/hooks/useAnimationBuilderStore';
import { complexityOptions } from '@/data/animationBuilder';
import { HelpCircle, Check, Layers } from 'lucide-react';
import { useState } from 'react';

export default function Step4Complexity() {
  const { complexity, setComplexity } = useAnimationBuilderStore();
  const [tooltipOpen, setTooltipOpen] = useState<string | null>(null);

  return (
    <div className="card p-6">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Layers className="w-6 h-6 text-[var(--accent-blue)]" />
          <h2 className="text-2xl font-semibold text-white font-serif">
            How detailed does the animation need to be?
          </h2>
        </div>
        <p className="text-[var(--text-secondary)]">
          More complexity means more elements, intricate timing, and advanced effects.
        </p>
      </div>

      <div className="grid gap-3">
        {complexityOptions.map((option) => {
          const isSelected = complexity === option.id;

          return (
            <div key={option.id} className="relative">
              <motion.button
                onClick={() => setComplexity(option.id)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className={`
                  w-full p-4 rounded-lg border-2 text-left transition-all flex items-center justify-between
                  ${isSelected
                    ? 'border-[var(--accent-blue)] bg-[var(--accent-blue)]/10'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-secondary)] hover:border-[var(--accent-blue)]/50'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <div className={`
                    w-6 h-6 rounded-full border-2 flex items-center justify-center
                    ${isSelected ? 'border-[var(--accent-blue)] bg-[var(--accent-blue)]' : 'border-[var(--border-subtle)]'}
                  `}>
                    {isSelected && <Check className="w-4 h-4 text-white" />}
                  </div>
                  <span className={`font-medium ${isSelected ? 'text-white' : 'text-[var(--text-secondary)]'}`}>
                    {option.label}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-semibold text-white">
                    {option.startsAt ? `$${option.price}+` : `$${option.price}`}
                  </span>
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      setTooltipOpen(tooltipOpen === option.id ? null : option.id);
                    }}
                    className="p-1 text-[var(--text-muted)] hover:text-[var(--accent-blue)] transition-colors cursor-pointer"
                  >
                    <HelpCircle className="w-5 h-5" />
                  </span>
                </div>
              </motion.button>

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
    </div>
  );
}
