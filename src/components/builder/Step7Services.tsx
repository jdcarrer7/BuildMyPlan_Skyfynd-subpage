'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBuilderStore } from '@/hooks/useBuilderStore';
import { additionalServices } from '@/data/websiteBuilder';
import { Check, Plus, Info, X, RefreshCw } from 'lucide-react';

export default function Step6Services() {
  const { selectedServices, toggleService, isServiceSelected } = useBuilderStore();
  const [tooltipId, setTooltipId] = useState<string | null>(null);

  const selectedTooltip = tooltipId
    ? additionalServices.find(s => s.id === tooltipId)
    : null;

  return (
    <div className="card p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-white font-serif mb-2">
          Additional Services
        </h2>
        <p className="text-[var(--text-secondary)]">
          Enhance your website with these complementary services.
        </p>
        <p className="text-sm text-[var(--text-muted)] mt-2">
          {selectedServices.length} service{selectedServices.length !== 1 ? 's' : ''} selected
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {additionalServices.map((service) => {
          const isSelected = isServiceSelected(service.id);

          return (
            <motion.div
              key={service.id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div
                className={`
                  w-full p-4 rounded-lg text-left transition-all duration-300 relative
                  ${isSelected
                    ? 'bg-[var(--accent-blue)]/10 border-2 border-[var(--accent-blue)]'
                    : 'bg-[var(--bg-secondary)] border border-[var(--border-subtle)] hover:border-[var(--accent-blue)]/50'
                  }
                `}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleService(service.id)}
                    className={`
                      w-6 h-6 rounded border-2 flex items-center justify-center transition-all shrink-0 mt-0.5
                      ${isSelected
                        ? 'border-[var(--accent-blue)] bg-[var(--accent-blue)]'
                        : 'border-[var(--border-subtle)]'
                      }
                    `}
                  >
                    {isSelected ? (
                      <Check className="w-4 h-4 text-white" />
                    ) : (
                      <Plus className="w-4 h-4 text-[var(--text-muted)]" />
                    )}
                  </button>

                  <button
                    onClick={() => toggleService(service.id)}
                    className="flex-1 min-w-0 text-left"
                  >
                    <div className="flex items-center gap-2">
                      <h3 className={`font-medium ${isSelected ? 'text-white' : 'text-[var(--text-secondary)]'}`}>
                        {service.label}
                      </h3>
                      {service.recurring && (
                        <div className="flex items-center gap-1 text-xs text-[var(--accent-orange)]">
                          <RefreshCw className="w-3 h-3" />
                          Monthly
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <span className={`font-semibold ${isSelected ? 'text-[var(--accent-blue)]' : 'text-[var(--text-secondary)]'}`}>
                        {service.startsAt && <span className="text-xs font-normal">from </span>}
                        ${service.price}
                        {service.recurring && <span className="text-sm font-normal">/mo</span>}
                      </span>
                    </div>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setTooltipId(tooltipId === service.id ? null : service.id);
                    }}
                    className="p-1 rounded-full hover:bg-[var(--accent-blue)]/20 transition-colors shrink-0"
                  >
                    <Info className="w-4 h-4 text-[var(--text-muted)]" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {selectedTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-4 p-4 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg"
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold text-white mb-1">{selectedTooltip.label}</h4>
                <p className="text-sm text-[var(--text-secondary)]">{selectedTooltip.tooltip}</p>
              </div>
              <button
                onClick={() => setTooltipId(null)}
                className="text-[var(--text-muted)] hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
