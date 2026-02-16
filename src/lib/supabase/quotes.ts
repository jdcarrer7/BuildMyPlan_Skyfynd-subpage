import { getSupabaseAdmin } from './client';
import type {
  QuoteJSON,
  MasterLeadRow,
  ServiceDiscount,
  QuoteLevelDiscount,
} from '@/lib/types/admin';
import type { QuoteRequestPayload } from '@/lib/types/quote';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://plans.skyfynd.io';

// ── ID Generation ──

export async function generateQRNumber(): Promise<string> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.rpc('next_counter', { counter_name: 'qr_number' });
  if (error) throw new Error(`Failed to generate QR number: ${error.message}`);
  return `QR-${String(data).padStart(5, '0')}`;
}

export async function assignCustomerId(email: string): Promise<string> {
  const supabase = getSupabaseAdmin();

  // Check if this email already has a quote
  const { data: existing } = await supabase
    .from('quotes')
    .select('customer_id')
    .eq('email', email)
    .limit(1)
    .single();

  if (existing?.customer_id) return existing.customer_id;

  // Generate new Customer ID
  const { data, error } = await supabase.rpc('next_counter', { counter_name: 'customer_id' });
  if (error) throw new Error(`Failed to generate Customer ID: ${error.message}`);
  return `C-${String(data).padStart(5, '0')}`;
}

// ── Create Quote ──

export async function createQuote(body: QuoteRequestPayload): Promise<{ qrNumber: string }> {
  const supabase = getSupabaseAdmin();
  const qrNumber = await generateQRNumber();
  const customerId = await assignCustomerId(body.email);

  const quoteJSON: QuoteJSON = {
    qrNumber,
    customerId,
    submittedAt: new Date().toISOString(),
    source: body.source,
    customer: {
      name: body.name,
      email: body.email,
      company: body.company || '',
      phone: body.phone || '',
      notes: body.notes || '',
    },
    services: body.resolvedServices || [],
    totals: {
      oneTimeTotal: body.oneTimeTotal,
      monthlyTotal: body.monthlyTotal,
      hasCustomQuote: body.hasCustomQuote,
      discountPercentage: body.discountPercentage,
      grandTotal: body.grandTotal,
    },
    rawPayload: {
      servicesDetail: body.servicesDetail,
      serviceCount: body.serviceCount,
      serviceNames: body.serviceNames,
    },
  };

  const { error } = await supabase.from('quotes').insert({
    qr_number: qrNumber,
    customer_id: customerId,
    submitted_at: quoteJSON.submittedAt,
    source: body.source,
    name: body.name,
    email: body.email,
    company: body.company || '',
    phone: body.phone || '',
    service_count: body.serviceCount,
    service_names: body.serviceNames,
    one_time_total: body.oneTimeTotal,
    monthly_total: body.monthlyTotal,
    discount_percentage: body.discountPercentage,
    grand_total: body.grandTotal,
    has_custom_quote: body.hasCustomQuote,
    quote_data: quoteJSON,
  });

  if (error) throw new Error(`Failed to create quote: ${error.message}`);
  return { qrNumber };
}

// ── List Quotes ──

export async function listQuotes(): Promise<MasterLeadRow[]> {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from('quotes')
    .select('*')
    .eq('is_deleted', false)
    .order('submitted_at', { ascending: false });

  if (error) throw new Error(`Failed to list quotes: ${error.message}`);

  return (data || []).map((row) => {
    const submitted = new Date(row.submitted_at);
    return {
      qrNumber: row.qr_number,
      qrLink: `${BASE_URL}/admin/quotes?qr=${row.qr_number}`,
      customerId: row.customer_id,
      date: submitted.toISOString().split('T')[0],
      timestamp: submitted.toTimeString().slice(0, 8),
      source: row.source,
      name: row.name,
      email: row.email,
      company: row.company || '',
      phone: row.phone || '',
      serviceCount: row.service_count,
      serviceNames: row.service_names || '',
      oneTimeTotal: Number(row.one_time_total),
      monthlyTotal: Number(row.monthly_total),
      discountPercent: Number(row.discount_percentage),
      grandTotal: Number(row.grand_total),
      hasCustomQuote: row.has_custom_quote,
      isCustomer: row.is_customer,
      serviceStarted: row.service_started || '',
      serviceEnded: row.service_ended || '',
      isTrashed: row.is_trashed,
      notes: row.notes || '',
    };
  });
}

// ── Get Single Quote ──

export async function getQuote(
  qrNumber: string
): Promise<{ quote: QuoteJSON; adminNotes: string; isEdited: boolean } | null> {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from('quotes')
    .select('quote_data, admin_notes, updated_at, created_at')
    .eq('qr_number', qrNumber)
    .single();

  if (error || !data) return null;

  return {
    quote: data.quote_data as QuoteJSON,
    adminNotes: data.admin_notes || '',
    isEdited: data.updated_at !== data.created_at,
  };
}

// ── Update Quote Data (admin edit) ──

