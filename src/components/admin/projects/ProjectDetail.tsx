'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Calendar, Users, Archive, MoreHorizontal, Loader2 } from 'lucide-react';
import { useProjectStore } from '@/hooks/useProjectStore';
import type { ProjectStatus, Project } from '@/lib/types/project';
import DonutChart from './DonutChart';
import ProjectTimeline from './ProjectTimeline';
import TaskList from './TaskList';
import ProjectForm from './ProjectForm';

const statusConfig: Record<ProjectStatus, { label: string; color: string; bg: string }> = {
  not_started: { label: 'Not Started', color: '#EF4444', bg: 'rgba(239,68,68,0.15)' },
  in_progress: { label: 'In Progress', color: '#F59E0B', bg: 'rgba(245,158,11,0.15)' },
  done: { label: 'Done', color: 'var(--accent-blue-light)', bg: 'rgba(59,130,246,0.15)' },
};

export default function ProjectDetail() {
  const { selectedProject, selectedTasks, projectLoading, updateProject, archiveProject, selectedProjectId } = useProjectStore();
  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState('');
  const [editingDesc, setEditingDesc] = useState(false);
  const [description, setDescription] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const descRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (selectedProject) {
      setName(selectedProject.name);
      setDescription(selectedProject.description);
    }
  }, [selectedProject]);

  useEffect(() => {
    if (editingName && nameRef.current) nameRef.current.focus();
  }, [editingName]);

  useEffect(() => {
    if (editingDesc && descRef.current) descRef.current.focus();
  }, [editingDesc]);

  const saveName = useCallback(() => {
    setEditingName(false);
    const trimmed = name.trim();
    if (trimmed && trimmed !== selectedProject?.name && selectedProjectId) {
      updateProject(selectedProjectId, { name: trimmed });
    } else if (selectedProject) {
      setName(selectedProject.name);
    }
  }, [name, selectedProject, selectedProjectId, updateProject]);

  const saveDescription = useCallback(() => {
    setEditingDesc(false);
    if (description !== selectedProject?.description && selectedProjectId) {
      updateProject(selectedProjectId, { description });
    }
  }, [description, selectedProject, selectedProjectId, updateProject]);

  const handleStatusChange = (status: ProjectStatus) => {
    if (selectedProjectId) updateProject(selectedProjectId, { status });
  };

  if (projectLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-6 h-6 text-[#3B82F6] animate-spin" />
      </div>
    );
  }

  if (!selectedProject) return null;

  const status = statusConfig[selectedProject.status] || statusConfig.not_started;

  // Compute task stats
  const completedTasks = selectedTasks.filter((t) => t.status === 'done').length;
  const inProgressTasks = selectedTasks.filter((t) => t.status === 'in_progress').length;
  const totalTasks = selectedTasks.length;

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        {/* Project name - inline editable */}
        {editingName ? (
          <input
            ref={nameRef}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={saveName}
            onKeyDown={(e) => {
              if (e.key === 'Enter') saveName();
              if (e.key === 'Escape') { setName(selectedProject.name); setEditingName(false); }
            }}
            className="text-2xl font-semibold text-[#FAFAFA] bg-transparent outline-none border-b-2 border-[#3B82F6] w-full mb-3"
            style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif", letterSpacing: '-0.5px' }}
          />
        ) : (
          <h1
            onClick={() => setEditingName(true)}
            className="text-2xl font-semibold text-[#FAFAFA] cursor-text mb-3"
            style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif", letterSpacing: '-0.5px' }}
          >
            {selectedProject.name}
          </h1>
        )}

        {/* Meta row */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Status dropdown */}
          <div className="relative">
            <select
              value={selectedProject.status}
              onChange={(e) => handleStatusChange(e.target.value as ProjectStatus)}
              className="appearance-none text-xs font-medium px-3 py-1.5 rounded-full cursor-pointer outline-none border-0"
              style={{ backgroundColor: status.bg, color: status.color }}
            >
              <option value="not_started">Not Started</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>

          {/* Assignees */}
          {selectedProject.assignees.length > 0 && (
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#52525B]" />
              {selectedProject.assignees.map((a, i) => (
                <span key={i} className="text-xs text-[#A1A1AA] bg-white/[0.06] px-2 py-0.5 rounded">
                  {a}
                </span>
              ))}
            </div>
          )}

          {/* Due date */}
          {selectedProject.due_date && (
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#52525B]" />
              <span className={`text-xs ${
                new Date(selectedProject.due_date) < new Date() && selectedProject.status !== 'done'
                  ? 'text-[#EF4444]'
                  : 'text-[#A1A1AA]'
              }`}>
                {new Date(selectedProject.due_date).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>
          )}

          {/* Menu */}
          <div className="relative ml-auto">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 text-[#52525B] hover:text-[#A1A1AA] transition-colors rounded"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
            {showMenu && (
              <div className="absolute right-0 top-full mt-1 bg-[#1C1C1E] border border-white/[0.08] rounded-lg shadow-xl py-1 z-10 min-w-[160px]">
                <button
                  onClick={() => { setShowForm(true); setShowMenu(false); }}
                  className="w-full text-left px-3 py-2 text-xs text-[#A1A1AA] hover:text-white hover:bg-white/[0.04] transition-colors"
                >
                  Edit Project
                </button>
                <button
                  onClick={async () => {
                    if (selectedProjectId) await archiveProject(selectedProjectId);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors"
                >
                  <Archive className="w-3 h-3 inline mr-1.5" />
                  Archive Project
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mb-8">
        {editingDesc ? (
          <textarea
            ref={descRef}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={saveDescription}
            onKeyDown={(e) => {
              if (e.key === 'Escape') { setDescription(selectedProject.description); setEditingDesc(false); }
            }}
            className="w-full bg-[#0A0A0B] border border-white/[0.06] rounded-lg px-4 py-3 text-sm text-[#A1A1AA] outline-none focus:border-[#3B82F6] resize-none"
            rows={3}
            placeholder="Add a description..."
          />
        ) : (
          <div
            onClick={() => setEditingDesc(true)}
            className={`text-sm rounded-lg px-4 py-3 cursor-text border border-transparent hover:border-white/[0.06] transition-colors ${
              selectedProject.description ? 'text-[#A1A1AA]' : 'text-[#3F3F46] italic'
            }`}
          >
            {selectedProject.description || 'Add a description...'}
          </div>
        )}
      </div>

      {/* Visualizations row */}
      {totalTasks > 0 && (
        <div className="grid grid-cols-[auto_1fr] gap-8 items-center mb-10 p-5 rounded-xl border border-white/[0.06] bg-white/[0.01]">
          <DonutChart
            completed={completedTasks}
            inProgress={inProgressTasks}
            total={totalTasks}
            size={120}
            strokeWidth={12}
          />
          <ProjectTimeline
            tasks={selectedTasks}
            projectDueDate={selectedProject.due_date}
          />
        </div>
      )}

      {/* Task list */}
      <TaskList projectId={selectedProject.id} tasks={selectedTasks} />

      {/* Edit form modal */}
      {showForm && (
        <ProjectForm
          project={selectedProject}
          onSubmit={async (data) => {
            if (!selectedProjectId) return { success: false, error: 'No project selected' };
            return updateProject(selectedProjectId, data as Partial<Project>);
          }}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
