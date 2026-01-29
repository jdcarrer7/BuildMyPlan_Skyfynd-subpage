'use client';

import { motion } from 'framer-motion';
import { useEmailMarketingBuilderStore } from '@/hooks/useEmailMarketingBuilderStore';
import { testingOptions, platformOptions, additionalServicesOptions } from '@/data/emailMarketingBuilder';
import { Check, HelpCircle, X, Plus } from 'lucide-react';
import { useState } from 'react';

export default function Step9AddOns() {
  const {
    testing,
    setTesting,
    platform,
    setPlatform,
    selectedAdditionalServices,
    toggleAdditionalService,
  } = useEmailMarketingBuilderStore();
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-white mb-2">Enhance your email marketing program</h2>
        <p className="text-[var(--text-secondary)]">
          Add testing, platform management, and additional services to maximize your results.
        </p>
      </div>

      {/* A/B Testing Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">A/B Testing</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          {testingOptions.map((option) => {
            const isSelected = testing === option.id;

            return (
              <div key={option.id} className="relative">
                <motion.button
                  onClick={() => setTesting(option.id)}
                  className={`
                    w-full p-4 rounded-xl text-left transition-all group
                    ${isSelected
                      ? 'bg-gradient-to-br from-[var(--accent-blue)]/20 to-[var(--accent-teal)]/20 border-2 border-[var(--accent-blue)]'
                      : 'bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--accent-blue)]/50'
                    }
                  `}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className={`font-medium ${isSelected ? 'text-white' : 'text-[var(--text-secondary)] group-hover:text-white'}`}>
                      {option.label}
                    </span>
                    <div className="flex items-center gap-2">
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-[var(--accent-blue)] flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                      <span
                        className="p-1 text-[var(--text-muted)] hover:text-[var(--accent-blue)] transition-colors cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveTooltip(activeTooltip === `testing-${option.id}` ? null : `testing-${option.id}`);
                        }}
                      >
                        <HelpCircle className="w-5 h-5" />
                      </span>
                    </div>
                  </div>

                  <div className="text-lg font-semibold gradient-text">
                    {option.price === 0 ? (
                      <span className="text-[var(--text-muted)]">Not included</span>
                    ) : (
                      <>
                        +${option.price}
                        <span className="text-sm text-[var(--text-muted)] font-normal">/mo</span>
                      </>
                    )}
                  </div>
                </motion.button>

                {/* Tooltip - Outside the button */}
                {activeTooltip === `testing-${option.id}` && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 top-full mt-2 z-50 w-80 p-4 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-lg shadow-xl"
                  >
                    <button
                      onClick={() => setActiveTooltip(null)}
                      className="absolute top-2 right-2 text-[var(--text-muted)] hover:text-white transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="text-[var(--accent-blue)] font-medium">What it is:</span>
                        <p className="text-[var(--text-secondary)] mt-1">{option.tooltip.whatItIs}</p>
                      </div>
                      <div>
                        <span className="text-[var(--accent-teal)] font-medium">Ideal if:</span>
                        <p className="text-[var(--text-secondary)] mt-1">{option.tooltip.idealIf}</p>
                      </div>
                      {option.tooltip.examples && (
                        <div>
                          <span className="text-[var(--accent-orange)] font-medium">Examples:</span>
                          <p className="text-[var(--text-secondary)] mt-1">{option.tooltip.examples}</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Platform Management Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">Platform Management</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          {platformOptions.map((option) => {
            const isSelected = platform === option.id;

            return (
              <div key={option.id} className="relative">
                <motion.button
                  onClick={() => setPlatform(option.id)}
                  className={`
                    w-full p-4 rounded-xl text-left transition-all group
                    ${isSelected
                      ? 'bg-gradient-to-br from-[var(--accent-blue)]/20 to-[var(--accent-teal)]/20 border-2 border-[var(--accent-blue)]'
                      : 'bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--accent-blue)]/50'
                    }
                  `}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className={`font-medium ${isSelected ? 'text-white' : 'text-[var(--text-secondary)] group-hover:text-white'}`}>
                      {option.label}
                    </span>
                    <div className="flex items-center gap-2">
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-[var(--accent-blue)] flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                      <span
                        className="p-1 text-[var(--text-muted)] hover:text-[var(--accent-blue)] transition-colors cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveTooltip(activeTooltip === `platform-${option.id}` ? null : `platform-${option.id}`);
                        }}
                      >
                        <HelpCircle className="w-5 h-5" />
                      </span>
                    </div>
                  </div>

                  <div className="text-lg font-semibold gradient-text">
                    {option.price === 0 ? (
                      <span className="text-[var(--text-muted)]">Client manages</span>
                    ) : (
                      <>
                        +${option.price}
                        <span className="text-sm text-[var(--text-muted)] font-normal">/mo</span>
                      </>
                    )}
                  </div>
                </motion.button>

                {/* Tooltip - Outside the button */}
                {activeTooltip === `platform-${option.id}` && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 top-full mt-2 z-50 w-80 p-4 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-lg shadow-xl"
                  >
                    <button
                      onClick={() => setActiveTooltip(null)}
                      className="absolute top-2 right-2 text-[var(--text-muted)] hover:text-white transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="text-[var(--accent-blue)] font-medium">What it is:</span>
                        <p className="text-[var(--text-secondary)] mt-1">{option.tooltip.whatItIs}</p>
                      </div>
                      <div>
                        <span className="text-[var(--accent-teal)] font-medium">Ideal if:</span>
                        <p className="text-[var(--text-secondary)] mt-1">{option.tooltip.idealIf}</p>
                      </div>
                      {option.tooltip.examples && (
                        <div>
                          <span className="text-[var(--accent-orange)] font-medium">Examples:</span>
                          <p className="text-[var(--text-secondary)] mt-1">{option.tooltip.examples}</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Additional Services Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">Additional Services</h3>
        <p className="text-sm text-[var(--text-muted)]">(Select multiple)</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {additionalServicesOptions.map((option) => {
            const isSelected = selectedAdditionalServices.some((s) => s.id === option.id);

            return (
              <div key={option.id} className="relative">
                <motion.button
                  onClick={() => toggleAdditionalService(option.id)}
                  className={`
                    w-full p-4 rounded-xl text-left transition-all group
                    ${isSelected
                      ? 'bg-gradient-to-br from-[var(--accent-blue)]/20 to-[var(--accent-teal)]/20 border-2 border-[var(--accent-blue)]'
                      : 'bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--accent-blue)]/50'
                    }
                  `}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className={`font-medium ${isSelected ? 'text-white' : 'text-[var(--text-secondary)] group-hover:text-white'}`}>
                      {option.label}
                    </span>
                    <div className="flex items-center gap-2">
                      {isSelected ? (
                        <div className="w-5 h-5 rounded-full bg-[var(--accent-blue)] flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-[var(--border-subtle)] flex items-center justify-center group-hover:border-[var(--accent-blue)]/50">
                          <Plus className="w-3 h-3 text-[var(--text-muted)] group-hover:text-[var(--accent-blue)]" />
                        </div>
                      )}
                      <span
                        className="p-1 text-[var(--text-muted)] hover:text-[var(--accent-blue)] transition-colors cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveTooltip(activeTooltip === `additional-${option.id}` ? null : `additional-${option.id}`);
                        }}
                      >
                        <HelpCircle className="w-5 h-5" />
                      </span>
                    </div>
                  </div>

                  <div className="text-lg font-semibold gradient-text">
                    {option.startsAt && <span className="text-sm text-[var(--text-muted)] font-normal">starts at </span>}
                    +${option.price}
                    {option.oneTime ? (
                      <span className="text-sm text-[var(--text-muted)] font-normal ml-1">one-time</span>
                    ) : option.recurring === 'monthly' ? (
                      <span className="text-sm text-[var(--text-muted)] font-normal">/mo</span>
                    ) : null}
                  </div>
                </motion.button>

                {/* Tooltip - Outside the button */}
                {activeTooltip === `additional-${option.id}` && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 top-full mt-2 z-50 w-80 p-4 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-lg shadow-xl"
                  >
                    <button
                      onClick={() => setActiveTooltip(null)}
                      className="absolute top-2 right-2 text-[var(--text-muted)] hover:text-white transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="text-[var(--accent-blue)] font-medium">What it is:</span>
                        <p className="text-[var(--text-secondary)] mt-1">{option.tooltip.whatItIs}</p>
                      </div>
                      <div>
                        <span className="text-[var(--accent-teal)] font-medium">Ideal if:</span>
                        <p className="text-[var(--text-secondary)] mt-1">{option.tooltip.idealIf}</p>
                      </div>
                      {option.tooltip.examples && (
                        <div>
                          <span className="text-[var(--accent-orange)] font-medium">Examples:</span>
                          <p className="text-[var(--text-secondary)] mt-1">{option.tooltip.examples}</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary of selected add-ons */}
      {(testing !== 'none' || platform !== 'client' || selectedAdditionalServices.length > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-lg"
        >
          <p className="text-sm text-[var(--text-secondary)]">
            <span className="text-white font-medium">Add-ons selected:</span>
            {testing !== 'none' && (
              <span className="ml-2 px-2 py-1 bg-[var(--accent-blue)]/20 rounded text-[var(--accent-blue)] text-xs">
                A/B Testing
              </span>
            )}
            {platform !== 'client' && (
              <span className="ml-2 px-2 py-1 bg-[var(--accent-teal)]/20 rounded text-[var(--accent-teal)] text-xs">
                Platform Mgmt
              </span>
            )}
            {selectedAdditionalServices.length > 0 && (
              <span className="ml-2 px-2 py-1 bg-[var(--accent-orange)]/20 rounded text-[var(--accent-orange)] text-xs">
                {selectedAdditionalServices.length} additional service{selectedAdditionalServices.length > 1 ? 's' : ''}
              </span>
            )}
          </p>
        </motion.div>
      )}
    </div>
  );
}
