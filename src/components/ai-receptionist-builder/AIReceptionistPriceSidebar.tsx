'use client';

import { motion } from 'framer-motion';
import { useAIReceptionistBuilderStore } from '@/hooks/useAIReceptionistBuilderStore';
import {
  basePackages,
  phoneNumberTypeOptions,
  additionalLinesOptions,
  coverageAreaOptions,
  monthlyMinutesOptions,
  availabilityOptions,
  callTransferOptions,
  voicemailOptions,
  maxCallDurationOptions,
  languageOptions,
  voiceStyleOptions,
  knowledgeBaseSizeOptions,
  conversationComplexityOptions,
  personalityOptions,
  leadCaptureOptions,
  calendarOptions,
  notificationOptions,
  additionalIntegrationOptions,
  transcriptsOptions,
  aiSummariesOptions,
  analyticsLevelOptions,
  reportingFrequencyOptions,
  onboardingTypeOptions,
  knowledgeUpdatesOptions,
  supportLevelOptions,
  isPromoActive,
} from '@/data/aiReceptionistBuilder';
import { Phone, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';

interface AIReceptionistPriceSidebarProps {
  currentStep: number;
  onGoToSummary: () => void;
}

export default function AIReceptionistPriceSidebar({
  currentStep,
  onGoToSummary,
}: AIReceptionistPriceSidebarProps) {
  const {
    basePackage,
    phoneNumberType,
    additionalLines,
    coverageArea,
    monthlyMinutes,
    availability,
    callTransfer,
    voicemailType,
    maxCallDuration,
    language,
    voiceStyle,
    knowledgeBaseSize,
    conversationComplexity,
    personality,
    leadCapture,
    calendar,
    notifications,
    additionalIntegrations,
    transcripts,
    aiSummaries,
    analyticsLevel,
    reportingFrequency,
    onboardingType,
    knowledgeUpdates,
    supportLevel,
    monthlySubtotal,
    oneTimeTotal,
    promoDiscount,
    monthlyTotal,
    hasCustomQuote,
  } = useAIReceptionistBuilderStore();

  // Get labels
  const basePkg = basePackages.find((p) => p.id === basePackage);
  const phoneTypeLabel = phoneNumberTypeOptions.find((o) => o.id === phoneNumberType)?.label;
  const linesLabel = additionalLinesOptions.find((o) => o.id === additionalLines)?.label;
  const coverageLabel = coverageAreaOptions.find((o) => o.id === coverageArea)?.label;
  const minutesLabel = monthlyMinutesOptions.find((o) => o.id === monthlyMinutes)?.label;
  const availabilityLabel = availabilityOptions.find((o) => o.id === availability)?.label;
  const transferLabel = callTransferOptions.find((o) => o.id === callTransfer)?.label;
  const voicemailLabel = voicemailOptions.find((o) => o.id === voicemailType)?.label;
  const durationLabel = maxCallDurationOptions.find((o) => o.id === maxCallDuration)?.label;
  const languageLabel = languageOptions.find((o) => o.id === language)?.label;
  const voiceLabel = voiceStyleOptions.find((o) => o.id === voiceStyle)?.label;
  const kbLabel = knowledgeBaseSizeOptions.find((o) => o.id === knowledgeBaseSize)?.label;
  const complexityLabel = conversationComplexityOptions.find((o) => o.id === conversationComplexity)?.label;
  const personalityLabel = personalityOptions.find((o) => o.id === personality)?.label;
  const leadLabel = leadCaptureOptions.find((o) => o.id === leadCapture)?.label;
  const calendarLabel = calendarOptions.find((o) => o.id === calendar)?.label;
  const transcriptsLabel = transcriptsOptions.find((o) => o.id === transcripts)?.label;
  const aiSummariesLabel = aiSummariesOptions.find((o) => o.id === aiSummaries)?.label;
  const analyticsLabel = analyticsLevelOptions.find((o) => o.id === analyticsLevel)?.label;
  const reportingLabel = reportingFrequencyOptions.find((o) => o.id === reportingFrequency)?.label;
  const onboardingLabel = onboardingTypeOptions.find((o) => o.id === onboardingType)?.label;
  const updatesLabel = knowledgeUpdatesOptions.find((o) => o.id === knowledgeUpdates)?.label;
  const supportLabel = supportLevelOptions.find((o) => o.id === supportLevel)?.label;

  // Calculate individual prices for breakdown
  const phoneTypeOption = phoneNumberTypeOptions.find((o) => o.id === phoneNumberType);
  const linesOption = additionalLinesOptions.find((o) => o.id === additionalLines);
  const coverageOption = coverageAreaOptions.find((o) => o.id === coverageArea);
  const minutesOption = monthlyMinutesOptions.find((o) => o.id === monthlyMinutes);
  const availOption = availabilityOptions.find((o) => o.id === availability);
  const transferOption = callTransferOptions.find((o) => o.id === callTransfer);
  const voicemailOption = voicemailOptions.find((o) => o.id === voicemailType);
  const durationOption = maxCallDurationOptions.find((o) => o.id === maxCallDuration);
  const langOption = languageOptions.find((o) => o.id === language);
  const voiceOption = voiceStyleOptions.find((o) => o.id === voiceStyle);
  const kbOption = knowledgeBaseSizeOptions.find((o) => o.id === knowledgeBaseSize);
  const complexityOption = conversationComplexityOptions.find((o) => o.id === conversationComplexity);
  const persOption = personalityOptions.find((o) => o.id === personality);
  const leadOption = leadCaptureOptions.find((o) => o.id === leadCapture);
  const calOption = calendarOptions.find((o) => o.id === calendar);
  const transcriptsOption = transcriptsOptions.find((o) => o.id === transcripts);
  const aiSumOption = aiSummariesOptions.find((o) => o.id === aiSummaries);
  const analyticsOption = analyticsLevelOptions.find((o) => o.id === analyticsLevel);
  const reportingOption = reportingFrequencyOptions.find((o) => o.id === reportingFrequency);
  const onboardingOption = onboardingTypeOptions.find((o) => o.id === onboardingType);
  const updatesOption = knowledgeUpdatesOptions.find((o) => o.id === knowledgeUpdates);
  const supportOption = supportLevelOptions.find((o) => o.id === supportLevel);

  // Calculate step-based monthly prices
  const phoneSetupMonthly = (phoneTypeOption?.monthlyPrice || 0) +
    (linesOption?.monthlyPrice || 0) +
    (coverageOption?.monthlyPrice || 0);
  const phoneSetupOneTime = phoneTypeOption?.oneTimePrice || 0;

  const callHandlingMonthly = (minutesOption?.monthlyPrice || 0) +
    (availOption?.monthlyPrice || 0) +
    (transferOption?.monthlyPrice || 0) +
    (voicemailOption?.monthlyPrice || 0) +
    (durationOption?.monthlyPrice || 0);

  const aiCapabilitiesMonthly = (langOption?.monthlyPrice || 0) +
    (voiceOption?.monthlyPrice || 0) +
    (kbOption?.monthlyPrice || 0) +
    (complexityOption?.monthlyPrice || 0) +
    (persOption?.monthlyPrice || 0);
  const aiCapabilitiesOneTime = voiceOption?.oneTimePrice || 0;

  // Calculate integrations
  let integrationsMonthly = (leadOption?.monthlyPrice || 0) + (calOption?.monthlyPrice || 0);
  let integrationsOneTime = (leadOption?.oneTimePrice || 0) + (calOption?.oneTimePrice || 0);

  notifications.forEach((notifId) => {
    const notif = notificationOptions.find((o) => o.id === notifId);
    if (notif) integrationsMonthly += notif.monthlyPrice;
  });

  additionalIntegrations.forEach((intId) => {
    const integration = additionalIntegrationOptions.find((o) => o.id === intId);
    if (integration) {
      integrationsMonthly += integration.monthlyPrice;
      integrationsOneTime += integration.oneTimePrice;
    }
  });

  const reportingMonthly = (transcriptsOption?.monthlyPrice || 0) +
    (aiSumOption?.monthlyPrice || 0) +
    (analyticsOption?.monthlyPrice || 0) +
    (reportingOption?.monthlyPrice || 0);

  const supportMonthly = (updatesOption?.monthlyPrice || 0) + (supportOption?.monthlyPrice || 0);
  const supportOneTime = onboardingOption?.oneTimePrice || 0;

  // Activation fee (one-time from base package)
  const activationFee = basePkg?.activationFee || 0;
  const promoActive = isPromoActive();

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="card p-6 sticky top-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <Phone className="w-5 h-5 text-[var(--accent-purple)]" />
        <h3 className="text-lg font-semibold text-white">Your AI Receptionist</h3>
      </div>

      {hasCustomQuote && (
        <div className="flex items-start gap-3 p-4 bg-[var(--accent-orange)]/10 border border-[var(--accent-orange)]/30 rounded-lg mb-4">
          <AlertCircle className="w-5 h-5 text-[var(--accent-orange)] shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-white font-medium">Custom Quote Required</p>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Some selections require custom pricing.
            </p>
          </div>
        </div>
      )}

      {/* Feature Breakdown - Shows each selected feature with its price */}
      <div className="space-y-1 mb-4 max-h-[320px] overflow-y-auto pr-1">
        {basePkg && (
          <div className="pb-2 mb-2 border-b border-[var(--border-subtle)]">
            <div className="text-xs font-semibold text-[var(--accent-purple)] uppercase tracking-wide mb-1">
              Package
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white">{basePkg.name}</span>
              <span className="text-[var(--text-muted)]">Base</span>
            </div>
          </div>
        )}

        {/* Step 2: Phone Setup */}
        {currentStep >= 2 && (phoneTypeOption || linesOption || coverageOption) && (
          <div className="pb-2 mb-2 border-b border-[var(--border-subtle)]">
            <div className="text-xs font-semibold text-[var(--accent-purple)] uppercase tracking-wide mb-1">
              Phone Setup
            </div>
            {phoneTypeOption && (
              <div className="flex justify-between text-xs py-0.5">
                <span className="text-[var(--text-secondary)]">{phoneTypeOption.label}</span>
                <span className="text-white">${phoneTypeOption.monthlyPrice}/mo</span>
              </div>
            )}
            {linesOption && (
              <div className="flex justify-between text-xs py-0.5">
                <span className="text-[var(--text-secondary)]">{linesOption.label}</span>
                <span className="text-white">{linesOption.monthlyPrice > 0 ? `$${linesOption.monthlyPrice}/mo` : 'Included'}</span>
              </div>
            )}
            {coverageOption && coverageOption.monthlyPrice > 0 && (
              <div className="flex justify-between text-xs py-0.5">
                <span className="text-[var(--text-secondary)]">{coverageOption.label}</span>
                <span className="text-white">${coverageOption.monthlyPrice}/mo</span>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Call Handling */}
        {currentStep >= 3 && (minutesOption || availOption || transferOption || voicemailOption || durationOption) && (
          <div className="pb-2 mb-2 border-b border-[var(--border-subtle)]">
            <div className="text-xs font-semibold text-[var(--accent-purple)] uppercase tracking-wide mb-1">
              Call Handling
            </div>
            {minutesOption && (
              <div className="flex justify-between text-xs py-0.5">
                <span className="text-[var(--text-secondary)]">{minutesOption.label}</span>
                <span className="text-white">${minutesOption.monthlyPrice}/mo</span>
              </div>
            )}
            {availOption && (
              <div className="flex justify-between text-xs py-0.5">
                <span className="text-[var(--text-secondary)]">{availOption.label}</span>
                <span className="text-white">${availOption.monthlyPrice}/mo</span>
              </div>
            )}
            {transferOption && transferOption.monthlyPrice > 0 && (
              <div className="flex justify-between text-xs py-0.5">
                <span className="text-[var(--text-secondary)]">{transferOption.label}</span>
                <span className="text-white">${transferOption.monthlyPrice}/mo</span>
              </div>
            )}
            {voicemailOption && (
              <div className="flex justify-between text-xs py-0.5">
                <span className="text-[var(--text-secondary)]">{voicemailOption.label}</span>
                <span className="text-white">${voicemailOption.monthlyPrice}/mo</span>
              </div>
            )}
            {durationOption && durationOption.monthlyPrice > 0 && (
              <div className="flex justify-between text-xs py-0.5">
                <span className="text-[var(--text-secondary)]">{durationOption.label}</span>
                <span className="text-white">${durationOption.monthlyPrice}/mo</span>
              </div>
            )}
          </div>
        )}

        {/* Step 4: AI Capabilities */}
        {currentStep >= 4 && (langOption || voiceOption || kbOption || complexityOption || persOption) && (
          <div className="pb-2 mb-2 border-b border-[var(--border-subtle)]">
            <div className="text-xs font-semibold text-[var(--accent-purple)] uppercase tracking-wide mb-1">
              AI Capabilities
            </div>
            {langOption && (
              <div className="flex justify-between text-xs py-0.5">
                <span className="text-[var(--text-secondary)]">{langOption.label}</span>
                <span className="text-white">${langOption.monthlyPrice}/mo</span>
              </div>
            )}
            {voiceOption && (
              <div className="flex justify-between text-xs py-0.5">
                <span className="text-[var(--text-secondary)]">{voiceOption.label}</span>
                <span className="text-white">${voiceOption.monthlyPrice}/mo</span>
              </div>
            )}
            {kbOption && (
              <div className="flex justify-between text-xs py-0.5">
                <span className="text-[var(--text-secondary)]">{kbOption.label}</span>
                <span className="text-white">${kbOption.monthlyPrice}/mo</span>
              </div>
            )}
            {complexityOption && (
              <div className="flex justify-between text-xs py-0.5">
                <span className="text-[var(--text-secondary)]">{complexityOption.label}</span>
                <span className="text-white">${complexityOption.monthlyPrice}/mo</span>
              </div>
            )}
            {persOption && persOption.monthlyPrice > 0 && (
              <div className="flex justify-between text-xs py-0.5">
                <span className="text-[var(--text-secondary)]">{persOption.label}</span>
                <span className="text-white">${persOption.monthlyPrice}/mo</span>
              </div>
            )}
          </div>
        )}

        {/* Step 5: Integrations */}
        {currentStep >= 5 && (leadOption || calOption || notifications.length > 0 || additionalIntegrations.length > 0) && (
          <div className="pb-2 mb-2 border-b border-[var(--border-subtle)]">
            <div className="text-xs font-semibold text-[var(--accent-purple)] uppercase tracking-wide mb-1">
              Integrations
            </div>
            {leadOption && leadOption.monthlyPrice > 0 && (
              <div className="flex justify-between text-xs py-0.5">
                <span className="text-[var(--text-secondary)]">{leadOption.label}</span>
                <span className="text-white">${leadOption.monthlyPrice}/mo</span>
              </div>
            )}
            {leadOption && leadOption.monthlyPrice === 0 && (
              <div className="flex justify-between text-xs py-0.5">
                <span className="text-[var(--text-secondary)]">{leadOption.label}</span>
                <span className="text-white">Included</span>
              </div>
            )}
            {calOption && calOption.id !== 'none' && (
              <div className="flex justify-between text-xs py-0.5">
                <span className="text-[var(--text-secondary)]">{calOption.label}</span>
                <span className="text-white">${calOption.monthlyPrice}/mo</span>
              </div>
            )}
            {notifications.map((notifId) => {
              const notif = notificationOptions.find((o) => o.id === notifId);
              if (!notif) return null;
              return (
                <div key={notifId} className="flex justify-between text-xs py-0.5">
                  <span className="text-[var(--text-secondary)]">{notif.label}</span>
                  <span className="text-white">{notif.monthlyPrice > 0 ? `$${notif.monthlyPrice}/mo` : 'Included'}</span>
                </div>
              );
            })}
            {additionalIntegrations.map((intId) => {
              const integration = additionalIntegrationOptions.find((o) => o.id === intId);
              if (!integration) return null;
              return (
                <div key={intId} className="flex justify-between text-xs py-0.5">
                  <span className="text-[var(--text-secondary)]">{integration.label}</span>
                  <span className="text-white">${integration.monthlyPrice}/mo</span>
                </div>
              );
            })}
          </div>
        )}

        {/* Step 6: Reporting */}
        {currentStep >= 6 && (transcriptsOption || aiSumOption || analyticsOption || reportingOption) && (
          <div className="pb-2 mb-2 border-b border-[var(--border-subtle)]">
            <div className="text-xs font-semibold text-[var(--accent-purple)] uppercase tracking-wide mb-1">
              Reporting & Analytics
            </div>
            {transcriptsOption && transcriptsOption.id !== 'none' && (
              <div className="flex justify-between text-xs py-0.5">
                <span className="text-[var(--text-secondary)]">{transcriptsOption.label}</span>
                <span className="text-white">${transcriptsOption.monthlyPrice}/mo</span>
              </div>
            )}
            {aiSumOption && aiSumOption.id !== 'none' && (
              <div className="flex justify-between text-xs py-0.5">
                <span className="text-[var(--text-secondary)]">{aiSumOption.label}</span>
                <span className="text-white">${aiSumOption.monthlyPrice}/mo</span>
              </div>
            )}
            {analyticsOption && analyticsOption.monthlyPrice > 0 && (
              <div className="flex justify-between text-xs py-0.5">
                <span className="text-[var(--text-secondary)]">{analyticsOption.label}</span>
                <span className="text-white">${analyticsOption.monthlyPrice}/mo</span>
              </div>
            )}
            {analyticsOption && analyticsOption.monthlyPrice === 0 && (
              <div className="flex justify-between text-xs py-0.5">
                <span className="text-[var(--text-secondary)]">{analyticsOption.label}</span>
                <span className="text-white">Included</span>
              </div>
            )}
            {reportingOption && reportingOption.id !== 'none' && (
              <div className="flex justify-between text-xs py-0.5">
                <span className="text-[var(--text-secondary)]">{reportingOption.label}</span>
                <span className="text-white">${reportingOption.monthlyPrice}/mo</span>
              </div>
            )}
          </div>
        )}

        {/* Step 7: Support */}
        {currentStep >= 7 && (onboardingOption || updatesOption || supportOption) && (
          <div className="pb-2 mb-2 border-b border-[var(--border-subtle)]">
            <div className="text-xs font-semibold text-[var(--accent-purple)] uppercase tracking-wide mb-1">
              Support & Onboarding
            </div>
            {onboardingOption && onboardingOption.oneTimePrice > 0 && (
              <div className="flex justify-between text-xs py-0.5">
                <span className="text-[var(--text-secondary)]">{onboardingOption.label}</span>
                <span className="text-[var(--accent-orange)]">${onboardingOption.oneTimePrice} setup</span>
              </div>
            )}
            {onboardingOption && onboardingOption.oneTimePrice === 0 && (
              <div className="flex justify-between text-xs py-0.5">
                <span className="text-[var(--text-secondary)]">{onboardingOption.label}</span>
                <span className="text-white">Included</span>
              </div>
            )}
            {updatesOption && updatesOption.monthlyPrice > 0 && (
              <div className="flex justify-between text-xs py-0.5">
                <span className="text-[var(--text-secondary)]">{updatesOption.label}</span>
                <span className="text-white">${updatesOption.monthlyPrice}/mo</span>
              </div>
            )}
            {supportOption && supportOption.monthlyPrice > 0 && (
              <div className="flex justify-between text-xs py-0.5">
                <span className="text-[var(--text-secondary)]">{supportOption.label}</span>
                <span className="text-white">${supportOption.monthlyPrice}/mo</span>
              </div>
            )}
            {supportOption && supportOption.monthlyPrice === 0 && (
              <div className="flex justify-between text-xs py-0.5">
                <span className="text-[var(--text-secondary)]">{supportOption.label}</span>
                <span className="text-white">Included</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Monthly Total */}
      <div className="border-t border-[var(--border-subtle)] pt-4 space-y-3">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-white font-medium">Monthly Total</span>
            <motion.span
              key={monthlyTotal}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              className="text-xl font-bold text-[var(--accent-pink)]"
            >
              {hasCustomQuote ? 'Custom' : `$${monthlyTotal.toLocaleString()}/mo`}
            </motion.span>
          </div>
        </div>

        {/* One-Time Costs Section */}
        {(oneTimeTotal > 0 || activationFee > 0) && (
          <div className="pt-2 border-t border-[var(--border-subtle)] space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-[var(--text-muted)]">Activation Fee</span>
              <span className="text-white">${activationFee}</span>
            </div>
            {phoneSetupOneTime + aiCapabilitiesOneTime + integrationsOneTime + supportOneTime > 0 && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-[var(--text-muted)]">Setup Fees</span>
                <span className="text-white">
                  ${phoneSetupOneTime + aiCapabilitiesOneTime + integrationsOneTime + supportOneTime}
                </span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-white font-medium">One-Time Costs</span>
              <span className="text-lg font-bold text-white">
                ${(oneTimeTotal + promoDiscount).toLocaleString()}
              </span>
            </div>
          </div>
        )}

        {/* Promo Discount */}
        {promoActive && promoDiscount > 0 && (
          <div className="pt-2 border-t border-[var(--border-subtle)]">
            <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
              <Sparkles className="w-4 h-4 text-green-400" />
              <div className="flex-1">
                <p className="text-sm text-green-400 font-medium">Launch Promo Active!</p>
                <p className="text-xs text-[var(--text-secondary)]">50% off activation fee</p>
              </div>
              <span className="text-green-400 font-semibold">-${promoDiscount}</span>
            </div>
          </div>
        )}

        {/* Final One-Time After Promo */}
        {promoActive && promoDiscount > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-white font-medium">One-Time (After Promo)</span>
            <motion.span
              key={oneTimeTotal}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              className="text-lg font-bold gradient-text"
            >
              ${oneTimeTotal.toLocaleString()}
            </motion.span>
          </div>
        )}
      </div>

      {/* Due Today */}
      {!hasCustomQuote && (oneTimeTotal + monthlyTotal) > 0 && (
        <div className="mt-4 pt-3 border-t-2 border-[var(--accent-purple)]/50">
          <div className="flex justify-between items-center">
            <span className="text-white font-bold">Due Today</span>
            <motion.span
              key={`due-${oneTimeTotal}-${monthlyTotal}`}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              className="text-xl font-bold gradient-text"
            >
              ${(oneTimeTotal + monthlyTotal).toLocaleString()}
            </motion.span>
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Setup + first month&apos;s service
          </p>
        </div>
      )}

      {/* Go to Summary Button */}
      {currentStep < 8 && basePackage && (
        <motion.button
          onClick={onGoToSummary}
          className="w-full mt-6 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--accent-purple)] hover:text-white transition-all"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Skip to Summary
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      )}

      <p className="text-[10px] text-[var(--text-muted)] mt-4">
        *Prices do not include taxes. Overages billed at package rate.
      </p>
    </motion.div>
  );
}
