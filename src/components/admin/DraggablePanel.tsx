'use client';

import { useRef, useEffect, useCallback } from 'react';
import { GripHorizontal, Minimize2, Maximize2 } from 'lucide-react';
import { usePersistedState } from '@/hooks/usePersistedState';

interface DraggablePanelProps {
  storageKey: string;
  defaultPosition: { x: number; y: number };
  defaultSize: { width: number; height: number };
  minWidth?: number;
  minHeight?: number;
  children: React.ReactNode;
}

export default function DraggablePanel({
  storageKey,
  defaultPosition,
  defaultSize,
  minWidth = 200,
  minHeight = 200,
  children,
}: DraggablePanelProps) {
  const [pos, setPos] = usePersistedState(`${storageKey}-pos`, defaultPosition);
  const [size, setSize] = usePersistedState(`${storageKey}-size`, defaultSize);
  const [minimized, setMinimized] = usePersistedState(`${storageKey}-min`, false);

  const panelRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const isResizing = useRef(false);
  const startMouse = useRef({ x: 0, y: 0 });
  const startPos = useRef({ x: 0, y: 0 });
  const startSize = useRef({ width: 0, height: 0 });

  // Clamp position to viewport on mount / window resize
  const clampToViewport = useCallback(() => {
    if (!panelRef.current) return;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const w = minimized ? 44 : size.width;
    const h = minimized ? 44 : size.height;
    setPos((prev) => ({
      x: Math.max(0, Math.min(prev.x, vw - w)),
      y: Math.max(0, Math.min(prev.y, vh - h)),
    }));
  }, [minimized, size.width, size.height, setPos]);

  useEffect(() => {
    clampToViewport();
    window.addEventListener('resize', clampToViewport);
    return () => window.removeEventListener('resize', clampToViewport);
  }, [clampToViewport]);

  // Drag handler
  const onDragStart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      isDragging.current = true;
      startMouse.current = { x: e.clientX, y: e.clientY };
      startPos.current = { ...pos };
      document.body.style.cursor = 'grabbing';
      document.body.style.userSelect = 'none';
    },
    [pos],
  );

  // Resize handler
  const onResizeStart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      isResizing.current = true;
      startMouse.current = { x: e.clientX, y: e.clientY };
      startSize.current = { ...size };
      document.body.style.cursor = 'nwse-resize';
      document.body.style.userSelect = 'none';
    },
    [size],
  );

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (isDragging.current) {
        const dx = e.clientX - startMouse.current.x;
        const dy = e.clientY - startMouse.current.y;
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const w = minimized ? 44 : size.width;
        const h = minimized ? 44 : size.height;
        setPos({
          x: Math.max(0, Math.min(startPos.current.x + dx, vw - w)),
          y: Math.max(0, Math.min(startPos.current.y + dy, vh - h)),
        });
      }
      if (isResizing.current) {
        const dx = e.clientX - startMouse.current.x;
        const dy = e.clientY - startMouse.current.y;
        setSize({
          width: Math.max(minWidth, startSize.current.width + dx),
          height: Math.max(minHeight, startSize.current.height + dy),
        });
      }
    };

    const onMouseUp = () => {
      if (isDragging.current) {
        isDragging.current = false;
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      }
      if (isResizing.current) {
        isResizing.current = false;
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      }
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [minimized, size.width, size.height, minWidth, minHeight, setPos, setSize]);

  return (
    <div
      ref={panelRef}
      className="fixed z-50 shadow-2xl"
      style={{
        left: pos.x,
        top: pos.y,
        width: minimized ? 'auto' : size.width,
        height: minimized ? 'auto' : size.height,
      }}
    >
      {minimized ? (
        /* Minimized: small pill */
        <button
          onMouseDown={onDragStart}
          onClick={() => setMinimized(false)}
          className="flex items-center gap-1.5 px-3 py-2 bg-[#1C1C1E] border border-white/[0.1] rounded-xl text-[10px] font-bold uppercase tracking-widest text-[#52525B] hover:text-[#A1A1AA] cursor-grab active:cursor-grabbing shadow-lg transition-colors"
        >
          <Maximize2 className="w-3 h-3" />
          Overview
        </button>
      ) : (
        /* Expanded panel */
        <div className="flex flex-col bg-[#111113] border border-white/[0.1] rounded-xl overflow-hidden h-full">
          {/* Drag handle header */}
          <div
            onMouseDown={onDragStart}
            className="flex items-center justify-between px-3 py-2 border-b border-white/[0.06] cursor-grab active:cursor-grabbing select-none flex-shrink-0"
          >
            <div className="flex items-center gap-2">
              <GripHorizontal className="w-3.5 h-3.5 text-[#3F3F46]" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#52525B]">
                Overview
              </span>
            </div>
            <button
              onClick={() => setMinimized(true)}
              onMouseDown={(e) => e.stopPropagation()}
              className="p-1 rounded text-[#52525B] hover:text-[#A1A1AA] hover:bg-white/[0.04] transition-colors"
              title="Minimize"
            >
              <Minimize2 className="w-3 h-3" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {children}
          </div>

          {/* Resize handle (bottom-right corner) */}
          <div
            onMouseDown={onResizeStart}
            className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize group"
          >
            <svg
              className="w-3 h-3 absolute bottom-1 right-1 text-[#3F3F46] group-hover:text-[#52525B] transition-colors"
              viewBox="0 0 12 12"
              fill="currentColor"
            >
              <circle cx="10" cy="10" r="1.5" />
              <circle cx="6" cy="10" r="1.5" />
              <circle cx="10" cy="6" r="1.5" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}
