'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Trash2, Calendar, User } from 'lucide-react';
import type { ProjectTask } from '@/lib/types/project';

interface TaskRowProps {
  task: ProjectTask;
  onToggleStatus: () => void;
  onUpdate: (data: Partial<ProjectTask>) => void;
  onDelete: () => void;
}

const statusStyles: Record<string, { bg: string; border: string; check: string }> = {
  todo: { bg: 'bg-transparent', border: 'border-[#52525B]', check: '' },
  in_progress: { bg: 'bg-[#F59E0B]/20', border: 'border-[#F59E0B]', check: '' },
  done: { bg: 'bg-[#10B981]', border: 'border-[#10B981]', check: 'text-white' },
};

export default function TaskRow({ task, onToggleStatus, onUpdate, onDelete }: TaskRowProps) {
  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState(task.name);
  const [editingNotes, setEditingNotes] = useState(false);
  const [notes, setNotes] = useState(task.notes);
  const [showActions, setShowActions] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const notesRef = useRef<HTMLTextAreaElement>(null);

  // Sync with prop changes
  useEffect(() => { setName(task.name); }, [task.name]);
  useEffect(() => { setNotes(task.notes); }, [task.notes]);

  useEffect(() => {
    if (editingName && nameRef.current) nameRef.current.focus();
  }, [editingName]);

  useEffect(() => {
    if (editingNotes && notesRef.current) notesRef.current.focus();
  }, [editingNotes]);

  const saveName = useCallback(() => {
    setEditingName(false);
    const trimmed = name.trim();
    if (trimmed && trimmed !== task.name) {
      onUpdate({ name: trimmed });
    } else {
      setName(task.name);
    }
  }, [name, task.name, onUpdate]);

  const saveNotes = useCallback(() => {
    setEditingNotes(false);
    if (notes !== task.notes) {
      onUpdate({ notes });
    }
  }, [notes, task.notes, onUpdate]);

  const style = statusStyles[task.status] || statusStyles.todo;
  const isDone = task.status === 'done';

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div
      className="group border-b border-white/[0.04] last:border-b-0"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex items-center gap-3 px-3 py-2.5 hover:bg-white/[0.02] transition-colors">
        {/* Checkbox */}
        <button
          onClick={onToggleStatus}
          className={`w-[18px] h-[18px] rounded border-[1.5px] flex items-center justify-center flex-shrink-0 transition-all ${style.border} ${style.bg}`}
        >
          {isDone && (
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M2 5L4.5 7.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
          {task.status === 'in_progress' && (
            <div className="w-2 h-2 rounded-full bg-[#F59E0B]" />
          )}
        </button>

        {/* Task name */}
        <div className="flex-1 min-w-0">
          {editingName ? (
            <input
              ref={nameRef}
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={saveName}
              onKeyDown={(e) => {
                if (e.key === 'Enter') saveName();
                if (e.key === 'Escape') { setName(task.name); setEditingName(false); }
              }}
              className="w-full bg-transparent text-sm text-[#FAFAFA] outline-none border-b border-[#3B82F6] pb-0.5"
            />
          ) : (
            <span
              onClick={() => setEditingName(true)}
              className={`text-sm cursor-text block truncate ${isDone ? 'text-[#52525B] line-through' : 'text-[#FAFAFA]'}`}
            >
              {task.name}
            </span>
          )}
        </div>

        {/* Assignees */}
        {task.assignees.length > 0 && (
          <div className="flex items-center gap-1 flex-shrink-0">
            {task.assignees.map((a, i) => (
              <span
                key={i}
                className="text-[10px] font-medium text-[#A1A1AA] bg-white/[0.06] px-1.5 py-0.5 rounded"
              >
                {a}
              </span>
            ))}
          </div>
        )}

        {/* Due date */}
        {task.due_date && (
          <span className={`text-[11px] flex-shrink-0 ${
            new Date(task.due_date) < new Date() && task.status !== 'done'
              ? 'text-[#EF4444]'
              : 'text-[#52525B]'
          }`}>
            {formatDate(task.due_date)}
          </span>
        )}

        {/* Actions */}
        <div className={`flex items-center gap-1 flex-shrink-0 transition-opacity ${showActions ? 'opacity-100' : 'opacity-0'}`}>
          <button
            onClick={onDelete}
            className="p-1 text-[#52525B] hover:text-[#EF4444] transition-colors rounded"
            title="Delete task"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Expandable notes */}
      {(task.notes || editingNotes) && (
        <div className="px-3 pb-2 pl-10">
          {editingNotes ? (
            <textarea
              ref={notesRef}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onBlur={saveNotes}
              onKeyDown={(e) => {
                if (e.key === 'Escape') { setNotes(task.notes); setEditingNotes(false); }
              }}
              className="w-full bg-[#0A0A0B] text-xs text-[#A1A1AA] rounded border border-white/[0.06] p-2 outline-none focus:border-[#3B82F6] resize-none"
              rows={2}
            />
          ) : (
            <p
              onClick={() => setEditingNotes(true)}
              className="text-xs text-[#52525B] cursor-text"
            >
              {task.notes}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
