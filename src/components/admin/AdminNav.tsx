'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FileText, Folder } from 'lucide-react';
import { useSidebarContext } from '@/hooks/useSidebarContext';

const tabs = [
  { label: 'CRM', href: '/admin/quotes', icon: FileText },
  { label: 'Projects', href: '/admin/projects', icon: Folder },
];

export default function AdminNav() {
  const pathname = usePathname();
  const { isCompact } = useSidebarContext();

  return (
    <div className={`${isCompact ? 'px-2' : 'px-3'} py-2.5 border-b border-white/[0.06]`}>
      <div className="flex gap-1 p-1 rounded-lg bg-white/[0.03]">
        {tabs.map((tab) => {
          const isActive = pathname?.startsWith(tab.href);
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              title={tab.label}
              className={`flex-1 flex items-center justify-center gap-1.5 ${isCompact ? 'px-1.5' : 'px-3'} py-2 rounded-md text-xs font-medium transition-all ${
                isActive
                  ? 'text-white shadow-sm'
                  : 'text-[#71717A] hover:text-[#A1A1AA] hover:bg-white/[0.03]'
              }`}
              style={
                isActive
                  ? {
                      background:
                        'linear-gradient(to right, rgba(167,139,250,0.75) 0%, rgba(96,175,250,0.85) 40%, rgba(52,211,153,0.8) 100%)',
                    }
                  : undefined
              }
            >
              <Icon className="w-3.5 h-3.5 flex-shrink-0" />
              {!isCompact && tab.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
