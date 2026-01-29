'use client';

import { motion } from 'framer-motion';
import { useSocialMediaBuilderStore } from '@/hooks/useSocialMediaBuilderStore';
import {
  managementGoalOptions,
  platformOptions,
  frequencyOptions,
  contentOptions,
  engagementOptions,
  strategyOptions,
  reportingOptions,
  storiesOptions,
  reelsOptions,
  durationOptions,
} from '@/data/socialMediaBuilder';
import { Calculator, AlertCircle, TrendingUp, ArrowRight } from 'lucide-react';

interface SocialMediaPriceSidebarProps {
  currentStep: number;
  onGoToSummary: () => void;
}

export default function SocialMediaPriceSidebar({ currentStep, onGoToSummary }: SocialMediaPriceSidebarProps) {
  const {
    managementGoal,
    platforms,
    frequency,
    postsPerMonth,
    content,
    engagement,
    strategy,
    reporting,
    stories,
    reels,
    selectedAdditionalAddOns,
    duration,
    durationMonths,
    durationMultiplier,
    monthlySubtotal,
    durationDiscount,
    monthlyTotal,
    oneTimeTotal,
    totalInvestment,
    hasCustomQuote,
  } = useSocialMediaBuilderStore();

  // Get labels
  const goalLabel = managementGoalOptions.find((g) => g.id === managementGoal)?.label;
  const platformLabel = platformOptions.find((p) => p.id === platforms)?.label;
  const frequencyLabel = frequencyOptions.find((f) => f.id === frequency)?.label;
  const contentLabel = contentOptions.find((c) => c.id === content)?.label;
  const engagementLabel = engagementOptions.find((e) => e.id === engagement)?.label;
  const strategyLabel = strategyOptions.find((s) => s.id === strategy)?.label;
  const reportingLabel = reportingOptions.find((r) => r.id === reporting)?.label;
  const storiesLabel = storiesOptions.find((s) => s.id === stories)?.label;
  const reelsLabel = reelsOptions.find((r) => r.id === reels)?.label;
  const durationLabel = durationOptions.find((d) => d.id === duration)?.label;

  // Calculate discount percentage
  const discountPercent = durationMultiplier < 1 ? Math.round((1 - durationMultiplier) * 100) : 0;
  const premiumPercent = durationMultiplier > 1 ? Math.round((durationMultiplier - 1) * 100) : 0;

  // Count total add-ons
  const totalAddOns =
    (stories !== 'none' ? 1 : 0) +
    (reels !== 'none' ? 1 : 0) +
    selectedAdditionalAddOns.length;

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
        {managementGoal && (
          <div className="flex justify-between text-sm">
            <span className="text-[var(--text-muted)]">Goal</span>
            <span className="text-[var(--text-secondary)]">{goalLabel}</span>
          </div>
        )}
        {platforms && (
          <div className="flex justify-between text-sm">
            <span className="text-[var(--text-muted)]">Platforms</span>
            <span className="text-[var(--text-secondary)]">{platformLabel}</span>
          </div>
        )}
        {frequency && (
          <div className="flex justify-between text-sm">
            <span className="text-[var(--text-muted)]">Frequency</span>
            <span className="text-[var(--text-secondary)]">{postsPerMonth} posts/mo</span>
          </div>
        )}
        {content && (
          <div className="flex justify-between text-sm">
            <span className="text-[var(--text-muted)]">Content</span>
            <span className="text-[var(--text-secondary)]">{contentLabel}</span>
          </div>
        )}
        {engagement && (
          <div className="flex justify-between text-sm">
            <span className="text-[var(--text-muted)]">Engagement</span>
            <span className="text-[var(--text-secondary)]">{engagementLabel}</span>
          </div>
        )}
        {strategy && (
          <div className="flex justify-between text-sm">
            <span className="text-[var(--text-muted)]">Strategy</span>
            <span className="text-[var(--text-secondary)]">{strategyLabel}</span>
          </div>
        )}
        {reporting && (
          <div className="flex justify-between text-sm">
            <span className="text-[var(--text-muted)]">Reporting</span>
            <span className="text-[var(--text-secondary)]">{reportingLabel}</span>
          </div>
        )}
        {totalAddOns > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-[var(--text-muted)]">Add-ons</span>
            <span className="text-[var(--text-secondary)]">{totalAddOns} selected</span>
          </div>
        )}
        {duration && (
          <div className="flex justify-between text-sm">
            <span className="text-[var(--text-muted)]">Duration</span>
            <span className="text-[var(--text-secondary)]">{durationLabel}</span>
          </div>
        )}
      </div>

      {/* Price Breakdown */}
      <div className="border-t border-[var(--border-subtle)] pt-4 space-y-3">
        {/* Monthly Section */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-[var(--text-muted)]">Monthly Subtotal</span>
            <span className="text-white">${monthlySubtotal.toLocaleString()}/mo</span>
          </div>

          {discountPercent > 0 && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-green-400">Duration Discount (-{discountPercent}%)</span>
              <span className="text-green-400">-${durationDiscount.toFixed(2)}/mo</span>
            </div>
          )}

          {premiumPercent > 0 && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-[var(--accent-orange)]">Flexibility Premium (+{premiumPercent}%)</span>
              <span className="text-[var(--accent-orange)]">+${(monthlySubtotal * (durationMultiplier - 1)).toFixed(2)}/mo</span>
            </div>
          )}

          <div className="flex justify-between items-center">
            <span className="text-white font-medium">Monthly Total</span>
            <motion.span
              key={monthlyTotal}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              className="text-lg font-bold text-[var(--accent-teal)]"
            >
              {hasCustomQuote ? 'Custom' : `$${monthlyTotal.toFixed(2)}/mo`}
            </motion.span>
          </div>
        </div>

        {/* One-Time Section */}
        {oneTimeTotal > 0 && (
          <div className="pt-2 border-t border-[var(--border-subtle)]">
            <div className="flex justify-between items-center">
              <span className="text-white font-medium">One-Time Setup</span>
              <span className="text-lg font-bold text-white">
                ${oneTimeTotal.toLocaleString()}
              </span>
            </div>
          </div>
        )}

        {/* Total Investment */}
        {duration && !hasCustomQuote && (
          <div className="pt-3 mt-3 border-t-2 border-[var(--accent-blue)]/50">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-[var(--accent-blue)]" />
              <span className="text-sm text-[var(--text-muted)]">{durationMonths}-Month Investment</span>
            </div>
            <motion.div
              key={totalInvestment}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              className="text-2xl font-bold gradient-text"
            >
              ${totalInvestment.toLocaleString()}
            </motion.div>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Includes ${(monthlyTotal * durationMonths).toLocaleString()} monthly + ${oneTimeTotal.toLocaleString()} setup
            </p>
          </div>
        )}
      </div>

      {/* Go to Summary Button */}
      {currentStep < 10 && managementGoal && platforms && (
        <motion.button
          onClick={onGoToSummary}
          className="w-full mt-6 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--accent-blue)] hover:text-white transition-all"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Skip to Summary
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      )}

      <p className="text-[10px] text-[var(--text-muted)] mt-4">
        *Pricing based on your selections. Final quote may vary.
      </p>
    </motion.div>
  );
}
