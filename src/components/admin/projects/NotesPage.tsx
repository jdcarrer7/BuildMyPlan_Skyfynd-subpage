'use client';

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Plus, Search, Clock, ChevronRight, Loader2 } from 'lucide-react';
import { useEditor, EditorContent } from '@tiptap/react';
import { mergeAttributes } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Heading from '@tiptap/extension-heading';
import Placeholder from '@tiptap/extension-placeholder';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import Underline from '@tiptap/extension-underline';

const HEADING_STYLES: Record<number, string> = {
  1: 'font-size: 28px; font-weight: 700; color: #FAFAFA; margin: 20px 0 8px; line-height: 1.3;',
  2: 'font-size: 22px; font-weight: 600; color: #FAFAFA; margin: 16px 0 6px; line-height: 1.35;',
  3: 'font-size: 18px; font-weight: 600; color: #E4E4E7; margin: 12px 0 4px; line-height: 1.4;',
};

const StyledHeading = Heading.extend({
  renderHTML({ node, HTMLAttributes }) {
    const level = node.attrs.level as number;
    const tag = `h${level}` as keyof HTMLElementTagNameMap;
    return [tag, mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, { style: HEADING_STYLES[level] || '' }), 0];
  },
});
import { useResizable } from '@/hooks/useResizable';
import NoteToolbar from './NoteToolbar';
import type { Note } from '@/lib/types/project';

function formatRelativeDate(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60_000);
  const diffHr = Math.floor(diffMs / 3_600_000);
  const diffDay = Math.floor(diffMs / 86_400_000);

  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatFullDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

/** Extract plain text from Tiptap JSON content for sidebar preview */
function extractTextFromJSON(doc: Record<string, unknown>): string {
  const texts: string[] = [];
  function walk(node: Record<string, unknown>) {
    if (node.text && typeof node.text === 'string') {
      texts.push(node.text);
    }
    if (Array.isArray(node.content)) {
      for (const child of node.content) {
        walk(child as Record<string, unknown>);
      }
    }
  }
  walk(doc);
  return texts.join(' ');
}

function getPreview(content: string, maxLen = 80) {
  if (!content) return 'No content';
  // Try to parse as Tiptap JSON
  if (content.startsWith('{')) {
    try {
      const doc = JSON.parse(content);
      const text = extractTextFromJSON(doc).trim();
      if (!text) return 'No content';
      return text.length > maxLen ? text.slice(0, maxLen) + '...' : text;
    } catch {
      // fall through to plain text
    }
  }
  const first = content.split('\n').find((l) => l.trim()) || '';
  return first.length > maxLen ? first.slice(0, maxLen) + '...' : first;
}

/** Parse stored content: detect JSON vs plain text, return Tiptap-compatible content */
function parseNoteContent(content: string): Record<string, unknown> | string {
  if (!content) return '';
  if (content.startsWith('{')) {
    try {
      return JSON.parse(content);
    } catch {
      // fall through
    }
  }
  // Plain text — wrap as a Tiptap paragraph
  return content;
}

