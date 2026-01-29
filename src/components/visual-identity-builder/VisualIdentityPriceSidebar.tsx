'use client';

import { motion } from 'framer-motion';
import { useVisualIdentityBuilderStore } from '@/hooks/useVisualIdentityBuilderStore';
import {
  visualIdentityGoalOptions,
  logoOptions,
  colorOptions,
  typographyOptions,
  photographyOptions,
  iconOptions,
  patternOptions,
  illustrationOptions,
  motionOptions,
  guidelinesOptions,
  timelineOptions,
} from '@/data/visualIdentityBuilder';
import { Calculator, AlertCircle, TrendingUp, ArrowRight, Sparkles, Palette, Camera, Package, FileText } from 'lucide-react';

interface VisualIdentityPriceSidebarProps {
  currentStep: number;
  onGoToSummary: () => void;
}

export default function VisualIdentityPriceSidebar({ currentStep, onGoToSummary }: VisualIdentityPriceSidebarProps) {
  const {
    visualIdentityGoal,
    logo,
    logoPrice,
    colors,
    colorsPrice,
    typography,
    typographyPrice,
    photography,
    photographyPrice,
    icons,
    iconsPrice,
    patterns,
    patternsPrice,
    illustration,
    illustrationPrice,
    motion: motionSelection,
    motionPrice,
    guidelines,
    guidelinesPrice,
    selectedAddOns,
    timeline,
    timelineMultiplier,
    coreIdentitySubtotal,
    visualElementsSubtotal,
    documentationSubtotal,
    addOnsTotal,
    projectSubtotal,
    timelinePremium,
    totalInvestment,
    hasCustomQuote,
  } = useVisualIdentityBuilderStore();

  // Get labels
  const goalLabel = visualIdentityGoalOptions.find((g) => g.id === visualIdentityGoal)?.label;
  const logoLabel = logoOptions.find((l) => l.id === logo)?.label;
  const colorsLabel = colorOptions.find((c) => c.id === colors)?.label;
  const typographyLabel = typographyOptions.find((t) => t.id === typography)?.label;
  const photographyLabel = photographyOptions.find((p) => p.id === photography)?.label;
  const iconsLabel = iconOptions.find((i) => i.id === icons)?.label;
  const patternsLabel = patternOptions.find((p) => p.id === patterns)?.label;
  const illustrationLabel = illustrationOptions.find((i) => i.id === illustration)?.label;
  const motionLabel = motionOptions.find((m) => m.id === motionSelection)?.label;
  const guidelinesLabel = guidelinesOptions.find((g) => g.id === guidelines)?.label;
  const timelineLabel = timelineOptions.find((t) => t.id === timeline)?.label;

  // Calculate timeline premium percentage
  const premiumPercent = timelineMultiplier > 1 ? Math.round((timelineMultiplier - 1) * 100) : 0;

  // Check if core identity has any selected items
  const hasCoreIdentity = (logo && logo !== 'none') || (colors && colors !== 'none') || (typography && typography !== 'none');

  // Check if visual elements has any selected items
  const hasVisualElements = (photography && photography !== 'none') || (icons && icons !== 'none') || (patterns && patterns !== 'none') || (illustration && illustration !== 'none');

  // Check if documentation has any selected items
  const hasDocumentation = (motionSelection && motionSelection !== 'none') || (guidelines && guidelines !== 'none');

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="card p-6 sticky top-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <Calculator className="w-5 h-5 text-[var(--accent-blue)]" />
        <h3 className="text-lg font-semibold text-white">Your Estimate</h3>
      </div>

      {hasCustomQuote && (
        <div className="flex items-start gap-3 p-4 bg-[var(--accent-orange)]/10 border border-[var(--accent-orange)]/30 rounded-lg mb-4">
          <AlertCircle className="w-5 h-5 text-[var(--accent-orange)] shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-white font-medium">Custom Quote Required</p>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Some selections require custom pricing.
            </p>
          </div>
        </div>
      )}

      {/* Selections Summary */}
      <div className="space-y-3 mb-6">
        {visualIdentityGoal && (
          <div className="flex justify-between text-sm">
            <span className="text-[var(--text-muted)]">Goal</span>
            <span className="text-[var(--text-secondary)]">{goalLabel}</span>
          </div>
        )}
      </div>

      {/* Price Breakdown by Category */}
      <div className="border-t border-[var(--border-subtle)] pt-4 space-y-4">

        {/* Core Identity Section: Logo + Colors + Typography */}
        {hasCoreIdentity && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-[var(--accent-blue)]" />
              <span className="text-sm font-medium text-white">Core Identity</span>
            </div>
            {logo && logo !== 'none' && (
              <div className="flex justify-between text-sm pl-6">
                <span className="text-[var(--text-muted)]">Logo - {logoLabel}</span>
                <span className="text-[var(--text-secondary)]">${logoPrice.toLocaleString()}</span>
              </div>
            )}
            {colors && colors !== 'none' && (
              <div className="flex justify-between text-sm pl-6">
                <span className="text-[var(--text-muted)]">Colors - {colorsLabel}</span>
                <span className="text-[var(--text-secondary)]">${colorsPrice.toLocaleString()}</span>
              </div>
            )}
            {typography && typography !== 'none' && (
              <div className="flex justify-between text-sm pl-6">
                <span className="text-[var(--text-muted)]">Typography - {typographyLabel}</span>
                <span className="text-[var(--text-secondary)]">${typographyPrice.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-sm pt-1 border-t border-[var(--border-subtle)]/50">
              <span className="text-[var(--text-muted)] pl-6">Subtotal</span>
              <span className="text-white">${(logoPrice + colorsPrice + typographyPrice).toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* Visual Elements Section: Photography + Icons + Patterns + Illustration */}
        {hasVisualElements && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <Camera className="w-4 h-4 text-[var(--accent-teal)]" />
              <span className="text-sm font-medium text-white">Visual Elements</span>
            </div>
            {photography && photography !== 'none' && (
              <div className="flex justify-between text-sm pl-6">
                <span className="text-[var(--text-muted)]">Photography - {photographyLabel}</span>
                <span className="text-[var(--text-secondary)]">${photographyPrice.toLocaleString()}</span>
              </div>
            )}
            {icons && icons !== 'none' && (
              <div className="flex justify-between text-sm pl-6">
                <span className="text-[var(--text-muted)]">Icons - {iconsLabel}</span>
                <span className="text-[var(--text-secondary)]">${iconsPrice.toLocaleString()}</span>
              </div>
            )}
            {patterns && patterns !== 'none' && (
              <div className="flex justify-between text-sm pl-6">
                <span className="text-[var(--text-muted)]">Patterns - {patternsLabel}</span>
                <span className="text-[var(--text-secondary)]">${patternsPrice.toLocaleString()}</span>
              </div>
            )}
            {illustration && illustration !== 'none' && (
              <div className="flex justify-between text-sm pl-6">
                <span className="text-[var(--text-muted)]">Illustration - {illustrationLabel}</span>
                <span className="text-[var(--text-secondary)]">${illustrationPrice.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-sm pt-1 border-t border-[var(--border-subtle)]/50">
              <span className="text-[var(--text-muted)] pl-6">Subtotal</span>
              <span className="text-white">${visualElementsSubtotal.toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* Documentation Section: Motion + Guidelines */}
        {hasDocumentation && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-[var(--accent-orange)]" />
              <span className="text-sm font-medium text-white">Documentation</span>
            </div>
            {motionSelection && motionSelection !== 'none' && (
              <div className="flex justify-between text-sm pl-6">
                <span className="text-[var(--text-muted)]">Motion - {motionLabel}</span>
                <span className="text-[var(--text-secondary)]">${motionPrice.toLocaleString()}</span>
              </div>
            )}
            {guidelines && guidelines !== 'none' && (
              <div className="flex justify-between text-sm pl-6">
                <span className="text-[var(--text-muted)]">Guidelines - {guidelinesLabel}</span>
                <span className="text-[var(--text-secondary)]">${guidelinesPrice.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-sm pt-1 border-t border-[var(--border-subtle)]/50">
              <span className="text-[var(--text-muted)] pl-6">Subtotal</span>
              <span className="text-white">${documentationSubtotal.toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* Add-Ons Section */}
        {selectedAddOns.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <Package className="w-4 h-4 text-[var(--accent-blue)]" />
              <span className="text-sm font-medium text-white">Add-Ons</span>
            </div>
            <div className="flex justify-between text-sm pl-6">
              <span className="text-[var(--text-muted)]">{selectedAddOns.length} item{selectedAddOns.length > 1 ? 's' : ''} selected</span>
              <span className="text-[var(--text-secondary)]">${addOnsTotal.toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* Timeline Premium */}
        {premiumPercent > 0 && timeline && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[var(--text-muted)]">Timeline - {timelineLabel}</span>
              <span className="text-[var(--accent-orange)]">+{premiumPercent}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[var(--accent-orange)]">Timeline Premium</span>
              <span className="text-[var(--accent-orange)]">+${timelinePremium.toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* Project Subtotal */}
        {projectSubtotal > 0 && (
          <div className="flex justify-between items-center text-sm pt-2 border-t border-[var(--border-subtle)]">
            <span className="text-white font-medium">Project Subtotal</span>
            <span className="text-white">${projectSubtotal.toLocaleString()}</span>
          </div>
        )}

        {/* Total Investment */}
        <div className="pt-3 mt-3 border-t-2 border-[var(--accent-blue)]/50">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-[var(--accent-blue)]" />
            <span className="text-sm text-[var(--text-muted)]">Total Investment</span>
          </div>
          <motion.div
            key={totalInvestment}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            className="text-2xl font-bold gradient-text"
          >
            {hasCustomQuote ? 'Custom Quote' : `$${totalInvestment.toLocaleString()}`}
          </motion.div>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            One-time project investment
          </p>
        </div>
      </div>

      {/* Go to Summary Button */}
      {currentStep < 13 && visualIdentityGoal && logo && (
        <motion.button
          onClick={onGoToSummary}
          className="w-full mt-6 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--accent-blue)] hover:text-white transition-all"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Go to Summary
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      )}

      <p className="text-[10px] text-[var(--text-muted)] mt-4">
        *Pricing based on your selections. Final quote may vary based on project scope.
      </p>
    </motion.div>
  );
}
