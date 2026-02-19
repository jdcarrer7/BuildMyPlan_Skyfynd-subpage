'use client';

import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { useProjectStore } from '@/hooks/useProjectStore';
import { usePersistedState } from '@/hooks/usePersistedState';
import { SortButton, type SortCriterion } from './SortPanel';
import { FilterButton, applyFilters, type FilterCriterion, type FilterColumnDef } from './FilterPanel';
import type { ProjectStatus, ProjectWithProgress } from '@/lib/types/project';

type SortColumn = 'name' | 'assignees' | 'status' | 'due_date' | 'created_at' | 'description' | 'tasks';
type SortDir = 'asc' | 'desc';

const statusConfig: Record<ProjectStatus, { label: string; color: string; bg: string }> = {
  not_started: { label: 'Not Started', color: '#71717A', bg: 'rgba(113,113,122,0.15)' },
  in_progress: { label: 'In Progress', color: '#FBBF24', bg: 'rgba(251,191,36,0.15)' },
  done: { label: 'Done', color: '#34D399', bg: 'rgba(52,211,153,0.15)' },
};

const columns: { key: SortColumn; label: string; emoji: string }[] = [
  { key: 'name', label: 'Project', emoji: '📁' },
  { key: 'assignees', label: 'Assignee', emoji: '👤' },
  { key: 'status', label: 'Status', emoji: '📊' },
  { key: 'due_date', label: 'Due', emoji: '📅' },
  { key: 'created_at', label: 'Created', emoji: '🕐' },
  { key: 'description', label: 'Description', emoji: '📝' },
  { key: 'tasks', label: 'Tasks', emoji: '✅' },
];

const statusOrder: Record<ProjectStatus, number> = { not_started: 0, in_progress: 1, done: 2 };

function formatDate(dateStr: string | null) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function toDateInputValue(dateStr: string | null) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toISOString().split('T')[0];
}

function compareProjects(a: ProjectWithProgress, b: ProjectWithProgress, column: SortColumn): number {
  switch (column) {
    case 'name':
      return a.name.localeCompare(b.name);
    case 'assignees':
      return a.assignees.join(',').localeCompare(b.assignees.join(','));
    case 'status':
      return statusOrder[a.status] - statusOrder[b.status];
    case 'due_date': {
      const da = a.due_date ? new Date(a.due_date).getTime() : Infinity;
      const db = b.due_date ? new Date(b.due_date).getTime() : Infinity;
      return da - db;
    }
    case 'created_at':
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    case 'description':
      return (a.description || '').localeCompare(b.description || '');
    case 'tasks':
      return a.progress - b.progress;
    default:
      return 0;
  }
}

const filterColumns: FilterColumnDef[] = [
  { key: 'name', label: 'Project', emoji: '📁', type: 'text' },
  { key: 'assignees', label: 'Assignee', emoji: '👤', type: 'assignees' },
  { key: 'status', label: 'Status', emoji: '📊', type: 'status', options: [
    { value: 'not_started', label: 'Not Started' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'done', label: 'Done' },
  ]},
  { key: 'due_date', label: 'Due', emoji: '📅', type: 'date' },
  { key: 'description', label: 'Description', emoji: '📝', type: 'text' },
];

function getProjectFieldValue(project: ProjectWithProgress, column: string): string {
  switch (column) {
    case 'name': return project.name;
    case 'assignees': return project.assignees.join(', ');
    case 'status': return project.status;
    case 'due_date': return project.due_date || '';
    case 'description': return project.description || '';
    default: return '';
  }
}

