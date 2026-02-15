'use client';

import { useState } from 'react';
import { Check, MessageSquare, Loader2 } from 'lucide-react';
import ChangeRequestForm from './ChangeRequestForm';

interface QuoteActionsProps {
  portalId: string;
  onAccepted: () => void;
  onChangeRequested: () => void;
}

export default function QuoteActions({ portalId, onAccepted, onChangeRequested }: QuoteActionsProps) {
  const [showChangeForm, setShowChangeForm] = useState(false);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAccept = async () => {
    setAccepting(true);
    setError(null);
    try {
      const res = await fetch(`/api/portal/${portalId}/accept`, { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        onAccepted();
      } else {
        setError(data.error || 'Failed to accept quote');
      }
    } catch {
      setError('Network error. Please try again.');
    }
    setAccepting(false);
  };

  if (showChangeForm) {
    return (
      <ChangeRequestForm
        portalId={portalId}
        onSubmitted={onChangeRequested}
        onCancel={() => setShowChangeForm(false)}
      />
    );
  }

  return (
    <div className="border-t border-white/[0.06] pt-6 mt-6">
      <p className="text-[#A1A1AA] text-sm text-center mb-6">
        Ready to move forward? Accept the quote to proceed to signing, or request changes if something needs adjusting.
      </p>

      {error && (
        <p className="text-red-400 text-sm text-center mb-4">{error}</p>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={handleAccept}
          disabled={accepting}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-lg font-semibold text-white transition-all disabled:opacity-50"
          style={{ background: 'linear-gradient(to right, rgba(167,139,250,0.75) 0%, rgba(96,175,250,0.85) 40%, rgba(52,211,153,0.8) 100%)' }}
        >
          {accepting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Accepting...
            </>
          ) : (
            <>
              <Check className="w-4 h-4" />
              Accept Quote
            </>
          )}
        </button>
        <button
          onClick={() => setShowChangeForm(true)}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-lg font-semibold text-[#A1A1AA] border border-white/[0.1] hover:bg-white/[0.04] transition-all"
        >
          <MessageSquare className="w-4 h-4" />
          Request Changes
        </button>
      </div>
    </div>
  );
}
