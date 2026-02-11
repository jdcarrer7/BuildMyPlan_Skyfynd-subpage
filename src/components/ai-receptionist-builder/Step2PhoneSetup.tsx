'use client';

import { motion } from 'framer-motion';
import { useAIReceptionistBuilderStore } from '@/hooks/useAIReceptionistBuilderStore';
import {
  phoneNumberTypeOptions,
  additionalLinesOptions,
  coverageAreaOptions,
} from '@/data/aiReceptionistBuilder';
import { Check, Phone, Hash, Globe, MessageSquare } from 'lucide-react';

export default function Step2PhoneSetup() {
  const {
    phoneNumberType,
    setPhoneNumberType,
    additionalLines,
    setAdditionalLines,
    coverageArea,
    setCoverageArea,
  } = useAIReceptionistBuilderStore();

  const formatPrice = (monthlyPrice: number, oneTimePrice?: number, customQuote?: boolean) => {
    if (customQuote) {
      return <span className="text-[var(--accent-orange)]">Contact for pricing</span>;
    }

    const parts = [];
    if (monthlyPrice > 0) {
      parts.push(`+$${monthlyPrice}/mo`);
    }
    if (oneTimePrice && oneTimePrice > 0) {
      parts.push(`+$${oneTimePrice} one-time`);
    }

    if (parts.length === 0) {
      return <span className="text-[var(--text-muted)]">Included</span>;
    }

    return <span className="text-[var(--accent-purple)]">{parts.join(' ')}</span>;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-white mb-2">Phone Setup</h2>
        <p className="text-[var(--text-secondary)]">
          Configure your phone number settings and coverage options.
        </p>
      </div>

      {/* Phone Number Type */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Phone className="w-5 h-5 text-[var(--accent-purple)]" />
          <h3 className="text-lg font-medium text-white">Phone Number Type</h3>
        </div>
        <p className="text-sm text-[var(--text-secondary)]">
          Choose the type of phone number for your AI receptionist.
        </p>

        <div className="grid sm:grid-cols-3 gap-3">
          {phoneNumberTypeOptions.map((option) => {
            const isSelected = phoneNumberType === option.id;

            return (
              <motion.button
                key={option.id}
                onClick={() => setPhoneNumberType(option.id)}
                className={`
                  relative w-full p-4 rounded-xl text-left transition-all group
                  ${isSelected
                    ? 'bg-gradient-to-br from-[var(--accent-purple)]/20 to-[var(--accent-pink)]/20 border-2 border-[var(--accent-purple)]'
                    : 'bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--accent-purple)]/50'
                  }
                `}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className={`font-medium ${isSelected ? 'text-white' : 'text-[var(--text-secondary)] group-hover:text-white'}`}>
                    {option.label}
                  </span>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-[var(--accent-purple)] flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <p className="text-xs text-[var(--text-muted)] mb-2">
                  {option.description}
                </p>
                <div className="text-sm">
                  {formatPrice(option.monthlyPrice, option.oneTimePrice)}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Additional Lines */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Hash className="w-5 h-5 text-[var(--accent-purple)]" />
          <h3 className="text-lg font-medium text-white">Additional Lines</h3>
        </div>
        <p className="text-sm text-[var(--text-secondary)]">
          How many concurrent call lines do you need?
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {additionalLinesOptions.map((option) => {
            const isSelected = additionalLines === option.id;

            return (
              <motion.button
                key={option.id}
                onClick={() => setAdditionalLines(option.id)}
                className={`
                  relative w-full p-4 rounded-xl text-center transition-all group
                  ${isSelected
                    ? 'bg-gradient-to-br from-[var(--accent-purple)]/20 to-[var(--accent-pink)]/20 border-2 border-[var(--accent-purple)]'
                    : 'bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--accent-purple)]/50'
                  }
                `}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[var(--accent-purple)] flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
                <span className={`block font-medium mb-1 ${isSelected ? 'text-white' : 'text-[var(--text-secondary)] group-hover:text-white'}`}>
                  {option.label}
                </span>
                <div className="text-sm">
                  {formatPrice(option.monthlyPrice, undefined, option.customQuote)}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Coverage Area */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-[var(--accent-purple)]" />
          <h3 className="text-lg font-medium text-white">Coverage Area</h3>
        </div>
        <p className="text-sm text-[var(--text-secondary)]">
          Select the geographic regions you need to cover.
        </p>

        <div className="grid sm:grid-cols-3 gap-3">
          {coverageAreaOptions.map((option) => {
            const isSelected = coverageArea === option.id;

            return (
              <motion.button
                key={option.id}
                onClick={() => setCoverageArea(option.id)}
                className={`
                  relative w-full p-4 rounded-xl text-left transition-all group
                  ${isSelected
                    ? 'bg-gradient-to-br from-[var(--accent-purple)]/20 to-[var(--accent-pink)]/20 border-2 border-[var(--accent-purple)]'
                    : 'bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--accent-purple)]/50'
                  }
                `}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className={`font-medium ${isSelected ? 'text-white' : 'text-[var(--text-secondary)] group-hover:text-white'}`}>
                    {option.label}
                  </span>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-[var(--accent-purple)] flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <div className="text-sm">
                  {formatPrice(option.monthlyPrice, undefined, option.customQuote)}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Info Note */}
      {(phoneNumberType || additionalLines || coverageArea) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-lg flex items-start gap-3"
        >
          <MessageSquare className="w-5 h-5 text-[var(--accent-purple)] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-[var(--text-secondary)]">
              Your phone number will be provisioned within 24-48 hours of activation. Vanity numbers are subject to availability and may require additional processing time.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
