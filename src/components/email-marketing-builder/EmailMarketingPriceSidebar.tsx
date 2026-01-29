'use client';

import { motion } from 'framer-motion';
import { useEmailMarketingBuilderStore } from '@/hooks/useEmailMarketingBuilderStore';
import {
  emailGoalOptions,
  volumeOptions,
  designOptions,
  automationOptions,
  sequenceOptions,
  listOptions,
  copyOptions,
  reportingOptions,
  durationOptions,
} from '@/data/emailMarketingBuilder';
import { Calculator, AlertCircle, TrendingUp, ArrowRight } from 'lucide-react';

interface EmailMarketingPriceSidebarProps {
  currentStep: number;
  onGoToSummary: () => void;
}

export default function EmailMarketingPriceSidebar({ currentStep, onGoToSummary }: EmailMarketingPriceSidebarProps) {
  const {
    emailGoal,
    volume,
    emailsPerMonth,
    design,
    automation,
    sequences,
    list,
    copy,
    reporting,
    testing,
    platform,
    selectedAdditionalServices,
    duration,
    durationMonths,
    durationMultiplier,
    monthlySubtotal,
    durationDiscount,
    monthlyTotal,
    oneTimeTotal,
    totalInvestment,
    hasCustomQuote,
  } = useEmailMarketingBuilderStore();

  // Get labels
  const goalLabel = emailGoalOptions.find((g) => g.id === emailGoal)?.label;
  const volumeLabel = volumeOptions.find((v) => v.id === volume)?.label;
  const designLabel = designOptions.find((d) => d.id === design)?.label;
  const automationLabel = automationOptions.find((a) => a.id === automation)?.label;
  const sequencesLabel = sequenceOptions.find((s) => s.id === sequences)?.label;
  const listLabel = listOptions.find((l) => l.id === list)?.label;
  const copyLabel = copyOptions.find((c) => c.id === copy)?.label;
  const reportingLabel = reportingOptions.find((r) => r.id === reporting)?.label;
  const durationLabel = durationOptions.find((d) => d.id === duration)?.label;

  // Calculate discount percentage
  const discountPercent = durationMultiplier < 1 ? Math.round((1 - durationMultiplier) * 100) : 0;
  const premiumPercent = durationMultiplier > 1 ? Math.round((durationMultiplier - 1) * 100) : 0;

  // Count total add-ons
  const totalAddOns =
    (testing !== 'none' ? 1 : 0) +
    (platform !== 'client' ? 1 : 0) +
    selectedAdditionalServices.length;

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
        {emailGoal && (
          <div className="flex justify-between text-sm">
            <span className="text-[var(--text-muted)]">Goal</span>
            <span className="text-[var(--text-secondary)]">{goalLabel}</span>
          </div>
        )}
        {volume && (
          <div className="flex justify-between text-sm">
            <span className="text-[var(--text-muted)]">Volume</span>
            <span className="text-[var(--text-secondary)]">{emailsPerMonth ? `${emailsPerMonth} emails/mo` : volumeLabel}</span>
          </div>
        )}
        {design && (
          <div className="flex justify-between text-sm">
            <span className="text-[var(--text-muted)]">Design</span>
            <span className="text-[var(--text-secondary)]">{designLabel}</span>
          </div>
        )}
        {automation && (
          <div className="flex justify-between text-sm">
            <span className="text-[var(--text-muted)]">Automation</span>
            <span className="text-[var(--text-secondary)]">{automationLabel}</span>
          </div>
        )}
        {sequences && sequences !== 'none' && (
          <div className="flex justify-between text-sm">
            <span className="text-[var(--text-muted)]">Sequences</span>
            <span className="text-[var(--text-secondary)]">{sequencesLabel}</span>
          </div>
        )}
        {list && (
          <div className="flex justify-between text-sm">
            <span className="text-[var(--text-muted)]">List Mgmt</span>
            <span className="text-[var(--text-secondary)]">{listLabel}</span>
          </div>
        )}
        {copy && (
          <div className="flex justify-between text-sm">
            <span className="text-[var(--text-muted)]">Copywriting</span>
            <span className="text-[var(--text-secondary)]">{copyLabel}</span>
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
      {currentStep < 11 && emailGoal && volume && (
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
        *Pricing based on your selections. Final quote may vary. ESP platform costs are separate.
      </p>
    </motion.div>
  );
}
