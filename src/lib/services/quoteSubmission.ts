import type { QuoteRequestPayload, QuoteSubmissionResult } from '@/lib/types/quote';

export async function submitQuote(payload: QuoteRequestPayload): Promise<QuoteSubmissionResult> {
  const response = await fetch('/api/quote', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    return {
      success: false,
      message: data.error ?? 'Something went wrong. Please try again.',
    };
  }

  return {
    success: true,
    message: data.message ?? 'Quote submitted successfully!',
  };
}
