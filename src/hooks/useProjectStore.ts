import { create } from 'zustand';
import type {
  ProjectWithProgress,
  Project,
  ProjectTask,
  CreateProjectInput,
  CreateTaskInput,
  TaskStatus,
} from '@/lib/types/project';

interface ProjectState {
  // Project list
  projects: ProjectWithProgress[];
  allTasks: ProjectTask[];
  projectsLoading: boolean;
  projectsError: string | null;

  // Selected project
  selectedProjectId: string | null;
  selectedProject: Project | null;
  selectedTasks: ProjectTask[];
  projectLoading: boolean;
  projectError: string | null;

  // Actions
  fetchProjects: () => Promise<void>;
  selectProject: (id: string) => Promise<void>;
  clearSelectedProject: () => void;
  createProject: (data: CreateProjectInput) => Promise<{ success: boolean; error?: string }>;
  updateProject: (id: string, data: Partial<Project>) => Promise<{ success: boolean; error?: string }>;
  archiveProject: (id: string) => Promise<{ success: boolean; error?: string }>;
  createTask: (projectId: string, data: CreateTaskInput) => Promise<{ success: boolean; error?: string }>;
  updateTask: (projectId: string, taskId: string, data: Partial<ProjectTask>) => Promise<{ success: boolean; error?: string }>;
  deleteTask: (projectId: string, taskId: string) => Promise<{ success: boolean; error?: string }>;
  toggleTaskStatus: (projectId: string, taskId: string) => Promise<void>;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  allTasks: [],
  projectsLoading: false,
  projectsError: null,

  selectedProjectId: null,
  selectedProject: null,
  selectedTasks: [],
  projectLoading: false,
  projectError: null,

  fetchProjects: async () => {
    // Only show loading on first fetch
    if (get().projects.length === 0) set({ projectsLoading: true });
    try {
      const res = await fetch('/api/admin/projects');
      const data = await res.json();
      if (data.status === 'success') {
        set({ projects: data.projects, allTasks: data.tasks || [], projectsLoading: false, projectsError: null });
      } else {
        set({ projectsError: data.error, projectsLoading: false });
      }
    } catch {
      set({ projectsError: 'Failed to fetch projects', projectsLoading: false });
    }
  },

  selectProject: async (id: string) => {
    set({ selectedProjectId: id, projectLoading: true, projectError: null });
    try {
      const res = await fetch(`/api/admin/projects/${id}`);
      const data = await res.json();
      if (data.status === 'success') {
        set({
          selectedProject: data.project,
          selectedTasks: data.tasks,
          projectLoading: false,
        });
      } else {
        set({ projectError: data.error, projectLoading: false });
      }
    } catch {
      set({ projectError: 'Failed to load project', projectLoading: false });
    }
  },

  clearSelectedProject: () => {
    set({ selectedProjectId: null, selectedProject: null, selectedTasks: [], projectError: null });
  },

  createProject: async (data) => {
    try {
      const res = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result.status === 'success') {
        await get().fetchProjects();
        return { success: true };
      }
      return { success: false, error: result.error };
    } catch {
      return { success: false, error: 'Network error' };
    }
  },

  updateProject: async (id, data) => {
    try {
      const res = await fetch(`/api/admin/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result.status === 'success') {
        // Update local state
        set({ selectedProject: result.project });
        await get().fetchProjects();
        return { success: true };
      }
      return { success: false, error: result.error };
    } catch {
      return { success: false, error: 'Network error' };
    }
  },

  archiveProject: async (id) => {
    try {
      const res = await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' });
      const result = await res.json();
      if (result.status === 'success') {
        set({ selectedProjectId: null, selectedProject: null, selectedTasks: [] });
        await get().fetchProjects();
        return { success: true };
      }
      return { success: false, error: result.error };
    } catch {
      return { success: false, error: 'Network error' };
    }
  },

  createTask: async (projectId, data) => {
    try {
      const res = await fetch(`/api/admin/projects/${projectId}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result.status === 'success') {
        // Append task to local state
        set((state) => ({ selectedTasks: [...state.selectedTasks, result.task] }));
        await get().fetchProjects(); // refresh progress counts
        return { success: true };
      }
      return { success: false, error: result.error };
    } catch {
      return { success: false, error: 'Network error' };
    }
  },

  updateTask: async (projectId, taskId, data) => {
    try {
      const res = await fetch(`/api/admin/projects/${projectId}/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result.status === 'success') {
        set((state) => ({
          selectedTasks: state.selectedTasks.map((t) =>
            t.id === taskId ? result.task : t
          ),
        }));
        await get().fetchProjects();
        return { success: true };
      }
      return { success: false, error: result.error };
    } catch {
      return { success: false, error: 'Network error' };
    }
  },

  deleteTask: async (projectId, taskId) => {
    try {
      const res = await fetch(`/api/admin/projects/${projectId}/tasks/${taskId}`, {
        method: 'DELETE',
      });
      const result = await res.json();
      if (result.status === 'success') {
        set((state) => ({
          selectedTasks: state.selectedTasks.filter((t) => t.id !== taskId),
        }));
        await get().fetchProjects();
        return { success: true };
      }
      return { success: false, error: result.error };
    } catch {
      return { success: false, error: 'Network error' };
    }
  },

  toggleTaskStatus: async (projectId, taskId) => {
    const { selectedTasks } = get();
    const task = selectedTasks.find((t) => t.id === taskId);
    if (!task) return;

    // Cycle: todo → in_progress → done → todo
    const nextStatus: Record<TaskStatus, TaskStatus> = {
      todo: 'done',
      in_progress: 'done',
      done: 'todo',
    };
    const newStatus = nextStatus[task.status];

    // Optimistic update
    set((state) => ({
      selectedTasks: state.selectedTasks.map((t) =>
        t.id === taskId ? { ...t, status: newStatus } : t
      ),
    }));

    try {
      const res = await fetch(`/api/admin/projects/${projectId}/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const result = await res.json();
      if (result.status !== 'success') {
        // Rollback
        set((state) => ({
          selectedTasks: state.selectedTasks.map((t) =>
            t.id === taskId ? task : t
          ),
        }));
      }
      await get().fetchProjects();
    } catch {
      // Rollback
      set((state) => ({
        selectedTasks: state.selectedTasks.map((t) =>
          t.id === taskId ? task : t
        ),
      }));
    }
  },
}));
