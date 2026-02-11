'use client';

import { useMemo, useState } from 'react';
import { useAdminStore } from '@/hooks/useAdminStore';
import { ChevronDown, ChevronRight, FileText, Loader2 } from 'lucide-react';

interface CustomerGroup {
  customerId: string;
  name: string;
  quotes: Array<{ qrNumber: string; date: string; timestamp: string; source: string; grandTotal: number }>;
}

export default function CustomerDropdown() {
  const { quotes, quotesLoading, quotesError, selectedQR, selectQuote } = useAdminStore();
  const [expandedCustomers, setExpandedCustomers] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');

  const customerGroups = useMemo(() => {
    const groups: Record<string, CustomerGroup> = {};
    for (const q of quotes) {
      if (!groups[q.customerId]) {
        groups[q.customerId] = {
          customerId: q.customerId,
          name: q.name,
          quotes: [],
        };
      }
      groups[q.customerId].quotes.push({
        qrNumber: q.qrNumber,
        date: q.date,
        timestamp: q.timestamp,
        source: q.source,
        grandTotal: q.grandTotal,
      });
    }
    return Object.values(groups).sort((a, b) => a.name.localeCompare(b.name));
  }, [quotes]);

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
      <div className="flex items-center justify-center p-8 text-[#a0a0a0]">
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
      <div className="p-3 border-b border-[#2a2435]">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search customers or QR#..."
          className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#2a2435] rounded-lg text-white text-sm placeholder-[#666] focus:outline-none focus:border-[#8b5cf6]"
        />
      </div>

      {/* Stats */}
      <div className="px-3 py-2 border-b border-[#2a2435] flex gap-3 text-xs text-[#888]">
        <span>{quotes.length} quotes</span>
        <span>{customerGroups.length} customers</span>
      </div>

      {/* Customer Groups */}
      <div className="flex-1">
        {filtered.length === 0 && (
          <div className="p-4 text-sm text-[#888] text-center">No results found</div>
        )}
        {filtered.map(group => (
          <div key={group.customerId}>
            <button
              onClick={() => toggleCustomer(group.customerId)}
              className="w-full flex items-center gap-2 px-3 py-2 hover:bg-[#2a2435] transition-colors text-left"
            >
              {expandedCustomers.has(group.customerId) ? (
                <ChevronDown className="w-4 h-4 text-[#8b5cf6] shrink-0" />
              ) : (
                <ChevronRight className="w-4 h-4 text-[#888] shrink-0" />
              )}
              <div className="min-w-0 flex-1">
                <div className="text-sm text-white truncate">{group.name}</div>
                <div className="text-xs text-[#888]">{group.customerId} &middot; {group.quotes.length} quote{group.quotes.length !== 1 ? 's' : ''}</div>
              </div>
            </button>

            {expandedCustomers.has(group.customerId) && (
              <div className="pl-6 border-l border-[#2a2435] ml-5">
                {group.quotes.map(q => (
                  <button
                    key={q.qrNumber}
                    onClick={() => selectQuote(q.qrNumber)}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-left transition-colors text-sm ${
                      selectedQR === q.qrNumber
                        ? 'bg-[#8b5cf6]/20 text-[#8b5cf6]'
                        : 'hover:bg-[#2a2435] text-[#a0a0a0]'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate">{q.qrNumber}</div>
                      <div className="text-xs text-[#666]">{q.date}{q.timestamp ? ` ${q.timestamp}` : ''} &middot; ${q.grandTotal.toLocaleString()}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
