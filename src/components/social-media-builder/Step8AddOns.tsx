'use client';

import { motion } from 'framer-motion';
import { useSocialMediaBuilderStore } from '@/hooks/useSocialMediaBuilderStore';
import { storiesOptions, reelsOptions, additionalServicesOptions } from '@/data/socialMediaBuilder';
import { Check, HelpCircle, X, Plus } from 'lucide-react';
import { useState } from 'react';

export default function Step8AddOns() {
  const {
    stories,
    setStories,
    reels,
    setReels,
    selectedAdditionalAddOns,
    toggleAdditionalAddOn,
  } = useSocialMediaBuilderStore();
  const [tooltipOpen, setTooltipOpen] = useState<string | null>(null);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-white mb-2">Enhance your social media presence</h2>
        <p className="text-[var(--text-secondary)]">
          Add Stories, Reels, and other services to maximize engagement.
        </p>
      </div>

      {/* Stories Management Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">Stories Management</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {storiesOptions.map((option) => {
            const isSelected = stories === option.id;

            return (
              <div key={option.id} className="relative">
                <motion.button
                  onClick={() => setStories(option.id)}
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
                          setTooltipOpen(tooltipOpen === `stories-${option.id}` ? null : `stories-${option.id}`);
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

                {/* Tooltip */}
                {tooltipOpen === `stories-${option.id}` && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 top-full mt-2 z-50 w-80 p-4 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-lg shadow-xl"
                  >
                    <button
                      onClick={() => setTooltipOpen(null)}
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

      {/* Reels / Short-Form Video Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">Reels / Short-Form Video</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {reelsOptions.map((option) => {
            const isSelected = reels === option.id;

            return (
              <div key={option.id} className="relative">
                <motion.button
                  onClick={() => setReels(option.id)}
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
                          setTooltipOpen(tooltipOpen === `reels-${option.id}` ? null : `reels-${option.id}`);
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
                        {option.startsAt && <span className="text-sm text-[var(--text-muted)] font-normal">starts at </span>}
                        +${option.price}
                        <span className="text-sm text-[var(--text-muted)] font-normal">/mo</span>
                      </>
                    )}
                  </div>
                </motion.button>

                {/* Tooltip */}
                {tooltipOpen === `reels-${option.id}` && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 top-full mt-2 z-50 w-80 p-4 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-lg shadow-xl"
                  >
                    <button
                      onClick={() => setTooltipOpen(null)}
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
            const isSelected = selectedAdditionalAddOns.some((addon) => addon.id === option.id);

            return (
              <div key={option.id} className="relative">
                <motion.button
                  onClick={() => toggleAdditionalAddOn(option.id)}
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
                          setTooltipOpen(tooltipOpen === `additional-${option.id}` ? null : `additional-${option.id}`);
                        }}
                      >
                        <HelpCircle className="w-5 h-5" />
                      </span>
                    </div>
                  </div>

                  <div className="text-lg font-semibold gradient-text">
                    +${option.price}
                    {option.oneTime ? (
                      <span className="text-sm text-[var(--text-muted)] font-normal ml-1">one-time</span>
                    ) : (
                      <span className="text-sm text-[var(--text-muted)] font-normal">/mo</span>
                    )}
                  </div>
                </motion.button>

                {/* Tooltip */}
                {tooltipOpen === `additional-${option.id}` && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 top-full mt-2 z-50 w-80 p-4 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-lg shadow-xl"
                  >
                    <button
                      onClick={() => setTooltipOpen(null)}
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
      {(stories !== 'none' || reels !== 'none' || selectedAdditionalAddOns.length > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-lg"
        >
          <p className="text-sm text-[var(--text-secondary)]">
            <span className="text-white font-medium">Add-ons selected:</span>
            {stories !== 'none' && (
              <span className="ml-2 px-2 py-1 bg-[var(--accent-blue)]/20 rounded text-[var(--accent-blue)] text-xs">
                Stories
              </span>
            )}
            {reels !== 'none' && (
              <span className="ml-2 px-2 py-1 bg-[var(--accent-teal)]/20 rounded text-[var(--accent-teal)] text-xs">
                Reels
              </span>
            )}
            {selectedAdditionalAddOns.length > 0 && (
              <span className="ml-2 px-2 py-1 bg-[var(--accent-orange)]/20 rounded text-[var(--accent-orange)] text-xs">
                {selectedAdditionalAddOns.length} additional service{selectedAdditionalAddOns.length > 1 ? 's' : ''}
              </span>
            )}
          </p>
        </motion.div>
      )}
    </div>
  );
}
