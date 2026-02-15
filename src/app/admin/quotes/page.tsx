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
import DashboardMetrics from '@/components/admin/DashboardMetrics';
import { Loader2, Send, LinkIcon } from 'lucide-react';
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
    sendPortal,
  } = useAdminStore();

  const [sendingQuote, setSendingQuote] = useState(false);
  const [sendQuoteResult, setSendQuoteResult] = useState<{ success: boolean; message: string } | null>(null);
  const [sendingPortal, setSendingPortal] = useState(false);
  const [sendPortalResult, setSendPortalResult] = useState<{ success: boolean; message: string } | null>(null);

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
      <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#3B82F6]" />
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

  const handleSendPortal = async () => {
    if (!selectedQR) return;
    setSendingPortal(true);
    setSendPortalResult(null);
    const result = await sendPortal(selectedQR);
    setSendingPortal(false);
    setSendPortalResult({
      success: result.success,
      message: result.success ? (result.message || 'Portal sent!') : (result.error || 'Failed to send portal'),
    });
    if (result.success) {
      setTimeout(() => setSendPortalResult(null), 4000);
    }
  };

  // Find the lead row for the selected quote
  const leadRow = quotes.find(q => q.qrNumber === selectedQR);

  return (
    <AdminLayout>
      {/* Dashboard Metrics - always visible */}
      {quotes.length > 0 && <DashboardMetrics quotes={quotes} />}

      {!selectedQR ? (
        <div className="flex items-center justify-center h-full min-h-[40vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-[#FAFAFA] mb-2" style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif", letterSpacing: '-0.5px' }}>
              Quote Management
            </h2>
            <p className="text-[#71717A]">Select a quote from the sidebar to view details</p>
          </div>
        </div>
      ) : quoteLoading ? (
        <div className="flex items-center justify-center h-full min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-[#3B82F6]" />
        </div>
      ) : quoteError ? (
        <div className="flex items-center justify-center h-full min-h-[60vh]">
          <div className="text-center">
            <p className="text-red-400 mb-2">{quoteError}</p>
            <button
              onClick={() => selectedQR && selectQuote(selectedQR)}
              className="text-sm text-[#3B82F6] hover:underline"
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

          {/* Actions: Send Quote + Send Portal + PDF Export */}
          <div className="flex items-center justify-end gap-3 flex-wrap">
            {sendQuoteResult && (
              <span className={`text-sm ${sendQuoteResult.success ? 'text-[#10B981]' : 'text-red-400'}`}>
                {sendQuoteResult.message}
              </span>
            )}
            {sendPortalResult && (
              <span className={`text-sm ${sendPortalResult.success ? 'text-[#10B981]' : 'text-red-400'}`}>
                {sendPortalResult.message}
              </span>
            )}
            <button
              onClick={handleSendQuote}
              disabled={sendingQuote}
              className="flex items-center gap-2 px-5 py-3 rounded-lg font-semibold text-white transition-all disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #10B981 100%)' }}
            >
              <Send className="w-4 h-4" />
              {sendingQuote ? 'Sending...' : 'Send Quote'}
            </button>
            <button
              onClick={handleSendPortal}
              disabled={sendingPortal}
              className="flex items-center gap-2 px-5 py-3 rounded-lg font-semibold text-white transition-all disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #10B981 100%)' }}
            >
              <LinkIcon className="w-4 h-4" />
              {sendingPortal ? 'Sending...' : 'Send Portal'}
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
        <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#3B82F6]" />
        </div>
      }
    >
      <AdminQuotesContent />
    </Suspense>
  );
}
