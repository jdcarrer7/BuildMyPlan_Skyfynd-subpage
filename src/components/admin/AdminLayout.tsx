'use client';

import { useAdminStore } from '@/hooks/useAdminStore';
import CustomerDropdown from './CustomerDropdown';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { session, logout } = useAdminStore();

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      {/* Sidebar */}
      <aside className="w-80 bg-[#1c1825] border-r border-[#2a2435] flex flex-col h-screen sticky top-0">
        {/* Header */}
        <div className="p-4 border-b border-[#2a2435]">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
              SkyFynd Admin
            </h1>
            <button
              onClick={logout}
              className="text-xs text-[#a0a0a0] hover:text-white transition-colors px-2 py-1 rounded border border-[#2a2435] hover:border-[#666]"
            >
              Logout
            </button>
          </div>
          <p className="text-xs text-[#888] mt-1">{session?.name} ({session?.email})</p>
        </div>

        {/* Customer Dropdown / Quote List */}
        <div className="flex-1 overflow-y-auto">
          <CustomerDropdown />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6">
        {children}
      </main>
    </div>
  );
}
