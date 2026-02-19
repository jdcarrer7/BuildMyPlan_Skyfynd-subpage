'use client';

import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { useProjectStore } from '@/hooks/useProjectStore';
import { usePersistedState } from '@/hooks/usePersistedState';
import { SortButton, type SortCriterion } from './SortPanel';
import { FilterButton, applyFilters, type FilterCriterion, type FilterColumnDef } from './FilterPanel';
import type { TaskStatus, ProjectTask } from '@/lib/types/project';

type SortColumn = 'name' | 'assignees' | 'due_date' | 'status' | 'project' | 'created_at' | 'notes';
type SortDir = 'asc' | 'desc';

const statusConfig: Record<TaskStatus, { label: string; color: string; bg: string }> = {
  todo: { label: 'To Do', color: '#71717A', bg: 'rgba(113,113,122,0.15)' },
  in_progress: { label: 'In Progress', color: '#FBBF24', bg: 'rgba(251,191,36,0.15)' },
  done: { label: 'Done', color: '#34D399', bg: 'rgba(52,211,153,0.15)' },
};

const columns: { key: SortColumn; label: string; emoji: string }[] = [
  { key: 'name', label: 'Task', emoji: '📋' },
  { key: 'assignees', label: 'Assignee', emoji: '👤' },
  { key: 'due_date', label: 'Due', emoji: '📅' },
  { key: 'status', label: 'Status', emoji: '📊' },
  { key: 'project', label: 'Project', emoji: '📁' },
  { key: 'created_at', label: 'Added', emoji: '🕐' },
  { key: 'notes', label: 'Notes', emoji: '💬' },
];

const statusOrder: Record<TaskStatus, number> = { todo: 0, in_progress: 1, done: 2 };

function formatDate(dateStr: string | null) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function toDateInputValue(dateStr: string | null) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toISOString().split('T')[0];
}

const filterColumns: FilterColumnDef[] = [
  { key: 'name', label: 'Task', emoji: '📋', type: 'text' },
  { key: 'assignees', label: 'Assignee', emoji: '👤', type: 'assignees' },
  { key: 'status', label: 'Status', emoji: '📊', type: 'status', options: [
    { value: 'todo', label: 'To Do' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'done', label: 'Done' },
  ]},
  { key: 'due_date', label: 'Due', emoji: '📅', type: 'date' },
  { key: 'project', label: 'Project', emoji: '📁', type: 'text' },
  { key: 'notes', label: 'Notes', emoji: '💬', type: 'text' },
];

