'use client';

import { useState, useMemo } from 'react';
import { Search, Plus, ChevronDown, ChevronRight } from 'lucide-react';
import { useProjectStore } from '@/hooks/useProjectStore';
import type { ProjectWithProgress, ProjectStatus, CreateProjectInput } from '@/lib/types/project';
import { MiniDonut } from './DonutChart';
import ProjectForm from './ProjectForm';

const statusGroups: { key: ProjectStatus; label: string; color: string }[] = [
  { key: 'not_started', label: 'NOT STARTED', color: '#71717A' },
  { key: 'in_progress', label: 'IN PROGRESS', color: '#F59E0B' },
  { key: 'done', label: 'DONE', color: '#10B981' },
];

export default function ProjectList() {
  const { projects, selectedProjectId, selectProject, createProject } = useProjectStore();
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    if (!search.trim()) return projects;
    const q = search.toLowerCase();
    return projects.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.assignees.some((a) => a.toLowerCase().includes(q))
    );
  }, [projects, search]);

  const toggleGroup = (key: string) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const handleCreate = async (data: CreateProjectInput) => {
    return createProject(data);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Search + New */}
      <div className="p-3 space-y-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#52525B]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects..."
            className="w-full bg-[#0A0A0B] border border-white/[0.06] rounded-lg pl-9 pr-3 py-2 text-sm text-[#FAFAFA] placeholder:text-[#3F3F46] outline-none focus:border-[#3B82F6] transition-colors"
          />
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-white rounded-lg transition-all hover:opacity-90"
          style={{
            background: 'linear-gradient(to right, rgba(167,139,250,0.75) 0%, rgba(96,175,250,0.85) 40%, rgba(52,211,153,0.8) 100%)',
          }}
        >
          <Plus className="w-3.5 h-3.5" />
          New Project
        </button>
      </div>

      {/* Grouped project list */}
      <div className="flex-1 overflow-y-auto">
        {statusGroups.map((group) => {
          const groupProjects = filtered.filter((p) => p.status === group.key);
          if (groupProjects.length === 0) return null;
          const isCollapsed = collapsedGroups.has(group.key);

          return (
            <div key={group.key}>
              {/* Group header */}
              <button
                onClick={() => toggleGroup(group.key)}
                className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-semibold uppercase tracking-wider hover:bg-white/[0.02] transition-colors"
                style={{ color: group.color }}
              >
                {isCollapsed ? (
                  <ChevronRight className="w-3 h-3" />
                ) : (
                  <ChevronDown className="w-3 h-3" />
                )}
                {group.label}
                <span
                  className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full ml-auto"
                  style={{ backgroundColor: `${group.color}15`, color: group.color }}
                >
                  {groupProjects.length}
                </span>
              </button>

              {/* Project cards */}
              {!isCollapsed &&
                groupProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    isSelected={project.id === selectedProjectId}
                    onSelect={() => selectProject(project.id)}
                  />
                ))}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="px-3 py-4 text-center text-xs text-[#52525B]">
            {search ? 'No matching projects' : 'No projects yet'}
          </div>
        )}
      </div>

      {/* Form modal */}
      {showForm && (
        <ProjectForm
          onSubmit={handleCreate}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}

function ProjectCard({
  project,
  isSelected,
  onSelect,
}: {
  project: ProjectWithProgress;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <button
      onClick={onSelect}
      className={`w-full text-left px-4 py-3 transition-all border-l-2 ${
        isSelected
          ? 'bg-[#3B82F6]/8 border-l-[#3B82F6]'
          : 'border-l-transparent hover:bg-white/[0.02]'
      }`}
    >
      <div className="flex items-start gap-2.5">
        {/* Mini donut */}
        <div className="mt-0.5 flex-shrink-0">
          <MiniDonut completed={project.completed_tasks} total={project.total_tasks} />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className={`text-xs font-medium truncate ${isSelected ? 'text-[#FAFAFA]' : 'text-[#A1A1AA]'}`}>
            {project.name}
          </p>
          <div className="flex items-center gap-2 mt-1">
            {project.assignees.length > 0 && (
              <span className="text-[10px] text-[#52525B]">
                {project.assignees.join(', ')}
              </span>
            )}
            {project.due_date && (
              <span className={`text-[10px] ${
                new Date(project.due_date) < new Date() && project.status !== 'done'
                  ? 'text-[#EF4444]'
                  : 'text-[#3F3F46]'
              }`}>
                {formatDate(project.due_date)}
              </span>
            )}
          </div>
          {project.total_tasks > 0 && (
            <span className="text-[10px] text-[#3F3F46] mt-0.5 block">
              {project.completed_tasks}/{project.total_tasks} tasks
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
