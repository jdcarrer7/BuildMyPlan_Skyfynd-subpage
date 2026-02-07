'use client';

import { useState, useEffect } from 'react';
// CSS grid transitions used instead of framer-motion for expand/collapse
import { useVisualIdentityBuilderStore } from '@/hooks/useVisualIdentityBuilderStore';
import { useUnifiedQuoteStore, serviceMetadata, WebsiteConfig, AppConfig, AnimationConfig, ImageConfig, SoundConfig, PaidMediaConfig, SocialMediaConfig, EmailMarketingConfig, BrandStrategyConfig, VisualIdentityConfig, BrandApplicationsConfig, AIReceptionistConfig } from '@/hooks/useUnifiedQuoteStore';
import {
  visualIdentityGoalOptions,
  logoOptions,
  colorOptions,
  typographyOptions,
  photographyOptions,
  iconOptions,
  patternOptions,
  illustrationOptions,
  motionOptions,
  guidelinesOptions,
  addOnServices,
  timelineOptions,
} from '@/data/visualIdentityBuilder';
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
  emailGoalOptions,
  durationOptions as emailDurationOptions,
} from '@/data/emailMarketingBuilder';
import {
  strategyGoalOptions,
  timelineOptions as brandStrategyTimelineOptions,
} from '@/data/brandStrategyBuilder';
import {
  applicationGoalOptions,
  timelineOptions as brandAppTimelineOptions,
} from '@/data/brandApplicationsBuilder';
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
  Edit2,
  Target,
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
  Layers,
  Calendar,
  Share2,
  Mail,
  Sparkles,
  Palette,
  Paintbrush,
  Type,
  Camera,
  Grid,
  Brush,
  Play,
  BookOpen,
  Briefcase,
  Phone,
  Bot,
  Settings,
  Mic,
  Brain,
  Link2,
  BarChart2,
  Headphones,
} from 'lucide-react';
import BuilderQuoteForm from '../builder/BuilderQuoteForm';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type ExpandedCard = 'visual-identity' | 'brand-strategy' | 'website' | 'app' | 'animation' | 'image' | 'sound' | 'paid-media' | 'social-media' | 'email-marketing' | 'brand-applications' | 'ai-receptionist' | null;

interface Step13SummaryProps {
  showQuoteForm?: boolean;
  onCloseQuoteForm?: () => void;
}

