'use client';

import { motion } from 'framer-motion';
import { useAnimationBuilderStore } from '@/hooks/useAnimationBuilderStore';
import { videoFormatOptions, aspectRatioOptions, sourceFileOptions } from '@/data/animationBuilder';
import { Check, FileVideo, Maximize, FolderOpen, HelpCircle } from 'lucide-react';
import { useState } from 'react';

export default function Step7Deliverables() {
  const {
    selectedVideoFormats,
    toggleVideoFormat,
    isVideoFormatSelected,
    aspectRatio,
    setAspectRatio,
    sourceFiles,
    setSourceFiles,
  } = useAnimationBuilderStore();
  const [tooltipOpen, setTooltipOpen] = useState<string | null>(null);

  return (
    <div className="card p-6">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <FileVideo className="w-6 h-6 text-[var(--accent-blue)]" />
          <h2 className="text-2xl font-semibold text-white font-serif">
            What file formats do you need?
          </h2>
        </div>
        <p className="text-[var(--text-secondary)]">
          Choose your deliverable formats, aspect ratios, and source file options.
        </p>
      </div>

      {/* Video Formats */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-white mb-3 flex items-center gap-2">
          <FileVideo className="w-5 h-5 text-[var(--accent-blue)]" />
          Video Formats
        </h3>
        <div className="grid gap-2">
          {videoFormatOptions.map((format) => {
            const isSelected = isVideoFormatSelected(format.id);
            const isMP4 = format.id === 'mp4';

            return (
              <div key={format.id} className="relative">
                <button
                  onClick={() => !isMP4 && toggleVideoFormat(format.id)}
                  disabled={isMP4}
                  className={`
                    w-full p-3 rounded-lg border text-left transition-all flex items-center justify-between
                    ${isMP4 ? 'cursor-default' : ''}
                    ${isSelected
                      ? 'border-[var(--accent-blue)] bg-[var(--accent-blue)]/10'
                      : 'border-[var(--border-subtle)] bg-[var(--bg-secondary)] hover:border-[var(--accent-blue)]/50'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div className={`
                      w-5 h-5 rounded border-2 flex items-center justify-center
                      ${isSelected ? 'border-[var(--accent-blue)] bg-[var(--accent-blue)]' : 'border-[var(--border-subtle)]'}
                    `}>
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <span className={`font-medium ${isSelected ? 'text-white' : 'text-[var(--text-secondary)]'}`}>
                      {format.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm ${format.included ? 'text-green-400' : 'text-white'}`}>
                      {format.included ? 'Included' : `+$${format.price}`}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setTooltipOpen(tooltipOpen === format.id ? null : format.id);
                      }}
                      className="p-1 text-[var(--text-muted)] hover:text-[var(--accent-blue)] transition-colors"
                    >
                      <HelpCircle className="w-4 h-4" />
                    </button>
                  </div>
                </button>

                {tooltipOpen === format.id && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 top-full mt-2 z-50 w-80 p-4 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-lg shadow-xl"
                  >
                    <button onClick={() => setTooltipOpen(null)} className="absolute top-2 right-2 text-[var(--text-muted)] hover:text-white text-xl leading-none">&times;</button>
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="text-[var(--accent-blue)] font-medium">What it is:</span>
                        <p className="text-[var(--text-secondary)] mt-1">{format.tooltip.whatItIs}</p>
                      </div>
                      <div>
                        <span className="text-[var(--accent-teal)] font-medium">Ideal if:</span>
                        <p className="text-[var(--text-secondary)] mt-1">{format.tooltip.idealIf}</p>
                      </div>
                      <div>
                        <span className="text-[var(--accent-orange)] font-medium">Examples:</span>
                        <p className="text-[var(--text-secondary)] mt-1">{format.tooltip.examples}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Aspect Ratios */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-white mb-3 flex items-center gap-2">
          <Maximize className="w-5 h-5 text-[var(--accent-blue)]" />
          Aspect Ratios
        </h3>
        <div className="grid gap-2">
          {aspectRatioOptions.map((option) => {
            const isSelected = aspectRatio === option.id;

            return (
              <div key={option.id} className="relative">
                <button
                  onClick={() => setAspectRatio(option.id)}
                  className={`
                    w-full p-3 rounded-lg border text-left transition-all flex items-center justify-between
                    ${isSelected
                      ? 'border-[var(--accent-blue)] bg-[var(--accent-blue)]/10'
                      : 'border-[var(--border-subtle)] bg-[var(--bg-secondary)] hover:border-[var(--accent-blue)]/50'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div className={`
                      w-5 h-5 rounded-full border-2 flex items-center justify-center
                      ${isSelected ? 'border-[var(--accent-blue)] bg-[var(--accent-blue)]' : 'border-[var(--border-subtle)]'}
                    `}>
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <span className={`font-medium ${isSelected ? 'text-white' : 'text-[var(--text-secondary)]'}`}>
                      {option.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm ${option.included ? 'text-green-400' : 'text-white'}`}>
                      {option.included ? 'Included' : `+$${option.price}`}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setTooltipOpen(tooltipOpen === `aspect-${option.id}` ? null : `aspect-${option.id}`);
                      }}
                      className="p-1 text-[var(--text-muted)] hover:text-[var(--accent-blue)] transition-colors"
                    >
                      <HelpCircle className="w-4 h-4" />
                    </button>
                  </div>
                </button>

                {tooltipOpen === `aspect-${option.id}` && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 top-full mt-2 z-50 w-80 p-4 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-lg shadow-xl"
                  >
                    <button onClick={() => setTooltipOpen(null)} className="absolute top-2 right-2 text-[var(--text-muted)] hover:text-white text-xl leading-none">&times;</button>
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

      {/* Source Files */}
      <div>
        <h3 className="text-lg font-medium text-white mb-3 flex items-center gap-2">
          <FolderOpen className="w-5 h-5 text-[var(--accent-blue)]" />
          Source Files
        </h3>
        <div className="grid gap-2">
          {sourceFileOptions.map((option) => {
            const isSelected = sourceFiles === option.id;

            return (
              <div key={option.id} className="relative">
                <button
                  onClick={() => setSourceFiles(option.id)}
                  className={`
                    w-full p-3 rounded-lg border text-left transition-all flex items-center justify-between
                    ${isSelected
                      ? 'border-[var(--accent-blue)] bg-[var(--accent-blue)]/10'
                      : 'border-[var(--border-subtle)] bg-[var(--bg-secondary)] hover:border-[var(--accent-blue)]/50'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div className={`
                      w-5 h-5 rounded-full border-2 flex items-center justify-center
                      ${isSelected ? 'border-[var(--accent-blue)] bg-[var(--accent-blue)]' : 'border-[var(--border-subtle)]'}
                    `}>
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <span className={`font-medium ${isSelected ? 'text-white' : 'text-[var(--text-secondary)]'}`}>
                      {option.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm ${option.included ? 'text-green-400' : 'text-white'}`}>
                      {option.included ? 'Included' : `+$${option.price}`}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setTooltipOpen(tooltipOpen === `source-${option.id}` ? null : `source-${option.id}`);
                      }}
                      className="p-1 text-[var(--text-muted)] hover:text-[var(--accent-blue)] transition-colors"
                    >
                      <HelpCircle className="w-4 h-4" />
                    </button>
                  </div>
                </button>

                {tooltipOpen === `source-${option.id}` && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 top-full mt-2 z-50 w-80 p-4 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-lg shadow-xl"
                  >
                    <button onClick={() => setTooltipOpen(null)} className="absolute top-2 right-2 text-[var(--text-muted)] hover:text-white text-xl leading-none">&times;</button>
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
    </div>
  );
}
