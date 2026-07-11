'use client';

import { useState, useEffect } from 'react';
import { useEmailMarketingBuilderStore } from '@/hooks/useEmailMarketingBuilderStore';
import { useUnifiedQuoteStore, serviceMetadata, WebsiteConfig, AppConfig, AnimationConfig, ImageConfig, SoundConfig, PaidMediaConfig, SocialMediaConfig, VisualIdentityConfig, AIReceptionistConfig } from '@/hooks/useUnifiedQuoteStore';
import {
  basePackages as aiReceptionistPackages,
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
} from '@/data/aiReceptionistBuilder';
import {
  emailGoalOptions,
  volumeOptions,
  designOptions,
  automationOptions,
  sequenceOptions,
  listOptions,
  copyOptions,
  reportingOptions,
  testingOptions,
  platformOptions,
  additionalServicesOptions,
  durationOptions,
} from '@/data/emailMarketingBuilder';
import {
  projectTypes as websiteProjectTypes,
  timelineOptions as websiteTimelineOptions,
} from '@/data/websiteBuilder';
import {
  appTypes,
  appTimelineOptions,
} from '@/data/appBuilder';
import {
  animationTypeOptions,
  timelineOptions as animationTimelineOptions,
} from '@/data/animationBuilder';
import {
  imageTypeOptions,
  timelineOptions as imageTimelineOptions,
} from '@/data/imageBuilder';
import {
  soundTypeOptions,
  timelineOptions as soundTimelineOptions,
} from '@/data/soundBuilder';
import {
  campaignTypeOptions,
  durationOptions as paidMediaDurationOptions,
} from '@/data/paidMediaBuilder';
import {
  managementGoalOptions as socialGoalOptions,
  durationOptions as socialDurationOptions,
} from '@/data/socialMediaBuilder';
import {
  Edit2,
  Mail,
  Clock,
  Plus,
  Trash2,
  Globe,
  Smartphone,
  Film,
  Image,
  Music,
  Megaphone,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Target,
  FileText,
  Layers,
  Settings,
  Palette,
  BarChart3,
  Zap,
  Calendar,
  TrendingUp,
  Share2,
  Users,
  Send,
  Phone,
} from 'lucide-react';
import BuilderQuoteForm from '../builder/BuilderQuoteForm';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type ExpandedCard = 'email-marketing' | 'website' | 'app' | 'animation' | 'image' | 'sound' | 'paid-media' | 'social-media' | 'visual-identity' | 'ai-receptionist' | null;

interface Step11SummaryProps {
  showQuoteForm?: boolean;
  onCloseQuoteForm?: () => void;
}

