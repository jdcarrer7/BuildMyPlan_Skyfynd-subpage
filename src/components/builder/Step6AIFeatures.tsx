'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBuilderStore } from '@/hooks/useBuilderStore';
import { websiteAIFeatures } from '@/data/websiteBuilder';
import { Check, Plus, ChevronDown, ChevronUp, Sparkles, Zap } from 'lucide-react';

export default function Step6AIFeatures() {
  const {
    selectedAIFeatures,
    toggleAIFeature,
    isAIFeatureSelected,
    getAIFeatureSetup,
    getAIFeatureUsage,
    setAISetupOption,
    setAIUsageOption,
  } = useBuilderStore();
  const [expandedFeature, setExpandedFeature] = useState<string | null>(null);

  return (
    <div className="card p-6">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-6 h-6 text-[var(--accent-blue)]" />
          <h2 className="text-2xl font-semibold text-white font-serif">
            AI-Powered Features
          </h2>
        </div>
        <p className="text-[var(--text-secondary)]">
          Add intelligent features to your website. AI features have a one-time setup cost and optional monthly usage fees.
        </p>
        <p className="text-sm text-[var(--text-muted)] mt-2">
          {selectedAIFeatures.length} AI feature{selectedAIFeatures.length !== 1 ? 's' : ''} selected
        </p>
      </div>

      <div className="space-y-3">
        {websiteAIFeatures.map((feature) => {
          const isSelected = isAIFeatureSelected(feature.id);
          const selectedSetupId = getAIFeatureSetup(feature.id);
          const selectedUsageId = getAIFeatureUsage(feature.id);
          const selectedSetup = feature.setupOptions.find(o => o.id === selectedSetupId);
          const selectedUsage = feature.usageOptions.find(o => o.id === selectedUsageId);
          const isExpanded = expandedFeature === feature.id;

          return (
            <motion.div
              key={feature.id}
              layout
              className={`
                rounded-lg overflow-hidden transition-all duration-300
                ${isSelected
                  ? 'bg-[var(--accent-blue)]/10 border border-[var(--accent-blue)]/50'
                  : 'bg-[var(--bg-secondary)] border border-[var(--border-subtle)]'
                }
              `}
            >
              {/* Feature Header */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <button
                    onClick={() => toggleAIFeature(feature.id)}
                    className={`
                      w-6 h-6 rounded border-2 flex items-center justify-center transition-all
                      ${isSelected
                        ? 'border-[var(--accent-blue)] bg-[var(--accent-blue)]'
                        : 'border-[var(--border-subtle)] hover:border-[var(--accent-blue)]'
                      }
                    `}
                  >
                    {isSelected ? (
                      <Check className="w-4 h-4 text-white" />
                    ) : (
                      <Plus className="w-4 h-4 text-[var(--text-muted)]" />
                    )}
                  </button>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className={`font-medium ${isSelected ? 'text-white' : 'text-[var(--text-secondary)]'}`}>
                        {feature.name}
                      </h3>
                      <Sparkles className={`w-4 h-4 ${isSelected ? 'text-[var(--accent-orange)]' : 'text-[var(--text-muted)]'}`} />
                    </div>
                    {isSelected && selectedSetup && (
                      <div className="flex flex-wrap gap-2 mt-1">
                        <span className="text-sm text-[var(--accent-blue)]">
                          Setup: {selectedSetup.label} ({selectedSetup.price === null ? 'Quote' : `$${selectedSetup.price}`})
                        </span>
                        {selectedUsage && selectedUsage.price !== null && selectedUsage.price > 0 && (
                          <span className="text-sm text-[var(--accent-teal)]">
                            + ${selectedUsage.price}/mo
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {isSelected && (
                  <button
                    onClick={() => setExpandedFeature(isExpanded ? null : feature.id)}
                    className="p-2 hover:bg-[var(--bg-card-hover)] rounded transition-colors"
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-[var(--text-muted)]" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-[var(--text-muted)]" />
                    )}
                  </button>
                )}
              </div>

              {/* Feature Options */}
              <AnimatePresence>
                {isExpanded && isSelected && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 pt-0 border-t border-[var(--border-subtle)]">
                      {/* Setup Options */}
                      <div className="pt-3">
                        <p className="text-xs text-[var(--text-muted)] mb-2 flex items-center gap-1">
                          <Zap className="w-3 h-3" /> Setup complexity (one-time):
                        </p>
                        <div className="grid gap-2">
                          {feature.setupOptions.map((option) => {
                            const isOptionSelected = selectedSetupId === option.id;
                            return (
                              <button
                                key={option.id}
                                onClick={() => setAISetupOption(feature.id, option.id)}
                                className={`
                                  p-3 rounded-lg text-left transition-all flex items-center justify-between
                                  ${isOptionSelected
                                    ? 'bg-[var(--accent-blue)] text-white'
                                    : 'bg-[var(--bg-card)] text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)]'
                                  }
                                `}
                              >
                                <div>
                                  <span className="font-medium">{option.label}</span>
                                  <p className={`text-xs mt-1 ${isOptionSelected ? 'text-white/70' : 'text-[var(--text-muted)]'}`}>
                                    {option.description || 'AI setup and integration'}
                                  </p>
                                </div>
                                <span className="font-semibold ml-4 whitespace-nowrap">
                                  {option.price === null ? 'Quote' : `$${option.price}`}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Usage Options */}
                      <div className="pt-4">
                        <p className="text-xs text-[var(--text-muted)] mb-2 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> Monthly usage tier:
                        </p>
                        <div className="grid gap-2">
                          {feature.usageOptions.map((option) => {
                            const isOptionSelected = selectedUsageId === option.id;
                            return (
                              <button
                                key={option.id}
                                onClick={() => setAIUsageOption(feature.id, option.id)}
                                className={`
                                  p-3 rounded-lg text-left transition-all flex items-center justify-between
                                  ${isOptionSelected
                                    ? 'bg-[var(--accent-teal)] text-white'
                                    : 'bg-[var(--bg-card)] text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)]'
                                  }
                                `}
                              >
                                <div>
                                  <span className="font-medium">{option.label}</span>
                                  <p className={`text-xs mt-1 ${isOptionSelected ? 'text-white/70' : 'text-[var(--text-muted)]'}`}>
                                    {option.description || option.includes}
                                  </p>
                                </div>
                                <span className="font-semibold ml-4 whitespace-nowrap">
                                  {option.price === null ? 'Quote' : option.price === 0 ? 'Included' : `$${option.price}/mo`}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
