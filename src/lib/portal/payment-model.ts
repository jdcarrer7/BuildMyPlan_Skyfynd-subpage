export type PaymentModel = 'one-time' | 'subscription-only' | 'mixed';

export function getPaymentModel(totals: { oneTimeTotal: number; monthlyTotal: number }): PaymentModel {
  const hasOneTime = (totals.oneTimeTotal || 0) > 0;
  const hasMonthly = (totals.monthlyTotal || 0) > 0;
  if (hasMonthly && !hasOneTime) return 'subscription-only';
  if (hasMonthly && hasOneTime) return 'mixed';
  return 'one-time';
}

/**
 * Calculate the deposit amount (one-time charges only).
 * Subscription-only quotes have no deposit.
 */
export function getDepositAmount(totals: { oneTimeTotal: number; monthlyTotal: number; grandTotal: number }): number {
  const model = getPaymentModel(totals);
  if (model === 'subscription-only') return 0;
  if (model === 'mixed') return Math.round(totals.oneTimeTotal * 0.5);
  return Math.round(totals.grandTotal * 0.5);
}
