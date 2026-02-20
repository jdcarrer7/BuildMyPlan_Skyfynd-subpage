'use client';

import { createContext, useContext } from 'react';

interface SidebarContextValue {
  width: number;
  isCompact: boolean;
}

const SidebarContext = createContext<SidebarContextValue>({ width: 320, isCompact: false });

export const SidebarProvider = SidebarContext.Provider;
export const useSidebarContext = () => useContext(SidebarContext);
