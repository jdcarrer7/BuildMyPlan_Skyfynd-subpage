-- Run this in the Supabase SQL editor to create the quote_overrides table
-- This table stores admin edits to quotes (overrides the original GAS data)

CREATE TABLE quote_overrides (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  qr_number TEXT NOT NULL UNIQUE,
  quote_data JSONB NOT NULL,
  admin_notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE quote_overrides ENABLE ROW LEVEL SECURITY;

-- Index for fast lookup by qr_number
CREATE INDEX idx_quote_overrides_qr ON quote_overrides(qr_number);
