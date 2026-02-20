'use client';

import { useCallback, useRef, useEffect } from 'react';
import { usePersistedState } from './usePersistedState';

interface UseResizableOptions {
  storageKey: string;
  defaultWidth: number;
  minWidth: number;
  maxWidth: number;
  /** 'left' means dragging right grows the panel (default). 'right' means dragging left grows it. */
  direction?: 'left' | 'right';
}

export function useResizable({ storageKey, defaultWidth, minWidth, maxWidth, direction = 'left' }: UseResizableOptions) {
  const [width, setWidth] = usePersistedState(storageKey, defaultWidth);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(0);

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      isDragging.current = true;
      startX.current = e.clientX;
      startWidth.current = width;
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    },
    [width],
  );

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const delta = e.clientX - startX.current;
      const newWidth = direction === 'left'
        ? startWidth.current + delta
        : startWidth.current - delta;
      setWidth(Math.min(maxWidth, Math.max(minWidth, newWidth)));
    };

    const onMouseUp = () => {
      if (!isDragging.current) return;
      isDragging.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [direction, minWidth, maxWidth, setWidth]);

  return { width, onMouseDown };
}
