import type { ServiceType } from '@/hooks/useUnifiedQuoteStore';

// ── Resolved config types (step-by-step breakdown for admin viewing) ──

export interface ResolvedStep {
  stepName: string;
  selectedLabel: string;
  selectedId: string | null;
  priceImpact: number | null;
  isRecurring?: boolean;
  isCustomQuote?: boolean;
  children?: ResolvedStep[];
}

export interface ResolvedServiceConfig {
  serviceType: ServiceType;
  serviceLabel: string;
  steps: ResolvedStep[];
  oneTimeTotal: number;
  monthlyTotal: number;
  hasCustomQuote: boolean;
}

// ── Discount types ──

export interface ServiceDiscount {
  serviceType: ServiceType;
  type: 'percentage' | 'fixed';
  value: number;
  appliesTo: 'one-time' | 'monthly' | 'both';
}

export interface QuoteLevelDiscount {
  type: 'percentage' | 'fixed';
  value: number;
  appliesTo: 'one-time' | 'monthly' | 'both';
}

// ── Quote JSON stored in Google Drive ──

export interface QuoteJSON {
  qrNumber: string;
  customerId: string;
  submittedAt: string;
  source: string;
  customer: {
    name: string;
    email: string;
    company: string;
    phone: string;
    notes: string;
  };
  services: ResolvedServiceConfig[];
  totals: {
    oneTimeTotal: number;
    monthlyTotal: number;
    hasCustomQuote: boolean;
    discountPercentage: number;
    grandTotal: number;
  };
  discounts?: {
    serviceDiscounts: ServiceDiscount[];
    quoteDiscount: QuoteLevelDiscount | null;
    totalSaved: number;
  };
  rawPayload: Record<string, unknown>;
}

// ── Master Lead Sheet row ──

export interface MasterLeadRow {
  qrNumber: string;
  qrLink: string;
  customerId: string;
  date: string;
  timestamp: string;
  source: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  serviceCount: number;
  serviceNames: string;
  oneTimeTotal: number;
  monthlyTotal: number;
  discountPercent: number;
  grandTotal: number;
  hasCustomQuote: boolean;
  isCustomer: boolean;
  serviceStarted: string;
  serviceEnded: string;
  isTrashed: boolean;
  notes: string;
}

// ── Customer Sheet row ──

export interface CustomerSheetRow {
  customerId: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  quoteCount: number;
  totalSpent: number;
  serviceStarted: string;
  serviceEnded: string;
  lastQuoteDate: string;
}

// ── Auth types ──

export interface SessionData {
  isLoggedIn: boolean;
  email: string;
  name: string;
}

export interface AdminUser {
  email: string;
  password: string;
  name: string;
}
