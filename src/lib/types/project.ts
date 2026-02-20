export type ProjectStatus = 'not_started' | 'in_progress' | 'done';
export type TaskStatus = 'todo' | 'in_progress' | 'done';

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  assignees: string[];
  due_date: string | null;
  color: string;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProjectTask {
  id: string;
  project_id: string;
  name: string;
  notes: string;
  status: TaskStatus;
  assignees: string[];
  due_date: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ProjectWithProgress extends Project {
  total_tasks: number;
  completed_tasks: number;
  in_progress_tasks: number;
  progress: number; // 0-100
}

export interface ProjectWithTasks extends Project {
  tasks: ProjectTask[];
}

export interface CreateProjectInput {
  name: string;
  description?: string;
  status?: ProjectStatus;
  assignees?: string[];
  due_date?: string;
  color?: string;
}

export interface CreateTaskInput {
  name: string;
  notes?: string;
  status?: TaskStatus;
  assignees?: string[];
  due_date?: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface CreateNoteInput {
  title?: string;
  content?: string;
}
