'use client';

import type { ProjectTask } from '@/lib/types/project';
import { useProjectStore } from '@/hooks/useProjectStore';
import TaskRow from './TaskRow';
import TaskForm from './TaskForm';

interface TaskListProps {
  projectId: string;
  tasks: ProjectTask[];
}

export default function TaskList({ projectId, tasks }: TaskListProps) {
  const { toggleTaskStatus, updateTask, deleteTask, createTask } = useProjectStore();

  const handleAddTask = async (name: string) => {
    await createTask(projectId, { name });
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-[#A1A1AA] uppercase tracking-wider">
          Tasks
        </h3>
        <span className="text-xs text-[#52525B]">
          {tasks.filter((t) => t.status === 'done').length}/{tasks.length} done
        </span>
      </div>

      {/* Task rows */}
      <div className="rounded-lg border border-white/[0.06] overflow-hidden">
        {tasks.length === 0 && (
          <div className="px-3 py-4 text-center text-xs text-[#3F3F46]">
            No tasks yet
          </div>
        )}
        {tasks.map((task) => (
          <TaskRow
            key={task.id}
            task={task}
            onToggleStatus={() => toggleTaskStatus(projectId, task.id)}
            onUpdate={(data) => updateTask(projectId, task.id, data)}
            onDelete={() => deleteTask(projectId, task.id)}
          />
        ))}
        <TaskForm onSubmit={handleAddTask} />
      </div>
    </div>
  );
}
