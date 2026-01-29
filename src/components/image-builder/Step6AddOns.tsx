'use client';

import { motion } from 'framer-motion';
import { useImageBuilderStore } from '@/hooks/useImageBuilderStore';
import { backgroundOptions, overlayOptions, sizeOptions, revisionOptions } from '@/data/imageBuilder';
import { Check, HelpCircle, ImageIcon, Type, Maximize, RefreshCw } from 'lucide-react';
import { useState } from 'react';

export default function Step6AddOns() {
  const {
    background, setBackground,
    overlay, setOverlay,
    sizes, setSizes,
    revisions, setRevisions,
  } = useImageBuilderStore();

  const [tooltipOpen, setTooltipOpen] = useState<string | null>(null);

  const categories = [
    {
      id: 'background',
      label: 'Background',
      icon: ImageIcon,
      options: backgroundOptions,
      value: background,
      setValue: setBackground,
    },
    {
      id: 'overlay',
      label: 'Text & Graphics Overlay',
      icon: Type,
      options: overlayOptions,
      value: overlay,
      setValue: setOverlay,
    },
    {
      id: 'sizes',
      label: 'Size Variations',
      icon: Maximize,
      options: sizeOptions,
      value: sizes,
      setValue: setSizes,
    },
    {
      id: 'revisions',
      label: 'Revisions',
      icon: RefreshCw,
      options: revisionOptions,
      value: revisions,
      setValue: setRevisions,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-white mb-2">Select any additional features you need</h2>
        <p className="text-[var(--text-secondary)]">
          Customize your image package with these optional enhancements.
        </p>
      </div>

      {categories.map((category) => {
        const Icon = category.icon;

        return (
          <div key={category.id} className="space-y-4">
            <div className="flex items-center gap-2">
              <Icon className="w-5 h-5 text-[var(--accent-blue)]" />
              <h3 className="text-lg font-medium text-white">{category.label}</h3>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {category.options.map((option) => {
                const isSelected = category.value === option.id;
                const tooltipId = `${category.id}-${option.id}`;
                const optionWithTooltip = option as { tooltip?: { whatItIs?: string; idealIf?: string; examples?: string } };

                return (
                  <div key={option.id} className="relative">
                    <motion.button
                      onClick={() => category.setValue(option.id)}
                      className={`
                        w-full p-3 rounded-lg text-left transition-all group
                        ${isSelected
                          ? 'bg-gradient-to-br from-[var(--accent-blue)]/20 to-[var(--accent-teal)]/20 border-2 border-[var(--accent-blue)]'
                          : 'bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--accent-blue)]/50'
                        }
                      `}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-start justify-between mb-1">
                        <span className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-[var(--text-secondary)] group-hover:text-white'}`}>
                          {option.label}
                        </span>
                        <div className="flex items-center gap-1">
                          {isSelected && (
                            <div className="w-4 h-4 rounded-full bg-[var(--accent-blue)] flex items-center justify-center">
                              <Check className="w-2.5 h-2.5 text-white" />
                            </div>
                          )}
                          {optionWithTooltip.tooltip && (
                            <span
                              className="p-0.5 text-[var(--text-muted)] hover:text-[var(--accent-blue)] transition-colors cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                setTooltipOpen(tooltipOpen === tooltipId ? null : tooltipId);
                              }}
                            >
                              <HelpCircle className="w-4 h-4" />
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        {'included' in option && option.included ? (
                          <span className="text-sm text-green-400">Included</span>
                        ) : option.price === 0 ? (
                          <span className="text-sm text-[var(--text-muted)]">$0</span>
                        ) : 'startsAt' in option && option.startsAt ? (
                          <span className="text-sm font-medium gradient-text">${option.price}+</span>
                        ) : (
                          <span className="text-sm font-medium gradient-text">+${option.price}</span>
                        )}
                      </div>
                    </motion.button>

                    {/* Tooltip - Outside the button */}
                    {tooltipOpen === tooltipId && optionWithTooltip.tooltip && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute right-0 top-full mt-2 z-50 w-72 p-4 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-lg shadow-xl"
                      >
                        <button
                          onClick={() => setTooltipOpen(null)}
                          className="absolute top-2 right-2 text-[var(--text-muted)] hover:text-white text-xl leading-none"
                        >
                          &times;
                        </button>
                        <div className="space-y-3 text-sm">
                          {optionWithTooltip.tooltip.whatItIs && (
                            <div>
                              <span className="text-[var(--accent-blue)] font-medium">What it is:</span>
                              <p className="text-[var(--text-secondary)] mt-1">{optionWithTooltip.tooltip.whatItIs}</p>
                            </div>
                          )}
                          {optionWithTooltip.tooltip.idealIf && (
                            <div>
                              <span className="text-[var(--accent-teal)] font-medium">Ideal if:</span>
                              <p className="text-[var(--text-secondary)] mt-1">{optionWithTooltip.tooltip.idealIf}</p>
                            </div>
                          )}
                          {optionWithTooltip.tooltip.examples && (
                            <div>
                              <span className="text-[var(--accent-orange)] font-medium">Examples:</span>
                              <p className="text-[var(--text-secondary)] mt-1">{optionWithTooltip.tooltip.examples}</p>
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
        );
      })}
    </div>
  );
}
