import { create } from 'zustand';
import type { MasterLeadRow, QuoteJSON, SessionData, ServiceDiscount, QuoteLevelDiscount } from '@/lib/types/admin';
import type { PortalStatus } from '@/lib/supabase/types';

export interface PortalSummaryWithDetails {
  id: string;
  qr_number: string;
  client_name: string;
  client_email: string;
  status: PortalStatus;
  created_at: string;
  expires_at: string;
  pending_changes: { message: string; created_at: string }[];
  payment: { amount: number; paid_at: string | null } | null;
  finalPayment: { amount: number; paid_at: string | null } | null;
}

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
  adminNotes: string;
  quoteEdited: boolean;

  // Portal tracking
  portals: PortalSummaryWithDetails[];
  portalsLoading: boolean;

  // Actions
  checkSession: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  fetchQuotes: () => Promise<void>;
  fetchPortals: () => Promise<void>;
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
  saveQuoteEdit: (quoteData: QuoteJSON, adminNotes: string) => Promise<{ success: boolean; error?: string }>;
  completePortal: (portalId: string) => Promise<{ success: boolean; error?: string }>;
  sendFinalPayment: (qrNumber: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  trashQuote: (qrNumber: string) => Promise<{ success: boolean; error?: string }>;
  restoreQuote: (qrNumber: string) => Promise<{ success: boolean; error?: string }>;
  permanentlyDeleteQuote: (qrNumber: string) => Promise<{ success: boolean; error?: string }>;
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
  adminNotes: '',
  quoteEdited: false,
  portals: [],
  portalsLoading: false,

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
    set({ session: null, quotes: [], selectedQR: null, selectedQuote: null, portals: [] });
  },

  fetchQuotes: async () => {
    const isInitial = get().quotes.length === 0;
    if (isInitial) set({ quotesLoading: true });
    set({ quotesError: null });
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

  fetchPortals: async () => {
    const isInitial = get().portals.length === 0;
    if (isInitial) set({ portalsLoading: true });
    try {
      const res = await fetch('/api/admin/portals');
      const data = await res.json();
      if (data.status === 'success') {
        set({ portals: data.portals || [], portalsLoading: false });
      } else {
        set({ portalsLoading: false });
      }
    } catch {
      set({ portalsLoading: false });
    }
  },

  selectQuote: async (qr: string) => {
    set({ selectedQR: qr, selectedQuote: null, quoteLoading: true, quoteError: null, adminNotes: '', quoteEdited: false });
    try {
      const res = await fetch(`/api/admin/quote/${encodeURIComponent(qr)}`);
      const data = await res.json();
      if (data.status === 'success') {
        set({
          selectedQuote: data.quote,
          quoteLoading: false,
          adminNotes: data.adminNotes || '',
          quoteEdited: !!data.isEdited,
        });
      } else {
        set({ quoteError: data.message || 'Failed to load quote', quoteLoading: false });
      }
    } catch {
      set({ quoteError: 'Network error', quoteLoading: false });
    }
  },

  clearSelectedQuote: () => {
    set({ selectedQR: null, selectedQuote: null, quoteError: null, adminNotes: '', quoteEdited: false });
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
        get().fetchPortals();
        return { success: true, message: data.message };
      }
      return { success: false, error: data.message || data.error || 'Failed to send portal' };
    } catch {
      return { success: false, error: 'Network error' };
    }
  },

  completePortal: async (portalId: string) => {
    try {
      const res = await fetch(`/api/admin/portals/${portalId}/complete`, { method: 'POST' });
      const data = await res.json();
      if (data.status === 'success') {
        get().fetchPortals();
        return { success: true };
      }
      return { success: false, error: data.error || 'Failed to complete portal' };
    } catch {
      return { success: false, error: 'Network error' };
    }
  },

  sendFinalPayment: async (qrNumber: string) => {
    try {
      const res = await fetch('/api/admin/send-final-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qrNumber }),
      });
      const data = await res.json();
      if (data.status === 'success') {
        get().fetchPortals();
        return { success: true, message: data.message };
      }
      return { success: false, error: data.message || data.error || 'Failed to send final payment request' };
    } catch {
      return { success: false, error: 'Network error' };
    }
  },

  saveQuoteEdit: async (quoteData: QuoteJSON, adminNotes: string) => {
    const qr = get().selectedQR;
    if (!qr) return { success: false, error: 'No quote selected' };
    try {
      const res = await fetch(`/api/admin/quote/${encodeURIComponent(qr)}/edit`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quoteData, adminNotes }),
      });
      const data = await res.json();
      if (data.status === 'success') {
        // Update the selected quote
        set({ selectedQuote: data.quote, adminNotes: data.adminNotes || '', quoteEdited: true });
        // Update the quotes list in-memory so sidebar + metrics reflect edited prices immediately
        const newGrandTotal = data.quote?.totals?.grandTotal;
        if (newGrandTotal !== undefined) {
          const updatedQuotes = get().quotes.map(q =>
            q.qrNumber === qr ? { ...q, grandTotal: newGrandTotal } : q
          );
          set({ quotes: updatedQuotes });
        }
        return { success: true };
      }
      return { success: false, error: data.error || 'Failed to save edits' };
    } catch {
      return { success: false, error: 'Network error' };
    }
  },

  trashQuote: async (qrNumber: string) => {
    try {
      const res = await fetch(`/api/admin/quote/${encodeURIComponent(qrNumber)}/trash`, {
        method: 'POST',
      });
      const data = await res.json();
      if (data.status === 'success') {
        // Update local state: mark as trashed
        const updatedQuotes = get().quotes.map(q =>
          q.qrNumber === qrNumber ? { ...q, isTrashed: true } : q
        );
        const updates: Partial<AdminState> = { quotes: updatedQuotes };
        if (get().selectedQR === qrNumber) {
          updates.selectedQR = null;
          updates.selectedQuote = null;
        }
        set(updates);
        return { success: true };
      }
      return { success: false, error: data.error || 'Failed to trash quote' };
    } catch {
      return { success: false, error: 'Network error' };
    }
  },

  restoreQuote: async (qrNumber: string) => {
    try {
      const res = await fetch(`/api/admin/quote/${encodeURIComponent(qrNumber)}/restore`, {
        method: 'POST',
      });
      const data = await res.json();
      if (data.status === 'success') {
        // Update local state: mark as not trashed
        const updatedQuotes = get().quotes.map(q =>
          q.qrNumber === qrNumber ? { ...q, isTrashed: false } : q
        );
        set({ quotes: updatedQuotes });
        return { success: true };
      }
      return { success: false, error: data.error || 'Failed to restore quote' };
    } catch {
      return { success: false, error: 'Network error' };
    }
  },

  permanentlyDeleteQuote: async (qrNumber: string) => {
    try {
      const res = await fetch(`/api/admin/quote/${encodeURIComponent(qrNumber)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.status === 'success') {
        // Remove from quotes list in memory
        const updatedQuotes = get().quotes.filter(q => q.qrNumber !== qrNumber);
        set({ quotes: updatedQuotes });
        return { success: true };
      }
      return { success: false, error: data.error || 'Failed to delete quote' };
    } catch {
      return { success: false, error: 'Network error' };
    }
  },
}));