const LOCALSTORAGE_KEY = 'projects-notes';
const MIGRATION_FLAG = 'projects-notes-migrated';

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  // Local editing state — mirrors selected note, saves back on every change
  const [localTitle, setLocalTitle] = useState('');
  const titleRef = useRef<HTMLInputElement>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const suppressEditorUpdate = useRef(false);
  const selectedIdRef = useRef<string | null>(null);
  const persistNoteRef = useRef<(id: string, updates: Partial<Pick<Note, 'title' | 'content'>>) => void>(null!);

  const listPanel = useResizable({
    storageKey: 'notes-list-width',
    defaultWidth: 280,
    minWidth: 200,
    maxWidth: 450,
  });

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: false,
        bulletList: {
          HTMLAttributes: { style: 'list-style-type: disc; padding-left: 24px; margin: 6px 0;' },
        },
        orderedList: {
          HTMLAttributes: { style: 'list-style-type: decimal; padding-left: 24px; margin: 6px 0;' },
        },
        blockquote: {
          HTMLAttributes: { style: 'border-left: 3px solid #3B82F6; padding-left: 16px; margin: 12px 0; color: #A1A1AA; font-style: italic;' },
        },
      }),
      StyledHeading.configure({ levels: [1, 2, 3] }),
      Highlight.configure({ multicolor: true }),
      Underline,
      TaskList,
      TaskItem.configure({ nested: true }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder: 'Start writing...' }),
    ],
    editorProps: {
      attributes: {
        class: 'tiptap-editor outline-none min-h-[200px] px-6 py-4 text-[14px] text-[#D4D4D8] leading-relaxed caret-[#3B82F6]',
        style: "font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
      },
    },
    onUpdate: ({ editor: ed }) => {
      if (suppressEditorUpdate.current) return;
      const json = JSON.stringify(ed.getJSON());
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => {
        const id = selectedIdRef.current;
        if (id && persistNoteRef.current) persistNoteRef.current(id, { content: json });
      }, 500);
    },
  });

  // ── Fetch notes from Supabase + migrate localStorage if needed ──
  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        const res = await fetch('/api/admin/notes');
        const data = await res.json();
        if (cancelled) return;

        if (data.status === 'success') {
          let dbNotes: Note[] = data.notes || [];

          // Migrate localStorage notes if they haven't been migrated yet
          const alreadyMigrated = localStorage.getItem(MIGRATION_FLAG);
          if (!alreadyMigrated) {
            try {
              const raw = localStorage.getItem(LOCALSTORAGE_KEY);
              if (raw) {
                const localNotes: Note[] = JSON.parse(raw);
                if (localNotes.length > 0) {
                  // Upload to Supabase
                  const migrateRes = await fetch('/api/admin/notes', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ notes: localNotes.map((n) => ({ title: n.title, content: n.content })) }),
                  });
                  const migrateData = await migrateRes.json();
                  if (!cancelled && migrateData.status === 'success') {
                    dbNotes = [...(migrateData.notes || []), ...dbNotes];
                    // Only mark migration done if it actually succeeded
                    localStorage.setItem(MIGRATION_FLAG, '1');
                  }
                } else {
                  // No local notes to migrate — mark done
                  localStorage.setItem(MIGRATION_FLAG, '1');
                }
              } else {
                // No localStorage key — mark done
                localStorage.setItem(MIGRATION_FLAG, '1');
              }
            } catch {
              // localStorage parse failure — don't mark as migrated so it retries
            }
          }

          if (!cancelled) {
            setNotes(dbNotes);
            setLoading(false);
          }
        } else {
          // API failed (table may not exist yet) — fall back to localStorage
          // Also clear migration flag so it retries once table is created
          localStorage.removeItem(MIGRATION_FLAG);
          if (!cancelled) {
            try {
              const raw = localStorage.getItem(LOCALSTORAGE_KEY);
              if (raw) {
                setNotes(JSON.parse(raw));
              }
            } catch { /* ignore */ }
            setLoading(false);
          }
        }
      } catch {
        // Network error — fall back to localStorage
        if (!cancelled) {
          try {
            const raw = localStorage.getItem(LOCALSTORAGE_KEY);
            if (raw) {
              setNotes(JSON.parse(raw));
            }
          } catch { /* ignore */ }
          setLoading(false);
        }
      }
    }

    init();
    return () => { cancelled = true; };
  }, []);

  const selectedNote = useMemo(
    () => notes.find((n) => n.id === selectedId) ?? null,
    [notes, selectedId],
  );

  // Sync local state when selected note changes
  useEffect(() => {
    if (selectedNote) {
      setLocalTitle(selectedNote.title);
      // Set Tiptap content
      if (editor) {
        suppressEditorUpdate.current = true;
        const parsed = parseNoteContent(selectedNote.content);
        if (typeof parsed === 'string') {
          editor.commands.setContent(parsed ? `<p>${parsed}</p>` : '');
        } else {
          editor.commands.setContent(parsed);
        }
        suppressEditorUpdate.current = false;
      }
    }
  }, [selectedNote?.id, editor]); // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = useMemo(() => {
    if (!search.trim()) return notes;
    const q = search.toLowerCase();
    return notes.filter((n) => {
      if (n.title.toLowerCase().includes(q)) return true;
      // Extract plain text from content for search
      let text = n.content;
      if (text.startsWith('{')) {
        try {
          text = extractTextFromJSON(JSON.parse(text));
        } catch { /* use raw */ }
      }
      return text.toLowerCase().includes(q);
    });
  }, [notes, search]);

  const sorted = useMemo(
    () => [...filtered].sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()),
    [filtered],
  );

  // Auto-select first note if nothing selected
  useEffect(() => {
    if (!selectedId && sorted.length > 0) {
      setSelectedId(sorted[0].id);
    }
  }, [selectedId, sorted]);

  // Persist note update to Supabase (debounced in the Tiptap onUpdate)
  const persistNote = useCallback(
    (id: string, updates: Partial<Pick<Note, 'title' | 'content'>>) => {
      // Optimistic local update
      setNotes((prev) => {
        const updated = prev.map((n) =>
          n.id === id ? { ...n, ...updates, updated_at: new Date().toISOString() } : n,
        );
        // Write-through to localStorage as backup
        try { localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(updated)); } catch { /* ignore */ }
        return updated;
      });
      // Save to Supabase
      fetch(`/api/admin/notes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      }).catch(() => {
        // Silent fail — localStorage backup ensures no data loss
      });
    },
    [],
  );

  // Keep refs in sync for Tiptap onUpdate closure
  selectedIdRef.current = selectedId;
  persistNoteRef.current = persistNote;

  // Flush any pending save before switching notes
  const flushAndSelect = useCallback(
    (newId: string) => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
        saveTimerRef.current = null;
      }
      // Save current note before switching
      if (selectedId && selectedId !== newId && editor) {
        persistNote(selectedId, { title: localTitle, content: JSON.stringify(editor.getJSON()) });
      }
      setSelectedId(newId);
    },
    [selectedId, localTitle, editor, persistNote],
  );

  const handleCreateNote = async () => {
    try {
      const res = await fetch('/api/admin/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: '', content: '' }),
      });
      const data = await res.json();
      if (data.status === 'success' && data.note) {
        setNotes((prev) => {
          const updated = [data.note, ...prev];
          try { localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(updated)); } catch { /* ignore */ }
          return updated;
        });
        setSelectedId(data.note.id);
        setLocalTitle('');
        if (editor) {
          suppressEditorUpdate.current = true;
          editor.commands.setContent('');
          suppressEditorUpdate.current = false;
        }
        setTimeout(() => titleRef.current?.focus(), 50);
      }
    } catch {
      // Silent fail
    }
  };

  const handleDeleteNote = async (id: string) => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    // Optimistic remove
    setNotes((prev) => {
      const updated = prev.filter((n) => n.id !== id);
      try { localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(updated)); } catch { /* ignore */ }
      return updated;
    });
    if (selectedId === id) setSelectedId(null);
    // Delete from Supabase
    fetch(`/api/admin/notes/${id}`, { method: 'DELETE' }).catch(() => {});
  };

  const handleTitleChange = (value: string) => {
    setLocalTitle(value);
    if (selectedId) persistNote(selectedId, { title: value });
  };


  return (
    <div className="flex h-screen -m-6">
      {/* Notes list panel */}
      <div
        className="bg-[#111113] border-r border-white/[0.06] flex flex-col flex-shrink-0"
        style={{ width: listPanel.width }}
      >
        {/* Header + search */}
        <div className="p-3 space-y-2 border-b border-white/[0.06]">
          <div className="flex items-center justify-between">
            <h3 className="text-[15px] font-semibold text-[#FAFAFA]">Notes</h3>
            <span className="text-[12px] text-[#71717A]">{notes.length}</span>
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#52525B]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search notes..."
              className="w-full bg-[#0A0A0B] border border-white/[0.06] rounded-lg pl-8 pr-3 py-2 text-[13px] text-[#FAFAFA] placeholder:text-[#52525B] outline-none focus:border-[#3B82F6] transition-colors"
            />
          </div>
          <button
            onClick={handleCreateNote}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-[13px] font-medium text-white rounded-lg transition-all hover:opacity-90"
            style={{
              background: 'linear-gradient(to right, rgba(167,139,250,0.75) 0%, rgba(96,175,250,0.85) 40%, rgba(52,211,153,0.8) 100%)',
            }}
          >
            <Plus className="w-3.5 h-3.5" />
            New Note
          </button>
        </div>

        {/* Notes list */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-5 h-5 text-[#3B82F6] animate-spin" />
            </div>
          ) : sorted.length === 0 ? (
            <div className="px-4 py-8 text-center text-[11px] text-[#3F3F46]">
              {search ? 'No matching notes' : 'No notes yet — create one to get started'}
            </div>
          ) : (
            sorted.map((note) => {
              const isActive = note.id === selectedId;
              return (
                <button
                  key={note.id}
                  onClick={() => flushAndSelect(note.id)}
                  className={`w-full text-left px-4 py-3 border-b border-white/[0.04] transition-all group ${
                    isActive ? 'bg-white/[0.04]' : 'hover:bg-white/[0.02]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className={`text-[14px] font-semibold truncate ${isActive ? 'text-[#FAFAFA]' : 'text-[#D4D4D8]'}`}>
                        {note.title || 'Untitled'}
                      </p>
                      <p className="text-[12px] text-[#A1A1AA] truncate mt-1">
                        {getPreview(note.content)}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <Clock className="w-3 h-3 text-[#71717A]" />
                        <span className="text-[11px] text-[#71717A]">{formatRelativeDate(note.updated_at)}</span>
                      </div>
                    </div>
                    {isActive && (
                      <ChevronRight className="w-4 h-4 text-[#3B82F6] mt-0.5 flex-shrink-0" />
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Resize handle */}
      <div
        onMouseDown={listPanel.onMouseDown}
        className="w-1 flex-shrink-0 cursor-col-resize hover:bg-[#3B82F6]/40 transition-colors relative"
      >
        <div className="absolute inset-y-0 -left-1 -right-1" />
      </div>

      {/* Editor panel */}
      <div className="flex-1 flex flex-col bg-[#0A0A0B] min-w-0">
        {selectedNote ? (
          <>
            {/* Note header */}
            <div className="flex items-center px-6 py-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2 text-[10px] text-[#52525B]">
                <span>Created {formatFullDate(selectedNote.created_at)}</span>
                <span className="text-[#3F3F46]">&middot;</span>
                <span>Updated {formatRelativeDate(selectedNote.updated_at)}</span>
              </div>
            </div>

            {/* Title */}
            <div className="px-6 pt-6">
              <input
                ref={titleRef}
                value={localTitle}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Untitled"
                className="w-full bg-transparent text-2xl font-bold text-[#FAFAFA] placeholder:text-[#3F3F46] outline-none caret-[#3B82F6]"
                style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" }}
              />
            </div>

            {/* Formatting toolbar */}
            <NoteToolbar editor={editor} onDelete={() => handleDeleteNote(selectedNote.id)} />

            {/* Rich text editor */}
            <div className="flex-1 overflow-y-auto">
              <EditorContent editor={editor} />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-[14px] text-[#3F3F46] mb-3">Select a note or create a new one</p>
              <button
                onClick={handleCreateNote}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-[12px] font-medium text-white rounded-lg transition-all hover:opacity-90"
                style={{
                  background: 'linear-gradient(to right, rgba(167,139,250,0.75) 0%, rgba(96,175,250,0.85) 40%, rgba(52,211,153,0.8) 100%)',
                }}
              >
                <Plus className="w-3.5 h-3.5" />
                New Note
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
