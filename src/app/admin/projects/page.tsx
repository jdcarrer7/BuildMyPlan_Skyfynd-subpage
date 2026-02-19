'use client';

import { Suspense, useEffect } from 'react';
import { useAdminStore } from '@/hooks/useAdminStore';
import { useProjectStore } from '@/hooks/useProjectStore';
import AdminLogin from '@/components/admin/AdminLogin';
import AdminLayout from '@/components/admin/AdminLayout';
import ProjectList from '@/components/admin/projects/ProjectList';
import ProjectDetail from '@/components/admin/projects/ProjectDetail';
import ProjectMetricsSidebar from '@/components/admin/projects/ProjectMetricsSidebar';
import ProjectsTable from '@/components/admin/projects/ProjectsTable';
import TasksTable from '@/components/admin/projects/TasksTable';
import { ArrowLeft, Loader2 } from 'lucide-react';

function ProjectsContent() {
  const { session, sessionLoading, checkSession } = useAdminStore();
  const { selectedProjectId, fetchProjects, projectsLoading, clearSelectedProject } = useProjectStore();

  // Check session on mount
  useEffect(() => {
    checkSession();
  }, [checkSession]);

  // Fetch projects after login
  useEffect(() => {
    if (!session?.isLoggedIn) return;
    fetchProjects();
  }, [session?.isLoggedIn, fetchProjects]);

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

  return (
    <AdminLayout
      sidebarContent={<ProjectList />}
      metricsContent={<ProjectMetricsSidebar />}
    >
      {projectsLoading && !selectedProjectId ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-6 h-6 text-[#3B82F6] animate-spin" />
        </div>
      ) : selectedProjectId ? (
        /* Detail view with back button */
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
        /* Default: two Notion-style database tables */
        <div>
          <ProjectsTable />
          <TasksTable />
        </div>
      )}
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
