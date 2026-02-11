'use client';

import { motion } from 'framer-motion';
import { useAIReceptionistBuilderStore } from '@/hooks/useAIReceptionistBuilderStore';
import {
  leadCaptureOptions,
  calendarOptions,
  notificationOptions,
  additionalIntegrationOptions,
} from '@/data/aiReceptionistBuilder';
import { Check, Plus } from 'lucide-react';

export default function Step5Integrations() {
  const {
    leadCapture,
    setLeadCapture,
    calendar,
    setCalendar,
    notifications,
    toggleNotification,
    additionalIntegrations,
    toggleAdditionalIntegration,
  } = useAIReceptionistBuilderStore();

  // Format price display
  const formatPrice = (monthlyPrice: number, oneTimePrice?: number) => {
    const parts: string[] = [];
    if (monthlyPrice > 0) {
      parts.push(`+$${monthlyPrice}/mo`);
    }
    if (oneTimePrice && oneTimePrice > 0) {
      parts.push(`+$${oneTimePrice} setup`);
    }
    if (parts.length === 0) {
      return 'Included';
    }
    return parts.join(' ');
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-white mb-2">Connect your AI receptionist</h2>
        <p className="text-[var(--text-secondary)]">
          Configure where leads are captured, calendar integrations, and how you receive notifications.
        </p>
      </div>

      {/* Lead Capture Destination Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">Lead Capture Destination</h3>
        <p className="text-sm text-[var(--text-muted)]">Where should we send your captured leads?</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {leadCaptureOptions.map((option) => {
            const isSelected = leadCapture === option.id;

            return (
              <motion.button
                key={option.id}
                onClick={() => setLeadCapture(option.id)}
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

                <div className="flex items-center gap-2 flex-wrap">
                  {option.monthlyPrice === 0 && option.oneTimePrice === 0 ? (
                    <span className="text-sm font-medium text-green-400">Included</span>
                  ) : (
                    <>
                      {option.monthlyPrice > 0 && (
                        <span className="text-sm font-semibold gradient-text">
                          +${option.monthlyPrice}
                          <span className="text-[var(--text-muted)] font-normal">/mo</span>
                        </span>
                      )}
                      {option.oneTimePrice > 0 && (
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-[var(--accent-orange)]/20 text-[var(--accent-orange)] border border-[var(--accent-orange)]/30">
                          +${option.oneTimePrice} setup
                        </span>
                      )}
                    </>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Calendar & Scheduling Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">Calendar & Scheduling</h3>
        <p className="text-sm text-[var(--text-muted)]">Enable appointment booking during calls</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {calendarOptions.map((option) => {
            const isSelected = calendar === option.id;

            return (
              <motion.button
                key={option.id}
                onClick={() => setCalendar(option.id)}
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

                <div className="flex items-center gap-2 flex-wrap">
                  {option.monthlyPrice === 0 && option.oneTimePrice === 0 ? (
                    <span className="text-sm font-medium text-[var(--text-muted)]">
                      {option.id === 'none' ? 'No scheduling' : 'Included'}
                    </span>
                  ) : (
                    <>
                      {option.monthlyPrice > 0 && (
                        <span className="text-sm font-semibold gradient-text">
                          +${option.monthlyPrice}
                          <span className="text-[var(--text-muted)] font-normal">/mo</span>
                        </span>
                      )}
                      {option.oneTimePrice > 0 && (
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-[var(--accent-orange)]/20 text-[var(--accent-orange)] border border-[var(--accent-orange)]/30">
                          +${option.oneTimePrice} setup
                        </span>
                      )}
                    </>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Notifications Section - Multi-select */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">Notifications</h3>
        <p className="text-sm text-[var(--text-muted)]">
          How would you like to be notified about calls and leads? (Select multiple)
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {notificationOptions.map((option) => {
            const isSelected = notifications.includes(option.id);

            return (
              <motion.button
                key={option.id}
                onClick={() => toggleNotification(option.id)}
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
                  {isSelected ? (
                    <div className="w-5 h-5 rounded-full bg-[var(--accent-purple)] flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-[var(--border-subtle)] flex items-center justify-center group-hover:border-[var(--accent-purple)]/50">
                      <Plus className="w-3 h-3 text-[var(--text-muted)] group-hover:text-[var(--accent-purple)]" />
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {option.monthlyPrice === 0 ? (
                    <span className="text-sm font-medium text-green-400">Included</span>
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

      {/* Additional Integrations Section - Multi-select */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">Additional Integrations</h3>
        <p className="text-sm text-[var(--text-muted)]">
          Connect to automation platforms and custom systems (Select multiple)
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {additionalIntegrationOptions.map((option) => {
            const isSelected = additionalIntegrations.includes(option.id);

            return (
              <motion.button
                key={option.id}
                onClick={() => toggleAdditionalIntegration(option.id)}
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
                  {isSelected ? (
                    <div className="w-5 h-5 rounded-full bg-[var(--accent-purple)] flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-[var(--border-subtle)] flex items-center justify-center group-hover:border-[var(--accent-purple)]/50">
                      <Plus className="w-3 h-3 text-[var(--text-muted)] group-hover:text-[var(--accent-purple)]" />
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {option.monthlyPrice > 0 && (
                    <span className="text-sm font-semibold gradient-text">
                      +${option.monthlyPrice}
                      <span className="text-[var(--text-muted)] font-normal">/mo</span>
                    </span>
                  )}
                  {option.oneTimePrice > 0 && (
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-[var(--accent-orange)]/20 text-[var(--accent-orange)] border border-[var(--accent-orange)]/30">
                      +${option.oneTimePrice} setup
                    </span>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Summary of selections */}
      {(notifications.length > 0 || additionalIntegrations.length > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-lg"
        >
          <p className="text-sm text-[var(--text-secondary)]">
            <span className="text-white font-medium">Selected integrations:</span>
            {notifications.length > 0 && (
              <span className="ml-2 px-2 py-1 bg-[var(--accent-purple)]/20 rounded text-[var(--accent-purple)] text-xs">
                {notifications.length} notification{notifications.length > 1 ? 's' : ''}
              </span>
            )}
            {additionalIntegrations.length > 0 && (
              <span className="ml-2 px-2 py-1 bg-[var(--accent-pink)]/20 rounded text-[var(--accent-pink)] text-xs">
                {additionalIntegrations.length} integration{additionalIntegrations.length > 1 ? 's' : ''}
              </span>
            )}
          </p>
        </motion.div>
      )}
    </div>
  );
}
