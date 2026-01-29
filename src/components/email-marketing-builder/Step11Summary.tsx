'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEmailMarketingBuilderStore } from '@/hooks/useEmailMarketingBuilderStore';
import { useUnifiedQuoteStore, serviceMetadata, WebsiteConfig, AppConfig, AnimationConfig, ImageConfig, SoundConfig, PaidMediaConfig, SocialMediaConfig, VisualIdentityConfig } from '@/hooks/useUnifiedQuoteStore';
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
} from 'lucide-react';
import BuilderQuoteForm from '../builder/BuilderQuoteForm';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type ExpandedCard = 'email-marketing' | 'website' | 'app' | 'animation' | 'image' | 'sound' | 'paid-media' | 'social-media' | 'visual-identity' | null;

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
    store.saveToUnifiedQuote();
  }, [store]);

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

    // Clear from both builder store and unified quote store
    store.resetBuilder();
    unifiedStore.clearServiceConfig('email-marketing');

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
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-teal)] flex items-center justify-center">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-semibold text-white font-serif">
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

        <AnimatePresence>
          {expandedCard === 'email-marketing' && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="space-y-4 mt-6">
                <SummarySection title="Email Marketing Goal" icon={<Target className="w-5 h-5 text-[var(--accent-blue)]" />} stepNumber={1}>
                  <p className="text-[var(--text-secondary)]">{emailGoalLabel}</p>
                </SummarySection>

                <SummarySection title="Email Volume" icon={<Send className="w-5 h-5 text-[var(--accent-blue)]" />} stepNumber={2}>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">{volumeLabel}</span>
                    {store.volumePrice !== null ? (
                      <span className="text-[var(--accent-teal)]">${store.volumePrice}/mo</span>
                    ) : (
                      <span className="text-[var(--accent-orange)]">Custom Quote</span>
                    )}
                  </div>
                </SummarySection>

                <SummarySection title="Email Design" icon={<Palette className="w-5 h-5 text-[var(--accent-blue)]" />} stepNumber={3}>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">{designLabel}</span>
                    {store.designPrice > 0 ? (
                      <span className="text-[var(--accent-teal)]">${store.designPrice}/mo</span>
                    ) : (
                      <span className="text-[var(--text-muted)]">$0</span>
                    )}
                  </div>
                </SummarySection>

                <SummarySection title="Automation" icon={<Settings className="w-5 h-5 text-[var(--accent-blue)]" />} stepNumber={4}>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">{automationLabel}</span>
                    {store.automationPrice > 0 ? (
                      <span className="text-[var(--accent-teal)]">${store.automationPrice}/mo</span>
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
                      <span className="text-[var(--accent-teal)]">${store.listPrice}/mo</span>
                    ) : (
                      <span className="text-[var(--text-muted)]">$0</span>
                    )}
                  </div>
                </SummarySection>

                <SummarySection title="Copywriting" icon={<FileText className="w-5 h-5 text-[var(--accent-blue)]" />} stepNumber={7}>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">{copyLabel}</span>
                    {store.copyPrice > 0 ? (
                      <span className="text-[var(--accent-teal)]">${store.copyPrice}/mo</span>
                    ) : (
                      <span className="text-[var(--text-muted)]">$0</span>
                    )}
                  </div>
                </SummarySection>

                <SummarySection title="Reporting" icon={<BarChart3 className="w-5 h-5 text-[var(--accent-blue)]" />} stepNumber={8}>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">{reportingLabel}</span>
                    {store.reportingPrice > 0 ? (
                      <span className="text-[var(--accent-teal)]">${store.reportingPrice}/mo</span>
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
                          <span className="text-[var(--accent-teal)]">${store.testingPrice}/mo</span>
                        </div>
                      )}
                      {store.platform !== 'client' && (
                        <div className="flex justify-between text-sm">
                          <span className="text-[var(--text-secondary)]">{platformLabel}</span>
                          <span className="text-[var(--accent-teal)]">${store.platformPrice}/mo</span>
                        </div>
                      )}
                      {store.selectedAdditionalServices.map((service) => {
                        const serviceData = additionalServicesOptions.find((s) => s.id === service.id);
                        return (
                          <div key={service.id} className="flex justify-between text-sm">
                            <span className="text-[var(--text-secondary)]">{serviceData?.label}</span>
                            <span className={service.oneTime ? 'text-white' : 'text-[var(--accent-teal)]'}>
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
                      <span className="text-green-400 font-medium">-{discountPercent}% discount</span>
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
            </motion.div>
          )}
        </AnimatePresence>

        {/* Totals */}
        <div className="mt-6 p-4 bg-gradient-to-r from-[var(--accent-blue)]/20 to-[var(--accent-teal)]/20 border border-[var(--accent-blue)]/30 rounded-lg">
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
                <span className="text-xl font-bold text-[var(--accent-teal)]">
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
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-teal)] flex items-center justify-center">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-semibold text-white font-serif">Website Quote Summary</h2>
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
                      <span className="text-lg font-semibold text-[var(--accent-teal)]">${config.monthlyRecurring}/mo</span>
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
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-teal)] flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-semibold text-white font-serif">App Quote Summary</h2>
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
                      <span className="text-lg font-semibold text-[var(--accent-teal)]">${config.monthlyTotal}/mo</span>
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
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-teal)] flex items-center justify-center">
                  <Film className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-semibold text-white font-serif">Animation Quote Summary</h2>
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
                        <span className="text-[var(--text-secondary)]">{timelineLabel}</span>
                        {config.rushFee > 0 ? (
                          <span className="text-[var(--accent-orange)] font-medium">+${config.rushFee.toLocaleString()}</span>
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
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-teal)] flex items-center justify-center">
                  <Image className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-semibold text-white font-serif">Image Quote Summary</h2>
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
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-teal)] flex items-center justify-center">
                  <Music className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-semibold text-white font-serif">Sound Quote Summary</h2>
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
                        <span className="text-[var(--text-secondary)]">{timelineLabel}</span>
                        {config.rushFee > 0 ? (
                          <span className="text-[var(--accent-orange)] font-medium">+${config.rushFee.toLocaleString()}</span>
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
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-teal)] flex items-center justify-center">
                  <Megaphone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-semibold text-white font-serif">Paid Media Quote Summary</h2>
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
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-6 p-4 bg-gradient-to-r from-[var(--accent-blue)]/20 to-[var(--accent-teal)]/20 border border-[var(--accent-blue)]/30 rounded-lg">
              {config.hasCustomQuote ? (
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-[var(--accent-orange)] shrink-0 mt-0.5" />
                  <p className="text-white font-semibold">Custom Quote Required</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-semibold">Monthly</span>
                    <span className="text-lg font-semibold text-[var(--accent-teal)]">${config.monthlyTotal.toFixed(2)}/mo</span>
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
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-teal)] flex items-center justify-center">
                  <Share2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-semibold text-white font-serif">Social Media Quote Summary</h2>
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
                          <span className="text-green-400 font-medium">-{Math.round((1 - config.durationMultiplier) * 100)}% discount</span>
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
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-6 p-4 bg-gradient-to-r from-[var(--accent-blue)]/20 to-[var(--accent-teal)]/20 border border-[var(--accent-blue)]/30 rounded-lg">
              {config.hasCustomQuote ? (
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-[var(--accent-orange)] shrink-0 mt-0.5" />
                  <p className="text-white font-semibold">Custom Quote Required</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-semibold">Monthly Total</span>
                    <span className="text-xl font-bold text-[var(--accent-teal)]">${config.monthlyTotal.toFixed(2)}/mo</span>
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
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-teal)] flex items-center justify-center">
                  <Palette className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-semibold text-white font-serif">Visual Identity Quote Summary</h2>
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
                        <h3 className="font-medium text-white">Visual Identity Package</h3>
                      </div>
                      <p className="text-[var(--text-secondary)]">Custom visual identity design and branding</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-6 p-4 bg-gradient-to-r from-[var(--accent-blue)]/20 to-[var(--accent-teal)]/20 border border-[var(--accent-blue)]/30 rounded-lg">
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
                        ) : (
                          <Mail className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent-blue)]" />
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

      {/* Quote Form Modal */}
      {showQuoteForm && (
        <BuilderQuoteForm
          onBack={() => onCloseQuoteForm?.()}
        />
      )}
    </div>
  );
}
