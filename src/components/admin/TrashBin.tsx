'use client';

import { useState, useRef, useEffect } from 'react';
import { useAdminStore } from '@/hooks/useAdminStore';
import { RotateCcw, X, Trash2, CheckSquare, Square } from 'lucide-react';

export default function TrashBin({ onOpenChange, onPanelHeightChange }: { onOpenChange?: (open: boolean) => void; onPanelHeightChange?: (height: number) => void }) {
  const { quotes, trashedQRs, restoreQuote, permanentlyDeleteQuote } = useAdminStore();
  const [isOpen, setIsOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [confirmDeleteAll, setConfirmDeleteAll] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [confirmDeleteSelected, setConfirmDeleteSelected] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const trashedQuotes = quotes.filter(q => trashedQRs.has(q.qrNumber));

  // Notify parent of open state changes
  useEffect(() => {
    onOpenChange?.(isOpen);
  }, [isOpen, onOpenChange]);

  // Report actual panel height to parent for positioning other floating elements
  useEffect(() => {
    if (!isOpen || !panelRef.current) {
      onPanelHeightChange?.(0);
      return;
    }
    const el = panelRef.current;
    const ro = new ResizeObserver(() => {
      onPanelHeightChange?.(el.offsetHeight);
    });
    ro.observe(el);
    onPanelHeightChange?.(el.offsetHeight);
    return () => ro.disconnect();
  }, [isOpen, onPanelHeightChange]);

  // Close panel on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        resetState();
      }
    };
    const timer = setTimeout(() => {
      window.addEventListener('click', handleClick);
    }, 0);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('click', handleClick);
    };
  }, [isOpen]);

  function resetState() {
    setConfirmDelete(null);
    setConfirmDeleteAll(false);
    setSelected(new Set());
    setConfirmDeleteSelected(false);
  }

  function toggleSelect(qr: string) {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(qr)) next.delete(qr); else next.add(qr);
      return next;
    });
    setConfirmDeleteSelected(false);
  }

  function handleDeleteAll(e: React.MouseEvent) {
    e.stopPropagation();
    const qrs = trashedQuotes.map(q => q.qrNumber);
    for (const qr of qrs) permanentlyDeleteQuote(qr);
    setConfirmDeleteAll(false);
    setSelected(new Set());
  }

  function handleDeleteSelected(e: React.MouseEvent) {
    e.stopPropagation();
    for (const qr of selected) permanentlyDeleteQuote(qr);
    setSelected(new Set());
    setConfirmDeleteSelected(false);
  }

  return (
    <>
      {/* Floating trash button */}
      <button
        onClick={() => { setIsOpen(!isOpen); resetState(); }}
        className={`group fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95 ${
          isOpen
            ? 'ring-2 ring-[#A78BFA]/60 shadow-[0_0_16px_rgba(167,139,250,0.3)]'
            : 'border border-white/[0.1] hover:bg-[#2A2A2E]'
        }`}
        style={isOpen
          ? { background: 'linear-gradient(to right, rgba(167,139,250,0.75) 0%, rgba(96,175,250,0.85) 40%, rgba(52,211,153,0.8) 100%)' }
          : { background: '#1C1C1E' }
        }
      >
        <span className="text-2xl">🗑️</span>
        {trashedQRs.size > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
            {trashedQRs.size}
          </span>
        )}
        {/* Tooltip — only show when panel is closed */}
        {!isOpen && (
          <span className="pointer-events-none absolute right-[calc(100%+8px)] top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md bg-[#27272A] px-2.5 py-1 text-xs font-medium text-[#FAFAFA] opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
            Trash
          </span>
        )}
      </button>

      {/* Trash panel */}
      {isOpen && (
        <div
          ref={panelRef}
          className="fixed bottom-[104px] right-6 z-50 w-80 max-h-[340px] bg-[#141415] border border-white/[0.1] rounded-xl shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <span className="text-lg">🗑️</span>
              <span className="text-sm font-semibold text-[#FAFAFA]">Trash</span>
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-white/[0.06] text-[#A1A1AA]">
                {trashedQRs.size}
              </span>
            </div>
            <button
              onClick={() => { setIsOpen(false); resetState(); }}
              className="p-1 rounded hover:bg-white/[0.06] text-[#71717A] hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Bulk actions */}
          {trashedQuotes.length > 0 && (
            <div className="px-3 py-2 border-b border-white/[0.06] flex items-center gap-2">
              {/* Delete All */}
              {!confirmDeleteAll ? (
                <button
                  onClick={(e) => { e.stopPropagation(); setConfirmDeleteAll(true); setConfirmDeleteSelected(false); }}
                  className="flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded-md bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  Delete all
                </button>
              ) : (
                <>
                  <span className="text-[11px] text-red-400">Delete all?</span>
                  <button
                    onClick={handleDeleteAll}
                    className="px-2 py-1 text-[11px] font-medium rounded-md bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                  >
                    Yes
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setConfirmDeleteAll(false); }}
                    className="px-2 py-1 text-[11px] font-medium rounded-md bg-white/[0.06] text-[#A1A1AA] hover:bg-white/[0.1] transition-colors"
                  >
                    No
                  </button>
                </>
              )}

              {/* Divider */}
              <div className="w-px h-4 bg-white/[0.08]" />

              {/* Delete Selected */}
              {selected.size > 0 && (
                <>
                  {!confirmDeleteSelected ? (
                    <button
                      onClick={(e) => { e.stopPropagation(); setConfirmDeleteSelected(true); setConfirmDeleteAll(false); }}
                      className="flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded-md bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete {selected.size} selected
                    </button>
                  ) : (
                    <>
                      <span className="text-[11px] text-red-400">Sure?</span>
                      <button
                        onClick={handleDeleteSelected}
                        className="px-2 py-1 text-[11px] font-medium rounded-md bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                      >
                        Yes
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setConfirmDeleteSelected(false); }}
                        className="px-2 py-1 text-[11px] font-medium rounded-md bg-white/[0.06] text-[#A1A1AA] hover:bg-white/[0.1] transition-colors"
                      >
                        No
                      </button>
                    </>
                  )}
                </>
              )}
            </div>
          )}

          {/* Trashed items */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {trashedQuotes.length === 0 ? (
              <div className="p-4 text-sm text-[#71717A] text-center">
                Trash is empty
              </div>
            ) : (
              trashedQuotes.map(q => {
                const isSelected = selected.has(q.qrNumber);
                return (
                  <div
                    key={q.qrNumber}
                    className={`rounded-lg border p-3 transition-colors ${
                      isSelected
                        ? 'border-[#3B82F6]/30 bg-[#3B82F6]/5'
                        : 'border-white/[0.04] bg-white/[0.02]'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {/* Select checkbox */}
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleSelect(q.qrNumber); }}
                        className="shrink-0 text-[#71717A] hover:text-[#60A5FA] transition-colors"
                      >
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-[#60A5FA]" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-[#FAFAFA] truncate">{q.qrNumber}</div>
                        <div className="text-[11px] text-[#52525B]">{q.name}</div>
                      </div>
                      <span className="text-xs font-semibold text-[#71717A] shrink-0">
                        ${q.grandTotal.toLocaleString()}
                      </span>
                    </div>

                    {confirmDelete === q.qrNumber ? (
                      <div className="flex items-center gap-2 ml-6">
                        <span className="text-[11px] text-red-400 flex-1">Delete permanently?</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            permanentlyDeleteQuote(q.qrNumber);
                            setConfirmDelete(null);
                          }}
                          className="px-2.5 py-1 text-[11px] font-medium rounded-md bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                        >
                          Yes, delete
                        </button>
                        <button
                          onClick={() => setConfirmDelete(null)}
                          className="px-2.5 py-1 text-[11px] font-medium rounded-md bg-white/[0.06] text-[#A1A1AA] hover:bg-white/[0.1] transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 ml-6">
                        <button
                          onClick={(e) => { e.stopPropagation(); restoreQuote(q.qrNumber); }}
                          className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded-md bg-[#3B82F6]/10 text-[#60A5FA] hover:bg-[#3B82F6]/20 transition-colors"
                        >
                          <RotateCcw className="w-3 h-3" />
                          Restore
                        </button>
                        <button
                          onClick={() => setConfirmDelete(q.qrNumber)}
                          className="px-2.5 py-1 text-[11px] font-medium rounded-md bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                        >
                          Delete permanently
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </>
  );
}
