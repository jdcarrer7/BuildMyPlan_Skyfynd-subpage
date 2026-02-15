'use client';

import { useState } from 'react';
import type { QuoteJSON, ServiceDiscount, QuoteLevelDiscount } from '@/lib/types/admin';
import ServiceCard from './ServiceCard';
import DiscountModal from './DiscountModal';
import TotalsSummary from './TotalsSummary';

interface Props {
  quote: QuoteJSON;
  onSaveDiscount: (
    serviceDiscounts: ServiceDiscount[],
    quoteDiscount: QuoteLevelDiscount | null
  ) => Promise<void>;
}

export default function QuoteBreakdown({ quote, onSaveDiscount }: Props) {
  const [discountModalTarget, setDiscountModalTarget] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const serviceDiscounts = quote.discounts?.serviceDiscounts || [];
  const quoteDiscount = quote.discounts?.quoteDiscount || null;

  const getServiceDiscount = (serviceType: string): ServiceDiscount | undefined =>
    serviceDiscounts.find(d => d.serviceType === serviceType);

  const handleSaveDiscount = async (
    type: 'percentage' | 'fixed',
    value: number,
    appliesTo: 'one-time' | 'monthly' | 'both'
  ) => {
    setSaving(true);
    const target = discountModalTarget;

    if (target === '__quote__') {
      await onSaveDiscount(serviceDiscounts, { type, value, appliesTo });
    } else if (target) {
      const updated = serviceDiscounts.filter(d => d.serviceType !== target);
      if (value > 0) {
        updated.push({ serviceType: target as ServiceDiscount['serviceType'], type, value, appliesTo });
      }
      await onSaveDiscount(updated, quoteDiscount);
    }

    setSaving(false);
    setDiscountModalTarget(null);
  };

  const handleRemoveDiscount = async () => {
    setSaving(true);
    const target = discountModalTarget;

    if (target === '__quote__') {
      await onSaveDiscount(serviceDiscounts, null);
    } else if (target) {
      const updated = serviceDiscounts.filter(d => d.serviceType !== target);
      await onSaveDiscount(updated, quoteDiscount);
    }

    setSaving(false);
    setDiscountModalTarget(null);
  };

  const currentDiscount = discountModalTarget === '__quote__'
    ? quoteDiscount
    : discountModalTarget
      ? getServiceDiscount(discountModalTarget)
      : null;

  if (!quote.services || quote.services.length === 0) {
    return (
      <div className="card p-8 text-center">
        <p className="text-[#71717A]">No resolved service breakdown available for this quote.</p>
        <p className="text-xs text-[#52525B] mt-2">This quote may have been submitted before the config resolver was added.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {quote.services.map(service => (
        <ServiceCard
          key={service.serviceType}
          service={service}
          discount={getServiceDiscount(service.serviceType)}
          onAddDiscount={setDiscountModalTarget}
        />
      ))}

      <TotalsSummary
        quote={quote}
        onAddQuoteDiscount={() => setDiscountModalTarget('__quote__')}
      />

      {discountModalTarget && (
        <DiscountModal
          targetLabel={
            discountModalTarget === '__quote__'
              ? 'Entire Quote'
              : quote.services.find(s => s.serviceType === discountModalTarget)?.serviceLabel || discountModalTarget
          }
          currentDiscount={currentDiscount ?? undefined}
          saving={saving}
          onSave={handleSaveDiscount}
          onRemove={handleRemoveDiscount}
          onClose={() => setDiscountModalTarget(null)}
        />
      )}
    </div>
  );
}
