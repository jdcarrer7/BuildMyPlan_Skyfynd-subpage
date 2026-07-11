'use client';

import { useMemo } from 'react';
import { useProjectStore } from '@/hooks/useProjectStore';
import DonutChart from './DonutChart';

export default function ProjectMetricsSidebar() {
  const { projects, allTasks } = useProjectStore();

  const projectMetrics = useMemo(() => {
    const total = projects.length;
    const completed = projects.filter((p) => p.status === 'done').length;
    const inProgress = projects.filter((p) => p.status === 'in_progress').length;
    const notStarted = total - completed - inProgress;
    return { total, completed, inProgress, notStarted };
  }, [projects]);

  const taskMetrics = useMemo(() => {
    const total = allTasks.length;
    const done = allTasks.filter((t) => t.status === 'done').length;
    const inProgress = allTasks.filter((t) => t.status === 'in_progress').length;
    const todo = total - done - inProgress;
    return { total, done, inProgress, todo };
  }, [allTasks]);

  if (projects.length === 0) return null;

  return (
    <div className="p-4 space-y-6">
      {/* Projects Donut */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#52525B] mb-4 text-center">
          Project Completion
        </p>
        <div className="flex justify-center">
          <DonutChart
            completed={projectMetrics.completed}
            inProgress={projectMetrics.inProgress}
            total={projectMetrics.total}
            size={130}
            strokeWidth={12}
          />
        </div>
        <div className="mt-3 space-y-1.5">
          <LegendRow color="var(--accent-blue)" label="Done" value={projectMetrics.completed} />
          <LegendRow color="#F59E0B" label="In Progress" value={projectMetrics.inProgress} />
          <LegendRow color="rgba(255,255,255,0.1)" label="Not Started" value={projectMetrics.notStarted} />
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-white/[0.06]" />

      {/* Tasks Donut */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#52525B] mb-4 text-center">
          Task Breakdown
        </p>
        <div className="flex justify-center">
          <DonutChart
            completed={taskMetrics.done}
            inProgress={taskMetrics.inProgress}
            total={taskMetrics.total}
            size={130}
            strokeWidth={12}
          />
        </div>
        <div className="mt-3 space-y-1.5">
          <LegendRow color="var(--accent-blue)" label="Done" value={taskMetrics.done} />
          <LegendRow color="#F59E0B" label="In Progress" value={taskMetrics.inProgress} />
          <LegendRow color="#EF4444" label="Not Started" value={taskMetrics.todo} />
        </div>
      </div>
    </div>
  );
}

function LegendRow({ color, label, value }: { color: string; label: string; value: number }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
        <span className="text-[11px] text-[#A1A1AA]">{label}</span>
      </div>
      <span className="text-[11px] font-semibold text-[#FAFAFA]">{value}</span>
    </div>
  );
}
