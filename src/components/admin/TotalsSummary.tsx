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
    <div className="bg-[#1c1825] rounded-xl border border-[#2a2435] p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Quote Totals</h3>
        <button
          onClick={onAddQuoteDiscount}
          className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-[#8b5cf6] border border-[#8b5cf6]/30 rounded-lg hover:bg-[#8b5cf6]/10 transition-colors"
        >
          <Tag className="w-3.5 h-3.5" />
          {discounts?.quoteDiscount ? 'Edit Quote Discount' : 'Quote-Level Discount'}
        </button>
      </div>

      <div className="space-y-3">
        {totals.oneTimeTotal > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-[#a0a0a0]">One-Time Total</span>
            <span className="text-white font-medium">${totals.oneTimeTotal.toLocaleString()}</span>
          </div>
        )}

        {totals.monthlyTotal > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-[#a0a0a0]">Monthly Total</span>
            <span className="text-[#8b5cf6] font-medium">${totals.monthlyTotal.toLocaleString()}/mo</span>
          </div>
        )}

        {hasDiscount && (
          <>
            <div className="border-t border-[#2a2435] pt-3">
              <div className="flex justify-between text-sm">
                <span className="text-green-400">Discount ({totals.discountPercentage}%)</span>
                <span className="text-green-400 font-medium">-${totalSaved.toLocaleString()}</span>
              </div>
            </div>
          </>
        )}

        <div className="border-t border-[#2a2435] pt-3">
          <div className="flex justify-between">
            <span className="text-white font-semibold">Grand Total</span>
            <span className="text-xl font-bold text-white">${totals.grandTotal.toLocaleString()}</span>
          </div>
        </div>

        {/* Due Today */}
        {(totals.oneTimeTotal + totals.monthlyTotal) > 0 && (
          <div className="border-t-2 border-[#8b5cf6]/50 pt-3">
            <div className="flex justify-between items-center">
              <span className="text-white font-bold">Due Today</span>
              <span className="text-xl font-bold" style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 50%, #ec4899 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                ${(totals.oneTimeTotal + totals.monthlyTotal).toLocaleString()}
              </span>
            </div>
            {totals.monthlyTotal > 0 && (
              <p className="text-xs text-[#888] mt-1">One-time + first month&apos;s subscription</p>
            )}
          </div>
        )}

        {totals.hasCustomQuote && (
          <div className="mt-2 px-3 py-2 bg-[#f59e0b]/10 border border-[#f59e0b]/30 rounded-lg">
            <p className="text-xs text-[#f59e0b]">This quote contains items that require custom pricing. The displayed total may not reflect the final price.</p>
          </div>
        )}

        {hasDiscount && (
          <div className="mt-2 px-4 py-3 rounded-lg text-center" style={{ background: 'linear-gradient(135deg, #8b5cf6/10 0%, #d946ef/10 50%, #ec4899/10 100%)', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
            <p className="text-sm text-white font-medium">
              You Saved: <span className="text-[#8b5cf6] font-bold">${totalSaved.toLocaleString()}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
