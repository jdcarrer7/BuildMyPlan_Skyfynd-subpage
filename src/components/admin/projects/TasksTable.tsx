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
import type { TaskStatus, ProjectTask } from '@/lib/types/project';

type SortColumn = 'name' | 'assignees' | 'due_date' | 'status' | 'project' | 'created_at' | 'notes';

const statusConfig: Record<TaskStatus, { label: string; color: string; bg: string }> = {
  todo: { label: 'Not Started', color: '#EF4444', bg: 'rgba(239,68,68,0.15)' },
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
    { value: 'todo', label: 'Not Started' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'done', label: 'Done' },
  ]},
  { key: 'due_date', label: 'Due', emoji: '📅', type: 'date' },
  { key: 'project', label: 'Project', emoji: '📁', type: 'text' },
  { key: 'notes', label: 'Notes', emoji: '💬', type: 'text' },
];

const defaultColumnWidths: Record<string, number> = {
  name: 200,
  assignees: 130,
  due_date: 120,
  status: 120,
  project: 160,
  created_at: 130,
  notes: 180,
};

const allColumnKeys = columns.map((c) => c.key);

interface TasksTableProps {
  onlineUsers: PresenceUser[];
  currentUserEmail: string;
  onEditStart: (cellId: string, label: string) => void;
  onEditEnd: () => void;
}

export default function TasksTable({ onlineUsers, currentUserEmail, onEditStart, onEditEnd }: TasksTableProps) {
  const { allTasks, projects, selectProject, updateTask, createTask, deleteTask } = useProjectStore();
  const { getWidth, onResizeStart } = useResizableColumns({
    storageKey: 'tasks-table-col-widths',
    defaults: defaultColumnWidths,
  });

  // Persisted sort, filter & column visibility state
  const [sortCriteria, setSortCriteria] = usePersistedState<SortCriterion[]>('tasks-table-sort', []);
  const [filterCriteria, setFilterCriteria] = usePersistedState<FilterCriterion[]>('tasks-table-filter', []);
  const [visibleColumns, setVisibleColumns] = usePersistedState<string[]>('tasks-table-columns', allColumnKeys);

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

  const projectMap = useMemo(() => {
    const map = new Map<string, { name: string; color: string }>();
    for (const p of projects) {
      map.set(p.id, { name: p.name, color: p.color });
    }
    return map;
  }, [projects]);

  // Column header menu helpers
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
    const task = allTasks.find((t) => t.id === id);
    onEditStart(`task:${id}:${column}`, `${task?.name || 'Task'} > ${column}`);
  };

  const cancelEdit = () => {
    setEditingCell(null);
    setEditValue('');
    onEditEnd();
  };

  const saveTaskEdit = async (task: ProjectTask, column: string) => {
    setEditingCell(null);
    onEditEnd();
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
      case 'project':
        if (trimmed && trimmed !== task.project_id) {
          await updateTask(task.project_id, task.id, { project_id: trimmed } as Record<string, unknown>);
        }
        break;
    }
    setEditValue('');
  };

  // Auto-enter edit mode for newly created rows
  useEffect(() => {
    if (newRowId && allTasks.find((t) => t.id === newRowId)) {
      startEdit(newRowId, 'name', 'New Task');
      setNewRowId(null);
    }
  }, [newRowId, allTasks]);

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
              {sorted.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  visibleCols={visibleCols}
                  projectMap={projectMap}
                  allProjects={projects}
                  isEditing={isEditing}
                  editValue={editValue}
                  inputRef={inputRef}
                  startEdit={startEdit}
                  cancelEdit={cancelEdit}
                  saveTaskEdit={saveTaskEdit}
                  setEditValue={setEditValue}
                  onNavigateProject={() => selectProject(task.project_id)}
                  onDelete={() => deleteTask(task.project_id, task.id)}
                  onlineUsers={onlineUsers}
                  currentUserEmail={currentUserEmail}
                />
              ))}

              {allTasks.length === 0 && (
                <tr>
                  <td colSpan={visibleCols.length} className="px-3 py-8 text-center text-xs text-[#3F3F46]">
                    No tasks yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Add new row */}
        <button
          onClick={async () => {
            if (projects.length > 0) {
              const result = await createTask(projects[0].id, { name: 'New Task' });
              if (result.success && result.id) {
                setNewRowId(result.id);
              }
            }
          }}
          disabled={projects.length === 0}
          className="w-full flex items-center gap-2 px-3 py-2 text-[11px] text-[#52525B] hover:text-[#A1A1AA] hover:bg-white/[0.02] transition-colors border-t border-white/[0.04] disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Plus className="w-3.5 h-3.5" />
          New
        </button>
      </div>
    </div>
  );
}

