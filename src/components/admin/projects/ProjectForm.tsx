'use client';

import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import type { ProjectStatus, CreateProjectInput, Project } from '@/lib/types/project';

interface ProjectFormProps {
  project?: Project; // If provided, we're editing
  onSubmit: (data: CreateProjectInput) => Promise<{ success: boolean; error?: string }>;
  onClose: () => void;
}

const statusOptions: { value: ProjectStatus; label: string }[] = [
  { value: 'not_started', label: 'Not Started' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
];

const colorOptions = [
  '#3B82F6', '#8B5CF6', '#EC4899', '#EF4444',
  '#F59E0B', '#10B981', '#06B6D4', '#6366F1',
];

export default function ProjectForm({ project, onSubmit, onClose }: ProjectFormProps) {
  const [name, setName] = useState(project?.name || '');
  const [description, setDescription] = useState(project?.description || '');
  const [status, setStatus] = useState<ProjectStatus>(project?.status || 'not_started');
  const [assignees, setAssignees] = useState(project?.assignees?.join(', ') || '');
  const [dueDate, setDueDate] = useState(project?.due_date || '');
  const [color, setColor] = useState(project?.color || '#3B82F6');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Project name is required');
      return;
    }

    setLoading(true);
    setError('');

    const data: CreateProjectInput = {
      name: name.trim(),
      description,
      status,
      assignees: assignees.split(',').map((a) => a.trim()).filter(Boolean),
      due_date: dueDate || undefined,
      color,
    };

    const result = await onSubmit(data);
    setLoading(false);

    if (result.success) {
      onClose();
    } else {
      setError(result.error || 'Failed to save project');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg mx-4 bg-[#141415] border border-white/[0.08] rounded-xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
          <h2 className="text-lg font-semibold text-[#FAFAFA]">
            {project ? 'Edit Project' : 'New Project'}
          </h2>
          <button onClick={onClose} className="text-[#71717A] hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-medium text-[#71717A] mb-1.5">Project Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Skyfynd Website Prototype"
              className="w-full bg-[#0A0A0B] border border-white/[0.06] rounded-lg px-3 py-2.5 text-sm text-[#FAFAFA] placeholder:text-[#3F3F46] outline-none focus:border-[#3B82F6] transition-colors"
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-[#71717A] mb-1.5">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's this project about?"
              rows={3}
              className="w-full bg-[#0A0A0B] border border-white/[0.06] rounded-lg px-3 py-2.5 text-sm text-[#FAFAFA] placeholder:text-[#3F3F46] outline-none focus:border-[#3B82F6] transition-colors resize-none"
            />
          </div>

          {/* Status + Due Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#71717A] mb-1.5">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                className="w-full bg-[#0A0A0B] border border-white/[0.06] rounded-lg px-3 py-2.5 text-sm text-[#FAFAFA] outline-none focus:border-[#3B82F6] transition-colors"
              >
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#71717A] mb-1.5">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-[#0A0A0B] border border-white/[0.06] rounded-lg px-3 py-2.5 text-sm text-[#FAFAFA] outline-none focus:border-[#3B82F6] transition-colors"
              />
            </div>
          </div>

          {/* Assignees */}
          <div>
            <label className="block text-xs font-medium text-[#71717A] mb-1.5">Assignees (comma-separated)</label>
            <input
              value={assignees}
              onChange={(e) => setAssignees(e.target.value)}
              placeholder="Juan, Carlos"
              className="w-full bg-[#0A0A0B] border border-white/[0.06] rounded-lg px-3 py-2.5 text-sm text-[#FAFAFA] placeholder:text-[#3F3F46] outline-none focus:border-[#3B82F6] transition-colors"
            />
          </div>

          {/* Color */}
          <div>
            <label className="block text-xs font-medium text-[#71717A] mb-1.5">Color</label>
            <div className="flex gap-2">
              {colorOptions.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-full transition-all ${
                    color === c ? 'ring-2 ring-white ring-offset-2 ring-offset-[#141415]' : 'opacity-60 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Error */}
          {error && <p className="text-xs text-[#EF4444]">{error}</p>}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-[#A1A1AA] hover:text-white transition-colors rounded-lg border border-white/[0.06] hover:border-white/[0.15]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-sm font-semibold text-white rounded-lg transition-all disabled:opacity-50"
              style={{
                background: 'linear-gradient(to right, rgba(167,139,250,0.75) 0%, rgba(96,175,250,0.85) 40%, rgba(52,211,153,0.8) 100%)',
              }}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </span>
              ) : project ? 'Save Changes' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
