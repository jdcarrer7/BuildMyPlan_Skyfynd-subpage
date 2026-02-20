'use client';

import type { PresenceUser } from '@/hooks/usePresence';

interface EditingIndicatorProps {
  cellId: string;
  onlineUsers: PresenceUser[];
  currentUserEmail: string;
}

export default function EditingIndicator({ cellId, onlineUsers, currentUserEmail }: EditingIndicatorProps) {
  const editor = onlineUsers.find(
    (u) => u.editingCellId === cellId && u.email !== currentUserEmail,
  );

  if (!editor) return null;

  const firstName = editor.name.split(' ')[0];

  return (
    <span className="inline-flex items-center gap-1 text-[9px] font-medium text-[#8B5CF6] bg-[#8B5CF6]/10 px-1.5 py-0.5 rounded-full animate-pulse">
      <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]" />
      {firstName} editing...
    </span>
  );
}
