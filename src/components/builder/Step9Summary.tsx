'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBuilderStore } from '@/hooks/useBuilderStore';
import { useUnifiedQuoteStore, serviceMetadata, AppConfig, AnimationConfig, ImageConfig, SoundConfig, PaidMediaConfig, SocialMediaConfig, EmailMarketingConfig, VisualIdentityConfig } from '@/hooks/useUnifiedQuoteStore';
import {
  projectTypes,
  siteSizeOptions,
  designOptions,
  cmsOptions,
  features,
  websiteAIFeatures,
  additionalServices,
  timelineOptions,
} from '@/data/websiteBuilder';
import {
  appTypes,
  platformOptions,
  screenOptions,
  designOptions as appDesignOptions,
  authOptions,
  backendOptions,
  appFeatures,
  aiFeatures,
  appAdditionalServices,
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
  emailGoalOptions,
  durationOptions as emailDurationOptions,
} from '@/data/emailMarketingBuilder';
import {
  Check,
  Edit2,
  FileText,
  Palette,
  Database,
  Layers,
  Wrench,
  Clock,
  AlertCircle,
  Globe,
  Smartphone,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Shield,
  Server,
  Zap,
  Sparkles,
  Film,
  Image,
  Music,
  Megaphone,
  Share2,
  Mail,
  Target,
} from 'lucide-react';
import BuilderQuoteForm from './BuilderQuoteForm';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type ExpandedCard = 'website' | 'app' | 'animation' | 'image' | 'sound' | 'paid-media' | 'social-media' | 'email-marketing' | 'visual-identity' | null;

interface Step9SummaryProps {
  showQuoteForm?: boolean;
  onCloseQuoteForm?: () => void;
}