/* ── Task Row ── */

function TaskRow({
  task,
  visibleCols,
  projectMap,
  allProjects,
  isEditing,
  editValue,
  inputRef,
  startEdit,
  cancelEdit,
  saveTaskEdit,
  setEditValue,
  onNavigateProject,
  onDelete,
  onlineUsers,
  currentUserEmail,
}: {
  task: ProjectTask;
  visibleCols: { key: string; label: string; emoji: string }[];
  projectMap: Map<string, { name: string; color: string }>;
  allProjects: { id: string; name: string; color: string }[];
  isEditing: (id: string, column: string) => boolean;
  editValue: string;
  inputRef: React.RefObject<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null>;
  startEdit: (id: string, column: string, value: string) => void;
  cancelEdit: () => void;
  saveTaskEdit: (task: ProjectTask, column: string) => void;
  setEditValue: (v: string) => void;
  onNavigateProject: () => void;
  onDelete: () => void;
  onlineUsers: PresenceUser[];
  currentUserEmail: string;
}) {
  const status = statusConfig[task.status] || statusConfig.todo;
  const project = projectMap.get(task.project_id);

  const handleKeyDown = (e: React.KeyboardEvent, column: string) => {
    if (e.key === 'Enter') saveTaskEdit(task, column);
    if (e.key === 'Escape') cancelEdit();
  };

  const indicator = (col: string) => (
    <EditingIndicator cellId={`task:${task.id}:${col}`} onlineUsers={onlineUsers} currentUserEmail={currentUserEmail} />
  );

  const renderCell = (key: string) => {
    switch (key) {
      case 'name':
        return isEditing(task.id, 'name') ? (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={() => saveTaskEdit(task, 'name')}
            onKeyDown={(e) => handleKeyDown(e, 'name')}
            className="w-full bg-transparent text-[13px] text-[#FAFAFA] outline-none caret-[#3B82F6]"
          />
        ) : (
          <div>
            {indicator('name')}
            <span
              onClick={() => startEdit(task.id, 'name', task.name)}
              className={`text-[13px] truncate block cursor-text hover:text-[#3B82F6] transition-colors ${
                task.status === 'done' ? 'text-[#52525B] line-through' : 'text-[#FAFAFA]'
              }`}
            >
              {task.name}
            </span>
          </div>
        );
      case 'assignees':
        return isEditing(task.id, 'assignees') ? (
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
          <div>
            {indicator('assignees')}
            <div
              className="flex items-center gap-1 flex-nowrap overflow-hidden cursor-text min-h-[20px]"
              onClick={() => startEdit(task.id, 'assignees', task.assignees.join(', '))}
            >
              {task.assignees.length > 0 ? (
                task.assignees.map((a, i) => (
                  <span key={i} className="text-[10px] font-medium text-[#A1A1AA] bg-white/[0.06] px-1.5 py-0.5 rounded shrink-0">{a}</span>
                ))
              ) : (
                <span className="text-[11px] text-[#3F3F46]">—</span>
              )}
            </div>
          </div>
        );
      case 'due_date':
        return isEditing(task.id, 'due_date') ? (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="date"
            value={editValue}
            onChange={(e) => { setEditValue(e.target.value); setTimeout(() => saveTaskEdit(task, 'due_date'), 0); }}
            onBlur={() => saveTaskEdit(task, 'due_date')}
            className="bg-transparent text-[11px] text-[#FAFAFA] outline-none caret-[#3B82F6]"
          />
        ) : (
          <div>
            {indicator('due_date')}
            <span
              onClick={() => startEdit(task.id, 'due_date', toDateInputValue(task.due_date))}
              className={`text-[11px] whitespace-nowrap cursor-text hover:text-[#3B82F6] transition-colors ${
                task.due_date && new Date(task.due_date) < new Date() && task.status !== 'done'
                  ? 'text-[#EF4444]' : 'text-[#71717A]'
              }`}
            >
              {formatDate(task.due_date)}
            </span>
          </div>
        );
      case 'status':
        return isEditing(task.id, 'status') ? (
          <select
            ref={inputRef as React.RefObject<HTMLSelectElement>}
            value={editValue}
            onChange={(e) => { setEditValue(e.target.value); setTimeout(() => saveTaskEdit(task, 'status'), 0); }}
            onBlur={() => saveTaskEdit(task, 'status')}
            className="appearance-none bg-transparent text-[10px] font-semibold outline-none cursor-pointer caret-[#3B82F6]"
            style={{ color: statusConfig[editValue as TaskStatus]?.color || status.color }}
          >
            <option value="todo">Not Started</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        ) : (
          <div>
            {indicator('status')}
            <span
              onClick={() => startEdit(task.id, 'status', task.status)}
              className="text-[10px] font-semibold px-2 py-1 rounded-full whitespace-nowrap cursor-pointer hover:ring-1 hover:ring-white/20 transition-all"
              style={{ color: status.color, backgroundColor: status.bg }}
            >
              {status.label}
            </span>
          </div>
        );
      case 'project':
        return isEditing(task.id, 'project') ? (
          <select
            ref={inputRef as React.RefObject<HTMLSelectElement>}
            value={editValue}
            onChange={(e) => { setEditValue(e.target.value); setTimeout(() => saveTaskEdit(task, 'project'), 0); }}
            onBlur={() => saveTaskEdit(task, 'project')}
            className="appearance-none bg-transparent text-[11px] text-[#A1A1AA] font-medium outline-none cursor-pointer w-full"
          >
            {allProjects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        ) : (
          <div>
            {indicator('project')}
            <div
              className="flex items-center gap-1.5 cursor-pointer max-w-full group/proj"
              onClick={() => startEdit(task.id, 'project', task.project_id)}
              onDoubleClick={(e) => { e.stopPropagation(); onNavigateProject(); }}
            >
              <div className="w-2 h-2 rounded-sm flex-shrink-0" style={{ backgroundColor: project?.color || '#3B82F6' }} />
              <span className="text-[11px] text-[#A1A1AA] group-hover/proj:text-[#FAFAFA] truncate transition-colors">
                {project?.name || '—'}
              </span>
            </div>
          </div>
        );
      case 'created_at':
        return <span className="text-[11px] text-[#71717A] whitespace-nowrap">{formatDate(task.created_at)}</span>;
      case 'notes':
        return isEditing(task.id, 'notes') ? (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={() => saveTaskEdit(task, 'notes')}
            onKeyDown={(e) => handleKeyDown(e, 'notes')}
            className="w-full bg-transparent text-[11px] text-[#A1A1AA] outline-none caret-[#3B82F6]"
          />
        ) : (
          <div>
            {indicator('notes')}
            <span
              onClick={() => startEdit(task.id, 'notes', task.notes || '')}
              className="text-[11px] text-[#52525B] truncate block cursor-text hover:text-[#A1A1AA] transition-colors min-h-[16px]"
            >
              {task.notes || '—'}
            </span>
          </div>
        );
      default:
        return null;
    }
  };

  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

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
                onClick={() => { onNavigateProject(); setContextMenu(null); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-[#FAFAFA] hover:bg-white/[0.06] transition-colors"
              >
                Open project
              </button>
              <div className="h-px bg-white/[0.06] mx-2 my-1" />
              <button
                onClick={() => { onDelete(); setContextMenu(null); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-400 hover:bg-white/[0.06] transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete task
              </button>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
