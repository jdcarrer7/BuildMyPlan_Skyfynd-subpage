'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePlanStore } from '@/hooks/usePlanStore';
import { getServiceById } from '@/data/services';
import { ShoppingCart, Trash2, Tag, X, ChevronRight, Sparkles } from 'lucide-react';

interface PlanSummaryProps {
  onRequestQuote: () => void;
}

export default function PlanSummary({ onRequestQuote }: PlanSummaryProps) {
  const {
    items,
    subtotal,
    discount,
    discountPercentage,
    total,
    itemCount,
    removeItem,
  } = usePlanStore();

  if (itemCount === 0) {
    return (
      <div className="relative overflow-hidden rounded-2xl p-8 bg-gradient-to-br from-[var(--bg-card)] to-[var(--bg-card-hover)]/50 border border-[var(--border-subtle)]">
        {/* Subtle ambient glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-blue)]/5 to-transparent pointer-events-none" />

        <div className="relative text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-elevated)] flex items-center justify-center border border-[var(--border-subtle)]">
            <ShoppingCart className="w-9 h-9 text-[var(--text-muted)]" />
          </div>
          <h3 className="font-serif mb-3" style={{ fontSize: '24px', fontWeight: 600, lineHeight: 1.25, letterSpacing: '-0.01em', color: '#FAFAFA' }}>Your Plan is Empty</h3>
          <p className="mb-6" style={{ fontSize: '15px', color: '#A1A1AA', lineHeight: 1.5 }}>
            Browse our services and add them to build your custom plan.
          </p>
          <div className="flex items-center justify-center gap-2 text-xs text-[var(--text-muted)]">
            <Sparkles className="w-3.5 h-3.5 text-[var(--accent-blue)]" />
            <span>Bundle 3+ services for discounts</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      layout
      className="relative overflow-hidden rounded-2xl p-6 lg:p-7 bg-gradient-to-br from-[var(--bg-card)] to-[var(--bg-card-hover)]/50 border border-[var(--border-subtle)]"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-serif flex items-center gap-2.5" style={{ fontSize: '24px', fontWeight: 600, lineHeight: 1.25, letterSpacing: '-0.01em', color: '#FAFAFA' }}>
          <ShoppingCart className="w-5 h-5 text-[var(--accent-blue)]" />
          Your Plan
        </h3>
        <span className="px-3 py-1.5 bg-gradient-to-r from-[var(--accent-orange)] to-[var(--accent-gold)] text-[#09090b] text-xs font-semibold rounded-full">
          {itemCount} {itemCount === 1 ? 'service' : 'services'}
        </span>
      </div>

      {/* Discount Badge - Refined */}
      {discountPercentage > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-5 p-4 bg-gradient-to-r from-[var(--accent-blue)]/10 to-[var(--accent-teal)]/10 rounded-xl border border-[var(--accent-blue)]/20"
        >
          <div className="flex items-center gap-3 text-sm">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent-blue)]/20 flex items-center justify-center">
              <Tag className="w-4 h-4 text-[var(--accent-blue)]" />
            </div>
            <div className="flex-1">
              <span className="text-white font-medium">Bundle Discount Applied</span>
            </div>
            <span className="text-[var(--accent-orange)] font-bold">{discountPercentage}% OFF</span>
          </div>
        </motion.div>
      )}

      {/* Items List - Refined */}
      <div className="space-y-2.5 mb-6 max-h-[280px] overflow-y-auto pr-1 -mr-1">
        <AnimatePresence mode="popLayout">
          {items.map((item) => {
            const service = getServiceById(item.serviceId);
            if (!service) return null;
            const tier = service.tiers.find(t => t.id === item.tierId);

            return (
              <motion.div
                key={item.serviceId}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-start gap-3 p-3.5 bg-[var(--bg-secondary)]/50 rounded-xl group border border-transparent hover:border-[var(--border-subtle)] transition-all duration-300"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-white font-medium text-sm truncate">{service.name}</h4>
                    <span className="px-2 py-0.5 bg-[var(--bg-card)] text-[var(--text-muted)] text-[10px] rounded-md border border-[var(--border-subtle)]">
                      {tier?.name}
                    </span>
                  </div>
                  {item.addOns.length > 0 && (
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {item.addOns.map(addOnId => {
                        const addOn = service.addOns.find(a => a.id === addOnId);
                        return addOn ? (
                          <span key={addOnId} className="text-[10px] text-[var(--accent-blue)] bg-[var(--accent-blue)]/10 px-2 py-0.5 rounded-md">
                            +{addOn.name}
                          </span>
                        ) : null;
                      })}
                    </div>
                  )}
                </div>
                <div className="text-right flex items-center gap-2.5">
                  <span className="text-white font-semibold">${item.subtotal.toLocaleString()}</span>
                  <button
                    onClick={() => removeItem(item.serviceId)}
                    className="p-1.5 text-[var(--text-muted)] hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Pricing Breakdown - Refined */}
      <div className="space-y-3 py-5 border-t border-[var(--border-subtle)]">
        <div className="flex justify-between text-sm">
          <span className="text-[var(--text-secondary)]">Subtotal</span>
          <span className="text-white">${subtotal.toLocaleString()}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-[var(--accent-blue)]">Bundle Discount ({discountPercentage}%)</span>
            <span className="text-[var(--accent-blue)]">-${discount.toLocaleString()}</span>
          </div>
        )}
        <div className="flex justify-between text-lg font-bold pt-4 border-t border-[var(--border-subtle)]">
          <span className="text-white">Total</span>
          <span className="gradient-text">${total.toLocaleString()}</span>
        </div>
      </div>

      {/* Next Steps Hint - Refined */}
      {itemCount >= 3 && itemCount < 5 && (
        <p className="text-xs text-[var(--text-muted)] mb-5 text-center py-2 px-3 bg-[var(--bg-secondary)]/30 rounded-lg">
          Add {5 - itemCount} more {5 - itemCount === 1 ? 'service' : 'services'} for 15% off
        </p>
      )}
      {itemCount >= 5 && itemCount < 7 && (
        <p className="text-xs text-[var(--text-muted)] mb-5 text-center py-2 px-3 bg-[var(--bg-secondary)]/30 rounded-lg">
          Add {7 - itemCount} more {7 - itemCount === 1 ? 'service' : 'services'} for 20% off
        </p>
      )}

      {/* CTA Button - Refined */}
      <motion.button
        onClick={onRequestQuote}
        className="w-full btn-primary flex items-center justify-center gap-2 py-4"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        Request Quote
        <ChevronRight className="w-4 h-4" />
      </motion.button>

      {/* Clear Plan - Subtle */}
      <button
        onClick={() => usePlanStore.getState().clearPlan()}
        className="w-full mt-4 py-2.5 text-sm text-[var(--text-muted)] hover:text-red-400 transition-colors flex items-center justify-center gap-2 rounded-lg hover:bg-red-500/5"
      >
        <Trash2 className="w-4 h-4" />
        Clear Plan
      </button>
    </motion.div>
  );
}
