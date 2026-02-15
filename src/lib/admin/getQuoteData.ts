import type { QuoteJSON } from '@/lib/types/admin';
import { getSupabaseAdmin } from '@/lib/supabase/client';

/**
 * Fetch the latest quote data for a given QR number.
 * Checks Supabase quote_overrides first (admin edits), then falls back to GAS.
 */
export async function getQuoteData(qrNumber: string): Promise<{ quote: QuoteJSON; adminNotes: string; isEdited: boolean } | null> {
  // 1. Check Supabase for overrides
  try {
    const supabase = getSupabaseAdmin();
    const { data: override } = await supabase
      .from('quote_overrides')
      .select('quote_data, admin_notes')
      .eq('qr_number', qrNumber)
      .single();

    if (override?.quote_data) {
      return {
        quote: override.quote_data as QuoteJSON,
        adminNotes: override.admin_notes || '',
        isEdited: true,
      };
    }
  } catch {
    // No override — fall through
  }

  // 2. Fall back to GAS
  const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;
  if (!scriptUrl) return null;

  try {
    const res = await fetch(`${scriptUrl}?action=get_quote&qr=${encodeURIComponent(qrNumber)}`, {
      redirect: 'follow',
    });
    const text = await res.text();
    const data = JSON.parse(text);
    if (data.status === 'success' && data.quote) {
      return { quote: data.quote as QuoteJSON, adminNotes: '', isEdited: false };
    }
  } catch {
    // ignore
  }

  return null;
}
