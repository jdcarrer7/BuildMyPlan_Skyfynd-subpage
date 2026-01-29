'use client';

import { motion } from 'framer-motion';
import { useContentStrategyBuilderStore } from '@/hooks/useContentStrategyBuilderStore';
import {
  contentGoalOptions,
  depthOptions,
  auditOptions,
  audienceOptions,
  channelOptions,
  editorialOptions,
  seoOptions,
  governanceOptions,
  measurementOptions,
  timelineOptions,
} from '@/data/contentStrategyBuilder';
import { Calculator, AlertCircle, TrendingUp, ArrowRight } from 'lucide-react';

interface ContentStrategyPriceSidebarProps {
  currentStep: number;
  onGoToSummary: () => void;
}

export default function ContentStrategyPriceSidebar({ currentStep, onGoToSummary }: ContentStrategyPriceSidebarProps) {
  const {
    contentGoal,
    depth,
    audit,
    audience,
    channels,
    editorial,
    seo,
    governance,
    measurement,
    selectedAddOns,
    timeline,
    timelineMultiplier,
    strategyFoundationSubtotal,
    planningOperationsSubtotal,
    addOnsTotal,
    projectSubtotal,
    timelinePremium,
    totalInvestment,
    hasCustomQuote,
  } = useContentStrategyBuilderStore();

  // Get labels
  const goalLabel = contentGoalOptions.find((g) => g.id === contentGoal)?.label;
  const depthLabel = depthOptions.find((d) => d.id === depth)?.label;
  const auditLabel = auditOptions.find((a) => a.id === audit)?.label;
  const audienceLabel = audienceOptions.find((a) => a.id === audience)?.label;
  const channelsLabel = channelOptions.find((c) => c.id === channels)?.label;
  const editorialLabel = editorialOptions.find((e) => e.id === editorial)?.label;
  const seoLabel = seoOptions.find((s) => s.id === seo)?.label;
  const governanceLabel = governanceOptions.find((g) => g.id === governance)?.label;
  const measurementLabel = measurementOptions.find((m) => m.id === measurement)?.label;
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
        {contentGoal && (
          <div className="flex justify-between text-sm">
            <span className="text-[var(--text-muted)]">Goal</span>
            <span className="text-[var(--text-secondary)]">{goalLabel}</span>
          </div>
        )}

        {/* Strategy Foundation */}
        {(depth || audit || audience || channels || seo) && (
          <div className="pt-2 border-t border-[var(--border-subtle)]">
            <p className="text-xs text-[var(--accent-blue)] font-medium mb-2">Strategy Foundation</p>
            {depth && (
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-muted)]">Depth</span>
                <span className="text-[var(--text-secondary)]">{depthLabel}</span>
              </div>
            )}
            {audit && audit !== 'none' && (
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-muted)]">Audit</span>
                <span className="text-[var(--text-secondary)]">{auditLabel}</span>
              </div>
            )}
            {audience && audience !== 'existing' && (
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-muted)]">Audience</span>
                <span className="text-[var(--text-secondary)]">{audienceLabel}</span>
              </div>
            )}
            {channels && (
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-muted)]">Channels</span>
                <span className="text-[var(--text-secondary)]">{channelsLabel}</span>
              </div>
            )}
            {seo && seo !== 'none' && (
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-muted)]">SEO</span>
                <span className="text-[var(--text-secondary)]">{seoLabel}</span>
              </div>
            )}
          </div>
        )}

        {/* Planning & Operations */}
        {(editorial || governance || measurement) && (
          <div className="pt-2 border-t border-[var(--border-subtle)]">
            <p className="text-xs text-[var(--accent-teal)] font-medium mb-2">Planning & Operations</p>
            {editorial && (
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-muted)]">Editorial</span>
                <span className="text-[var(--text-secondary)]">{editorialLabel}</span>
              </div>
            )}
            {governance && governance !== 'none' && (
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-muted)]">Governance</span>
                <span className="text-[var(--text-secondary)]">{governanceLabel}</span>
              </div>
            )}
            {measurement && (
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-muted)]">Measurement</span>
                <span className="text-[var(--text-secondary)]">{measurementLabel}</span>
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
        {/* Strategy Foundation Subtotal */}
        <div className="space-y-2">
          {strategyFoundationSubtotal > 0 && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-[var(--text-muted)]">Strategy Foundation</span>
              <span className="text-white">${strategyFoundationSubtotal.toLocaleString()}</span>
            </div>
          )}

          {/* Planning & Operations Subtotal */}
          {planningOperationsSubtotal > 0 && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-[var(--text-muted)]">Planning & Operations</span>
              <span className="text-white">${planningOperationsSubtotal.toLocaleString()}</span>
            </div>
          )}

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
      {currentStep < 12 && contentGoal && depth && (
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
