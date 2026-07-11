'use client';

import { Tag } from 'lucide-react';
import type { QuoteJSON } from '@/lib/types/admin';

interface Props {
  quote: QuoteJSON;
  onAddQuoteDiscount: () => void;
}

export default function TotalsSummary({ quote, onAddQuoteDiscount }: Props) {
  const { totals, discounts } = quote;
  const totalSaved = discounts?.totalSaved || 0;
  const hasDiscount = totalSaved > 0;

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[#FAFAFA] font-serif">Quote Totals</h3>
        <button
          onClick={onAddQuoteDiscount}
          className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-[#3B82F6] border border-[#3B82F6]/30 rounded-lg hover:bg-[#3B82F6]/10 transition-colors"
        >
          <Tag className="w-3.5 h-3.5" />
          {discounts?.quoteDiscount ? 'Edit Quote Discount' : 'Quote-Level Discount'}
        </button>
      </div>

      <div className="space-y-3">
        {totals.oneTimeTotal > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-[#A1A1AA]">Project Total</span>
            <span className="text-white font-medium">${totals.oneTimeTotal.toLocaleString()}</span>
          </div>
        )}

        {totals.monthlyTotal > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-[#A1A1AA]">Monthly Total</span>
            <span className="text-[#3B82F6] font-medium">${totals.monthlyTotal.toLocaleString()}/mo</span>
          </div>
        )}

        {hasDiscount && (
          <div className="border-t border-white/[0.06] pt-3">
            <div className="flex justify-between text-sm">
              <span className="text-[var(--accent-blue-light)]">Discount ({totals.discountPercentage}%)</span>
              <span className="text-[var(--accent-blue-light)] font-medium">-${totalSaved.toLocaleString()}</span>
            </div>
          </div>
        )}

        <div className="border-t border-white/[0.06] pt-3">
          <div className="flex justify-between">
            <span className="text-white font-semibold">Grand Total</span>
            <span className="text-xl font-bold text-white">${totals.grandTotal.toLocaleString()}</span>
          </div>
        </div>

        {/* Payment Structure */}
        {totals.grandTotal > 0 && (
          <div className="border-t-2 border-[#3B82F6]/30 pt-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-white font-bold">Deposit (50%)</span>
              <span className="text-xl font-bold gradient-text">
                ${Math.ceil(totals.grandTotal / 2).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#A1A1AA] font-medium">Due on Completion (50%)</span>
              <span className="text-lg font-semibold text-[#A1A1AA]">
                ${Math.floor(totals.grandTotal / 2).toLocaleString()}
              </span>
            </div>
            <p className="text-xs text-[#71717A] mt-2">50% deposit to begin &middot; 50% upon project completion</p>
          </div>
        )}

        {totals.hasCustomQuote && (
          <div className="mt-2 px-3 py-2 bg-[#F59E0B]/10 border border-[#F59E0B]/30 rounded-lg">
            <p className="text-xs text-[#F59E0B]">This quote contains items that require custom pricing. The displayed total may not reflect the final price.</p>
          </div>
        )}

        {hasDiscount && (
          <div className="mt-2 px-4 py-3 rounded-lg text-center" style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(16, 185, 129, 0.08) 100%)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
            <p className="text-sm text-white font-medium">
              You Saved: <span className="text-[var(--accent-blue-light)] font-bold">${totalSaved.toLocaleString()}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
