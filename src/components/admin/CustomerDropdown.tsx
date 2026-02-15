'use client';

import { useMemo, useState, useEffect, useRef } from 'react';
import { useAdminStore } from '@/hooks/useAdminStore';
import { ChevronDown, ChevronRight, FileText, Loader2, Search, Users, Trash2 } from 'lucide-react';
import PortalStatusBadge from './PortalStatusBadge';

interface CustomerGroup {
  customerId: string;
  name: string;
  totalValue: number;
  quotes: Array<{ qrNumber: string; date: string; timestamp: string; source: string; grandTotal: number }>;
}

const sourceColors: Record<string, { bg: string; text: string }> = {
  'Main Page': { bg: 'bg-[#3B82F6]/15', text: 'text-[#60A5FA]' },
  'Rent Me a Site': { bg: 'bg-[#10B981]/15', text: 'text-[#34D399]' },
  'RentMe': { bg: 'bg-[#10B981]/15', text: 'text-[#34D399]' },
  'Custom Builder': { bg: 'bg-[#3B82F6]/15', text: 'text-[#60A5FA]' },
};

function formatShortDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

function getInitials(name: string): string {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

export default function CustomerDropdown() {
  const { quotes, quotesLoading, quotesError, selectedQR, selectQuote, portals, trashedQRs, trashQuote } = useAdminStore();
  const [expandedCustomers, setExpandedCustomers] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; qrNumber: string } | null>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);

  // Close context menu on outside click
  useEffect(() => {
    if (!contextMenu) return;
    const handleClick = () => setContextMenu(null);
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [contextMenu]);

  const customerGroups = useMemo(() => {
    const groups: Record<string, CustomerGroup> = {};
    // Filter out trashed quotes
    const activeQuotes = quotes.filter(q => !trashedQRs.has(q.qrNumber));
    for (const q of activeQuotes) {
      if (!groups[q.customerId]) {
        groups[q.customerId] = {
          customerId: q.customerId,
          name: q.name,
          totalValue: 0,
          quotes: [],
        };
      }
      groups[q.customerId].totalValue += q.grandTotal;
      groups[q.customerId].quotes.push({
        qrNumber: q.qrNumber,
        date: q.date,
        timestamp: q.timestamp,
        source: q.source,
        grandTotal: q.grandTotal,
      });
    }
    return Object.values(groups).sort((a, b) => a.name.localeCompare(b.name));
  }, [quotes, trashedQRs]);

  const filtered = useMemo(() => {
    if (!search.trim()) return customerGroups;
    const s = search.toLowerCase();
    return customerGroups.filter(
      g =>
        g.name.toLowerCase().includes(s) ||
        g.customerId.toLowerCase().includes(s) ||
        g.quotes.some(q => q.qrNumber.toLowerCase().includes(s))
    );
  }, [customerGroups, search]);

  const toggleCustomer = (id: string) => {
    setExpandedCustomers(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (quotesLoading) {
    return (
      <div className="flex items-center justify-center p-8 text-[#A1A1AA]">
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
        Loading quotes...
      </div>
    );
  }

  if (quotesError) {
    return (
      <div className="p-4 text-red-400 text-sm">{quotesError}</div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Search */}
      <div className="p-3 border-b border-white/[0.06]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#52525B]" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search customers or QR#..."
            className="w-full pl-9 pr-3 py-2 bg-[#0A0A0B] border border-white/[0.06] rounded-lg text-white text-sm placeholder-[#52525B] focus:outline-none focus:border-[#3B82F6]"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="px-3 py-2.5 border-b border-white/[0.06] flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-[#71717A]">
          <FileText className="w-3 h-3" />
          <span>{quotes.filter(q => !trashedQRs.has(q.qrNumber)).length} quotes</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[#71717A]">
          <Users className="w-3 h-3" />
          <span>{customerGroups.length} customers</span>
        </div>
      </div>

      {/* Customer Groups */}
      <div className="flex-1">
        {filtered.length === 0 && (
          <div className="p-6 text-sm text-[#71717A] text-center">No results found</div>
        )}
        {filtered.map(group => {
          const isExpanded = expandedCustomers.has(group.customerId);
          return (
            <div key={group.customerId} className="border-b border-white/[0.04]">
              <button
                onClick={() => toggleCustomer(group.customerId)}
                className={`w-full flex items-center gap-3 px-3 py-3 transition-colors text-left ${
                  isExpanded ? 'bg-white/[0.02]' : 'hover:bg-white/[0.02]'
                }`}
              >
                {/* Avatar */}
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
                  style={{
                    background: isExpanded
                      ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(16, 185, 129, 0.2))'
                      : 'rgba(255, 255, 255, 0.06)',
                    color: isExpanded ? '#60A5FA' : '#A1A1AA',
                  }}
                >
                  {getInitials(group.name)}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium text-white truncate">{group.name}</span>
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-white/[0.06] text-[#A1A1AA] shrink-0">
                      {group.quotes.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2 mt-0.5">
                    <span className="text-[11px] text-[#52525B]">{group.customerId}</span>
                    <span className="text-[11px] font-medium text-[#10B981]">${group.totalValue.toLocaleString()}</span>
                  </div>
                </div>

                {isExpanded ? (
                  <ChevronDown className="w-3.5 h-3.5 text-[#3B82F6] shrink-0" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-[#52525B] shrink-0" />
                )}
              </button>

              {isExpanded && (
                <div className="pb-2 px-2">
                  {group.quotes.map(q => {
                    const isSelected = selectedQR === q.qrNumber;
                    const srcStyle = sourceColors[q.source] || { bg: 'bg-white/[0.06]', text: 'text-[#A1A1AA]' };
                    const portal = portals.find(p => p.qr_number === q.qrNumber);
                    return (
                      <button
                        key={q.qrNumber}
                        onClick={() => selectQuote(q.qrNumber)}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          setContextMenu({ x: e.clientX, y: e.clientY, qrNumber: q.qrNumber });
                        }}
                        className={`w-full text-left transition-all text-sm rounded-lg mb-1 p-2.5 ${
                          isSelected
                            ? 'bg-[#3B82F6]/12 border border-[#3B82F6]/30'
                            : 'hover:bg-white/[0.03] border border-transparent'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <div className="flex items-center gap-2 min-w-0">
                            <FileText className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-[#60A5FA]' : 'text-[#52525B]'}`} />
                            <span className={`font-medium truncate ${isSelected ? 'text-[#60A5FA]' : 'text-[#FAFAFA]'}`}>
                              {q.qrNumber}
                            </span>
                          </div>
                          <span className={`text-xs font-semibold shrink-0 ${isSelected ? 'text-[#60A5FA]' : 'text-white'}`}>
                            ${q.grandTotal.toLocaleString()}
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-2 ml-5.5">
                          <span className="text-[11px] text-[#52525B]">{formatShortDate(q.date)}</span>
                          <div className="flex items-center gap-1.5">
                            {portal && <PortalStatusBadge status={portal.status} />}
                            <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${srcStyle.bg} ${srcStyle.text}`}>
                              {q.source}
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Right-click context menu */}
      {contextMenu && (
        <div
          ref={contextMenuRef}
          className="fixed z-50 bg-[#1C1C1E] border border-white/[0.1] rounded-lg shadow-xl py-1 min-w-[160px]"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          <button
            onClick={() => {
              trashQuote(contextMenu.qrNumber);
              setContextMenu(null);
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-400 hover:bg-white/[0.06] transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Move to trash
          </button>
        </div>
      )}
    </div>
  );
}
