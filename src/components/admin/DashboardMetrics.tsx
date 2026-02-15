'use client';

import { useMemo } from 'react';
import { FileText, Rocket, CheckCircle2, TrendingUp, ArrowRight } from 'lucide-react';
import type { MasterLeadRow } from '@/lib/types/admin';

interface Props {
  quotes: MasterLeadRow[];
}

interface MetricCard {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  bgGlow: string;
  borderColor: string;
}

export default function DashboardMetrics({ quotes }: Props) {
  const metrics = useMemo(() => {
    const quotesReceived = quotes.length;
    const inProgress = quotes.filter(q => q.isCustomer && q.serviceStarted && !q.serviceEnded).length;
    const completed = quotes.filter(q => q.isCustomer && q.serviceEnded).length;
    const totalRevenue = quotes.reduce((sum, q) => sum + q.grandTotal, 0);

    return { quotesReceived, inProgress, completed, totalRevenue };
  }, [quotes]);

  const cards: MetricCard[] = [
    {
      label: 'Quotes Received',
      value: metrics.quotesReceived,
      icon: <FileText className="w-4 h-4" />,
      color: '#60A5FA',
      bgGlow: 'rgba(59, 130, 246, 0.1)',
      borderColor: 'rgba(59, 130, 246, 0.2)',
    },
    {
      label: 'In Progress',
      value: metrics.inProgress,
      icon: <Rocket className="w-4 h-4" />,
      color: '#FBBF24',
      bgGlow: 'rgba(251, 191, 36, 0.1)',
      borderColor: 'rgba(251, 191, 36, 0.2)',
    },
    {
      label: 'Completed',
      value: metrics.completed,
      icon: <CheckCircle2 className="w-4 h-4" />,
      color: '#34D399',
      bgGlow: 'rgba(16, 185, 129, 0.1)',
      borderColor: 'rgba(16, 185, 129, 0.2)',
    },
    {
      label: 'Estimated Revenue',
      value: metrics.totalRevenue,
      icon: <TrendingUp className="w-4 h-4" />,
      color: '#F97316',
      bgGlow: 'rgba(249, 115, 22, 0.1)',
      borderColor: 'rgba(249, 115, 22, 0.2)',
    },
  ];

  return (
    <div className="mb-4">
      {/* Metrics Grid */}
      <div className="grid grid-cols-4 gap-2 mb-3">
        {cards.map(card => (
          <div
            key={card.label}
            className="card p-3 relative overflow-hidden"
            style={{ borderColor: card.borderColor }}
          >
            {/* Background glow */}
            <div
              className="absolute inset-0 opacity-50"
              style={{
                background: `radial-gradient(ellipse at top right, ${card.bgGlow}, transparent 70%)`,
              }}
            />

            <div className="relative flex items-center gap-2.5">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: card.bgGlow, color: card.color }}
              >
                {card.icon}
              </div>
              <div className="text-lg font-bold text-white tabular-nums" style={{ letterSpacing: '-0.5px' }}>
                {card.label === 'Estimated Revenue' ? `$${card.value.toLocaleString()}` : card.value}
              </div>
              <div className="text-xs text-[#71717A] whitespace-nowrap">{card.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Pipeline Progress Bar */}
      <div className="card p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-[#A1A1AA] uppercase tracking-wide">Project Pipeline</span>
          <span className="text-xs text-[#52525B]">
            {metrics.completed > 0 ? `${Math.round((metrics.completed / metrics.quotesReceived) * 100)}%` : '0%'} conversion
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Stage: Quotes */}
          <div className="flex-1">
            <div className="h-2 rounded-full overflow-hidden bg-white/[0.04]">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: '100%',
                  background: 'linear-gradient(90deg, #3B82F6, #60A5FA)',
                }}
              />
            </div>
            <div className="flex items-center justify-between mt-1.5">
              <span className="text-xs text-[#60A5FA] font-medium">Received</span>
              <span className="text-xs text-[#52525B]">{metrics.quotesReceived}</span>
            </div>
          </div>

          <ArrowRight className="w-3 h-3 text-[#3F3F46] shrink-0" />

          {/* Stage: In Progress */}
          <div className="flex-1">
            <div className="h-2 rounded-full overflow-hidden bg-white/[0.04]">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: metrics.quotesReceived > 0 ? `${Math.max(4, (metrics.inProgress / metrics.quotesReceived) * 100)}%` : '0%',
                  background: metrics.inProgress > 0 ? 'linear-gradient(90deg, #F59E0B, #FBBF24)' : 'transparent',
                }}
              />
            </div>
            <div className="flex items-center justify-between mt-1.5">
              <span className="text-xs text-[#FBBF24] font-medium">In Progress</span>
              <span className="text-xs text-[#52525B]">{metrics.inProgress}</span>
            </div>
          </div>

          <ArrowRight className="w-3 h-3 text-[#3F3F46] shrink-0" />

          {/* Stage: Completed */}
          <div className="flex-1">
            <div className="h-2 rounded-full overflow-hidden bg-white/[0.04]">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: metrics.quotesReceived > 0 ? `${Math.max(4, (metrics.completed / metrics.quotesReceived) * 100)}%` : '0%',
                  background: metrics.completed > 0 ? 'linear-gradient(90deg, #10B981, #34D399)' : 'transparent',
                }}
              />
            </div>
            <div className="flex items-center justify-between mt-1.5">
              <span className="text-xs text-[#34D399] font-medium">Completed</span>
              <span className="text-xs text-[#52525B]">{metrics.completed}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
