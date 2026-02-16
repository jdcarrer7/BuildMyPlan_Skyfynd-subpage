import type { QuoteJSON } from '@/lib/types/admin';

// ── Portal status ──

export type PortalStatus =
  | 'sent'
  | 'email_verified'
  | 'quote_viewed'
  | 'change_requested'
  | 'quote_accepted'
  | 'contract_signed'
  | 'payment_completed'
  | 'project_completed';

// ── Database row types ──

export interface Portal {
  id: string;
  qr_number: string;
  client_name: string;
  client_email: string;
  client_company: string;
  client_phone: string;
  quote_data: QuoteJSON;
  status: PortalStatus;
  expires_at: string;
  created_at: string;
  updated_at: string;
}

export interface PortalVerification {
  id: string;
  portal_id: string;
  email: string;
  code: string;
  expires_at: string;
  verified: boolean;
  attempts: number;
  created_at: string;
}

export interface PortalChangeRequest {
  id: string;
  portal_id: string;
  message: string;
  admin_response: string | null;
  status: 'pending' | 'reviewed' | 'resolved';
  created_at: string;
}

export interface PortalSignature {
  id: string;
  portal_id: string;
  signature_data_url: string;
  client_name: string;
  client_email: string;
  ip_address: string | null;
  user_agent: string | null;
  signed_at: string;
}

export interface PortalPayment {
  id: string;
  portal_id: string;
  stripe_session_id: string;
  stripe_payment_intent_id: string | null;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paid_at: string | null;
  created_at: string;
}

// ── Admin dashboard portal summary ──

export interface PortalSummary {
  id: string;
  qr_number: string;
  client_name: string;
  client_email: string;
  status: PortalStatus;
  created_at: string;
  expires_at: string;
}
