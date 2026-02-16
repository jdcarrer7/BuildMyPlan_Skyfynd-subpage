/**
 * One-time migration script: Import existing quotes from Google Apps Script to Supabase.
 *
 * Usage:
 *   npx tsx scripts/migrate-gas-to-supabase.ts
 *
 * Required env vars:
 *   GOOGLE_APPS_SCRIPT_URL  — GAS web app URL
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from '@supabase/supabase-js';

const GAS_URL = process.env.GOOGLE_APPS_SCRIPT_URL;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!GAS_URL || !SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing required env vars: GOOGLE_APPS_SCRIPT_URL, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

interface GASQuoteRow {
  qrNumber: string;
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
}

async function fetchGASList(): Promise<GASQuoteRow[]> {
  console.log('Fetching quote list from GAS...');
  const res = await fetch(`${GAS_URL}?action=list_quotes`, { redirect: 'follow' });
  const text = await res.text();
  const data = JSON.parse(text);
  if (data.status !== 'success' || !Array.isArray(data.quotes)) {
    throw new Error(`GAS list_quotes failed: ${JSON.stringify(data)}`);
  }
  console.log(`  Found ${data.quotes.length} quotes in GAS`);
  return data.quotes;
}

async function fetchGASQuoteJSON(qr: string): Promise<Record<string, unknown> | null> {
  try {
    const res = await fetch(`${GAS_URL}?action=get_quote&qr=${encodeURIComponent(qr)}`, { redirect: 'follow' });
    const text = await res.text();
    const data = JSON.parse(text);
    if (data.status === 'success' && data.quote) return data.quote;
  } catch {
    console.warn(`  Warning: Failed to fetch JSON for ${qr}`);
  }
  return null;
}

async function fetchOverrides(): Promise<Map<string, { quote_data: Record<string, unknown>; admin_notes: string }>> {
  console.log('Fetching Supabase quote_overrides...');
  const { data, error } = await supabase.from('quote_overrides').select('qr_number, quote_data, admin_notes');
  if (error) {
    console.warn('  No quote_overrides found (table may not exist):', error.message);
    return new Map();
  }
  const map = new Map<string, { quote_data: Record<string, unknown>; admin_notes: string }>();
  for (const row of data || []) {
    map.set(row.qr_number, { quote_data: row.quote_data, admin_notes: row.admin_notes || '' });
  }
  console.log(`  Found ${map.size} overrides`);
  return map;
}

async function main() {
  console.log('=== GAS → Supabase Migration ===\n');

  const gasList = await fetchGASList();
  const overrides = await fetchOverrides();

  let maxQR = 0;
  let maxCust = 0;
  let migrated = 0;
  let skipped = 0;

  for (const row of gasList) {
    // Check if already migrated
    const { data: exists } = await supabase
      .from('quotes')
      .select('qr_number')
      .eq('qr_number', row.qrNumber)
      .single();

    if (exists) {
      console.log(`  Skipping ${row.qrNumber} (already exists)`);
      skipped++;
      continue;
    }

    // Fetch full JSON from GAS
    console.log(`  Migrating ${row.qrNumber}...`);
    const gasQuote = await fetchGASQuoteJSON(row.qrNumber);

    // Check for override
    const override = overrides.get(row.qrNumber);
    const quoteData = override?.quote_data || gasQuote || {};
    const adminNotes = override?.admin_notes || '';

    // Track max counters
    const qrNum = parseInt(row.qrNumber.replace('QR-', ''), 10);
    const custNum = parseInt((row.customerId || '').replace('C-', ''), 10);
    if (!isNaN(qrNum)) maxQR = Math.max(maxQR, qrNum);
    if (!isNaN(custNum)) maxCust = Math.max(maxCust, custNum);

    // Use grand_total from override if available
    const grandTotal = (quoteData as Record<string, unknown>)?.totals
      ? ((quoteData as Record<string, { grandTotal?: number }>).totals?.grandTotal ?? row.grandTotal)
      : row.grandTotal;

    const { error } = await supabase.from('quotes').insert({
      qr_number: row.qrNumber,
      customer_id: row.customerId || 'C-00000',
      submitted_at: row.date ? new Date(row.date).toISOString() : new Date().toISOString(),
      source: row.source || '',
      name: row.name || '',
      email: row.email || '',
      company: row.company || '',
      phone: row.phone || '',
      service_count: row.serviceCount || 0,
      service_names: row.serviceNames || '',
      one_time_total: row.oneTimeTotal || 0,
      monthly_total: row.monthlyTotal || 0,
      discount_percentage: row.discountPercent || 0,
      grand_total: grandTotal || 0,
      has_custom_quote: row.hasCustomQuote || false,
      is_customer: row.isCustomer || false,
      service_started: row.serviceStarted || '',
      service_ended: row.serviceEnded || '',
      notes: '',
      admin_notes: adminNotes,
      quote_data: quoteData,
    });

    if (error) {
      console.error(`  ERROR inserting ${row.qrNumber}:`, error.message);
    } else {
      migrated++;
    }

    // Rate limit: small delay between GAS calls
    await new Promise((r) => setTimeout(r, 500));
  }

  // Set counters to max values
  console.log(`\nSetting counters: qr_number=${maxQR}, customer_id=${maxCust}`);
  await supabase.from('counters').upsert({ name: 'qr_number', value: maxQR });
  await supabase.from('counters').upsert({ name: 'customer_id', value: maxCust });

  // Build customers table from isCustomer quotes
  console.log('\nBuilding customers table...');
  const { data: customerQuotes } = await supabase
    .from('quotes')
    .select('customer_id, name, email, company, phone, grand_total, service_started, service_ended')
    .eq('is_customer', true);

  if (customerQuotes) {
    const custMap = new Map<string, typeof customerQuotes[0]>();
    for (const q of customerQuotes) {
      custMap.set(q.customer_id, q); // last quote wins
    }

    for (const [custId, q] of custMap) {
      await supabase.from('customers').upsert(
        {
          customer_id: custId,
          name: q.name,
          email: q.email,
          company: q.company || '',
          phone: q.phone || '',
          quote_count: 1,
          total_spent: Number(q.grand_total) || 0,
          service_started: q.service_started || '',
          service_ended: q.service_ended || '',
          last_quote_date: new Date().toISOString().split('T')[0],
        },
        { onConflict: 'customer_id' }
      );
    }
    console.log(`  Created/updated ${custMap.size} customer records`);
  }

  console.log(`\n=== Migration Complete ===`);
  console.log(`  Migrated: ${migrated}`);
  console.log(`  Skipped:  ${skipped}`);
  console.log(`  Total:    ${gasList.length}`);
}

main().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
