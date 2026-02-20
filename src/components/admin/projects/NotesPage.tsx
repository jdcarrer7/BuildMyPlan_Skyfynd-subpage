'use client';

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Plus, Search, Clock, ChevronRight } from 'lucide-react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import Underline from '@tiptap/extension-underline';
import { usePersistedState } from '@/hooks/usePersistedState';
import { useResizable } from '@/hooks/useResizable';
import NoteToolbar from './NoteToolbar';

interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

function generateId() {
  return `note-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

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

export default function NotesPage() {
  const [notes, setNotes] = usePersistedState<Note[]>('projects-notes', []);
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
        heading: {
          levels: [1, 2, 3],
          HTMLAttributes: { style: 'background: rgba(255,0,0,0.15); font-size: 24px; font-weight: 700; color: #FAFAFA;' },
        },
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
      Highlight,
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
      }, 150);
    },
  });

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

  const persistNote = useCallback(
    (id: string, updates: Partial<Pick<Note, 'title' | 'content'>>) => {
      setNotes((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, ...updates, updated_at: new Date().toISOString() } : n,
        ),
      );
    },
    [setNotes],
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

  const createNote = () => {
    const now = new Date().toISOString();
    const newNote: Note = {
      id: generateId(),
      title: '',
      content: '',
      created_at: now,
      updated_at: now,
    };
    setNotes((prev) => [newNote, ...prev]);
    setSelectedId(newNote.id);
    setLocalTitle('');
    if (editor) {
      suppressEditorUpdate.current = true;
      editor.commands.setContent('');
      suppressEditorUpdate.current = false;
    }
    setTimeout(() => titleRef.current?.focus(), 50);
  };

  const deleteNote = (id: string) => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    setNotes((prev) => prev.filter((n) => n.id !== id));
    if (selectedId === id) setSelectedId(null);
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
            <h3 className="text-[13px] font-semibold text-[#FAFAFA]">Notes</h3>
            <span className="text-[10px] text-[#52525B]">{notes.length}</span>
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#3F3F46]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search notes..."
              className="w-full bg-[#0A0A0B] border border-white/[0.06] rounded-lg pl-8 pr-3 py-1.5 text-[12px] text-[#FAFAFA] placeholder:text-[#3F3F46] outline-none focus:border-[#3B82F6] transition-colors"
            />
          </div>
          <button
            onClick={createNote}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-white rounded-lg transition-all hover:opacity-90"
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
          {sorted.length === 0 ? (
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
                      <p className={`text-[12px] font-medium truncate ${isActive ? 'text-[#FAFAFA]' : 'text-[#A1A1AA]'}`}>
                        {note.title || 'Untitled'}
                      </p>
                      <p className="text-[10px] text-[#52525B] truncate mt-0.5">
                        {getPreview(note.content)}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <Clock className="w-2.5 h-2.5 text-[#3F3F46]" />
                        <span className="text-[9px] text-[#3F3F46]">{formatRelativeDate(note.updated_at)}</span>
                      </div>
                    </div>
                    {isActive && (
                      <ChevronRight className="w-3 h-3 text-[#3B82F6] mt-0.5 flex-shrink-0" />
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
            <NoteToolbar editor={editor} onDelete={() => deleteNote(selectedNote.id)} />

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
                onClick={createNote}
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
