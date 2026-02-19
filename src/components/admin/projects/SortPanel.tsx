'use client';

import { useState, useRef, useEffect } from 'react';
import { ArrowUpDown, X, Plus, Trash2, GripVertical } from 'lucide-react';

export interface SortCriterion {
  column: string;
  dir: 'asc' | 'desc';
}

export interface ColumnDef {
  key: string;
  label: string;
  emoji: string;
}

interface SortPanelProps {
  columns: ColumnDef[];
  criteria: SortCriterion[];
  onChange: (criteria: SortCriterion[]) => void;
}

export function SortButton({ columns, criteria, onChange }: SortPanelProps) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on outside click
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

  const usedColumns = new Set(criteria.map((c) => c.column));
  const hasAvailable = columns.some((c) => !usedColumns.has(c.key));

  const addCriterion = () => {
    const available = columns.find((c) => !usedColumns.has(c.key));
    if (!available) return;
    onChange([...criteria, { column: available.key, dir: 'asc' }]);
  };

  const removeCriterion = (index: number) => {
    onChange(criteria.filter((_, i) => i !== index));
  };

  const updateColumn = (index: number, column: string) => {
    onChange(criteria.map((c, i) => (i === index ? { ...c, column } : c)));
  };

  const updateDir = (index: number, dir: 'asc' | 'desc') => {
    onChange(criteria.map((c, i) => (i === index ? { ...c, dir } : c)));
  };

  const clearAll = () => {
    onChange([]);
  };

  return (
    <div className="relative" ref={panelRef}>
      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-colors ${
          criteria.length > 0
            ? 'text-[#3B82F6] bg-[#3B82F6]/10 hover:bg-[#3B82F6]/15'
            : 'text-[#52525B] hover:text-[#A1A1AA] hover:bg-white/[0.04]'
        }`}
      >
        <ArrowUpDown className="w-3.5 h-3.5" />
        Sort
        {criteria.length > 0 && (
          <span className="bg-[#3B82F6] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
            {criteria.length}
          </span>
        )}
      </button>

      {/* Panel */}
      {open && (
        <div className="absolute top-full right-0 mt-1 w-[360px] bg-[#1C1C1E] border border-white/[0.08] rounded-xl shadow-2xl z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
            <span className="text-sm font-semibold text-[#FAFAFA]">Sort</span>
            <button
              onClick={() => setOpen(false)}
              className="text-[#52525B] hover:text-[#A1A1AA] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Criteria list */}
          <div className="p-2">
            {criteria.length === 0 ? (
              <p className="text-[11px] text-[#52525B] text-center py-4">No sorts applied</p>
            ) : (
              <div className="space-y-1.5">
                {criteria.map((criterion, index) => (
                  <div
                    key={`${criterion.column}-${index}`}
                    className="flex items-center gap-1.5 px-1.5 py-1.5 rounded-lg hover:bg-white/[0.02]"
                  >
                    {/* Drag handle */}
                    <GripVertical className="w-3.5 h-3.5 text-[#3F3F46] flex-shrink-0 cursor-grab" />

                    {/* Column selector */}
                    <select
                      value={criterion.column}
                      onChange={(e) => updateColumn(index, e.target.value)}
                      className="flex-1 appearance-none bg-[#0A0A0B] border border-white/[0.08] rounded-md px-2.5 py-1.5 text-[11px] text-[#FAFAFA] outline-none focus:border-[#3B82F6] cursor-pointer"
                    >
                      {columns.map((c) => (
                        <option
                          key={c.key}
                          value={c.key}
                          disabled={usedColumns.has(c.key) && c.key !== criterion.column}
                        >
                          {c.emoji}  {c.label}
                        </option>
                      ))}
                    </select>

                    {/* Direction selector */}
                    <select
                      value={criterion.dir}
                      onChange={(e) => updateDir(index, e.target.value as 'asc' | 'desc')}
                      className="appearance-none bg-[#0A0A0B] border border-white/[0.08] rounded-md px-2.5 py-1.5 text-[11px] text-[#FAFAFA] outline-none focus:border-[#3B82F6] cursor-pointer"
                    >
                      <option value="asc">Ascending</option>
                      <option value="desc">Descending</option>
                    </select>

                    {/* Remove */}
                    <button
                      onClick={() => removeCriterion(index)}
                      className="p-1 text-[#52525B] hover:text-[#EF4444] transition-colors flex-shrink-0 rounded"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="px-3 pb-3 space-y-0.5">
            {hasAvailable && (
              <button
                onClick={addCriterion}
                className="w-full flex items-center gap-2 px-2.5 py-2 text-[11px] text-[#52525B] hover:text-[#A1A1AA] hover:bg-white/[0.04] rounded-md transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add sort
              </button>
            )}
            {criteria.length > 0 && (
              <button
                onClick={clearAll}
                className="w-full flex items-center gap-2 px-2.5 py-2 text-[11px] text-[#EF4444]/70 hover:text-[#EF4444] hover:bg-[#EF4444]/5 rounded-md transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete sort
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
