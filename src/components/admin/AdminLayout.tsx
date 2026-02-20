'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { GripHorizontal, LogOut } from 'lucide-react';
import { useAdminStore } from '@/hooks/useAdminStore';
import { useResizable } from '@/hooks/useResizable';
import { usePersistedState } from '@/hooks/usePersistedState';
import { SidebarProvider } from '@/hooks/useSidebarContext';
import CustomerDropdown from './CustomerDropdown';
import MetricsSidebar from './MetricsSidebar';
import AdminNav from './AdminNav';

const LOGO_URL = 'https://f005.backblazeb2.com/file/SKYFYND-assets/Skyfynd+logo.png';

type DockPosition = 'left' | 'right' | 'float';

interface AdminLayoutProps {
  children: React.ReactNode;
  sidebarContent?: React.ReactNode;
  metricsContent?: React.ReactNode;
  presenceBubbles?: React.ReactNode;
}

function ResizeHandle({ onMouseDown }: { onMouseDown: (e: React.MouseEvent) => void }) {
  return (
    <div
      onMouseDown={onMouseDown}
      className="w-1 flex-shrink-0 cursor-col-resize group relative hover:bg-[#3B82F6]/40 transition-colors"
    >
      <div className="absolute inset-y-0 -left-1 -right-1" />
    </div>
  );
}

/* ── Snap zone overlay shown while dragging ── */
function SnapIndicator({ side, active }: { side: 'left' | 'right'; active: boolean }) {
  return (
    <div
      className={`fixed top-0 bottom-0 w-[6px] z-[60] transition-all duration-150 pointer-events-none ${
        side === 'left' ? 'left-[320px]' : 'right-0'
      } ${active ? 'bg-[#3B82F6]/60 shadow-[0_0_20px_4px_rgba(59,130,246,0.3)]' : 'bg-[#3B82F6]/15'}`}
    />
  );
}

