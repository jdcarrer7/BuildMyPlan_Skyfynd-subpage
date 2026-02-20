'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase/browser-client';
import { useAdminStore } from '@/hooks/useAdminStore';
import type { RealtimeChannel } from '@supabase/supabase-js';

export interface PresenceUser {
  email: string;
  name: string;
  page: string;
  editingCellId: string | null;
  editingLabel: string | null;
  onlineAt: string;
}

const CHANNEL_NAME = 'admin-presence';

export function usePresence() {
  const session = useAdminStore((s) => s.session);
  const [onlineUsers, setOnlineUsers] = useState<PresenceUser[]>([]);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const localStateRef = useRef<Partial<PresenceUser>>({});

  const pushPresence = useCallback(() => {
    const ch = channelRef.current;
    if (!ch || !session?.isLoggedIn) return;
    ch.track({
      email: session.email,
      name: session.name,
      page: localStateRef.current.page || 'unknown',
      editingCellId: localStateRef.current.editingCellId || null,
      editingLabel: localStateRef.current.editingLabel || null,
      onlineAt: new Date().toISOString(),
    });
  }, [session]);

  const setEditing = useCallback(
    (cellId: string | null, label: string | null = null) => {
      localStateRef.current.editingCellId = cellId;
      localStateRef.current.editingLabel = label;
      pushPresence();
    },
    [pushPresence],
  );

  const setPage = useCallback(
    (page: string) => {
      localStateRef.current.page = page;
      pushPresence();
    },
    [pushPresence],
  );

  useEffect(() => {
    if (!session?.isLoggedIn) return;

    const supabase = getSupabaseBrowserClient();
    const channel = supabase.channel(CHANNEL_NAME, {
      config: { presence: { key: session.email } },
    });

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState<PresenceUser>();
        const users: PresenceUser[] = [];
        for (const key of Object.keys(state)) {
          const presences = state[key];
          if (presences && presences.length > 0) {
            users.push(presences[presences.length - 1] as PresenceUser);
          }
        }
        setOnlineUsers(users);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          localStateRef.current.page = localStateRef.current.page || 'projects';
          pushPresence();
        }
      });

    channelRef.current = channel;

    return () => {
      channel.untrack();
      supabase.removeChannel(channel);
      channelRef.current = null;
    };
  }, [session?.isLoggedIn, session?.email, session?.name, pushPresence]);

  return { onlineUsers, setEditing, setPage };
}