export default function Step13Summary({ showQuoteForm = false, onCloseQuoteForm }: Step13SummaryProps) {
  const store = useVisualIdentityBuilderStore();
  const unifiedStore = useUnifiedQuoteStore();
  const router = useRouter();

  const [expandedCard, setExpandedCard] = useState<ExpandedCard>('visual-identity');
  const [showAddServices, setShowAddServices] = useState(false);

  // Save to unified quote on mount
  useEffect(() => {
    // Only save if visualIdentityGoal is set (meaning we have a valid configuration)
    if (store.visualIdentityGoal) {
      store.saveToUnifiedQuote();
    }
  }, [store.visualIdentityGoal, store.saveToUnifiedQuote]);

  // Get labels
  const goalLabel = visualIdentityGoalOptions.find((g) => g.id === store.visualIdentityGoal)?.label;
  const logoLabel = logoOptions.find((l) => l.id === store.logo)?.label;
  const logoStartsAt = logoOptions.find((l) => l.id === store.logo)?.startsAt;
  const colorsLabel = colorOptions.find((c) => c.id === store.colors)?.label;
  const colorsStartsAt = colorOptions.find((c) => c.id === store.colors)?.startsAt;
  const typographyLabel = typographyOptions.find((t) => t.id === store.typography)?.label;
  const typographyStartsAt = typographyOptions.find((t) => t.id === store.typography)?.startsAt;
  const photographyLabel = photographyOptions.find((p) => p.id === store.photography)?.label;
  const photographyStartsAt = photographyOptions.find((p) => p.id === store.photography)?.startsAt;
  const iconsLabel = iconOptions.find((i) => i.id === store.icons)?.label;
  const iconsStartsAt = iconOptions.find((i) => i.id === store.icons)?.startsAt;
  const patternsLabel = patternOptions.find((p) => p.id === store.patterns)?.label;
  const patternsStartsAt = patternOptions.find((p) => p.id === store.patterns)?.startsAt;
  const illustrationLabel = illustrationOptions.find((i) => i.id === store.illustration)?.label;
  const illustrationStartsAt = illustrationOptions.find((i) => i.id === store.illustration)?.startsAt;
  const motionLabel = motionOptions.find((m) => m.id === store.motion)?.label;
  const motionStartsAt = motionOptions.find((m) => m.id === store.motion)?.startsAt;
  const guidelinesLabel = guidelinesOptions.find((g) => g.id === store.guidelines)?.label;
  const guidelinesStartsAt = guidelinesOptions.find((g) => g.id === store.guidelines)?.startsAt;
  const timelineLabel = timelineOptions.find((t) => t.id === store.timeline)?.label;

  // Get available and configured services
  const availableServices = unifiedStore.getAvailableServices().filter((s) => s !== 'visual-identity');
  const configuredServices = unifiedStore.getAllConfiguredServices();
  const otherServices = configuredServices.filter((s) => s.type !== 'visual-identity');

  const handleEdit = () => {
    store.setStep(1);
  };

  const handleClear = () => {
    const remainingServices = configuredServices.filter(s => s.type !== 'visual-identity');

    // Clear from unified store first
    unifiedStore.clearServiceConfig('visual-identity');
    store.resetBuilder();

    // Delay navigation to ensure persist middleware has saved
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

  // Calculate timeline percentage
  const timelinePremiumPercent = store.timelineMultiplier > 1 ? Math.round((store.timelineMultiplier - 1) * 100) : 0;

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
          className="text-[var(--text-muted)] hover:text-[var(--accent-purple)] transition-colors"
        >
          <Edit2 className="w-4 h-4" />
        </button>
      </div>
      {children}
    </div>
  );

  const formatPrice = (price: number, startsAt?: boolean) => {
    if (price === 0) return <span className="text-[var(--text-muted)]">$0</span>;
    if (startsAt) return <span className="text-white font-medium">${price.toLocaleString()}+</span>;
    return <span className="text-white font-medium">${price.toLocaleString()}</span>;
  };

  if (showQuoteForm) {
    return <BuilderQuoteForm onBack={() => onCloseQuoteForm?.()} />;
  }

  return (
    <div className="space-y-6">
      {/* Main Visual Identity Summary Card */}
      <div className="card p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--accent-purple)] to-[var(--accent-pink)] flex items-center justify-center">
              <Palette className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-white font-serif">
                Visual Identity Quote Summary
              </h2>
              <p className="text-[var(--text-secondary)] text-sm">{goalLabel}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-white hover:border-[var(--accent-purple)] transition-all"
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={handleClear}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all"
            >
              <Trash2 className="w-4 h-4" />
              Reset
            </button>
            <button
              onClick={() => toggleCard('visual-identity')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-white hover:border-[var(--accent-purple)] transition-all"
            >
              {expandedCard === 'visual-identity' ? (
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

        <div className={`grid transition-all duration-300 ease-in-out ${expandedCard === 'visual-identity' ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
          <div className="overflow-hidden">
            <div className="space-y-4 mt-6">
                {/* Core Identity Section */}
                <div className="p-4 bg-[var(--bg-card)] rounded-lg border border-[var(--border-subtle)]">
                  <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-[var(--accent-purple)]" />
                    Core Identity
                  </h3>
                  <div className="space-y-3">
                    {/* Visual Identity Goal */}
                    <SummarySection title="Visual Identity Goal" icon={<Palette className="w-5 h-5 text-[var(--accent-purple)]" />} stepNumber={1}>
                      <p className="text-[var(--text-secondary)]">{goalLabel}</p>
                    </SummarySection>

                    {/* Logo */}
                    <SummarySection title="Logo Design" icon={<Paintbrush className="w-5 h-5 text-[var(--accent-purple)]" />} stepNumber={2}>
                      <div className="flex justify-between">
                        <span className="text-[var(--text-secondary)]">{logoLabel}</span>
                        {formatPrice(store.logoPrice, logoStartsAt)}
                      </div>
                    </SummarySection>

                    {/* Colors */}
                    <SummarySection title="Color Palette" icon={<Palette className="w-5 h-5 text-[var(--accent-purple)]" />} stepNumber={3}>
                      <div className="flex justify-between">
                        <span className="text-[var(--text-secondary)]">{colorsLabel}</span>
                        {formatPrice(store.colorsPrice, colorsStartsAt)}
                      </div>
                    </SummarySection>

                    {/* Typography */}
                    <SummarySection title="Typography" icon={<Type className="w-5 h-5 text-[var(--accent-purple)]" />} stepNumber={4}>
                      <div className="flex justify-between">
                        <span className="text-[var(--text-secondary)]">{typographyLabel}</span>
                        {formatPrice(store.typographyPrice, typographyStartsAt)}
                      </div>
                    </SummarySection>

                    {/* Photography */}
                    <SummarySection title="Photography Direction" icon={<Camera className="w-5 h-5 text-[var(--accent-purple)]" />} stepNumber={5}>
                      <div className="flex justify-between">
                        <span className="text-[var(--text-secondary)]">{photographyLabel}</span>
                        {formatPrice(store.photographyPrice, photographyStartsAt)}
                      </div>
                    </SummarySection>
                  </div>
                  <div className="mt-4 pt-4 border-t border-[var(--border-subtle)]">
                    <div className="flex justify-between">
                      <span className="text-[var(--text-secondary)] font-medium">Core Identity Subtotal</span>
                      <span className="text-white font-medium">${store.coreIdentitySubtotal.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Visual Elements Section */}
                <div className="p-4 bg-[var(--bg-card)] rounded-lg border border-[var(--border-subtle)]">
                  <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <Grid className="w-5 h-5 text-[var(--accent-purple)]" />
                    Visual Elements
                  </h3>
                  <div className="space-y-3">
                    {/* Iconography */}
                    <SummarySection title="Iconography" icon={<Grid className="w-5 h-5 text-[var(--accent-purple)]" />} stepNumber={6}>
                      <div className="flex justify-between">
                        <span className="text-[var(--text-secondary)]">{iconsLabel}</span>
                        {formatPrice(store.iconsPrice, iconsStartsAt)}
                      </div>
                    </SummarySection>

                    {/* Patterns */}
                    <SummarySection title="Patterns & Textures" icon={<Layers className="w-5 h-5 text-[var(--accent-purple)]" />} stepNumber={7}>
                      <div className="flex justify-between">
                        <span className="text-[var(--text-secondary)]">{patternsLabel}</span>
                        {formatPrice(store.patternsPrice, patternsStartsAt)}
                      </div>
                    </SummarySection>

                    {/* Illustration */}
                    <SummarySection title="Illustration Style" icon={<Brush className="w-5 h-5 text-[var(--accent-purple)]" />} stepNumber={8}>
                      <div className="flex justify-between">
                        <span className="text-[var(--text-secondary)]">{illustrationLabel}</span>
                        {formatPrice(store.illustrationPrice, illustrationStartsAt)}
                      </div>
                    </SummarySection>

                    {/* Motion */}
                    <SummarySection title="Motion Guidelines" icon={<Play className="w-5 h-5 text-[var(--accent-purple)]" />} stepNumber={9}>
                      <div className="flex justify-between">
                        <span className="text-[var(--text-secondary)]">{motionLabel}</span>
                        {formatPrice(store.motionPrice, motionStartsAt)}
                      </div>
                    </SummarySection>
                  </div>
                  <div className="mt-4 pt-4 border-t border-[var(--border-subtle)]">
                    <div className="flex justify-between">
                      <span className="text-[var(--text-secondary)] font-medium">Visual Elements Subtotal</span>
                      <span className="text-white font-medium">${store.visualElementsSubtotal.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Documentation Section */}
                <div className="p-4 bg-[var(--bg-card)] rounded-lg border border-[var(--border-subtle)]">
                  <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-[var(--accent-purple)]" />
                    Documentation
                  </h3>
                  <div className="space-y-3">
                    {/* Guidelines */}
                    <SummarySection title="Brand Guidelines" icon={<BookOpen className="w-5 h-5 text-[var(--accent-purple)]" />} stepNumber={10}>
                      <div className="flex justify-between">
                        <span className="text-[var(--text-secondary)]">{guidelinesLabel}</span>
                        {formatPrice(store.guidelinesPrice, guidelinesStartsAt)}
                      </div>
                    </SummarySection>
                  </div>
                  <div className="mt-4 pt-4 border-t border-[var(--border-subtle)]">
                    <div className="flex justify-between">
                      <span className="text-[var(--text-secondary)] font-medium">Documentation Subtotal</span>
                      <span className="text-white font-medium">${store.documentationSubtotal.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Add-ons Section */}
                <SummarySection title="Add-on Services" icon={<Sparkles className="w-5 h-5 text-[var(--accent-purple)]" />} stepNumber={11}>
                  {store.selectedAddOns.length === 0 ? (
                    <p className="text-[var(--text-muted)] text-sm">No add-ons selected</p>
                  ) : (
                    <div className="space-y-2">
                      {store.selectedAddOns.map((addOn) => {
                        const addOnData = addOnServices.find((a) => a.id === addOn.id);
                        return (
                          <div key={addOn.id} className="flex justify-between text-sm">
                            <span className="text-[var(--text-secondary)]">{addOnData?.label}</span>
                            <span className="text-white font-medium">
                              ${addOn.price.toLocaleString()}
                            </span>
                          </div>
                        );
                      })}
                      <div className="flex justify-between pt-2 border-t border-[var(--border-subtle)]">
                        <span className="text-[var(--text-secondary)] font-medium">Add-ons Total</span>
                        <span className="text-white font-medium">${store.addOnsTotal.toLocaleString()}</span>
                      </div>
                    </div>
                  )}
                </SummarySection>

                {/* Timeline Section */}
                <SummarySection title="Timeline" icon={<Calendar className="w-5 h-5 text-[var(--accent-purple)]" />} stepNumber={12}>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">{timelineLabel}</span>
                    {timelinePremiumPercent > 0 ? (
                      <span className="text-[var(--accent-orange)] font-medium">
                        +{timelinePremiumPercent}% (${store.timelinePremium.toLocaleString()})
                      </span>
                    ) : (
                      <span className="text-green-400 font-medium">No premium</span>
                    )}
                  </div>
                </SummarySection>
              </div>
            </div>
          </div>

        {/* Totals */}
        <div className="mt-6 p-4 bg-gradient-to-r from-[var(--accent-purple)]/20 to-[var(--accent-pink)]/20 border border-[var(--accent-purple)]/30 rounded-lg">
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
              <div className="flex justify-between items-center text-sm">
                <span className="text-[var(--text-secondary)]">Core Identity</span>
                <span className="text-white">${store.coreIdentitySubtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-[var(--text-secondary)]">Visual Elements</span>
                <span className="text-white">${store.visualElementsSubtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-[var(--text-secondary)]">Documentation</span>
                <span className="text-white">${store.documentationSubtotal.toLocaleString()}</span>
              </div>
              {store.addOnsTotal > 0 && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[var(--text-secondary)]">Add-ons</span>
                  <span className="text-white">+${store.addOnsTotal.toLocaleString()}</span>
                </div>
              )}
              {store.timelinePremium > 0 && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[var(--text-secondary)]">Timeline Premium ({timelinePremiumPercent}%)</span>
                  <span className="text-[var(--accent-orange)]">+${store.timelinePremium.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between items-center pt-3 border-t-2 border-[var(--accent-purple)]/50">
                <span className="text-white font-bold">Total Investment</span>
                <span className="text-2xl font-bold gradient-text">${store.totalInvestment.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center mt-2 pt-2 border-t-2 border-[var(--accent-purple)]/50">
                <span className="text-white font-bold">Due Today</span>
                <span className="text-xl font-bold gradient-text">${store.totalInvestment.toLocaleString()}</span>
              </div>
              <p className="text-xs text-[var(--text-muted)] text-center">
                One-time project fee (no monthly recurring)
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Other Configured Services - Brand Strategy */}
      {otherServices.filter((s) => s.type === 'brand-strategy').map((service) => {
        const isOpen = expandedCard === 'brand-strategy';
        const config = service.config as BrandStrategyConfig;
        const strategyLabel = strategyGoalOptions.find((g) => g.id === config.strategyGoal)?.label;
        const timelineLabelBS = brandStrategyTimelineOptions.find((t) => t.id === config.timeline)?.label;

        return (
          <div key={service.type} className="card p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--accent-purple)] to-[var(--accent-pink)] flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-white font-serif">Brand Strategy Quote Summary</h2>
                  <p className="text-[var(--text-secondary)] text-sm">{strategyLabel}</p>
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
                  onClick={() => toggleCard('brand-strategy')}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-white hover:border-[var(--accent-purple)] transition-all"
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
                        <Target className="w-5 h-5 text-[var(--accent-purple)]" />
                        <h3 className="font-medium text-white">Strategy Goal</h3>
                      </div>
                      <p className="text-[var(--text-secondary)]">{strategyLabel}</p>
                    </div>
                    <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <Clock className="w-5 h-5 text-[var(--accent-purple)]" />
                        <h3 className="font-medium text-white">Timeline</h3>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--text-secondary)]">{timelineLabelBS}</span>
                        {config.timelinePremium > 0 ? (
                          <span className="text-[var(--accent-orange)] font-medium">+${config.timelinePremium.toLocaleString()}</span>
                        ) : (
                          <span className="text-green-400 font-medium">No premium</span>
                        )}
                      </div>
                    </div>
                  </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-[var(--accent-purple)]/20 to-[var(--accent-pink)]/20 border border-[var(--accent-purple)]/30 rounded-lg">
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

      {/* Other Configured Services - Website */}
      {otherServices.filter((s) => s.type === 'website').map((service) => {
        const isOpen = expandedCard === 'website';
        const config = service.config as WebsiteConfig;
        const projectTypeLabel = websiteProjectTypes.find((t) => t.id === config.projectType)?.label;
        const timelineLabelWS = websiteTimelineOptions.find((t) => t.id === config.timeline)?.label;

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
                  onClick={() => toggleCard('website')}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-white hover:border-[var(--accent-purple)] transition-all"
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
                        <Globe className="w-5 h-5 text-[var(--accent-purple)]" />
                        <h3 className="font-medium text-white">Project Type</h3>
                      </div>
                      <p className="text-[var(--text-secondary)]">{projectTypeLabel}</p>
                    </div>
                    <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <Clock className="w-5 h-5 text-[var(--accent-purple)]" />
                        <h3 className="font-medium text-white">Timeline</h3>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--text-secondary)]">{timelineLabelWS}</span>
                        {config.rushFee > 0 ? (
                          <span className="text-[var(--accent-orange)] font-medium">+${config.rushFee.toLocaleString()}</span>
                        ) : (
                          <span className="text-green-400 font-medium">No rush fee</span>
                        )}
                      </div>
                    </div>
                  </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-[var(--accent-purple)]/20 to-[var(--accent-pink)]/20 border border-[var(--accent-purple)]/30 rounded-lg">
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
        const timelineLabelApp = appTimelineOptions.find((t) => t.id === config.timeline)?.label;

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
                  onClick={() => toggleCard('app')}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-white hover:border-[var(--accent-purple)] transition-all"
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
                        <Smartphone className="w-5 h-5 text-[var(--accent-purple)]" />
                        <h3 className="font-medium text-white">App Type</h3>
                      </div>
                      <p className="text-[var(--text-secondary)]">{appTypeLabel}</p>
                    </div>
                    <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <Clock className="w-5 h-5 text-[var(--accent-purple)]" />
                        <h3 className="font-medium text-white">Timeline</h3>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--text-secondary)]">{timelineLabelApp}</span>
                        {config.rushFee > 0 ? (
                          <span className="text-[var(--accent-orange)] font-medium">+${config.rushFee.toLocaleString()}</span>
                        ) : (
                          <span className="text-green-400 font-medium">No rush fee</span>
                        )}
                      </div>
                    </div>
                  </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-[var(--accent-purple)]/20 to-[var(--accent-pink)]/20 border border-[var(--accent-purple)]/30 rounded-lg">
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
        const timelineLabelAnim = animationTimelineOptions.find((t) => t.id === config.timeline)?.label;

        return (
          <div key={service.type} className="card p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--accent-purple)] to-[var(--accent-pink)] flex items-center justify-center">
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
                  onClick={() => toggleCard('animation')}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-white hover:border-[var(--accent-purple)] transition-all"
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
                        <Film className="w-5 h-5 text-[var(--accent-purple)]" />
                        <h3 className="font-medium text-white">Animation Type</h3>
                      </div>
                      <p className="text-[var(--text-secondary)]">{animTypeLabel}</p>
                    </div>
                    <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <Clock className="w-5 h-5 text-[var(--accent-purple)]" />
                        <h3 className="font-medium text-white">Timeline</h3>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--text-secondary)]">{timelineLabelAnim}</span>
                        {config.rushFee > 0 ? (
                          <span className="text-[var(--accent-orange)] font-medium">+${config.rushFee.toLocaleString()}</span>
                        ) : (
                          <span className="text-green-400 font-medium">No rush fee</span>
                        )}
                      </div>
                    </div>
                  </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-[var(--accent-purple)]/20 to-[var(--accent-pink)]/20 border border-[var(--accent-purple)]/30 rounded-lg">
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
        const timelineLabelImg = imageTimelineOptions.find((t) => t.id === config.timeline)?.label;

        return (
          <div key={service.type} className="card p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--accent-purple)] to-[var(--accent-pink)] flex items-center justify-center">
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
                  onClick={() => toggleCard('image')}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-white hover:border-[var(--accent-purple)] transition-all"
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
                        <Image className="w-5 h-5 text-[var(--accent-purple)]" />
                        <h3 className="font-medium text-white">Image Type</h3>
                      </div>
                      <p className="text-[var(--text-secondary)]">{imgTypeLabel}</p>
                    </div>
                    <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <Clock className="w-5 h-5 text-[var(--accent-purple)]" />
                        <h3 className="font-medium text-white">Timeline</h3>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--text-secondary)]">{timelineLabelImg}</span>
                        {config.rushFee > 0 ? (
                          <span className="text-[var(--accent-orange)] font-medium">+${config.rushFee.toLocaleString()}</span>
                        ) : (
                          <span className="text-green-400 font-medium">No rush fee</span>
                        )}
                      </div>
                    </div>
                  </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-[var(--accent-purple)]/20 to-[var(--accent-pink)]/20 border border-[var(--accent-purple)]/30 rounded-lg">
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
        const timelineLabelSound = soundTimelineOptions.find((t) => t.id === config.timeline)?.label;

        return (
          <div key={service.type} className="card p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--accent-purple)] to-[var(--accent-pink)] flex items-center justify-center">
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
                  onClick={() => toggleCard('sound')}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-white hover:border-[var(--accent-purple)] transition-all"
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
                        <Music className="w-5 h-5 text-[var(--accent-purple)]" />
                        <h3 className="font-medium text-white">Sound Type</h3>
                      </div>
                      <p className="text-[var(--text-secondary)]">{soundTypeLabel}</p>
                    </div>
                    <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <Clock className="w-5 h-5 text-[var(--accent-purple)]" />
                        <h3 className="font-medium text-white">Timeline</h3>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--text-secondary)]">{timelineLabelSound}</span>
                        {config.rushFee > 0 ? (
                          <span className="text-[var(--accent-orange)] font-medium">+${config.rushFee.toLocaleString()}</span>
                        ) : (
                          <span className="text-green-400 font-medium">No rush fee</span>
                        )}
                      </div>
                    </div>
                  </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-[var(--accent-purple)]/20 to-[var(--accent-pink)]/20 border border-[var(--accent-purple)]/30 rounded-lg">
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
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--accent-purple)] to-[var(--accent-pink)] flex items-center justify-center">
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
                  onClick={() => toggleCard('paid-media')}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-white hover:border-[var(--accent-purple)] transition-all"
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
                        <Megaphone className="w-5 h-5 text-[var(--accent-purple)]" />
                        <h3 className="font-medium text-white">Campaign Type</h3>
                      </div>
                      <p className="text-[var(--text-secondary)]">{campaignLabel}</p>
                    </div>
                    <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <Calendar className="w-5 h-5 text-[var(--accent-purple)]" />
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

            <div className="mt-6 p-4 bg-gradient-to-r from-[var(--accent-purple)]/20 to-[var(--accent-pink)]/20 border border-[var(--accent-purple)]/30 rounded-lg">
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
        const goalLabelSM = socialGoalOptions.find((g) => g.id === config.managementGoal)?.label;
        const durationLabelSM = socialDurationOptions.find((d) => d.id === config.duration)?.label;

        return (
          <div key={service.type} className="card p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--accent-purple)] to-[var(--accent-pink)] flex items-center justify-center">
                  <Share2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-white font-serif">Social Media Quote Summary</h2>
                  <p className="text-[var(--text-secondary)] text-sm">{goalLabelSM}</p>
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
                  onClick={() => toggleCard('social-media')}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-white hover:border-[var(--accent-purple)] transition-all"
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
                        <Share2 className="w-5 h-5 text-[var(--accent-purple)]" />
                        <h3 className="font-medium text-white">Management Goal</h3>
                      </div>
                      <p className="text-[var(--text-secondary)]">{goalLabelSM}</p>
                    </div>
                    <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <Calendar className="w-5 h-5 text-[var(--accent-purple)]" />
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
              </div>
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-[var(--accent-purple)]/20 to-[var(--accent-pink)]/20 border border-[var(--accent-purple)]/30 rounded-lg">
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
                    <span className="text-white font-bold">{config.durationMonths}-Month Investment</span>
                    <span className="text-2xl font-bold gradient-text">${config.totalInvestment.toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Other Configured Services - Email Marketing */}
      {otherServices.filter((s) => s.type === 'email-marketing').map((service) => {
        const isOpen = expandedCard === 'email-marketing';
        const config = service.config as EmailMarketingConfig;
        const emailGoalLabel = emailGoalOptions.find((g) => g.id === config.emailGoal)?.label;
        const emailDurationLabel = emailDurationOptions.find((d) => d.id === config.duration)?.label;

        return (
          <div key={service.type} className="card p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--accent-purple)] to-[var(--accent-pink)] flex items-center justify-center">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-white font-serif">Email Marketing Quote Summary</h2>
                  <p className="text-[var(--text-secondary)] text-sm">{emailGoalLabel}</p>
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
                  onClick={() => toggleCard('email-marketing')}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-white hover:border-[var(--accent-purple)] transition-all"
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
                        <Mail className="w-5 h-5 text-[var(--accent-purple)]" />
                        <h3 className="font-medium text-white">Email Goal</h3>
                      </div>
                      <p className="text-[var(--text-secondary)]">{emailGoalLabel}</p>
                    </div>
                    <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <Calendar className="w-5 h-5 text-[var(--accent-purple)]" />
                        <h3 className="font-medium text-white">Duration</h3>
                      </div>
                      <p className="text-[var(--text-secondary)]">{emailDurationLabel}</p>
                    </div>
                  </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-[var(--accent-purple)]/20 to-[var(--accent-pink)]/20 border border-[var(--accent-purple)]/30 rounded-lg">
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
                    <span className="text-white font-bold">{config.durationMonths}-Month Investment</span>
                    <span className="text-2xl font-bold gradient-text">${config.totalInvestment.toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Other Configured Services - Brand Applications */}
      {otherServices.filter((s) => s.type === 'brand-applications').map((service) => {
        const isOpen = expandedCard === 'brand-applications';
        const config = service.config as BrandApplicationsConfig;
        const applicationGoalLabel = applicationGoalOptions.find((g) => g.id === config.applicationGoal)?.label;
        const brandAppTimelineLabel = brandAppTimelineOptions.find((t) => t.id === config.timeline)?.label;
        const timelinePremiumPercentBA = config.timelineMultiplier > 1 ? Math.round((config.timelineMultiplier - 1) * 100) : 0;

        return (
          <div key={service.type} className="card p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--accent-purple)] to-[var(--accent-pink)] flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-white font-serif">Brand Applications Quote Summary</h2>
                  <p className="text-[var(--text-secondary)] text-sm">{applicationGoalLabel}</p>
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
                  onClick={() => toggleCard('brand-applications')}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-white hover:border-[var(--accent-purple)] transition-all"
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
                        <Briefcase className="w-5 h-5 text-[var(--accent-purple)]" />
                        <h3 className="font-medium text-white">Application Goal</h3>
                      </div>
                      <p className="text-[var(--text-secondary)]">{applicationGoalLabel}</p>
                    </div>
                    <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <Clock className="w-5 h-5 text-[var(--accent-purple)]" />
                        <h3 className="font-medium text-white">Timeline</h3>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--text-secondary)]">{brandAppTimelineLabel}</span>
                        {timelinePremiumPercentBA > 0 ? (
                          <span className="text-[var(--accent-orange)] font-medium">+{timelinePremiumPercentBA}% premium</span>
                        ) : (
                          <span className="text-green-400 font-medium">No premium</span>
                        )}
                      </div>
                    </div>
                  </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-[var(--accent-purple)]/20 to-[var(--accent-pink)]/20 border border-[var(--accent-purple)]/30 rounded-lg">
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
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--accent-purple)] to-[var(--accent-pink)] flex items-center justify-center">
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
                  onClick={() => toggleCard('ai-receptionist')}
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

            <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
              <div className="overflow-hidden">
                  <div className="space-y-4 mt-6">
                    {/* Package Section */}
                    <div className="p-4 bg-[var(--bg-card)] rounded-lg border border-[var(--border-subtle)]">
                      <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                        <Phone className="w-5 h-5 text-[var(--accent-purple)]" />
                        Package
                      </h3>
                      <div className="p-3 bg-[var(--bg-secondary)] rounded-lg">
                        <p className="text-[var(--text-secondary)]">{packageLabel}</p>
                      </div>
                    </div>

                    {/* Phone Setup Section */}
                    <div className="p-4 bg-[var(--bg-card)] rounded-lg border border-[var(--border-subtle)]">
                      <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                        <Settings className="w-5 h-5 text-[var(--accent-purple)]" />
                        Phone Setup
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-[var(--text-secondary)]">Number Type</span>
                          <span className="text-white">{phoneNumberTypeOptions.find(o => o.id === config.phoneNumberType)?.label}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-[var(--text-secondary)]">Lines</span>
                          <span className="text-white">{additionalLinesOptions.find(o => o.id === config.additionalLines)?.label}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-[var(--text-secondary)]">Coverage Area</span>
                          <span className="text-white">{coverageAreaOptions.find(o => o.id === config.coverageArea)?.label}</span>
                        </div>
                      </div>
                    </div>

                    {/* Call Handling Section */}
                    <div className="p-4 bg-[var(--bg-card)] rounded-lg border border-[var(--border-subtle)]">
                      <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                        <Phone className="w-5 h-5 text-[var(--accent-pink)]" />
                        Call Handling
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-[var(--text-secondary)]">Monthly Minutes</span>
                          <span className="text-white">{monthlyMinutesOptions.find(o => o.id === config.monthlyMinutes)?.label}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-[var(--text-secondary)]">Availability</span>
                          <span className="text-white">{availabilityOptions.find(o => o.id === config.availability)?.label}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-[var(--text-secondary)]">Call Transfer</span>
                          <span className="text-white">{callTransferOptions.find(o => o.id === config.callTransfer)?.label}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-[var(--text-secondary)]">Voicemail</span>
                          <span className="text-white">{voicemailOptions.find(o => o.id === config.voicemailType)?.label}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-[var(--text-secondary)]">Max Call Duration</span>
                          <span className="text-white">{maxCallDurationOptions.find(o => o.id === config.maxCallDuration)?.label}</span>
                        </div>
                      </div>
                    </div>

                    {/* AI Capabilities Section */}
                    <div className="p-4 bg-[var(--bg-card)] rounded-lg border border-[var(--border-subtle)]">
                      <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                        <Brain className="w-5 h-5 text-[var(--accent-purple)]" />
                        AI Capabilities
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-[var(--text-secondary)]">Language</span>
                          <span className="text-white">{languageOptions.find(o => o.id === config.language)?.label}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-[var(--text-secondary)]">Voice Style</span>
                          <span className="text-white">{voiceStyleOptions.find(o => o.id === config.voiceStyle)?.label}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-[var(--text-secondary)]">Knowledge Base</span>
                          <span className="text-white">{knowledgeBaseSizeOptions.find(o => o.id === config.knowledgeBaseSize)?.label}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-[var(--text-secondary)]">Conversation Complexity</span>
                          <span className="text-white">{conversationComplexityOptions.find(o => o.id === config.conversationComplexity)?.label}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-[var(--text-secondary)]">Personality</span>
                          <span className="text-white">{personalityOptions.find(o => o.id === config.personality)?.label}</span>
                        </div>
                      </div>
                    </div>

                    {/* Integrations Section */}
                    <div className="p-4 bg-[var(--bg-card)] rounded-lg border border-[var(--border-subtle)]">
                      <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                        <Link2 className="w-5 h-5 text-[var(--accent-pink)]" />
                        Integrations
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-[var(--text-secondary)]">Lead Capture</span>
                          <span className="text-white">{leadCaptureOptions.find(o => o.id === config.leadCapture)?.label}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-[var(--text-secondary)]">Calendar</span>
                          <span className="text-white">{calendarOptions.find(o => o.id === config.calendar)?.label}</span>
                        </div>
                        {config.notifications && config.notifications.length > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-[var(--text-secondary)]">Notifications</span>
                            <span className="text-white">{config.notifications.map(n => notificationOptions.find(o => o.id === n)?.label).join(', ')}</span>
                          </div>
                        )}
                        {config.additionalIntegrations && config.additionalIntegrations.length > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-[var(--text-secondary)]">Additional</span>
                            <span className="text-white">{config.additionalIntegrations.map(i => additionalIntegrationOptions.find(o => o.id === i)?.label).join(', ')}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Reporting Section */}
                    <div className="p-4 bg-[var(--bg-card)] rounded-lg border border-[var(--border-subtle)]">
                      <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                        <BarChart2 className="w-5 h-5 text-[var(--accent-purple)]" />
                        Reporting
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-[var(--text-secondary)]">Transcripts</span>
                          <span className="text-white">{transcriptsOptions.find(o => o.id === config.transcripts)?.label}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-[var(--text-secondary)]">AI Summaries</span>
                          <span className="text-white">{aiSummariesOptions.find(o => o.id === config.aiSummaries)?.label}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-[var(--text-secondary)]">Analytics Level</span>
                          <span className="text-white">{analyticsLevelOptions.find(o => o.id === config.analyticsLevel)?.label}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-[var(--text-secondary)]">Reporting Frequency</span>
                          <span className="text-white">{reportingFrequencyOptions.find(o => o.id === config.reportingFrequency)?.label}</span>
                        </div>
                      </div>
                    </div>

                    {/* Support Section */}
                    <div className="p-4 bg-[var(--bg-card)] rounded-lg border border-[var(--border-subtle)]">
                      <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                        <Headphones className="w-5 h-5 text-[var(--accent-pink)]" />
                        Support
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-[var(--text-secondary)]">Onboarding</span>
                          <span className="text-white">{onboardingTypeOptions.find(o => o.id === config.onboardingType)?.label}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-[var(--text-secondary)]">Knowledge Updates</span>
                          <span className="text-white">{knowledgeUpdatesOptions.find(o => o.id === config.knowledgeUpdates)?.label}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-[var(--text-secondary)]">Support Level</span>
                          <span className="text-white">{supportLevelOptions.find(o => o.id === config.supportLevel)?.label}</span>
                        </div>
                      </div>
                    </div>
                  </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-[var(--accent-purple)]/20 to-[var(--accent-pink)]/20 border border-[var(--accent-purple)]/30 rounded-lg">
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

          <div className={`grid transition-all duration-300 ease-in-out ${showAddServices ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
            <div className="overflow-hidden">
              <div className="grid gap-2 mt-4 pt-4 border-t border-[var(--border-subtle)]">
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
                      ) : serviceType === 'brand-applications' ? (
                        <Briefcase className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent-purple)]" />
                      ) : serviceType === 'ai-receptionist' ? (
                        <Phone className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent-purple)]" />
                      ) : (
                        <Palette className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent-purple)]" />
                      )}
                      <span className="text-white text-sm font-medium">{serviceMetadata[serviceType].label}</span>
                    </div>
                    <Plus className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent-purple)]" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <p className="text-[10px] text-[var(--text-muted)] text-center">
        *Estimates are based on your selections and subject to final confirmation after consultation.
      </p>
    </div>
  );
}