/* ── Dockable metrics panel ── */
function DockableMetrics({
  children,
  dock,
  setDock,
  floatPos,
  setFloatPos,
  panelWidth,
}: {
  children: React.ReactNode;
  dock: DockPosition;
  setDock: (d: DockPosition) => void;
  floatPos: { x: number; y: number };
  setFloatPos: (p: { x: number; y: number }) => void;
  panelWidth: number;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });
  const [snapTarget, setSnapTarget] = useState<'left' | 'right' | null>(null);
  const startMouse = useRef({ x: 0, y: 0 });
  const startPos = useRef({ x: 0, y: 0 });
  const panelRef = useRef<HTMLDivElement>(null);

  const SNAP_THRESHOLD = 80;

  const onDragStart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsDragging(true);

      // Calculate starting position based on current dock
      let startX: number, startY: number;
      if (dock === 'float') {
        startX = floatPos.x;
        startY = floatPos.y;
      } else if (panelRef.current) {
        const rect = panelRef.current.getBoundingClientRect();
        startX = rect.left;
        startY = rect.top;
      } else {
        startX = e.clientX - 100;
        startY = e.clientY - 15;
      }

      startMouse.current = { x: e.clientX, y: e.clientY };
      startPos.current = { x: startX, y: startY };
      setDragPos({ x: startX, y: startY });
      document.body.style.cursor = 'grabbing';
      document.body.style.userSelect = 'none';
    },
    [dock, floatPos],
  );

  useEffect(() => {
    if (!isDragging) return;

    const onMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - startMouse.current.x;
      const dy = e.clientY - startMouse.current.y;
      const newX = startPos.current.x + dx;
      const newY = Math.max(0, startPos.current.y + dy);
      setDragPos({ x: newX, y: newY });

      // Detect snap zones
      const vw = window.innerWidth;
      if (e.clientX < 320 + SNAP_THRESHOLD) {
        setSnapTarget('left');
      } else if (e.clientX > vw - SNAP_THRESHOLD) {
        setSnapTarget('right');
      } else {
        setSnapTarget(null);
      }
    };

    const onMouseUp = (e: MouseEvent) => {
      setIsDragging(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';

      const vw = window.innerWidth;
      if (e.clientX < 320 + SNAP_THRESHOLD) {
        setDock('left');
      } else if (e.clientX > vw - SNAP_THRESHOLD) {
        setDock('right');
      } else {
        setDock('float');
        setFloatPos({
          x: Math.max(0, Math.min(dragPos.x, vw - panelWidth)),
          y: Math.max(0, dragPos.y),
        });
      }
      setSnapTarget(null);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [isDragging, dragPos, panelWidth, setDock, setFloatPos]);

  // Drag handle header
  const header = (
    <div
      onMouseDown={onDragStart}
      className="flex items-center gap-2 px-3 py-2 border-b border-white/[0.06] cursor-grab active:cursor-grabbing select-none flex-shrink-0"
    >
      <GripHorizontal className="w-3.5 h-3.5 text-[#3F3F46]" />
      <span className="text-[10px] font-bold uppercase tracking-widest text-[#52525B]">
        Overview
      </span>
    </div>
  );

  // While dragging: show floating ghost + snap indicators
  if (isDragging) {
    return (
      <>
        <SnapIndicator side="left" active={snapTarget === 'left'} />
        <SnapIndicator side="right" active={snapTarget === 'right'} />
        {/* Dragging ghost */}
        <div
          className="fixed z-[55] bg-[#111113] border border-[#3B82F6]/40 rounded-xl shadow-2xl opacity-90 overflow-hidden"
          style={{ left: dragPos.x, top: dragPos.y, width: panelWidth, maxHeight: '80vh' }}
        >
          {header}
          <div className="overflow-y-auto max-h-[70vh]">{children}</div>
        </div>
      </>
    );
  }

  // Docked: rendered inline in the flex layout (parent handles positioning)
  if (dock !== 'float') {
    return (
      <div
        ref={panelRef}
        className="bg-[#111113] border-l border-white/[0.06] flex flex-col h-screen sticky top-0 overflow-hidden flex-shrink-0"
        style={{ width: panelWidth }}
      >
        {header}
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    );
  }

  // Floating
  return (
    <div
      ref={panelRef}
      className="fixed z-50 bg-[#111113] border border-white/[0.1] rounded-xl shadow-2xl overflow-hidden"
      style={{ left: floatPos.x, top: floatPos.y, width: panelWidth, maxHeight: '85vh' }}
    >
      {header}
      <div className="overflow-y-auto" style={{ maxHeight: 'calc(85vh - 36px)' }}>
        {children}
      </div>
    </div>
  );
}

/* ── Main Layout ── */

export default function AdminLayout({ children, sidebarContent, metricsContent, presenceBubbles }: AdminLayoutProps) {
  const { session, logout } = useAdminStore();

  const sidebar = useResizable({
    storageKey: 'admin-sidebar-width',
    defaultWidth: 320,
    minWidth: 160,
    maxWidth: 480,
  });

  const sidebarCtx = useMemo(
    () => ({ width: sidebar.width, isCompact: sidebar.width < 240 }),
    [sidebar.width],
  );

  const metricsPanel = useResizable({
    storageKey: 'admin-metrics-width',
    defaultWidth: 260,
    minWidth: 200,
    maxWidth: 400,
    direction: 'right',
  });

  const [metricsDock, setMetricsDock] = usePersistedState<DockPosition>('admin-metrics-dock', 'right');
  const [metricsFloatPos, setMetricsFloatPos] = usePersistedState('admin-metrics-float-pos', { x: 900, y: 60 });

  const metricsNode = metricsContent !== undefined ? metricsContent : <MetricsSidebar />;
  const hasMetrics = metricsNode !== null;

  const dockedPanel = hasMetrics ? (
    <DockableMetrics
      dock={metricsDock}
      setDock={setMetricsDock}
      floatPos={metricsFloatPos}
      setFloatPos={setMetricsFloatPos}
      panelWidth={metricsPanel.width}
    >
      {metricsNode}
    </DockableMetrics>
  ) : null;

  return (
    <div className="min-h-screen bg-[#0A0A0B] flex">
      {/* Sidebar */}
      <SidebarProvider value={sidebarCtx}>
        <aside
          className="bg-[#111113] border-r border-white/[0.06] flex flex-col h-screen sticky top-0 flex-shrink-0"
          style={{ width: sidebar.width }}
        >
          <div className={`border-b border-white/[0.06] ${sidebarCtx.isCompact ? 'px-2.5 py-3' : 'p-4'}`}>
            <div className="flex items-center justify-between gap-1">
              <div className="flex items-center gap-1.5 min-w-0">
                <img src={LOGO_URL} alt="Skyfynd" className={`${sidebarCtx.isCompact ? 'w-6 h-6' : 'w-7 h-7'} object-contain flex-shrink-0`} />
                {!sidebarCtx.isCompact && (
                  <h1 className="text-[24px] font-semibold text-white truncate" style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif", letterSpacing: '-0.5px' }}>
                    Skyfynd
                  </h1>
                )}
              </div>
              <button
                onClick={logout}
                className={`flex-shrink-0 text-[#A1A1AA] hover:text-white transition-colors rounded border border-white/[0.06] hover:border-white/[0.15] ${
                  sidebarCtx.isCompact ? 'p-1.5' : 'text-xs px-2 py-1'
                }`}
                title="Logout"
              >
                {sidebarCtx.isCompact ? <LogOut className="w-3.5 h-3.5" /> : 'Logout'}
              </button>
            </div>
          </div>

          <AdminNav />

          <div className="flex-1 overflow-y-auto">
            {sidebarContent ?? <CustomerDropdown />}
          </div>

          <div className={`${sidebarCtx.isCompact ? 'px-2.5' : 'px-4'} py-3 border-t border-white/[0.06]`}>
            <p className="text-[11px] text-[#52525B] truncate">
              {sidebarCtx.isCompact ? session?.email : <>{session?.name} &middot; {session?.email}</>}
            </p>
          </div>
        </aside>
      </SidebarProvider>

      {/* Sidebar resize handle */}
      <ResizeHandle onMouseDown={sidebar.onMouseDown} />

      {/* Docked LEFT: metrics panel + resize handle */}
      {hasMetrics && metricsDock === 'left' && (
        <>
          {dockedPanel}
          <ResizeHandle onMouseDown={metricsPanel.onMouseDown} />
        </>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 min-w-0 relative">
        {presenceBubbles && (
          <div className="absolute top-3 right-6 z-30">{presenceBubbles}</div>
        )}
        {children}
      </main>

      {/* Docked RIGHT: resize handle + metrics panel */}
      {hasMetrics && metricsDock === 'right' && (
        <>
          <ResizeHandle onMouseDown={metricsPanel.onMouseDown} />
          {dockedPanel}
        </>
      )}

      {/* Floating: rendered by DockableMetrics as position:fixed */}
      {hasMetrics && metricsDock === 'float' && dockedPanel}
    </div>
  );
}
