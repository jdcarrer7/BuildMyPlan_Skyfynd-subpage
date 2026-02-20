'use client';

import type { ProjectTask } from '@/lib/types/project';

interface ProjectTimelineProps {
  tasks: ProjectTask[];
  projectDueDate: string | null;
}

const statusColors: Record<string, string> = {
  done: '#10B981',
  in_progress: '#F59E0B',
  todo: '#EF4444',
};

export default function ProjectTimeline({ tasks, projectDueDate }: ProjectTimelineProps) {
  const tasksWithDates = tasks.filter((t) => t.due_date);
  if (tasksWithDates.length === 0 && !projectDueDate) {
    return (
      <div className="text-[#52525B] text-xs italic py-4">
        Add due dates to tasks to see the timeline
      </div>
    );
  }

  // Compute date range
  const allDates = tasksWithDates.map((t) => new Date(t.due_date!).getTime());
  if (projectDueDate) allDates.push(new Date(projectDueDate).getTime());
  const today = Date.now();
  allDates.push(today);

  const minDate = Math.min(...allDates);
  const maxDate = Math.max(...allDates);
  const range = maxDate - minDate || 1;

  const getPosition = (dateStr: string) => {
    const d = new Date(dateStr).getTime();
    return ((d - minDate) / range) * 100;
  };

  const todayPos = ((today - minDate) / range) * 100;

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="w-full">
      {/* Timeline bar */}
      <div className="relative h-8 mb-2">
        {/* Track */}
        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-1 bg-white/[0.06] rounded-full" />

        {/* Today marker */}
        <div
          className="absolute top-0 bottom-0 w-px bg-[#3B82F6]"
          style={{ left: `${todayPos}%` }}
        >
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 text-[9px] text-[#3B82F6] font-medium whitespace-nowrap">
            Today
          </div>
        </div>

        {/* Task dots */}
        {tasksWithDates.map((task) => {
          const pos = getPosition(task.due_date!);
          return (
            <div
              key={task.id}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 group"
              style={{ left: `${pos}%` }}
            >
              <div
                className="w-3 h-3 rounded-full border-2 border-[#111113]"
                style={{ backgroundColor: statusColors[task.status] || '#71717A' }}
              />
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                <div className="bg-[#1C1C1E] border border-white/[0.08] rounded-md px-2 py-1 text-[10px] text-[#A1A1AA] whitespace-nowrap shadow-lg">
                  {task.name} — {formatDate(task.due_date!)}
                </div>
              </div>
            </div>
          );
        })}

        {/* Project due date marker */}
        {projectDueDate && (
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
            style={{ left: `${getPosition(projectDueDate)}%` }}
          >
            <div className="w-3.5 h-3.5 rounded-sm bg-[#EF4444] border-2 border-[#111113] rotate-45" />
          </div>
        )}
      </div>

      {/* Date labels */}
      <div className="flex justify-between text-[10px] text-[#52525B]">
        <span>{formatDate(new Date(minDate).toISOString())}</span>
        <span>{formatDate(new Date(maxDate).toISOString())}</span>
      </div>
    </div>
  );
}
