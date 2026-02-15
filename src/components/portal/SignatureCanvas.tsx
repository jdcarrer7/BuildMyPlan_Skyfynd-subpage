'use client';

import { useRef, useState, useEffect } from 'react';
import { RotateCcw, Check, Loader2 } from 'lucide-react';
import ReactSignatureCanvas from 'react-signature-canvas';

interface SignatureCanvasProps {
  clientName: string;
  portalId: string;
  onSigned: () => void;
}

export default function SignatureCanvas({ clientName, portalId, onSigned }: SignatureCanvasProps) {
  const sigRef = useRef<ReactSignatureCanvas | null>(null);
  const [isEmpty, setIsEmpty] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [canvasWidth, setCanvasWidth] = useState(500);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const updateWidth = () => {
      const container = document.getElementById('sig-container');
      if (container) {
        setCanvasWidth(Math.min(container.offsetWidth - 2, 600));
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    setMounted(true);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const handleClear = () => {
    sigRef.current?.clear();
    setIsEmpty(true);
    setPreviewUrl(null);
    setConfirmed(false);
    setError(null);
  };

  const handleEnd = () => {
    if (sigRef.current && !sigRef.current.isEmpty()) {
      setIsEmpty(false);
    }
  };

  const handleReview = () => {
    if (sigRef.current && !sigRef.current.isEmpty()) {
      const dataUrl = sigRef.current.getTrimmedCanvas().toDataURL('image/png');
      setPreviewUrl(dataUrl);
      setConfirmed(true);
    }
  };

  const handleSubmit = async () => {
    if (!previewUrl) return;
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/portal/${portalId}/sign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          signatureDataUrl: previewUrl,
          clientName,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        onSigned();
      } else {
        setError(data.error || 'Failed to submit signature');
      }
    } catch {
      setError('Network error. Please try again.');
    }
    setSubmitting(false);
  };

  if (confirmed && previewUrl) {
    return (
      <div className="space-y-6">
        <h3
          className="text-xl font-semibold text-[#FAFAFA] text-center"
          style={{ fontFamily: "'Source Serif Pro', Georgia, serif" }}
        >
          Confirm Your Signature
        </h3>

        <div className="bg-white rounded-lg p-6 flex items-center justify-center">
          <img src={previewUrl} alt="Your signature" className="max-h-24" />
        </div>

        <p className="text-[#A1A1AA] text-sm text-center">
          By clicking &quot;Submit Signature,&quot; you confirm that you,{' '}
          <span className="text-[#FAFAFA] font-medium">{clientName}</span>, have read and agree to
          the Master Services Agreement above.
        </p>

        {error && <p className="text-red-400 text-sm text-center">{error}</p>}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-lg font-semibold text-white transition-all disabled:opacity-50"
            style={{ background: 'linear-gradient(to right, rgba(167,139,250,0.75) 0%, rgba(96,175,250,0.85) 40%, rgba(52,211,153,0.8) 100%)' }}
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                Submit Signature
              </>
            )}
          </button>
          <button
            onClick={handleClear}
            disabled={submitting}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-[#A1A1AA] border border-white/[0.1] hover:bg-white/[0.04] transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            Redo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3
        className="text-xl font-semibold text-[#FAFAFA] text-center"
        style={{ fontFamily: "'Source Serif Pro', Georgia, serif" }}
      >
        Sign Below
      </h3>
      <p className="text-[#A1A1AA] text-sm text-center">
        Use your mouse or finger to sign in the box below.
      </p>

      <div id="sig-container" className="relative bg-white rounded-lg overflow-hidden border-2 border-white/[0.1]">
        {mounted && (
          <ReactSignatureCanvas
            ref={sigRef}
            canvasProps={{
              width: canvasWidth,
              height: 200,
              className: 'w-full cursor-crosshair',
            }}
            onEnd={handleEnd}
            penColor="#1a1a2e"
            minWidth={1.5}
            maxWidth={3}
          />
        )}
        {/* Baseline guide */}
        <div className="absolute bottom-12 left-8 right-8 border-b border-dashed border-[#ccc] pointer-events-none" />
        <p className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[#ccc] text-xs pointer-events-none">
          {clientName}
        </p>
      </div>

      {error && <p className="text-red-400 text-sm text-center">{error}</p>}

      <div className="flex items-center justify-center gap-3">
        <button
          onClick={handleClear}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-[#71717A] border border-white/[0.1] hover:bg-white/[0.04] transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Clear
        </button>
        <button
          onClick={handleReview}
          disabled={isEmpty}
          className="inline-flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-semibold text-white transition-all disabled:opacity-30"
          style={{ background: 'linear-gradient(to right, rgba(167,139,250,0.75) 0%, rgba(96,175,250,0.85) 40%, rgba(52,211,153,0.8) 100%)' }}
        >
          <Check className="w-3.5 h-3.5" />
          Review Signature
        </button>
      </div>
    </div>
  );
}
