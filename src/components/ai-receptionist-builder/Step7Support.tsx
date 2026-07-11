'use client';

import { motion } from 'framer-motion';
import { useAIReceptionistBuilderStore } from '@/hooks/useAIReceptionistBuilderStore';
import {
  onboardingTypeOptions,
  knowledgeUpdatesOptions,
  supportLevelOptions,
} from '@/data/aiReceptionistBuilder';
import { Check, Rocket, BookOpen, Headphones } from 'lucide-react';

const onboardingIcons: Record<string, React.ElementType> = {
  self: BookOpen,
  guided: Rocket,
  whiteglove: Headphones,
};

const knowledgeIcons: Record<string, React.ElementType> = {
  self: BookOpen,
  monthly: BookOpen,
  unlimited: BookOpen,
};

const supportIcons: Record<string, React.ElementType> = {
  email: Headphones,
  priority: Headphones,
  'priority-chat': Headphones,
  dedicated: Headphones,
};

export default function Step7Support() {
  const {
    onboardingType,
    setOnboardingType,
    knowledgeUpdates,
    setKnowledgeUpdates,
    supportLevel,
    setSupportLevel,
  } = useAIReceptionistBuilderStore();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-white mb-2">Support & Onboarding</h2>
        <p className="text-[var(--text-secondary)]">
          Choose your onboarding experience and ongoing support level.
        </p>
      </div>

      {/* Onboarding Type Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white flex items-center gap-2">
          <Rocket className="w-5 h-5 text-[var(--accent-purple)]" />
          Onboarding Type
        </h3>
        <p className="text-sm text-[var(--text-muted)]">
          How much help do you need getting started?
        </p>

        <div className="grid sm:grid-cols-3 gap-4">
          {onboardingTypeOptions.map((option) => {
            const isSelected = onboardingType === option.id;
            const Icon = onboardingIcons[option.id] || Rocket;

            return (
              <motion.button
                key={option.id}
                onClick={() => setOnboardingType(option.id)}
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
                  <div className="flex items-center gap-3">
                    <div className={`
                      p-2 rounded-lg
                      ${isSelected
                        ? 'bg-[var(--accent-purple)]/30'
                        : 'bg-[var(--bg-secondary)]'
                      }
                    `}>
                      <Icon className={`w-5 h-5 ${isSelected ? 'text-[var(--accent-purple)]' : 'text-[var(--text-secondary)]'}`} />
                    </div>
                    <span className={`font-medium ${isSelected ? 'text-white' : 'text-[var(--text-secondary)] group-hover:text-white'}`}>
                      {option.label}
                    </span>
                  </div>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-[var(--accent-purple)] flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>

                <p className="text-sm text-[var(--text-muted)] mb-3">{option.description}</p>

                <div className="text-lg font-semibold">
                  {option.oneTimePrice === 0 ? (
                    <span className="text-[var(--accent-blue-light)]">Free</span>
                  ) : (
                    <span className="gradient-text">${option.oneTimePrice.toLocaleString()}</span>
                  )}
                  <span className="text-xs text-[var(--text-muted)] ml-1">one-time</span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Knowledge Base Updates Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[var(--accent-pink)]" />
          Knowledge Base Updates
        </h3>
        <p className="text-sm text-[var(--text-muted)]">
          How do you want to keep your AI&apos;s knowledge current?
        </p>

        <div className="grid sm:grid-cols-3 gap-4">
          {knowledgeUpdatesOptions.map((option) => {
            const isSelected = knowledgeUpdates === option.id;
            const Icon = knowledgeIcons[option.id] || BookOpen;

            return (
              <motion.button
                key={option.id}
                onClick={() => setKnowledgeUpdates(option.id)}
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
                  <div className="flex items-center gap-3">
                    <div className={`
                      p-2 rounded-lg
                      ${isSelected
                        ? 'bg-[var(--accent-purple)]/30'
                        : 'bg-[var(--bg-secondary)]'
                      }
                    `}>
                      <Icon className={`w-5 h-5 ${isSelected ? 'text-[var(--accent-purple)]' : 'text-[var(--text-secondary)]'}`} />
                    </div>
                    <span className={`font-medium ${isSelected ? 'text-white' : 'text-[var(--text-secondary)] group-hover:text-white'}`}>
                      {option.label}
                    </span>
                  </div>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-[var(--accent-purple)] flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>

                <p className="text-sm text-[var(--text-muted)] mb-3">{option.description}</p>

                <div className="text-lg font-semibold">
                  {option.monthlyPrice === 0 ? (
                    <span className="text-[var(--accent-blue-light)]">Free</span>
                  ) : (
                    <span className="gradient-text">${option.monthlyPrice.toLocaleString()}</span>
                  )}
                  <span className="text-xs text-[var(--text-muted)] ml-1">/mo</span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Support Level Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white flex items-center gap-2">
          <Headphones className="w-5 h-5 text-[var(--accent-orange)]" />
          Support Level
        </h3>
        <p className="text-sm text-[var(--text-muted)]">
          What level of ongoing support do you need?
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {supportLevelOptions.map((option) => {
            const isSelected = supportLevel === option.id;
            const Icon = supportIcons[option.id] || Headphones;

            return (
              <motion.button
                key={option.id}
                onClick={() => setSupportLevel(option.id)}
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
                  <div className="flex items-center gap-3">
                    <div className={`
                      p-2 rounded-lg
                      ${isSelected
                        ? 'bg-[var(--accent-purple)]/30'
                        : 'bg-[var(--bg-secondary)]'
                      }
                    `}>
                      <Icon className={`w-5 h-5 ${isSelected ? 'text-[var(--accent-purple)]' : 'text-[var(--text-secondary)]'}`} />
                    </div>
                    <span className={`font-medium ${isSelected ? 'text-white' : 'text-[var(--text-secondary)] group-hover:text-white'}`}>
                      {option.label}
                    </span>
                  </div>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-[var(--accent-purple)] flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>

                <p className="text-sm text-[var(--text-muted)] mb-3">{option.description}</p>

                <div className="text-lg font-semibold">
                  {option.monthlyPrice === 0 ? (
                    <span className="text-[var(--accent-blue-light)]">Free</span>
                  ) : (
                    <span className="gradient-text">${option.monthlyPrice.toLocaleString()}</span>
                  )}
                  <span className="text-xs text-[var(--text-muted)] ml-1">/mo</span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Summary Footer */}
      {(onboardingType || knowledgeUpdates || supportLevel) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-subtle)]"
        >
          <div className="flex flex-wrap gap-4 text-sm">
            {onboardingType && (
              <div className="flex items-center gap-2">
                <span className="text-[var(--text-muted)]">Onboarding:</span>
                <span className="text-white font-medium">
                  {onboardingTypeOptions.find((o) => o.id === onboardingType)?.label}
                </span>
              </div>
            )}
            {knowledgeUpdates && (
              <div className="flex items-center gap-2">
                <span className="text-[var(--text-muted)]">Updates:</span>
                <span className="text-white font-medium">
                  {knowledgeUpdatesOptions.find((o) => o.id === knowledgeUpdates)?.label}
                </span>
              </div>
            )}
            {supportLevel && (
              <div className="flex items-center gap-2">
                <span className="text-[var(--text-muted)]">Support:</span>
                <span className="text-white font-medium">
                  {supportLevelOptions.find((o) => o.id === supportLevel)?.label}
                </span>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
