'use client';

import { motion } from 'framer-motion';
import { useBrandStrategyBuilderStore } from '@/hooks/useBrandStrategyBuilderStore';
import {
  strategyGoalOptions,
  depthOptions,
  researchOptions,
  positioningOptions,
  messagingOptions,
  architectureOptions,
  purposeOptions,
  audienceOptions,
  workshopOptions,
  timelineOptions,
} from '@/data/brandStrategyBuilder';
import { Calculator, AlertCircle, TrendingUp, ArrowRight } from 'lucide-react';

interface BrandStrategyPriceSidebarProps {
  currentStep: number;
  onGoToSummary: () => void;
}

export default function BrandStrategyPriceSidebar({ currentStep, onGoToSummary }: BrandStrategyPriceSidebarProps) {
  const {
    strategyGoal,
    depth,
    research,
    positioning,
    messaging,
    architecture,
    purpose,
    audience,
    workshop,
    selectedAddOns,
    timeline,
    timelineMultiplier,
    strategySubtotal,
    addOnsTotal,
    projectSubtotal,
    timelinePremium,
    totalInvestment,
    hasCustomQuote,
  } = useBrandStrategyBuilderStore();

  // Get labels
  const goalLabel = strategyGoalOptions.find((g) => g.id === strategyGoal)?.label;
  const depthLabel = depthOptions.find((d) => d.id === depth)?.label;
  const researchLabel = researchOptions.find((r) => r.id === research)?.label;
  const positioningLabel = positioningOptions.find((p) => p.id === positioning)?.label;
  const messagingLabel = messagingOptions.find((m) => m.id === messaging)?.label;
  const architectureLabel = architectureOptions.find((a) => a.id === architecture)?.label;
  const purposeLabel = purposeOptions.find((p) => p.id === purpose)?.label;
  const audienceLabel = audienceOptions.find((a) => a.id === audience)?.label;
  const workshopLabel = workshopOptions.find((w) => w.id === workshop)?.label;
  const timelineLabel = timelineOptions.find((t) => t.id === timeline)?.label;

  // Calculate timeline premium percentage
  const premiumPercent = timelineMultiplier > 1 ? Math.round((timelineMultiplier - 1) * 100) : 0;

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
        {strategyGoal && (
          <div className="flex justify-between text-sm">
            <span className="text-[var(--text-muted)]">Goal</span>
            <span className="text-[var(--text-secondary)]">{goalLabel}</span>
          </div>
        )}
        {depth && (
          <div className="flex justify-between text-sm">
            <span className="text-[var(--text-muted)]">Depth</span>
            <span className="text-[var(--text-secondary)]">{depthLabel}</span>
          </div>
        )}
        {research && (
          <div className="flex justify-between text-sm">
            <span className="text-[var(--text-muted)]">Research</span>
            <span className="text-[var(--text-secondary)]">{researchLabel}</span>
          </div>
        )}
        {positioning && (
          <div className="flex justify-between text-sm">
            <span className="text-[var(--text-muted)]">Positioning</span>
            <span className="text-[var(--text-secondary)]">{positioningLabel}</span>
          </div>
        )}
        {messaging && messaging !== 'none' && (
          <div className="flex justify-between text-sm">
            <span className="text-[var(--text-muted)]">Messaging</span>
            <span className="text-[var(--text-secondary)]">{messagingLabel}</span>
          </div>
        )}
        {architecture && architecture !== 'none' && (
          <div className="flex justify-between text-sm">
            <span className="text-[var(--text-muted)]">Architecture</span>
            <span className="text-[var(--text-secondary)]">{architectureLabel}</span>
          </div>
        )}
        {purpose && purpose !== 'none' && (
          <div className="flex justify-between text-sm">
            <span className="text-[var(--text-muted)]">Purpose</span>
            <span className="text-[var(--text-secondary)]">{purposeLabel}</span>
          </div>
        )}
        {audience && audience !== 'included' && (
          <div className="flex justify-between text-sm">
            <span className="text-[var(--text-muted)]">Audience</span>
            <span className="text-[var(--text-secondary)]">{audienceLabel}</span>
          </div>
        )}
        {workshop && workshop !== 'none' && (
          <div className="flex justify-between text-sm">
            <span className="text-[var(--text-muted)]">Workshop</span>
            <span className="text-[var(--text-secondary)]">{workshopLabel}</span>
          </div>
        )}
        {selectedAddOns.length > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-[var(--text-muted)]">Add-ons</span>
            <span className="text-[var(--text-secondary)]">{selectedAddOns.length} selected</span>
          </div>
        )}
        {timeline && (
          <div className="flex justify-between text-sm">
            <span className="text-[var(--text-muted)]">Timeline</span>
            <span className="text-[var(--text-secondary)]">{timelineLabel}</span>
          </div>
        )}
      </div>

      {/* Price Breakdown */}
      <div className="border-t border-[var(--border-subtle)] pt-4 space-y-3">
        {/* Strategy Subtotal */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-[var(--text-muted)]">Strategy Subtotal</span>
            <span className="text-white">${strategySubtotal.toLocaleString()}</span>
          </div>

          {/* Add-ons Total */}
          {addOnsTotal > 0 && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-[var(--text-muted)]">Add-ons Total</span>
              <span className="text-white">${addOnsTotal.toLocaleString()}</span>
            </div>
          )}

          {/* Project Subtotal */}
          <div className="flex justify-between items-center text-sm pt-2 border-t border-[var(--border-subtle)]">
            <span className="text-white font-medium">Project Subtotal</span>
            <span className="text-white">${projectSubtotal.toLocaleString()}</span>
          </div>

          {/* Timeline Premium */}
          {premiumPercent > 0 && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-[var(--accent-orange)]">Timeline Premium (+{premiumPercent}%)</span>
              <span className="text-[var(--accent-orange)]">+${timelinePremium.toLocaleString()}</span>
            </div>
          )}
        </div>

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
      {currentStep < 12 && strategyGoal && depth && (
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
