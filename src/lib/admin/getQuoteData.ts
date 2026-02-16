import type { QuoteJSON } from '@/lib/types/admin';
import { getQuote } from '@/lib/supabase/quotes';

/**
 * Fetch the latest quote data for a given QR number from Supabase.
 */
export async function getQuoteData(qrNumber: string): Promise<{ quote: QuoteJSON; adminNotes: string; isEdited: boolean } | null> {
  return getQuote(qrNumber);
}
