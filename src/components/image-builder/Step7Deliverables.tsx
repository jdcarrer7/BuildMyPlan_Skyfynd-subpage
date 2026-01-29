'use client';

import { motion } from 'framer-motion';
import { useImageBuilderStore } from '@/hooks/useImageBuilderStore';
import { formatOptions, sourceOptions, licenseOptions } from '@/data/imageBuilder';
import { Check, HelpCircle, FileImage, FolderOpen, Shield } from 'lucide-react';
import { useState } from 'react';

export default function Step7Deliverables() {
  const {
    formats, setFormats,
    source, setSource,
    license, setLicense,
  } = useImageBuilderStore();

  const [tooltipOpen, setTooltipOpen] = useState<string | null>(null);

  const categories = [
    {
      id: 'formats',
      label: 'File Formats',
      icon: FileImage,
      options: formatOptions,
      value: formats,
      setValue: setFormats,
    },
    {
      id: 'source',
      label: 'Source Files',
      icon: FolderOpen,
      options: sourceOptions,
      value: source,
      setValue: setSource,
    },
    {
      id: 'license',
      label: 'Usage License',
      icon: Shield,
      options: licenseOptions,
      value: license,
      setValue: setLicense,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-white mb-2">What file formats and usage rights do you need?</h2>
        <p className="text-[var(--text-secondary)]">
          Choose your deliverable options and licensing requirements.
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

            <div className="grid sm:grid-cols-3 gap-3">
              {category.options.map((option) => {
                const isSelected = category.value === option.id;
                const tooltipId = `${category.id}-${option.id}`;

                return (
                  <div key={option.id} className="relative">
                    <motion.button
                      onClick={() => category.setValue(option.id)}
                      className={`
                        w-full p-4 rounded-lg text-left transition-all group
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
                        <div className="flex items-center gap-1">
                          {isSelected && (
                            <div className="w-5 h-5 rounded-full bg-[var(--accent-blue)] flex items-center justify-center">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          )}
                          <span
                            className="p-0.5 text-[var(--text-muted)] hover:text-[var(--accent-blue)] transition-colors cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              setTooltipOpen(tooltipOpen === tooltipId ? null : tooltipId);
                            }}
                          >
                            <HelpCircle className="w-4 h-4" />
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        {option.included ? (
                          <span className="text-sm text-green-400">Included</span>
                        ) : 'startsAt' in option && option.startsAt ? (
                          <span className="text-sm font-medium gradient-text">${option.price}+</span>
                        ) : (
                          <span className="text-sm font-medium gradient-text">+${option.price}</span>
                        )}
                      </div>
                    </motion.button>

                    {/* Tooltip - Outside the button */}
                    {tooltipOpen === tooltipId && (
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
                          <div>
                            <span className="text-[var(--accent-blue)] font-medium">What it is:</span>
                            <p className="text-[var(--text-secondary)] mt-1">{option.tooltip.whatItIs}</p>
                          </div>
                          <div>
                            <span className="text-[var(--accent-teal)] font-medium">Ideal if:</span>
                            <p className="text-[var(--text-secondary)] mt-1">{option.tooltip.idealIf}</p>
                          </div>
                          <div>
                            <span className="text-[var(--accent-orange)] font-medium">Examples:</span>
                            <p className="text-[var(--text-secondary)] mt-1">{option.tooltip.examples}</p>
                          </div>
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
