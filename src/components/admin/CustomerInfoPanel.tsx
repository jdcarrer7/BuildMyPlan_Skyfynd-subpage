'use client';

import type { QuoteJSON } from '@/lib/types/admin';
import { Mail, Phone, Building2, Calendar, Globe } from 'lucide-react';

interface Props {
  quote: QuoteJSON;
}

const sourceColors: Record<string, string> = {
  'Main Page': 'bg-blue-500/20 text-blue-400',
  'Rent Me a Site': 'bg-green-500/20 text-green-400',
  'RentMe': 'bg-green-500/20 text-green-400',
  'Custom Builder': 'bg-purple-500/20 text-purple-400',
};

export default function CustomerInfoPanel({ quote }: Props) {
  const c = quote.customer;
  const badgeClass = sourceColors[quote.source] || 'bg-gray-500/20 text-gray-400';

  return (
    <div className="bg-[#1c1825] rounded-xl border border-[#2a2435] p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold text-white">{c.name}</h2>
          <p className="text-sm text-[#888]">{quote.customerId} &middot; {quote.qrNumber}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${badgeClass}`}>
          {quote.source}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {c.email && (
          <div className="flex items-center gap-2 text-sm text-[#a0a0a0]">
            <Mail className="w-4 h-4 text-[#8b5cf6]" />
            <span className="truncate">{c.email}</span>
          </div>
        )}
        {c.phone && (
          <div className="flex items-center gap-2 text-sm text-[#a0a0a0]">
            <Phone className="w-4 h-4 text-[#8b5cf6]" />
            <span>{c.phone}</span>
          </div>
        )}
        {c.company && (
          <div className="flex items-center gap-2 text-sm text-[#a0a0a0]">
            <Building2 className="w-4 h-4 text-[#8b5cf6]" />
            <span>{c.company}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-sm text-[#a0a0a0]">
          <Calendar className="w-4 h-4 text-[#8b5cf6]" />
          <span>{new Date(quote.submittedAt).toLocaleDateString()} {new Date(quote.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-[#a0a0a0]">
          <Globe className="w-4 h-4 text-[#8b5cf6]" />
          <span>{quote.services.length} service{quote.services.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {c.notes && (
        <div className="mt-4 pt-4 border-t border-[#2a2435]">
          <p className="text-xs text-[#888] mb-1">Notes</p>
          <p className="text-sm text-[#a0a0a0]">{c.notes}</p>
        </div>
      )}
    </div>
  );
}
