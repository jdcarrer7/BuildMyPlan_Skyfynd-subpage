'use client';

import type { QuoteJSON } from '@/lib/types/admin';
import { Mail, Phone, Building2, Calendar, Globe } from 'lucide-react';

interface Props {
  quote: QuoteJSON;
}

const sourceColors: Record<string, string> = {
  'Main Page': 'bg-[#3B82F6]/20 text-[#60A5FA]',
  'Rent Me a Site': 'bg-[var(--accent-blue)]/20 text-[var(--accent-blue-light)]',
  'RentMe': 'bg-[var(--accent-blue)]/20 text-[var(--accent-blue-light)]',
  'Custom Builder': 'bg-[#3B82F6]/20 text-[#60A5FA]',
};

export default function CustomerInfoPanel({ quote }: Props) {
  const c = quote.customer;
  const badgeClass = sourceColors[quote.source] || 'bg-white/[0.06] text-[#A1A1AA]';

  return (
    <div className="card p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold text-[#FAFAFA] font-serif">{c.name}</h2>
          <p className="text-sm text-[#71717A]">{quote.customerId} &middot; {quote.qrNumber}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${badgeClass}`}>
          {quote.source}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {c.email && (
          <div className="flex items-center gap-2 text-sm text-[#A1A1AA]">
            <Mail className="w-4 h-4 text-[#3B82F6]" />
            <span className="truncate">{c.email}</span>
          </div>
        )}
        {c.phone && (
          <div className="flex items-center gap-2 text-sm text-[#A1A1AA]">
            <Phone className="w-4 h-4 text-[#3B82F6]" />
            <span>{c.phone}</span>
          </div>
        )}
        {c.company && (
          <div className="flex items-center gap-2 text-sm text-[#A1A1AA]">
            <Building2 className="w-4 h-4 text-[#3B82F6]" />
            <span>{c.company}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-sm text-[#A1A1AA]">
          <Calendar className="w-4 h-4 text-[#3B82F6]" />
          <span>{new Date(quote.submittedAt).toLocaleDateString()} {new Date(quote.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-[#A1A1AA]">
          <Globe className="w-4 h-4 text-[#3B82F6]" />
          <span>{quote.services.length} service{quote.services.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {c.notes && (
        <div className="mt-4 pt-4 border-t border-white/[0.06]">
          <p className="text-xs text-[#71717A] mb-1">Notes</p>
          <p className="text-sm text-[#A1A1AA]">{c.notes}</p>
        </div>
      )}
    </div>
  );
}
