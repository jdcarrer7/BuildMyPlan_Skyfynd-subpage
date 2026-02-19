'use client';

import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, BarChart3 } from 'lucide-react';
import { useProjectStore } from '@/hooks/useProjectStore';
import DonutChart from './DonutChart';

export default function ProjectMetricsSidebar() {
  const { projects, allTasks } = useProjectStore();
  const [isCollapsed, setIsCollapsed] = useState(false);

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

  // Collapsed state
  if (isCollapsed) {
    return (
      <div className="w-10 bg-[#111113] border-l border-white/[0.06] flex flex-col items-center py-4 h-screen sticky top-0">
        <button
          onClick={() => setIsCollapsed(false)}
          className="p-1.5 rounded-md text-[#52525B] hover:text-[#A1A1AA] hover:bg-white/[0.04] transition-colors mb-4"
          title="Expand metrics"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <BarChart3 className="w-4 h-4 text-[#3F3F46]" />
      </div>
    );
  }

  return (
    <div className="w-[250px] bg-[#111113] border-l border-white/[0.06] flex flex-col h-screen sticky top-0 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#52525B]">
          Overview
        </span>
        <button
          onClick={() => setIsCollapsed(true)}
          className="p-1 rounded text-[#52525B] hover:text-[#A1A1AA] transition-colors"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="p-4 space-y-8 flex-1">
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
              size={150}
              strokeWidth={14}
            />
          </div>
          {/* Legend */}
          <div className="mt-4 space-y-2">
            <LegendRow color="#10B981" label="Done" value={projectMetrics.completed} />
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
              size={150}
              strokeWidth={14}
            />
          </div>
          {/* Legend */}
          <div className="mt-4 space-y-2">
            <LegendRow color="#10B981" label="Done" value={taskMetrics.done} />
            <LegendRow color="#F59E0B" label="In Progress" value={taskMetrics.inProgress} />
            <LegendRow color="rgba(255,255,255,0.1)" label="To Do" value={taskMetrics.todo} />
          </div>
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
