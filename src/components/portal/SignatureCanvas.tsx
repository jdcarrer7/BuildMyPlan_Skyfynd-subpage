'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { RotateCcw, Check, Loader2, Pen, Type } from 'lucide-react';
import ReactSignatureCanvas from 'react-signature-canvas';

interface SignatureCanvasProps {
  clientName: string;
  portalId: string;
  onSigned: () => void;
}

type SignMode = 'draw' | 'type';

const TYPED_FONTS = [
  { label: 'Script', value: "'Dancing Script', cursive" },
  { label: 'Elegant', value: "'Great Vibes', cursive" },
  { label: 'Classic', value: "'Playfair Display', serif" },
  { label: 'Simple', value: "'Inter', sans-serif" },
];

export default function SignatureCanvas({ clientName, portalId, onSigned }: SignatureCanvasProps) {
  const sigRef = useRef<ReactSignatureCanvas | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isEmpty, setIsEmpty] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 500, height: 200 });
  const [mounted, setMounted] = useState(false);

  // Signature mode
  const [mode, setMode] = useState<SignMode>('draw');
  const [typedName, setTypedName] = useState('');
  const [selectedFont, setSelectedFont] = useState(TYPED_FONTS[0].value);

  // Resize canvas to match container exactly — prevents offset
  const updateCanvasSize = useCallback(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setCanvasSize({ width: Math.floor(rect.width), height: 200 });
    }
  }, []);

  useEffect(() => {
    updateCanvasSize();
    setMounted(true);

    const observer = new ResizeObserver(() => updateCanvasSize());
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [updateCanvasSize]);

  // Re-clear canvas when size changes (avoids stale strokes)
  useEffect(() => {
    if (sigRef.current && mode === 'draw') {
      sigRef.current.clear();
      setIsEmpty(true);
    }
  }, [canvasSize, mode]);

  const handleClear = () => {
    if (mode === 'draw') {
      sigRef.current?.clear();
    } else {
      setTypedName('');
    }
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

  const handleModeSwitch = (newMode: SignMode) => {
    setMode(newMode);
    setPreviewUrl(null);
    setConfirmed(false);
    setError(null);
    setIsEmpty(true);
    setTypedName('');
    if (sigRef.current) sigRef.current.clear();
  };

  // Generate an image from the typed signature
  const generateTypedSignatureImage = useCallback((): string => {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 150;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#1a1a2e';
    ctx.font = `48px ${selectedFont}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(typedName || clientName, canvas.width / 2, canvas.height / 2);
    return canvas.toDataURL('image/png');
  }, [typedName, clientName, selectedFont]);

  const handleReview = () => {
    if (mode === 'draw') {
      if (sigRef.current && !sigRef.current.isEmpty()) {
        const dataUrl = sigRef.current.getTrimmedCanvas().toDataURL('image/png');
        setPreviewUrl(dataUrl);
        setConfirmed(true);
      }
    } else {
      if (typedName.trim()) {
        const dataUrl = generateTypedSignatureImage();
        setPreviewUrl(dataUrl);
        setConfirmed(true);
      }
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

  // Confirmation / review screen
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

  const isReviewDisabled = mode === 'draw' ? isEmpty : !typedName.trim();

  return (
    <div className="space-y-4">
      <h3
        className="text-xl font-semibold text-[#FAFAFA] text-center"
        style={{ fontFamily: "'Source Serif Pro', Georgia, serif" }}
      >
        Sign Below
      </h3>

      {/* Mode toggle tabs */}
      <div className="flex items-center justify-center gap-1 bg-white/[0.04] rounded-lg p-1 max-w-xs mx-auto">
        <button
          onClick={() => handleModeSwitch('draw')}
          className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
            mode === 'draw'
              ? 'bg-white/[0.1] text-white'
              : 'text-[#71717A] hover:text-[#A1A1AA]'
          }`}
        >
          <Pen className="w-3.5 h-3.5" />
          Draw
        </button>
        <button
          onClick={() => handleModeSwitch('type')}
          className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
            mode === 'type'
              ? 'bg-white/[0.1] text-white'
              : 'text-[#71717A] hover:text-[#A1A1AA]'
          }`}
        >
          <Type className="w-3.5 h-3.5" />
          Type
        </button>
      </div>

      {mode === 'draw' ? (
        <>
          <p className="text-[#A1A1AA] text-sm text-center">
            Use your mouse or finger to sign in the box below.
          </p>

          <div ref={containerRef} className="relative bg-white rounded-lg overflow-hidden border-2 border-white/[0.1]">
            {mounted && (
              <ReactSignatureCanvas
                ref={sigRef}
                canvasProps={{
                  width: canvasSize.width,
                  height: canvasSize.height,
                  style: { display: 'block', width: canvasSize.width, height: canvasSize.height },
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
        </>
      ) : (
        <>
          <p className="text-[#A1A1AA] text-sm text-center">
            Type your full name to create a signature.
          </p>

          <div className="space-y-4">
            <input
              type="text"
              value={typedName}
              onChange={(e) => { setTypedName(e.target.value); setIsEmpty(!e.target.value.trim()); }}
              placeholder={clientName}
              className="w-full bg-white/[0.04] border border-white/[0.1] rounded-lg px-4 py-3 text-white text-center text-lg placeholder:text-[#52525B] focus:outline-none focus:border-[#A78BFA]/50 transition-colors"
            />

            {/* Font selector */}
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {TYPED_FONTS.map((font) => (
                <button
                  key={font.value}
                  onClick={() => setSelectedFont(font.value)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-all ${
                    selectedFont === font.value
                      ? 'border-[#A78BFA]/50 bg-[#A78BFA]/10 text-[#A78BFA]'
                      : 'border-white/[0.1] text-[#71717A] hover:text-[#A1A1AA] hover:bg-white/[0.04]'
                  }`}
                >
                  {font.label}
                </button>
              ))}
            </div>

            {/* Live preview */}
            <div className="relative bg-white rounded-lg overflow-hidden border-2 border-white/[0.1] h-[200px] flex items-center justify-center">
              <p
                className="text-[#1a1a2e] text-4xl select-none"
                style={{ fontFamily: selectedFont }}
              >
                {typedName || clientName}
              </p>
              {/* Baseline guide */}
              <div className="absolute bottom-12 left-8 right-8 border-b border-dashed border-[#ccc] pointer-events-none" />
              <p className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[#ccc] text-xs pointer-events-none">
                {clientName}
              </p>
            </div>
          </div>
        </>
      )}

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
          disabled={isReviewDisabled}
          className="inline-flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-semibold text-white transition-all disabled:opacity-30"
          style={{ background: 'linear-gradient(to right, rgba(167,139,250,0.75) 0%, rgba(96,175,250,0.85) 40%, rgba(52,211,153,0.8) 100%)' }}
        >
          <Check className="w-3.5 h-3.5" />
          Review Signature
        </button>
      </div>

      {/* Load Google Fonts for typed signatures */}
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&family=Great+Vibes&display=swap"
        rel="stylesheet"
      />
    </div>
  );
}