export async function updateQuoteData(
  qrNumber: string,
  quoteData: QuoteJSON,
  adminNotes: string
): Promise<void> {
  const supabase = getSupabaseAdmin();

  const { error } = await supabase
    .from('quotes')
    .update({
      quote_data: quoteData,
      admin_notes: adminNotes,
      // Sync denormalized columns from the updated QuoteJSON
      name: quoteData.customer?.name || '',
      email: quoteData.customer?.email || '',
      company: quoteData.customer?.company || '',
      phone: quoteData.customer?.phone || '',
      service_count: quoteData.services?.length || 0,
      service_names: (quoteData.services || []).map((s) => s.serviceLabel).join(', '),
      one_time_total: quoteData.totals?.oneTimeTotal || 0,
      monthly_total: quoteData.totals?.monthlyTotal || 0,
      discount_percentage: quoteData.totals?.discountPercentage || 0,
      grand_total: quoteData.totals?.grandTotal || 0,
      has_custom_quote: quoteData.totals?.hasCustomQuote || false,
      updated_at: new Date().toISOString(),
    })
    .eq('qr_number', qrNumber);

  if (error) throw new Error(`Failed to update quote: ${error.message}`);
}

// ── Update Discount ──
// Ported from GAS handleSaveDiscount (Code.gs lines 720-828)

export async function updateQuoteDiscount(
  qrNumber: string,
  serviceDiscounts: ServiceDiscount[],
  quoteDiscount: QuoteLevelDiscount | null
): Promise<QuoteJSON> {
  const supabase = getSupabaseAdmin();

  // Fetch current quote data
  const { data: row, error: fetchErr } = await supabase
    .from('quotes')
    .select('quote_data')
    .eq('qr_number', qrNumber)
    .single();

  if (fetchErr || !row) throw new Error('Quote not found');

  const quoteData = row.quote_data as QuoteJSON;
  const oneTimeTotal = quoteData.totals.oneTimeTotal;
  const monthlyTotal = quoteData.totals.monthlyTotal;
  let totalSaved = 0;

  // Apply service-level discounts
  for (const sd of serviceDiscounts) {
    const svc = (quoteData.services || []).find((s) => s.serviceType === sd.serviceType);
    if (!svc) continue;

    if (sd.type === 'percentage') {
      if (sd.appliesTo === 'one-time' || sd.appliesTo === 'both') {
        totalSaved += svc.oneTimeTotal * (sd.value / 100);
      }
      if (sd.appliesTo === 'monthly' || sd.appliesTo === 'both') {
        totalSaved += svc.monthlyTotal * (sd.value / 100);
      }
    } else {
      totalSaved += sd.value;
    }
  }

  // Apply quote-level discount
  if (quoteDiscount) {
    if (quoteDiscount.type === 'percentage') {
      if (quoteDiscount.appliesTo === 'one-time' || quoteDiscount.appliesTo === 'both') {
        totalSaved += oneTimeTotal * (quoteDiscount.value / 100);
      }
      if (quoteDiscount.appliesTo === 'monthly' || quoteDiscount.appliesTo === 'both') {
        totalSaved += monthlyTotal * (quoteDiscount.value / 100);
      }
    } else {
      totalSaved += quoteDiscount.value;
    }
  }

  // Update totals
  quoteData.discounts = { serviceDiscounts, quoteDiscount, totalSaved };
  quoteData.totals.grandTotal = (oneTimeTotal + monthlyTotal) - totalSaved;
  const totalBeforeDiscount = oneTimeTotal + monthlyTotal;
  quoteData.totals.discountPercentage = totalBeforeDiscount > 0
    ? Math.round((totalSaved / totalBeforeDiscount) * 100)
    : 0;

  // Save back
  const { error } = await supabase
    .from('quotes')
    .update({
      quote_data: quoteData,
      discount_percentage: quoteData.totals.discountPercentage,
      grand_total: quoteData.totals.grandTotal,
      updated_at: new Date().toISOString(),
    })
    .eq('qr_number', qrNumber);

  if (error) throw new Error(`Failed to save discount: ${error.message}`);
  return quoteData;
}

// ── Toggle Customer Status ──

export async function toggleCustomerStatus(
  qrNumber: string,
  isCustomer: boolean,
  serviceStarted: string,
  serviceEnded: string
): Promise<void> {
  const supabase = getSupabaseAdmin();

  // Update the quote row
  const { data: quote, error: quoteErr } = await supabase
    .from('quotes')
    .update({
      is_customer: isCustomer,
      service_started: serviceStarted,
      service_ended: serviceEnded,
      updated_at: new Date().toISOString(),
    })
    .eq('qr_number', qrNumber)
    .select('customer_id, name, email, company, phone, grand_total')
    .single();

  if (quoteErr || !quote) throw new Error('Failed to update customer status');

  // Sync customers table
  if (isCustomer) {
    await supabase.from('customers').upsert(
      {
        customer_id: quote.customer_id,
        name: quote.name,
        email: quote.email,
        company: quote.company || '',
        phone: quote.phone || '',
        total_spent: Number(quote.grand_total) || 0,
        service_started: serviceStarted,
        service_ended: serviceEnded,
        last_quote_date: new Date().toISOString().split('T')[0],
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'customer_id' }
    );
  }
}

// ── Trash / Restore / Delete ──

export async function trashQuote(qrNumber: string): Promise<void> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from('quotes')
    .update({ is_trashed: true, updated_at: new Date().toISOString() })
    .eq('qr_number', qrNumber);
  if (error) throw new Error(`Failed to trash quote: ${error.message}`);
}

export async function restoreQuote(qrNumber: string): Promise<void> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from('quotes')
    .update({ is_trashed: false, updated_at: new Date().toISOString() })
    .eq('qr_number', qrNumber);
  if (error) throw new Error(`Failed to restore quote: ${error.message}`);
}

export async function deleteQuote(qrNumber: string): Promise<void> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from('quotes')
    .update({ is_deleted: true, updated_at: new Date().toISOString() })
    .eq('qr_number', qrNumber);
  if (error) throw new Error(`Failed to delete quote: ${error.message}`);
}
