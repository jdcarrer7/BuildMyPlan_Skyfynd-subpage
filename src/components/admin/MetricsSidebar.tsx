'use client';

import { useMemo, useState } from 'react';
import { FileText, Rocket, CheckCircle2, TrendingUp, LinkIcon, ChevronLeft, ChevronRight, BarChart3 } from 'lucide-react';
import { useAdminStore } from '@/hooks/useAdminStore';

export default function MetricsSidebar() {
  const { quotes, portals } = useAdminStore();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const filteredQuotes = useMemo(
    () => quotes.filter(q => !q.isTrashed),
    [quotes]
  );

  const metrics = useMemo(() => {
    const quotesReceived = filteredQuotes.length;
    const inProgress = filteredQuotes.filter(q => q.isCustomer && q.serviceStarted && !q.serviceEnded).length;
    const completed = filteredQuotes.filter(q => q.isCustomer && q.serviceEnded).length;
    const totalRevenue = filteredQuotes.reduce((sum, q) => sum + q.grandTotal, 0);

    const portalsSent = portals.length;
    const portalsSigned = portals.filter(p => p.status === 'contract_signed' || p.status === 'payment_completed' || p.status === 'project_completed').length;
    const portalsDepositPaid = portals.filter(p => (p.status === 'payment_completed' || p.status === 'project_completed') && !p.finalPayment).length;
    const portalsFullyPaid = portals.filter(p => p.finalPayment !== null).length;
    const pendingChanges = portals.filter(p => p.pending_changes.length > 0).length;

    return { quotesReceived, inProgress, completed, totalRevenue, portalsSent, portalsSigned, portalsDepositPaid, portalsFullyPaid, pendingChanges };
  }, [filteredQuotes, portals]);

  if (quotes.length === 0) return null;

  const conversionPercent = metrics.quotesReceived > 0
    ? Math.round((metrics.completed / metrics.quotesReceived) * 100)
    : 0;

  const cards = [
    { label: 'Quotes', value: metrics.quotesReceived, icon: <FileText className="w-4 h-4" />, color: '#60A5FA', bg: 'rgba(59,130,246,0.1)' },
    { label: 'In Progress', value: metrics.inProgress, icon: <Rocket className="w-4 h-4" />, color: '#FBBF24', bg: 'rgba(251,191,36,0.1)' },
    { label: 'Completed', value: metrics.completed, icon: <CheckCircle2 className="w-4 h-4" />, color: '#34D399', bg: 'rgba(16,185,129,0.1)' },
    { label: 'Est. Revenue', value: metrics.totalRevenue, icon: <TrendingUp className="w-4 h-4" />, color: '#F97316', bg: 'rgba(249,115,22,0.1)' },
  ];

  const pipelineStages = [
    {
      label: 'Received',
      value: metrics.quotesReceived,
      color: '#60A5FA',
      gradient: 'linear-gradient(90deg, #3B82F6, #60A5FA)',
      width: '100%',
    },
    {
      label: 'In Progress',
      value: metrics.inProgress,
      color: '#FBBF24',
      gradient: metrics.inProgress > 0 ? 'linear-gradient(90deg, #F59E0B, #FBBF24)' : 'transparent',
      width: metrics.quotesReceived > 0 ? `${Math.max(4, (metrics.inProgress / metrics.quotesReceived) * 100)}%` : '0%',
    },
    {
      label: 'Completed',
      value: metrics.completed,
      color: '#34D399',
      gradient: metrics.completed > 0 ? 'linear-gradient(90deg, #10B981, #34D399)' : 'transparent',
      width: metrics.quotesReceived > 0 ? `${Math.max(4, (metrics.completed / metrics.quotesReceived) * 100)}%` : '0%',
    },
  ];

  const portalStages = [
    { label: 'Sent', value: metrics.portalsSent, dotColor: '#8B5CF6' },
    { label: 'Signed', value: metrics.portalsSigned, dotColor: '#22C55E' },
    { label: 'Deposit', value: metrics.portalsDepositPaid, dotColor: '#F59E0B' },
    { label: 'Fully Paid', value: metrics.portalsFullyPaid, dotColor: '#10B981' },
  ];

  return (
    <aside
      className="h-screen sticky top-0 flex flex-col border-r border-white/[0.06] bg-[#111113] overflow-hidden shrink-0"
      style={{
        width: isCollapsed ? '40px' : '250px',
        minWidth: isCollapsed ? '40px' : '250px',
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1), min-width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {/* Collapsed state */}
      {isCollapsed ? (
        <button
          onClick={() => setIsCollapsed(false)}
          className="w-full h-full flex flex-col items-center pt-4 gap-3 hover:bg-white/[0.04] transition-colors"
        >
          <BarChart3 className="w-4 h-4 text-[#71717A]" />
          <ChevronRight className="w-3 h-3 text-[#52525B]" />
        </button>
      ) : (
        <div
          className="flex flex-col h-full"
          style={{
            opacity: isCollapsed ? 0 : 1,
            transition: 'opacity 0.15s ease',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-3 py-3 border-b border-white/[0.06]">
            <span className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider">Pipeline</span>
            <button
              onClick={() => setIsCollapsed(true)}
              className="p-1 rounded hover:bg-white/[0.06] text-[#71717A] hover:text-white transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto">
            {/* Metric Cards */}
            <div className="p-3 space-y-1.5">
              {cards.map(card => (
                <div
                  key={card.label}
                  className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg"
                  style={{ background: card.bg }}
                >
                  <div
                    className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
                    style={{ color: card.color }}
                  >
                    {card.icon}
                  </div>
                  <div className="flex-1 min-w-0 flex items-center justify-between">
                    <span className="text-xs text-[#71717A] truncate">{card.label}</span>
                    <span className="text-sm font-bold text-white tabular-nums" style={{ letterSpacing: '-0.3px' }}>
                      {card.label === 'Est. Revenue' ? `$${card.value.toLocaleString()}` : card.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Project Pipeline */}
            <div className="px-3 pb-3 pt-1">
              <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider">Project</span>
                  <span className="text-xs text-[#52525B]">{conversionPercent}% conv.</span>
                </div>

                <div className="space-y-3 relative">
                  {/* Vertical connector line */}
                  <div className="absolute left-[10px] top-[14px] bottom-[14px] w-px bg-white/[0.06]" />

                  {pipelineStages.map((stage) => (
                    <div key={stage.label} className="flex items-center gap-2.5 relative z-10">
                      <div
                        className="w-[20px] h-[20px] rounded-full flex items-center justify-center shrink-0"
                        style={{ background: `${stage.color}15` }}
                      >
                        <div className="w-2 h-2 rounded-full" style={{ background: stage.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium" style={{ color: stage.color }}>{stage.label}</span>
                          <span className="text-xs text-[#52525B] font-semibold tabular-nums">{stage.value}</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{ width: stage.width, background: stage.gradient }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Portal Pipeline */}
            {metrics.portalsSent > 0 && (
              <div className="px-3 pb-3">
                <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider flex items-center gap-1.5">
                      <LinkIcon className="w-3.5 h-3.5" />
                      Portal
                    </span>
                    {metrics.pendingChanges > 0 && (
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-[#F59E0B]/10 text-[#F59E0B]">
                        {metrics.pendingChanges} req.
                      </span>
                    )}
                  </div>

                  <div className="space-y-2.5">
                    {portalStages.map(stage => (
                      <div key={stage.label} className="flex items-center gap-2.5">
                        <div className="w-2 h-2 rounded-full shrink-0" style={{ background: stage.dotColor }} />
                        <span className="text-xs text-[#A1A1AA] flex-1">{stage.label}</span>
                        <span className="text-xs text-white font-semibold tabular-nums">{stage.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </aside>
  );
}
