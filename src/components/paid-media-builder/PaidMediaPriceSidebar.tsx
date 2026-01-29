'use client';

import { motion } from 'framer-motion';
import { usePaidMediaBuilderStore } from '@/hooks/usePaidMediaBuilderStore';
import {
  campaignTypeOptions,
  platformOptions,
  durationOptions,
  managementOptions,
  creativeOptions,
  landingPageOptions,
  trackingOptions,
  reportingOptions,
  addOnOptions,
} from '@/data/paidMediaBuilder';
import { Calculator, AlertCircle, TrendingUp, ArrowRight } from 'lucide-react';

interface PaidMediaPriceSidebarProps {
  currentStep: number;
  onGoToSummary: () => void;
}

export default function PaidMediaPriceSidebar({ currentStep, onGoToSummary }: PaidMediaPriceSidebarProps) {
  const {
    campaignType,
    platforms,
    duration,
    durationMonths,
    durationMultiplier,
    management,
    managementOneTime,
    creatives,
    landingPage,
    tracking,
    reporting,
    selectedAddOns,
    monthlySubtotal,
    durationDiscount,
    monthlyTotal,
    oneTimeTotal,
    totalInvestment,
    hasCustomQuote,
  } = usePaidMediaBuilderStore();

  // Get labels
  const campaignTypeLabel = campaignTypeOptions.find((t) => t.id === campaignType)?.label;
  const platformLabel = platformOptions.find((p) => p.id === platforms)?.label;
  const durationLabel = durationOptions.find((d) => d.id === duration)?.label;
  const managementLabel = managementOptions.find((m) => m.id === management)?.label;
  const creativesLabel = creativeOptions.find((c) => c.id === creatives)?.label;
  const landingPageLabel = landingPageOptions.find((l) => l.id === landingPage)?.label;
  const trackingLabel = trackingOptions.find((t) => t.id === tracking)?.label;
  const reportingLabel = reportingOptions.find((r) => r.id === reporting)?.label;

  // Calculate discount percentage
  const discountPercent = durationMultiplier < 1 ? Math.round((1 - durationMultiplier) * 100) : 0;
  const premiumPercent = durationMultiplier > 1 ? Math.round((durationMultiplier - 1) * 100) : 0;

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
        {campaignType && (
          <div className="flex justify-between text-sm">
            <span className="text-[var(--text-muted)]">Campaign Type</span>
            <span className="text-[var(--text-secondary)]">{campaignTypeLabel}</span>
          </div>
        )}
        {platforms && (
          <div className="flex justify-between text-sm">
            <span className="text-[var(--text-muted)]">Platform</span>
            <span className="text-[var(--text-secondary)]">{platformLabel}</span>
          </div>
        )}
        {duration && (
          <div className="flex justify-between text-sm">
            <span className="text-[var(--text-muted)]">Duration</span>
            <span className="text-[var(--text-secondary)]">{durationLabel}</span>
          </div>
        )}
        {management && (
          <div className="flex justify-between text-sm">
            <span className="text-[var(--text-muted)]">Management</span>
            <span className="text-[var(--text-secondary)]">{managementLabel}</span>
          </div>
        )}
        {creatives && (
          <div className="flex justify-between text-sm">
            <span className="text-[var(--text-muted)]">Creatives</span>
            <span className="text-[var(--text-secondary)]">{creativesLabel}</span>
          </div>
        )}
        {landingPage && landingPage !== 'none' && (
          <div className="flex justify-between text-sm">
            <span className="text-[var(--text-muted)]">Landing Page</span>
            <span className="text-[var(--text-secondary)]">{landingPageLabel}</span>
          </div>
        )}
        {tracking && (
          <div className="flex justify-between text-sm">
            <span className="text-[var(--text-muted)]">Tracking</span>
            <span className="text-[var(--text-secondary)]">{trackingLabel}</span>
          </div>
        )}
        {reporting && (
          <div className="flex justify-between text-sm">
            <span className="text-[var(--text-muted)]">Reporting</span>
            <span className="text-[var(--text-secondary)]">{reportingLabel}</span>
          </div>
        )}
        {selectedAddOns.length > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-[var(--text-muted)]">Add-ons</span>
            <span className="text-[var(--text-secondary)]">{selectedAddOns.length} selected</span>
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
              <span className="text-[var(--accent-orange)]">Trial Premium (+{premiumPercent}%)</span>
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
      {currentStep < 10 && campaignType && platforms && (
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
        *Ad spend paid directly to platforms, not included above.
      </p>
    </motion.div>
  );
}
