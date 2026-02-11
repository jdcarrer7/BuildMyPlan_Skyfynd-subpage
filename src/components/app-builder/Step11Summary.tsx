'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppBuilderStore } from '@/hooks/useAppBuilderStore';
import BuilderQuoteForm from '../builder/BuilderQuoteForm';
import { useUnifiedQuoteStore, serviceMetadata, WebsiteConfig, AnimationConfig, ImageConfig, SoundConfig, PaidMediaConfig, SocialMediaConfig, EmailMarketingConfig, AIReceptionistConfig } from '@/hooks/useUnifiedQuoteStore';
import {
  appTypes,
  platformOptions,
  screenOptions,
  designOptions,
  authOptions,
  backendOptions,
  appFeatures,
  aiFeatures,
  appAdditionalServices,
  appTimelineOptions,
} from '@/data/appBuilder';
import {
  projectTypes as websiteProjectTypes,
  siteSizeOptions as websiteSiteSizeOptions,
  designOptions as websiteDesignOptions,
  cmsOptions as websiteCmsOptions,
  features as websiteFeatures,
  additionalServices as websiteAdditionalServices,
  timelineOptions as websiteTimelineOptions,
} from '@/data/websiteBuilder';
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
  emailGoalOptions,
  durationOptions as emailDurationOptions,
} from '@/data/emailMarketingBuilder';
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
  supportLevelOptions
} from '@/data/aiReceptionistBuilder';
import {
  Check,
  Smartphone,
  Layers,
  Palette,
  Shield,
  Server,
  Zap,
  Sparkles,
  Clock,
  Plus,
  Edit2,
  Trash2,
  Globe,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  FileText,
  Database,
  Wrench,
  Film,
  Image,
  Music,
  Megaphone,
  Share2,
  Mail,
  Target,
  Phone,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type ExpandedCard = 'app' | 'website' | 'animation' | 'image' | 'sound' | 'paid-media' | 'social-media' | 'email-marketing' | 'ai-receptionist' | null;

interface Step11SummaryProps {
  showQuoteForm?: boolean;
  onCloseQuoteForm?: () => void;
}

export default function Step11Summary({ showQuoteForm = false, onCloseQuoteForm }: Step11SummaryProps) {
  const store = useAppBuilderStore();
  const unifiedStore = useUnifiedQuoteStore();
  const router = useRouter();

  // Only one card can be expanded at a time
  const [expandedCard, setExpandedCard] = useState<ExpandedCard>('app'); // First card defaults open
  const [showAddServices, setShowAddServices] = useState(false);

  // Save to unified quote on mount (only if we have a valid config)
  useEffect(() => {
    // Only save if appType is set (meaning we have a valid configuration)
    // This prevents saving empty config when resetBuilder clears the state
    if (store.appType) {
      store.saveToUnifiedQuote();
    }
  }, [store.appType, store.saveToUnifiedQuote]);

  // Get labels for selections
  const appTypeLabel = appTypes.find(t => t.id === store.appType)?.label;
  const platformLabel = platformOptions.find(o => o.id === store.platform)?.label;
  const screensLabel = screenOptions.find(o => o.id === store.screens)?.label;
  const designLabel = designOptions.find(o => o.id === store.design)?.label;
  const authLabel = authOptions.find(o => o.id === store.auth)?.label;
  const backendLabel = backendOptions.find(o => o.id === store.backend)?.label;
  const timelineLabel = appTimelineOptions.find(o => o.id === store.timeline)?.label;

  // Get available services (not yet configured)
  const availableServices = unifiedStore.getAvailableServices().filter(s => s !== 'app');
  const configuredServices = unifiedStore.getAllConfiguredServices();
  const otherServices = configuredServices.filter(s => s.type !== 'app');

  const handleEdit = () => {
    store.setStep(1);
  };

  const handleClear = () => {
    const remainingServices = configuredServices.filter(s => s.type !== 'app');

    // Clear from unified store directly to ensure it's cleared
    unifiedStore.clearServiceConfig('app');

    // Reset the local builder state
    store.resetBuilder();

    // Small delay to ensure persist middleware has saved the state
    setTimeout(() => {
      if (remainingServices.length > 0) {
        const nextService = remainingServices[0];
        router.push(`${serviceMetadata[nextService.type].builderPath}?summary=true`);
      } else {
        router.push('/');
      }
    }, 100);
  };

  const toggleCard = (card: ExpandedCard) => {
    setExpandedCard(prev => prev === card ? null : card);
  };

  // Price display helper - shows $0 greyed out for free items
  const formatPrice = (price: number | null, prefix: string = '', suffix: string = '') => {
    if (price === null) return <span className="text-[var(--accent-orange)]">Custom Quote</span>;
    if (price === 0) return <span className="text-[var(--text-muted)]">{prefix}$0{suffix}</span>;
    return <span className="text-white font-medium">{prefix}${price.toLocaleString()}{suffix}</span>;
  };

  // Summary section component with edit button
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

  if (showQuoteForm && onCloseQuoteForm) {
    return <BuilderQuoteForm onBack={() => onCloseQuoteForm()} />;
  }

  return (
    <div className="space-y-6">
      {/* Main App Summary Card */}
      <div className="card p-6">
        {/* Header - Always visible */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-pink)] flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-white font-serif">
                App Quote Summary
              </h2>
              <p className="text-[var(--text-secondary)] text-sm">
                {appTypeLabel}
              </p>
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
              onClick={() => toggleCard('app')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-white hover:border-[var(--accent-blue)] transition-all"
            >
              {expandedCard === 'app' ? (
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

        {/* Collapsible Details */}
        <div className={`grid transition-all duration-300 ease-in-out ${expandedCard === 'app' ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
          <div className="overflow-hidden">
            <div className="space-y-4 mt-6">
                {/* App Type */}
                <SummarySection title="App Type" icon={<FileText className="w-5 h-5 text-[var(--accent-blue)]" />} stepNumber={1}>
                  <p className="text-[var(--text-secondary)]">{appTypeLabel}</p>
                </SummarySection>

                {/* Platform */}
                <SummarySection title="Platform" icon={<Smartphone className="w-5 h-5 text-[var(--accent-blue)]" />} stepNumber={2}>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">{platformLabel}</span>
                    {formatPrice(store.platformPrice)}
                  </div>
                </SummarySection>

                {/* Screens */}
                <SummarySection title="Screens" icon={<Layers className="w-5 h-5 text-[var(--accent-blue)]" />} stepNumber={3}>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">{screensLabel}</span>
                    {formatPrice(store.screensPrice)}
                  </div>
                </SummarySection>

                {/* Design */}
                <SummarySection title="Design" icon={<Palette className="w-5 h-5 text-[var(--accent-blue)]" />} stepNumber={4}>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">{designLabel}</span>
                    {formatPrice(store.designPrice)}
                  </div>
                </SummarySection>

                {/* Authentication */}
                <SummarySection title="Authentication" icon={<Shield className="w-5 h-5 text-[var(--accent-blue)]" />} stepNumber={5}>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">{authLabel}</span>
                    {formatPrice(store.authPrice)}
                  </div>
                </SummarySection>

                {/* Backend */}
                <SummarySection title="Backend" icon={<Server className="w-5 h-5 text-[var(--accent-blue)]" />} stepNumber={6}>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">{backendLabel}</span>
                    {formatPrice(store.backendPrice)}
                  </div>
                </SummarySection>

                {/* Features */}
                <SummarySection title="Features" icon={<Zap className="w-5 h-5 text-[var(--accent-blue)]" />} stepNumber={7}>
                  {store.selectedFeatures.length === 0 ? (
                    <p className="text-[var(--text-muted)] text-sm">No features selected</p>
                  ) : (
                    <div className="space-y-2">
                      {store.selectedFeatures.map((f) => {
                        const feature = appFeatures.find(feat => feat.id === f.id);
                        const option = feature?.options.find(o => o.id === f.optionId);
                        return (
                          <div key={f.id} className="flex justify-between text-sm">
                            <span className="text-[var(--text-secondary)]">
                              {feature?.name} <span className="text-[var(--text-muted)]">({option?.label})</span>
                            </span>
                            {formatPrice(f.price, '+$')}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </SummarySection>

                {/* AI Features */}
                <SummarySection title="AI Features" icon={<Sparkles className="w-5 h-5 text-[var(--accent-blue)]" />} stepNumber={8}>
                  {store.selectedAIFeatures.length === 0 ? (
                    <p className="text-[var(--text-muted)] text-sm">No AI features selected</p>
                  ) : (
                    <div className="space-y-2">
                      {store.selectedAIFeatures.map((f) => {
                        const feature = aiFeatures.find(feat => feat.id === f.id);
                        const setupOption = feature?.setupOptions.find(o => o.id === f.setupOptionId);
                        const usageOption = feature?.usageOptions.find(o => o.id === f.usageOptionId);
                        return (
                          <div key={f.id} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span className="text-[var(--text-secondary)]">
                                {feature?.name} <span className="text-[var(--text-muted)]">({setupOption?.label})</span>
                              </span>
                              {formatPrice(f.setupPrice, '+$', ' setup')}
                            </div>
                            {f.usagePrice !== null && f.usagePrice > 0 && (
                              <div className="flex justify-between text-sm pl-4">
                                <span className="text-[var(--text-muted)]">
                                  Usage: {usageOption?.label}
                                </span>
                                <span className="text-[var(--accent-pink)]">+${f.usagePrice}/mo</span>
                              </div>
                            )}
                            {f.usagePrice === 0 && (
                              <div className="flex justify-between text-sm pl-4">
                                <span className="text-[var(--text-muted)]">
                                  Usage: {usageOption?.label}
                                </span>
                                <span className="text-[var(--text-muted)]">$0/mo</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </SummarySection>

                {/* Additional Services */}
                <SummarySection title="Additional Services" icon={<Check className="w-5 h-5 text-[var(--accent-blue)]" />} stepNumber={9}>
                  {store.selectedServices.length === 0 ? (
                    <p className="text-[var(--text-muted)] text-sm">No additional services selected</p>
                  ) : (
                    <div className="space-y-2">
                      {store.selectedServices.map((s) => {
                        const service = appAdditionalServices.find(srv => srv.id === s.id);
                        return (
                          <div key={s.id} className="flex justify-between text-sm">
                            <span className="text-[var(--text-secondary)]">
                              {service?.label}
                              {s.recurring && <span className="text-[var(--accent-orange)] ml-1">(monthly)</span>}
                            </span>
                            <span className="text-white font-medium">
                              +${s.price}{s.recurring && '/mo'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </SummarySection>

                {/* Timeline */}
                <SummarySection title="Timeline" icon={<Clock className="w-5 h-5 text-[var(--accent-blue)]" />} stepNumber={10}>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">{timelineLabel}</span>
                    {store.rushFee > 0 ? (
                      <span className="text-[var(--accent-orange)] font-medium">
                        +${store.rushFee.toLocaleString()} ({Math.round((store.timelineMultiplier - 1) * 100)}%)
                      </span>
                    ) : (
                      <span className="text-green-400 font-medium">No rush fee</span>
                    )}
                  </div>
                </SummarySection>
              </div>
            </div>
          </div>

        {/* Totals - Always visible */}
        <div className="mt-6 p-4 bg-gradient-to-r from-[var(--accent-blue)]/20 to-[var(--accent-pink)]/20 border border-[var(--accent-blue)]/30 rounded-lg">
          {store.hasCustomQuote ? (
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[var(--accent-orange)] shrink-0 mt-0.5" />
              <div>
                <p className="text-white font-semibold">Custom Quote Required</p>
                <p className="text-sm text-[var(--text-secondary)] mt-1">
                  Some of your selections require custom pricing. Submit your configuration and we&apos;ll provide a detailed quote.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <span className="text-white font-semibold">One-time Total</span>
                <motion.span
                  key={store.oneTimeTotal}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  className="text-2xl font-bold gradient-text"
                >
                  ${store.oneTimeTotal.toLocaleString()}
                </motion.span>
              </div>
              <div className="flex justify-between items-center mt-2 pt-2 border-t border-[var(--border-subtle)]">
                <span className="text-white font-semibold">Monthly Total</span>
                {store.monthlyTotal > 0 ? (
                  <span className="text-lg font-semibold text-[var(--accent-pink)]">
                    ${store.monthlyTotal.toLocaleString()}/mo
                  </span>
                ) : (
                  <span className="text-[var(--text-muted)] text-lg">$0/mo</span>
                )}
              </div>
              <div className="flex justify-between items-center mt-2 pt-2 border-t-2 border-[var(--accent-blue)]/50">
                <span className="text-white font-bold">Due Today</span>
                <span className="text-xl font-bold gradient-text">${(store.oneTimeTotal + store.monthlyTotal).toLocaleString()}</span>
              </div>
              {store.monthlyTotal > 0 && (
                <p className="text-xs text-[var(--text-muted)] mt-1">One-time + first month&apos;s subscription</p>
              )}
            </>
          )}
        </div>
      </div>

      {/* Other Configured Services - Website Card with Full Details */}
      {otherServices.filter(s => s.type === 'website').map((service) => {
        const isOpen = expandedCard === 'website';
        const config = service.config as WebsiteConfig;
        const projectTypeLabel = websiteProjectTypes.find(t => t.id === config.projectType)?.label;
        const siteSizeLabel = websiteSiteSizeOptions.find(s => s.id === config.siteSize)?.label;
        const designLabel = websiteDesignOptions.find(d => d.id === config.designComplexity)?.label;
        const cmsLabel = websiteCmsOptions.find(c => c.id === config.cms)?.label;
        const timelineLabel = websiteTimelineOptions.find(t => t.id === config.timeline)?.label;

        return (
          <div key={service.type} className="card p-6">
            {/* Header - Always visible */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-pink)] flex items-center justify-center">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-white font-serif">
                    Website Quote Summary
                  </h2>
                  <p className="text-[var(--text-secondary)] text-sm">
                    {projectTypeLabel}
                  </p>
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

            {/* Collapsible Details - Full Website Details */}
            <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
              <div className="overflow-hidden">
                <div className="space-y-4 mt-6">
                    {/* Project Type */}
                    <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <FileText className="w-5 h-5 text-[var(--accent-blue)]" />
                          <h3 className="font-medium text-white">Project Type</h3>
                        </div>
                        <Link href="/build-my-site?step=1" className="text-[var(--text-muted)] hover:text-[var(--accent-blue)] transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </Link>
                      </div>
                      <p className="text-[var(--text-secondary)]">{projectTypeLabel}</p>
                    </div>

                    {/* Site Size */}
                    <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Layers className="w-5 h-5 text-[var(--accent-blue)]" />
                          <h3 className="font-medium text-white">Site Size</h3>
                        </div>
                        <Link href="/build-my-site?step=2" className="text-[var(--text-muted)] hover:text-[var(--accent-blue)] transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </Link>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--text-secondary)]">{siteSizeLabel}</span>
                        {config.siteSizePrice === null ? (
                          <span className="text-[var(--accent-orange)]">Custom Quote</span>
                        ) : config.siteSizePrice === 0 ? (
                          <span className="text-[var(--text-muted)]">$0</span>
                        ) : (
                          <span className="text-white font-medium">${config.siteSizePrice}</span>
                        )}
                      </div>
                    </div>

                    {/* Design */}
                    <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Palette className="w-5 h-5 text-[var(--accent-blue)]" />
                          <h3 className="font-medium text-white">Design Style</h3>
                        </div>
                        <Link href="/build-my-site?step=3" className="text-[var(--text-muted)] hover:text-[var(--accent-blue)] transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </Link>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--text-secondary)]">{designLabel}</span>
                        {config.designPrice === 0 ? (
                          <span className="text-[var(--text-muted)]">$0</span>
                        ) : (
                          <span className="text-white font-medium">${config.designPrice}</span>
                        )}
                      </div>
                    </div>

                    {/* CMS */}
                    <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Database className="w-5 h-5 text-[var(--accent-blue)]" />
                          <h3 className="font-medium text-white">Content Management</h3>
                        </div>
                        <Link href="/build-my-site?step=4" className="text-[var(--text-muted)] hover:text-[var(--accent-blue)] transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </Link>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--text-secondary)]">{cmsLabel}</span>
                        {config.cmsPrice === 0 ? (
                          <span className="text-[var(--text-muted)]">$0</span>
                        ) : (
                          <span className="text-white font-medium">+${config.cmsPrice}</span>
                        )}
                      </div>
                    </div>

                    {/* Features */}
                    <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Wrench className="w-5 h-5 text-[var(--accent-blue)]" />
                          <h3 className="font-medium text-white">Features</h3>
                        </div>
                        <Link href="/build-my-site?step=5" className="text-[var(--text-muted)] hover:text-[var(--accent-blue)] transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </Link>
                      </div>
                      {config.selectedFeatures.length === 0 ? (
                        <p className="text-[var(--text-muted)] text-sm">No features selected</p>
                      ) : (
                        <div className="space-y-2">
                          {config.selectedFeatures.map((sf) => {
                            const feature = websiteFeatures.find(f => f.id === sf.id);
                            const option = feature?.options.find(o => o.id === sf.optionId);
                            return (
                              <div key={sf.id} className="flex justify-between text-sm">
                                <span className="text-[var(--text-secondary)]">
                                  {feature?.name} <span className="text-[var(--text-muted)]">({option?.label})</span>
                                </span>
                                {sf.price === null ? (
                                  <span className="text-[var(--accent-orange)]">Quote</span>
                                ) : sf.price === 0 ? (
                                  <span className="text-[var(--text-muted)]">$0</span>
                                ) : (
                                  <span className="text-white font-medium">+${sf.price}</span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* AI Features */}
                    <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-[var(--accent-blue)]" />
                          <h3 className="font-medium text-white">AI Features</h3>
                        </div>
                        <Link href="/build-my-site?step=6" className="text-[var(--text-muted)] hover:text-[var(--accent-blue)] transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </Link>
                      </div>
                      {(!config.selectedAIFeatures || config.selectedAIFeatures.length === 0) ? (
                        <p className="text-[var(--text-muted)] text-sm">No AI features selected</p>
                      ) : (
                        <div className="space-y-2">
                          {config.selectedAIFeatures.map((f) => (
                            <div key={f.id} className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span className="text-[var(--text-secondary)]">
                                  {f.id === 'aiChatbot' ? 'AI Chatbot / Assistant' : f.id === 'aiSearch' ? 'AI Search' : f.id}
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
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Additional Services */}
                    <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Check className="w-5 h-5 text-[var(--accent-blue)]" />
                          <h3 className="font-medium text-white">Additional Services</h3>
                        </div>
                        <Link href="/build-my-site?step=7" className="text-[var(--text-muted)] hover:text-[var(--accent-blue)] transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </Link>
                      </div>
                      {config.selectedServices.length === 0 ? (
                        <p className="text-[var(--text-muted)] text-sm">No additional services selected</p>
                      ) : (
                        <div className="space-y-2">
                          {config.selectedServices.map((ss) => {
                            const service = websiteAdditionalServices.find(s => s.id === ss.id);
                            return (
                              <div key={ss.id} className="flex justify-between text-sm">
                                <span className="text-[var(--text-secondary)]">
                                  {service?.label}
                                  {ss.recurring && <span className="text-[var(--accent-orange)] ml-1">(monthly)</span>}
                                </span>
                                <span className="text-white font-medium">
                                  +${ss.price}{ss.recurring && '/mo'}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Timeline */}
                    <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Clock className="w-5 h-5 text-[var(--accent-blue)]" />
                          <h3 className="font-medium text-white">Timeline</h3>
                        </div>
                        <Link href="/build-my-site?step=8" className="text-[var(--text-muted)] hover:text-[var(--accent-blue)] transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </Link>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--text-secondary)]">{timelineLabel}</span>
                        {config.rushFee > 0 ? (
                          <span className="text-[var(--accent-orange)] font-medium">
                            +${config.rushFee.toLocaleString()} ({Math.round((config.timelineMultiplier - 1) * 100)}%)
                          </span>
                        ) : (
                          <span className="text-green-400 font-medium">No rush fee</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            {/* Totals - Always visible */}
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
                    <span className="text-white font-semibold">One-time Total</span>
                    <span className="text-2xl font-bold gradient-text">
                      ${config.total.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-2 pt-2 border-t border-[var(--border-subtle)]">
                    <span className="text-white font-semibold">Monthly Total</span>
                    {config.monthlyRecurring > 0 ? (
                      <span className="text-lg font-semibold text-[var(--accent-pink)]">${config.monthlyRecurring}/mo</span>
                    ) : (
                      <span className="text-[var(--text-muted)] text-lg">$0/mo</span>
                    )}
                  </div>
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
        const animTypeLabel = animationTypeOptions.find(t => t.id === config.animationType)?.label;
        const animTimelineLabel = animationTimelineOptions.find(t => t.id === config.timeline)?.label;

        return (
          <div key={service.type} className="card p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-pink)] flex items-center justify-center">
                  <Film className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-white font-serif">
                    Animation Quote Summary
                  </h2>
                  <p className="text-[var(--text-secondary)] text-sm">
                    {animTypeLabel}
                  </p>
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
                      <span className="text-[var(--text-secondary)]">{animTimelineLabel}</span>
                      {config.rushFee > 0 ? (
                        <span className="text-[var(--accent-orange)] font-medium">
                          +${config.rushFee.toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-green-400 font-medium">No rush fee</span>
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
                  <div>
                    <p className="text-white font-semibold">Custom Quote Required</p>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <span className="text-white font-semibold">Total</span>
                  <span className="text-2xl font-bold gradient-text">
                    ${config.total.toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Other Configured Services - Image */}
      {otherServices.filter(s => s.type === 'image').map((service) => {
        const isOpen = expandedCard === 'image';
        const config = service.config as ImageConfig;
        const imgTypeLabel = imageTypeOptions.find(t => t.id === config.imageType)?.label;
        const imgTimelineLabel = imageTimelineOptions.find(t => t.id === config.timeline)?.label;

        return (
          <div key={service.type} className="card p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-pink)] flex items-center justify-center">
                  <Image className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-white font-serif">
                    Image Quote Summary
                  </h2>
                  <p className="text-[var(--text-secondary)] text-sm">
                    {imgTypeLabel}
                  </p>
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
                      <span className="text-[var(--text-secondary)]">{imgTimelineLabel}</span>
                      {config.rushFee > 0 ? (
                        <span className="text-[var(--accent-orange)] font-medium">
                          +${config.rushFee.toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-green-400 font-medium">No rush fee</span>
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
                  <div>
                    <p className="text-white font-semibold">Custom Quote Required</p>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <span className="text-white font-semibold">Total</span>
                  <span className="text-2xl font-bold gradient-text">
                    ${config.total.toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Other Configured Services - Sound */}
      {otherServices.filter(s => s.type === 'sound').map((service) => {
        const isOpen = expandedCard === 'sound';
        const config = service.config as SoundConfig;
        const soundTypeLabel = soundTypeOptions.find(t => t.id === config.soundType)?.label;
        const soundTimelineLabel = soundTimelineOptions.find(t => t.id === config.timeline)?.label;

        return (
          <div key={service.type} className="card p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-pink)] flex items-center justify-center">
                  <Music className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-white font-serif">
                    Sound Quote Summary
                  </h2>
                  <p className="text-[var(--text-secondary)] text-sm">
                    {soundTypeLabel}
                  </p>
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
                      <span className="text-[var(--text-secondary)]">{soundTimelineLabel}</span>
                      {config.rushFee > 0 ? (
                        <span className="text-[var(--accent-orange)] font-medium">
                          +${config.rushFee.toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-green-400 font-medium">No rush fee</span>
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
                  <div>
                    <p className="text-white font-semibold">Custom Quote Required</p>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <span className="text-white font-semibold">Total</span>
                  <span className="text-2xl font-bold gradient-text">
                    ${config.total.toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Other Configured Services - Paid Media */}
      {otherServices.filter(s => s.type === 'paid-media').map((service) => {
        const isOpen = expandedCard === 'paid-media';
        const config = service.config as PaidMediaConfig;
        const campaignTypeLabel = campaignTypeOptions.find(t => t.id === config.campaignType)?.label;
        const paidMediaDurationLabel = paidMediaDurationOptions.find(d => d.id === config.duration)?.label;

        return (
          <div key={service.type} className="card p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-pink)] flex items-center justify-center">
                  <Megaphone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-white font-serif">
                    Paid Media Quote Summary
                  </h2>
                  <p className="text-[var(--text-secondary)] text-sm">
                    {campaignTypeLabel}
                  </p>
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
                  <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <Megaphone className="w-5 h-5 text-[var(--accent-blue)]" />
                      <h3 className="font-medium text-white">Campaign Type</h3>
                    </div>
                    <p className="text-[var(--text-secondary)]">{campaignTypeLabel}</p>
                  </div>
                  <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <Clock className="w-5 h-5 text-[var(--accent-blue)]" />
                      <h3 className="font-medium text-white">Duration</h3>
                    </div>
                    <p className="text-[var(--text-secondary)]">{paidMediaDurationLabel}</p>
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

      {/* Other Configured Services - Social Media */}
      {otherServices.filter(s => s.type === 'social-media').map((service) => {
        const isOpen = expandedCard === 'social-media';
        const config = service.config as SocialMediaConfig;
        const goalLabel = socialGoalOptions.find(g => g.id === config.managementGoal)?.label;
        const durationLabel = socialDurationOptions.find(d => d.id === config.duration)?.label;

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
                  onClick={() => setExpandedCard(isOpen ? null : 'social-media')}
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
                      <Clock className="w-5 h-5 text-[var(--accent-blue)]" />
                      <h3 className="font-medium text-white">Duration</h3>
                    </div>
                    <p className="text-[var(--text-secondary)]">{durationLabel}</p>
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

      {/* Other Configured Services - Email Marketing */}
      {otherServices.filter(s => s.type === 'email-marketing').map((service) => {
        const isOpen = expandedCard === 'email-marketing';
        const config = service.config as EmailMarketingConfig;
        const goalLabel = emailGoalOptions.find(g => g.id === config.emailGoal)?.label;
        const durationLabel = emailDurationOptions.find(d => d.id === config.duration)?.label;

        return (
          <div key={service.type} className="card p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-pink)] flex items-center justify-center">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-white font-serif">Email Marketing Quote Summary</h2>
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
                  onClick={() => setExpandedCard(isOpen ? null : 'email-marketing')}
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
                      <Mail className="w-5 h-5 text-[var(--accent-blue)]" />
                      <h3 className="font-medium text-white">Email Goal</h3>
                    </div>
                    <p className="text-[var(--text-secondary)]">{goalLabel}</p>
                  </div>
                  <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <Clock className="w-5 h-5 text-[var(--accent-blue)]" />
                      <h3 className="font-medium text-white">Duration</h3>
                    </div>
                    <p className="text-[var(--text-secondary)]">{durationLabel}</p>
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
                  {config.totalInvestment > 0 && (
                    <div className="flex justify-between items-center mt-2 pt-2 border-t border-[var(--border-subtle)]">
                      <span className="text-white font-semibold">Total Investment ({config.durationMonths} mo)</span>
                      <span className="text-lg font-semibold text-[var(--accent-orange)]">${config.totalInvestment.toLocaleString()}</span>
                    </div>
                  )}
                </>
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
                  {/* Package */}
                  <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Phone className="w-5 h-5 text-[var(--accent-blue)]" />
                        <h3 className="font-medium text-white">Package</h3>
                      </div>
                      <Link href="/build-my-ai-receptionist?step=1" className="text-[var(--text-muted)] hover:text-[var(--accent-blue)] transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </Link>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--text-secondary)]">{packageLabel}</span>
                      <span className="text-white font-medium">
                        ${aiReceptionistPackages.find(p => p.id === config.basePackage)?.activationFee || 0} setup
                      </span>
                    </div>
                  </div>

                    {/* Phone Setup */}
                    <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Phone className="w-5 h-5 text-[var(--accent-blue)]" />
                          <h3 className="font-medium text-white">Phone Setup</h3>
                        </div>
                        <Link href="/build-my-ai-receptionist?step=2" className="text-[var(--text-muted)] hover:text-[var(--accent-blue)] transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </Link>
                      </div>
                      <div className="space-y-2">
                        {config.phoneNumberType && (
                          <div className="flex justify-between text-sm">
                            <span className="text-[var(--text-secondary)]">
                              Phone Number: {phoneNumberTypeOptions.find(o => o.id === config.phoneNumberType)?.label}
                            </span>
                            <span className="text-white font-medium">
                              ${phoneNumberTypeOptions.find(o => o.id === config.phoneNumberType)?.monthlyPrice || 0}/mo
                            </span>
                          </div>
                        )}
                        {config.additionalLines && (
                          <div className="flex justify-between text-sm">
                            <span className="text-[var(--text-secondary)]">
                              Lines: {additionalLinesOptions.find(o => o.id === config.additionalLines)?.label}
                            </span>
                            {additionalLinesOptions.find(o => o.id === config.additionalLines)?.customQuote ? (
                              <span className="text-[var(--accent-orange)]">Custom Quote</span>
                            ) : (
                              <span className="text-white font-medium">
                                ${additionalLinesOptions.find(o => o.id === config.additionalLines)?.monthlyPrice || 0}/mo
                              </span>
                            )}
                          </div>
                        )}
                        {config.coverageArea && (
                          <div className="flex justify-between text-sm">
                            <span className="text-[var(--text-secondary)]">
                              Coverage: {coverageAreaOptions.find(o => o.id === config.coverageArea)?.label}
                            </span>
                            {coverageAreaOptions.find(o => o.id === config.coverageArea)?.customQuote ? (
                              <span className="text-[var(--accent-orange)]">Custom Quote</span>
                            ) : (
                              <span className="text-white font-medium">
                                ${coverageAreaOptions.find(o => o.id === config.coverageArea)?.monthlyPrice || 0}/mo
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Call Handling */}
                    <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Clock className="w-5 h-5 text-[var(--accent-blue)]" />
                          <h3 className="font-medium text-white">Call Handling</h3>
                        </div>
                        <Link href="/build-my-ai-receptionist?step=3" className="text-[var(--text-muted)] hover:text-[var(--accent-blue)] transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </Link>
                      </div>
                      <div className="space-y-2">
                        {config.monthlyMinutes && (
                          <div className="flex justify-between text-sm">
                            <span className="text-[var(--text-secondary)]">
                              Minutes: {monthlyMinutesOptions.find(o => o.id === config.monthlyMinutes)?.label}
                            </span>
                            {monthlyMinutesOptions.find(o => o.id === config.monthlyMinutes)?.customQuote ? (
                              <span className="text-[var(--accent-orange)]">Custom Quote</span>
                            ) : (
                              <span className="text-white font-medium">
                                ${monthlyMinutesOptions.find(o => o.id === config.monthlyMinutes)?.monthlyPrice || 0}/mo
                              </span>
                            )}
                          </div>
                        )}
                        {config.availability && (
                          <div className="flex justify-between text-sm">
                            <span className="text-[var(--text-secondary)]">
                              Availability: {availabilityOptions.find(o => o.id === config.availability)?.label}
                            </span>
                            <span className="text-white font-medium">
                              ${availabilityOptions.find(o => o.id === config.availability)?.monthlyPrice || 0}/mo
                            </span>
                          </div>
                        )}
                        {config.callTransfer && (
                          <div className="flex justify-between text-sm">
                            <span className="text-[var(--text-secondary)]">
                              Call Transfer: {callTransferOptions.find(o => o.id === config.callTransfer)?.label}
                            </span>
                            <span className="text-white font-medium">
                              ${callTransferOptions.find(o => o.id === config.callTransfer)?.monthlyPrice || 0}/mo
                            </span>
                          </div>
                        )}
                        {config.voicemailType && (
                          <div className="flex justify-between text-sm">
                            <span className="text-[var(--text-secondary)]">
                              Voicemail: {voicemailOptions.find(o => o.id === config.voicemailType)?.label}
                            </span>
                            <span className="text-white font-medium">
                              ${voicemailOptions.find(o => o.id === config.voicemailType)?.monthlyPrice || 0}/mo
                            </span>
                          </div>
                        )}
                        {config.maxCallDuration && (
                          <div className="flex justify-between text-sm">
                            <span className="text-[var(--text-secondary)]">
                              Max Duration: {maxCallDurationOptions.find(o => o.id === config.maxCallDuration)?.label}
                            </span>
                            <span className="text-white font-medium">
                              ${maxCallDurationOptions.find(o => o.id === config.maxCallDuration)?.monthlyPrice || 0}/mo
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* AI Capabilities */}
                    <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-[var(--accent-blue)]" />
                          <h3 className="font-medium text-white">AI Capabilities</h3>
                        </div>
                        <Link href="/build-my-ai-receptionist?step=4" className="text-[var(--text-muted)] hover:text-[var(--accent-blue)] transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </Link>
                      </div>
                      <div className="space-y-2">
                        {config.language && (
                          <div className="flex justify-between text-sm">
                            <span className="text-[var(--text-secondary)]">
                              Language: {languageOptions.find(o => o.id === config.language)?.label}
                            </span>
                            <span className="text-white font-medium">
                              ${languageOptions.find(o => o.id === config.language)?.monthlyPrice || 0}/mo
                            </span>
                          </div>
                        )}
                        {config.voiceStyle && (
                          <div className="flex justify-between text-sm">
                            <span className="text-[var(--text-secondary)]">
                              Voice: {voiceStyleOptions.find(o => o.id === config.voiceStyle)?.label}
                            </span>
                            <span className="text-white font-medium">
                              ${voiceStyleOptions.find(o => o.id === config.voiceStyle)?.monthlyPrice || 0}/mo
                              {(voiceStyleOptions.find(o => o.id === config.voiceStyle)?.oneTimePrice || 0) > 0 && (
                                <span className="text-[var(--text-muted)]"> + ${voiceStyleOptions.find(o => o.id === config.voiceStyle)?.oneTimePrice} setup</span>
                              )}
                            </span>
                          </div>
                        )}
                        {config.knowledgeBaseSize && (
                          <div className="flex justify-between text-sm">
                            <span className="text-[var(--text-secondary)]">
                              Knowledge Base: {knowledgeBaseSizeOptions.find(o => o.id === config.knowledgeBaseSize)?.label}
                            </span>
                            <span className="text-white font-medium">
                              ${knowledgeBaseSizeOptions.find(o => o.id === config.knowledgeBaseSize)?.monthlyPrice || 0}/mo
                            </span>
                          </div>
                        )}
                        {config.conversationComplexity && (
                          <div className="flex justify-between text-sm">
                            <span className="text-[var(--text-secondary)]">
                              Conversation: {conversationComplexityOptions.find(o => o.id === config.conversationComplexity)?.label}
                            </span>
                            <span className="text-white font-medium">
                              ${conversationComplexityOptions.find(o => o.id === config.conversationComplexity)?.monthlyPrice || 0}/mo
                            </span>
                          </div>
                        )}
                        {config.personality && (
                          <div className="flex justify-between text-sm">
                            <span className="text-[var(--text-secondary)]">
                              Personality: {personalityOptions.find(o => o.id === config.personality)?.label}
                            </span>
                            <span className="text-white font-medium">
                              ${personalityOptions.find(o => o.id === config.personality)?.monthlyPrice || 0}/mo
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Integrations */}
                    <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Zap className="w-5 h-5 text-[var(--accent-blue)]" />
                          <h3 className="font-medium text-white">Integrations</h3>
                        </div>
                        <Link href="/build-my-ai-receptionist?step=5" className="text-[var(--text-muted)] hover:text-[var(--accent-blue)] transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </Link>
                      </div>
                      <div className="space-y-2">
                        {config.leadCapture && (
                          <div className="flex justify-between text-sm">
                            <span className="text-[var(--text-secondary)]">
                              Lead Capture: {leadCaptureOptions.find(o => o.id === config.leadCapture)?.label}
                            </span>
                            <span className="text-white font-medium">
                              ${leadCaptureOptions.find(o => o.id === config.leadCapture)?.monthlyPrice || 0}/mo
                              {(leadCaptureOptions.find(o => o.id === config.leadCapture)?.oneTimePrice || 0) > 0 && (
                                <span className="text-[var(--text-muted)]"> + ${leadCaptureOptions.find(o => o.id === config.leadCapture)?.oneTimePrice} setup</span>
                              )}
                            </span>
                          </div>
                        )}
                        {config.calendar && config.calendar !== 'none' && (
                          <div className="flex justify-between text-sm">
                            <span className="text-[var(--text-secondary)]">
                              Calendar: {calendarOptions.find(o => o.id === config.calendar)?.label}
                            </span>
                            <span className="text-white font-medium">
                              ${calendarOptions.find(o => o.id === config.calendar)?.monthlyPrice || 0}/mo
                              {(calendarOptions.find(o => o.id === config.calendar)?.oneTimePrice || 0) > 0 && (
                                <span className="text-[var(--text-muted)]"> + ${calendarOptions.find(o => o.id === config.calendar)?.oneTimePrice} setup</span>
                              )}
                            </span>
                          </div>
                        )}
                        {config.notifications && config.notifications.length > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-[var(--text-secondary)]">
                              Notifications: {config.notifications.map(n => notificationOptions.find(o => o.id === n)?.label).join(', ')}
                            </span>
                            <span className="text-white font-medium">
                              ${config.notifications.reduce((sum, n) => sum + (notificationOptions.find(o => o.id === n)?.monthlyPrice || 0), 0)}/mo
                            </span>
                          </div>
                        )}
                        {config.additionalIntegrations && config.additionalIntegrations.length > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-[var(--text-secondary)]">
                              Additional: {config.additionalIntegrations.map(i => additionalIntegrationOptions.find(o => o.id === i)?.label).join(', ')}
                            </span>
                            <span className="text-white font-medium">
                              ${config.additionalIntegrations.reduce((sum, i) => sum + (additionalIntegrationOptions.find(o => o.id === i)?.monthlyPrice || 0), 0)}/mo
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Reporting & Analytics */}
                    <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <FileText className="w-5 h-5 text-[var(--accent-blue)]" />
                          <h3 className="font-medium text-white">Reporting & Analytics</h3>
                        </div>
                        <Link href="/build-my-ai-receptionist?step=6" className="text-[var(--text-muted)] hover:text-[var(--accent-blue)] transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </Link>
                      </div>
                      <div className="space-y-2">
                        {config.transcripts && config.transcripts !== 'none' && (
                          <div className="flex justify-between text-sm">
                            <span className="text-[var(--text-secondary)]">
                              Transcripts: {transcriptsOptions.find(o => o.id === config.transcripts)?.label}
                            </span>
                            <span className="text-white font-medium">
                              ${transcriptsOptions.find(o => o.id === config.transcripts)?.monthlyPrice || 0}/mo
                            </span>
                          </div>
                        )}
                        {config.aiSummaries && config.aiSummaries !== 'none' && (
                          <div className="flex justify-between text-sm">
                            <span className="text-[var(--text-secondary)]">
                              AI Summaries: {aiSummariesOptions.find(o => o.id === config.aiSummaries)?.label}
                            </span>
                            <span className="text-white font-medium">
                              ${aiSummariesOptions.find(o => o.id === config.aiSummaries)?.monthlyPrice || 0}/mo
                            </span>
                          </div>
                        )}
                        {config.analyticsLevel && (
                          <div className="flex justify-between text-sm">
                            <span className="text-[var(--text-secondary)]">
                              Analytics: {analyticsLevelOptions.find(o => o.id === config.analyticsLevel)?.label}
                            </span>
                            <span className="text-white font-medium">
                              ${analyticsLevelOptions.find(o => o.id === config.analyticsLevel)?.monthlyPrice || 0}/mo
                            </span>
                          </div>
                        )}
                        {config.reportingFrequency && config.reportingFrequency !== 'none' && (
                          <div className="flex justify-between text-sm">
                            <span className="text-[var(--text-secondary)]">
                              Reports: {reportingFrequencyOptions.find(o => o.id === config.reportingFrequency)?.label}
                            </span>
                            <span className="text-white font-medium">
                              ${reportingFrequencyOptions.find(o => o.id === config.reportingFrequency)?.monthlyPrice || 0}/mo
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Support & Onboarding */}
                    <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Shield className="w-5 h-5 text-[var(--accent-blue)]" />
                          <h3 className="font-medium text-white">Support & Onboarding</h3>
                        </div>
                        <Link href="/build-my-ai-receptionist?step=7" className="text-[var(--text-muted)] hover:text-[var(--accent-blue)] transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </Link>
                      </div>
                      <div className="space-y-2">
                        {config.onboardingType && (
                          <div className="flex justify-between text-sm">
                            <span className="text-[var(--text-secondary)]">
                              Onboarding: {onboardingTypeOptions.find(o => o.id === config.onboardingType)?.label}
                            </span>
                            <span className="text-white font-medium">
                              ${onboardingTypeOptions.find(o => o.id === config.onboardingType)?.oneTimePrice || 0} setup
                            </span>
                          </div>
                        )}
                        {config.knowledgeUpdates && (
                          <div className="flex justify-between text-sm">
                            <span className="text-[var(--text-secondary)]">
                              Knowledge Updates: {knowledgeUpdatesOptions.find(o => o.id === config.knowledgeUpdates)?.label}
                            </span>
                            <span className="text-white font-medium">
                              ${knowledgeUpdatesOptions.find(o => o.id === config.knowledgeUpdates)?.monthlyPrice || 0}/mo
                            </span>
                          </div>
                        )}
                        {config.supportLevel && (
                          <div className="flex justify-between text-sm">
                            <span className="text-[var(--text-secondary)]">
                              Support: {supportLevelOptions.find(o => o.id === config.supportLevel)?.label}
                            </span>
                            <span className="text-white font-medium">
                              ${supportLevelOptions.find(o => o.id === config.supportLevel)?.monthlyPrice || 0}/mo
                            </span>
                          </div>
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
                      ) : serviceType === 'email-marketing' ? (
                        <Mail className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent-blue)]" />
                      ) : serviceType === 'brand-strategy' ? (
                        <Target className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent-blue)]" />
                      ) : serviceType === 'ai-receptionist' ? (
                        <Phone className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent-blue)]" />
                      ) : (
                        <Smartphone className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent-blue)]" />
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
    </div>
  );
}
