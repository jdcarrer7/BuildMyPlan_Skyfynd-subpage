'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppBuilderStore } from '@/hooks/useAppBuilderStore';
import { appFeatures } from '@/data/appBuilder';
import { Check, Plus, ChevronDown, ChevronUp } from 'lucide-react';

export default function Step7Features() {
  const { selectedFeatures, toggleFeature, isFeatureSelected, getFeatureOption, setFeatureOption } = useAppBuilderStore();
  const [expandedFeature, setExpandedFeature] = useState<string | null>(null);

  return (
    <div className="card p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-white font-serif mb-2">
          App Features
        </h2>
        <p className="text-[var(--text-secondary)]">
          Select the features you need. Click to expand and choose complexity levels.
        </p>
        <p className="text-sm text-[var(--text-muted)] mt-2">
          {selectedFeatures.length} feature{selectedFeatures.length !== 1 ? 's' : ''} selected
        </p>
      </div>

      <div className="space-y-3">
        {appFeatures.map((feature) => {
          const isSelected = isFeatureSelected(feature.id);
          const selectedOptionId = getFeatureOption(feature.id);
          const selectedOption = feature.options.find(o => o.id === selectedOptionId);
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
                    onClick={() => toggleFeature(feature.id)}
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
                    <h3 className={`font-medium ${isSelected ? 'text-white' : 'text-[var(--text-secondary)]'}`}>
                      {feature.name}
                    </h3>
                    {isSelected && selectedOption && (
                      <p className="text-sm text-[var(--accent-blue)]">
                        {selectedOption.label} - {selectedOption.price === null ? 'Custom Quote' : `$${selectedOption.price}`}
                      </p>
                    )}
                  </div>
                </div>

                {feature.options.length > 1 && isSelected && (
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
                {isExpanded && isSelected && feature.options.length > 1 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 pt-0 border-t border-[var(--border-subtle)]">
                      <p className="text-xs text-[var(--text-muted)] mb-3 pt-3">
                        Choose your tier:
                      </p>
                      <div className="grid gap-2">
                        {feature.options.map((option) => {
                          const isOptionSelected = selectedOptionId === option.id;
                          return (
                            <button
                              key={option.id}
                              onClick={() => setFeatureOption(feature.id, option.id)}
                              className={`
                                p-3 rounded-lg text-left transition-all flex items-center justify-between
                                ${isOptionSelected
                                  ? 'bg-[var(--accent-blue)] text-white'
                                  : 'bg-[var(--bg-card)] text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)]'
                                }
                              `}
                            >
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{option.label}</span>
                                  {option.startsAt && (
                                    <span className="text-xs px-1.5 py-0.5 bg-[var(--accent-orange)] text-black rounded">
                                      Starts at
                                    </span>
                                  )}
                                </div>
                                <p className={`text-xs mt-1 ${isOptionSelected ? 'text-white/70' : 'text-[var(--text-muted)]'}`}>
                                  {option.description}
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