export default function Step11Summary({ showQuoteForm = false, onCloseQuoteForm }: Step11SummaryProps) {
  const store = useEmailMarketingBuilderStore();
  const unifiedStore = useUnifiedQuoteStore();
  const router = useRouter();

  const [expandedCard, setExpandedCard] = useState<ExpandedCard>('email-marketing');
  const [showAddServices, setShowAddServices] = useState(false);

  // Save to unified quote on mount
  useEffect(() => {
    // Only save if emailGoal is set (meaning we have a valid configuration)
    if (store.emailGoal) {
      store.saveToUnifiedQuote();
    }
  }, [store.emailGoal, store.saveToUnifiedQuote]);

  // Get labels
  const emailGoalLabel = emailGoalOptions.find((g) => g.id === store.emailGoal)?.label;
  const volumeLabel = volumeOptions.find((v) => v.id === store.volume)?.label;
  const designLabel = designOptions.find((d) => d.id === store.design)?.label;
  const automationLabel = automationOptions.find((a) => a.id === store.automation)?.label;
  const sequencesLabel = sequenceOptions.find((s) => s.id === store.sequences)?.label;
  const listLabel = listOptions.find((l) => l.id === store.list)?.label;
  const copyLabel = copyOptions.find((c) => c.id === store.copy)?.label;
  const reportingLabel = reportingOptions.find((r) => r.id === store.reporting)?.label;
  const testingLabel = testingOptions.find((t) => t.id === store.testing)?.label;
  const platformLabel = platformOptions.find((p) => p.id === store.platform)?.label;
  const durationLabel = durationOptions.find((d) => d.id === store.duration)?.label;

  // Get available and configured services
  const availableServices = unifiedStore.getAvailableServices().filter((s) => s !== 'email-marketing');
  const configuredServices = unifiedStore.getAllConfiguredServices();
  const otherServices = configuredServices.filter((s) => s.type !== 'email-marketing');

  const handleEdit = () => {
    store.setStep(1);
  };

  const handleClear = () => {
    // Get remaining services (excluding current service)
    const remainingServices = configuredServices.filter(s => s.type !== 'email-marketing');

    // Clear from unified quote store first, then builder store
    unifiedStore.clearServiceConfig('email-marketing');
    store.resetBuilder();

    // Wrap navigation in setTimeout to ensure persist middleware has saved the state
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

  const toggleCard = (card: ExpandedCard) => {
    setExpandedCard(prev => prev === card ? null : card);
  };

  // Calculate discount/premium
  const discountPercent = store.durationMultiplier < 1 ? Math.round((1 - store.durationMultiplier) * 100) : 0;
  const premiumPercent = store.durationMultiplier > 1 ? Math.round((store.durationMultiplier - 1) * 100) : 0;

  // Summary section component
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
          className="text-[var(--text-muted)] hover:text-[var(--accent-blue)] transition-colors"
        >
          <Edit2 className="w-4 h-4" />
        </button>
      </div>
      {children}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Main Email Marketing Summary Card */}
      <div className="card p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-pink)] flex items-center justify-center">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-white font-serif">
                Email Marketing Quote Summary
              </h2>
              <p className="text-[var(--text-secondary)] text-sm">{emailGoalLabel}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-white hover:border-[var(--accent-blue)] transition-all"
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={handleClear}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all"
            >
              <Trash2 className="w-4 h-4" />
              Clear
            </button>
            <button
              onClick={() => toggleCard('email-marketing')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-white hover:border-[var(--accent-blue)] transition-all"
            >
              {expandedCard === 'email-marketing' ? (
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

        <div className={`grid transition-all duration-300 ease-in-out ${expandedCard === 'email-marketing' ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
          <div className="overflow-hidden">
            <div className="space-y-4 mt-6">
                <SummarySection title="Email Marketing Goal" icon={<Target className="w-5 h-5 text-[var(--accent-blue)]" />} stepNumber={1}>
                  <p className="text-[var(--text-secondary)]">{emailGoalLabel}</p>
                </SummarySection>

                <SummarySection title="Email Volume" icon={<Send className="w-5 h-5 text-[var(--accent-blue)]" />} stepNumber={2}>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">{volumeLabel}</span>
                    {store.volumePrice !== null ? (
                      <span className="text-[var(--accent-pink)]">${store.volumePrice}/mo</span>
                    ) : (
                      <span className="text-[var(--accent-orange)]">Custom Quote</span>
                    )}
                  </div>
                </SummarySection>

                <SummarySection title="Email Design" icon={<Palette className="w-5 h-5 text-[var(--accent-blue)]" />} stepNumber={3}>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">{designLabel}</span>
                    {store.designPrice > 0 ? (
                      <span className="text-[var(--accent-pink)]">${store.designPrice}/mo</span>
                    ) : (
                      <span className="text-[var(--text-muted)]">$0</span>
                    )}
                  </div>
                </SummarySection>

                <SummarySection title="Automation" icon={<Settings className="w-5 h-5 text-[var(--accent-blue)]" />} stepNumber={4}>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">{automationLabel}</span>
                    {store.automationPrice > 0 ? (
                      <span className="text-[var(--accent-pink)]">${store.automationPrice}/mo</span>
                    ) : (
                      <span className="text-[var(--text-muted)]">$0</span>
                    )}
                  </div>
                </SummarySection>

                <SummarySection title="Automation Sequences" icon={<Layers className="w-5 h-5 text-[var(--accent-blue)]" />} stepNumber={5}>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">{sequencesLabel}</span>
                    {store.sequencesPrice === null && store.sequences && store.sequences !== 'none' ? (
                      <span className="text-[var(--accent-orange)]">Custom Quote</span>
                    ) : store.sequencesPrice !== null && store.sequencesPrice > 0 ? (
                      <span className="text-white">${store.sequencesPrice} one-time</span>
                    ) : (
                      <span className="text-[var(--text-muted)]">$0</span>
                    )}
                  </div>
                </SummarySection>

                <SummarySection title="List Management" icon={<Users className="w-5 h-5 text-[var(--accent-blue)]" />} stepNumber={6}>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">{listLabel}</span>
                    {store.listPrice > 0 ? (
                      <span className="text-[var(--accent-pink)]">${store.listPrice}/mo</span>
                    ) : (
                      <span className="text-[var(--text-muted)]">$0</span>
                    )}
                  </div>
                </SummarySection>

                <SummarySection title="Copywriting" icon={<FileText className="w-5 h-5 text-[var(--accent-blue)]" />} stepNumber={7}>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">{copyLabel}</span>
                    {store.copyPrice > 0 ? (
                      <span className="text-[var(--accent-pink)]">${store.copyPrice}/mo</span>
                    ) : (
                      <span className="text-[var(--text-muted)]">$0</span>
                    )}
                  </div>
                </SummarySection>

                <SummarySection title="Reporting" icon={<BarChart3 className="w-5 h-5 text-[var(--accent-blue)]" />} stepNumber={8}>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">{reportingLabel}</span>
                    {store.reportingPrice > 0 ? (
                      <span className="text-[var(--accent-pink)]">${store.reportingPrice}/mo</span>
                    ) : (
                      <span className="text-[var(--text-muted)]">Included</span>
                    )}
                  </div>
                </SummarySection>

                <SummarySection title="Add-ons" icon={<Zap className="w-5 h-5 text-[var(--accent-blue)]" />} stepNumber={9}>
                  {store.testing === 'none' && store.platform === 'client' && store.selectedAdditionalServices.length === 0 ? (
                    <p className="text-[var(--text-muted)] text-sm">No add-ons selected</p>
                  ) : (
                    <div className="space-y-2">
                      {store.testing !== 'none' && (
                        <div className="flex justify-between text-sm">
                          <span className="text-[var(--text-secondary)]">{testingLabel}</span>
                          <span className="text-[var(--accent-pink)]">${store.testingPrice}/mo</span>
                        </div>
                      )}
                      {store.platform !== 'client' && (
                        <div className="flex justify-between text-sm">
                          <span className="text-[var(--text-secondary)]">{platformLabel}</span>
                          <span className="text-[var(--accent-pink)]">${store.platformPrice}/mo</span>
                        </div>
                      )}
                      {store.selectedAdditionalServices.map((service) => {
                        const serviceData = additionalServicesOptions.find((s) => s.id === service.id);
                        return (
                          <div key={service.id} className="flex justify-between text-sm">
                            <span className="text-[var(--text-secondary)]">{serviceData?.label}</span>
                            <span className={service.oneTime ? 'text-white' : 'text-[var(--accent-pink)]'}>
                              ${service.price}{service.oneTime ? '' : '/mo'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </SummarySection>

                <SummarySection title="Duration" icon={<Calendar className="w-5 h-5 text-[var(--accent-blue)]" />} stepNumber={10}>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">{durationLabel}</span>
                    {discountPercent > 0 && (
                      <span className="text-[var(--accent-blue-light)] font-medium">-{discountPercent}% discount</span>
                    )}
                    {premiumPercent > 0 && (
                      <span className="text-[var(--accent-orange)] font-medium">+{premiumPercent}% premium</span>
                    )}
                    {store.durationMultiplier === 1 && (
                      <span className="text-[var(--text-muted)]">Standard rate</span>
                    )}
                  </div>
                </SummarySection>
              </div>
            </div>
          </div>

        {/* Totals */}
        <div className="mt-6 p-4 bg-gradient-to-r from-[var(--accent-blue)]/20 to-[var(--accent-pink)]/20 border border-[var(--accent-blue)]/30 rounded-lg">
          {store.hasCustomQuote ? (
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[var(--accent-orange)] shrink-0 mt-0.5" />
              <div>
                <p className="text-white font-semibold">Custom Quote Required</p>
                <p className="text-sm text-[var(--text-secondary)] mt-1">
                  Some selections require custom pricing. Submit your configuration for a detailed quote.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-white font-semibold">Monthly Total</span>
                <span className="text-xl font-bold text-[var(--accent-pink)]">
                  ${store.monthlyTotal.toFixed(2)}/mo
                </span>
              </div>
              {store.oneTimeTotal > 0 && (
                <div className="flex justify-between items-center pt-2 border-t border-[var(--border-subtle)]">
                  <span className="text-white font-semibold">One-Time Setup</span>
                  <span className="text-xl font-bold text-white">${store.oneTimeTotal.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between items-center pt-3 border-t-2 border-[var(--accent-blue)]/50">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[var(--accent-blue)]" />
                  <span className="text-white font-bold">{store.durationMonths}-Month Investment</span>
                </div>
                <span className="text-2xl font-bold gradient-text">${store.totalInvestment.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center mt-2 pt-2 border-t-2 border-[var(--accent-blue)]/50">
                <span className="text-white font-bold">Due Today</span>
                <span className="text-xl font-bold gradient-text">${(store.oneTimeTotal + store.monthlyTotal).toLocaleString()}</span>
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-1">Setup + first month&apos;s service</p>
            </div>
          )}
        </div>
      </div>

      {/* Other Configured Services - Website */}
      {otherServices.filter((s) => s.type === 'website').map((service) => {
        const isOpen = expandedCard === 'website';
        const config = service.config as WebsiteConfig;
        const projectTypeLabel = websiteProjectTypes.find((t) => t.id === config.projectType)?.label;
        const timelineLabel = websiteTimelineOptions.find((t) => t.id === config.timeline)?.label;

        return (
          <div key={service.type} className="card p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-pink)] flex items-center justify-center">
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
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-white hover:border-[var(--accent-blue)] transition-all"
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
                  onClick={() => toggleCard('website')}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-white hover:border-[var(--accent-blue)] transition-all"
                >
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  {isOpen ? 'Hide' : 'Details'}
                </button>
              </div>
            </div>

            <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
              <div className="overflow-hidden">
                <div className="space-y-4 mt-6">
                  <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <Globe className="w-5 h-5 text-[var(--accent-blue)]" />
                      <h3 className="font-medium text-white">Project Type</h3>
                    </div>
                    <p className="text-[var(--text-secondary)]">{projectTypeLabel}</p>
                  </div>
                  <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <Clock className="w-5 h-5 text-[var(--accent-blue)]" />
                      <h3 className="font-medium text-white">Timeline</h3>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--text-secondary)]">{timelineLabel}</span>
                      {config.rushFee > 0 ? (
                        <span className="text-[var(--accent-orange)] font-medium">+${config.rushFee.toLocaleString()}</span>
                      ) : (
                        <span className="text-[var(--accent-blue-light)] font-medium">No rush fee</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-[var(--accent-blue)]/20 to-[var(--accent-pink)]/20 border border-[var(--accent-blue)]/30 rounded-lg">
              {config.hasCustomQuote ? (
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-[var(--accent-orange)] shrink-0 mt-0.5" />
                  <p className="text-white font-semibold">Custom Quote Required</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-semibold">One-time Total</span>
                    <span className="text-2xl font-bold gradient-text">${config.total.toLocaleString()}</span>
                  </div>
                  {config.monthlyRecurring > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-white font-semibold">Monthly</span>
                      <span className="text-lg font-semibold text-[var(--accent-pink)]">${config.monthlyRecurring}/mo</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Other Configured Services - App */}
      {otherServices.filter((s) => s.type === 'app').map((service) => {
        const isOpen = expandedCard === 'app';
        const config = service.config as AppConfig;
        const appTypeLabel = appTypes.find((t) => t.id === config.appType)?.label;
        const timelineLabel = appTimelineOptions.find((t) => t.id === config.timeline)?.label;

        return (
          <div key={service.type} className="card p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-pink)] flex items-center justify-center">
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
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-white hover:border-[var(--accent-blue)] transition-all"
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
                  onClick={() => toggleCard('app')}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-white hover:border-[var(--accent-blue)] transition-all"
                >
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  {isOpen ? 'Hide' : 'Details'}
                </button>
              </div>
            </div>

            <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
              <div className="overflow-hidden">
                <div className="space-y-4 mt-6">
                  <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <Smartphone className="w-5 h-5 text-[var(--accent-blue)]" />
                      <h3 className="font-medium text-white">App Type</h3>
                    </div>
                    <p className="text-[var(--text-secondary)]">{appTypeLabel}</p>
                  </div>
                  <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <Clock className="w-5 h-5 text-[var(--accent-blue)]" />
                      <h3 className="font-medium text-white">Timeline</h3>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--text-secondary)]">{timelineLabel}</span>
                      {config.rushFee > 0 ? (
                        <span className="text-[var(--accent-orange)] font-medium">+${config.rushFee.toLocaleString()}</span>
                      ) : (
                        <span className="text-[var(--accent-blue-light)] font-medium">No rush fee</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-[var(--accent-blue)]/20 to-[var(--accent-pink)]/20 border border-[var(--accent-blue)]/30 rounded-lg">
              {config.hasCustomQuote ? (
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-[var(--accent-orange)] shrink-0 mt-0.5" />
                  <p className="text-white font-semibold">Custom Quote Required</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-semibold">One-time Total</span>
                    <span className="text-2xl font-bold gradient-text">${config.oneTimeTotal.toLocaleString()}</span>
                  </div>
                  {config.monthlyTotal > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-white font-semibold">Monthly</span>
                      <span className="text-lg font-semibold text-[var(--accent-pink)]">${config.monthlyTotal}/mo</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Other Configured Services - Animation */}
      {otherServices.filter((s) => s.type === 'animation').map((service) => {
        const isOpen = expandedCard === 'animation';
        const config = service.config as AnimationConfig;
        const animTypeLabel = animationTypeOptions.find((t) => t.id === config.animationType)?.label;
        const timelineLabel = animationTimelineOptions.find((t) => t.id === config.timeline)?.label;

        return (
          <div key={service.type} className="card p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-pink)] flex items-center justify-center">
                  <Film className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-white font-serif">Animation Quote Summary</h2>
                  <p className="text-[var(--text-secondary)] text-sm">{animTypeLabel}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Link
                  href={serviceMetadata[service.type].builderPath}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-white hover:border-[var(--accent-blue)] transition-all"
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
                  onClick={() => toggleCard('animation')}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-white hover:border-[var(--accent-blue)] transition-all"
                >
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  {isOpen ? 'Hide' : 'Details'}
                </button>
              </div>
            </div>

            <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
              <div className="overflow-hidden">
                <div className="space-y-4 mt-6">
                  <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <Film className="w-5 h-5 text-[var(--accent-blue)]" />
                      <h3 className="font-medium text-white">Animation Type</h3>
                    </div>
                    <p className="text-[var(--text-secondary)]">{animTypeLabel}</p>
                  </div>
                  <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <Clock className="w-5 h-5 text-[var(--accent-blue)]" />
                      <h3 className="font-medium text-white">Timeline</h3>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--text-secondary)]">{timelineLabel}</span>
                      {config.rushFee > 0 ? (
                        <span className="text-[var(--accent-orange)] font-medium">+${config.rushFee.toLocaleString()}</span>
                      ) : (
                        <span className="text-[var(--accent-blue-light)] font-medium">No rush fee</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-[var(--accent-blue)]/20 to-[var(--accent-pink)]/20 border border-[var(--accent-blue)]/30 rounded-lg">
              {config.hasCustomQuote ? (
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-[var(--accent-orange)] shrink-0 mt-0.5" />
                  <p className="text-white font-semibold">Custom Quote Required</p>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <span className="text-white font-semibold">Total</span>
                  <span className="text-2xl font-bold gradient-text">${config.total.toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Other Configured Services - Image */}
      {otherServices.filter((s) => s.type === 'image').map((service) => {
        const isOpen = expandedCard === 'image';
        const config = service.config as ImageConfig;
        const imgTypeLabel = imageTypeOptions.find((t) => t.id === config.imageType)?.label;
        const timelineLabel = imageTimelineOptions.find((t) => t.id === config.timeline)?.label;

        return (
          <div key={service.type} className="card p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-pink)] flex items-center justify-center">
                  <Image className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-white font-serif">Image Quote Summary</h2>
                  <p className="text-[var(--text-secondary)] text-sm">{imgTypeLabel}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Link
                  href={serviceMetadata[service.type].builderPath}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-white hover:border-[var(--accent-blue)] transition-all"
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
                  onClick={() => toggleCard('image')}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-white hover:border-[var(--accent-blue)] transition-all"
                >
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  {isOpen ? 'Hide' : 'Details'}
                </button>
              </div>
            </div>

            <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
              <div className="overflow-hidden">
                <div className="space-y-4 mt-6">
                  <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <Image className="w-5 h-5 text-[var(--accent-blue)]" />
                      <h3 className="font-medium text-white">Image Type</h3>
                    </div>
                    <p className="text-[var(--text-secondary)]">{imgTypeLabel}</p>
                  </div>
                  <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <Clock className="w-5 h-5 text-[var(--accent-blue)]" />
                      <h3 className="font-medium text-white">Timeline</h3>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--text-secondary)]">{timelineLabel}</span>
                      {config.rushFee > 0 ? (
                        <span className="text-[var(--accent-orange)] font-medium">+${config.rushFee.toLocaleString()}</span>
                      ) : (
                        <span className="text-[var(--accent-blue-light)] font-medium">No rush fee</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-[var(--accent-blue)]/20 to-[var(--accent-pink)]/20 border border-[var(--accent-blue)]/30 rounded-lg">
              {config.hasCustomQuote ? (
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-[var(--accent-orange)] shrink-0 mt-0.5" />
                  <p className="text-white font-semibold">Custom Quote Required</p>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <span className="text-white font-semibold">Total</span>
                  <span className="text-2xl font-bold gradient-text">${config.total.toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Other Configured Services - Sound */}
      {otherServices.filter((s) => s.type === 'sound').map((service) => {
        const isOpen = expandedCard === 'sound';
        const config = service.config as SoundConfig;
        const soundTypeLabel = soundTypeOptions.find((t) => t.id === config.soundType)?.label;
        const timelineLabel = soundTimelineOptions.find((t) => t.id === config.timeline)?.label;

        return (
          <div key={service.type} className="card p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-pink)] flex items-center justify-center">
                  <Music className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-white font-serif">Sound Quote Summary</h2>
                  <p className="text-[var(--text-secondary)] text-sm">{soundTypeLabel}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Link
                  href={serviceMetadata[service.type].builderPath}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-white hover:border-[var(--accent-blue)] transition-all"
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
                  onClick={() => toggleCard('sound')}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-white hover:border-[var(--accent-blue)] transition-all"
                >
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  {isOpen ? 'Hide' : 'Details'}
                </button>
              </div>
            </div>

            <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
              <div className="overflow-hidden">
                <div className="space-y-4 mt-6">
                  <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <Music className="w-5 h-5 text-[var(--accent-blue)]" />
                      <h3 className="font-medium text-white">Sound Type</h3>
                    </div>
                    <p className="text-[var(--text-secondary)]">{soundTypeLabel}</p>
                  </div>
                  <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <Clock className="w-5 h-5 text-[var(--accent-blue)]" />
                      <h3 className="font-medium text-white">Timeline</h3>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--text-secondary)]">{timelineLabel}</span>
                      {config.rushFee > 0 ? (
                        <span className="text-[var(--accent-orange)] font-medium">+${config.rushFee.toLocaleString()}</span>
                      ) : (
                        <span className="text-[var(--accent-blue-light)] font-medium">No rush fee</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-[var(--accent-blue)]/20 to-[var(--accent-pink)]/20 border border-[var(--accent-blue)]/30 rounded-lg">
              {config.hasCustomQuote ? (
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-[var(--accent-orange)] shrink-0 mt-0.5" />
                  <p className="text-white font-semibold">Custom Quote Required</p>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <span className="text-white font-semibold">Total</span>
                  <span className="text-2xl font-bold gradient-text">${config.total.toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Other Configured Services - Paid Media */}
      {otherServices.filter((s) => s.type === 'paid-media').map((service) => {
        const isOpen = expandedCard === 'paid-media';
        const config = service.config as PaidMediaConfig;
        const campaignLabel = campaignTypeOptions.find((t) => t.id === config.campaignType)?.label;
        const durationLabelPM = paidMediaDurationOptions.find((d) => d.id === config.duration)?.label;

        return (
          <div key={service.type} className="card p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-pink)] flex items-center justify-center">
                  <Megaphone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-white font-serif">Paid Media Quote Summary</h2>
                  <p className="text-[var(--text-secondary)] text-sm">{campaignLabel}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Link
                  href={serviceMetadata[service.type].builderPath}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-white hover:border-[var(--accent-blue)] transition-all"
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
                  onClick={() => toggleCard('paid-media')}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-white hover:border-[var(--accent-blue)] transition-all"
                >
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  {isOpen ? 'Hide' : 'Details'}
                </button>
              </div>
            </div>

            <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
              <div className="overflow-hidden">
                <div className="space-y-4 mt-6">
                  <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <Megaphone className="w-5 h-5 text-[var(--accent-blue)]" />
                      <h3 className="font-medium text-white">Campaign Type</h3>
                    </div>
                    <p className="text-[var(--text-secondary)]">{campaignLabel}</p>
                  </div>
                  <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar className="w-5 h-5 text-[var(--accent-blue)]" />
                      <h3 className="font-medium text-white">Duration</h3>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--text-secondary)]">{durationLabelPM}</span>
                      <span className="text-[var(--text-muted)]">{config.durationMonths} months</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-[var(--accent-blue)]/20 to-[var(--accent-pink)]/20 border border-[var(--accent-blue)]/30 rounded-lg">
              {config.hasCustomQuote ? (
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-[var(--accent-orange)] shrink-0 mt-0.5" />
                  <p className="text-white font-semibold">Custom Quote Required</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-semibold">Monthly</span>
                    <span className="text-lg font-semibold text-[var(--accent-pink)]">${config.monthlyTotal.toFixed(2)}/mo</span>
                  </div>
                  {config.oneTimeTotal > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-white font-semibold">One-Time Setup</span>
                      <span className="text-lg font-semibold text-white">${config.oneTimeTotal.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-2 border-t border-[var(--border-subtle)]">
                    <span className="text-white font-bold">{config.durationMonths}-Month Total</span>
                    <span className="text-2xl font-bold gradient-text">${config.totalInvestment.toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Other Configured Services - Social Media */}
      {otherServices.filter((s) => s.type === 'social-media').map((service) => {
        const isOpen = expandedCard === 'social-media';
        const config = service.config as SocialMediaConfig;
        const goalLabel = socialGoalOptions.find((g) => g.id === config.managementGoal)?.label;
        const durationLabelSM = socialDurationOptions.find((d) => d.id === config.duration)?.label;

        return (
          <div key={service.type} className="card p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-pink)] flex items-center justify-center">
                  <Share2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-white font-serif">Social Media Quote Summary</h2>
                  <p className="text-[var(--text-secondary)] text-sm">{goalLabel}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Link
                  href={serviceMetadata[service.type].builderPath}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-white hover:border-[var(--accent-blue)] transition-all"
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
                  onClick={() => toggleCard('social-media')}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-white hover:border-[var(--accent-blue)] transition-all"
                >
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  {isOpen ? 'Hide' : 'Details'}
                </button>
              </div>
            </div>

            <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
              <div className="overflow-hidden">
                <div className="space-y-4 mt-6">
                  <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <Share2 className="w-5 h-5 text-[var(--accent-blue)]" />
                      <h3 className="font-medium text-white">Management Goal</h3>
                    </div>
                    <p className="text-[var(--text-secondary)]">{goalLabel}</p>
                  </div>
                  <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar className="w-5 h-5 text-[var(--accent-blue)]" />
                      <h3 className="font-medium text-white">Duration</h3>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--text-secondary)]">{durationLabelSM}</span>
                      {config.durationMultiplier < 1 && (
                        <span className="text-[var(--accent-blue-light)] font-medium">-{Math.round((1 - config.durationMultiplier) * 100)}% discount</span>
                      )}
                      {config.durationMultiplier > 1 && (
                        <span className="text-[var(--accent-orange)] font-medium">+{Math.round((config.durationMultiplier - 1) * 100)}% premium</span>
                      )}
                      {config.durationMultiplier === 1 && (
                        <span className="text-[var(--text-muted)]">Standard rate</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-[var(--accent-blue)]/20 to-[var(--accent-pink)]/20 border border-[var(--accent-blue)]/30 rounded-lg">
              {config.hasCustomQuote ? (
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-[var(--accent-orange)] shrink-0 mt-0.5" />
                  <p className="text-white font-semibold">Custom Quote Required</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-semibold">Monthly Total</span>
                    <span className="text-xl font-bold text-[var(--accent-pink)]">${config.monthlyTotal.toFixed(2)}/mo</span>
                  </div>
                  {config.oneTimeTotal > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-white font-semibold">One-Time Setup</span>
                      <span className="text-lg font-semibold text-white">${config.oneTimeTotal.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-2 border-t border-[var(--border-subtle)]">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-[var(--accent-blue)]" />
                      <span className="text-white font-bold">{config.durationMonths}-Month Investment</span>
                    </div>
                    <span className="text-2xl font-bold gradient-text">${config.totalInvestment.toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Other Configured Services - Visual Identity */}
      {otherServices.filter((s) => s.type === 'visual-identity').map((service) => {
        const isOpen = expandedCard === 'visual-identity';
        const config = service.config as VisualIdentityConfig;

        return (
          <div key={service.type} className="card p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-pink)] flex items-center justify-center">
                  <Palette className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-white font-serif">Visual Identity Quote Summary</h2>
                </div>
              </div>
              <div className="flex gap-2">
                <Link
                  href={serviceMetadata[service.type].builderPath}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-white hover:border-[var(--accent-blue)] transition-all"
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
                  onClick={() => toggleCard('visual-identity')}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-white hover:border-[var(--accent-blue)] transition-all"
                >
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  {isOpen ? 'Hide' : 'Details'}
                </button>
              </div>
            </div>

            <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
              <div className="overflow-hidden">
                <div className="space-y-4 mt-6">
                  <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <Palette className="w-5 h-5 text-[var(--accent-blue)]" />
                      <h3 className="font-medium text-white">Visual Identity Package</h3>
                    </div>
                    <p className="text-[var(--text-secondary)]">Custom visual identity design and branding</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-[var(--accent-blue)]/20 to-[var(--accent-pink)]/20 border border-[var(--accent-blue)]/30 rounded-lg">
              {config.hasCustomQuote ? (
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-[var(--accent-orange)] shrink-0 mt-0.5" />
                  <p className="text-white font-semibold">Custom Quote Required</p>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <span className="text-white font-semibold">Total Investment</span>
                  <span className="text-2xl font-bold gradient-text">${config.totalInvestment.toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Other Configured Services - AI Receptionist */}
      {otherServices.filter(s => s.type === 'ai-receptionist').map((service) => {
        const isOpen = expandedCard === 'ai-receptionist';
        const config = service.config as AIReceptionistConfig;
        const packageLabel = aiReceptionistPackages.find(p => p.id === config.basePackage)?.name;

        return (
          <div key={service.type} className="card p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-pink)] flex items-center justify-center">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-white font-serif">AI Receptionist Quote Summary</h2>
                  <p className="text-[var(--text-secondary)] text-sm">{packageLabel}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Link
                  href={serviceMetadata[service.type].builderPath}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-white hover:border-[var(--accent-blue)] transition-all"
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
                  onClick={() => toggleCard('ai-receptionist')}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-white hover:border-[var(--accent-blue)] transition-all"
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

            <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
              <div className="overflow-hidden">
                <div className="space-y-4 mt-6">
                  {/* Package Section */}
                  <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <Phone className="w-5 h-5 text-[var(--accent-blue)]" />
                      <h3 className="font-medium text-white">Package</h3>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--text-secondary)]">{packageLabel}</span>
                      <span className="text-[var(--accent-pink)]">
                        ${aiReceptionistPackages.find(p => p.id === config.basePackage)?.displayPrice || 0}/mo base
                      </span>
                    </div>
                  </div>

                    {/* Phone Setup Section */}
                    <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <Phone className="w-5 h-5 text-[var(--accent-blue)]" />
                        <h3 className="font-medium text-white">Phone Setup</h3>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-[var(--text-secondary)]">
                            {phoneNumberTypeOptions.find(o => o.id === config.phoneNumberType)?.label || 'Local Number'}
                          </span>
                          <span className="text-[var(--accent-pink)]">
                            ${phoneNumberTypeOptions.find(o => o.id === config.phoneNumberType)?.monthlyPrice || 0}/mo
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-[var(--text-secondary)]">
                            {additionalLinesOptions.find(o => o.id === config.additionalLines)?.label || '1 line'}
                          </span>
                          <span className="text-[var(--accent-pink)]">
                            ${additionalLinesOptions.find(o => o.id === config.additionalLines)?.monthlyPrice || 0}/mo
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-[var(--text-secondary)]">
                            {coverageAreaOptions.find(o => o.id === config.coverageArea)?.label || 'Single Region (US)'}
                          </span>
                          <span className="text-[var(--accent-pink)]">
                            ${coverageAreaOptions.find(o => o.id === config.coverageArea)?.monthlyPrice || 0}/mo
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Call Handling Section */}
                    <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <Settings className="w-5 h-5 text-[var(--accent-blue)]" />
                        <h3 className="font-medium text-white">Call Handling</h3>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-[var(--text-secondary)]">
                            {monthlyMinutesOptions.find(o => o.id === config.monthlyMinutes)?.label || '100 minutes'}
                          </span>
                          <span className="text-[var(--accent-pink)]">
                            ${monthlyMinutesOptions.find(o => o.id === config.monthlyMinutes)?.monthlyPrice || 0}/mo
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-[var(--text-secondary)]">
                            {availabilityOptions.find(o => o.id === config.availability)?.label || 'Business Hours'}
                          </span>
                          <span className="text-[var(--accent-pink)]">
                            ${availabilityOptions.find(o => o.id === config.availability)?.monthlyPrice || 0}/mo
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-[var(--text-secondary)]">
                            {callTransferOptions.find(o => o.id === config.callTransfer)?.label || 'No Transfers'}
                          </span>
                          <span className="text-[var(--accent-pink)]">
                            ${callTransferOptions.find(o => o.id === config.callTransfer)?.monthlyPrice || 0}/mo
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-[var(--text-secondary)]">
                            {voicemailOptions.find(o => o.id === config.voicemailType)?.label || 'Basic Voicemail'}
                          </span>
                          <span className="text-[var(--accent-pink)]">
                            ${voicemailOptions.find(o => o.id === config.voicemailType)?.monthlyPrice || 0}/mo
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-[var(--text-secondary)]">
                            {maxCallDurationOptions.find(o => o.id === config.maxCallDuration)?.label || '5 minutes per call'}
                          </span>
                          <span className="text-[var(--accent-pink)]">
                            ${maxCallDurationOptions.find(o => o.id === config.maxCallDuration)?.monthlyPrice || 0}/mo
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* AI Capabilities Section */}
                    <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <Zap className="w-5 h-5 text-[var(--accent-blue)]" />
                        <h3 className="font-medium text-white">AI Capabilities</h3>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-[var(--text-secondary)]">
                            {languageOptions.find(o => o.id === config.language)?.label || 'English Only'}
                          </span>
                          <span className="text-[var(--accent-pink)]">
                            ${languageOptions.find(o => o.id === config.language)?.monthlyPrice || 0}/mo
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-[var(--text-secondary)]">
                            {voiceStyleOptions.find(o => o.id === config.voiceStyle)?.label || 'Standard Professional'}
                          </span>
                          <span className="text-[var(--accent-pink)]">
                            ${voiceStyleOptions.find(o => o.id === config.voiceStyle)?.monthlyPrice || 0}/mo
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-[var(--text-secondary)]">
                            {knowledgeBaseSizeOptions.find(o => o.id === config.knowledgeBaseSize)?.label || 'Basic (up to 25 FAQs)'}
                          </span>
                          <span className="text-[var(--accent-pink)]">
                            ${knowledgeBaseSizeOptions.find(o => o.id === config.knowledgeBaseSize)?.monthlyPrice || 0}/mo
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-[var(--text-secondary)]">
                            {conversationComplexityOptions.find(o => o.id === config.conversationComplexity)?.label || 'Simple Q&A'}
                          </span>
                          <span className="text-[var(--accent-pink)]">
                            ${conversationComplexityOptions.find(o => o.id === config.conversationComplexity)?.monthlyPrice || 0}/mo
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-[var(--text-secondary)]">
                            {personalityOptions.find(o => o.id === config.personality)?.label || 'Professional & Friendly'}
                          </span>
                          <span className="text-[var(--accent-pink)]">
                            ${personalityOptions.find(o => o.id === config.personality)?.monthlyPrice || 0}/mo
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Integrations Section */}
                    <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <Globe className="w-5 h-5 text-[var(--accent-blue)]" />
                        <h3 className="font-medium text-white">Integrations</h3>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-[var(--text-secondary)]">
                            Lead Capture: {leadCaptureOptions.find(o => o.id === config.leadCapture)?.label || 'Google Sheets'}
                          </span>
                          <span className="text-[var(--accent-pink)]">
                            ${leadCaptureOptions.find(o => o.id === config.leadCapture)?.monthlyPrice || 0}/mo
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-[var(--text-secondary)]">
                            Calendar: {calendarOptions.find(o => o.id === config.calendar)?.label || 'None'}
                          </span>
                          <span className="text-[var(--accent-pink)]">
                            ${calendarOptions.find(o => o.id === config.calendar)?.monthlyPrice || 0}/mo
                          </span>
                        </div>
                        {config.notifications && config.notifications.length > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-[var(--text-secondary)]">
                              Notifications: {config.notifications.map(n => notificationOptions.find(o => o.id === n)?.label).filter(Boolean).join(', ')}
                            </span>
                            <span className="text-[var(--accent-pink)]">
                              ${config.notifications.reduce((sum, n) => sum + (notificationOptions.find(o => o.id === n)?.monthlyPrice || 0), 0)}/mo
                            </span>
                          </div>
                        )}
                        {config.additionalIntegrations && config.additionalIntegrations.length > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-[var(--text-secondary)]">
                              Additional: {config.additionalIntegrations.map(i => additionalIntegrationOptions.find(o => o.id === i)?.label).filter(Boolean).join(', ')}
                            </span>
                            <span className="text-[var(--accent-pink)]">
                              ${config.additionalIntegrations.reduce((sum, i) => sum + (additionalIntegrationOptions.find(o => o.id === i)?.monthlyPrice || 0), 0)}/mo
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Reporting Section */}
                    <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <BarChart3 className="w-5 h-5 text-[var(--accent-blue)]" />
                        <h3 className="font-medium text-white">Reporting & Analytics</h3>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-[var(--text-secondary)]">
                            {transcriptsOptions.find(o => o.id === config.transcripts)?.label || 'No Transcripts'}
                          </span>
                          <span className="text-[var(--accent-pink)]">
                            ${transcriptsOptions.find(o => o.id === config.transcripts)?.monthlyPrice || 0}/mo
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-[var(--text-secondary)]">
                            {aiSummariesOptions.find(o => o.id === config.aiSummaries)?.label || 'No Summaries'}
                          </span>
                          <span className="text-[var(--accent-pink)]">
                            ${aiSummariesOptions.find(o => o.id === config.aiSummaries)?.monthlyPrice || 0}/mo
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-[var(--text-secondary)]">
                            {analyticsLevelOptions.find(o => o.id === config.analyticsLevel)?.label || 'Basic Metrics'}
                          </span>
                          <span className="text-[var(--accent-pink)]">
                            ${analyticsLevelOptions.find(o => o.id === config.analyticsLevel)?.monthlyPrice || 0}/mo
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-[var(--text-secondary)]">
                            {reportingFrequencyOptions.find(o => o.id === config.reportingFrequency)?.label || 'Self-Serve (Dashboard)'}
                          </span>
                          <span className="text-[var(--accent-pink)]">
                            ${reportingFrequencyOptions.find(o => o.id === config.reportingFrequency)?.monthlyPrice || 0}/mo
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Support Section */}
                    <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <FileText className="w-5 h-5 text-[var(--accent-blue)]" />
                        <h3 className="font-medium text-white">Support & Onboarding</h3>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-[var(--text-secondary)]">
                            {onboardingTypeOptions.find(o => o.id === config.onboardingType)?.label || 'Self-Serve'}
                          </span>
                          <span className="text-white">
                            ${onboardingTypeOptions.find(o => o.id === config.onboardingType)?.oneTimePrice || 0} one-time
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-[var(--text-secondary)]">
                            {knowledgeUpdatesOptions.find(o => o.id === config.knowledgeUpdates)?.label || 'Self-Serve'}
                          </span>
                          <span className="text-[var(--accent-pink)]">
                            ${knowledgeUpdatesOptions.find(o => o.id === config.knowledgeUpdates)?.monthlyPrice || 0}/mo
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-[var(--text-secondary)]">
                            {supportLevelOptions.find(o => o.id === config.supportLevel)?.label || 'Email Support'}
                          </span>
                          <span className="text-[var(--accent-pink)]">
                            ${supportLevelOptions.find(o => o.id === config.supportLevel)?.monthlyPrice || 0}/mo
                          </span>
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-[var(--accent-blue)]/20 to-[var(--accent-pink)]/20 border border-[var(--accent-blue)]/30 rounded-lg">
              {config.hasCustomQuote ? (
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-[var(--accent-orange)] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white font-semibold">Custom Quote Required</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-white font-semibold">One-time Setup</span>
                    <span className="text-2xl font-bold gradient-text">
                      ${config.oneTimeTotal.toLocaleString()}
                    </span>
                  </div>
                  {config.monthlyTotal > 0 && (
                    <div className="flex justify-between items-center mt-2 pt-2 border-t border-[var(--border-subtle)]">
                      <span className="text-white font-semibold">Monthly Total</span>
                      <span className="text-lg font-semibold text-[var(--accent-pink)]">${config.monthlyTotal.toFixed(2)}/mo</span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        );
      })}

      {/* Add More Services - Collapsible */}
      {availableServices.length > 0 && (
        <div className="card p-4">
          <button
            onClick={() => setShowAddServices(!showAddServices)}
            className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-all"
          >
            <div className="flex items-center gap-3">
              <Plus className="w-5 h-5 text-[var(--accent-blue)]" />
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

          <div className={`grid transition-all duration-300 ease-in-out ${showAddServices ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
            <div className="overflow-hidden">
              <div className="grid gap-2 mt-4 pt-4 border-t border-[var(--border-subtle)]">
                {availableServices.map((serviceType) => (
                  <Link
                    key={serviceType}
                    href={serviceMetadata[serviceType].builderPath}
                    className="flex items-center justify-between p-3 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg hover:border-[var(--accent-blue)] transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      {serviceType === 'website' ? (
                        <Globe className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent-blue)]" />
                      ) : serviceType === 'app' ? (
                        <Smartphone className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent-blue)]" />
                      ) : serviceType === 'animation' ? (
                        <Film className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent-blue)]" />
                      ) : serviceType === 'image' ? (
                        <Image className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent-blue)]" />
                      ) : serviceType === 'sound' ? (
                        <Music className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent-blue)]" />
                      ) : serviceType === 'paid-media' ? (
                        <Megaphone className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent-blue)]" />
                      ) : serviceType === 'social-media' ? (
                        <Share2 className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent-blue)]" />
                      ) : serviceType === 'brand-strategy' ? (
                        <Target className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent-blue)]" />
                      ) : serviceType === 'visual-identity' ? (
                        <Palette className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent-blue)]" />
                      ) : serviceType === 'ai-receptionist' ? (
                        <Phone className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent-blue)]" />
                      ) : (
                        <Mail className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent-blue)]" />
                      )}
                      <span className="text-white text-sm font-medium">{serviceMetadata[serviceType].label}</span>
                    </div>
                    <Plus className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent-blue)]" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quote Form Modal */}
      {showQuoteForm && (
        <BuilderQuoteForm
          onBack={() => onCloseQuoteForm?.()}
        />
      )}
    </div>
  );
}
