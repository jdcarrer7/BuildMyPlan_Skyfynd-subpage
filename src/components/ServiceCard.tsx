'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Service } from '@/data/services';
import { usePlanStore } from '@/hooks/usePlanStore';
import { Check, Plus, Minus, ChevronDown, ChevronUp, Star } from 'lucide-react';

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedTier, setSelectedTier] = useState<'essential' | 'pro' | 'enterprise'>('pro');

  const { addItem, removeItem, isServiceInPlan, getItemByServiceId, toggleAddOn } = usePlanStore();

  const isInPlan = isServiceInPlan(service.id);
  const planItem = getItemByServiceId(service.id);
  const currentTier = service.tiers.find(t => t.id === (planItem?.tierId || selectedTier));

  const handleAddToPlan = () => {
    if (isInPlan) {
      removeItem(service.id);
    } else {
      addItem(service.id, selectedTier);
    }
  };

  const handleTierSelect = (tierId: 'essential' | 'pro' | 'enterprise') => {
    setSelectedTier(tierId);
    if (isInPlan) {
      addItem(service.id, tierId);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`
        card p-6 overflow-hidden
        ${isInPlan ? 'border-[var(--accent-orange)] bg-[var(--bg-card-hover)]' : ''}
      `}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xl font-semibold text-white font-serif">{service.name}</h3>
            {isInPlan && (
              <span className="px-2 py-0.5 bg-[var(--accent-orange)] text-black text-xs font-medium rounded-full">
                In Plan
              </span>
            )}
          </div>
          <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
            {service.description}
          </p>
        </div>
      </div>

      {/* Tier Selection */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {service.tiers.map((tier) => {
          const isSelected = (planItem?.tierId || selectedTier) === tier.id;
          return (
            <button
              key={tier.id}
              onClick={() => handleTierSelect(tier.id)}
              className={`
                relative p-3 rounded-lg text-center transition-all duration-300
                ${isSelected
                  ? 'bg-gradient-to-br from-[var(--accent-purple)] to-[var(--accent-pink)] text-white'
                  : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)] hover:text-white border border-[var(--border-subtle)]'
                }
              `}
            >
              {tier.popular && (
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2 py-0.5 bg-[var(--accent-orange)] text-black text-[10px] font-bold rounded-full">
                  <Star className="w-2.5 h-2.5" fill="currentColor" />
                  POPULAR
                </div>
              )}
              <div className="text-xs font-medium mb-1">{tier.name}</div>
              <div className="text-lg font-bold">${tier.price.toLocaleString()}</div>
            </button>
          );
        })}
      </div>

      {/* Current Tier Info */}
      {currentTier && (
        <div className="mb-4 p-3 bg-[var(--bg-secondary)] rounded-lg">
          <div className="flex justify-between items-center text-sm">
            <span className="text-[var(--text-muted)]">Best for:</span>
            <span className="text-[var(--text-secondary)]">{currentTier.bestFor}</span>
          </div>
          <div className="flex justify-between items-center text-sm mt-1">
            <span className="text-[var(--text-muted)]">Outcome:</span>
            <span className="text-[var(--accent-purple)]">{currentTier.outcome}</span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <motion.button
          onClick={handleAddToPlan}
          className={`
            flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all
            ${isInPlan
              ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'
              : 'btn-primary'
            }
          `}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isInPlan ? (
            <>
              <Minus className="w-4 h-4" />
              Remove
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              Add to Plan
            </>
          )}
        </motion.button>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-4 py-3 rounded-lg border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--accent-purple)] hover:text-white transition-all"
        >
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {/* Expanded Features */}
      <AnimatePresence>
        {isExpanded && currentTier && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pt-4 mt-4 border-t border-[var(--border-subtle)]">
              <h4 className="text-sm font-semibold text-white mb-3">Features Included:</h4>
              <ul className="space-y-2">
                {currentTier.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <span className={`mt-0.5 ${feature.included === true ? 'text-green-400' : feature.included === 'addon' ? 'text-[var(--accent-orange)]' : 'text-[var(--text-muted)]'}`}>
                      {feature.included === true ? (
                        <Check className="w-4 h-4" />
                      ) : feature.included === 'addon' ? (
                        <Plus className="w-4 h-4" />
                      ) : (
                        <Minus className="w-4 h-4" />
                      )}
                    </span>
                    <span className="text-[var(--text-secondary)]">
                      <span className="text-white">{feature.name}:</span>{' '}
                      {typeof feature.value === 'boolean'
                        ? (feature.value ? 'Included' : 'Not included')
                        : feature.value
                      }
                    </span>
                  </li>
                ))}
              </ul>

              {/* Add-ons */}
              {service.addOns.length > 0 && isInPlan && (
                <div className="mt-4 pt-4 border-t border-[var(--border-subtle)]">
                  <h4 className="text-sm font-semibold text-white mb-3">Available Add-ons:</h4>
                  <div className="space-y-2">
                    {service.addOns.map((addOn) => {
                      const isAdded = planItem?.addOns.includes(addOn.id);
                      return (
                        <button
                          key={addOn.id}
                          onClick={() => toggleAddOn(service.id, addOn.id)}
                          className={`
                            w-full flex items-center justify-between p-3 rounded-lg transition-all
                            ${isAdded
                              ? 'bg-[var(--accent-orange)]/20 border border-[var(--accent-orange)]'
                              : 'bg-[var(--bg-secondary)] border border-[var(--border-subtle)] hover:border-[var(--accent-purple)]'
                            }
                          `}
                        >
                          <span className="flex items-center gap-2">
                            {isAdded ? (
                              <Check className="w-4 h-4 text-[var(--accent-orange)]" />
                            ) : (
                              <Plus className="w-4 h-4 text-[var(--text-muted)]" />
                            )}
                            <span className={isAdded ? 'text-white' : 'text-[var(--text-secondary)]'}>
                              {addOn.name}
                            </span>
                          </span>
                          <span className="text-[var(--accent-purple)] font-medium">
                            +${addOn.price}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
