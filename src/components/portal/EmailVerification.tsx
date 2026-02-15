'use client';

import { useState, useRef, useEffect } from 'react';
import { Loader2, Mail, ShieldCheck } from 'lucide-react';

interface EmailVerificationProps {
  portalId: string;
  maskedEmail?: string;
  onVerified: () => void;
}

export default function EmailVerification({ portalId, maskedEmail, onVerified }: EmailVerificationProps) {
  const [step, setStep] = useState<'request' | 'enter'>('request');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailDisplay, setEmailDisplay] = useState(maskedEmail || '');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Auto-focus first input when entering code step
  useEffect(() => {
    if (step === 'enter') {
      inputRefs.current[0]?.focus();
    }
  }, [step]);

  const handleSendCode = async () => {
    setSending(true);
    setError(null);
    try {
      const res = await fetch(`/api/portal/${portalId}/verify`, { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setEmailDisplay(data.maskedEmail || emailDisplay);
        setStep('enter');
      } else {
        setError(data.error || 'Failed to send code');
      }
    } catch {
      setError('Network error. Please try again.');
    }
    setSending(false);
  };

  const handleInputChange = (index: number, value: string) => {
    // Only allow digits
    const digit = value.replace(/\D/g, '').slice(-1);
    const newCode = [...code];
    newCode[index] = digit;
    setCode(newCode);

    // Auto-advance to next input
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 6 digits entered
    if (digit && index === 5) {
      const fullCode = newCode.join('');
      if (fullCode.length === 6) {
        handleVerifyCode(fullCode);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      const newCode = pasted.split('');
      setCode(newCode);
      inputRefs.current[5]?.focus();
      handleVerifyCode(pasted);
    }
  };

  const handleVerifyCode = async (fullCode: string) => {
    setVerifying(true);
    setError(null);
    try {
      const res = await fetch(`/api/portal/${portalId}/verify-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: fullCode }),
      });
      const data = await res.json();
      if (res.ok) {
        onVerified();
      } else {
        setError(data.error || 'Invalid code');
        setCode(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch {
      setError('Network error. Please try again.');
    }
    setVerifying(false);
  };

  return (
    <div className="text-center py-8 sm:py-12">
      {step === 'request' ? (
        <>
          <div className="w-16 h-16 rounded-2xl bg-[#A78BFA]/10 flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-[#A78BFA]" />
          </div>
          <h2
            className="text-2xl font-semibold text-[#FAFAFA] mb-3"
            style={{ fontFamily: "'Source Serif Pro', Georgia, serif" }}
          >
            Verify Your Identity
          </h2>
          <p className="text-[#A1A1AA] max-w-md mx-auto mb-8">
            We&apos;ll send a 6-digit verification code to{' '}
            {emailDisplay ? (
              <span className="text-[#FAFAFA] font-medium">{emailDisplay}</span>
            ) : (
              'your email on file'
            )}{' '}
            to confirm your identity.
          </p>
          {error && (
            <p className="text-red-400 text-sm mb-4">{error}</p>
          )}
          <button
            onClick={handleSendCode}
            disabled={sending}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition-all disabled:opacity-50"
            style={{ background: 'linear-gradient(to right, rgba(167,139,250,0.75) 0%, rgba(96,175,250,0.85) 40%, rgba(52,211,153,0.8) 100%)' }}
          >
            {sending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Mail className="w-4 h-4" />
                Send Verification Code
              </>
            )}
          </button>
        </>
      ) : (
        <>
          <div className="w-16 h-16 rounded-2xl bg-[#A78BFA]/10 flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="w-8 h-8 text-[#A78BFA]" />
          </div>
          <h2
            className="text-2xl font-semibold text-[#FAFAFA] mb-3"
            style={{ fontFamily: "'Source Serif Pro', Georgia, serif" }}
          >
            Enter Verification Code
          </h2>
          <p className="text-[#A1A1AA] max-w-md mx-auto mb-8">
            We sent a 6-digit code to{' '}
            <span className="text-[#FAFAFA] font-medium">{emailDisplay}</span>.
            Check your inbox.
          </p>

          {/* 6-digit code input */}
          <div className="flex justify-center gap-2 sm:gap-3 mb-6" onPaste={handlePaste}>
            {code.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { inputRefs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInputChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                disabled={verifying}
                className="w-11 h-14 sm:w-14 sm:h-16 text-center text-xl sm:text-2xl font-mono font-bold rounded-lg bg-white/[0.06] border border-white/[0.1] text-[#FAFAFA] focus:border-[#A78BFA] focus:ring-1 focus:ring-[#A78BFA] outline-none transition-all disabled:opacity-50"
              />
            ))}
          </div>

          {error && (
            <p className="text-red-400 text-sm mb-4">{error}</p>
          )}

          {verifying && (
            <div className="flex items-center justify-center gap-2 text-[#A1A1AA] text-sm">
              <Loader2 className="w-4 h-4 animate-spin" />
              Verifying...
            </div>
          )}

          <button
            onClick={handleSendCode}
            disabled={sending}
            className="text-[#A78BFA] text-sm hover:underline mt-4 disabled:opacity-50"
          >
            {sending ? 'Resending...' : "Didn't receive it? Resend code"}
          </button>
        </>
      )}
    </div>
  );
}
