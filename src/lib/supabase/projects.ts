import { getSupabaseAdmin } from './client';
import type {
  Project,
  ProjectTask,
  ProjectWithProgress,
  CreateProjectInput,
  CreateTaskInput,
} from '@/lib/types/project';

// ── Projects ──

export async function listProjects(): Promise<ProjectWithProgress[]> {
  const supabase = getSupabaseAdmin();

  const { data: projects, error } = await supabase
    .from('projects')
    .select('*')
    .eq('is_archived', false)
    .order('created_at', { ascending: false });

  if (error) throw new Error(`Failed to list projects: ${error.message}`);

  // Fetch all task statuses in one query
  const { data: allTasks } = await supabase
    .from('project_tasks')
    .select('project_id, status');

  const countMap = new Map<string, { total: number; completed: number; in_progress: number }>();
  for (const t of allTasks || []) {
    const entry = countMap.get(t.project_id) || { total: 0, completed: 0, in_progress: 0 };
    entry.total++;
    if (t.status === 'done') entry.completed++;
    if (t.status === 'in_progress') entry.in_progress++;
    countMap.set(t.project_id, entry);
  }

  return (projects || []).map((p: Project) => {
    const counts = countMap.get(p.id) || { total: 0, completed: 0, in_progress: 0 };
    return {
      ...p,
      total_tasks: counts.total,
      completed_tasks: counts.completed,
      in_progress_tasks: counts.in_progress,
      progress: counts.total > 0 ? Math.round((counts.completed / counts.total) * 100) : 0,
    };
  });
}

export async function getProject(id: string): Promise<{ project: Project; tasks: ProjectTask[] } | null> {
  const supabase = getSupabaseAdmin();

  const { data: project, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !project) return null;

  const { data: tasks } = await supabase
    .from('project_tasks')
    .select('*')
    .eq('project_id', id)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });

  return { project, tasks: tasks || [] };
}

export async function createProject(data: CreateProjectInput): Promise<Project> {
  const supabase = getSupabaseAdmin();

  const { data: project, error } = await supabase
    .from('projects')
    .insert({
      name: data.name,
      description: data.description || '',
      status: data.status || 'not_started',
      assignees: data.assignees || [],
      due_date: data.due_date || null,
      color: data.color || '#3B82F6',
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to create project: ${error.message}`);
  return project;
}

export async function updateProject(id: string, data: Partial<Project>): Promise<Project> {
  const supabase = getSupabaseAdmin();

  // Only allow updating specific fields
  const updates: Record<string, unknown> = {};
  if (data.name !== undefined) updates.name = data.name;
  if (data.description !== undefined) updates.description = data.description;
  if (data.status !== undefined) updates.status = data.status;
  if (data.assignees !== undefined) updates.assignees = data.assignees;
  if (data.due_date !== undefined) updates.due_date = data.due_date;
  if (data.color !== undefined) updates.color = data.color;
  updates.updated_at = new Date().toISOString();

  const { data: project, error } = await supabase
    .from('projects')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(`Failed to update project: ${error.message}`);
  return project;
}

export async function archiveProject(id: string): Promise<void> {
  const supabase = getSupabaseAdmin();

  const { error } = await supabase
    .from('projects')
    .update({ is_archived: true, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) throw new Error(`Failed to archive project: ${error.message}`);
}

export async function listAllTasks(): Promise<ProjectTask[]> {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from('project_tasks')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });

  if (error) throw new Error(`Failed to list tasks: ${error.message}`);
  return data || [];
}

// ── Tasks ──

export async function createTask(projectId: string, data: CreateTaskInput): Promise<ProjectTask> {
  const supabase = getSupabaseAdmin();

  // Get max sort_order for this project
  const { data: lastTask } = await supabase
    .from('project_tasks')
    .select('sort_order')
    .eq('project_id', projectId)
    .order('sort_order', { ascending: false })
    .limit(1)
    .single();

  const nextOrder = (lastTask?.sort_order ?? -1) + 1;

  const { data: task, error } = await supabase
    .from('project_tasks')
    .insert({
      project_id: projectId,
      name: data.name,
      notes: data.notes || '',
      status: data.status || 'todo',
      assignees: data.assignees || [],
      due_date: data.due_date || null,
      sort_order: nextOrder,
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to create task: ${error.message}`);
  return task;
}

export async function updateTask(taskId: string, data: Partial<ProjectTask>): Promise<ProjectTask> {
  const supabase = getSupabaseAdmin();

  const updates: Record<string, unknown> = {};
  if (data.name !== undefined) updates.name = data.name;
  if (data.notes !== undefined) updates.notes = data.notes;
  if (data.status !== undefined) updates.status = data.status;
  if (data.assignees !== undefined) updates.assignees = data.assignees;
  if (data.due_date !== undefined) updates.due_date = data.due_date;
  if (data.sort_order !== undefined) updates.sort_order = data.sort_order;
  updates.updated_at = new Date().toISOString();

  const { data: task, error } = await supabase
    .from('project_tasks')
    .update(updates)
    .eq('id', taskId)
    .select()
    .single();

  if (error) throw new Error(`Failed to update task: ${error.message}`);
  return task;
}

export async function deleteTask(taskId: string): Promise<void> {
  const supabase = getSupabaseAdmin();

  const { error } = await supabase
    .from('project_tasks')
    .delete()
    .eq('id', taskId);

  if (error) throw new Error(`Failed to delete task: ${error.message}`);
}

export async function reorderTasks(taskIds: string[]): Promise<void> {
  const supabase = getSupabaseAdmin();

  // Batch update sort_order for each task
  const updates = taskIds.map((id, index) =>
    supabase
      .from('project_tasks')
      .update({ sort_order: index, updated_at: new Date().toISOString() })
      .eq('id', id)
  );

  const results = await Promise.all(updates);
  const failed = results.find(r => r.error);
  if (failed?.error) throw new Error(`Failed to reorder tasks: ${failed.error.message}`);
}