export default function TasksTable() {
  const { allTasks, projects, selectProject, updateTask } = useProjectStore();

  // Persisted sort & filter state
  const [sortCriteria, setSortCriteria] = usePersistedState<SortCriterion[]>('tasks-table-sort', []);
  const [filterCriteria, setFilterCriteria] = usePersistedState<FilterCriterion[]>('tasks-table-filter', []);

  // Editing state
  const [editingCell, setEditingCell] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(null);

  useEffect(() => {
    if (editingCell && inputRef.current) {
      inputRef.current.focus();
      if ('select' in inputRef.current && inputRef.current.tagName !== 'SELECT') {
        (inputRef.current as HTMLInputElement).select();
      }
    }
  }, [editingCell]);

  const projectMap = useMemo(() => {
    const map = new Map<string, { name: string; color: string }>();
    for (const p of projects) {
      map.set(p.id, { name: p.name, color: p.color });
    }
    return map;
  }, [projects]);

  const handleHeaderClick = useCallback((col: SortColumn, shiftKey: boolean) => {
    setSortCriteria((prev) => {
      const idx = prev.findIndex((s) => s.column === col);
      if (shiftKey) {
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = { ...next[idx], dir: next[idx].dir === 'asc' ? 'desc' : 'asc' };
          return next;
        }
        return [...prev, { column: col, dir: 'asc' }];
      }
      if (prev.length === 1 && prev[0].column === col) {
        return [{ column: col, dir: prev[0].dir === 'asc' ? 'desc' : 'asc' }];
      }
      return [{ column: col, dir: 'asc' }];
    });
  }, []);

  const getSortInfo = useCallback((col: SortColumn) => {
    const idx = sortCriteria.findIndex((s) => s.column === col);
    if (idx < 0) return null;
    return { priority: idx + 1, dir: sortCriteria[idx].dir as SortDir, isMulti: sortCriteria.length > 1 };
  }, [sortCriteria]);

  const compareTasks = useCallback((a: ProjectTask, b: ProjectTask, column: SortColumn): number => {
    switch (column) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'assignees':
        return a.assignees.join(',').localeCompare(b.assignees.join(','));
      case 'due_date': {
        const da = a.due_date ? new Date(a.due_date).getTime() : Infinity;
        const db = b.due_date ? new Date(b.due_date).getTime() : Infinity;
        return da - db;
      }
      case 'status':
        return statusOrder[a.status] - statusOrder[b.status];
      case 'project': {
        const pa = projectMap.get(a.project_id)?.name || '';
        const pb = projectMap.get(b.project_id)?.name || '';
        return pa.localeCompare(pb);
      }
      case 'created_at':
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      case 'notes':
        return (a.notes || '').localeCompare(b.notes || '');
      default:
        return 0;
    }
  }, [projectMap]);

  const getTaskFieldValue = useCallback((task: ProjectTask, column: string): string => {
    switch (column) {
      case 'name': return task.name;
      case 'assignees': return task.assignees.join(', ');
      case 'status': return task.status;
      case 'due_date': return task.due_date || '';
      case 'project': return projectMap.get(task.project_id)?.name || '';
      case 'notes': return task.notes || '';
      default: return '';
    }
  }, [projectMap]);

  const filtered = useMemo(
    () => applyFilters(allTasks, filterCriteria, getTaskFieldValue),
    [allTasks, filterCriteria, getTaskFieldValue],
  );

  const sorted = useMemo(() => {
    if (sortCriteria.length === 0) return filtered;
    const arr = [...filtered];
    arr.sort((a, b) => {
      for (const criterion of sortCriteria) {
        const cmp = compareTasks(a, b, criterion.column as SortColumn);
        if (cmp !== 0) return criterion.dir === 'desc' ? -cmp : cmp;
      }
      return 0;
    });
    return arr;
  }, [filtered, sortCriteria, compareTasks]);

  const startEdit = (id: string, column: string, value: string) => {
    setEditingCell(`${id}:${column}`);
    setEditValue(value);
  };

  const cancelEdit = () => {
    setEditingCell(null);
    setEditValue('');
  };

  const saveTaskEdit = async (task: ProjectTask, column: string) => {
    setEditingCell(null);
    const trimmed = editValue.trim();
    switch (column) {
      case 'name':
        if (trimmed) await updateTask(task.project_id, task.id, { name: trimmed });
        break;
      case 'notes':
        await updateTask(task.project_id, task.id, { notes: trimmed });
        break;
      case 'assignees':
        await updateTask(task.project_id, task.id, {
          assignees: trimmed ? trimmed.split(',').map((s) => s.trim()).filter(Boolean) : [],
        });
        break;
      case 'due_date':
        await updateTask(task.project_id, task.id, { due_date: trimmed || null } as Record<string, unknown>);
        break;
      case 'status':
        await updateTask(task.project_id, task.id, { status: trimmed as TaskStatus });
        break;
    }
    setEditValue('');
  };

  const isEditing = (id: string, column: string) => editingCell === `${id}:${column}`;

  return (
    <div>
      {/* Header row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <h2
            className="text-sm font-semibold text-[#FAFAFA]"
            style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" }}
          >
            Tasks Database
          </h2>
          <span className="text-[11px] text-[#52525B] bg-white/[0.04] px-1.5 py-0.5 rounded">
            {filterCriteria.length > 0 ? `${sorted.length}/${allTasks.length}` : allTasks.length}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <FilterButton
            columns={filterColumns}
            filters={filterCriteria}
            onChange={setFilterCriteria}
          />
          <SortButton
            columns={columns}
            criteria={sortCriteria}
            onChange={setSortCriteria}
          />
        </div>
      </div>

      {/* Table */}
      <div className="border border-white/[0.06] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                {columns.map((col) => {
                  const sortInfo = getSortInfo(col.key);
                  return (
                    <th
                      key={col.key}
                      onClick={(e) => handleHeaderClick(col.key, e.shiftKey)}
                      className="text-left text-[10px] font-semibold text-[#52525B] uppercase tracking-wider px-3 py-2.5 cursor-pointer hover:text-[#A1A1AA] transition-colors select-none"
                    >
                      <div className="flex items-center gap-1">
                        <span>{col.emoji}</span>
                        <span>{col.label}</span>
                        {sortInfo && (
                          <span className="flex items-center gap-0.5">
                            {sortInfo.isMulti && (
                              <span className="text-[9px] font-bold text-[#3B82F6] bg-[#3B82F6]/15 w-3.5 h-3.5 rounded-full flex items-center justify-center">
                                {sortInfo.priority}
                              </span>
                            )}
                            {sortInfo.dir === 'asc' ? (
                              <ChevronUp className="w-3 h-3 text-[#3B82F6]" />
                            ) : (
                              <ChevronDown className="w-3 h-3 text-[#3B82F6]" />
                            )}
                          </span>
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {sorted.map((task) => {
                const status = statusConfig[task.status] || statusConfig.todo;
                const project = projectMap.get(task.project_id);

                const handleKeyDown = (e: React.KeyboardEvent, column: string) => {
                  if (e.key === 'Enter') saveTaskEdit(task, column);
                  if (e.key === 'Escape') cancelEdit();
                };

                return (
                  <tr key={task.id} className="border-b border-white/[0.04] last:border-b-0 hover:bg-white/[0.02] transition-colors">
                    <td className="px-3 py-2.5">
                      {isEditing(task.id, 'name') ? (
                        <input
                          ref={inputRef as React.RefObject<HTMLInputElement>}
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={() => saveTaskEdit(task, 'name')}
                          onKeyDown={(e) => handleKeyDown(e, 'name')}
                          className="w-full bg-transparent text-[13px] text-[#FAFAFA] outline-none caret-[#3B82F6]"
                        />
                      ) : (
                        <span
                          onClick={() => startEdit(task.id, 'name', task.name)}
                          className={`text-[13px] cursor-text hover:text-[#3B82F6] transition-colors ${
                            task.status === 'done' ? 'text-[#52525B] line-through' : 'text-[#FAFAFA]'
                          }`}
                        >
                          {task.name}
                        </span>
                      )}
                    </td>

                    <td className="px-3 py-2.5">
                      {isEditing(task.id, 'assignees') ? (
                        <input
                          ref={inputRef as React.RefObject<HTMLInputElement>}
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={() => saveTaskEdit(task, 'assignees')}
                          onKeyDown={(e) => handleKeyDown(e, 'assignees')}
                          placeholder="name1, name2"
                          className="w-full bg-transparent text-[10px] text-[#A1A1AA] font-medium outline-none caret-[#3B82F6]"
                        />
                      ) : (
                        <div
                          className="flex items-center gap-1 flex-wrap cursor-text min-h-[20px]"
                          onClick={() => startEdit(task.id, 'assignees', task.assignees.join(', '))}
                        >
                          {task.assignees.length > 0 ? (
                            task.assignees.map((a, i) => (
                              <span key={i} className="text-[10px] font-medium text-[#A1A1AA] bg-white/[0.06] px-1.5 py-0.5 rounded">{a}</span>
                            ))
                          ) : (
                            <span className="text-[11px] text-[#3F3F46]">—</span>
                          )}
                        </div>
                      )}
                    </td>

                    <td className="px-3 py-2.5">
                      {isEditing(task.id, 'due_date') ? (
                        <input
                          ref={inputRef as React.RefObject<HTMLInputElement>}
                          type="date"
                          value={editValue}
                          onChange={(e) => { setEditValue(e.target.value); setTimeout(() => saveTaskEdit(task, 'due_date'), 0); }}
                          onBlur={() => saveTaskEdit(task, 'due_date')}
                          className="bg-transparent text-[11px] text-[#FAFAFA] outline-none caret-[#3B82F6]"
                        />
                      ) : (
                        <span
                          onClick={() => startEdit(task.id, 'due_date', toDateInputValue(task.due_date))}
                          className={`text-[11px] whitespace-nowrap cursor-text hover:text-[#3B82F6] transition-colors ${
                            task.due_date && new Date(task.due_date) < new Date() && task.status !== 'done'
                              ? 'text-[#EF4444]' : 'text-[#71717A]'
                          }`}
                        >
                          {formatDate(task.due_date)}
                        </span>
                      )}
                    </td>

                    <td className="px-3 py-2.5">
                      {isEditing(task.id, 'status') ? (
                        <select
                          ref={inputRef as React.RefObject<HTMLSelectElement>}
                          value={editValue}
                          onChange={(e) => { setEditValue(e.target.value); setTimeout(() => saveTaskEdit(task, 'status'), 0); }}
                          onBlur={() => saveTaskEdit(task, 'status')}
                          className="appearance-none bg-transparent text-[10px] font-semibold outline-none cursor-pointer caret-[#3B82F6]"
                          style={{ color: statusConfig[editValue as TaskStatus]?.color || status.color }}
                        >
                          <option value="todo">To Do</option>
                          <option value="in_progress">In Progress</option>
                          <option value="done">Done</option>
                        </select>
                      ) : (
                        <span
                          onClick={() => startEdit(task.id, 'status', task.status)}
                          className="text-[10px] font-semibold px-2 py-1 rounded-full whitespace-nowrap cursor-pointer hover:ring-1 hover:ring-white/20 transition-all"
                          style={{ color: status.color, backgroundColor: status.bg }}
                        >
                          {status.label}
                        </span>
                      )}
                    </td>

                    <td className="px-3 py-2.5">
                      {project ? (
                        <button onClick={() => selectProject(task.project_id)} className="flex items-center gap-1.5 hover:opacity-80 transition-opacity">
                          <div className="w-2 h-2 rounded-sm flex-shrink-0" style={{ backgroundColor: project.color }} />
                          <span className="text-[11px] text-[#A1A1AA] hover:text-[#FAFAFA] truncate max-w-[150px] transition-colors">{project.name}</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-[#3F3F46]">—</span>
                      )}
                    </td>

                    <td className="px-3 py-2.5">
                      <span className="text-[11px] text-[#71717A] whitespace-nowrap">{formatDate(task.created_at)}</span>
                    </td>

                    <td className="px-3 py-2.5">
                      {isEditing(task.id, 'notes') ? (
                        <input
                          ref={inputRef as React.RefObject<HTMLInputElement>}
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={() => saveTaskEdit(task, 'notes')}
                          onKeyDown={(e) => handleKeyDown(e, 'notes')}
                          className="w-full bg-transparent text-[11px] text-[#A1A1AA] outline-none max-w-[200px] caret-[#3B82F6]"
                        />
                      ) : (
                        <span
                          onClick={() => startEdit(task.id, 'notes', task.notes || '')}
                          className="text-[11px] text-[#52525B] truncate block max-w-[200px] cursor-text hover:text-[#A1A1AA] transition-colors min-h-[16px]"
                        >
                          {task.notes || '—'}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}

              {allTasks.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-3 py-8 text-center text-xs text-[#3F3F46]">
                    No tasks yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
