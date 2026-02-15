import { create } from 'zustand';
import type { MasterLeadRow, QuoteJSON, SessionData, ServiceDiscount, QuoteLevelDiscount } from '@/lib/types/admin';

interface AdminState {
  // Session
  session: SessionData | null;
  sessionLoading: boolean;

  // Quotes list
  quotes: MasterLeadRow[];
  quotesLoading: boolean;
  quotesError: string | null;

  // Selected quote
  selectedQR: string | null;
  selectedQuote: QuoteJSON | null;
  quoteLoading: boolean;
  quoteError: string | null;

  // Actions
  checkSession: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  fetchQuotes: () => Promise<void>;
  selectQuote: (qr: string) => Promise<void>;
  clearSelectedQuote: () => void;
  saveDiscount: (
    qrNumber: string,
    serviceDiscounts: ServiceDiscount[],
    quoteDiscount: QuoteLevelDiscount | null
  ) => Promise<{ success: boolean; error?: string }>;
  toggleCustomer: (
    qrNumber: string,
    isCustomer: boolean,
    serviceStarted: string,
    serviceEnded: string
  ) => Promise<{ success: boolean; error?: string }>;
  sendQuote: (qrNumber: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  sendPortal: (qrNumber: string) => Promise<{ success: boolean; message?: string; error?: string }>;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  session: null,
  sessionLoading: true,
  quotes: [],
  quotesLoading: false,
  quotesError: null,
  selectedQR: null,
  selectedQuote: null,
  quoteLoading: false,
  quoteError: null,

  checkSession: async () => {
    set({ sessionLoading: true });
    try {
      const res = await fetch('/api/admin/session');
      const data = await res.json();
      set({ session: data, sessionLoading: false });
    } catch {
      set({ session: null, sessionLoading: false });
    }
  },

  login: async (email: string, password: string) => {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        set({ session: data });
        return { success: true };
      }
      return { success: false, error: data.error || 'Login failed' };
    } catch {
      return { success: false, error: 'Network error' };
    }
  },

  logout: async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } catch {
      // ignore
    }
    set({ session: null, quotes: [], selectedQR: null, selectedQuote: null });
  },

  fetchQuotes: async () => {
    set({ quotesLoading: true, quotesError: null });
    try {
      const res = await fetch('/api/admin/quotes');
      const data = await res.json();
      if (data.status === 'success') {
        set({ quotes: data.quotes || [], quotesLoading: false });
      } else {
        set({ quotesError: data.message || 'Failed to load quotes', quotesLoading: false });
      }
    } catch {
      set({ quotesError: 'Network error', quotesLoading: false });
    }
  },

  selectQuote: async (qr: string) => {
    set({ selectedQR: qr, quoteLoading: true, quoteError: null });
    try {
      const res = await fetch(`/api/admin/quote/${encodeURIComponent(qr)}`);
      const data = await res.json();
      if (data.status === 'success') {
        set({ selectedQuote: data.quote, quoteLoading: false });
      } else {
        set({ quoteError: data.message || 'Failed to load quote', quoteLoading: false });
      }
    } catch {
      set({ quoteError: 'Network error', quoteLoading: false });
    }
  },

  clearSelectedQuote: () => {
    set({ selectedQR: null, selectedQuote: null, quoteError: null });
  },

  saveDiscount: async (qrNumber, serviceDiscounts, quoteDiscount) => {
    try {
      const res = await fetch('/api/admin/discount', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qrNumber, serviceDiscounts, quoteDiscount }),
      });
      const data = await res.json();
      if (data.status === 'success') {
        set({ selectedQuote: data.quote });
        // Refresh the quotes list to get updated totals
        get().fetchQuotes();
        return { success: true };
      }
      return { success: false, error: data.message || 'Failed to save discount' };
    } catch {
      return { success: false, error: 'Network error' };
    }
  },

  toggleCustomer: async (qrNumber, isCustomer, serviceStarted, serviceEnded) => {
    try {
      const res = await fetch('/api/admin/customer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qrNumber, isCustomer, serviceStarted, serviceEnded }),
      });
      const data = await res.json();
      if (data.status === 'success') {
        // Refresh quotes list
        get().fetchQuotes();
        return { success: true };
      }
      return { success: false, error: data.message || 'Failed to update customer' };
    } catch {
      return { success: false, error: 'Network error' };
    }
  },

  sendQuote: async (qrNumber: string) => {
    try {
      const res = await fetch('/api/admin/send-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qrNumber }),
      });
      const data = await res.json();
      if (data.status === 'success') {
        return { success: true, message: data.message };
      }
      return { success: false, error: data.message || data.error || 'Failed to send quote' };
    } catch {
      return { success: false, error: 'Network error' };
    }
  },

  sendPortal: async (qrNumber: string) => {
    try {
      const res = await fetch('/api/admin/send-portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qrNumber }),
      });
      const data = await res.json();
      if (data.status === 'success') {
        return { success: true, message: data.message };
      }
      return { success: false, error: data.message || data.error || 'Failed to send portal' };
    } catch {
      return { success: false, error: 'Network error' };
    }
  },
}));
