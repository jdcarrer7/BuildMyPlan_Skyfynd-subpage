'use client';

import { useEffect, useRef } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase/browser-client';
import { useProjectStore } from '@/hooks/useProjectStore';
import { useAdminStore } from '@/hooks/useAdminStore';

const DEBOUNCE_MS = 500;

export function useRealtimeSync() {
  const session = useAdminStore((s) => s.session);
  const fetchProjects = useProjectStore((s) => s.fetchProjects);
  const selectProject = useProjectStore((s) => s.selectProject);
  const selectedProjectId = useProjectStore((s) => s.selectedProjectId);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const selectedIdRef = useRef(selectedProjectId);

  useEffect(() => {
    selectedIdRef.current = selectedProjectId;
  }, [selectedProjectId]);

  useEffect(() => {
    if (!session?.isLoggedIn) return;

    const supabase = getSupabaseBrowserClient();

    const debouncedRefetch = () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        fetchProjects();
        if (selectedIdRef.current) {
          selectProject(selectedIdRef.current);
        }
      }, DEBOUNCE_MS);
    };

    const channel = supabase
      .channel('admin-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, () => {
        debouncedRefetch();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'project_tasks' }, () => {
        debouncedRefetch();
      })
      .subscribe();

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      supabase.removeChannel(channel);
    };
  }, [session?.isLoggedIn, fetchProjects, selectProject]);
}
