'use client';

import { useState } from 'react';
import type { PresenceUser } from '@/hooks/usePresence';
import { useAdminStore } from '@/hooks/useAdminStore';

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function getAvatarColor(name: string): string {
  const colors = ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#34D399', '#EF4444'];
  let hash = 0;
  for (const ch of name) hash = ch.charCodeAt(0) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

interface PresenceBubblesProps {
  onlineUsers: PresenceUser[];
}

export default function PresenceBubbles({ onlineUsers }: PresenceBubblesProps) {
  const session = useAdminStore((s) => s.session);

  if (onlineUsers.length === 0) return null;

  const sorted = [...onlineUsers].sort((a, b) => {
    if (a.email === session?.email) return 1;
    if (b.email === session?.email) return -1;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="flex items-center gap-1.5">
      {sorted.map((user) => (
        <AvatarBubble
          key={user.email}
          user={user}
          isSelf={user.email === session?.email}
        />
      ))}
    </div>
  );
}

function AvatarBubble({ user, isSelf }: { user: PresenceUser; isSelf: boolean }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const initials = getInitials(user.name);
  const color = getAvatarColor(user.name);

  return (
    <div
      className="relative"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white select-none ring-2 ${
          isSelf ? 'ring-white/20' : 'ring-[#0A0A0B]'
        }`}
        style={{ backgroundColor: color }}
      >
        {initials}
      </div>

      <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#34D399] border-2 border-[#0A0A0B]" />

      {showTooltip && (
        <div className="absolute top-full mt-2 right-0 z-50 whitespace-nowrap">
          <div className="bg-[#1C1825] border border-white/[0.1] rounded-lg px-3 py-2 shadow-xl">
            <p className="text-[11px] font-medium text-white">
              {user.name}
              {isSelf ? ' (You)' : ''}
            </p>
            {user.editingLabel && (
              <p className="text-[10px] text-[#A1A1AA] mt-0.5">
                Editing: {user.editingLabel}
              </p>
            )}
            {!user.editingLabel && user.page && (
              <p className="text-[10px] text-[#52525B] mt-0.5">
                Viewing {user.page}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
