'use client';

import { useCallback, useRef, useEffect } from 'react';
import { usePersistedState } from './usePersistedState';

interface UseResizableColumnsOptions {
  storageKey: string;
  /** Default widths per column key (px). Omitted columns won't be resizable. */
  defaults: Record<string, number>;
  minWidth?: number;
  maxWidth?: number;
}

export function useResizableColumns({
  storageKey,
  defaults,
  minWidth = 60,
  maxWidth = 600,
}: UseResizableColumnsOptions) {
  const [widths, setWidths] = usePersistedState<Record<string, number>>(storageKey, defaults);
  const dragging = useRef<{ col: string; startX: number; startW: number } | null>(null);

  const getWidth = useCallback(
    (col: string) => widths[col] ?? defaults[col] ?? 120,
    [widths, defaults],
  );

  const onResizeStart = useCallback(
    (col: string, e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dragging.current = { col, startX: e.clientX, startW: getWidth(col) };
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    },
    [getWidth],
  );

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      const { col, startX, startW } = dragging.current;
      const delta = e.clientX - startX;
      const newW = Math.min(maxWidth, Math.max(minWidth, startW + delta));
      setWidths((prev) => ({ ...prev, [col]: newW }));
    };

    const onMouseUp = () => {
      if (!dragging.current) return;
      dragging.current = null;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [minWidth, maxWidth, setWidths]);

  return { getWidth, onResizeStart };
}
