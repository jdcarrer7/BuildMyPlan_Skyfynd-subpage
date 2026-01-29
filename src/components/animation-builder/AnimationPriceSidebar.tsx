'use client';

import { motion } from 'framer-motion';
import { useAnimationBuilderStore } from '@/hooks/useAnimationBuilderStore';
import { Film, AlertCircle, ArrowRight } from 'lucide-react';

interface AnimationPriceSidebarProps {
  currentStep?: number;
  onGoToSummary?: () => void;
}

const SUMMARY_STEP = 9;

export default function AnimationPriceSidebar({ currentStep, onGoToSummary }: AnimationPriceSidebarProps) {
  const {
    subtotal,
    rushFee,
    total,
    hasCustomQuote,
    timelineMultiplier,
  } = useAnimationBuilderStore();

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="card p-6 sticky top-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <Film className="w-5 h-5 text-[var(--accent-blue)]" />
        <h3 className="text-lg font-semibold text-white">Animation Estimate</h3>
      </div>

      {hasCustomQuote ? (
        <div className="flex items-start gap-3 p-4 bg-[var(--accent-orange)]/10 border border-[var(--accent-orange)]/30 rounded-lg mb-4">
          <AlertCircle className="w-5 h-5 text-[var(--accent-orange)] shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-white font-medium">Custom Quote Required</p>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Some of your selections require custom pricing. We&apos;ll provide a detailed quote.
            </p>
          </div>
        </div>
      ) : null}

      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-[var(--text-secondary)]">Subtotal</span>
          <span className="text-white font-medium">
            {hasCustomQuote ? 'TBD' : `$${subtotal.toLocaleString()}`}
          </span>
        </div>

        {rushFee > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-[var(--accent-orange)]">
              Rush Fee ({Math.round((timelineMultiplier - 1) * 100)}%)
            </span>
            <span className="text-[var(--accent-orange)]">
              +${rushFee.toLocaleString()}
            </span>
          </div>
        )}

        <div className="border-t border-[var(--border-subtle)] pt-3">
          <div className="flex justify-between">
            <span className="text-white font-semibold">Estimated Total</span>
            <motion.span
              key={total}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              className="text-xl font-bold gradient-text"
            >
              {hasCustomQuote ? 'Custom' : `$${total.toLocaleString()}`}
            </motion.span>
          </div>
        </div>
      </div>

      <p className="text-[10px] text-[var(--text-muted)] mt-4">
        *Estimate based on selections. Final price confirmed after consultation.
      </p>

      {/* Go to Summary Button - hidden on summary step */}
      {currentStep !== undefined && currentStep !== SUMMARY_STEP && onGoToSummary && (
        <button
          onClick={onGoToSummary}
          className="w-full mt-4 py-2.5 px-4 bg-[var(--bg-card-hover)] hover:bg-[var(--accent-blue)]/20 border border-[var(--border-subtle)] hover:border-[var(--accent-blue)]/50 rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:text-white transition-all flex items-center justify-center gap-2 group"
        >
          Go to Summary
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      )}
    </motion.div>
  );
}
