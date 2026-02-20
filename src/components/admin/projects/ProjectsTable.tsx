'use client';

import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useProjectStore } from '@/hooks/useProjectStore';
import { usePersistedState } from '@/hooks/usePersistedState';
import { useResizableColumns } from '@/hooks/useResizableColumns';
import { SortButton, type SortCriterion } from './SortPanel';
import { FilterButton, applyFilters, type FilterCriterion, type FilterColumnDef } from './FilterPanel';
import { ColumnsButton } from './ColumnsPanel';
import ColumnHeaderMenu from './ColumnHeaderMenu';
import EditingIndicator from '@/components/admin/EditingIndicator';
import type { PresenceUser } from '@/hooks/usePresence';
import type { ProjectStatus, ProjectWithProgress } from '@/lib/types/project';

type SortColumn = 'name' | 'assignees' | 'status' | 'due_date' | 'created_at' | 'description' | 'tasks';
type SortDir = 'asc' | 'desc';

const statusConfig: Record<ProjectStatus, { label: string; color: string; bg: string }> = {
  not_started: { label: 'Not Started', color: '#EF4444', bg: 'rgba(239,68,68,0.15)' },
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

const defaultColumnWidths: Record<string, number> = {
  name: 200,
  assignees: 130,
  status: 120,
  due_date: 120,
  created_at: 130,
  description: 200,
  tasks: 100,
};

const allColumnKeys = columns.map((c) => c.key);

interface ProjectsTableProps {
  onlineUsers: PresenceUser[];
  currentUserEmail: string;
  onEditStart: (cellId: string, label: string) => void;
  onEditEnd: () => void;
}

export default function ProjectsTable({ onlineUsers, currentUserEmail, onEditStart, onEditEnd }: ProjectsTableProps) {
  const { projects, selectProject, updateProject, createProject, archiveProject } = useProjectStore();
  const { getWidth, onResizeStart } = useResizableColumns({
    storageKey: 'projects-table-col-widths',
    defaults: defaultColumnWidths,
  });

  // Persisted sort, filter & column visibility state
  const [sortCriteria, setSortCriteria] = usePersistedState<SortCriterion[]>('projects-table-sort', []);
  const [filterCriteria, setFilterCriteria] = usePersistedState<FilterCriterion[]>('projects-table-filter', []);
  const [visibleColumns, setVisibleColumns] = usePersistedState<string[]>('projects-table-columns', allColumnKeys);

  const visibleCols = useMemo(() => columns.filter((c) => visibleColumns.includes(c.key)), [visibleColumns]);

  // Editing state
  const [editingCell, setEditingCell] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(null);

  // Track newly created row to auto-enter edit mode
  const [newRowId, setNewRowId] = useState<string | null>(null);

  useEffect(() => {
    if (editingCell && inputRef.current) {
      inputRef.current.focus();
      if ('select' in inputRef.current && inputRef.current.tagName !== 'SELECT') {
        (inputRef.current as HTMLInputElement).select();
      }
    }
  }, [editingCell]);

  // Auto-enter edit mode for newly created rows
  useEffect(() => {
    if (newRowId && projects.find((p) => p.id === newRowId)) {
      startEdit(newRowId, 'name', 'New Project');
      setNewRowId(null);
    }
  }, [newRowId, projects]);

  // Sort helpers for column header menu
  const getSortDir = useCallback((col: string): 'asc' | 'desc' | null => {
    const found = sortCriteria.find((s) => s.column === col);
    return found ? (found.dir as 'asc' | 'desc') : null;
  }, [sortCriteria]);

  const setSortForColumn = useCallback((col: string, dir: 'asc' | 'desc') => {
    setSortCriteria([{ column: col, dir }]);
  }, []);

  const clearSortForColumn = useCallback((col: string) => {
    setSortCriteria((prev) => prev.filter((s) => s.column !== col));
  }, []);

  const addFilterForColumn = useCallback((col: string) => {
    setFilterCriteria((prev) => {
      if (prev.some((f) => f.column === col)) return prev;
      return [...prev, { column: col, operator: 'contains' as const, value: '' }];
    });
  }, []);

  const hideColumn = useCallback((col: string) => {
    setVisibleColumns((prev) => prev.filter((k) => k !== col));
  }, []);

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
    const project = projects.find((p) => p.id === id);
    onEditStart(`project:${id}:${column}`, `${project?.name || 'Project'} > ${column}`);
  };

  const cancelEdit = () => {
    setEditingCell(null);
    setEditValue('');
    onEditEnd();
  };

  const saveEdit = async (id: string, column: string) => {
    setEditingCell(null);
    onEditEnd();
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
          <ColumnsButton
            columns={columns}
            visibleKeys={visibleColumns}
            onChange={setVisibleColumns}
            requiredKeys={['name']}
          />
        </div>
      </div>

      {/* Table */}
      <div className="border border-white/[0.06] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-[900px]" style={{ tableLayout: 'fixed', width: visibleCols.reduce((sum, c) => sum + getWidth(c.key), 0) }}>
            <thead>
              <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                {visibleCols.map((col) => (
                    <th
                      key={col.key}
                      style={{ width: getWidth(col.key) }}
                      className="text-left text-[10px] font-semibold text-[#52525B] uppercase tracking-wider px-3 py-2.5 select-none relative"
                    >
                      <ColumnHeaderMenu
                        columnKey={col.key}
                        columnLabel={col.label}
                        columnEmoji={col.emoji}
                        canHide={col.key !== 'name'}
                        sortDir={getSortDir(col.key)}
                        onSortAsc={() => setSortForColumn(col.key, 'asc')}
                        onSortDesc={() => setSortForColumn(col.key, 'desc')}
                        onClearSort={() => clearSortForColumn(col.key)}
                        onFilter={() => addFilterForColumn(col.key)}
                        onHide={() => hideColumn(col.key)}
                        resizeHandle={
                          <div
                            onMouseDown={(e) => onResizeStart(col.key, e)}
                            className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-[#3B82F6]/40 transition-colors"
                          />
                        }
                      />
                    </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((project) => (
                <ProjectRow
                  key={project.id}
                  project={project}
                  visibleCols={visibleCols}
                  isEditing={isEditing}
                  editValue={editValue}
                  inputRef={inputRef}
                  startEdit={startEdit}
                  cancelEdit={cancelEdit}
                  saveEdit={saveEdit}
                  setEditValue={setEditValue}
                  onNavigate={() => selectProject(project.id)}
                  onTrash={() => archiveProject(project.id)}
                  onlineUsers={onlineUsers}
                  currentUserEmail={currentUserEmail}
                />
              ))}
              {projects.length === 0 && (
                <tr>
                  <td colSpan={visibleCols.length} className="px-3 py-8 text-center text-xs text-[#3F3F46]">
                    No projects yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Add new row */}
        <button
          onClick={async () => {
            const result = await createProject({ name: 'New Project' });
            if (result.success && result.id) {
              setNewRowId(result.id);
            }
          }}
          className="w-full flex items-center gap-2 px-3 py-2 text-[11px] text-[#52525B] hover:text-[#A1A1AA] hover:bg-white/[0.02] transition-colors border-t border-white/[0.04]"
        >
          <Plus className="w-3.5 h-3.5" />
          New
        </button>
      </div>
    </div>
  );
}

/* ── Project Row ── */

function ProjectRow({
  project,
  visibleCols,
  isEditing,
  editValue,
  inputRef,
  startEdit,
  cancelEdit,
  saveEdit,
  setEditValue,
  onNavigate,
  onTrash,
  onlineUsers,
  currentUserEmail,
}: {
  project: ProjectWithProgress;
  visibleCols: { key: string; label: string; emoji: string }[];
  isEditing: (id: string, column: string) => boolean;
  editValue: string;
  inputRef: React.RefObject<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null>;
  startEdit: (id: string, column: string, value: string) => void;
  cancelEdit: () => void;
  saveEdit: (id: string, column: string) => void;
  setEditValue: (v: string) => void;
  onNavigate: () => void;
  onTrash: () => void;
  onlineUsers: PresenceUser[];
  currentUserEmail: string;
}) {
  const id = project.id;
  const status = statusConfig[project.status] || statusConfig.not_started;
  const visibleKeys = new Set(visibleCols.map((c) => c.key));

  const handleKeyDown = (e: React.KeyboardEvent, column: string) => {
    if (e.key === 'Enter' && column !== 'description') saveEdit(id, column);
    if (e.key === 'Escape') cancelEdit();
  };

  const indicator = (col: string) => (
    <EditingIndicator cellId={`project:${id}:${col}`} onlineUsers={onlineUsers} currentUserEmail={currentUserEmail} />
  );

  const renderCell = (key: string) => {
    switch (key) {
      case 'name':
        return isEditing(id, 'name') ? (
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
          <div>
            {indicator('name')}
            <div className="flex items-center gap-2 cursor-pointer" onClick={onNavigate} onDoubleClick={(e) => { e.stopPropagation(); startEdit(id, 'name', project.name); }}>
              <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: project.color }} />
              <span className="text-[13px] text-[#FAFAFA] font-medium truncate hover:text-[#3B82F6] transition-colors">
                {project.name}
              </span>
            </div>
          </div>
        );
      case 'assignees':
        return isEditing(id, 'assignees') ? (
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
          <div>
            {indicator('assignees')}
            <div className="flex items-center gap-1 flex-nowrap overflow-hidden cursor-text min-h-[20px]" onClick={() => startEdit(id, 'assignees', project.assignees.join(', '))}>
              {project.assignees.length > 0 ? (
                project.assignees.map((a, i) => (
                  <span key={i} className="text-[10px] font-medium text-[#A1A1AA] bg-white/[0.06] px-1.5 py-0.5 rounded shrink-0">{a}</span>
                ))
              ) : (
                <span className="text-[11px] text-[#3F3F46]">—</span>
              )}
            </div>
          </div>
        );
      case 'status':
        return isEditing(id, 'status') ? (
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
          <div>
            {indicator('status')}
            <span
              onClick={() => startEdit(id, 'status', project.status)}
              className="text-[10px] font-semibold px-2 py-1 rounded-full whitespace-nowrap cursor-pointer hover:ring-1 hover:ring-white/20 transition-all"
              style={{ color: status.color, backgroundColor: status.bg }}
            >
              {status.label}
            </span>
          </div>
        );
      case 'due_date':
        return isEditing(id, 'due_date') ? (
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
          <div>
            {indicator('due_date')}
            <span
              onClick={() => startEdit(id, 'due_date', toDateInputValue(project.due_date))}
              className={`text-[11px] whitespace-nowrap cursor-text hover:text-[#3B82F6] transition-colors ${
                project.due_date && new Date(project.due_date) < new Date() && project.status !== 'done'
                  ? 'text-[#EF4444]' : 'text-[#71717A]'
              }`}
            >
              {formatDate(project.due_date)}
            </span>
          </div>
        );
      case 'created_at':
        return <span className="text-[11px] text-[#71717A] whitespace-nowrap">{formatDate(project.created_at)}</span>;
      case 'description':
        return isEditing(id, 'description') ? (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={() => saveEdit(id, 'description')}
            onKeyDown={(e) => handleKeyDown(e, 'description')}
            className="w-full bg-transparent text-[11px] text-[#A1A1AA] outline-none caret-[#3B82F6]"
          />
        ) : (
          <div>
            {indicator('description')}
            <span
              onClick={() => startEdit(id, 'description', project.description || '')}
              className="text-[11px] text-[#52525B] truncate block cursor-text hover:text-[#A1A1AA] transition-colors min-h-[16px]"
            >
              {project.description || '—'}
            </span>
          </div>
        );
      case 'tasks':
        return (
          <button onClick={onNavigate} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="text-[11px] text-[#71717A] whitespace-nowrap">{project.completed_tasks}/{project.total_tasks}</span>
            {project.total_tasks > 0 && (
              <div className="w-12 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-[#34D399] transition-all" style={{ width: `${project.progress}%` }} />
              </div>
            )}
          </button>
        );
      default:
        return null;
    }
  };

  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

  // Close context menu on outside click or scroll
  useEffect(() => {
    if (!contextMenu) return;
    const close = () => setContextMenu(null);
    window.addEventListener('click', close);
    window.addEventListener('scroll', close, true);
    return () => {
      window.removeEventListener('click', close);
      window.removeEventListener('scroll', close, true);
    };
  }, [contextMenu]);

  return (
    <>
      <tr
        className="group border-b border-white/[0.04] last:border-b-0 hover:bg-white/[0.02] transition-colors"
        onContextMenu={(e) => {
          e.preventDefault();
          setContextMenu({ x: e.clientX, y: e.clientY });
        }}
      >
        {visibleCols.map((col) => (
          <td key={col.key} className="px-3 py-2.5 overflow-hidden">
            {renderCell(col.key)}
          </td>
        ))}
      </tr>

      {/* Right-click context menu */}
      {contextMenu && (
        <tr>
          <td colSpan={0} className="p-0 border-0">
            <div
              className="fixed z-50 bg-[#1C1C1E] border border-white/[0.1] rounded-lg shadow-2xl py-1 min-w-[160px]"
              style={{ left: contextMenu.x, top: contextMenu.y }}
            >
              <button
                onClick={() => { onNavigate(); setContextMenu(null); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-[#FAFAFA] hover:bg-white/[0.06] transition-colors"
              >
                Open project
              </button>
              <div className="h-px bg-white/[0.06] mx-2 my-1" />
              <button
                onClick={() => { onTrash(); setContextMenu(null); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-400 hover:bg-white/[0.06] transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Move to Trash
              </button>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