export default function Step9Summary({ showQuoteForm = false, onCloseQuoteForm }: Step9SummaryProps) {
  const store = useBuilderStore();
  const {
    projectType,
    siteSize,
    siteSizePrice,
    designComplexity,
    designPrice,
    cms,
    cmsPrice,
    selectedFeatures,
    selectedAIFeatures,
    selectedServices,
    timeline,
    timelineMultiplier,
    subtotal,
    rushFee,
    total,
    monthlyRecurring,
    hasCustomQuote,
    setStep,
    saveToUnifiedQuote,
    resetBuilder,
  } = store;

  const unifiedStore = useUnifiedQuoteStore();
  const router = useRouter();

  // Only one card can be expanded at a time
  const [expandedCard, setExpandedCard] = useState<ExpandedCard>('website'); // First card defaults open
  const [showAddServices, setShowAddServices] = useState(false);

  // Save to unified quote on mount
  useEffect(() => {
    saveToUnifiedQuote();
  }, [saveToUnifiedQuote]);

  const projectTypeLabel = projectTypes.find(p => p.id === projectType)?.label;
  const siteSizeLabel = siteSizeOptions.find(s => s.id === siteSize)?.label;
  const designLabel = designOptions.find(d => d.id === designComplexity)?.label;
  const cmsLabel = cmsOptions.find(c => c.id === cms)?.label;
  const timelineLabel = timelineOptions.find(t => t.id === timeline)?.label;

  // Get available services (not yet configured)
  const availableServices = unifiedStore.getAvailableServices().filter(s => s !== 'website');
  const configuredServices = unifiedStore.getAllConfiguredServices();
  const otherServices = configuredServices.filter(s => s.type !== 'website');

  const handleEdit = () => {
    setStep(1);
  };

  const handleClear = () => {
    // Get remaining services (excluding current service)
    const remainingServices = configuredServices.filter(s => s.type !== 'website');

    // Clear from both builder store and unified quote store
    resetBuilder();
    unifiedStore.clearServiceConfig('website');

    // If there are remaining services, navigate to the first one's summary
    if (remainingServices.length > 0) {
      const nextService = remainingServices[0];
      router.push(`${serviceMetadata[nextService.type].builderPath}?summary=true`);
    } else {
      // No more services, go to main page
      router.push('/');
    }
  };

  const toggleCard = (card: ExpandedCard) => {
    setExpandedCard(expandedCard === card ? null : card);
  };

  // Price display helper - shows $0 greyed out for free items
  const formatPrice = (price: number | null, prefix: string = '', suffix: string = '') => {
    if (price === null) return <span className="text-[var(--accent-orange)]">Custom Quote</span>;
    if (price === 0) return <span className="text-[var(--text-muted)]">{prefix}$0{suffix}</span>;
    return <span className="text-white font-medium">{prefix}${price.toLocaleString()}{suffix}</span>;
  };

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
          onClick={() => setStep(stepNumber)}
          className="text-[var(--text-muted)] hover:text-[var(--accent-blue)] transition-colors"
        >
          <Edit2 className="w-4 h-4" />
        </button>
      </div>
      {children}
    </div>
  );

  if (showQuoteForm && onCloseQuoteForm) {
    return <BuilderQuoteForm onBack={onCloseQuoteForm} />;
  }

  return (
    <div className="space-y-6">
      {/* Main Website Summary Card */}
      <div className="card p-6">
        {/* Header - Always visible */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-teal)] flex items-center justify-center">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-semibold text-white font-serif">
                Website Quote Summary
              </h2>
              <p className="text-[var(--text-secondary)] text-sm">
                {projectTypeLabel}
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
              onClick={() => toggleCard('website')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-white hover:border-[var(--accent-blue)] transition-all"
            >
              {expandedCard === 'website' ? (
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
        <AnimatePresence>
          {expandedCard === 'website' && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="space-y-4 mt-6">
                {/* Project Type */}
                <SummarySection title="Project Type" icon={<FileText className="w-5 h-5 text-[var(--accent-blue)]" />} stepNumber={1}>
                  <p className="text-[var(--text-secondary)]">{projectTypeLabel}</p>
                </SummarySection>

                {/* Site Size */}
                <SummarySection title="Site Size" icon={<Layers className="w-5 h-5 text-[var(--accent-blue)]" />} stepNumber={2}>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">{siteSizeLabel}</span>
                    {formatPrice(siteSizePrice)}
                  </div>
                </SummarySection>

                {/* Design */}
                <SummarySection title="Design Style" icon={<Palette className="w-5 h-5 text-[var(--accent-blue)]" />} stepNumber={3}>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">{designLabel}</span>
                    {formatPrice(designPrice)}
                  </div>
                </SummarySection>

                {/* CMS */}
                <SummarySection title="Content Management" icon={<Database className="w-5 h-5 text-[var(--accent-blue)]" />} stepNumber={4}>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">{cmsLabel}</span>
                    {cmsPrice === 0 ? (
                      <span className="text-[var(--text-muted)]">$0</span>
                    ) : (
                      <span className="text-white font-medium">+${cmsPrice}</span>
                    )}
                  </div>
                </SummarySection>

                {/* Features */}
                <SummarySection title="Features" icon={<Wrench className="w-5 h-5 text-[var(--accent-blue)]" />} stepNumber={5}>
                  {selectedFeatures.length === 0 ? (
                    <p className="text-[var(--text-muted)] text-sm">No features selected</p>
                  ) : (
                    <div className="space-y-2">
                      {selectedFeatures.map((sf) => {
                        const feature = features.find(f => f.id === sf.id);
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
                </SummarySection>

                {/* AI Features */}
                <SummarySection title="AI Features" icon={<Sparkles className="w-5 h-5 text-[var(--accent-blue)]" />} stepNumber={6}>
                  {selectedAIFeatures.length === 0 ? (
                    <p className="text-[var(--text-muted)] text-sm">No AI features selected</p>
                  ) : (
                    <div className="space-y-2">
                      {selectedAIFeatures.map((f) => {
                        const feature = websiteAIFeatures.find(feat => feat.id === f.id);
                        const setupOption = feature?.setupOptions.find(o => o.id === f.setupOptionId);
                        const usageOption = feature?.usageOptions.find(o => o.id === f.usageOptionId);
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
                                <span className="text-[var(--text-muted)]">
                                  Usage: {usageOption?.label}
                                </span>
                                <span className="text-[var(--accent-teal)]">+${f.usagePrice}/mo</span>
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
                <SummarySection title="Additional Services" icon={<Check className="w-5 h-5 text-[var(--accent-blue)]" />} stepNumber={7}>
                  {selectedServices.length === 0 ? (
                    <p className="text-[var(--text-muted)] text-sm">No additional services selected</p>
                  ) : (
                    <div className="space-y-2">
                      {selectedServices.map((ss) => {
                        const service = additionalServices.find(s => s.id === ss.id);
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
                </SummarySection>

                {/* Timeline */}
                <SummarySection title="Timeline" icon={<Clock className="w-5 h-5 text-[var(--accent-blue)]" />} stepNumber={8}>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">{timelineLabel}</span>
                    {rushFee > 0 ? (
                      <span className="text-[var(--accent-orange)] font-medium">
                        +${rushFee.toLocaleString()} ({Math.round((timelineMultiplier - 1) * 100)}%)
                      </span>
                    ) : (
                      <span className="text-green-400 font-medium">No rush fee</span>
                    )}
                  </div>
                </SummarySection>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Totals - Always visible */}
        <div className="mt-6 p-4 bg-gradient-to-r from-[var(--accent-blue)]/20 to-[var(--accent-teal)]/20 border border-[var(--accent-blue)]/30 rounded-lg">
          {hasCustomQuote ? (
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
                  key={total}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  className="text-2xl font-bold gradient-text"
                >
                  ${total.toLocaleString()}
                </motion.span>
              </div>
              <div className="flex justify-between items-center mt-2 pt-2 border-t border-[var(--border-subtle)]">
                <span className="text-white font-semibold">Monthly Total</span>
                {monthlyRecurring > 0 ? (
                  <span className="text-lg font-semibold text-[var(--accent-teal)]">${monthlyRecurring}/mo</span>
                ) : (
                  <span className="text-[var(--text-muted)] text-lg">$0/mo</span>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Other Configured Services - App Card with Full Details */}
      {otherServices.filter(s => s.type === 'app').map((service) => {
        const isOpen = expandedCard === 'app';
        const config = service.config as AppConfig;
        const appTypeLabel = appTypes.find(t => t.id === config.appType)?.label;
        const platformLabel = platformOptions.find(p => p.id === config.platform)?.label;
        const screensLabel = screenOptions.find(s => s.id === config.screens)?.label;
        const appDesignLabel = appDesignOptions.find(d => d.id === config.design)?.label;
        const authLabel = authOptions.find(a => a.id === config.auth)?.label;
        const backendLabel = backendOptions.find(b => b.id === config.backend)?.label;
        const appTimelineLabel = appTimelineOptions.find(t => t.id === config.timeline)?.label;

        return (
          <div key={service.type} className="card p-6">
            {/* Header - Always visible */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-teal)] flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-semibold text-white font-serif">
                    App Quote Summary
                  </h2>
                  <p className="text-[var(--text-secondary)] text-sm">
                    {appTypeLabel}
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
                  onClick={() => toggleCard('app')}
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

            {/* Collapsible Details - Full App Details */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-4 mt-6">
                    {/* App Type */}
                    <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <FileText className="w-5 h-5 text-[var(--accent-blue)]" />
                          <h3 className="font-medium text-white">App Type</h3>
                        </div>
                        <Link href="/build-my-app?step=1" className="text-[var(--text-muted)] hover:text-[var(--accent-blue)] transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </Link>
                      </div>
                      <p className="text-[var(--text-secondary)]">{appTypeLabel}</p>
                    </div>

                    {/* Platform */}
                    <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Smartphone className="w-5 h-5 text-[var(--accent-blue)]" />
                          <h3 className="font-medium text-white">Platform</h3>
                        </div>
                        <Link href="/build-my-app?step=2" className="text-[var(--text-muted)] hover:text-[var(--accent-blue)] transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </Link>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--text-secondary)]">{platformLabel}</span>
                        {formatPrice(config.platformPrice)}
                      </div>
                    </div>

                    {/* Screens */}
                    <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Layers className="w-5 h-5 text-[var(--accent-blue)]" />
                          <h3 className="font-medium text-white">Screens</h3>
                        </div>
                        <Link href="/build-my-app?step=3" className="text-[var(--text-muted)] hover:text-[var(--accent-blue)] transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </Link>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--text-secondary)]">{screensLabel}</span>
                        {formatPrice(config.screensPrice)}
                      </div>
                    </div>

                    {/* Design */}
                    <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Palette className="w-5 h-5 text-[var(--accent-blue)]" />
                          <h3 className="font-medium text-white">Design</h3>
                        </div>
                        <Link href="/build-my-app?step=4" className="text-[var(--text-muted)] hover:text-[var(--accent-blue)] transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </Link>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--text-secondary)]">{appDesignLabel}</span>
                        {formatPrice(config.designPrice)}
                      </div>
                    </div>

                    {/* Authentication */}
                    <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Shield className="w-5 h-5 text-[var(--accent-blue)]" />
                          <h3 className="font-medium text-white">Authentication</h3>
                        </div>
                        <Link href="/build-my-app?step=5" className="text-[var(--text-muted)] hover:text-[var(--accent-blue)] transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </Link>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--text-secondary)]">{authLabel}</span>
                        {formatPrice(config.authPrice)}
                      </div>
                    </div>

                    {/* Backend */}
                    <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Server className="w-5 h-5 text-[var(--accent-blue)]" />
                          <h3 className="font-medium text-white">Backend</h3>
                        </div>
                        <Link href="/build-my-app?step=6" className="text-[var(--text-muted)] hover:text-[var(--accent-blue)] transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </Link>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--text-secondary)]">{backendLabel}</span>
                        {formatPrice(config.backendPrice)}
                      </div>
                    </div>

                    {/* Features */}
                    <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Zap className="w-5 h-5 text-[var(--accent-blue)]" />
                          <h3 className="font-medium text-white">Features</h3>
                        </div>
                        <Link href="/build-my-app?step=7" className="text-[var(--text-muted)] hover:text-[var(--accent-blue)] transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </Link>
                      </div>
                      {config.selectedFeatures.length === 0 ? (
                        <p className="text-[var(--text-muted)] text-sm">No features selected</p>
                      ) : (
                        <div className="space-y-2">
                          {config.selectedFeatures.map((f) => {
                            const feature = appFeatures.find(feat => feat.id === f.id);
                            const option = feature?.options.find(o => o.id === f.optionId);
                            return (
                              <div key={f.id} className="flex justify-between text-sm">
                                <span className="text-[var(--text-secondary)]">
                                  {feature?.name} <span className="text-[var(--text-muted)]">({option?.label})</span>
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
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-[var(--accent-blue)]" />
                          <h3 className="font-medium text-white">AI Features</h3>
                        </div>
                        <Link href="/build-my-app?step=8" className="text-[var(--text-muted)] hover:text-[var(--accent-blue)] transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </Link>
                      </div>
                      {config.selectedAIFeatures.length === 0 ? (
                        <p className="text-[var(--text-muted)] text-sm">No AI features selected</p>
                      ) : (
                        <div className="space-y-2">
                          {config.selectedAIFeatures.map((f) => {
                            const feature = aiFeatures.find(feat => feat.id === f.id);
                            const setupOption = feature?.setupOptions.find(o => o.id === f.setupOptionId);
                            const usageOption = feature?.usageOptions.find(o => o.id === f.usageOptionId);
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
                                    <span className="text-[var(--text-muted)]">
                                      Usage: {usageOption?.label}
                                    </span>
                                    <span className="text-[var(--accent-teal)]">+${f.usagePrice}/mo</span>
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
                    </div>

                    {/* Additional Services */}
                    <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Check className="w-5 h-5 text-[var(--accent-blue)]" />
                          <h3 className="font-medium text-white">Additional Services</h3>
                        </div>
                        <Link href="/build-my-app?step=9" className="text-[var(--text-muted)] hover:text-[var(--accent-blue)] transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </Link>
                      </div>
                      {config.selectedServices.length === 0 ? (
                        <p className="text-[var(--text-muted)] text-sm">No additional services selected</p>
                      ) : (
                        <div className="space-y-2">
                          {config.selectedServices.map((s) => {
                            const appService = appAdditionalServices.find(srv => srv.id === s.id);
                            return (
                              <div key={s.id} className="flex justify-between text-sm">
                                <span className="text-[var(--text-secondary)]">
                                  {appService?.label}
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
                    </div>

                    {/* Timeline */}
                    <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Clock className="w-5 h-5 text-[var(--accent-blue)]" />
                          <h3 className="font-medium text-white">Timeline</h3>
                        </div>
                        <Link href="/build-my-app?step=10" className="text-[var(--text-muted)] hover:text-[var(--accent-blue)] transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </Link>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--text-secondary)]">{appTimelineLabel}</span>
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
                </motion.div>
              )}
            </AnimatePresence>

            {/* Totals - Always visible */}
            <div className="mt-6 p-4 bg-gradient-to-r from-[var(--accent-blue)]/20 to-[var(--accent-teal)]/20 border border-[var(--accent-blue)]/30 rounded-lg">
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
                      ${config.oneTimeTotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-2 pt-2 border-t border-[var(--border-subtle)]">
                    <span className="text-white font-semibold">Monthly Total</span>
                    {config.monthlyTotal > 0 ? (
                      <span className="text-lg font-semibold text-[var(--accent-teal)]">${config.monthlyTotal}/mo</span>
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
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-teal)] flex items-center justify-center">
                  <Film className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-semibold text-white font-serif">
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

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
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
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-6 p-4 bg-gradient-to-r from-[var(--accent-blue)]/20 to-[var(--accent-teal)]/20 border border-[var(--accent-blue)]/30 rounded-lg">
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
        const imageTypeLabel = imageTypeOptions.find(t => t.id === config.imageType)?.label;
        const imgTimelineLabel = imageTimelineOptions.find(t => t.id === config.timeline)?.label;

        return (
          <div key={service.type} className="card p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-teal)] flex items-center justify-center">
                  <Image className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-semibold text-white font-serif">
                    Image Quote Summary
                  </h2>
                  <p className="text-[var(--text-secondary)] text-sm">
                    {imageTypeLabel}
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

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-4 mt-6">
                    <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <Image className="w-5 h-5 text-[var(--accent-blue)]" />
                        <h3 className="font-medium text-white">Image Type</h3>
                      </div>
                      <p className="text-[var(--text-secondary)]">{imageTypeLabel}</p>
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
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-6 p-4 bg-gradient-to-r from-[var(--accent-blue)]/20 to-[var(--accent-teal)]/20 border border-[var(--accent-blue)]/30 rounded-lg">
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
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-teal)] flex items-center justify-center">
                  <Music className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-semibold text-white font-serif">
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

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
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
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-6 p-4 bg-gradient-to-r from-[var(--accent-blue)]/20 to-[var(--accent-teal)]/20 border border-[var(--accent-blue)]/30 rounded-lg">
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
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-teal)] flex items-center justify-center">
                  <Megaphone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-semibold text-white font-serif">
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

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
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
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-6 p-4 bg-gradient-to-r from-[var(--accent-blue)]/20 to-[var(--accent-teal)]/20 border border-[var(--accent-blue)]/30 rounded-lg">
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
                      <span className="text-lg font-semibold text-[var(--accent-teal)]">${config.monthlyTotal.toFixed(2)}/mo</span>
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
        const socialGoalLabel = socialGoalOptions.find(g => g.id === config.managementGoal)?.label;
        const socialDurationLabel = socialDurationOptions.find(d => d.id === config.duration)?.label;

        return (
          <div key={service.type} className="card p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-teal)] flex items-center justify-center">
                  <Share2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-semibold text-white font-serif">
                    Social Media Quote Summary
                  </h2>
                  <p className="text-[var(--text-secondary)] text-sm">
                    {socialGoalLabel}
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
                  onClick={() => toggleCard('social-media')}
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

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-4 mt-6">
                    <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <Share2 className="w-5 h-5 text-[var(--accent-blue)]" />
                        <h3 className="font-medium text-white">Management Goal</h3>
                      </div>
                      <p className="text-[var(--text-secondary)]">{socialGoalLabel}</p>
                    </div>
                    <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <Clock className="w-5 h-5 text-[var(--accent-blue)]" />
                        <h3 className="font-medium text-white">Duration</h3>
                      </div>
                      <p className="text-[var(--text-secondary)]">{socialDurationLabel}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-6 p-4 bg-gradient-to-r from-[var(--accent-blue)]/20 to-[var(--accent-teal)]/20 border border-[var(--accent-blue)]/30 rounded-lg">
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
                      <span className="text-lg font-semibold text-[var(--accent-teal)]">${config.monthlyTotal.toFixed(2)}/mo</span>
                    </div>
                  )}
                  {config.totalInvestment > 0 && (
                    <div className="flex justify-between items-center mt-2 pt-2 border-t border-[var(--border-subtle)]">
                      <span className="text-white font-semibold">Total Investment ({config.durationMonths} mo)</span>
                      <span className="text-lg font-semibold text-[var(--accent-teal)]">${config.totalInvestment.toLocaleString()}</span>
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
        const emailGoalLabel = emailGoalOptions.find(g => g.id === config.emailGoal)?.label;
        const emailDurationLabel = emailDurationOptions.find(d => d.id === config.duration)?.label;

        return (
          <div key={service.type} className="card p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-teal)] flex items-center justify-center">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-semibold text-white font-serif">
                    Email Marketing Quote Summary
                  </h2>
                  <p className="text-[var(--text-secondary)] text-sm">
                    {emailGoalLabel}
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
                  onClick={() => toggleCard('email-marketing')}
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

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-4 mt-6">
                    <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <Mail className="w-5 h-5 text-[var(--accent-blue)]" />
                        <h3 className="font-medium text-white">Email Goal</h3>
                      </div>
                      <p className="text-[var(--text-secondary)]">{emailGoalLabel}</p>
                    </div>
                    <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <Clock className="w-5 h-5 text-[var(--accent-blue)]" />
                        <h3 className="font-medium text-white">Duration</h3>
                      </div>
                      <p className="text-[var(--text-secondary)]">{emailDurationLabel}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-6 p-4 bg-gradient-to-r from-[var(--accent-blue)]/20 to-[var(--accent-teal)]/20 border border-[var(--accent-blue)]/30 rounded-lg">
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
                      <span className="text-lg font-semibold text-[var(--accent-teal)]">${config.monthlyTotal.toFixed(2)}/mo</span>
                    </div>
                  )}
                  {config.totalInvestment > 0 && (
                    <div className="flex justify-between items-center mt-2 pt-2 border-t border-[var(--border-subtle)]">
                      <span className="text-white font-semibold">Total Investment ({config.durationMonths} mo)</span>
                      <span className="text-lg font-semibold text-[var(--accent-teal)]">${config.totalInvestment.toLocaleString()}</span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        );
      })}

      {/* Other Configured Services - Visual Identity */}
      {otherServices.filter(s => s.type === 'visual-identity').map((service) => {
        const isOpen = expandedCard === 'visual-identity';
        const config = service.config as VisualIdentityConfig;

        return (
          <div key={service.type} className="card p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-teal)] flex items-center justify-center">
                  <Palette className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-semibold text-white font-serif">
                    Visual Identity Quote Summary
                  </h2>
                  <p className="text-[var(--text-secondary)] text-sm">
                    Visual Design System
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
                  onClick={() => toggleCard('visual-identity')}
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

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-4 mt-6">
                    <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <Palette className="w-5 h-5 text-[var(--accent-blue)]" />
                        <h3 className="font-medium text-white">Visual Identity Type</h3>
                      </div>
                      <p className="text-[var(--text-secondary)]">Custom Design System</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-6 p-4 bg-gradient-to-r from-[var(--accent-blue)]/20 to-[var(--accent-teal)]/20 border border-[var(--accent-blue)]/30 rounded-lg">
              {config.hasCustomQuote ? (
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-[var(--accent-orange)] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white font-semibold">Custom Quote Required</p>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <span className="text-white font-semibold">One-time Total</span>
                  <span className="text-2xl font-bold gradient-text">
                    ${config.totalInvestment.toLocaleString()}
                  </span>
                </div>
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

          <AnimatePresence>
            {showAddServices && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="grid gap-2 mt-4 pt-4 border-t border-[var(--border-subtle)]">
                  {availableServices.map((serviceType) => (
                    <Link
                      key={serviceType}
                      href={serviceMetadata[serviceType].builderPath}
                      className="flex items-center justify-between p-3 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg hover:border-[var(--accent-blue)] transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        {serviceType === 'app' ? (
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
                        ) : serviceType === 'email-marketing' ? (
                          <Mail className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent-blue)]" />
                        ) : serviceType === 'brand-strategy' ? (
                          <Target className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent-blue)]" />
                        ) : serviceType === 'visual-identity' ? (
                          <Palette className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent-blue)]" />
                        ) : (
                          <Globe className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent-blue)]" />
                        )}
                        <span className="text-white text-sm font-medium">{serviceMetadata[serviceType].label}</span>
                      </div>
                      <Plus className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent-blue)]" />
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      <p className="text-[10px] text-[var(--text-muted)] text-center">
        *Estimates are based on your selections and subject to final confirmation after consultation.
      </p>
    </div>
  );
}
