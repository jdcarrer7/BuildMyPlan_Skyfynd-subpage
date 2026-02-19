'use client';

import { useState, useRef, useEffect } from 'react';
import { Filter, X, Plus, Trash2 } from 'lucide-react';

export interface FilterCriterion {
  column: string;
  operator: 'is' | 'is_not' | 'contains' | 'is_empty' | 'is_not_empty';
  value: string;
}

export interface FilterColumnDef {
  key: string;
  label: string;
  emoji: string;
  type: 'text' | 'status' | 'date' | 'assignees';
  options?: { value: string; label: string }[];
}

interface FilterPanelProps {
  columns: FilterColumnDef[];
  filters: FilterCriterion[];
  onChange: (filters: FilterCriterion[]) => void;
}

const operatorLabels: Record<string, string> = {
  is: 'is',
  is_not: 'is not',
  contains: 'contains',
  is_empty: 'is empty',
  is_not_empty: 'is not empty',
};

function getOperatorsForType(type: FilterColumnDef['type']): string[] {
  switch (type) {
    case 'status':
      return ['is', 'is_not'];
    case 'text':
    case 'assignees':
      return ['contains', 'is', 'is_not', 'is_empty', 'is_not_empty'];
    case 'date':
      return ['is', 'is_not', 'is_empty', 'is_not_empty'];
    default:
      return ['is', 'is_not'];
  }
}

export function FilterButton({ columns, filters, onChange }: FilterPanelProps) {
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

  const addFilter = () => {
    const col = columns[0];
    const operators = getOperatorsForType(col.type);
    const defaultValue = col.options?.[0]?.value || '';
    onChange([...filters, { column: col.key, operator: operators[0] as FilterCriterion['operator'], value: defaultValue }]);
  };

  const removeFilter = (index: number) => {
    onChange(filters.filter((_, i) => i !== index));
  };

  const updateFilter = (index: number, updates: Partial<FilterCriterion>) => {
    onChange(filters.map((f, i) => {
      if (i !== index) return f;
      const updated = { ...f, ...updates };
      // When column changes, reset operator and value
      if (updates.column && updates.column !== f.column) {
        const newCol = columns.find((c) => c.key === updates.column);
        if (newCol) {
          const ops = getOperatorsForType(newCol.type);
          updated.operator = ops[0] as FilterCriterion['operator'];
          updated.value = newCol.options?.[0]?.value || '';
        }
      }
      return updated;
    }));
  };

  const clearAll = () => onChange([]);

  const activeCount = filters.length;

  return (
    <div className="relative" ref={panelRef}>
      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-colors ${
          activeCount > 0
            ? 'text-[#A78BFA] bg-[#A78BFA]/10 hover:bg-[#A78BFA]/15'
            : 'text-[#52525B] hover:text-[#A1A1AA] hover:bg-white/[0.04]'
        }`}
      >
        <Filter className="w-3.5 h-3.5" />
        Filter
        {activeCount > 0 && (
          <span className="bg-[#A78BFA] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
            {activeCount}
          </span>
        )}
      </button>

      {/* Panel */}
      {open && (
        <div className="absolute top-full right-0 mt-1 w-[420px] bg-[#1C1C1E] border border-white/[0.08] rounded-xl shadow-2xl z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
            <span className="text-sm font-semibold text-[#FAFAFA]">Filter</span>
            <button onClick={() => setOpen(false)} className="text-[#52525B] hover:text-[#A1A1AA] transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Filters list */}
          <div className="p-2">
            {filters.length === 0 ? (
              <p className="text-[11px] text-[#52525B] text-center py-4">No filters applied</p>
            ) : (
              <div className="space-y-1.5">
                {filters.map((filter, index) => {
                  const col = columns.find((c) => c.key === filter.column) || columns[0];
                  const operators = getOperatorsForType(col.type);
                  const needsValue = !['is_empty', 'is_not_empty'].includes(filter.operator);

                  return (
                    <div key={index} className="flex items-center gap-1.5 px-1.5 py-1.5 rounded-lg hover:bg-white/[0.02]">
                      {/* Column selector */}
                      <select
                        value={filter.column}
                        onChange={(e) => updateFilter(index, { column: e.target.value })}
                        className="appearance-none bg-[#0A0A0B] border border-white/[0.08] rounded-md px-2 py-1.5 text-[11px] text-[#FAFAFA] outline-none focus:border-[#A78BFA] cursor-pointer min-w-[90px]"
                      >
                        {columns.map((c) => (
                          <option key={c.key} value={c.key}>
                            {c.emoji}  {c.label}
                          </option>
                        ))}
                      </select>

                      {/* Operator selector */}
                      <select
                        value={filter.operator}
                        onChange={(e) => updateFilter(index, { operator: e.target.value as FilterCriterion['operator'] })}
                        className="appearance-none bg-[#0A0A0B] border border-white/[0.08] rounded-md px-2 py-1.5 text-[11px] text-[#FAFAFA] outline-none focus:border-[#A78BFA] cursor-pointer"
                      >
                        {operators.map((op) => (
                          <option key={op} value={op}>{operatorLabels[op]}</option>
                        ))}
                      </select>

                      {/* Value input */}
                      {needsValue && (
                        col.options ? (
                          <select
                            value={filter.value}
                            onChange={(e) => updateFilter(index, { value: e.target.value })}
                            className="flex-1 appearance-none bg-[#0A0A0B] border border-white/[0.08] rounded-md px-2 py-1.5 text-[11px] text-[#FAFAFA] outline-none focus:border-[#A78BFA] cursor-pointer"
                          >
                            {col.options.map((opt) => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </select>
                        ) : (
                          <input
                            value={filter.value}
                            onChange={(e) => updateFilter(index, { value: e.target.value })}
                            placeholder="Value..."
                            className="flex-1 bg-[#0A0A0B] border border-white/[0.08] rounded-md px-2 py-1.5 text-[11px] text-[#FAFAFA] outline-none focus:border-[#A78BFA]"
                          />
                        )
                      )}

                      {/* Remove */}
                      <button
                        onClick={() => removeFilter(index)}
                        className="p-1 text-[#52525B] hover:text-[#EF4444] transition-colors flex-shrink-0 rounded"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="px-3 pb-3 space-y-0.5">
            <button
              onClick={addFilter}
              className="w-full flex items-center gap-2 px-2.5 py-2 text-[11px] text-[#52525B] hover:text-[#A1A1AA] hover:bg-white/[0.04] rounded-md transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add filter
            </button>
            {filters.length > 0 && (
              <button
                onClick={clearAll}
                className="w-full flex items-center gap-2 px-2.5 py-2 text-[11px] text-[#EF4444]/70 hover:text-[#EF4444] hover:bg-[#EF4444]/5 rounded-md transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete filter
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* Apply filters to a data array */
export function applyFilters<T>(
  data: T[],
  filters: FilterCriterion[],
  getFieldValue: (item: T, column: string) => string,
): T[] {
  if (filters.length === 0) return data;

  return data.filter((item) => {
    return filters.every((filter) => {
      const raw = getFieldValue(item, filter.column);
      const val = raw.toLowerCase();
      const filterVal = filter.value.toLowerCase();

      switch (filter.operator) {
        case 'is':
          return val === filterVal;
        case 'is_not':
          return val !== filterVal;
        case 'contains':
          return val.includes(filterVal);
        case 'is_empty':
          return !raw || raw === '—';
        case 'is_not_empty':
          return !!raw && raw !== '—';
        default:
          return true;
      }
    });
  });
}
