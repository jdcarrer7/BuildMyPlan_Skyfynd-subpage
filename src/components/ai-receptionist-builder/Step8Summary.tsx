'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAIReceptionistBuilderStore } from '@/hooks/useAIReceptionistBuilderStore';
import BuilderQuoteForm from '../builder/BuilderQuoteForm';
import { useUnifiedQuoteStore, serviceMetadata, AppConfig, WebsiteConfig, AnimationConfig, ImageConfig, SoundConfig, PaidMediaConfig, SocialMediaConfig, EmailMarketingConfig } from '@/hooks/useUnifiedQuoteStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
import {
  Phone,
  PhoneCall,
  Bot,
  Link2,
  BarChart3,
  Headphones,
  Edit2,
  Trash2,
  Package,
  Sparkles,
  Plus,
  ChevronDown,
  ChevronUp,
  Globe,
  Smartphone,
  Film,
  Image,
  Music,
  Megaphone,
  Share2,
  Mail,
  Target,
  Palette,
  Layers,
  FileText,
  PenTool,
  AlertCircle,
} from 'lucide-react';
import { appTypes, platformOptions, screenOptions as appScreenOptions, designOptions as appDesignOptions, authOptions as appAuthOptions, backendOptions as appBackendOptions, appFeatures, aiFeatures as appAIFeatures, appAdditionalServices, appTimelineOptions } from '@/data/appBuilder';
import { projectTypes as websiteProjectTypes, siteSizeOptions, designOptions, cmsOptions, features as websiteFeatures, websiteAIFeatures, additionalServices as websiteAdditionalServices, timelineOptions as websiteTimelineOptions } from '@/data/websiteBuilder';
import { animationTypeOptions } from '@/data/animationBuilder';
import { imageTypeOptions } from '@/data/imageBuilder';
import { soundTypeOptions } from '@/data/soundBuilder';
import { campaignTypeOptions } from '@/data/paidMediaBuilder';
import { managementGoalOptions as socialGoalOptions } from '@/data/socialMediaBuilder';
import { emailGoalOptions } from '@/data/emailMarketingBuilder';

type ExpandedCard = 'ai-receptionist' | 'app' | 'website' | 'animation' | 'image' | 'sound' | 'paid-media' | 'social-media' | 'email-marketing' | null;

interface Step8SummaryProps {
  showQuoteForm: boolean;
  onCloseQuoteForm: () => void;
}

