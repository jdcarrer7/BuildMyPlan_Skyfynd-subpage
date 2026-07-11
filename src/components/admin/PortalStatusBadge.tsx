'use client';

import type { PortalStatus } from '@/lib/supabase/types';
import { STATUS_LABELS, STATUS_COLORS } from '@/lib/portal/status';

interface Props {
  status: PortalStatus;
  size?: 'sm' | 'md';
  hasFinalPayment?: boolean;
}

export default function PortalStatusBadge({ status, size = 'sm', hasFinalPayment }: Props) {
  const isFullyPaid = status === 'payment_completed' && hasFinalPayment;
  const label = isFullyPaid ? 'Fully Paid' : STATUS_LABELS[status] || status;
  const color = isFullyPaid ? '#60A5FA' : STATUS_COLORS[status] || '#71717A';

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ${
        size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-0.5'
      }`}
      style={{
        color,
        backgroundColor: `${color}15`,
        border: `1px solid ${color}30`,
      }}
    >
      {label}
    </span>
  );
}
