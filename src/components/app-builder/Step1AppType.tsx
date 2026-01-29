'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppBuilderStore } from '@/hooks/useAppBuilderStore';
import { appTypes } from '@/data/appBuilder';
import { Check, Info, X } from 'lucide-react';

export default function Step1AppType() {
  const { appType, setAppType } = useAppBuilderStore();
  const [tooltipType, setTooltipType] = useState<string | null>(null);

  const handleSelect = (typeId: string) => {
    setAppType(typeId);
  };

  const selectedTooltip = tooltipType
    ? appTypes.find(t => t.id === tooltipType)?.tooltip
    : null;

  return (
    <div className="card p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-white font-serif mb-2">
          What type of app do you need?
        </h2>
        <p className="text-[var(--text-secondary)]">
          Select the option that best describes your project. We&apos;ll customize recommendations based on your choice.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {appTypes.map((type) => {
          const isSelected = appType === type.id;
          return (
            <motion.div
              key={type.id}
              className="relative"
            >
              <div
                className={`
                  w-full p-4 rounded-lg text-left transition-all duration-300 flex items-center justify-between
                  ${isSelected
                    ? 'bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-teal)] text-white'
                    : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)] hover:text-white border border-[var(--border-subtle)]'
                  }
                `}
              >
                <button
                  onClick={() => handleSelect(type.id)}
                  className="flex items-center gap-3 flex-1"
                >
                  {isSelected && <Check className="w-5 h-5" />}
                  <span className="font-medium">{type.label}</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setTooltipType(tooltipType === type.id ? null : type.id);
                  }}
                  className={`
                    p-1 rounded-full transition-colors
                    ${isSelected ? 'hover:bg-white/20' : 'hover:bg-[var(--accent-blue)]/20'}
                  `}
                >
                  <Info className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Tooltip Modal */}
      <AnimatePresence>
        {selectedTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-4 p-4 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg"
          >
            <div className="flex justify-between items-start mb-3">
              <h4 className="font-semibold text-white">
                {appTypes.find(t => t.id === tooltipType)?.label}
              </h4>
              <button
                onClick={() => setTooltipType(null)}
                className="text-[var(--text-muted)] hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-[var(--accent-blue)] font-medium">What it is: </span>
                <span className="text-[var(--text-secondary)]">{selectedTooltip.whatItIs}</span>
              </p>
              <p>
                <span className="text-[var(--accent-teal)] font-medium">Ideal if: </span>
                <span className="text-[var(--text-secondary)]">{selectedTooltip.idealIf}</span>
              </p>
              <p>
                <span className="text-[var(--accent-orange)] font-medium">Examples: </span>
                <span className="text-[var(--text-secondary)]">{selectedTooltip.examples}</span>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {appType && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg"
        >
          <p className="text-sm text-green-400">
            Great choice! We&apos;ve pre-selected some recommended options based on typical{' '}
            <span className="font-medium">
              {appTypes.find(t => t.id === appType)?.label}
            </span>{' '}
            projects. You can customize everything in the following steps.
          </p>
        </motion.div>
      )}
    </div>
  );
}
