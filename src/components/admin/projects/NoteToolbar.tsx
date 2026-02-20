'use client';

import { useState, useRef, useEffect } from 'react';
import type { Editor } from '@tiptap/react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Highlighter,
  ChevronDown,
  Heading1,
  Heading2,
  Heading3,
  Pilcrow,
  List,
  ListOrdered,
  ListChecks,
  Quote,
  Minus,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Trash2,
  XCircle,
} from 'lucide-react';

const HIGHLIGHT_COLORS = [
  { label: 'Yellow', color: '#FBBF24' },
  { label: 'Green', color: '#34D399' },
  { label: 'Blue', color: '#60A5FA' },
  { label: 'Pink', color: '#F472B6' },
  { label: 'Purple', color: '#A78BFA' },
  { label: 'Orange', color: '#FB923C' },
  { label: 'Red', color: '#F87171' },
  { label: 'Teal', color: '#2DD4BF' },
];

interface NoteToolbarProps {
  editor: Editor | null;
  onDelete?: () => void;
}

function ToolbarButton({
  onClick,
  active,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      title={title}
      className={`p-1.5 rounded transition-colors ${
        active
          ? 'bg-[#3B82F6]/20 text-[#60A5FA]'
          : 'text-[#71717A] hover:text-[#A1A1AA] hover:bg-white/[0.04]'
      }`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="w-px h-5 bg-white/[0.08] mx-1" />;
}

const ICON_SIZE = 'w-3.5 h-3.5';

function HighlightPicker({ editor }: { editor: Editor }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const isActive = editor.isActive('highlight');
  // Get the current highlight color for the indicator dot
  const activeColor = HIGHLIGHT_COLORS.find((c) =>
    editor.isActive('highlight', { color: c.color }),
  )?.color;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => setOpen((v) => !v)}
        title="Highlight"
        className={`flex items-center gap-0.5 p-1.5 rounded transition-colors ${
          isActive
            ? 'bg-[#3B82F6]/20 text-[#60A5FA]'
            : 'text-[#71717A] hover:text-[#A1A1AA] hover:bg-white/[0.04]'
        }`}
      >
        <div className="relative">
          <Highlighter className={ICON_SIZE} />
          {activeColor && (
            <div
              className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-2.5 h-[2px] rounded-full"
              style={{ background: activeColor }}
            />
          )}
        </div>
        <ChevronDown className="w-2.5 h-2.5" />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 bg-[#1A1A1E] border border-white/[0.08] rounded-lg p-2 shadow-xl z-50">
          <div className="grid grid-cols-4 gap-1.5">
            {HIGHLIGHT_COLORS.map((c) => (
              <button
                key={c.color}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  editor.chain().focus().toggleHighlight({ color: c.color }).run();
                  setOpen(false);
                }}
                title={c.label}
                className={`w-6 h-6 rounded-md transition-all hover:scale-110 ${
                  editor.isActive('highlight', { color: c.color })
                    ? 'ring-2 ring-white/40 ring-offset-1 ring-offset-[#1A1A1E]'
                    : ''
                }`}
                style={{ background: c.color }}
              />
            ))}
          </div>
          {isActive && (
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                editor.chain().focus().unsetHighlight().run();
                setOpen(false);
              }}
              className="flex items-center gap-1.5 w-full mt-1.5 pt-1.5 border-t border-white/[0.06] px-1 py-1 text-[10px] text-[#71717A] hover:text-[#A1A1AA] transition-colors rounded"
            >
              <XCircle className="w-3 h-3" />
              Remove highlight
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function NoteToolbar({ editor, onDelete }: NoteToolbarProps) {
  if (!editor) return null;

  return (
    <div className="flex items-center gap-0.5 px-6 py-2 border-b border-white/[0.06] flex-wrap">
      {/* Text formatting */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={editor.isActive('bold')}
        title="Bold (Cmd+B)"
      >
        <Bold className={ICON_SIZE} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        active={editor.isActive('italic')}
        title="Italic (Cmd+I)"
      >
        <Italic className={ICON_SIZE} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        active={editor.isActive('underline')}
        title="Underline (Cmd+U)"
      >
        <Underline className={ICON_SIZE} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        active={editor.isActive('strike')}
        title="Strikethrough"
      >
        <Strikethrough className={ICON_SIZE} />
      </ToolbarButton>
      <HighlightPicker editor={editor} />

      <Divider />

      {/* Headings */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        active={editor.isActive('heading', { level: 1 })}
        title="Heading 1"
      >
        <Heading1 className={ICON_SIZE} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        active={editor.isActive('heading', { level: 2 })}
        title="Heading 2"
      >
        <Heading2 className={ICON_SIZE} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        active={editor.isActive('heading', { level: 3 })}
        title="Heading 3"
      >
        <Heading3 className={ICON_SIZE} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setParagraph().run()}
        active={editor.isActive('paragraph') && !editor.isActive('heading')}
        title="Paragraph"
      >
        <Pilcrow className={ICON_SIZE} />
      </ToolbarButton>

      <Divider />

      {/* Lists */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editor.isActive('bulletList')}
        title="Bullet List"
      >
        <List className={ICON_SIZE} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        active={editor.isActive('orderedList')}
        title="Numbered List"
      >
        <ListOrdered className={ICON_SIZE} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleTaskList().run()}
        active={editor.isActive('taskList')}
        title="Checklist"
      >
        <ListChecks className={ICON_SIZE} />
      </ToolbarButton>

      <Divider />

      {/* Block elements */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        active={editor.isActive('blockquote')}
        title="Blockquote"
      >
        <Quote className={ICON_SIZE} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        title="Horizontal Rule"
      >
        <Minus className={ICON_SIZE} />
      </ToolbarButton>

      <Divider />

      {/* Alignment */}
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        active={editor.isActive({ textAlign: 'left' })}
        title="Align Left"
      >
        <AlignLeft className={ICON_SIZE} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        active={editor.isActive({ textAlign: 'center' })}
        title="Align Center"
      >
        <AlignCenter className={ICON_SIZE} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        active={editor.isActive({ textAlign: 'right' })}
        title="Align Right"
      >
        <AlignRight className={ICON_SIZE} />
      </ToolbarButton>

      {onDelete && (
        <>
          <div className="flex-1" />
          <button
            type="button"
            onClick={onDelete}
            className="p-1.5 rounded text-[#71717A] hover:text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors"
            title="Delete note"
          >
            <Trash2 className={ICON_SIZE} />
          </button>
        </>
      )}
    </div>
  );
}
