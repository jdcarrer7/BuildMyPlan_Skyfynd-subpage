'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useAnimationBuilderStore } from '@/hooks/useAnimationBuilderStore';
import { addOnCategories } from '@/data/animationBuilder';
import { Check, Plus, ChevronDown, ChevronUp, Package } from 'lucide-react';
import { useState } from 'react';

export default function Step6AddOns() {
  const {
    selectedAddOns,
    toggleAddOn,
    setAddOnTier,
    isAddOnSelected,
    getAddOnTier,
  } = useAnimationBuilderStore();
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  return (
    <div className="card p-6">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Package className="w-6 h-6 text-[var(--accent-blue)]" />
          <h2 className="text-2xl font-semibold text-white font-serif">
            Select any additional services you need
          </h2>
        </div>
        <p className="text-[var(--text-secondary)]">
          Enhance your animation with these optional add-ons.
        </p>
        <p className="text-sm text-[var(--text-muted)] mt-2">
          {selectedAddOns.length} add-on{selectedAddOns.length !== 1 ? 's' : ''} selected
        </p>
      </div>

      <div className="space-y-3">
        {addOnCategories.map((category) => {
          const isSelected = isAddOnSelected(category.id);
          const selectedTier = getAddOnTier(category.id);
          const currentTier = category.tiers.find(t => t.id === selectedTier);
          const isExpanded = expandedCategory === category.id;
          const isRevisions = category.id === 'revisions';

          return (
            <motion.div
              key={category.id}
              layout
              className={`
                rounded-lg overflow-hidden transition-all duration-300
                ${isSelected
                  ? 'bg-[var(--accent-blue)]/10 border border-[var(--accent-blue)]/50'
                  : 'bg-[var(--bg-secondary)] border border-[var(--border-subtle)]'
                }
              `}
            >
              {/* Category Header */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <button
                    onClick={() => !isRevisions && toggleAddOn(category.id)}
                    disabled={isRevisions}
                    className={`
                      w-6 h-6 rounded border-2 flex items-center justify-center transition-all
                      ${isRevisions ? 'cursor-default' : ''}
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
                      {category.name}
                    </h3>
                    {isSelected && currentTier && (
                      <p className="text-sm text-[var(--accent-blue)]">
                        {currentTier.label} — {currentTier.included ? 'Included' : `+$${currentTier.price}`}
                      </p>
                    )}
                  </div>
                </div>

                {isSelected && (
                  <button
                    onClick={() => setExpandedCategory(isExpanded ? null : category.id)}
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

              {/* Tier Options */}
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
                      <div className="pt-3 grid gap-2">
                        {category.tiers.map((tier) => {
                          const isTierSelected = selectedTier === tier.id;
                          return (
                            <button
                              key={tier.id}
                              onClick={() => setAddOnTier(category.id, tier.id)}
                              className={`
                                p-3 rounded-lg text-left transition-all flex items-center justify-between
                                ${isTierSelected
                                  ? 'bg-[var(--accent-blue)] text-white'
                                  : 'bg-[var(--bg-card)] text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)]'
                                }
                              `}
                            >
                              <div>
                                <span className="font-medium">{tier.label}</span>
                                <p className={`text-xs mt-1 ${isTierSelected ? 'text-white/70' : 'text-[var(--text-muted)]'}`}>
                                  {tier.description}
                                </p>
                              </div>
                              <span className="font-semibold ml-4 whitespace-nowrap">
                                {tier.included ? 'Included' : tier.startsAt ? `$${tier.price}+` : `+$${tier.price}`}
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
