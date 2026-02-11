'use client';

import { motion } from 'framer-motion';
import { useAIReceptionistBuilderStore } from '@/hooks/useAIReceptionistBuilderStore';
import {
  monthlyMinutesOptions,
  availabilityOptions,
  callTransferOptions,
  voicemailOptions,
  maxCallDurationOptions,
} from '@/data/aiReceptionistBuilder';
import { Check, Clock, Phone, Voicemail, PhoneForwarded, Timer } from 'lucide-react';

export default function Step3CallHandling() {
  const {
    monthlyMinutes,
    setMonthlyMinutes,
    availability,
    setAvailability,
    callTransfer,
    setCallTransfer,
    voicemailType,
    setVoicemailType,
    maxCallDuration,
    setMaxCallDuration,
  } = useAIReceptionistBuilderStore();

  const formatPrice = (price: number, customQuote?: boolean) => {
    if (customQuote) return 'Contact for pricing';
    if (price === 0) return 'Included';
    return `+$${price}/mo`;
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-white mb-2">Configure your call handling</h2>
        <p className="text-[var(--text-secondary)]">
          Set up how your AI receptionist handles incoming calls.
        </p>
      </div>

      {/* Monthly Minutes Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Phone className="w-5 h-5 text-[var(--accent-purple)]" />
          <h3 className="text-lg font-medium text-white">Monthly Minutes</h3>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {monthlyMinutesOptions.map((option) => {
            const isSelected = monthlyMinutes === option.id;

            return (
              <motion.button
                key={option.id}
                onClick={() => setMonthlyMinutes(option.id)}
                className={`
                  p-4 rounded-xl text-left transition-all group
                  ${isSelected
                    ? 'bg-gradient-to-br from-[var(--accent-purple)]/20 to-[var(--accent-pink)]/20 border-2 border-[var(--accent-purple)]'
                    : 'bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--accent-purple)]/50'
                  }
                `}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-medium ${isSelected ? 'text-white' : 'text-[var(--text-secondary)] group-hover:text-white'}`}>
                    {option.label}
                  </span>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-[var(--accent-purple)] flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <div className={`text-sm ${option.customQuote ? 'text-[var(--accent-orange)]' : 'gradient-text'} font-medium`}>
                  {formatPrice(option.monthlyPrice, option.customQuote)}
                </div>
                {!option.customQuote && option.overageRate > 0 && (
                  <div className="text-xs text-[var(--text-muted)] mt-1">
                    ${option.overageRate.toFixed(2)}/min overage
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Availability Hours Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-[var(--accent-purple)]" />
          <h3 className="text-lg font-medium text-white">Availability Hours</h3>
        </div>
        <div className="grid sm:grid-cols-3 gap-3">
          {availabilityOptions.map((option) => {
            const isSelected = availability === option.id;

            return (
              <motion.button
                key={option.id}
                onClick={() => setAvailability(option.id)}
                className={`
                  p-4 rounded-xl text-left transition-all group
                  ${isSelected
                    ? 'bg-gradient-to-br from-[var(--accent-purple)]/20 to-[var(--accent-pink)]/20 border-2 border-[var(--accent-purple)]'
                    : 'bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--accent-purple)]/50'
                  }
                `}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-medium ${isSelected ? 'text-white' : 'text-[var(--text-secondary)] group-hover:text-white'}`}>
                    {option.label}
                  </span>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-[var(--accent-purple)] flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <div className="text-sm text-[var(--text-muted)] mb-2">{option.description}</div>
                <div className="text-sm gradient-text font-medium">
                  {formatPrice(option.monthlyPrice)}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Call Transfer Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <PhoneForwarded className="w-5 h-5 text-[var(--accent-purple)]" />
          <h3 className="text-lg font-medium text-white">Call Transfer Capability</h3>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {callTransferOptions.map((option) => {
            const isSelected = callTransfer === option.id;

            return (
              <motion.button
                key={option.id}
                onClick={() => setCallTransfer(option.id)}
                className={`
                  p-4 rounded-xl text-left transition-all group
                  ${isSelected
                    ? 'bg-gradient-to-br from-[var(--accent-purple)]/20 to-[var(--accent-pink)]/20 border-2 border-[var(--accent-purple)]'
                    : 'bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--accent-purple)]/50'
                  }
                `}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-medium ${isSelected ? 'text-white' : 'text-[var(--text-secondary)] group-hover:text-white'}`}>
                    {option.label}
                  </span>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-[var(--accent-purple)] flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <div className="text-sm text-[var(--text-muted)] mb-2">{option.description}</div>
                <div className="text-sm gradient-text font-medium">
                  {formatPrice(option.monthlyPrice)}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Voicemail & Fallback Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Voicemail className="w-5 h-5 text-[var(--accent-purple)]" />
          <h3 className="text-lg font-medium text-white">Voicemail & Fallback</h3>
        </div>
        <div className="grid sm:grid-cols-3 gap-3">
          {voicemailOptions.map((option) => {
            const isSelected = voicemailType === option.id;

            return (
              <motion.button
                key={option.id}
                onClick={() => setVoicemailType(option.id)}
                className={`
                  p-4 rounded-xl text-left transition-all group
                  ${isSelected
                    ? 'bg-gradient-to-br from-[var(--accent-purple)]/20 to-[var(--accent-pink)]/20 border-2 border-[var(--accent-purple)]'
                    : 'bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--accent-purple)]/50'
                  }
                `}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-medium ${isSelected ? 'text-white' : 'text-[var(--text-secondary)] group-hover:text-white'}`}>
                    {option.label}
                  </span>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-[var(--accent-purple)] flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <div className="text-sm text-[var(--text-muted)] mb-2">{option.description}</div>
                <div className="text-sm gradient-text font-medium">
                  {formatPrice(option.monthlyPrice)}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Maximum Call Duration Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Timer className="w-5 h-5 text-[var(--accent-purple)]" />
          <h3 className="text-lg font-medium text-white">Maximum Call Duration</h3>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {maxCallDurationOptions.map((option) => {
            const isSelected = maxCallDuration === option.id;

            return (
              <motion.button
                key={option.id}
                onClick={() => setMaxCallDuration(option.id)}
                className={`
                  p-4 rounded-xl text-left transition-all group
                  ${isSelected
                    ? 'bg-gradient-to-br from-[var(--accent-purple)]/20 to-[var(--accent-pink)]/20 border-2 border-[var(--accent-purple)]'
                    : 'bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--accent-purple)]/50'
                  }
                `}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-medium ${isSelected ? 'text-white' : 'text-[var(--text-secondary)] group-hover:text-white'}`}>
                    {option.label}
                  </span>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-[var(--accent-purple)] flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <div className="text-sm gradient-text font-medium">
                  {formatPrice(option.monthlyPrice)}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Info Note */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg"
      >
        <p className="text-sm text-[var(--text-muted)]">
          <span className="text-[var(--accent-orange)] font-medium">Tip:</span> If you expect high call volumes or need 24/7 coverage,
          consider selecting more minutes and extended availability to avoid overage charges.
        </p>
      </motion.div>
    </div>
  );
}
