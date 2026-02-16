'use client';

import { useMemo, useState, useEffect, useRef } from 'react';
import { useAdminStore } from '@/hooks/useAdminStore';
import { ChevronDown, ChevronRight, FileText, Loader2, Search, Trash2, CheckCircle2 } from 'lucide-react';
import PortalStatusBadge from './PortalStatusBadge';
import type { PortalStatus } from '@/lib/supabase/types';

interface QuoteItem {
  qrNumber: string;
  date: string;
  timestamp: string;
  source: string;
  grandTotal: number;
  customerId: string;
  name: string;
}

interface CustomerGroup {
  customerId: string;
  name: string;
  totalValue: number;
  quotes: QuoteItem[];
}

const sourceColors: Record<string, { bg: string; text: string }> = {
  'Main Page': { bg: 'bg-[#3B82F6]/15', text: 'text-[#60A5FA]' },
  'Rent Me a Site': { bg: 'bg-[#10B981]/15', text: 'text-[#34D399]' },
  'RentMe': { bg: 'bg-[#10B981]/15', text: 'text-[#34D399]' },
  'Custom Builder': { bg: 'bg-[#3B82F6]/15', text: 'text-[#60A5FA]' },
};

// Higher number = more advanced status
const STATUS_ORDER: Record<PortalStatus, number> = {
  sent: 0,
  email_verified: 1,
  quote_viewed: 2,
  change_requested: 3,
  quote_accepted: 4,
  contract_signed: 5,
  payment_completed: 6,
  project_completed: 7,
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

function groupByCustomer(items: QuoteItem[]): CustomerGroup[] {
  const groups: Record<string, CustomerGroup> = {};
  for (const q of items) {
    if (!groups[q.customerId]) {
      groups[q.customerId] = { customerId: q.customerId, name: q.name, totalValue: 0, quotes: [] };
    }
    groups[q.customerId].totalValue += q.grandTotal;
    groups[q.customerId].quotes.push(q);
  }
  return Object.values(groups).sort((a, b) => a.name.localeCompare(b.name));
}

type PipelineCategory = 'quotes' | 'inProgress' | 'completed';

const CATEGORY_CONFIG: Record<PipelineCategory, { label: string; icon?: typeof FileText; emoji?: string; color: string }> = {
  quotes: { label: 'Quotes', icon: FileText, color: '#3B82F6' },
  inProgress: { label: 'In Progress', emoji: '🚀', color: '#F59E0B' },
  completed: { label: 'Completed', icon: CheckCircle2, color: '#10B981' },
};

export default function CustomerDropdown() {
  const { quotes, quotesLoading, quotesError, selectedQR, selectQuote, portals, trashedQRs, trashQuote, completePortal } = useAdminStore();
  const [expandedCustomers, setExpandedCustomers] = useState<Set<string>>(new Set());
  const [expandedCategories, setExpandedCategories] = useState<Set<PipelineCategory>>(new Set(['quotes', 'inProgress']));
  const [search, setSearch] = useState('');
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; qrNumber: string } | null>(null);
  const [completing, setCompleting] = useState<string | null>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contextMenu) return;
    const handleClick = () => setContextMenu(null);
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [contextMenu]);

  // Get the best (most advanced) portal for a quote
  const getPortalForQuote = useMemo(() => {
    const map = new Map<string, typeof portals[0]>();
    for (const p of portals) {
      const existing = map.get(p.qr_number);
      if (!existing || STATUS_ORDER[p.status] > STATUS_ORDER[existing.status]) {
        map.set(p.qr_number, p);
      }
    }
    return (qrNumber: string) => map.get(qrNumber) || null;
  }, [portals]);

  // Build quote items and categorize
  const { quoteItems, inProgressItems, completedItems } = useMemo(() => {
    const activeQuotes = quotes.filter(q => !trashedQRs.has(q.qrNumber));
    const quoteArr: QuoteItem[] = [];
    const inProgressArr: QuoteItem[] = [];
    const completedArr: QuoteItem[] = [];

    for (const q of activeQuotes) {
      const item: QuoteItem = {
        qrNumber: q.qrNumber,
        date: q.date,
        timestamp: q.timestamp,
        source: q.source,
        grandTotal: q.grandTotal,
        customerId: q.customerId,
        name: q.name,
      };

      const portal = getPortalForQuote(q.qrNumber);
      if (portal?.status === 'project_completed') {
        completedArr.push(item);
      } else if (portal?.status === 'payment_completed') {
        inProgressArr.push(item);
      } else {
        quoteArr.push(item);
      }
    }

    return { quoteItems: quoteArr, inProgressItems: inProgressArr, completedItems: completedArr };
  }, [quotes, trashedQRs, getPortalForQuote]);

  // Apply search filter
  const filterItems = (items: QuoteItem[]): CustomerGroup[] => {
    const groups = groupByCustomer(items);
    if (!search.trim()) return groups;
    const s = search.toLowerCase();
    return groups.filter(
      g =>
        g.name.toLowerCase().includes(s) ||
        g.customerId.toLowerCase().includes(s) ||
        g.quotes.some(q => q.qrNumber.toLowerCase().includes(s))
    );
  };

  const filteredQuotes = filterItems(quoteItems);
  const filteredInProgress = filterItems(inProgressItems);
  const filteredCompleted = filterItems(completedItems);

  const toggleCustomer = (id: string) => {
    setExpandedCustomers(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleCategory = (cat: PipelineCategory) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  const handleComplete = async (portalId: string) => {
    setCompleting(portalId);
    await completePortal(portalId);
    setCompleting(null);
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
    return <div className="p-4 text-red-400 text-sm">{quotesError}</div>;
  }

  const renderQuoteButton = (q: QuoteItem, showComplete?: boolean) => {
    const isSelected = selectedQR === q.qrNumber;
    const srcStyle = sourceColors[q.source] || { bg: 'bg-white/[0.06]', text: 'text-[#A1A1AA]' };
    const portal = getPortalForQuote(q.qrNumber);

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
            {showComplete && portal && (
              <span
                onClick={(e) => { e.stopPropagation(); handleComplete(portal.id); }}
                className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full cursor-pointer transition-colors ${
                  completing === portal.id
                    ? 'bg-[#10B981]/15 text-[#34D399] opacity-50'
                    : 'bg-[#10B981]/15 text-[#34D399] hover:bg-[#10B981]/25'
                }`}
              >
                {completing === portal.id ? '...' : 'Mark Complete'}
              </span>
            )}
            <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${srcStyle.bg} ${srcStyle.text}`}>
              {q.source}
            </span>
          </div>
        </div>
      </button>
    );
  };

  const renderCustomerGroups = (groups: CustomerGroup[], showComplete?: boolean) => {
    if (groups.length === 0) {
      return <div className="px-3 py-4 text-xs text-[#52525B] text-center">None</div>;
    }

    return groups.map(group => {
      const isExpanded = expandedCustomers.has(group.customerId);
      return (
        <div key={group.customerId} className="border-b border-white/[0.04]">
          <button
            onClick={() => toggleCustomer(group.customerId)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 transition-colors text-left ${
              isExpanded ? 'bg-white/[0.02]' : 'hover:bg-white/[0.02]'
            }`}
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold shrink-0"
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
                <span className="text-xs font-medium text-white truncate">{group.name}</span>
                <span className="text-[10px] font-medium text-[#10B981]">${group.totalValue.toLocaleString()}</span>
              </div>
            </div>

            {isExpanded ? (
              <ChevronDown className="w-3 h-3 text-[#3B82F6] shrink-0" />
            ) : (
              <ChevronRight className="w-3 h-3 text-[#52525B] shrink-0" />
            )}
          </button>

          {isExpanded && (
            <div className="pb-1.5 px-2">
              {group.quotes.map(q => renderQuoteButton(q, showComplete))}
            </div>
          )}
        </div>
      );
    });
  };

  const renderCategoryHeader = (category: PipelineCategory, count: number) => {
    const config = CATEGORY_CONFIG[category];
    const Icon = config.icon;
    const isExpanded = expandedCategories.has(category);

    return (
      <button
        onClick={() => toggleCategory(category)}
        className="w-full flex items-center gap-2 px-3 py-2.5 border-b border-white/[0.08] hover:bg-white/[0.02] transition-colors"
      >
        {config.emoji ? (
          <span className="text-sm shrink-0 leading-none">{config.emoji}</span>
        ) : Icon ? (
          <Icon className="w-3.5 h-3.5 shrink-0" style={{ color: config.color }} />
        ) : null}
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: config.color }}>
          {config.label}
        </span>
        <span
          className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full ml-auto"
          style={{ backgroundColor: `${config.color}15`, color: config.color }}
        >
          {count}
        </span>
        {isExpanded ? (
          <ChevronDown className="w-3 h-3 shrink-0" style={{ color: config.color }} />
        ) : (
          <ChevronRight className="w-3 h-3 text-[#52525B] shrink-0" />
        )}
      </button>
    );
  };

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

      {/* Pipeline categories */}
      <div className="flex-1">
        {/* Quotes */}
        {renderCategoryHeader('quotes', quoteItems.length)}
        {expandedCategories.has('quotes') && renderCustomerGroups(filteredQuotes)}

        {/* In Progress */}
        {renderCategoryHeader('inProgress', inProgressItems.length)}
        {expandedCategories.has('inProgress') && renderCustomerGroups(filteredInProgress, true)}

        {/* Completed */}
        {renderCategoryHeader('completed', completedItems.length)}
        {expandedCategories.has('completed') && renderCustomerGroups(filteredCompleted)}
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
