'use client';

import { motion } from 'framer-motion';
import { useAIReceptionistBuilderStore } from '@/hooks/useAIReceptionistBuilderStore';
import {
  transcriptsOptions,
  aiSummariesOptions,
  analyticsLevelOptions,
  reportingFrequencyOptions,
} from '@/data/aiReceptionistBuilder';
import { Check } from 'lucide-react';

export default function Step6Reporting() {
  const {
    transcripts,
    setTranscripts,
    aiSummaries,
    setAiSummaries,
    analyticsLevel,
    setAnalyticsLevel,
    reportingFrequency,
    setReportingFrequency,
  } = useAIReceptionistBuilderStore();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-white mb-2">Reporting & Analytics</h2>
        <p className="text-[var(--text-secondary)]">
          Choose how you want to track and analyze your AI receptionist&apos;s performance.
        </p>
      </div>

      {/* Call Transcripts Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">Call Transcripts</h3>
        <p className="text-sm text-[var(--text-muted)]">Get text transcripts of every call</p>
        <div className="grid sm:grid-cols-2 gap-4">
          {transcriptsOptions.map((option) => {
            const isSelected = transcripts === option.id;

            return (
              <motion.button
                key={option.id}
                onClick={() => setTranscripts(option.id)}
                className={`
                  w-full p-4 rounded-xl text-left transition-all group
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

                <div className="flex items-center gap-2">
                  {option.monthlyPrice === 0 ? (
                    <span className="text-sm font-medium text-[var(--text-muted)]">
                      {option.id === 'none' ? 'Not included' : 'Included'}
                    </span>
                  ) : (
                    <span className="text-sm font-semibold gradient-text">
                      +${option.monthlyPrice}
                      <span className="text-[var(--text-muted)] font-normal">/mo</span>
                    </span>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* AI Call Summaries Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">AI Call Summaries</h3>
        <p className="text-sm text-[var(--text-muted)]">AI-generated summaries highlighting key points from each call</p>
        <div className="grid sm:grid-cols-2 gap-4">
          {aiSummariesOptions.map((option) => {
            const isSelected = aiSummaries === option.id;

            return (
              <motion.button
                key={option.id}
                onClick={() => setAiSummaries(option.id)}
                className={`
                  w-full p-4 rounded-xl text-left transition-all group
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

                <div className="flex items-center gap-2">
                  {option.monthlyPrice === 0 ? (
                    <span className="text-sm font-medium text-[var(--text-muted)]">
                      {option.id === 'none' ? 'Not included' : 'Included'}
                    </span>
                  ) : (
                    <span className="text-sm font-semibold gradient-text">
                      +${option.monthlyPrice}
                      <span className="text-[var(--text-muted)] font-normal">/mo</span>
                    </span>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Analytics Dashboard Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">Analytics Dashboard</h3>
        <p className="text-sm text-[var(--text-muted)]">Choose the level of analytics and insights</p>
        <div className="grid sm:grid-cols-3 gap-4">
          {analyticsLevelOptions.map((option) => {
            const isSelected = analyticsLevel === option.id;

            return (
              <motion.button
                key={option.id}
                onClick={() => setAnalyticsLevel(option.id)}
                className={`
                  w-full p-4 rounded-xl text-left transition-all group
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

                <p className="text-xs text-[var(--text-muted)] mb-2">{option.description}</p>

                <div className="flex items-center gap-2">
                  {option.monthlyPrice === 0 ? (
                    <span className="text-sm font-medium text-[var(--accent-blue-light)]">Included</span>
                  ) : (
                    <span className="text-sm font-semibold gradient-text">
                      +${option.monthlyPrice}
                      <span className="text-[var(--text-muted)] font-normal">/mo</span>
                    </span>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Reporting Frequency Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">Reporting Frequency</h3>
        <p className="text-sm text-[var(--text-muted)]">How often do you want to receive performance reports?</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {reportingFrequencyOptions.map((option) => {
            const isSelected = reportingFrequency === option.id;

            return (
              <motion.button
                key={option.id}
                onClick={() => setReportingFrequency(option.id)}
                className={`
                  w-full p-4 rounded-xl text-left transition-all group
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

                <div className="flex items-center gap-2">
                  {option.monthlyPrice === 0 ? (
                    <span className="text-sm font-medium text-[var(--accent-blue-light)]">Included</span>
                  ) : (
                    <span className="text-sm font-semibold gradient-text">
                      +${option.monthlyPrice}
                      <span className="text-[var(--text-muted)] font-normal">/mo</span>
                    </span>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Summary of reporting selections */}
      {(transcripts === 'full' || aiSummaries === 'enabled' || analyticsLevel !== 'basic' || reportingFrequency !== 'none') && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-lg"
        >
          <p className="text-sm text-[var(--text-secondary)]">
            <span className="text-white font-medium">Reporting features:</span>
            {transcripts === 'full' && (
              <span className="ml-2 px-2 py-1 bg-[var(--accent-purple)]/20 rounded text-[var(--accent-purple)] text-xs">
                Transcripts
              </span>
            )}
            {aiSummaries === 'enabled' && (
              <span className="ml-2 px-2 py-1 bg-[var(--accent-pink)]/20 rounded text-[var(--accent-pink)] text-xs">
                AI Summaries
              </span>
            )}
            {analyticsLevel !== 'basic' && (
              <span className="ml-2 px-2 py-1 bg-[var(--accent-orange)]/20 rounded text-[var(--accent-orange)] text-xs">
                {analyticsLevel === 'standard' ? 'Standard' : 'Advanced'} Analytics
              </span>
            )}
            {reportingFrequency !== 'none' && (
              <span className="ml-2 px-2 py-1 bg-[var(--accent-blue)]/20 rounded text-[var(--accent-blue-light)] text-xs">
                {reportingFrequencyOptions.find((o) => o.id === reportingFrequency)?.label}
              </span>
            )}
          </p>
        </motion.div>
      )}
    </div>
  );
}
