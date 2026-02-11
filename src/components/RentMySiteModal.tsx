'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Minus, Star } from 'lucide-react';
import { getServiceById } from '@/data/services';
import { usePlanStore } from '@/hooks/usePlanStore';

interface RentMySiteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RentMySiteModal({ isOpen, onClose }: RentMySiteModalProps) {
  const [selectedTier, setSelectedTier] = useState<'essential' | 'pro' | 'enterprise' | null>(null);
  const { addItem, isServiceInPlan } = usePlanStore();

  const service = getServiceById('website-rental');
  if (!service) return null;

  const isAlreadyInPlan = isServiceInPlan('website-rental');

  const handleAdd = () => {
    if (!selectedTier) return;
    addItem('website-rental', selectedTier);
    onClose();
    setSelectedTier(null);
  };

  const handleClose = () => {
    onClose();
    setSelectedTier(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[var(--border-subtle)]">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 bg-gradient-to-r from-[var(--accent-orange)] to-[var(--accent-pink)] text-white text-[10px] font-bold rounded-full uppercase tracking-wider">
                    New Service
                  </span>
                </div>
                <h2 className="text-2xl font-semibold text-white font-serif">Rent Me a Site</h2>
                <p className="text-sm text-[var(--text-secondary)] mt-1">
                  Monthly subscription — we build, host, and maintain your site.
                </p>
              </div>
              <button
                onClick={handleClose}
                className="p-2 rounded-lg text-[var(--text-muted)] hover:text-white hover:bg-[var(--bg-secondary)] transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tiers */}
            <div className="p-6">
              <div className="grid md:grid-cols-3 gap-4">
                {service.tiers.map((tier) => {
                  const isSelected = selectedTier === tier.id;
                  return (
                    <motion.button
                      key={tier.id}
                      onClick={() => setSelectedTier(tier.id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`
                        relative p-5 rounded-xl text-left transition-all duration-300
                        ${isSelected
                          ? 'bg-gradient-to-br from-[var(--accent-purple)]/20 to-[var(--accent-pink)]/10 border-2 border-[var(--accent-purple)] shadow-[0_0_30px_rgba(167,139,250,0.15)]'
                          : 'bg-[var(--bg-secondary)]/60 border border-[var(--border-subtle)] hover:border-[var(--accent-purple)]/40'
                        }
                      `}
                    >
                      {tier.popular && (
                        <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2.5 py-0.5 bg-gradient-to-r from-[var(--accent-orange)] to-[var(--accent-gold)] text-[#09090b] text-[9px] font-bold rounded-full uppercase tracking-wider">
                          <Star className="w-2.5 h-2.5" fill="currentColor" />
                          Popular
                        </div>
                      )}

                      <div className="mb-3">
                        <h3 className={`text-lg font-semibold ${isSelected ? 'text-white' : 'text-[var(--text-secondary)]'}`}>
                          {tier.name}
                        </h3>
                        <div className="flex items-baseline gap-1 mt-1">
                          <span className={`text-3xl font-bold ${isSelected ? 'gradient-text' : 'text-white'}`}>
                            ${tier.price}
                          </span>
                          <span className="text-sm text-[var(--text-muted)]">/mo</span>
                        </div>
                      </div>

                      <p className="text-xs text-[var(--text-muted)] mb-4">{tier.bestFor}</p>

                      <ul className="space-y-2">
                        {tier.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs">
                            <span className={`mt-0.5 shrink-0 ${feature.included === true ? 'text-emerald-400' : 'text-[var(--text-muted)]/40'}`}>
                              {feature.included === true ? (
                                <Check className="w-3.5 h-3.5" />
                              ) : (
                                <Minus className="w-3.5 h-3.5" />
                              )}
                            </span>
                            <span className={feature.included === true ? 'text-[var(--text-secondary)]' : 'text-[var(--text-muted)]/50'}>
                              {feature.name}{typeof feature.value === 'string' ? `: ${feature.value}` : ''}
                            </span>
                          </li>
                        ))}
                      </ul>

                      {/* Selection indicator */}
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[var(--accent-purple)] flex items-center justify-center"
                        >
                          <Check className="w-3.5 h-3.5 text-white" />
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Footer with Add button */}
            <div className="p-6 border-t border-[var(--border-subtle)] flex items-center justify-between">
              <div className="text-sm text-[var(--text-muted)]">
                {selectedTier
                  ? `Selected: ${service.tiers.find(t => t.id === selectedTier)?.name} — $${service.tiers.find(t => t.id === selectedTier)?.price}/mo`
                  : 'Select a plan to continue'
                }
              </div>
              <motion.button
                onClick={handleAdd}
                disabled={!selectedTier || isAlreadyInPlan}
                whileHover={selectedTier && !isAlreadyInPlan ? { scale: 1.02 } : {}}
                whileTap={selectedTier && !isAlreadyInPlan ? { scale: 0.98 } : {}}
                className={`
                  px-8 py-3 rounded-xl font-semibold transition-all duration-300
                  ${selectedTier && !isAlreadyInPlan
                    ? 'btn-primary cursor-pointer'
                    : 'bg-[var(--bg-secondary)] text-[var(--text-muted)] cursor-not-allowed border border-[var(--border-subtle)]'
                  }
                `}
              >
                {isAlreadyInPlan ? 'Already in Plan' : 'Add to Plan'}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
