'use client';

import { Suspense, useEffect, useCallback } from 'react';
import { useAdminStore } from '@/hooks/useAdminStore';
import { useProjectStore } from '@/hooks/useProjectStore';
import { usePersistedState } from '@/hooks/usePersistedState';
import { usePresence } from '@/hooks/usePresence';
import { useRealtimeSync } from '@/hooks/useRealtimeSync';
import AdminLogin from '@/components/admin/AdminLogin';
import AdminLayout from '@/components/admin/AdminLayout';
import PresenceBubbles from '@/components/admin/PresenceBubbles';
import SubpageSidebar from '@/components/admin/projects/SubpageSidebar';
import ProjectDetail from '@/components/admin/projects/ProjectDetail';
import ProjectMetricsSidebar from '@/components/admin/projects/ProjectMetricsSidebar';
import ProjectsTable from '@/components/admin/projects/ProjectsTable';
import TasksTable from '@/components/admin/projects/TasksTable';
import NotesPage from '@/components/admin/projects/NotesPage';
import ProjectTrashBin from '@/components/admin/projects/ProjectTrashBin';
import { ArrowLeft, Loader2 } from 'lucide-react';

function ProjectsContent() {
  const { session, sessionLoading, checkSession } = useAdminStore();
  const { selectedProjectId, fetchProjects, projectsLoading, clearSelectedProject } = useProjectStore();
  const [activeSubpage, setActiveSubpage] = usePersistedState('projects-active-subpage', 'table');

  // Realtime: presence + data sync
  const { onlineUsers, setEditing, setPage } = usePresence();
  useRealtimeSync();

  // Check session on mount
  useEffect(() => {
    checkSession();
  }, [checkSession]);

  // Fetch projects after login
  useEffect(() => {
    if (!session?.isLoggedIn) return;
    fetchProjects();
  }, [session?.isLoggedIn, fetchProjects]);

  // Track current page in presence
  useEffect(() => {
    setPage('projects');
  }, [setPage]);

  const onEditStart = useCallback(
    (cellId: string, label: string) => setEditing(cellId, label),
    [setEditing],
  );
  const onEditEnd = useCallback(() => setEditing(null), [setEditing]);

  if (sessionLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-[#3B82F6] animate-spin" />
      </div>
    );
  }

  if (!session?.isLoggedIn) {
    return <AdminLogin />;
  }

  // Only show metrics sidebar on the table subpage
  const showMetrics = activeSubpage === 'table';
  const currentUserEmail = session.email;

  return (
    <AdminLayout
      sidebarContent={
        <SubpageSidebar
          activeId={activeSubpage}
          onSelect={(id) => {
            setActiveSubpage(id);
            if (selectedProjectId) clearSelectedProject();
          }}
        />
      }
      metricsContent={showMetrics ? <ProjectMetricsSidebar /> : null}
      presenceBubbles={<PresenceBubbles onlineUsers={onlineUsers} />}
    >
      {activeSubpage === 'table' ? (
        /* Table subpage */
        projectsLoading && !selectedProjectId ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-6 h-6 text-[#3B82F6] animate-spin" />
          </div>
        ) : selectedProjectId ? (
          <div>
            <button
              onClick={clearSelectedProject}
              className="flex items-center gap-1.5 text-xs text-[#52525B] hover:text-[#A1A1AA] transition-colors mb-4"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to tables
            </button>
            <ProjectDetail />
          </div>
        ) : (
          <div>
            <ProjectsTable
              onlineUsers={onlineUsers}
              currentUserEmail={currentUserEmail}
              onEditStart={onEditStart}
              onEditEnd={onEditEnd}
            />
            <TasksTable
              onlineUsers={onlineUsers}
              currentUserEmail={currentUserEmail}
              onEditStart={onEditStart}
              onEditEnd={onEditEnd}
            />
          </div>
        )
      ) : activeSubpage === 'notes' ? (
        /* Notes subpage */
        <NotesPage />
      ) : (
        /* Custom subpage placeholder */
        <div className="flex items-center justify-center py-24">
          <p className="text-[14px] text-[#3F3F46]">This page is empty — coming soon</p>
        </div>
      )}
      <ProjectTrashBin />
    </AdminLayout>
  );
}

export default function AdminProjectsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-[#3B82F6] animate-spin" />
        </div>
      }
    >
      <ProjectsContent />
    </Suspense>
  );
}
