'use client';

import { motion } from 'framer-motion';
import { useMessagingCopywritingBuilderStore } from '@/hooks/useMessagingCopywritingBuilderStore';
import {
  messagingGoalOptions,
  messagingOptions,
  voiceOptions,
  websiteOptions,
  marketingOptions,
  salesOptions,
  productOptions,
  contentOptions,
  uxOptions,
  retainerOptions,
  timelineOptions,
} from '@/data/messagingCopywritingBuilder';
import { Calculator, AlertCircle, TrendingUp, ArrowRight, Repeat } from 'lucide-react';

interface MessagingCopywritingPriceSidebarProps {
  currentStep: number;
  onGoToSummary: () => void;
}

export default function MessagingCopywritingPriceSidebar({
  currentStep,
  onGoToSummary,
}: MessagingCopywritingPriceSidebarProps) {
  const {
    messagingGoal,
    messaging,
    voice,
    website,
    marketing,
    sales,
    product,
    content,
    ux,
    retainer,
    selectedAddOns,
    timeline,
    timelineMultiplier,
    messagingFoundationSubtotal,
    copyProductionSubtotal,
    addOnsTotal,
    oneTimeSubtotal,
    timelinePremium,
    oneTimeTotal,
    monthlyTotal,
    hasCustomQuote,
  } = useMessagingCopywritingBuilderStore();

  // Get labels
  const goalLabel = messagingGoalOptions.find((g) => g.id === messagingGoal)?.label;
  const messagingLabel = messagingOptions.find((m) => m.id === messaging)?.label;
  const voiceLabel = voiceOptions.find((v) => v.id === voice)?.label;
  const websiteLabel = websiteOptions.find((w) => w.id === website)?.label;
  const marketingLabel = marketingOptions.find((m) => m.id === marketing)?.label;
  const salesLabel = salesOptions.find((s) => s.id === sales)?.label;
  const productLabel = productOptions.find((p) => p.id === product)?.label;
  const contentLabel = contentOptions.find((c) => c.id === content)?.label;
  const uxLabel = uxOptions.find((u) => u.id === ux)?.label;
  const retainerLabel = retainerOptions.find((r) => r.id === retainer)?.label;
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
        {messagingGoal && (
          <div className="flex justify-between text-sm">
            <span className="text-[var(--text-muted)]">Goal</span>
            <span className="text-[var(--text-secondary)]">{goalLabel}</span>
          </div>
        )}

        {/* Messaging Foundation */}
        {(messaging || voice) && (messaging !== 'none' || voice !== 'none') && (
          <div className="pt-2 border-t border-[var(--border-subtle)]">
            <p className="text-xs text-[var(--accent-blue)] font-medium mb-2">MESSAGING FOUNDATION</p>
            {messaging && messaging !== 'none' && (
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-muted)]">Messaging Framework</span>
                <span className="text-[var(--text-secondary)]">{messagingLabel}</span>
              </div>
            )}
            {voice && voice !== 'none' && (
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-muted)]">Brand Voice</span>
                <span className="text-[var(--text-secondary)]">{voiceLabel}</span>
              </div>
            )}
          </div>
        )}

        {/* Copy Production */}
        {(website || marketing || sales || product || content || ux) &&
          (website !== 'none' ||
            marketing !== 'none' ||
            sales !== 'none' ||
            product !== 'none' ||
            content !== 'none' ||
            ux !== 'none') && (
            <div className="pt-2 border-t border-[var(--border-subtle)]">
              <p className="text-xs text-[var(--accent-teal)] font-medium mb-2">COPY PRODUCTION</p>
              {website && website !== 'none' && (
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--text-muted)]">Website</span>
                  <span className="text-[var(--text-secondary)]">{websiteLabel}</span>
                </div>
              )}
              {marketing && marketing !== 'none' && (
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--text-muted)]">Marketing</span>
                  <span className="text-[var(--text-secondary)]">{marketingLabel}</span>
                </div>
              )}
              {sales && sales !== 'none' && (
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--text-muted)]">Sales</span>
                  <span className="text-[var(--text-secondary)]">{salesLabel}</span>
                </div>
              )}
              {product && product !== 'none' && (
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--text-muted)]">Product</span>
                  <span className="text-[var(--text-secondary)]">{productLabel}</span>
                </div>
              )}
              {content && content !== 'none' && (
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--text-muted)]">Content</span>
                  <span className="text-[var(--text-secondary)]">{contentLabel}</span>
                </div>
              )}
              {ux && ux !== 'none' && (
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--text-muted)]">UX</span>
                  <span className="text-[var(--text-secondary)]">{uxLabel}</span>
                </div>
              )}
            </div>
          )}

        {/* Add-ons */}
        {selectedAddOns.length > 0 && (
          <div className="flex justify-between text-sm pt-2 border-t border-[var(--border-subtle)]">
            <span className="text-[var(--text-muted)]">Add-ons</span>
            <span className="text-[var(--text-secondary)]">{selectedAddOns.length} selected</span>
          </div>
        )}

        {/* Timeline */}
        {timeline && (
          <div className="flex justify-between text-sm pt-2 border-t border-[var(--border-subtle)]">
            <span className="text-[var(--text-muted)]">Timeline</span>
            <span className="text-[var(--text-secondary)]">{timelineLabel}</span>
          </div>
        )}
      </div>

      {/* Price Breakdown */}
      <div className="border-t border-[var(--border-subtle)] pt-4 space-y-3">
        {/* Messaging Foundation Subtotal */}
        <div className="space-y-2">
          {messagingFoundationSubtotal > 0 && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-[var(--text-muted)]">Messaging Foundation</span>
              <span className="text-white">${messagingFoundationSubtotal.toLocaleString()}</span>
            </div>
          )}

          {/* Copy Production Subtotal */}
          {copyProductionSubtotal > 0 && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-[var(--text-muted)]">Copy Production</span>
              <span className="text-white">${copyProductionSubtotal.toLocaleString()}</span>
            </div>
          )}

          {/* Add-ons Total */}
          {addOnsTotal > 0 && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-[var(--text-muted)]">Add-ons Total</span>
              <span className="text-white">${addOnsTotal.toLocaleString()}</span>
            </div>
          )}

          {/* One-Time Subtotal */}
          {oneTimeSubtotal > 0 && (
            <div className="flex justify-between items-center text-sm pt-2 border-t border-[var(--border-subtle)]">
              <span className="text-white font-medium">One-Time Subtotal</span>
              <span className="text-white">${oneTimeSubtotal.toLocaleString()}</span>
            </div>
          )}

          {/* Timeline Premium */}
          {premiumPercent > 0 && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-[var(--accent-orange)]">Timeline Premium (+{premiumPercent}%)</span>
              <span className="text-[var(--accent-orange)]">+${timelinePremium.toLocaleString()}</span>
            </div>
          )}
        </div>

        {/* One-Time Total */}
        {oneTimeTotal > 0 && (
          <div className="pt-3 mt-3 border-t-2 border-[var(--accent-blue)]/50">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-[var(--accent-blue)]" />
              <span className="text-sm text-[var(--text-muted)]">ONE-TIME TOTAL</span>
            </div>
            <motion.div
              key={oneTimeTotal}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              className="text-2xl font-bold gradient-text"
            >
              {hasCustomQuote ? 'Custom Quote' : `$${oneTimeTotal.toLocaleString()}`}
            </motion.div>
          </div>
        )}

        {/* Monthly Section */}
        {retainer && retainer !== 'none' && monthlyTotal > 0 && (
          <div className="pt-3 mt-3 border-t-2 border-[var(--accent-teal)]/50">
            <div className="flex items-center gap-2 mb-2">
              <Repeat className="w-4 h-4 text-[var(--accent-teal)]" />
              <span className="text-sm text-[var(--text-muted)]">MONTHLY</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-[var(--text-muted)] text-sm">{retainerLabel}</span>
            </div>
            <motion.div
              key={monthlyTotal}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              className="text-2xl font-bold text-[var(--accent-teal)]"
            >
              ${monthlyTotal.toLocaleString()}
              <span className="text-base font-normal text-[var(--text-muted)]">/mo</span>
            </motion.div>
          </div>
        )}
      </div>

      {/* Go to Summary Button */}
      {currentStep < 13 && messagingGoal && messaging && (
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