export default function Step8Summary({ showQuoteForm, onCloseQuoteForm }: Step8SummaryProps) {
  const store = useAIReceptionistBuilderStore();
  const unifiedStore = useUnifiedQuoteStore();
  const router = useRouter();

  const [showAddServices, setShowAddServices] = useState(false);
  const [expandedCard, setExpandedCard] = useState<ExpandedCard>('ai-receptionist');

  const toggleCard = useCallback((card: ExpandedCard) => {
    setExpandedCard(prev => prev === card ? null : card);
  }, []);

  // Save to unified quote on mount and when totals change
  useEffect(() => {
    // Only save if we have a valid configuration
    if (store.basePackage) {
      store.saveToUnifiedQuote();
    }
  }, [store.basePackage, store.monthlyTotal, store.oneTimeTotal, store.saveToUnifiedQuote]);

  const configuredServices = unifiedStore.getAllConfiguredServices();
  const otherServices = configuredServices.filter(s => s.type !== 'ai-receptionist');

  // Get available services (not yet configured)
  const availableServices = unifiedStore.getAvailableServices().filter((s) => s !== 'ai-receptionist');

  // Get labels for selected options
  const basePkg = basePackages.find((p) => p.id === store.basePackage);
  const phoneTypeLabel = phoneNumberTypeOptions.find((o) => o.id === store.phoneNumberType)?.label;
  const phoneTypePrice = phoneNumberTypeOptions.find((o) => o.id === store.phoneNumberType);
  const linesLabel = additionalLinesOptions.find((o) => o.id === store.additionalLines)?.label;
  const linesOption = additionalLinesOptions.find((o) => o.id === store.additionalLines);
  const coverageLabel = coverageAreaOptions.find((o) => o.id === store.coverageArea)?.label;
  const coverageOption = coverageAreaOptions.find((o) => o.id === store.coverageArea);

  const minutesLabel = monthlyMinutesOptions.find((o) => o.id === store.monthlyMinutes)?.label;
  const minutesOption = monthlyMinutesOptions.find((o) => o.id === store.monthlyMinutes);
  const availabilityLabel = availabilityOptions.find((o) => o.id === store.availability)?.label;
  const availabilityOption = availabilityOptions.find((o) => o.id === store.availability);
  const transferLabel = callTransferOptions.find((o) => o.id === store.callTransfer)?.label;
  const transferOption = callTransferOptions.find((o) => o.id === store.callTransfer);
  const voicemailLabel = voicemailOptions.find((o) => o.id === store.voicemailType)?.label;
  const voicemailOption = voicemailOptions.find((o) => o.id === store.voicemailType);
  const durationLabel = maxCallDurationOptions.find((o) => o.id === store.maxCallDuration)?.label;
  const durationOption = maxCallDurationOptions.find((o) => o.id === store.maxCallDuration);

  const languageLabel = languageOptions.find((o) => o.id === store.language)?.label;
  const languageOption = languageOptions.find((o) => o.id === store.language);
  const voiceLabel = voiceStyleOptions.find((o) => o.id === store.voiceStyle)?.label;
  const voiceOption = voiceStyleOptions.find((o) => o.id === store.voiceStyle);
  const kbLabel = knowledgeBaseSizeOptions.find((o) => o.id === store.knowledgeBaseSize)?.label;
  const kbOption = knowledgeBaseSizeOptions.find((o) => o.id === store.knowledgeBaseSize);
  const complexityLabel = conversationComplexityOptions.find((o) => o.id === store.conversationComplexity)?.label;
  const complexityOption = conversationComplexityOptions.find((o) => o.id === store.conversationComplexity);
  const personalityLabel = personalityOptions.find((o) => o.id === store.personality)?.label;
  const personalityOption = personalityOptions.find((o) => o.id === store.personality);

  const leadCaptureLabel = leadCaptureOptions.find((o) => o.id === store.leadCapture)?.label;
  const leadCaptureOption = leadCaptureOptions.find((o) => o.id === store.leadCapture);
  const calendarLabel = calendarOptions.find((o) => o.id === store.calendar)?.label;
  const calendarOption = calendarOptions.find((o) => o.id === store.calendar);

  const transcriptsLabel = transcriptsOptions.find((o) => o.id === store.transcripts)?.label;
  const transcriptsOption = transcriptsOptions.find((o) => o.id === store.transcripts);
  const summariesLabel = aiSummariesOptions.find((o) => o.id === store.aiSummaries)?.label;
  const summariesOption = aiSummariesOptions.find((o) => o.id === store.aiSummaries);
  const analyticsLabel = analyticsLevelOptions.find((o) => o.id === store.analyticsLevel)?.label;
  const analyticsOption = analyticsLevelOptions.find((o) => o.id === store.analyticsLevel);
  const reportingLabel = reportingFrequencyOptions.find((o) => o.id === store.reportingFrequency)?.label;
  const reportingOption = reportingFrequencyOptions.find((o) => o.id === store.reportingFrequency);

  const onboardingLabel = onboardingTypeOptions.find((o) => o.id === store.onboardingType)?.label;
  const onboardingOption = onboardingTypeOptions.find((o) => o.id === store.onboardingType);
  const updatesLabel = knowledgeUpdatesOptions.find((o) => o.id === store.knowledgeUpdates)?.label;
  const updatesOption = knowledgeUpdatesOptions.find((o) => o.id === store.knowledgeUpdates);
  const supportLabel = supportLevelOptions.find((o) => o.id === store.supportLevel)?.label;
  const supportOption = supportLevelOptions.find((o) => o.id === store.supportLevel);

  const handleEdit = () => {
    store.setStep(1);
  };

  const handleClear = () => {
    // Get remaining services (excluding current service)
    const remainingServices = configuredServices.filter((s) => s.type !== 'ai-receptionist');

    // Clear from unified store directly to ensure it's cleared
    unifiedStore.clearServiceConfig('ai-receptionist');

    // Reset the local builder state
    store.resetBuilder();

    // Small delay to ensure persist middleware has saved the state
    setTimeout(() => {
      // If there are remaining services, navigate to the first one's summary
      if (remainingServices.length > 0) {
        const nextService = remainingServices[0];
        router.push(`${serviceMetadata[nextService.type].builderPath}?summary=true`);
      } else {
        // No more services, go to main page
        router.push('/');
      }
    }, 100);
  };

  // Summary Section component
  const SummarySection = ({
    title,
    icon,
    stepNumber,
    children,
  }: {
    title: string;
    icon: React.ReactNode;
    stepNumber: number;
    children: React.ReactNode;
  }) => (
    <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="font-medium text-white">{title}</h3>
        </div>
        <button
          onClick={() => store.setStep(stepNumber)}
          className="text-[var(--text-muted)] hover:text-[var(--accent-purple)] transition-colors"
        >
          <Edit2 className="w-4 h-4" />
        </button>
      </div>
      {children}
    </div>
  );

  // Price display helper
  const PriceDisplay = ({ monthly, oneTime, customQuote }: { monthly?: number; oneTime?: number; customQuote?: boolean }) => {
    if (customQuote) {
      return <span className="text-[var(--accent-orange)]">Custom Quote</span>;
    }
    if (monthly && monthly > 0 && oneTime && oneTime > 0) {
      return (
        <span className="text-[var(--accent-pink)]">
          +${monthly}/mo + ${oneTime}
        </span>
      );
    }
    if (monthly && monthly > 0) {
      return <span className="text-[var(--accent-pink)]">+${monthly}/mo</span>;
    }
    if (oneTime && oneTime > 0) {
      return <span className="text-white">+${oneTime}</span>;
    }
    return <span className="text-[var(--text-muted)]">Included</span>;
  };

  // Calculate one-time costs breakdown
  const activationFee = basePkg?.activationFee || 0;
  const setupFees =
    (phoneTypePrice?.oneTimePrice || 0) +
    (voiceOption?.oneTimePrice || 0) +
    (leadCaptureOption?.oneTimePrice || 0) +
    (calendarOption?.oneTimePrice || 0) +
    (onboardingOption?.oneTimePrice || 0) +
    store.additionalIntegrations.reduce((sum, id) => {
      const integration = additionalIntegrationOptions.find((o) => o.id === id);
      return sum + (integration?.oneTimePrice || 0);
    }, 0);

  if (showQuoteForm && onCloseQuoteForm) {
    return <BuilderQuoteForm onBack={() => onCloseQuoteForm()} />;
  }

  return (
    <div className="flex gap-6">
      {/* Main Content */}
      <div className="flex-1 space-y-6">
        {/* Header */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[var(--accent-purple)] to-[var(--accent-pink)] flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-white font-serif">
                  AI Receptionist Configuration
                </h2>
                <p className="text-[var(--text-secondary)] text-sm">{basePkg?.name || 'Custom Agent'}</p>
              </div>
            </div>
          </div>

          {/* Promo Banner */}
          {isPromoActive() && store.promoDiscount > 0 && (
            <div className="mb-4 p-3 bg-gradient-to-r from-[var(--accent-blue)]/20 to-[var(--accent-teal)]/20 border border-[var(--accent-blue)]/30 rounded-lg">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[var(--accent-blue-light)]" />
                <span className="text-[var(--accent-blue-light)] font-medium">
                  Launch Special: Save ${store.promoDiscount.toFixed(2)} on activation!
                </span>
              </div>
              <p className="text-sm text-[var(--accent-blue-light)]/70 mt-1">
                50% off activation fee - offer expires March 1, 2026
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleClear}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all"
            >
              <Trash2 className="w-4 h-4" />
              Clear Service
            </button>
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-white hover:border-[var(--accent-purple)] transition-all"
            >
              <Edit2 className="w-4 h-4" />
              Edit Configuration
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleCard('ai-receptionist');
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-white hover:border-[var(--accent-purple)] transition-all"
            >
              {expandedCard === 'ai-receptionist' ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  Hide Details
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  Show Details
                </>
              )}
            </button>
          </div>

          {/* Configuration Sections - Collapsible */}
          {expandedCard === 'ai-receptionist' && (
            <div className="mt-6">
              <div className="space-y-4">
          {/* Package Summary */}
          <SummarySection
            title="Base Package"
            icon={<Package className="w-5 h-5 text-[var(--accent-purple)]" />}
            stepNumber={1}
          >
            <div className="flex justify-between items-center">
              <span className="text-[var(--text-secondary)]">{basePkg?.name}</span>
              <span className="text-[var(--accent-pink)]">${basePkg?.monthlyPrice}/mo base</span>
            </div>
            {basePkg?.tagline && (
              <p className="text-sm text-[var(--text-muted)] mt-1">{basePkg.tagline}</p>
            )}
          </SummarySection>

          {/* Phone Setup */}
          <SummarySection
            title="Phone Setup"
            icon={<Phone className="w-5 h-5 text-[var(--accent-purple)]" />}
            stepNumber={2}
          >
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-secondary)]">Phone Type: {phoneTypeLabel}</span>
                <PriceDisplay monthly={phoneTypePrice?.monthlyPrice} oneTime={phoneTypePrice?.oneTimePrice} />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-secondary)]">Lines: {linesLabel}</span>
                <PriceDisplay monthly={linesOption?.monthlyPrice} customQuote={linesOption?.customQuote} />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-secondary)]">Coverage: {coverageLabel}</span>
                <PriceDisplay monthly={coverageOption?.monthlyPrice} customQuote={coverageOption?.customQuote} />
              </div>
            </div>
          </SummarySection>

          {/* Call Handling */}
          <SummarySection
            title="Call Handling"
            icon={<PhoneCall className="w-5 h-5 text-[var(--accent-purple)]" />}
            stepNumber={3}
          >
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-secondary)]">Minutes: {minutesLabel}</span>
                <PriceDisplay monthly={minutesOption?.monthlyPrice} customQuote={minutesOption?.customQuote} />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-secondary)]">Availability: {availabilityLabel}</span>
                <PriceDisplay monthly={availabilityOption?.monthlyPrice} />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-secondary)]">Call Transfer: {transferLabel}</span>
                <PriceDisplay monthly={transferOption?.monthlyPrice} />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-secondary)]">Voicemail: {voicemailLabel}</span>
                <PriceDisplay monthly={voicemailOption?.monthlyPrice} />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-secondary)]">Max Duration: {durationLabel}</span>
                <PriceDisplay monthly={durationOption?.monthlyPrice} />
              </div>
            </div>
          </SummarySection>

          {/* AI Capabilities */}
          <SummarySection
            title="AI Capabilities"
            icon={<Bot className="w-5 h-5 text-[var(--accent-purple)]" />}
            stepNumber={4}
          >
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-secondary)]">Language: {languageLabel}</span>
                <PriceDisplay monthly={languageOption?.monthlyPrice} />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-secondary)]">Voice: {voiceLabel}</span>
                <PriceDisplay monthly={voiceOption?.monthlyPrice} oneTime={voiceOption?.oneTimePrice} />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-secondary)]">Knowledge Base: {kbLabel}</span>
                <PriceDisplay monthly={kbOption?.monthlyPrice} />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-secondary)]">Complexity: {complexityLabel}</span>
                <PriceDisplay monthly={complexityOption?.monthlyPrice} />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-secondary)]">Personality: {personalityLabel}</span>
                <PriceDisplay monthly={personalityOption?.monthlyPrice} />
              </div>
            </div>
          </SummarySection>

          {/* Integrations */}
          <SummarySection
            title="Integrations"
            icon={<Link2 className="w-5 h-5 text-[var(--accent-purple)]" />}
            stepNumber={5}
          >
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-secondary)]">Lead Capture: {leadCaptureLabel}</span>
                <PriceDisplay monthly={leadCaptureOption?.monthlyPrice} oneTime={leadCaptureOption?.oneTimePrice} />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-secondary)]">Calendar: {calendarLabel}</span>
                <PriceDisplay monthly={calendarOption?.monthlyPrice} oneTime={calendarOption?.oneTimePrice} />
              </div>

              {/* Notifications */}
              {store.notifications.length > 0 && (
                <div className="pt-2 border-t border-[var(--border-subtle)]">
                  <p className="text-sm text-[var(--text-muted)] mb-1">Notifications:</p>
                  {store.notifications.map((notifId) => {
                    const notif = notificationOptions.find((o) => o.id === notifId);
                    return (
                      <div key={notifId} className="flex justify-between text-sm">
                        <span className="text-[var(--text-secondary)]">{notif?.label}</span>
                        <PriceDisplay monthly={notif?.monthlyPrice} />
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Additional Integrations */}
              {store.additionalIntegrations.length > 0 && (
                <div className="pt-2 border-t border-[var(--border-subtle)]">
                  <p className="text-sm text-[var(--text-muted)] mb-1">Additional Integrations:</p>
                  {store.additionalIntegrations.map((intId) => {
                    const integration = additionalIntegrationOptions.find((o) => o.id === intId);
                    return (
                      <div key={intId} className="flex justify-between text-sm">
                        <span className="text-[var(--text-secondary)]">{integration?.label}</span>
                        <PriceDisplay monthly={integration?.monthlyPrice} oneTime={integration?.oneTimePrice} />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </SummarySection>

          {/* Reporting */}
          <SummarySection
            title="Reporting & Analytics"
            icon={<BarChart3 className="w-5 h-5 text-[var(--accent-purple)]" />}
            stepNumber={6}
          >
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-secondary)]">Transcripts: {transcriptsLabel}</span>
                <PriceDisplay monthly={transcriptsOption?.monthlyPrice} />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-secondary)]">AI Summaries: {summariesLabel}</span>
                <PriceDisplay monthly={summariesOption?.monthlyPrice} />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-secondary)]">Analytics: {analyticsLabel}</span>
                <PriceDisplay monthly={analyticsOption?.monthlyPrice} />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-secondary)]">Reports: {reportingLabel}</span>
                <PriceDisplay monthly={reportingOption?.monthlyPrice} />
              </div>
            </div>
          </SummarySection>

          {/* Support */}
          <SummarySection
            title="Support & Onboarding"
            icon={<Headphones className="w-5 h-5 text-[var(--accent-purple)]" />}
            stepNumber={7}
          >
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-secondary)]">Onboarding: {onboardingLabel}</span>
                <PriceDisplay oneTime={onboardingOption?.oneTimePrice} />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-secondary)]">Knowledge Updates: {updatesLabel}</span>
                <PriceDisplay monthly={updatesOption?.monthlyPrice} />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-secondary)]">Support Level: {supportLabel}</span>
                <PriceDisplay monthly={supportOption?.monthlyPrice} />
              </div>
            </div>
          </SummarySection>
              </div>
            </div>
          )}

          {/* Pricing Summary - Always visible */}
          <div className="mt-6 p-4 bg-gradient-to-br from-[var(--accent-purple)]/10 to-[var(--accent-pink)]/10 border border-[var(--accent-purple)]/30 rounded-lg">
            <div className="space-y-3">
              {/* Monthly Total */}
              <div className="flex justify-between items-center">
                <span className="text-white font-semibold">Monthly Total</span>
                {store.hasCustomQuote ? (
                  <span className="text-[var(--accent-orange)] font-bold">Custom Quote</span>
                ) : (
                  <span className="text-xl font-bold text-[var(--accent-pink)]">
                    ${store.monthlyTotal.toFixed(2)}/mo
                  </span>
                )}
              </div>

              {/* One-Time Total */}
              <div className="flex justify-between items-center">
                <span className="text-white font-semibold">One-Time Setup</span>
                <span className="text-xl font-bold gradient-text">
                  ${store.oneTimeTotal.toFixed(2)}
                </span>
              </div>

              {/* Due Today */}
              <div className="flex justify-between items-center mt-2 pt-2 border-t-2 border-[var(--accent-purple)]/50">
                <span className="text-white font-bold">Due Today</span>
                <span className="text-xl font-bold gradient-text">${(store.oneTimeTotal + store.monthlyTotal).toLocaleString()}</span>
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-1">Setup + first month&apos;s service</p>
            </div>

            {store.hasCustomQuote && (
              <p className="text-sm text-[var(--accent-orange)] mt-3">
                * Some selections require custom pricing.
              </p>
            )}
          </div>
        </div>

        {/* Other Configured Services - App */}
        {otherServices.filter(s => s.type === 'app').map((service) => {
          const isOpen = expandedCard === 'app';
          const config = service.config as AppConfig;
          const appTypeLabel = appTypes.find(t => t.id === config.appType)?.label;

          return (
            <div key={service.type} className="card p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--accent-purple)] to-[var(--accent-pink)] flex items-center justify-center">
                    <Smartphone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-white font-serif">App Quote Summary</h2>
                    <p className="text-[var(--text-secondary)] text-sm">{appTypeLabel}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={serviceMetadata[service.type].builderPath}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-white hover:border-[var(--accent-purple)] transition-all"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </Link>
                  <button
                    onClick={() => unifiedStore.clearServiceConfig(service.type)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCard('app');
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-white hover:border-[var(--accent-purple)] transition-all"
                  >
                    {isOpen ? (
                      <>
                        <ChevronUp className="w-4 h-4" />
                        Hide
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4" />
                        Details
                      </>
                    )}
                  </button>
                </div>
              </div>

              {isOpen && (
                <div className="mt-6">
                  <div className="space-y-4">
                    {/* App Type */}
                    <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
                        <div className="flex items-center gap-2 mb-3">
                          <Smartphone className="w-5 h-5 text-[var(--accent-purple)]" />
                          <h3 className="font-medium text-white">App Type</h3>
                        </div>
                        <p className="text-[var(--text-secondary)]">{appTypeLabel}</p>
                      </div>
                      {/* Platform */}
                      <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
                        <div className="flex items-center gap-2 mb-3">
                          <Layers className="w-5 h-5 text-[var(--accent-purple)]" />
                          <h3 className="font-medium text-white">Platform</h3>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[var(--text-secondary)]">{platformOptions.find(o => o.id === config.platform)?.label}</span>
                          {config.platformPrice === null ? (
                            <span className="text-[var(--accent-orange)]">Custom Quote</span>
                          ) : config.platformPrice === 0 ? (
                            <span className="text-[var(--text-muted)]">$0</span>
                          ) : (
                            <span className="text-white font-medium">${config.platformPrice}</span>
                          )}
                        </div>
                      </div>
                      {/* Screens */}
                      <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
                        <div className="flex items-center gap-2 mb-3">
                          <Layers className="w-5 h-5 text-[var(--accent-purple)]" />
                          <h3 className="font-medium text-white">Screens</h3>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[var(--text-secondary)]">{appScreenOptions.find(o => o.id === config.screens)?.label}</span>
                          {config.screensPrice === null ? (
                            <span className="text-[var(--accent-orange)]">Custom Quote</span>
                          ) : config.screensPrice === 0 ? (
                            <span className="text-[var(--text-muted)]">$0</span>
                          ) : (
                            <span className="text-white font-medium">${config.screensPrice}</span>
                          )}
                        </div>
                      </div>
                      {/* Design */}
                      <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
                        <div className="flex items-center gap-2 mb-3">
                          <Palette className="w-5 h-5 text-[var(--accent-purple)]" />
                          <h3 className="font-medium text-white">Design</h3>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[var(--text-secondary)]">{appDesignOptions.find(o => o.id === config.design)?.label}</span>
                          {config.designPrice === 0 ? (
                            <span className="text-[var(--text-muted)]">$0</span>
                          ) : (
                            <span className="text-white font-medium">${config.designPrice}</span>
                          )}
                        </div>
                      </div>
                      {/* Authentication */}
                      <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
                        <div className="flex items-center gap-2 mb-3">
                          <FileText className="w-5 h-5 text-[var(--accent-purple)]" />
                          <h3 className="font-medium text-white">Authentication</h3>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[var(--text-secondary)]">{appAuthOptions.find(o => o.id === config.auth)?.label}</span>
                          {config.authPrice === 0 ? (
                            <span className="text-[var(--text-muted)]">$0</span>
                          ) : (
                            <span className="text-white font-medium">+${config.authPrice}</span>
                          )}
                        </div>
                      </div>
                      {/* Backend */}
                      <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
                        <div className="flex items-center gap-2 mb-3">
                          <FileText className="w-5 h-5 text-[var(--accent-purple)]" />
                          <h3 className="font-medium text-white">Backend</h3>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[var(--text-secondary)]">{appBackendOptions.find(o => o.id === config.backend)?.label}</span>
                          {config.backendPrice === null ? (
                            <span className="text-[var(--accent-orange)]">Custom Quote</span>
                          ) : config.backendPrice === 0 ? (
                            <span className="text-[var(--text-muted)]">$0</span>
                          ) : (
                            <span className="text-white font-medium">+${config.backendPrice}</span>
                          )}
                        </div>
                      </div>
                      {/* Features */}
                      <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
                        <div className="flex items-center gap-2 mb-3">
                          <Sparkles className="w-5 h-5 text-[var(--accent-purple)]" />
                          <h3 className="font-medium text-white">Features</h3>
                        </div>
                        {(!config.selectedFeatures || config.selectedFeatures.length === 0) ? (
                          <p className="text-[var(--text-muted)] text-sm">No features selected</p>
                        ) : (
                          <div className="space-y-2">
                            {config.selectedFeatures.map((f) => {
                              const feature = appFeatures.find(o => o.id === f.id);
                              const optionLabel = feature?.options.find(t => t.id === f.optionId)?.label;
                              return (
                                <div key={f.id} className="flex justify-between text-sm">
                                  <span className="text-[var(--text-secondary)]">
                                    {feature?.name} <span className="text-[var(--text-muted)]">({optionLabel})</span>
                                  </span>
                                  {f.price === null ? (
                                    <span className="text-[var(--accent-orange)]">Quote</span>
                                  ) : f.price === 0 ? (
                                    <span className="text-[var(--text-muted)]">$0</span>
                                  ) : (
                                    <span className="text-white font-medium">+${f.price}</span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                      {/* AI Features */}
                      <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
                        <div className="flex items-center gap-2 mb-3">
                          <Bot className="w-5 h-5 text-[var(--accent-purple)]" />
                          <h3 className="font-medium text-white">AI Features</h3>
                        </div>
                        {(!config.selectedAIFeatures || config.selectedAIFeatures.length === 0) ? (
                          <p className="text-[var(--text-muted)] text-sm">No AI features selected</p>
                        ) : (
                          <div className="space-y-2">
                            {config.selectedAIFeatures.map((f) => {
                              const feature = appAIFeatures.find(o => o.id === f.id);
                              const setupOption = feature?.setupOptions.find(o => o.id === f.setupOptionId);
                              return (
                                <div key={f.id} className="space-y-1">
                                  <div className="flex justify-between text-sm">
                                    <span className="text-[var(--text-secondary)]">
                                      {feature?.name} <span className="text-[var(--text-muted)]">({setupOption?.label})</span>
                                    </span>
                                    {f.setupPrice === null ? (
                                      <span className="text-[var(--accent-orange)]">Quote</span>
                                    ) : f.setupPrice === 0 ? (
                                      <span className="text-[var(--text-muted)]">$0</span>
                                    ) : (
                                      <span className="text-white font-medium">+${f.setupPrice} setup</span>
                                    )}
                                  </div>
                                  {f.usagePrice !== null && f.usagePrice > 0 && (
                                    <div className="flex justify-between text-sm pl-4">
                                      <span className="text-[var(--text-muted)]">Usage</span>
                                      <span className="text-[var(--accent-pink)]">+${f.usagePrice}/mo</span>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                      {/* Additional Services */}
                      <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
                        <div className="flex items-center gap-2 mb-3">
                          <Layers className="w-5 h-5 text-[var(--accent-purple)]" />
                          <h3 className="font-medium text-white">Additional Services</h3>
                        </div>
                        {(!config.selectedServices || config.selectedServices.length === 0) ? (
                          <p className="text-[var(--text-muted)] text-sm">No additional services selected</p>
                        ) : (
                          <div className="space-y-2">
                            {config.selectedServices.map((s) => {
                              const service = appAdditionalServices.find(o => o.id === s.id);
                              return (
                                <div key={s.id} className="flex justify-between text-sm">
                                  <span className="text-[var(--text-secondary)]">
                                    {service?.label}
                                    {s.recurring && <span className="text-[var(--accent-orange)] ml-1">(monthly)</span>}
                                  </span>
                                  <span className="text-white font-medium">+${s.price}{s.recurring && '/mo'}</span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                      {/* Timeline */}
                      <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
                        <div className="flex items-center gap-2 mb-3">
                          <FileText className="w-5 h-5 text-[var(--accent-purple)]" />
                          <h3 className="font-medium text-white">Timeline</h3>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[var(--text-secondary)]">{appTimelineOptions.find(o => o.id === config.timeline)?.label}</span>
                          {config.rushFee > 0 ? (
                            <span className="text-[var(--accent-orange)] font-medium">
                              +${config.rushFee.toLocaleString()} ({Math.round((config.timelineMultiplier - 1) * 100)}%)
                            </span>
                          ) : (
                            <span className="text-[var(--accent-blue-light)] font-medium">No rush fee</span>
                          )}
                        </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6 p-4 bg-gradient-to-r from-[var(--accent-purple)]/20 to-[var(--accent-pink)]/20 border border-[var(--accent-purple)]/30 rounded-lg">
                {config.hasCustomQuote ? (
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-[var(--accent-orange)] shrink-0 mt-0.5" />
                    <p className="text-white font-semibold">Custom Quote Required</p>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-white font-semibold">One-time Development</span>
                      <span className="text-2xl font-bold gradient-text">${config.oneTimeTotal.toLocaleString()}</span>
                    </div>
                    {config.monthlyTotal > 0 && (
                      <div className="flex justify-between items-center mt-2 pt-2 border-t border-[var(--border-subtle)]">
                        <span className="text-white font-semibold">Monthly Services</span>
                        <span className="text-lg font-semibold text-[var(--accent-pink)]">${config.monthlyTotal.toFixed(2)}/mo</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}

        {/* Other Configured Services - Website */}
        {otherServices.filter(s => s.type === 'website').map((service) => {
          const isOpen = expandedCard === 'website';
          const config = service.config as WebsiteConfig;
          const projectTypeLabel = websiteProjectTypes.find(t => t.id === config.projectType)?.label;

          return (
            <div key={service.type} className="card p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--accent-purple)] to-[var(--accent-pink)] flex items-center justify-center">
                    <Globe className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-white font-serif">Website Quote Summary</h2>
                    <p className="text-[var(--text-secondary)] text-sm">{projectTypeLabel}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={serviceMetadata[service.type].builderPath}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-white hover:border-[var(--accent-purple)] transition-all"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </Link>
                  <button
                    onClick={() => unifiedStore.clearServiceConfig(service.type)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCard('website');
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-white hover:border-[var(--accent-purple)] transition-all"
                  >
                    {isOpen ? (
                      <>
                        <ChevronUp className="w-4 h-4" />
                        Hide
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4" />
                        Details
                      </>
                    )}
                  </button>
                </div>
              </div>

              {isOpen && (
                <div className="mt-6">
                  <div className="space-y-4">
                    {/* Project Type */}
                    <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <Globe className="w-5 h-5 text-[var(--accent-purple)]" />
                        <h3 className="font-medium text-white">Project Type</h3>
                      </div>
                      <p className="text-[var(--text-secondary)]">{projectTypeLabel}</p>
                    </div>
                      {/* Site Size */}
                      <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
                        <div className="flex items-center gap-2 mb-3">
                          <Layers className="w-5 h-5 text-[var(--accent-purple)]" />
                          <h3 className="font-medium text-white">Site Size</h3>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[var(--text-secondary)]">{siteSizeOptions.find(o => o.id === config.siteSize)?.label}</span>
                          {config.siteSizePrice === null ? (
                            <span className="text-[var(--accent-orange)]">Custom Quote</span>
                          ) : config.siteSizePrice === 0 ? (
                            <span className="text-[var(--text-muted)]">$0</span>
                          ) : (
                            <span className="text-white font-medium">${config.siteSizePrice}</span>
                          )}
                        </div>
                      </div>
                      {/* Design Style */}
                      <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
                        <div className="flex items-center gap-2 mb-3">
                          <Palette className="w-5 h-5 text-[var(--accent-purple)]" />
                          <h3 className="font-medium text-white">Design Style</h3>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[var(--text-secondary)]">{designOptions.find(o => o.id === config.designComplexity)?.label}</span>
                          {config.designPrice === 0 ? (
                            <span className="text-[var(--text-muted)]">$0</span>
                          ) : (
                            <span className="text-white font-medium">${config.designPrice}</span>
                          )}
                        </div>
                      </div>
                      {/* CMS */}
                      <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
                        <div className="flex items-center gap-2 mb-3">
                          <FileText className="w-5 h-5 text-[var(--accent-purple)]" />
                          <h3 className="font-medium text-white">Content Management</h3>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[var(--text-secondary)]">{cmsOptions.find(o => o.id === config.cms)?.label}</span>
                          {config.cmsPrice === 0 ? (
                            <span className="text-[var(--text-muted)]">$0</span>
                          ) : (
                            <span className="text-white font-medium">+${config.cmsPrice}</span>
                          )}
                        </div>
                      </div>
                      {/* Features */}
                      <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
                        <div className="flex items-center gap-2 mb-3">
                          <Sparkles className="w-5 h-5 text-[var(--accent-purple)]" />
                          <h3 className="font-medium text-white">Features</h3>
                        </div>
                        {(!config.selectedFeatures || config.selectedFeatures.length === 0) ? (
                          <p className="text-[var(--text-muted)] text-sm">No features selected</p>
                        ) : (
                          <div className="space-y-2">
                            {config.selectedFeatures.map((f) => {
                              const feature = websiteFeatures.find(o => o.id === f.id);
                              const optionLabel = feature?.options.find(t => t.id === f.optionId)?.label;
                              return (
                                <div key={f.id} className="flex justify-between text-sm">
                                  <span className="text-[var(--text-secondary)]">
                                    {feature?.name} <span className="text-[var(--text-muted)]">({optionLabel})</span>
                                  </span>
                                  {f.price === null ? (
                                    <span className="text-[var(--accent-orange)]">Quote</span>
                                  ) : f.price === 0 ? (
                                    <span className="text-[var(--text-muted)]">$0</span>
                                  ) : (
                                    <span className="text-white font-medium">+${f.price}</span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                      {/* AI Features */}
                      <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
                        <div className="flex items-center gap-2 mb-3">
                          <Bot className="w-5 h-5 text-[var(--accent-purple)]" />
                          <h3 className="font-medium text-white">AI Features</h3>
                        </div>
                        {(!config.selectedAIFeatures || config.selectedAIFeatures.length === 0) ? (
                          <p className="text-[var(--text-muted)] text-sm">No AI features selected</p>
                        ) : (
                          <div className="space-y-2">
                            {config.selectedAIFeatures.map((f) => {
                              const feature = websiteAIFeatures.find(o => o.id === f.id);
                              const setupOption = feature?.setupOptions.find(o => o.id === f.setupOptionId);
                              return (
                                <div key={f.id} className="space-y-1">
                                  <div className="flex justify-between text-sm">
                                    <span className="text-[var(--text-secondary)]">
                                      {feature?.name} <span className="text-[var(--text-muted)]">({setupOption?.label})</span>
                                    </span>
                                    {f.setupPrice === null ? (
                                      <span className="text-[var(--accent-orange)]">Quote</span>
                                    ) : f.setupPrice === 0 ? (
                                      <span className="text-[var(--text-muted)]">$0</span>
                                    ) : (
                                      <span className="text-white font-medium">+${f.setupPrice} setup</span>
                                    )}
                                  </div>
                                  {f.usagePrice !== null && f.usagePrice > 0 && (
                                    <div className="flex justify-between text-sm pl-4">
                                      <span className="text-[var(--text-muted)]">Usage</span>
                                      <span className="text-[var(--accent-pink)]">+${f.usagePrice}/mo</span>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                      {/* Additional Services */}
                      <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
                        <div className="flex items-center gap-2 mb-3">
                          <Layers className="w-5 h-5 text-[var(--accent-purple)]" />
                          <h3 className="font-medium text-white">Additional Services</h3>
                        </div>
                        {(!config.selectedServices || config.selectedServices.length === 0) ? (
                          <p className="text-[var(--text-muted)] text-sm">No additional services selected</p>
                        ) : (
                          <div className="space-y-2">
                            {config.selectedServices.map((s) => {
                              const service = websiteAdditionalServices.find(o => o.id === s.id);
                              return (
                                <div key={s.id} className="flex justify-between text-sm">
                                  <span className="text-[var(--text-secondary)]">
                                    {service?.label}
                                    {s.recurring && <span className="text-[var(--accent-orange)] ml-1">(monthly)</span>}
                                  </span>
                                  <span className="text-white font-medium">+${s.price}{s.recurring && '/mo'}</span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                      {/* Timeline */}
                      <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
                        <div className="flex items-center gap-2 mb-3">
                          <FileText className="w-5 h-5 text-[var(--accent-purple)]" />
                          <h3 className="font-medium text-white">Timeline</h3>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[var(--text-secondary)]">{websiteTimelineOptions.find(o => o.id === config.timeline)?.label}</span>
                          {config.rushFee > 0 ? (
                            <span className="text-[var(--accent-orange)] font-medium">
                              +${config.rushFee.toLocaleString()} ({Math.round((config.timelineMultiplier - 1) * 100)}%)
                            </span>
                          ) : (
                            <span className="text-[var(--accent-blue-light)] font-medium">No rush fee</span>
                          )}
                        </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6 p-4 bg-gradient-to-r from-[var(--accent-purple)]/20 to-[var(--accent-pink)]/20 border border-[var(--accent-purple)]/30 rounded-lg">
                {config.hasCustomQuote ? (
                  <div className="flex items-start gap-3"><AlertCircle className="w-5 h-5 text-[var(--accent-orange)] shrink-0 mt-0.5" /><p className="text-white font-semibold">Custom Quote Required</p></div>
                ) : (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-white font-semibold">One-time Development</span>
                      <span className="text-2xl font-bold gradient-text">${config.total.toLocaleString()}</span>
                    </div>
                    {config.monthlyRecurring > 0 && (
                      <div className="flex justify-between items-center mt-2 pt-2 border-t border-[var(--border-subtle)]">
                        <span className="text-white font-semibold">Monthly Services</span>
                        <span className="text-lg font-semibold text-[var(--accent-pink)]">${config.monthlyRecurring.toFixed(2)}/mo</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}

        {/* Other Configured Services - Animation */}
        {otherServices.filter(s => s.type === 'animation').map((service) => {
          const isOpen = expandedCard === 'animation';
          const config = service.config as AnimationConfig;
          const typeLabel = animationTypeOptions.find(t => t.id === config.animationType)?.label;
          return (
            <div key={service.type} className="card p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--accent-purple)] to-[var(--accent-pink)] flex items-center justify-center"><Film className="w-5 h-5 text-white" /></div>
                  <div><h2 className="text-2xl font-semibold text-white font-serif">Animation Quote Summary</h2><p className="text-[var(--text-secondary)] text-sm">{typeLabel}</p></div>
                </div>
                <div className="flex gap-2">
                  <Link href={serviceMetadata[service.type].builderPath} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-white hover:border-[var(--accent-purple)] transition-all"><Edit2 className="w-4 h-4" />Edit</Link>
                  <button onClick={() => unifiedStore.clearServiceConfig(service.type)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all"><Trash2 className="w-4 h-4" />Clear</button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCard('animation');
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-white hover:border-[var(--accent-purple)] transition-all"
                  >
                    {isOpen ? (
                      <>
                        <ChevronUp className="w-4 h-4" />
                        Hide
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4" />
                        Details
                      </>
                    )}
                  </button>
                </div>
              </div>
              {isOpen && (
                <div className="mt-6">
                  <div className="space-y-4"><div className="p-4 bg-[var(--bg-secondary)] rounded-lg"><div className="flex items-center gap-2 mb-3"><Film className="w-5 h-5 text-[var(--accent-purple)]" /><h3 className="font-medium text-white">Animation Type</h3></div><p className="text-[var(--text-secondary)]">{typeLabel}</p></div></div>
                </div>
              )}
              <div className="mt-6 p-4 bg-gradient-to-r from-[var(--accent-purple)]/20 to-[var(--accent-pink)]/20 border border-[var(--accent-purple)]/30 rounded-lg">
                <div className="flex justify-between items-center"><span className="text-white font-semibold">One-time</span><span className="text-2xl font-bold gradient-text">${config.total.toLocaleString()}</span></div>
              </div>
            </div>
          );
        })}

        {/* Other Configured Services - Image */}
        {otherServices.filter(s => s.type === 'image').map((service) => {
          const isOpen = expandedCard === 'image';
          const config = service.config as ImageConfig;
          const typeLabel = imageTypeOptions.find(t => t.id === config.imageType)?.label;
          return (
            <div key={service.type} className="card p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--accent-purple)] to-[var(--accent-pink)] flex items-center justify-center"><Image className="w-5 h-5 text-white" /></div>
                  <div><h2 className="text-2xl font-semibold text-white font-serif">Image Quote Summary</h2><p className="text-[var(--text-secondary)] text-sm">{typeLabel}</p></div>
                </div>
                <div className="flex gap-2">
                  <Link href={serviceMetadata[service.type].builderPath} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-white hover:border-[var(--accent-purple)] transition-all"><Edit2 className="w-4 h-4" />Edit</Link>
                  <button onClick={() => unifiedStore.clearServiceConfig(service.type)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all"><Trash2 className="w-4 h-4" />Clear</button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCard('image');
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-white hover:border-[var(--accent-purple)] transition-all"
                  >
                    {isOpen ? (
                      <>
                        <ChevronUp className="w-4 h-4" />
                        Hide
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4" />
                        Details
                      </>
                    )}
                  </button>
                </div>
              </div>
              {isOpen && (
                <div className="mt-6">
                  <div className="space-y-4"><div className="p-4 bg-[var(--bg-secondary)] rounded-lg"><div className="flex items-center gap-2 mb-3"><Image className="w-5 h-5 text-[var(--accent-purple)]" /><h3 className="font-medium text-white">Image Type</h3></div><p className="text-[var(--text-secondary)]">{typeLabel}</p></div></div>
                </div>
              )}
              <div className="mt-6 p-4 bg-gradient-to-r from-[var(--accent-purple)]/20 to-[var(--accent-pink)]/20 border border-[var(--accent-purple)]/30 rounded-lg">
                <div className="flex justify-between items-center"><span className="text-white font-semibold">One-time</span><span className="text-2xl font-bold gradient-text">${config.total.toLocaleString()}</span></div>
              </div>
            </div>
          );
        })}

        {/* Other Configured Services - Sound */}
        {otherServices.filter(s => s.type === 'sound').map((service) => {
          const isOpen = expandedCard === 'sound';
          const config = service.config as SoundConfig;
          const typeLabel = soundTypeOptions.find(t => t.id === config.soundType)?.label;
          return (
            <div key={service.type} className="card p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--accent-purple)] to-[var(--accent-pink)] flex items-center justify-center"><Music className="w-5 h-5 text-white" /></div>
                  <div><h2 className="text-2xl font-semibold text-white font-serif">Sound Quote Summary</h2><p className="text-[var(--text-secondary)] text-sm">{typeLabel}</p></div>
                </div>
                <div className="flex gap-2">
                  <Link href={serviceMetadata[service.type].builderPath} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-white hover:border-[var(--accent-purple)] transition-all"><Edit2 className="w-4 h-4" />Edit</Link>
                  <button onClick={() => unifiedStore.clearServiceConfig(service.type)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all"><Trash2 className="w-4 h-4" />Clear</button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCard('sound');
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-white hover:border-[var(--accent-purple)] transition-all"
                  >
                    {isOpen ? (
                      <>
                        <ChevronUp className="w-4 h-4" />
                        Hide
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4" />
                        Details
                      </>
                    )}
                  </button>
                </div>
              </div>
              {isOpen && (
                <div className="mt-6">
                  <div className="space-y-4"><div className="p-4 bg-[var(--bg-secondary)] rounded-lg"><div className="flex items-center gap-2 mb-3"><Music className="w-5 h-5 text-[var(--accent-purple)]" /><h3 className="font-medium text-white">Sound Type</h3></div><p className="text-[var(--text-secondary)]">{typeLabel}</p></div></div>
                </div>
              )}
              <div className="mt-6 p-4 bg-gradient-to-r from-[var(--accent-purple)]/20 to-[var(--accent-pink)]/20 border border-[var(--accent-purple)]/30 rounded-lg">
                <div className="flex justify-between items-center"><span className="text-white font-semibold">One-time</span><span className="text-2xl font-bold gradient-text">${config.total.toLocaleString()}</span></div>
              </div>
            </div>
          );
        })}

        {/* Other Configured Services - Paid Media */}
        {otherServices.filter(s => s.type === 'paid-media').map((service) => {
          const isOpen = expandedCard === 'paid-media';
          const config = service.config as PaidMediaConfig;
          const typeLabel = campaignTypeOptions.find(t => t.id === config.campaignType)?.label;
          return (
            <div key={service.type} className="card p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--accent-purple)] to-[var(--accent-pink)] flex items-center justify-center"><Megaphone className="w-5 h-5 text-white" /></div>
                  <div><h2 className="text-2xl font-semibold text-white font-serif">Paid Media Quote Summary</h2><p className="text-[var(--text-secondary)] text-sm">{typeLabel}</p></div>
                </div>
                <div className="flex gap-2">
                  <Link href={serviceMetadata[service.type].builderPath} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-white hover:border-[var(--accent-purple)] transition-all"><Edit2 className="w-4 h-4" />Edit</Link>
                  <button onClick={() => unifiedStore.clearServiceConfig(service.type)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all"><Trash2 className="w-4 h-4" />Clear</button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCard('paid-media');
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-white hover:border-[var(--accent-purple)] transition-all"
                  >
                    {isOpen ? (
                      <>
                        <ChevronUp className="w-4 h-4" />
                        Hide
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4" />
                        Details
                      </>
                    )}
                  </button>
                </div>
              </div>
              {isOpen && (
                <div className="mt-6">
                  <div className="space-y-4"><div className="p-4 bg-[var(--bg-secondary)] rounded-lg"><div className="flex items-center gap-2 mb-3"><Megaphone className="w-5 h-5 text-[var(--accent-purple)]" /><h3 className="font-medium text-white">Campaign Type</h3></div><p className="text-[var(--text-secondary)]">{typeLabel}</p></div></div>
                </div>
              )}
              <div className="mt-6 p-4 bg-gradient-to-r from-[var(--accent-purple)]/20 to-[var(--accent-pink)]/20 border border-[var(--accent-purple)]/30 rounded-lg">
                {config.monthlyTotal > 0 && <div className="flex justify-between items-center"><span className="text-white font-semibold">Monthly</span><span className="text-xl font-bold text-[var(--accent-pink)]">${config.monthlyTotal.toFixed(2)}/mo</span></div>}
              </div>
            </div>
          );
        })}

        {/* Other Configured Services - Social Media */}
        {otherServices.filter(s => s.type === 'social-media').map((service) => {
          const isOpen = expandedCard === 'social-media';
          const config = service.config as SocialMediaConfig;
          const typeLabel = socialGoalOptions.find(t => t.id === config.managementGoal)?.label;
          return (
            <div key={service.type} className="card p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--accent-purple)] to-[var(--accent-pink)] flex items-center justify-center"><Share2 className="w-5 h-5 text-white" /></div>
                  <div><h2 className="text-2xl font-semibold text-white font-serif">Social Media Quote Summary</h2><p className="text-[var(--text-secondary)] text-sm">{typeLabel}</p></div>
                </div>
                <div className="flex gap-2">
                  <Link href={serviceMetadata[service.type].builderPath} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-white hover:border-[var(--accent-purple)] transition-all"><Edit2 className="w-4 h-4" />Edit</Link>
                  <button onClick={() => unifiedStore.clearServiceConfig(service.type)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all"><Trash2 className="w-4 h-4" />Clear</button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCard('social-media');
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-white hover:border-[var(--accent-purple)] transition-all"
                  >
                    {isOpen ? (
                      <>
                        <ChevronUp className="w-4 h-4" />
                        Hide
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4" />
                        Details
                      </>
                    )}
                  </button>
                </div>
              </div>
              {isOpen && (
                <div className="mt-6">
                  <div className="space-y-4"><div className="p-4 bg-[var(--bg-secondary)] rounded-lg"><div className="flex items-center gap-2 mb-3"><Share2 className="w-5 h-5 text-[var(--accent-purple)]" /><h3 className="font-medium text-white">Management Goal</h3></div><p className="text-[var(--text-secondary)]">{typeLabel}</p></div></div>
                </div>
              )}
              <div className="mt-6 p-4 bg-gradient-to-r from-[var(--accent-purple)]/20 to-[var(--accent-pink)]/20 border border-[var(--accent-purple)]/30 rounded-lg">
                {config.monthlyTotal > 0 && <div className="flex justify-between items-center"><span className="text-white font-semibold">Monthly</span><span className="text-xl font-bold text-[var(--accent-pink)]">${config.monthlyTotal.toFixed(2)}/mo</span></div>}
              </div>
            </div>
          );
        })}

        {/* Other Configured Services - Email Marketing */}
        {otherServices.filter(s => s.type === 'email-marketing').map((service) => {
          const isOpen = expandedCard === 'email-marketing';
          const config = service.config as EmailMarketingConfig;
          const typeLabel = emailGoalOptions.find(t => t.id === config.emailGoal)?.label;
          return (
            <div key={service.type} className="card p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--accent-purple)] to-[var(--accent-pink)] flex items-center justify-center"><Mail className="w-5 h-5 text-white" /></div>
                  <div><h2 className="text-2xl font-semibold text-white font-serif">Email Marketing Quote Summary</h2><p className="text-[var(--text-secondary)] text-sm">{typeLabel}</p></div>
                </div>
                <div className="flex gap-2">
                  <Link href={serviceMetadata[service.type].builderPath} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-white hover:border-[var(--accent-purple)] transition-all"><Edit2 className="w-4 h-4" />Edit</Link>
                  <button onClick={() => unifiedStore.clearServiceConfig(service.type)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all"><Trash2 className="w-4 h-4" />Clear</button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCard('email-marketing');
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-white hover:border-[var(--accent-purple)] transition-all"
                  >
                    {isOpen ? (
                      <>
                        <ChevronUp className="w-4 h-4" />
                        Hide
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4" />
                        Details
                      </>
                    )}
                  </button>
                </div>
              </div>
              {isOpen && (
                <div className="mt-6">
                  <div className="space-y-4"><div className="p-4 bg-[var(--bg-secondary)] rounded-lg"><div className="flex items-center gap-2 mb-3"><Mail className="w-5 h-5 text-[var(--accent-purple)]" /><h3 className="font-medium text-white">Email Goal</h3></div><p className="text-[var(--text-secondary)]">{typeLabel}</p></div></div>
                </div>
              )}
              <div className="mt-6 p-4 bg-gradient-to-r from-[var(--accent-purple)]/20 to-[var(--accent-pink)]/20 border border-[var(--accent-purple)]/30 rounded-lg">
                {config.monthlyTotal > 0 && <div className="flex justify-between items-center"><span className="text-white font-semibold">Monthly</span><span className="text-xl font-bold text-[var(--accent-pink)]">${config.monthlyTotal.toFixed(2)}/mo</span></div>}
              </div>
            </div>
          );
        })}

        {/* Add Another Service */}
        {availableServices.length > 0 && (
          <div className="card p-4">
            <button
              onClick={() => setShowAddServices(!showAddServices)}
              className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-all"
            >
              <div className="flex items-center gap-3">
                <Plus className="w-5 h-5 text-[var(--accent-purple)]" />
                <div className="text-left">
                  <h3 className="text-base font-semibold text-white">Add Another Service</h3>
                  <p className="text-[var(--text-muted)] text-xs">
                    {availableServices.length} more services available
                  </p>
                </div>
              </div>
              {showAddServices ? (
                <ChevronUp className="w-5 h-5 text-[var(--text-muted)]" />
              ) : (
                <ChevronDown className="w-5 h-5 text-[var(--text-muted)]" />
              )}
            </button>

            {showAddServices && (
              <div className="mt-6">
                <div className="grid gap-2 pt-4 border-t border-[var(--border-subtle)]">
                  {availableServices.map((serviceType) => (
                    <Link
                      key={serviceType}
                      href={serviceMetadata[serviceType].builderPath}
                      className="flex items-center justify-between p-3 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg hover:border-[var(--accent-purple)] transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        {serviceType === 'website' ? (
                          <Globe className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent-purple)]" />
                        ) : serviceType === 'app' ? (
                          <Smartphone className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent-purple)]" />
                        ) : serviceType === 'animation' ? (
                          <Film className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent-purple)]" />
                        ) : serviceType === 'image' ? (
                          <Image className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent-purple)]" />
                        ) : serviceType === 'sound' ? (
                          <Music className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent-purple)]" />
                        ) : serviceType === 'paid-media' ? (
                          <Megaphone className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent-purple)]" />
                        ) : serviceType === 'social-media' ? (
                          <Share2 className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent-purple)]" />
                        ) : serviceType === 'email-marketing' ? (
                          <Mail className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent-purple)]" />
                        ) : serviceType === 'brand-strategy' ? (
                          <Target className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent-purple)]" />
                        ) : serviceType === 'visual-identity' ? (
                          <Palette className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent-purple)]" />
                        ) : serviceType === 'brand-applications' ? (
                          <Layers className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent-purple)]" />
                        ) : serviceType === 'content-strategy' ? (
                          <FileText className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent-purple)]" />
                        ) : serviceType === 'messaging-copywriting' ? (
                          <PenTool className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent-purple)]" />
                        ) : (
                          <Phone className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent-purple)]" />
                        )}
                        <span className="text-white text-sm font-medium">{serviceMetadata[serviceType].label}</span>
                      </div>
                      <Plus className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent-purple)]" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
