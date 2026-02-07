export interface TierServiceDetail {
  serviceId: string;
  serviceName: string;
  tier: string;
  addOns: string[];
  subtotal: number;
}

export interface BuilderServiceDetail {
  serviceType: string;
  serviceLabel: string;
  oneTimeTotal: number;
  monthlyTotal: number;
  hasCustomQuote: boolean;
  config: Record<string, unknown>;
}

export interface QuoteRequestPayload {
  source: 'Main Page' | 'Rent Me a Site' | 'RentMe' | 'Custom Builder';
  name: string;
  email: string;
  company: string;
  phone: string;
  notes: string;
  serviceCount: number;
  serviceNames: string;
  hasCustomQuote: boolean;
  oneTimeTotal: number;
  monthlyTotal: number;
  discountPercentage: number;
  grandTotal: number;
  servicesDetail: TierServiceDetail[] | BuilderServiceDetail[];
  resolvedServices?: import('@/lib/types/admin').ResolvedServiceConfig[];
}

export interface QuoteSubmissionResult {
  success: boolean;
  message: string;
}
