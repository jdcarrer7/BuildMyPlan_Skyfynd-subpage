'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePlanStore } from '@/hooks/usePlanStore';
import { getServiceById } from '@/data/services';
import { ShoppingCart, Trash2, Tag, X, ChevronRight } from 'lucide-react';

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
      <div className="card p-6 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center">
          <ShoppingCart className="w-8 h-8 text-[var(--text-muted)]" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">Your Plan is Empty</h3>
        <p className="text-[var(--text-secondary)] text-sm">
          Browse our services and add them to build your custom plan.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      layout
      className="card p-6 sticky top-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white font-serif flex items-center gap-2">
          <ShoppingCart className="w-5 h-5 text-[var(--accent-purple)]" />
          Your Plan
        </h3>
        <span className="px-3 py-1 bg-[var(--accent-orange)] text-black text-sm font-medium rounded-full">
          {itemCount} {itemCount === 1 ? 'service' : 'services'}
        </span>
      </div>

      {/* Discount Badge */}
      {discountPercentage > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 bg-gradient-to-r from-[var(--accent-purple)]/20 to-[var(--accent-pink)]/20 rounded-lg border border-[var(--accent-purple)]/30"
        >
          <div className="flex items-center gap-2 text-sm">
            <Tag className="w-4 h-4 text-[var(--accent-purple)]" />
            <span className="text-white font-medium">Bundle Discount Applied!</span>
            <span className="ml-auto text-[var(--accent-orange)] font-bold">{discountPercentage}% OFF</span>
          </div>
        </motion.div>
      )}

      {/* Items List */}
      <div className="space-y-3 mb-6 max-h-[300px] overflow-y-auto pr-2">
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
                className="flex items-start gap-3 p-3 bg-[var(--bg-secondary)] rounded-lg group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-white font-medium text-sm truncate">{service.name}</h4>
                    <span className="px-2 py-0.5 bg-[var(--bg-card)] text-[var(--text-muted)] text-xs rounded">
                      {tier?.name}
                    </span>
                  </div>
                  {item.addOns.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {item.addOns.map(addOnId => {
                        const addOn = service.addOns.find(a => a.id === addOnId);
                        return addOn ? (
                          <span key={addOnId} className="text-xs text-[var(--accent-purple)]">
                            +{addOn.name}
                          </span>
                        ) : null;
                      })}
                    </div>
                  )}
                </div>
                <div className="text-right flex items-center gap-2">
                  <span className="text-white font-medium">${item.subtotal.toLocaleString()}</span>
                  <button
                    onClick={() => removeItem(item.serviceId)}
                    className="p-1.5 text-[var(--text-muted)] hover:text-red-400 hover:bg-red-500/10 rounded transition-all opacity-0 group-hover:opacity-100"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Pricing Breakdown */}
      <div className="space-y-3 py-4 border-t border-[var(--border-subtle)]">
        <div className="flex justify-between text-sm">
          <span className="text-[var(--text-secondary)]">Subtotal</span>
          <span className="text-white">${subtotal.toLocaleString()}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-[var(--accent-purple)]">Bundle Discount ({discountPercentage}%)</span>
            <span className="text-[var(--accent-purple)]">-${discount.toLocaleString()}</span>
          </div>
        )}
        <div className="flex justify-between text-lg font-bold pt-3 border-t border-[var(--border-subtle)]">
          <span className="text-white">Total</span>
          <span className="gradient-text">${total.toLocaleString()}</span>
        </div>
      </div>

      {/* Next Steps Hint */}
      {itemCount >= 3 && itemCount < 5 && (
        <p className="text-xs text-[var(--text-muted)] mb-4 text-center">
          Add {5 - itemCount} more {5 - itemCount === 1 ? 'service' : 'services'} for 15% off!
        </p>
      )}
      {itemCount >= 5 && itemCount < 7 && (
        <p className="text-xs text-[var(--text-muted)] mb-4 text-center">
          Add {7 - itemCount} more {7 - itemCount === 1 ? 'service' : 'services'} for 20% off!
        </p>
      )}

      {/* CTA Button */}
      <motion.button
        onClick={onRequestQuote}
        className="w-full btn-primary flex items-center justify-center gap-2"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        Request Quote
        <ChevronRight className="w-4 h-4" />
      </motion.button>

      {/* Clear Plan */}
      <button
        onClick={() => usePlanStore.getState().clearPlan()}
        className="w-full mt-3 py-2 text-sm text-[var(--text-muted)] hover:text-red-400 transition-colors flex items-center justify-center gap-2"
      >
        <Trash2 className="w-4 h-4" />
        Clear Plan
      </button>
    </motion.div>
  );
}
