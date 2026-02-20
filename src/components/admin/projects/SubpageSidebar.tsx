'use client';

import { useState, useRef, useEffect } from 'react';
import { Plus, Trash2, MoreHorizontal, FileText } from 'lucide-react';
import { usePersistedState } from '@/hooks/usePersistedState';

export interface Subpage {
  id: string;
  name: string;
  icon: string;
  type: 'table' | 'notes' | 'custom';
}

const DEFAULT_SUBPAGES: Subpage[] = [
  { id: 'table', name: 'Table', icon: '📊', type: 'table' },
  { id: 'notes', name: 'Notes', icon: '📝', type: 'notes' },
];

interface SubpageSidebarProps {
  activeId: string;
  onSelect: (id: string) => void;
}

export default function SubpageSidebar({ activeId, onSelect }: SubpageSidebarProps) {
  const [subpages, setSubpages] = usePersistedState<Subpage[]>('projects-subpages', DEFAULT_SUBPAGES);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const editRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editingId && editRef.current) {
      editRef.current.focus();
      editRef.current.select();
    }
  }, [editingId]);

  // Close context menu on outside click
  useEffect(() => {
    if (!menuOpenId) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpenId(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpenId]);

  const startRename = (subpage: Subpage) => {
    setEditingId(subpage.id);
    setEditValue(subpage.name);
    setMenuOpenId(null);
  };

  const saveRename = () => {
    if (editingId && editValue.trim()) {
      setSubpages((prev) =>
        prev.map((s) => (s.id === editingId ? { ...s, name: editValue.trim() } : s))
      );
    }
    setEditingId(null);
    setEditValue('');
  };

  const deleteSubpage = (id: string) => {
    setSubpages((prev) => prev.filter((s) => s.id !== id));
    setMenuOpenId(null);
    if (activeId === id) {
      onSelect(subpages[0]?.id || 'table');
    }
  };

  const addSubpage = () => {
    const newId = `custom-${Date.now()}`;
    const newPage: Subpage = {
      id: newId,
      name: 'New Page',
      icon: '📄',
      type: 'custom',
    };
    setSubpages((prev) => [...prev, newPage]);
    onSelect(newId);
    // Start editing the name immediately
    setTimeout(() => {
      setEditingId(newId);
      setEditValue('New Page');
    }, 50);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Section header */}
      <div className="px-4 py-3 border-b border-white/[0.06]">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#52525B]">
          Pages
        </span>
      </div>

      {/* Subpage list */}
      <div className="flex-1 overflow-y-auto py-1">
        {subpages.map((subpage) => {
          const isActive = subpage.id === activeId;

          return (
            <div
              key={subpage.id}
              className="relative group"
            >
              <button
                onClick={() => onSelect(subpage.id)}
                onDoubleClick={() => startRename(subpage)}
                className={`w-full flex items-center gap-2.5 px-4 py-2 text-left transition-all border-l-2 ${
                  isActive
                    ? 'bg-white/[0.04] border-l-[#3B82F6] text-[#FAFAFA]'
                    : 'border-l-transparent text-[#A1A1AA] hover:bg-white/[0.02] hover:text-[#FAFAFA]'
                }`}
              >
                <span className="text-sm flex-shrink-0">{subpage.icon}</span>
                {editingId === subpage.id ? (
                  <input
                    ref={editRef}
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={saveRename}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveRename();
                      if (e.key === 'Escape') { setEditingId(null); setEditValue(''); }
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 bg-transparent text-[13px] text-[#FAFAFA] outline-none caret-[#3B82F6] border-b border-[#3B82F6]/50"
                  />
                ) : (
                  <span className="text-[13px] font-medium truncate flex-1">{subpage.name}</span>
                )}

                {/* Context menu trigger */}
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpenId(menuOpenId === subpage.id ? null : subpage.id);
                  }}
                  className="p-0.5 rounded opacity-0 group-hover:opacity-100 text-[#52525B] hover:text-[#A1A1AA] hover:bg-white/[0.06] transition-all cursor-pointer"
                >
                  <MoreHorizontal className="w-3.5 h-3.5" />
                </div>
              </button>

              {/* Context menu */}
              {menuOpenId === subpage.id && (
                <div
                  ref={menuRef}
                  className="absolute right-2 top-full mt-0.5 w-36 bg-[#1C1C1E] border border-white/[0.08] rounded-lg shadow-2xl z-50 overflow-hidden"
                >
                  <button
                    onClick={() => startRename(subpage)}
                    className="w-full flex items-center gap-2 px-3 py-2 text-[11px] text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-white/[0.04] transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Rename
                  </button>
                  {subpages.length > 1 && (
                    <button
                      onClick={() => deleteSubpage(subpage.id)}
                      className="w-full flex items-center gap-2 px-3 py-2 text-[11px] text-[#EF4444]/70 hover:text-[#EF4444] hover:bg-[#EF4444]/5 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add subpage button */}
      <div className="px-3 py-3 border-t border-white/[0.06]">
        <button
          onClick={addSubpage}
          className="w-full flex items-center gap-2 px-2.5 py-2 text-[11px] text-[#52525B] hover:text-[#A1A1AA] hover:bg-white/[0.04] rounded-md transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Add page
        </button>
      </div>
    </div>
  );
}
