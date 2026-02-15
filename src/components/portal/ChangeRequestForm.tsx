'use client';

import { useState } from 'react';
import { Send, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';

interface ChangeRequestFormProps {
  portalId: string;
  onSubmitted: () => void;
  onCancel: () => void;
}

export default function ChangeRequestForm({ portalId, onSubmitted, onCancel }: ChangeRequestFormProps) {
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!message.trim()) return;
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/portal/${portalId}/request-change`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: message.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setSubmitted(true);
        setTimeout(() => onSubmitted(), 2000);
      } else {
        setError(data.error || 'Failed to submit');
      }
    } catch {
      setError('Network error. Please try again.');
    }
    setSubmitting(false);
  };

  if (submitted) {
    return (
      <div className="border-t border-white/[0.06] pt-6 mt-6 text-center py-8">
        <CheckCircle2 className="w-12 h-12 text-[#10B981] mx-auto mb-4" />
        <h3
          className="text-xl font-semibold text-[#FAFAFA] mb-2"
          style={{ fontFamily: "'Source Serif Pro', Georgia, serif" }}
        >
          Changes Requested
        </h3>
        <p className="text-[#A1A1AA] text-sm">
          We&apos;ve received your feedback. Our team will review and send you an updated quote.
        </p>
      </div>
    );
  }

  return (
    <div className="border-t border-white/[0.06] pt-6 mt-6">
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={onCancel}
          className="text-[#71717A] hover:text-[#FAFAFA] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h3 className="text-lg font-semibold text-[#FAFAFA]">Request Changes</h3>
      </div>

      <p className="text-[#A1A1AA] text-sm mb-4">
        Let us know what you&apos;d like changed. We&apos;ll review your feedback and send an updated quote.
      </p>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Describe the changes you'd like..."
        maxLength={2000}
        rows={5}
        className="w-full bg-white/[0.04] border border-white/[0.1] rounded-lg px-4 py-3 text-[#FAFAFA] text-sm placeholder:text-[#52525B] focus:border-[#A78BFA] focus:ring-1 focus:ring-[#A78BFA] outline-none resize-none transition-all"
      />

      <div className="flex items-center justify-between mt-3">
        <span className="text-[#52525B] text-xs">{message.length}/2000</span>
        {error && <span className="text-red-400 text-xs">{error}</span>}
      </div>

      <div className="flex justify-end mt-4">
        <button
          onClick={handleSubmit}
          disabled={submitting || !message.trim()}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition-all disabled:opacity-50"
          style={{ background: 'linear-gradient(to right, rgba(167,139,250,0.75) 0%, rgba(96,175,250,0.85) 40%, rgba(52,211,153,0.8) 100%)' }}
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Submit Request
            </>
          )}
        </button>
      </div>
    </div>
  );
}
