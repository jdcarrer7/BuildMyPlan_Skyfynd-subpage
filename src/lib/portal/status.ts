import type { PortalStatus } from '@/lib/supabase/types';

const VALID_TRANSITIONS: Record<PortalStatus, PortalStatus[]> = {
  sent: ['email_verified'],
  email_verified: ['quote_viewed'],
  quote_viewed: ['quote_accepted', 'change_requested'],
  change_requested: ['quote_viewed', 'quote_accepted'],
  quote_accepted: ['contract_signed'],
  contract_signed: ['payment_completed'],
  payment_completed: ['project_completed'],
  project_completed: [],
};

export function canTransitionTo(current: PortalStatus, next: PortalStatus): boolean {
  return VALID_TRANSITIONS[current]?.includes(next) ?? false;
}

export const STATUS_LABELS: Record<PortalStatus, string> = {
  sent: 'Sent',
  email_verified: 'Verified',
  quote_viewed: 'Viewed',
  change_requested: 'Changes Requested',
  quote_accepted: 'Accepted',
  contract_signed: 'Signed',
  payment_completed: 'Deposit Paid',
  project_completed: 'Completed',
};

export const STATUS_COLORS: Record<PortalStatus, string> = {
  sent: '#71717A',
  email_verified: '#3B82F6',
  quote_viewed: '#8B5CF6',
  change_requested: '#F59E0B',
  quote_accepted: '#10B981',
  contract_signed: '#22C55E',
  payment_completed: '#F59E0B',
  project_completed: '#3B82F6',
};
