'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  ArrowUpNarrowWide,
  ArrowDownWideNarrow,
  Filter,
  EyeOff,
  ArrowUp,
  ArrowDown,
  X,
} from 'lucide-react';

interface ColumnHeaderMenuProps {
  columnKey: string;
  columnLabel: string;
  columnEmoji: string;
  /** Whether this column can be hidden (e.g. 'name' column can't) */
  canHide?: boolean;
  /** Current sort direction for this column, or null if not sorted */
  sortDir: 'asc' | 'desc' | null;
  /** Callbacks */
  onSortAsc: () => void;
  onSortDesc: () => void;
  onClearSort: () => void;
  onFilter: () => void;
  onHide: () => void;
  /** Resize handle (rendered inside the th) */
  resizeHandle: React.ReactNode;
}

export default function ColumnHeaderMenu({
  columnLabel,
  columnEmoji,
  canHide = true,
  sortDir,
  onSortAsc,
  onSortDesc,
  onClearSort,
  onFilter,
  onHide,
  resizeHandle,
}: ColumnHeaderMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node) &&
          btnRef.current && !btnRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  const handleAction = useCallback((action: () => void) => {
    action();
    setOpen(false);
  }, []);

  return (
    <>
      {/* Header label — click to toggle menu */}
      <div
        ref={btnRef}
        className="flex items-center gap-1 cursor-pointer hover:text-[#A1A1AA] transition-colors select-none"
        onClick={() => setOpen((v) => !v)}
      >
        <span>{columnEmoji}</span>
        <span>{columnLabel}</span>
        {sortDir && (
          <span className="ml-0.5">
            {sortDir === 'asc' ? (
              <ArrowUp className="w-3 h-3 text-[#3B82F6]" />
            ) : (
              <ArrowDown className="w-3 h-3 text-[#3B82F6]" />
            )}
          </span>
        )}
      </div>

      {/* Resize handle — always present */}
      {resizeHandle}

      {/* Dropdown menu */}
      {open && (
        <div
          ref={menuRef}
          className="absolute left-0 top-full mt-1 z-50 bg-[#1C1C1E] border border-white/[0.1] rounded-lg shadow-2xl py-1.5 min-w-[200px]"
          style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" }}
        >
          {/* Sort section */}
          <button
            onClick={() => handleAction(sortDir === 'asc' ? onClearSort : onSortAsc)}
            className={`w-full flex items-center gap-2.5 px-3 py-2 text-[13px] transition-colors ${
              sortDir === 'asc'
                ? 'text-[#3B82F6] bg-[#3B82F6]/10 hover:bg-[#3B82F6]/15'
                : 'text-[#D4D4D8] hover:bg-white/[0.06]'
            }`}
          >
            <ArrowUpNarrowWide className="w-4 h-4 flex-shrink-0" />
            <span>Sort ascending</span>
            {sortDir === 'asc' && <X className="w-3 h-3 ml-auto opacity-60" />}
          </button>
          <button
            onClick={() => handleAction(sortDir === 'desc' ? onClearSort : onSortDesc)}
            className={`w-full flex items-center gap-2.5 px-3 py-2 text-[13px] transition-colors ${
              sortDir === 'desc'
                ? 'text-[#3B82F6] bg-[#3B82F6]/10 hover:bg-[#3B82F6]/15'
                : 'text-[#D4D4D8] hover:bg-white/[0.06]'
            }`}
          >
            <ArrowDownWideNarrow className="w-4 h-4 flex-shrink-0" />
            <span>Sort descending</span>
            {sortDir === 'desc' && <X className="w-3 h-3 ml-auto opacity-60" />}
          </button>

          {/* Divider */}
          <div className="h-px bg-white/[0.06] mx-2 my-1.5" />

          {/* Filter */}
          <button
            onClick={() => handleAction(onFilter)}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-[#D4D4D8] hover:bg-white/[0.06] transition-colors"
          >
            <Filter className="w-4 h-4 flex-shrink-0" />
            <span>Filter</span>
          </button>

          {/* Hide */}
          {canHide && (
            <button
              onClick={() => handleAction(onHide)}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-[#D4D4D8] hover:bg-white/[0.06] transition-colors"
            >
              <EyeOff className="w-4 h-4 flex-shrink-0" />
              <span>Hide</span>
            </button>
          )}
        </div>
      )}
    </>
  );
}
