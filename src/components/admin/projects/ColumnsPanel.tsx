'use client';

import { useState, useRef, useEffect } from 'react';
import { Columns3, X, Eye, EyeOff } from 'lucide-react';

interface ColumnDef {
  key: string;
  label: string;
  emoji: string;
}

interface ColumnsPanelProps {
  columns: ColumnDef[];
  visibleKeys: string[];
  onChange: (keys: string[]) => void;
  /** Column keys that cannot be hidden */
  requiredKeys?: string[];
}

export function ColumnsButton({ columns, visibleKeys, onChange, requiredKeys = [] }: ColumnsPanelProps) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const hiddenCount = columns.length - visibleKeys.length;

  const toggle = (key: string) => {
    if (requiredKeys.includes(key)) return;
    if (visibleKeys.includes(key)) {
      onChange(visibleKeys.filter((k) => k !== key));
    } else {
      // Insert at original position
      const ordered = columns.map((c) => c.key).filter((k) => visibleKeys.includes(k) || k === key);
      onChange(ordered);
    }
  };

  const showAll = () => onChange(columns.map((c) => c.key));

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-colors ${
          hiddenCount > 0
            ? 'text-[#F59E0B] bg-[#F59E0B]/10 hover:bg-[#F59E0B]/15'
            : 'text-[#52525B] hover:text-[#A1A1AA] hover:bg-white/[0.04]'
        }`}
      >
        <Columns3 className="w-3.5 h-3.5" />
        Columns
        {hiddenCount > 0 && (
          <span className="bg-[#F59E0B] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
            {hiddenCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-1 w-[240px] bg-[#1C1C1E] border border-white/[0.08] rounded-xl shadow-2xl z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
            <span className="text-sm font-semibold text-[#FAFAFA]">Columns</span>
            <button onClick={() => setOpen(false)} className="text-[#52525B] hover:text-[#A1A1AA] transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-2">
            {columns.map((col) => {
              const isVisible = visibleKeys.includes(col.key);
              const isRequired = requiredKeys.includes(col.key);
              return (
                <button
                  key={col.key}
                  onClick={() => toggle(col.key)}
                  disabled={isRequired}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[11px] transition-colors ${
                    isRequired
                      ? 'text-[#52525B] cursor-not-allowed'
                      : isVisible
                        ? 'text-[#FAFAFA] hover:bg-white/[0.04]'
                        : 'text-[#52525B] hover:bg-white/[0.04]'
                  }`}
                >
                  {isVisible ? (
                    <Eye className="w-3.5 h-3.5 text-[#3B82F6]" />
                  ) : (
                    <EyeOff className="w-3.5 h-3.5" />
                  )}
                  <span>{col.emoji}</span>
                  <span className="flex-1 text-left">{col.label}</span>
                </button>
              );
            })}
          </div>

          {hiddenCount > 0 && (
            <div className="px-3 pb-3">
              <button
                onClick={showAll}
                className="w-full flex items-center justify-center gap-1.5 px-2.5 py-2 text-[11px] text-[#3B82F6] hover:bg-[#3B82F6]/10 rounded-md transition-colors"
              >
                Show all columns
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
