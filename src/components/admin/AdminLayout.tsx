'use client';

import Image from 'next/image';
import { useAdminStore } from '@/hooks/useAdminStore';
import CustomerDropdown from './CustomerDropdown';
import MetricsSidebar from './MetricsSidebar';

const LOGO_URL = 'https://f005.backblazeb2.com/file/SKYFYND-assets/Skyfynd+logo.png';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { session, logout } = useAdminStore();

  return (
    <div className="min-h-screen bg-[#0A0A0B] flex">
      {/* Sidebar */}
      <aside className="w-80 bg-[#111113] border-r border-white/[0.06] flex flex-col h-screen sticky top-0">
        {/* Header */}
        <div className="p-4 border-b border-white/[0.06]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <img src={LOGO_URL} alt="SkyFynd" className="w-7 h-7 object-contain" />
              <h1 className="text-[24px] font-semibold text-white" style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif", letterSpacing: '-0.5px' }}>
                Skyfynd
              </h1>
            </div>
            <button
              onClick={logout}
              className="text-xs text-[#A1A1AA] hover:text-white transition-colors px-2 py-1 rounded border border-white/[0.06] hover:border-white/[0.15]"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Customer Dropdown / Quote List */}
        <div className="flex-1 overflow-y-auto">
          <CustomerDropdown />
        </div>

        {/* User Info - bottom of sidebar */}
        <div className="px-4 py-3 border-t border-white/[0.06]">
          <p className="text-[11px] text-[#52525B] truncate">{session?.name} &middot; {session?.email}</p>
        </div>
      </aside>

      {/* Pipeline Metrics Sidebar */}
      <MetricsSidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6">
        {children}
      </main>
    </div>
  );
}
