'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useAppBuilderStore } from '@/hooks/useAppBuilderStore';
import { appAdditionalServices } from '@/data/appBuilder';
import { Check, Plus, MessageSquareQuote } from 'lucide-react';

export default function Step9Services() {
  const { selectedServices, toggleService, setServiceOption, getServiceOption, isServiceSelected } = useAppBuilderStore();

  // Separate one-time and recurring services, exclude custom quote services
  const oneTimeServices = appAdditionalServices.filter(s => !s.recurring && !s.customQuote);
  const recurringServices = appAdditionalServices.filter(s => s.recurring);
  const customQuoteServices = appAdditionalServices.filter(s => s.customQuote);

  return (
    <div className="card p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-white font-serif mb-2">
          Additional Services
        </h2>
        <p className="text-[var(--text-secondary)]">
          Enhance your app with professional support services.
        </p>
        <p className="text-sm text-[var(--text-muted)] mt-2">
          {selectedServices.length} service{selectedServices.length !== 1 ? 's' : ''} selected
        </p>
      </div>

      {/* One-time Services */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-[var(--text-muted)] mb-3 uppercase tracking-wide">
          One-Time Services
        </h3>
        <div className="space-y-2">
          {oneTimeServices.map((service) => {
            const isSelected = isServiceSelected(service.id);
            return (
              <motion.button
                key={service.id}
                onClick={() => toggleService(service.id)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className={`
                  w-full p-4 rounded-lg text-left transition-all duration-300 flex items-center justify-between
                  ${isSelected
                    ? 'bg-[var(--accent-blue)]/20 border border-[var(--accent-blue)]'
                    : 'bg-[var(--bg-secondary)] border border-[var(--border-subtle)] hover:border-[var(--accent-blue)]/50'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <div className={`
                    w-6 h-6 rounded border-2 flex items-center justify-center transition-all
                    ${isSelected
                      ? 'border-[var(--accent-blue)] bg-[var(--accent-blue)]'
                      : 'border-[var(--border-subtle)]'
                    }
                  `}>
                    {isSelected ? (
                      <Check className="w-4 h-4 text-white" />
                    ) : (
                      <Plus className="w-4 h-4 text-[var(--text-muted)]" />
                    )}
                  </div>
                  <div>
                    <span className={`font-medium ${isSelected ? 'text-white' : 'text-[var(--text-secondary)]'}`}>
                      {service.label}
                    </span>
                    <p className="text-sm text-[var(--text-muted)]">{service.description || service.tooltip}</p>
                  </div>
                </div>
                {/* Prices hidden from client */}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Recurring Services */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-[var(--text-muted)] mb-3 uppercase tracking-wide">
          Monthly Services
        </h3>
        <div className="space-y-2">
          {recurringServices.map((service) => {
            const isSelected = isServiceSelected(service.id);
            const selectedOptionId = getServiceOption(service.id);
            const hasOptions = service.options && service.options.length > 0;

            return (
              <div key={service.id} className="space-y-2">
                <motion.button
                  onClick={() => toggleService(service.id)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className={`
                    w-full p-4 rounded-lg text-left transition-all duration-300 flex items-center justify-between
                    ${isSelected
                      ? 'bg-[var(--accent-teal)]/20 border border-[var(--accent-teal)]'
                      : 'bg-[var(--bg-secondary)] border border-[var(--border-subtle)] hover:border-[var(--accent-teal)]/50'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div className={`
                      w-6 h-6 rounded border-2 flex items-center justify-center transition-all
                      ${isSelected
                        ? 'border-[var(--accent-teal)] bg-[var(--accent-teal)]'
                        : 'border-[var(--border-subtle)]'
                      }
                    `}>
                      {isSelected ? (
                        <Check className="w-4 h-4 text-white" />
                      ) : (
                        <Plus className="w-4 h-4 text-[var(--text-muted)]" />
                      )}
                    </div>
                    <div>
                      <span className={`font-medium ${isSelected ? 'text-white' : 'text-[var(--text-secondary)]'}`}>
                        {service.label}
                      </span>
                      {!hasOptions && (
                        <p className="text-sm text-[var(--text-muted)]">{service.description || service.tooltip}</p>
                      )}
                      {hasOptions && !isSelected && (
                        <p className="text-sm text-[var(--text-muted)]">{service.tooltip}</p>
                      )}
                    </div>
                  </div>
                  {/* Prices hidden from client */}
                </motion.button>

                {/* Tier dropdown for services with options */}
                <AnimatePresence>
                  {isSelected && hasOptions && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="ml-9 space-y-2 overflow-hidden"
                    >
                      {service.options!.map((option) => {
                        const isOptionSelected = selectedOptionId === option.id;
                        return (
                          <motion.button
                            key={option.id}
                            onClick={() => setServiceOption(service.id, option.id)}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            className={`
                              w-full p-3 rounded-lg text-left transition-all duration-300 flex items-center justify-between
                              ${isOptionSelected
                                ? 'bg-[var(--accent-teal)]/15 border border-[var(--accent-teal)]/60'
                                : 'bg-[var(--bg-secondary)]/60 border border-[var(--border-subtle)] hover:border-[var(--accent-teal)]/30'
                              }
                            `}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`
                                w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all
                                ${isOptionSelected
                                  ? 'border-[var(--accent-teal)] bg-[var(--accent-teal)]'
                                  : 'border-[var(--border-subtle)]'
                                }
                              `}>
                                {isOptionSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                              </div>
                              <div>
                                <span className={`text-sm font-medium ${isOptionSelected ? 'text-white' : 'text-[var(--text-secondary)]'}`}>
                                  {option.label}
                                </span>
                                <p className="text-xs text-[var(--text-muted)]">{option.description}</p>
                              </div>
                            </div>
                            {/* Prices hidden from client */}
                          </motion.button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* Custom Quote Services */}
      {customQuoteServices.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-[var(--text-muted)] mb-3 uppercase tracking-wide">
            Custom Quote
          </h3>
          <div className="space-y-2">
            {customQuoteServices.map((service) => {
              const isSelected = isServiceSelected(service.id);
              return (
                <motion.button
                  key={service.id}
                  onClick={() => toggleService(service.id)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className={`
                    w-full p-4 rounded-lg text-left transition-all duration-300 flex items-center justify-between
                    ${isSelected
                      ? 'bg-[var(--accent-orange)]/20 border border-[var(--accent-orange)]'
                      : 'bg-[var(--bg-secondary)] border border-[var(--border-subtle)] hover:border-[var(--accent-orange)]/50'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div className={`
                      w-6 h-6 rounded border-2 flex items-center justify-center transition-all
                      ${isSelected
                        ? 'border-[var(--accent-orange)] bg-[var(--accent-orange)]'
                        : 'border-[var(--border-subtle)]'
                      }
                    `}>
                      {isSelected ? (
                        <Check className="w-4 h-4 text-white" />
                      ) : (
                        <MessageSquareQuote className="w-4 h-4 text-[var(--text-muted)]" />
                      )}
                    </div>
                    <div>
                      <span className={`font-medium ${isSelected ? 'text-white' : 'text-[var(--text-secondary)]'}`}>
                        {service.label}
                      </span>
                      <p className="text-sm text-[var(--text-muted)]">{service.tooltip}</p>
                    </div>
                  </div>
                  <span className={`font-semibold shrink-0 text-sm ${isSelected ? 'text-[var(--accent-orange)]' : 'text-[var(--accent-orange)]'}`}>
                    Ask for Quote
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
