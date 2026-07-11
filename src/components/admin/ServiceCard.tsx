'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, Tag } from 'lucide-react';
import type { ResolvedServiceConfig, ResolvedStep, ServiceDiscount } from '@/lib/types/admin';

interface Props {
  service: ResolvedServiceConfig;
  discount?: ServiceDiscount;
  onAddDiscount: (serviceType: string) => void;
}

function formatPrice(price: number | null, isRecurring?: boolean): string {
  if (price === null) return 'Custom';
  if (price === 0) return 'Included';
  const formatted = '$' + price.toLocaleString();
  return isRecurring ? `${formatted}/mo` : formatted;
}

function StepRow({ step, depth = 0 }: { step: ResolvedStep; depth?: number }) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = step.children && step.children.length > 0;

  return (
    <>
      <tr className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
        <td className="py-2 px-3 text-sm text-[#A1A1AA]" style={{ paddingLeft: `${12 + depth * 16}px` }}>
          {hasChildren && (
            <button onClick={() => setExpanded(!expanded)} className="mr-1 inline-block align-middle">
              {expanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </button>
          )}
          {step.stepName}
        </td>
        <td className="py-2 px-3 text-sm text-white truncate">{step.selectedLabel}</td>
        <td className="py-2 px-3 text-sm text-right tabular-nums">
          {step.isCustomQuote ? (
            <span className="text-[#F59E0B]">Custom</span>
          ) : step.priceImpact !== null ? (
            <span className={step.priceImpact > 0 ? 'text-white' : 'text-[#71717A]'}>
              {formatPrice(step.priceImpact, step.isRecurring)}
            </span>
          ) : (
            <span className="text-[#71717A]">&mdash;</span>
          )}
        </td>
      </tr>
      {hasChildren && expanded && step.children!.map((child, i) => (
        <StepRow key={i} step={child} depth={depth + 1} />
      ))}
    </>
  );
}

export default function ServiceCard({ service, discount, onAddDiscount }: Props) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="card overflow-hidden admin-service-tile">
      {/* Header */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-3">
          {collapsed ? (
            <ChevronRight className="w-5 h-5 text-[#3B82F6]" />
          ) : (
            <ChevronDown className="w-5 h-5 text-[#3B82F6]" />
          )}
          <h3 className="text-lg font-semibold text-[#FAFAFA] font-serif">{service.serviceLabel}</h3>
          {service.hasCustomQuote && (
            <span className="px-2 py-0.5 text-xs font-medium bg-[#F59E0B]/20 text-[#F59E0B] rounded-full">
              Custom Quote
            </span>
          )}
        </div>
        <div className="flex items-center gap-4 text-sm">
          {service.oneTimeTotal > 0 && (
            <span className="text-white font-medium">${service.oneTimeTotal.toLocaleString()}</span>
          )}
          {service.monthlyTotal > 0 && (
            <span className="text-[#3B82F6] font-medium">${service.monthlyTotal.toLocaleString()}/mo</span>
          )}
        </div>
      </button>

      {/* Body */}
      {!collapsed && (
        <div className="border-t border-white/[0.06]">
          <table className="w-full" style={{ tableLayout: 'fixed' }}>
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="py-2 px-3 text-left text-xs font-medium text-[#71717A] uppercase" style={{ width: '45%' }}>Step</th>
                <th className="py-2 px-3 text-left text-xs font-medium text-[#71717A] uppercase" style={{ width: '40%' }}>Selected</th>
                <th className="py-2 px-3 text-right text-xs font-medium text-[#71717A] uppercase" style={{ width: '15%' }}>Price</th>
              </tr>
            </thead>
            <tbody>
              {service.steps.map((step, i) => (
                <StepRow key={i} step={step} />
              ))}
            </tbody>
          </table>

          {/* Subtotals + Discount */}
          <div className="p-4 border-t border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => onAddDiscount(service.serviceType)}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-[#3B82F6] border border-[#3B82F6]/30 rounded-lg hover:bg-[#3B82F6]/10 transition-colors"
              >
                <Tag className="w-3.5 h-3.5" />
                {discount ? 'Edit Discount' : 'Add Discount'}
              </button>
              {discount && (
                <span className="text-xs text-[var(--accent-blue-light)]">
                  {discount.type === 'percentage' ? `${discount.value}%` : `$${discount.value}`} off
                  {discount.appliesTo !== 'both' ? ` (${discount.appliesTo})` : ''}
                </span>
              )}
            </div>
            <div className="text-right">
              {service.oneTimeTotal > 0 && (
                <div className="text-sm text-white">One-time: <span className="font-semibold">${service.oneTimeTotal.toLocaleString()}</span></div>
              )}
              {service.monthlyTotal > 0 && (
                <div className="text-sm text-[#3B82F6]">Monthly: <span className="font-semibold">${service.monthlyTotal.toLocaleString()}/mo</span></div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
