'use client';

import { motion } from 'framer-motion';
import { useAnimationBuilderStore } from '@/hooks/useAnimationBuilderStore';
import { animationTypeOptions } from '@/data/animationBuilder';
import { HelpCircle, Check, Video, FileVideo, Users, Play, Smartphone, Share2, Box, Presentation, MoreHorizontal } from 'lucide-react';
import { useState } from 'react';

const iconMap: Record<string, React.ElementType> = {
  'motion-graphics': Video,
  'explainer': FileVideo,
  'character': Users,
  'logo': Play,
  'ui-ux': Smartphone,
  'social': Share2,
  'product-3d': Box,
  'presentation': Presentation,
  'other': MoreHorizontal,
};

export default function Step1AnimationType() {
  const { animationType, setAnimationType } = useAnimationBuilderStore();
  const [tooltipOpen, setTooltipOpen] = useState<string | null>(null);

  return (
    <div className="card p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-white font-serif mb-2">
          What kind of animation do you need?
        </h2>
        <p className="text-[var(--text-secondary)]">
          This helps us recommend the best options for your project.
        </p>
      </div>

      <div className="grid gap-3">
        {animationTypeOptions.map((option) => {
          const Icon = iconMap[option.id] || Video;
          const isSelected = animationType === option.id;

          return (
            <div key={option.id} className="relative">
              <motion.button
                onClick={() => setAnimationType(option.id)}
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
                    w-10 h-10 rounded-lg flex items-center justify-center
                    ${isSelected ? 'bg-[var(--accent-blue)]' : 'bg-[var(--bg-card)]'}
                  `}>
                    <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-[var(--text-muted)]'}`} />
                  </div>
                  <span className={`font-medium ${isSelected ? 'text-white' : 'text-[var(--text-secondary)]'}`}>
                    {option.label}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-[var(--accent-blue)] flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
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

              {/* Tooltip */}
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

      <p className="text-xs text-[var(--text-muted)] mt-4">
        This selection helps us provide smart recommendations. You can customize everything in the following steps.
      </p>
    </div>
  );
}
