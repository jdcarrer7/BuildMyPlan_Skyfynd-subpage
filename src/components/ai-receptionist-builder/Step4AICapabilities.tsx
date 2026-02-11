'use client';

import { motion } from 'framer-motion';
import { useAIReceptionistBuilderStore } from '@/hooks/useAIReceptionistBuilderStore';
import {
  languageOptions,
  voiceStyleOptions,
  knowledgeBaseSizeOptions,
  conversationComplexityOptions,
  personalityOptions,
} from '@/data/aiReceptionistBuilder';
import { Check, Languages, Mic, BookOpen, MessageSquare, UserCircle } from 'lucide-react';

export default function Step4AICapabilities() {
  const {
    language,
    setLanguage,
    voiceStyle,
    setVoiceStyle,
    knowledgeBaseSize,
    setKnowledgeBaseSize,
    conversationComplexity,
    setConversationComplexity,
    personality,
    setPersonality,
  } = useAIReceptionistBuilderStore();

  const formatMonthlyPrice = (price: number) => {
    if (price === 0) return 'Included';
    return `+$${price}/mo`;
  };

  const formatOneTimePrice = (price: number) => {
    if (price === 0) return null;
    return `+$${price} setup`;
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-white mb-2">Configure AI capabilities</h2>
        <p className="text-[var(--text-secondary)]">
          Customize how your AI receptionist communicates and responds to callers.
        </p>
      </div>

      {/* Language Support Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Languages className="w-5 h-5 text-[var(--accent-purple)]" />
          <h3 className="text-lg font-medium text-white">Language Support</h3>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {languageOptions.map((option) => {
            const isSelected = language === option.id;

            return (
              <motion.button
                key={option.id}
                onClick={() => setLanguage(option.id)}
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
                  {formatMonthlyPrice(option.monthlyPrice)}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Voice Style Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Mic className="w-5 h-5 text-[var(--accent-purple)]" />
          <h3 className="text-lg font-medium text-white">Voice Style</h3>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {voiceStyleOptions.map((option) => {
            const isSelected = voiceStyle === option.id;
            const oneTimeText = formatOneTimePrice(option.oneTimePrice);

            return (
              <motion.button
                key={option.id}
                onClick={() => setVoiceStyle(option.id)}
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
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm gradient-text font-medium">
                    {formatMonthlyPrice(option.monthlyPrice)}
                  </span>
                  {oneTimeText && (
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-[var(--accent-orange)]/20 text-[var(--accent-orange)] border border-[var(--accent-orange)]/30">
                      {oneTimeText}
                    </span>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Knowledge Base Size Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[var(--accent-purple)]" />
          <h3 className="text-lg font-medium text-white">Knowledge Base Size</h3>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {knowledgeBaseSizeOptions.map((option) => {
            const isSelected = knowledgeBaseSize === option.id;

            return (
              <motion.button
                key={option.id}
                onClick={() => setKnowledgeBaseSize(option.id)}
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
                  <span className={`font-medium text-sm ${isSelected ? 'text-white' : 'text-[var(--text-secondary)] group-hover:text-white'}`}>
                    {option.label}
                  </span>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-[var(--accent-purple)] flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <div className="text-sm gradient-text font-medium">
                  {formatMonthlyPrice(option.monthlyPrice)}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Conversation Complexity Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-[var(--accent-purple)]" />
          <h3 className="text-lg font-medium text-white">Conversation Complexity</h3>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {conversationComplexityOptions.map((option) => {
            const isSelected = conversationComplexity === option.id;

            return (
              <motion.button
                key={option.id}
                onClick={() => setConversationComplexity(option.id)}
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
                  {formatMonthlyPrice(option.monthlyPrice)}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* AI Personality Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <UserCircle className="w-5 h-5 text-[var(--accent-purple)]" />
          <h3 className="text-lg font-medium text-white">AI Personality</h3>
        </div>
        <div className="grid sm:grid-cols-3 gap-3">
          {personalityOptions.map((option) => {
            const isSelected = personality === option.id;

            return (
              <motion.button
                key={option.id}
                onClick={() => setPersonality(option.id)}
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
                  {formatMonthlyPrice(option.monthlyPrice)}
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
          <span className="text-[var(--accent-orange)] font-medium">Note:</span> Voice style setup fees are one-time charges for initial configuration.
          Custom and cloned voices require additional onboarding time to perfect your brand voice.
        </p>
      </motion.div>
    </div>
  );
}
