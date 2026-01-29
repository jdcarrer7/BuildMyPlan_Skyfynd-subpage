'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Service } from '@/data/services';
import { X, Check, Minus, Plus } from 'lucide-react';

interface ComparisonModalProps {
  service: Service;
  isOpen: boolean;
  onClose: () => void;
}

export default function ComparisonModal({ service, isOpen, onClose }: ComparisonModalProps) {
  // Get all unique feature names from all tiers
  const allFeatureNames = service.tiers[0].features.map(f => f.name);

  const renderFeatureValue = (value: string | boolean, included: boolean | 'addon') => {
    if (included === false) {
      return (
        <span className="flex items-center justify-center">
          <Minus className="w-5 h-5 text-[var(--text-muted)]" />
        </span>
      );
    }

    if (included === 'addon') {
      return (
        <span className="flex items-center justify-center gap-1 text-[var(--accent-orange)] text-sm">
          <Plus className="w-4 h-4" />
          Add-on
        </span>
      );
    }

    if (typeof value === 'boolean') {
      return (
        <span className="flex items-center justify-center">
          <Check className="w-5 h-5 text-green-400" />
        </span>
      );
    }

    return (
      <span className="text-white text-sm text-center">{value}</span>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-4 md:inset-8 lg:inset-16 z-50 flex items-center justify-center"
          >
            <div className="w-full max-w-5xl max-h-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-[var(--border-subtle)]">
                <div>
                  <h2 className="text-2xl font-bold text-white font-serif">
                    Compare {service.name} Plans
                  </h2>
                  <p className="text-[var(--text-secondary)] text-sm mt-1">
                    {service.description}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-[var(--text-muted)] hover:text-white hover:bg-[var(--bg-card)] rounded-lg transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Comparison Table */}
              <div className="flex-1 overflow-auto p-6">
                <div className="min-w-[600px]">
                  {/* Tier Headers */}
                  <div className="grid grid-cols-4 gap-4 mb-4 sticky top-0 bg-[var(--bg-elevated)] pb-4 z-10">
                    <div className="text-[var(--text-muted)] text-sm font-medium">Features</div>
                    {service.tiers.map((tier) => (
                      <div
                        key={tier.id}
                        className={`text-center p-4 rounded-xl ${
                          tier.popular
                            ? 'bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-teal)]'
                            : 'bg-[var(--bg-card)] border border-[var(--border-subtle)]'
                        }`}
                      >
                        {tier.popular && (
                          <span className="inline-block px-2 py-0.5 bg-white/20 text-white text-[10px] font-bold rounded-full mb-2">
                            MOST POPULAR
                          </span>
                        )}
                        <h3 className="text-xl font-bold text-white">{tier.name}</h3>
                        <div className="text-[10px] text-white/60 uppercase tracking-wide mt-1">starting at</div>
                        <div className="text-2xl font-bold text-white">
                          ${tier.price.toLocaleString()}
                        </div>
                        <p className="text-xs text-white/70 mt-2 line-clamp-2">{tier.bestFor}</p>
                      </div>
                    ))}
                  </div>

                  {/* Feature Rows */}
                  <div className="space-y-1">
                    {allFeatureNames.map((featureName, idx) => (
                      <div
                        key={featureName}
                        className={`grid grid-cols-4 gap-4 py-3 px-4 rounded-lg ${
                          idx % 2 === 0 ? 'bg-[var(--bg-card)]/50' : ''
                        }`}
                      >
                        <div className="text-[var(--text-secondary)] text-sm flex items-center">
                          {featureName}
                        </div>
                        {service.tiers.map((tier) => {
                          const feature = tier.features.find(f => f.name === featureName);
                          if (!feature) return <div key={tier.id} />;
                          return (
                            <div key={tier.id} className="flex items-center justify-center">
                              {renderFeatureValue(feature.value, feature.included)}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>

                  {/* Outcome Row */}
                  <div className="grid grid-cols-4 gap-4 mt-6 pt-4 border-t border-[var(--border-subtle)]">
                    <div className="text-[var(--text-muted)] text-sm font-medium flex items-center">
                      Outcome
                    </div>
                    {service.tiers.map((tier) => (
                      <div key={tier.id} className="text-center">
                        <span className="text-[var(--accent-blue)] text-sm font-medium">
                          {tier.outcome}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-[var(--border-subtle)] bg-[var(--bg-card)]/50">
                <div className="flex items-center justify-between">
                  <p className="text-[var(--text-muted)] text-sm">
                    Select a tier from the service card to add it to your plan.
                  </p>
                  <button
                    onClick={onClose}
                    className="btn-secondary"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
