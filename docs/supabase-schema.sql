-- ══════════════════════════════════════════════
-- SkyFynd Client Portal — Supabase Schema
-- Run this in Supabase SQL Editor
-- ══════════════════════════════════════════════

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Portal: main record linking to a GAS quote ──

CREATE TABLE portals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  qr_number TEXT NOT NULL,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_company TEXT DEFAULT '',
  client_phone TEXT DEFAULT '',
  quote_data JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'sent'
    CHECK (status IN (
      'sent',
      'email_verified',
      'quote_viewed',
      'change_requested',
      'quote_accepted',
      'contract_signed',
      'payment_completed'
    )),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '30 days'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_portals_qr_number ON portals(qr_number);
CREATE INDEX idx_portals_status ON portals(status);

-- ── Email verification codes ──

CREATE TABLE portal_verification (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  portal_id UUID NOT NULL REFERENCES portals(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  code TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '10 minutes'),
  verified BOOLEAN NOT NULL DEFAULT FALSE,
  attempts INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_portal_verification_portal_id ON portal_verification(portal_id);

-- ── Change requests from client ──

CREATE TABLE portal_change_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  portal_id UUID NOT NULL REFERENCES portals(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  admin_response TEXT,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'reviewed', 'resolved')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_portal_change_requests_portal_id ON portal_change_requests(portal_id);

-- ── Contract signatures (audit trail) ──

CREATE TABLE portal_signatures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  portal_id UUID NOT NULL REFERENCES portals(id) ON DELETE CASCADE UNIQUE,
  signature_data_url TEXT NOT NULL,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  signed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_portal_signatures_portal_id ON portal_signatures(portal_id);

-- ── Stripe payment records ──

CREATE TABLE portal_payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  portal_id UUID NOT NULL REFERENCES portals(id) ON DELETE CASCADE UNIQUE,
  stripe_session_id TEXT NOT NULL,
  stripe_payment_intent_id TEXT,
  amount INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'usd',
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_portal_payments_portal_id ON portal_payments(portal_id);
CREATE INDEX idx_portal_payments_stripe_session ON portal_payments(stripe_session_id);

-- ── Row Level Security ──

ALTER TABLE portals ENABLE ROW LEVEL SECURITY;
ALTER TABLE portal_verification ENABLE ROW LEVEL SECURITY;
ALTER TABLE portal_change_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE portal_signatures ENABLE ROW LEVEL SECURITY;
ALTER TABLE portal_payments ENABLE ROW LEVEL SECURITY;
