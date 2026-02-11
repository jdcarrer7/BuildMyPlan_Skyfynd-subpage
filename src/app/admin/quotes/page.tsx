'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAdminStore } from '@/hooks/useAdminStore';
import AdminLogin from '@/components/admin/AdminLogin';
import AdminLayout from '@/components/admin/AdminLayout';
import CustomerInfoPanel from '@/components/admin/CustomerInfoPanel';
import CustomerToggle from '@/components/admin/CustomerToggle';
import QuoteBreakdown from '@/components/admin/QuoteBreakdown';
import QuotePDFExport from '@/components/admin/QuotePDFExport';
import { Loader2, Send } from 'lucide-react';
import type { ServiceDiscount, QuoteLevelDiscount } from '@/lib/types/admin';

function AdminQuotesContent() {
  const {
    session,
    sessionLoading,
    checkSession,
    fetchQuotes,
    selectedQR,
    selectedQuote,
    quoteLoading,
    quoteError,
    quotes,
    selectQuote,
    saveDiscount,
    sendQuote,
  } = useAdminStore();

  const [sendingQuote, setSendingQuote] = useState(false);
  const [sendQuoteResult, setSendQuoteResult] = useState<{ success: boolean; message: string } | null>(null);

  const searchParams = useSearchParams();

  // Check session on mount
  useEffect(() => {
    checkSession();
  }, [checkSession]);

  // Fetch quotes after login
  useEffect(() => {
    if (session?.isLoggedIn) {
      fetchQuotes();
    }
  }, [session?.isLoggedIn, fetchQuotes]);

  // Handle ?qr= deep link
  useEffect(() => {
    const qr = searchParams?.get('qr');
    if (qr && session?.isLoggedIn && quotes.length > 0 && !selectedQR) {
      selectQuote(qr);
    }
  }, [searchParams, session?.isLoggedIn, quotes.length, selectedQR, selectQuote]);

  // Loading session
  if (sessionLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#8b5cf6]" />
      </div>
    );
  }

  // Not logged in
  if (!session?.isLoggedIn) {
    return <AdminLogin />;
  }

  const handleSaveDiscount = async (
    serviceDiscounts: ServiceDiscount[],
    quoteDiscount: QuoteLevelDiscount | null
  ) => {
    if (!selectedQR) return;
    await saveDiscount(selectedQR, serviceDiscounts, quoteDiscount);
  };

  const handleSendQuote = async () => {
    if (!selectedQR) return;
    setSendingQuote(true);
    setSendQuoteResult(null);
    const result = await sendQuote(selectedQR);
    setSendingQuote(false);
    setSendQuoteResult({
      success: result.success,
      message: result.success ? (result.message || 'Quote sent!') : (result.error || 'Failed to send'),
    });
    if (result.success) {
      setTimeout(() => setSendQuoteResult(null), 4000);
    }
  };

  // Find the lead row for the selected quote
  const leadRow = quotes.find(q => q.qrNumber === selectedQR);

  return (
    <AdminLayout>
      {!selectedQR ? (
        <div className="flex items-center justify-center h-full min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
              Quote Management
            </h2>
            <p className="text-[#888]">Select a quote from the sidebar to view details</p>
            <p className="text-sm text-[#666] mt-2">{quotes.length} quotes &middot; {new Set(quotes.map(q => q.customerId)).size} customers</p>
          </div>
        </div>
      ) : quoteLoading ? (
        <div className="flex items-center justify-center h-full min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-[#8b5cf6]" />
        </div>
      ) : quoteError ? (
        <div className="flex items-center justify-center h-full min-h-[60vh]">
          <div className="text-center">
            <p className="text-red-400 mb-2">{quoteError}</p>
            <button
              onClick={() => selectedQR && selectQuote(selectedQR)}
              className="text-sm text-[#8b5cf6] hover:underline"
            >
              Retry
            </button>
          </div>
        </div>
      ) : selectedQuote ? (
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Customer Info */}
          <CustomerInfoPanel quote={selectedQuote} />

          {/* Customer Toggle */}
          {leadRow && <CustomerToggle leadRow={leadRow} />}

          {/* Service Breakdown + Discounts + Totals */}
          <QuoteBreakdown quote={selectedQuote} onSaveDiscount={handleSaveDiscount} />

          {/* Actions: PDF Export + Send Quote */}
          <div className="flex items-center justify-end gap-3 flex-wrap">
            {sendQuoteResult && (
              <span className={`text-sm ${sendQuoteResult.success ? 'text-green-400' : 'text-red-400'}`}>
                {sendQuoteResult.message}
              </span>
            )}
            <button
              onClick={handleSendQuote}
              disabled={sendingQuote}
              className="flex items-center gap-2 px-5 py-3 rounded-lg font-semibold text-white transition-all disabled:opacity-50 bg-[#4a148c] hover:bg-[#6a1b9a]"
            >
              <Send className="w-4 h-4" />
              {sendingQuote ? 'Sending...' : 'Send Quote'}
            </button>
            <QuotePDFExport quote={selectedQuote} />
          </div>
        </div>
      ) : null}
    </AdminLayout>
  );
}

export default function AdminQuotesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#8b5cf6]" />
        </div>
      }
    >
      <AdminQuotesContent />
    </Suspense>
  );
}