export default function ProjectsTable() {
  const { projects, selectProject, updateProject } = useProjectStore();

  // Persisted sort & filter state
  const [sortCriteria, setSortCriteria] = usePersistedState<SortCriterion[]>('projects-table-sort', []);
  const [filterCriteria, setFilterCriteria] = usePersistedState<FilterCriterion[]>('projects-table-filter', []);

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

  // Header click: single sort or shift+click for multi-sort
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

  const filtered = useMemo(
    () => applyFilters(projects, filterCriteria, getProjectFieldValue),
    [projects, filterCriteria],
  );

  const sorted = useMemo(() => {
    if (sortCriteria.length === 0) return filtered;
    const arr = [...filtered];
    arr.sort((a, b) => {
      for (const criterion of sortCriteria) {
        const cmp = compareProjects(a, b, criterion.column as SortColumn);
        if (cmp !== 0) return criterion.dir === 'desc' ? -cmp : cmp;
      }
      return 0;
    });
    return arr;
  }, [filtered, sortCriteria]);

  const startEdit = (id: string, column: string, value: string) => {
    setEditingCell(`${id}:${column}`);
    setEditValue(value);
  };

  const cancelEdit = () => {
    setEditingCell(null);
    setEditValue('');
  };

  const saveEdit = async (id: string, column: string) => {
    setEditingCell(null);
    const trimmed = editValue.trim();
    switch (column) {
      case 'name':
        if (trimmed) await updateProject(id, { name: trimmed });
        break;
      case 'description':
        await updateProject(id, { description: trimmed });
        break;
      case 'assignees':
        await updateProject(id, {
          assignees: trimmed ? trimmed.split(',').map((s) => s.trim()).filter(Boolean) : [],
        });
        break;
      case 'due_date':
        await updateProject(id, { due_date: trimmed || null } as Record<string, unknown>);
        break;
      case 'status':
        await updateProject(id, { status: trimmed as ProjectStatus });
        break;
    }
    setEditValue('');
  };

  const isEditing = (id: string, column: string) => editingCell === `${id}:${column}`;

  return (
    <div className="mb-10">
      {/* Header row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <h2
            className="text-sm font-semibold text-[#FAFAFA]"
            style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" }}
          >
            Projects Database
          </h2>
          <span className="text-[11px] text-[#52525B] bg-white/[0.04] px-1.5 py-0.5 rounded">
            {filterCriteria.length > 0 ? `${sorted.length}/${projects.length}` : projects.length}
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
              {sorted.map((project) => (
                <ProjectRow
                  key={project.id}
                  project={project}
                  isEditing={isEditing}
                  editValue={editValue}
                  inputRef={inputRef}
                  startEdit={startEdit}
                  cancelEdit={cancelEdit}
                  saveEdit={saveEdit}
                  setEditValue={setEditValue}
                  onNavigate={() => selectProject(project.id)}
                />
              ))}
              {projects.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-3 py-8 text-center text-xs text-[#3F3F46]">
                    No projects yet
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

/* ── Project Row ── */

function ProjectRow({
  project,
  isEditing,
  editValue,
  inputRef,
  startEdit,
  cancelEdit,
  saveEdit,
  setEditValue,
  onNavigate,
}: {
  project: ProjectWithProgress;
  isEditing: (id: string, column: string) => boolean;
  editValue: string;
  inputRef: React.RefObject<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null>;
  startEdit: (id: string, column: string, value: string) => void;
  cancelEdit: () => void;
  saveEdit: (id: string, column: string) => void;
  setEditValue: (v: string) => void;
  onNavigate: () => void;
}) {
  const id = project.id;
  const status = statusConfig[project.status] || statusConfig.not_started;

  const handleKeyDown = (e: React.KeyboardEvent, column: string) => {
    if (e.key === 'Enter' && column !== 'description') saveEdit(id, column);
    if (e.key === 'Escape') cancelEdit();
  };

  return (
    <tr className="border-b border-white/[0.04] last:border-b-0 hover:bg-white/[0.02] transition-colors">
      <td className="px-3 py-2.5">
        {isEditing(id, 'name') ? (
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: project.color }} />
            <input
              ref={inputRef as React.RefObject<HTMLInputElement>}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={() => saveEdit(id, 'name')}
              onKeyDown={(e) => handleKeyDown(e, 'name')}
              className="w-full bg-transparent text-[13px] text-[#FAFAFA] font-medium outline-none caret-[#3B82F6]"
            />
          </div>
        ) : (
          <div className="flex items-center gap-2 cursor-text" onClick={() => startEdit(id, 'name', project.name)}>
            <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: project.color }} />
            <span className="text-[13px] text-[#FAFAFA] font-medium truncate max-w-[200px]">
              {project.name}
            </span>
          </div>
        )}
      </td>

      <td className="px-3 py-2.5">
        {isEditing(id, 'assignees') ? (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={() => saveEdit(id, 'assignees')}
            onKeyDown={(e) => handleKeyDown(e, 'assignees')}
            placeholder="name1, name2"
            className="w-full bg-transparent text-[10px] text-[#A1A1AA] font-medium outline-none caret-[#3B82F6]"
          />
        ) : (
          <div className="flex items-center gap-1 flex-wrap cursor-text min-h-[20px]" onClick={() => startEdit(id, 'assignees', project.assignees.join(', '))}>
            {project.assignees.length > 0 ? (
              project.assignees.map((a, i) => (
                <span key={i} className="text-[10px] font-medium text-[#A1A1AA] bg-white/[0.06] px-1.5 py-0.5 rounded">{a}</span>
              ))
            ) : (
              <span className="text-[11px] text-[#3F3F46]">—</span>
            )}
          </div>
        )}
      </td>

      <td className="px-3 py-2.5">
        {isEditing(id, 'status') ? (
          <select
            ref={inputRef as React.RefObject<HTMLSelectElement>}
            value={editValue}
            onChange={(e) => { setEditValue(e.target.value); setTimeout(() => saveEdit(id, 'status'), 0); }}
            onBlur={() => saveEdit(id, 'status')}
            className="appearance-none bg-transparent text-[10px] font-semibold outline-none cursor-pointer caret-[#3B82F6]"
            style={{ color: statusConfig[editValue as ProjectStatus]?.color || status.color }}
          >
            <option value="not_started">Not Started</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        ) : (
          <span
            onClick={() => startEdit(id, 'status', project.status)}
            className="text-[10px] font-semibold px-2 py-1 rounded-full whitespace-nowrap cursor-pointer hover:ring-1 hover:ring-white/20 transition-all"
            style={{ color: status.color, backgroundColor: status.bg }}
          >
            {status.label}
          </span>
        )}
      </td>

      <td className="px-3 py-2.5">
        {isEditing(id, 'due_date') ? (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="date"
            value={editValue}
            onChange={(e) => { setEditValue(e.target.value); setTimeout(() => saveEdit(id, 'due_date'), 0); }}
            onBlur={() => saveEdit(id, 'due_date')}
            onKeyDown={(e) => handleKeyDown(e, 'due_date')}
            className="bg-transparent text-[11px] text-[#FAFAFA] outline-none caret-[#3B82F6]"
          />
        ) : (
          <span
            onClick={() => startEdit(id, 'due_date', toDateInputValue(project.due_date))}
            className={`text-[11px] whitespace-nowrap cursor-text hover:text-[#3B82F6] transition-colors ${
              project.due_date && new Date(project.due_date) < new Date() && project.status !== 'done'
                ? 'text-[#EF4444]' : 'text-[#71717A]'
            }`}
          >
            {formatDate(project.due_date)}
          </span>
        )}
      </td>

      <td className="px-3 py-2.5">
        <span className="text-[11px] text-[#71717A] whitespace-nowrap">{formatDate(project.created_at)}</span>
      </td>

      <td className="px-3 py-2.5">
        {isEditing(id, 'description') ? (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={() => saveEdit(id, 'description')}
            onKeyDown={(e) => handleKeyDown(e, 'description')}
            className="w-full bg-transparent text-[11px] text-[#A1A1AA] outline-none max-w-[220px] caret-[#3B82F6]"
          />
        ) : (
          <span
            onClick={() => startEdit(id, 'description', project.description || '')}
            className="text-[11px] text-[#52525B] truncate block max-w-[220px] cursor-text hover:text-[#A1A1AA] transition-colors min-h-[16px]"
          >
            {project.description || '—'}
          </span>
        )}
      </td>

      <td className="px-3 py-2.5">
        <button onClick={onNavigate} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <span className="text-[11px] text-[#71717A] whitespace-nowrap">{project.completed_tasks}/{project.total_tasks}</span>
          {project.total_tasks > 0 && (
            <div className="w-12 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-[#34D399] transition-all" style={{ width: `${project.progress}%` }} />
            </div>
          )}
        </button>
      </td>
    </tr>
  );
}
