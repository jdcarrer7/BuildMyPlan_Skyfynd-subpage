'use client';

import type { QuoteJSON, ResolvedServiceConfig, ResolvedStep } from '@/lib/types/admin';
import { getPaymentModel } from '@/lib/portal/payment-model';

interface QuoteSummaryProps {
  quote: QuoteJSON;
}

function fmt(n: number): string {
  return Number(n).toLocaleString('en-US');
}

function StepRow({ step, indent = 0 }: { step: ResolvedStep; indent?: number }) {
  if (step.selectedId === null && step.children) {
    return (
      <>
        <tr>
          <td
            colSpan={3}
            className="pt-3 pb-1 text-xs font-bold uppercase text-[#71717A]"
          >
            {step.stepName}
          </td>
        </tr>
        {step.children.map((child, i) => (
          <tr key={i}>
            <td className="py-1 text-sm text-[#71717A]" style={{ paddingLeft: indent + 12 }}>
              {child.stepName}
            </td>
            <td className="py-1 text-sm text-[#A1A1AA]">{child.selectedLabel}</td>
            <td className="py-1 text-sm text-right text-[#60AFFA] font-semibold whitespace-nowrap">
              {child.priceImpact !== null && child.priceImpact > 0
                ? child.isRecurring
                  ? `$${fmt(child.priceImpact)}/mo`
                  : `$${fmt(child.priceImpact)}`
                : ''}
            </td>
          </tr>
        ))}
      </>
    );
  }

  return (
    <tr>
      <td className="py-1 text-sm text-[#71717A]" style={{ paddingLeft: indent + 4 }}>
        {step.stepName}
      </td>
      <td className="py-1 text-sm text-[#A1A1AA]">{step.selectedLabel}</td>
      <td className="py-1 text-sm text-right text-[#60AFFA] font-semibold whitespace-nowrap">
        {step.priceImpact !== null && step.priceImpact > 0
          ? step.isRecurring
            ? `$${fmt(step.priceImpact)}/mo`
            : `$${fmt(step.priceImpact)}`
          : ''}
      </td>
    </tr>
  );
}

