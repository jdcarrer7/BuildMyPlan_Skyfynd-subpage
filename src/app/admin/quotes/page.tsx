'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAdminStore } from '@/hooks/useAdminStore';
import AdminLogin from '@/components/admin/AdminLogin';
import AdminLayout from '@/components/admin/AdminLayout';
import CustomerToggle from '@/components/admin/CustomerToggle';
import QuotePDFExport from '@/components/admin/QuotePDFExport';
import PortalStatusBadge from '@/components/admin/PortalStatusBadge';
import TrashBin from '@/components/admin/TrashBin';
import QuoteEditor from '@/components/admin/QuoteEditor';
import { Loader2, Send, LinkIcon, AlertCircle, Save, X, CheckCircle2, CreditCard } from 'lucide-react';

function AdminQuotesContent() {
  const {
    session,
    sessionLoading,
    checkSession,
    fetchQuotes,
    fetchPortals,
    selectedQR,
    selectedQuote,
    quoteLoading,
    quoteError,
    quotes,
    portals,
    selectQuote,
    sendQuote,
    sendPortal,
    completePortal,
    sendFinalPayment,
  } = useAdminStore();

  const [sendingQuote, setSendingQuote] = useState(false);
  const [sendQuoteResult, setSendQuoteResult] = useState<{ success: boolean; message: string } | null>(null);
  const [sendingPortal, setSendingPortal] = useState(false);
  const [sendPortalResult, setSendPortalResult] = useState<{ success: boolean; message: string } | null>(null);
  const [sendingFinalPayment, setSendingFinalPayment] = useState(false);
  const [sendFinalPaymentResult, setSendFinalPaymentResult] = useState<{ success: boolean; message: string } | null>(null);

  // Floating button state
  const [editTrigger, setEditTrigger] = useState(0);
  const [saveTrigger, setSaveTrigger] = useState(0);
  const [cancelTrigger, setCancelTrigger] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editSaveResult, setEditSaveResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isTrashOpen, setIsTrashOpen] = useState(false);
  const [trashPanelHeight, setTrashPanelHeight] = useState(0);
  const [editPanelOpen, setEditPanelOpen] = useState(false);
  const [completePanelOpen, setCompletePanelOpen] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [completeResult, setCompleteResult] = useState<{ success: boolean; message: string } | null>(null);
  const editPanelRef = useRef<HTMLDivElement>(null);
  const [editPanelHeight, setEditPanelHeight] = useState(0);

  const searchParams = useSearchParams();

  // Check session on mount
  useEffect(() => {
    checkSession();
  }, [checkSession]);

  // Fetch quotes and portals after login
  useEffect(() => {
    if (session?.isLoggedIn) {
      fetchQuotes();
      fetchPortals();
    }
  }, [session?.isLoggedIn, fetchQuotes, fetchPortals]);

  // Reset edit state when switching quotes
  useEffect(() => {
    setIsEditing(false);
    setEditPanelOpen(false);
    setEditTrigger(0);
    setSaveTrigger(0);
    setCancelTrigger(0);
    setEditSaveResult(null);
    setCompletePanelOpen(false);
    setCompleteResult(null);
    setSendFinalPaymentResult(null);
  }, [selectedQR]);

  // Handle ?qr= deep link
  useEffect(() => {
    const qr = searchParams?.get('qr');
    if (qr && session?.isLoggedIn && quotes.length > 0 && !selectedQR) {
      selectQuote(qr);
    }
  }, [searchParams, session?.isLoggedIn, quotes.length, selectedQR, selectQuote]);

  // Track edit panel height for button stacking
  useEffect(() => {
    if (editPanelRef.current) {
      setEditPanelHeight(editPanelRef.current.offsetHeight);
    } else {
      setEditPanelHeight(0);
    }
  }, [isEditing, editPanelOpen, editSaveResult]);

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

  const handleSendFinalPayment = async () => {
    if (!selectedQR) return;
    setSendingFinalPayment(true);
    setSendFinalPaymentResult(null);
    const result = await sendFinalPayment(selectedQR);
    setSendingFinalPayment(false);
    setSendFinalPaymentResult({
      success: result.success,
      message: result.success ? (result.message || 'Final payment request sent!') : (result.error || 'Failed to send'),
    });
    if (result.success) {
      setTimeout(() => setSendFinalPaymentResult(null), 4000);
    }
  };

  // Find the lead row and portal(s) for the selected quote
  const leadRow = quotes.find(q => q.qrNumber === selectedQR);
  const quotePortals = portals.filter(p => p.qr_number === selectedQR);

  // Determine if the selected quote is "in progress" (paid but not completed)
  const STATUS_ORDER_MAP: Record<string, number> = {
    sent: 0, email_verified: 1, quote_viewed: 2, change_requested: 3,
    quote_accepted: 4, contract_signed: 5, payment_completed: 6, project_completed: 7,
  };
  const bestPortal = quotePortals.reduce<typeof quotePortals[0] | null>((best, p) => {
    if (!best || (STATUS_ORDER_MAP[p.status] ?? 0) > (STATUS_ORDER_MAP[best.status] ?? 0)) return p;
    return best;
  }, null);
  const isInProgress = bestPortal?.status === 'payment_completed';

  // Button stacking positions
  const pencilBottom = isTrashOpen && trashPanelHeight > 0
    ? 104 + trashPanelHeight + 16
    : 104;
  const checkmarkBottom = isEditing && editPanelOpen && editPanelHeight > 0
    ? pencilBottom + 56 + 8 + editPanelHeight + 8
    : pencilBottom + 56 + 16;
  const completePanelBottom = checkmarkBottom + 56 + 8;

  const handleComplete = async () => {
    if (!bestPortal) return;
    setCompleting(true);
    setCompleteResult(null);
    const result = await completePortal(bestPortal.id);
    setCompleting(false);
    if (result.success) {
      setCompleteResult({ success: true, message: 'Project marked as complete!' });
      setTimeout(() => {
        setCompletePanelOpen(false);
        setCompleteResult(null);
      }, 2000);
    } else {
      setCompleteResult({ success: false, message: result.error || 'Failed to complete' });
    }
  };

  return (
    <AdminLayout>
      {!selectedQR ? (
        <div className="flex items-center justify-center flex-1" style={{ minHeight: 'calc(100vh - 200px)' }}>
          <div className="text-center -mt-20">
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
          {/* Editable Quote View */}
          <QuoteEditor
            key={selectedQR}
            externalEditTrigger={editTrigger}
            externalSaveTrigger={saveTrigger}
            externalCancelTrigger={cancelTrigger}
            onEditingChange={(v) => { setIsEditing(v); if (v) setEditPanelOpen(true); else { setEditPanelOpen(false); setEditTrigger(0); } }}
            onSavingChange={setIsSaving}
            onSaveResult={setEditSaveResult}
          />

          {/* Customer Toggle */}
          {leadRow && <CustomerToggle leadRow={leadRow} />}

          {/* Portal Status */}
          {quotePortals.length > 0 && (
            <div className="card p-4 space-y-3">
              <h3 className="text-sm font-semibold text-[#FAFAFA] flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-[#8B5CF6]" />
                Client Portal
              </h3>
              {quotePortals.map(p => (
                <div key={p.id} className="flex items-center justify-between gap-3 text-sm">
                  <div className="flex items-center gap-3 min-w-0">
                    <PortalStatusBadge status={p.status} size="md" hasFinalPayment={!!p.finalPayment} />
                    <span className="text-[#A1A1AA] text-xs truncate">
                      Sent {new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                    {p.payment && (
                      <span className="text-[#10B981] text-xs font-medium">
                        ${(p.payment.amount / 100).toLocaleString()} paid
                      </span>
                    )}
                  </div>
                  {p.pending_changes.length > 0 && (
                    <div className="flex items-center gap-1.5 text-[#F59E0B]">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span className="text-xs font-medium">{p.pending_changes.length} change request{p.pending_changes.length > 1 ? 's' : ''}</span>
                    </div>
                  )}
                </div>
              ))}
              {quotePortals.some(p => p.pending_changes.length > 0) && (
                <div className="border-t border-white/[0.06] pt-3 space-y-2">
                  {quotePortals.flatMap(p => p.pending_changes).map((cr, i) => (
                    <div key={i} className="bg-[#F59E0B]/5 border border-[#F59E0B]/20 rounded-lg p-3">
                      <p className="text-xs text-[#FAFAFA]">&ldquo;{cr.message}&rdquo;</p>
                      <p className="text-[10px] text-[#71717A] mt-1">
                        {new Date(cr.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Actions: Send Quote + Send Portal + Final Payment + PDF Export */}
          <div className="flex items-center justify-end gap-3">
            {(sendQuoteResult || sendPortalResult || sendFinalPaymentResult) && (
              <span className={`text-sm mr-auto ${
                (sendQuoteResult || sendPortalResult || sendFinalPaymentResult)?.success ? 'text-[#10B981]' : 'text-red-400'
              }`}>
                {(sendQuoteResult || sendPortalResult || sendFinalPaymentResult)?.message}
              </span>
            )}
            <button
              onClick={handleSendQuote}
              disabled={sendingQuote}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md font-semibold text-white text-xs transition-all disabled:opacity-50 border border-[#A78BFA]/30 hover:shadow-[0_8px_32px_rgba(167,139,250,0.3)] hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(to right, rgba(167,139,250,0.75) 0%, rgba(96,175,250,0.85) 40%, rgba(52,211,153,0.8) 100%)' }}
            >
              <Send className="w-3.5 h-3.5" />
              {sendingQuote ? 'Sending...' : 'Send Quote'}
            </button>
            <button
              onClick={handleSendPortal}
              disabled={sendingPortal}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md font-semibold text-white text-xs transition-all disabled:opacity-50 border border-[#A78BFA]/30 hover:shadow-[0_8px_32px_rgba(167,139,250,0.3)] hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(to right, rgba(167,139,250,0.75) 0%, rgba(96,175,250,0.85) 40%, rgba(52,211,153,0.8) 100%)' }}
            >
              <LinkIcon className="w-3.5 h-3.5" />
              {sendingPortal ? 'Sending...' : 'Send Portal'}
            </button>
            {isInProgress && (
              <button
                onClick={handleSendFinalPayment}
                disabled={sendingFinalPayment}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md font-semibold text-white text-xs transition-all disabled:opacity-50 border border-[#A78BFA]/30 hover:shadow-[0_8px_32px_rgba(167,139,250,0.3)] hover:-translate-y-0.5"
                style={{ background: 'linear-gradient(to right, rgba(167,139,250,0.75) 0%, rgba(96,175,250,0.85) 40%, rgba(52,211,153,0.8) 100%)' }}
              >
                <CreditCard className="w-3.5 h-3.5" />
                {sendingFinalPayment ? 'Sending...' : 'Final Payment'}
              </button>
            )}
            <QuotePDFExport quote={selectedQuote} />
          </div>
        </div>
      ) : null}
      {/* Floating pencil button — above trash, moves up when trash panel opens */}
      {selectedQuote && (
        <>
          <button
            onClick={() => {
              if (!isEditing) {
                setEditTrigger(t => t + 1);
              } else {
                setEditPanelOpen(prev => !prev);
              }
            }}
            className={`group fixed right-6 z-40 w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 ${
              isEditing && editPanelOpen
                ? 'ring-2 ring-[#A78BFA]/60 shadow-[0_0_16px_rgba(167,139,250,0.3)]'
                : 'border border-white/[0.1] hover:bg-[#2A2A2E]'
            }`}
            style={{
              bottom: `${pencilBottom}px`,
              background: isEditing && editPanelOpen
                ? 'linear-gradient(to right, rgba(167,139,250,0.75) 0%, rgba(96,175,250,0.85) 40%, rgba(52,211,153,0.8) 100%)'
                : '#1C1C1E',
              transition: 'bottom 0.3s ease',
            }}
          >
            <span className="text-2xl">✏️</span>
            {/* Tooltip — only when not editing and panel closed */}
            {!isEditing && !editPanelOpen && (
              <span className="pointer-events-none absolute right-[calc(100%+8px)] top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md bg-[#27272A] px-2.5 py-1 text-xs font-medium text-[#FAFAFA] opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                Edit Quote
              </span>
            )}
          </button>

          {/* Edit panel — dialog above pencil, similar format to trash panel */}
          {isEditing && editPanelOpen && (
            <div
              ref={editPanelRef}
              className="fixed right-6 z-50 w-64 bg-[#141415] border border-white/[0.1] rounded-xl shadow-2xl flex flex-col overflow-hidden"
              style={{
                bottom: `${pencilBottom + 56 + 8}px`,
                transition: 'bottom 0.3s ease',
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <span className="text-lg">✏️</span>
                  <span className="text-sm font-semibold text-[#FAFAFA]">Editing Quote</span>
                </div>
                <button
                  onClick={() => setEditPanelOpen(false)}
                  className="p-1 rounded hover:bg-white/[0.06] text-[#71717A] hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Actions */}
              <div className="p-3 space-y-2">
                {editSaveResult && (
                  <div className={`text-xs px-3 py-2 rounded-lg ${editSaveResult.success ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-red-500/10 text-red-400'}`}>
                    {editSaveResult.message}
                  </div>
                )}
                <button
                  onClick={() => setSaveTrigger(t => t + 1)}
                  disabled={isSaving}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium rounded-lg text-white transition-all disabled:opacity-50 hover:opacity-90"
                  style={{ background: 'linear-gradient(to right, rgba(167,139,250,0.75) 0%, rgba(96,175,250,0.85) 40%, rgba(52,211,153,0.8) 100%)' }}
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={() => setCancelTrigger(t => t + 1)}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium rounded-lg bg-white/[0.04] text-[#A1A1AA] border border-white/[0.06] hover:bg-white/[0.08] transition-colors"
                >
                  <X className="w-4 h-4" />
                  Discard Changes
                </button>
              </div>
            </div>
          )}
        </>
      )}
      {/* Floating checkmark button — only for In Progress quotes */}
      {selectedQuote && isInProgress && (
        <>
          <button
            onClick={() => setCompletePanelOpen(prev => !prev)}
            className={`group fixed right-6 z-40 w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 ${
              completePanelOpen
                ? 'ring-2 ring-[#A78BFA]/60 shadow-[0_0_16px_rgba(167,139,250,0.3)]'
                : 'border border-white/[0.1] hover:bg-[#2A2A2E]'
            }`}
            style={{
              bottom: `${checkmarkBottom}px`,
              background: completePanelOpen
                ? 'linear-gradient(to right, rgba(167,139,250,0.75) 0%, rgba(96,175,250,0.85) 40%, rgba(52,211,153,0.8) 100%)'
                : '#1C1C1E',
              transition: 'bottom 0.3s ease',
            }}
          >
            <span className="text-2xl">✅</span>
            {!completePanelOpen && (
              <span className="pointer-events-none absolute right-[calc(100%+8px)] top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md bg-[#27272A] px-2.5 py-1 text-xs font-medium text-[#FAFAFA] opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                Mark Complete
              </span>
            )}
          </button>

          {/* Complete confirmation panel */}
          {completePanelOpen && (
            <div
              className="fixed right-6 z-50 w-64 bg-[#141415] border border-white/[0.1] rounded-xl shadow-2xl flex flex-col overflow-hidden"
              style={{
                bottom: `${completePanelBottom}px`,
                transition: 'bottom 0.3s ease',
              }}
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <span className="text-lg">✅</span>
                  <span className="text-sm font-semibold text-[#FAFAFA]">Mark Complete</span>
                </div>
                <button
                  onClick={() => setCompletePanelOpen(false)}
                  className="p-1 rounded hover:bg-white/[0.06] text-[#71717A] hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-3 space-y-2">
                <p className="text-xs text-[#A1A1AA]">
                  Mark this project as completed? It will move to the Completed section.
                </p>
                {completeResult && (
                  <div className={`text-xs px-3 py-2 rounded-lg ${completeResult.success ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-red-500/10 text-red-400'}`}>
                    {completeResult.message}
                  </div>
                )}
                <button
                  onClick={handleComplete}
                  disabled={completing}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium rounded-lg text-white transition-all disabled:opacity-50 hover:opacity-90"
                  style={{ background: 'linear-gradient(to right, rgba(167,139,250,0.75) 0%, rgba(96,175,250,0.85) 40%, rgba(52,211,153,0.8) 100%)' }}
                >
                  {completing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  {completing ? 'Completing...' : 'Yes, Mark Complete'}
                </button>
                <button
                  onClick={() => setCompletePanelOpen(false)}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium rounded-lg bg-white/[0.04] text-[#A1A1AA] border border-white/[0.06] hover:bg-white/[0.08] transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </>
      )}
      <TrashBin onOpenChange={setIsTrashOpen} onPanelHeightChange={setTrashPanelHeight} />
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