function ServiceBlock({ service }: { service: ResolvedServiceConfig }) {
  const prices: string[] = [];
  if (service.oneTimeTotal > 0) prices.push(`$${fmt(service.oneTimeTotal)}`);
  if (service.monthlyTotal > 0) prices.push(`$${fmt(service.monthlyTotal)}/mo`);

  return (
    <div className="mb-5">
      {/* Service header */}
      <div className="flex items-center justify-between bg-white/[0.04] rounded-lg px-4 py-2.5">
        <span className="font-bold text-sm text-[#FAFAFA]">{service.serviceLabel}</span>
        <span className="font-bold text-sm text-[#60AFFA]">{prices.join(' + ') || '$0'}</span>
      </div>

      {/* Steps */}
      {service.steps.length > 0 && (
        <table className="w-full mt-1 text-sm">
          <tbody>
            {service.steps.map((step, i) => (
              <StepRow key={i} step={step} />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default function QuoteSummary({ quote }: QuoteSummaryProps) {
  const services: ResolvedServiceConfig[] = quote.services || [];
  const totals = quote.totals || { oneTimeTotal: 0, monthlyTotal: 0, grandTotal: 0, discountPercentage: 0, hasCustomQuote: false };
  const discounts = quote.discounts || null;
  const dateStr = quote.submittedAt
    ? new Date(quote.submittedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : '';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2
            className="text-2xl font-semibold text-[#FAFAFA]"
            style={{ fontFamily: "'Source Serif Pro', Georgia, serif" }}
          >
            Quote Summary
          </h2>
          <p className="text-[#71717A] text-sm mt-1">
            {quote.qrNumber} {dateStr && <>&#8226; {dateStr}</>}
          </p>
        </div>
      </div>

      {/* Service Breakdown */}
      <div>
        <h3 className="text-sm font-semibold text-[#A1A1AA] uppercase tracking-wider mb-4 pb-2 border-b border-white/[0.06]">
          Service Breakdown
        </h3>
        {services.map((svc, i) => (
          <ServiceBlock key={i} service={svc} />
        ))}
      </div>

      {/* Price Summary Table */}
      <div>
        <h3 className="text-sm font-semibold text-[#A1A1AA] uppercase tracking-wider mb-4 pb-2 border-b border-white/[0.06]">
          Price Summary
        </h3>
        <div className="rounded-lg border border-white/[0.06] overflow-x-auto">
          {/* Header row */}
          <div className="grid grid-cols-3 bg-white/[0.04] px-4 py-2.5 text-xs font-bold uppercase text-[#71717A] min-w-[320px]">
            <span>Service</span>
            <span className="text-center">One-Time</span>
            <span className="text-right">Monthly</span>
          </div>

          {/* Service rows */}
          {services.map((svc, i) => (
            <div
              key={i}
              className={`grid grid-cols-3 px-4 py-2 text-sm ${i % 2 === 0 ? '' : 'bg-white/[0.02]'}`}
            >
              <span className="text-[#A1A1AA] min-w-0 truncate">{svc.serviceLabel}</span>
              <span className="text-center text-[#A1A1AA]">
                {svc.oneTimeTotal > 0 ? `$${fmt(svc.oneTimeTotal)}` : '\u2014'}
              </span>
              <span className="text-right text-[#A1A1AA]">
                {svc.monthlyTotal > 0 ? `$${fmt(svc.monthlyTotal)}/mo` : '\u2014'}
              </span>
            </div>
          ))}

          {/* Totals */}
          <div className="grid grid-cols-3 bg-white/[0.04] px-4 py-2.5 border-t border-white/[0.06] text-sm font-semibold">
            <span className="text-[#FAFAFA]">Project Total</span>
            <span className="text-center text-[#FAFAFA]">${fmt(totals.oneTimeTotal || 0)}</span>
            <span></span>
          </div>

          {(totals.monthlyTotal || 0) > 0 && (
            <div className="grid grid-cols-3 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold">
              <span className="text-[#FAFAFA]">Total Monthly</span>
              <span></span>
              <span className="text-right text-[#FAFAFA]">${fmt(totals.monthlyTotal)}/mo</span>
            </div>
          )}

          {discounts && discounts.totalSaved > 0 && (
            <div className="grid grid-cols-3 bg-[#10B981]/5 px-4 py-2.5 text-sm font-semibold">
              <span className="text-[#10B981]">Discount ({totals.discountPercentage || 0}%)</span>
              <span className="text-right col-span-2 text-[#10B981]">
                -${fmt(discounts.totalSaved)}
              </span>
            </div>
          )}

          {/* Grand Total */}
          {(() => {
            const pm = getPaymentModel(totals);

            if (pm === 'subscription-only') {
              return (
                <>
                  <div
                    className="grid grid-cols-2 px-4 py-4 text-white"
                    style={{ background: 'linear-gradient(to right, rgba(167,139,250,0.75) 0%, rgba(96,175,250,0.85) 40%, rgba(52,211,153,0.8) 100%)' }}
                  >
                    <span className="font-bold text-base">Monthly Total</span>
                    <span className="text-right font-bold text-xl">${fmt(totals.monthlyTotal)}/mo</span>
                  </div>
                  <div className="grid grid-cols-2 px-4 py-2.5 bg-white/[0.03] text-sm">
                    <span className="text-[#A1A1AA] font-medium">Monthly Subscription</span>
                    <span className="text-right text-[#FAFAFA] font-semibold">${fmt(totals.monthlyTotal)}/mo</span>
                  </div>
                </>
              );
            }

            if (pm === 'mixed') {
              const depositAmt = Math.round((totals.oneTimeTotal || 0) * 0.5);
              return (
                <>
                  <div
                    className="grid grid-cols-2 px-4 py-4 text-white"
                    style={{ background: 'linear-gradient(to right, rgba(167,139,250,0.75) 0%, rgba(96,175,250,0.85) 40%, rgba(52,211,153,0.8) 100%)' }}
                  >
                    <span className="font-bold text-base">Project Total</span>
                    <span className="text-right font-bold text-xl">${fmt(totals.oneTimeTotal || 0)} + ${fmt(totals.monthlyTotal)}/mo</span>
                  </div>
                  <div className="grid grid-cols-2 px-4 py-2.5 bg-white/[0.03] text-sm">
                    <span className="text-[#A1A1AA] font-medium">Deposit (50% of one-time)</span>
                    <span className="text-right text-[#FAFAFA] font-semibold">${fmt(depositAmt)}</span>
                  </div>
                  <div className="grid grid-cols-2 px-4 py-2.5 text-sm">
                    <span className="text-[#71717A] font-medium">Due on Completion</span>
                    <span className="text-right text-[#A1A1AA] font-semibold">${fmt((totals.oneTimeTotal || 0) - depositAmt)}</span>
                  </div>
                  <div className="grid grid-cols-2 px-4 py-2.5 bg-white/[0.03] text-sm">
                    <span className="text-[#A1A1AA] font-medium">Monthly Subscription</span>
                    <span className="text-right text-[#FAFAFA] font-semibold">${fmt(totals.monthlyTotal)}/mo</span>
                  </div>
                </>
              );
            }

            // One-time only
            return (
              <>
                <div
                  className="grid grid-cols-2 px-4 py-4 text-white"
                  style={{ background: 'linear-gradient(to right, rgba(167,139,250,0.75) 0%, rgba(96,175,250,0.85) 40%, rgba(52,211,153,0.8) 100%)' }}
                >
                  <span className="font-bold text-base">Project Total</span>
                  <span className="text-right font-bold text-xl">${fmt(totals.grandTotal || 0)}</span>
                </div>
                {(totals.grandTotal || 0) > 0 && (
                  <>
                    <div className="grid grid-cols-2 px-4 py-2.5 bg-white/[0.03] text-sm">
                      <span className="text-[#A1A1AA] font-medium">Deposit (50%)</span>
                      <span className="text-right text-[#FAFAFA] font-semibold">${fmt(Math.ceil((totals.grandTotal || 0) / 2))}</span>
                    </div>
                    <div className="grid grid-cols-2 px-4 py-2.5 text-sm">
                      <span className="text-[#71717A] font-medium">Due on Completion (50%)</span>
                      <span className="text-right text-[#A1A1AA] font-semibold">${fmt(Math.floor((totals.grandTotal || 0) / 2))}</span>
                    </div>
                  </>
                )}
              </>
            );
          })()}
        </div>
      </div>

      {/* Client Notes */}
      {quote.customer?.notes && (
        <div>
          <h3 className="text-sm font-semibold text-[#A1A1AA] uppercase tracking-wider mb-3 pb-2 border-b border-white/[0.06]">
            Your Notes
          </h3>
          <p className="text-[#A1A1AA] text-sm bg-white/[0.03] rounded-lg p-4">
            {quote.customer.notes}
          </p>
        </div>
      )}

      <p className="text-[#52525B] text-xs text-center italic">
        Price may vary based on final project specifications. This is an estimate and not a binding contract.
      </p>
    </div>
  );
}
