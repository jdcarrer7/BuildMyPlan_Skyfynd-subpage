'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useImageBuilderStore } from '@/hooks/useImageBuilderStore';
import { useUnifiedQuoteStore, serviceMetadata, WebsiteConfig, AppConfig, AnimationConfig, SoundConfig, PaidMediaConfig, SocialMediaConfig, EmailMarketingConfig, VisualIdentityConfig } from '@/hooks/useUnifiedQuoteStore';
import {
  imageTypeOptions,
  quantityOptions,
  styleOptions,
  creationMethodOptions,
  editingOptions,
  backgroundOptions,
  overlayOptions,
  sizeOptions,
  revisionOptions,
  formatOptions,
  sourceOptions,
  licenseOptions,
  timelineOptions,
} from '@/data/imageBuilder';
import {
  projectTypes,
  siteSizeOptions,
  designOptions,
  cmsOptions,
  timelineOptions as websiteTimelineOptions,
} from '@/data/websiteBuilder';
import {
  appTypes,
  platformOptions,
  appTimelineOptions,
} from '@/data/appBuilder';
import {
  animationTypeOptions,
  timelineOptions as animationTimelineOptions,
} from '@/data/animationBuilder';
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
  Image,
  Clock,
  Palette,
  Layers,
  Package,
  FileImage,
  Shield,
  AlertCircle,
  Trash2,
  ChevronDown,
  ChevronUp,
  Globe,
  Smartphone,
  Film,
  Plus,
  Sparkles,
  RefreshCw,
  Music,
  Megaphone,
  Share2,
  Mail,
  Target,
} from 'lucide-react';
import BuilderQuoteForm from '../builder/BuilderQuoteForm';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type ExpandedCard = 'image' | 'website' | 'app' | 'animation' | 'sound' | 'paid-media' | 'social-media' | 'email-marketing' | 'visual-identity' | null;

interface Step9SummaryProps {
  showQuoteForm?: boolean;
  onCloseQuoteForm?: () => void;
}

export default function Step9Summary({ showQuoteForm = false, onCloseQuoteForm }: Step9SummaryProps) {
  const {
    imageType,
    quantity,
    style,
    creation,
    editing,
    background,
    overlay,
    sizes,
    revisions,
    formats,
    source,
    license,
    timeline,
    subtotal,
    rushFee,
    total,
    hasCustomQuote,
    setStep,
    resetBuilder,
    saveToUnifiedQuote,
  } = useImageBuilderStore();

  const unifiedStore = useUnifiedQuoteStore();
  const router = useRouter();

  const [expandedCard, setExpandedCard] = useState<ExpandedCard>('image');
  const [showAddServices, setShowAddServices] = useState(false);

  // Save to unified quote on mount
  useEffect(() => {
    saveToUnifiedQuote();
  }, [saveToUnifiedQuote]);

  // Get labels
  const imageTypeLabel = imageTypeOptions.find(t => t.id === imageType)?.label;
  const quantityLabel = quantityOptions.find(q => q.id === quantity)?.label;
  const quantityPrice = quantityOptions.find(q => q.id === quantity)?.price;
  const styleLabel = styleOptions.find(s => s.id === style)?.label;
  const stylePrice = styleOptions.find(s => s.id === style)?.price;
  const creationLabel = creationMethodOptions.find(c => c.id === creation)?.label;
  const creationPrice = creationMethodOptions.find(c => c.id === creation)?.price;
  const editingLabel = editingOptions.find(e => e.id === editing)?.label;
  const editingPrice = editingOptions.find(e => e.id === editing)?.price;
  const backgroundLabel = backgroundOptions.find(b => b.id === background)?.label;
  const backgroundPrice = backgroundOptions.find(b => b.id === background)?.price;
  const overlayLabel = overlayOptions.find(o => o.id === overlay)?.label;
  const overlayPrice = overlayOptions.find(o => o.id === overlay)?.price;
  const sizesLabel = sizeOptions.find(s => s.id === sizes)?.label;
  const sizesPrice = sizeOptions.find(s => s.id === sizes)?.price;
  const revisionsLabel = revisionOptions.find(r => r.id === revisions)?.label;
  const revisionsPrice = revisionOptions.find(r => r.id === revisions)?.price;
  const formatsLabel = formatOptions.find(f => f.id === formats)?.label;
  const formatsPrice = formatOptions.find(f => f.id === formats)?.price;
  const sourceLabel = sourceOptions.find(s => s.id === source)?.label;
  const sourcePrice = sourceOptions.find(s => s.id === source)?.price;
  const licenseLabel = licenseOptions.find(l => l.id === license)?.label;
  const licensePrice = licenseOptions.find(l => l.id === license)?.price;
  const timelineLabel = timelineOptions.find(t => t.id === timeline)?.label;
  const timelineMultiplier = timelineOptions.find(t => t.id === timeline)?.multiplier || 1;

  // Get available services (not yet configured)
  const availableServices = unifiedStore.getAvailableServices().filter(s => s !== 'image');
  const configuredServices = unifiedStore.getAllConfiguredServices();
  const otherServices = configuredServices.filter(s => s.type !== 'image');

  const handleClear = () => {
    // Get remaining services (excluding current service)
    const remainingServices = configuredServices.filter(s => s.type !== 'image');

    // Clear from both builder store and unified quote store
    resetBuilder();
    unifiedStore.clearServiceConfig('image');

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

  const formatPrice = (price: number | null | undefined, prefix: string = '', suffix: string = '') => {
    if (price === null || price === undefined) return <span className="text-[var(--accent-orange)]">Custom Quote</span>;
    if (price === 0) return <span className="text-green-400">Included</span>;
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

  if (showQuoteForm) {
    return <BuilderQuoteForm onBack={() => onCloseQuoteForm?.()} />;
  }

  return (
    <div className="space-y-6">
      {/* Main Image Summary Card */}
      <div className="card p-6">
        {/* Header - Always visible */}
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
            <button
              onClick={() => setStep(1)}
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
              onClick={() => toggleCard('image')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-white hover:border-[var(--accent-blue)] transition-all"
            >
              {expandedCard === 'image' ? (
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
          {expandedCard === 'image' && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="space-y-4 mt-6">
                {/* Image Type */}
                <SummarySection title="Image Type" icon={<Image className="w-5 h-5 text-[var(--accent-blue)]" />} stepNumber={1}>
                  <p className="text-[var(--text-secondary)]">{imageTypeLabel}</p>
                </SummarySection>

                {/* Quantity */}
                <SummarySection title="Quantity" icon={<Layers className="w-5 h-5 text-[var(--accent-blue)]" />} stepNumber={2}>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">{quantityLabel}</span>
                    {formatPrice(quantityPrice)}
                  </div>
                </SummarySection>

                {/* Style */}
                <SummarySection title="Visual Style" icon={<Palette className="w-5 h-5 text-[var(--accent-blue)]" />} stepNumber={3}>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">{styleLabel}</span>
                    {formatPrice(stylePrice)}
                  </div>
                </SummarySection>

                {/* Creation Method */}
                <SummarySection title="Creation Method" icon={<Sparkles className="w-5 h-5 text-[var(--accent-blue)]" />} stepNumber={4}>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">{creationLabel}</span>
                    {formatPrice(creationPrice)}
                  </div>
                </SummarySection>

                {/* Editing Level */}
                <SummarySection title="Editing Level" icon={<Palette className="w-5 h-5 text-[var(--accent-blue)]" />} stepNumber={5}>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">{editingLabel}</span>
                    {formatPrice(editingPrice)}
                  </div>
                </SummarySection>

                {/* Add-ons */}
                <SummarySection title="Add-ons" icon={<Package className="w-5 h-5 text-[var(--accent-blue)]" />} stepNumber={6}>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--text-secondary)]">Background: {backgroundLabel}</span>
                      {backgroundPrice === 0 ? (
                        <span className="text-green-400">Included</span>
                      ) : (
                        <span className="text-white font-medium">+${backgroundPrice}</span>
                      )}
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--text-secondary)]">Overlay: {overlayLabel}</span>
                      {overlayPrice === 0 ? (
                        <span className="text-green-400">Included</span>
                      ) : (
                        <span className="text-white font-medium">+${overlayPrice}</span>
                      )}
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--text-secondary)]">Sizes: {sizesLabel}</span>
                      {sizesPrice === 0 ? (
                        <span className="text-green-400">Included</span>
                      ) : (
                        <span className="text-white font-medium">+${sizesPrice}</span>
                      )}
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--text-secondary)]">Revisions: {revisionsLabel}</span>
                      {revisionsPrice === 0 ? (
                        <span className="text-green-400">Included</span>
                      ) : (
                        <span className="text-white font-medium">+${revisionsPrice}</span>
                      )}
                    </div>
                  </div>
                </SummarySection>

                {/* Deliverables */}
                <SummarySection title="Deliverables" icon={<FileImage className="w-5 h-5 text-[var(--accent-blue)]" />} stepNumber={7}>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--text-secondary)]">Formats: {formatsLabel}</span>
                      {formatsPrice === 0 ? (
                        <span className="text-green-400">Included</span>
                      ) : (
                        <span className="text-white font-medium">+${formatsPrice}</span>
                      )}
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--text-secondary)]">Source Files: {sourceLabel}</span>
                      {sourcePrice === 0 ? (
                        <span className="text-green-400">Included</span>
                      ) : (
                        <span className="text-white font-medium">+${sourcePrice}</span>
                      )}
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--text-secondary)]">License: {licenseLabel}</span>
                      {licensePrice === 0 ? (
                        <span className="text-green-400">Included</span>
                      ) : (
                        <span className="text-white font-medium">+${licensePrice}</span>
                      )}
                    </div>
                  </div>
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
              <div className="space-y-2 mb-3 pb-3 border-b border-[var(--border-subtle)]">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--text-secondary)]">Subtotal</span>
                  <span className="text-white">${subtotal.toLocaleString()}</span>
                </div>
                {rushFee > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--text-secondary)]">Rush Fee</span>
                    <span className="text-[var(--accent-orange)]">+${rushFee.toLocaleString()}</span>
                  </div>
                )}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white font-semibold">Total</span>
                <motion.span
                  key={total}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  className="text-2xl font-bold gradient-text"
                >
                  ${total.toLocaleString()}
                </motion.span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Other Configured Services - Website */}
      {otherServices.filter(s => s.type === 'website').map((service) => {
        const isOpen = expandedCard === 'website';
        const config = service.config as WebsiteConfig;
        const projectTypeLabel = projectTypes.find(p => p.id === config.projectType)?.label;
        const websiteTimelineLabel = websiteTimelineOptions.find(t => t.id === config.timeline)?.label;

        return (
          <div key={service.type} className="card p-6">
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
                        <span className="text-[var(--text-secondary)]">{websiteTimelineLabel}</span>
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
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-white font-semibold">One-time Total</span>
                    <span className="text-2xl font-bold gradient-text">
                      ${config.total.toLocaleString()}
                    </span>
                  </div>
                  {config.monthlyRecurring > 0 && (
                    <div className="flex justify-between items-center mt-2 pt-2 border-t border-[var(--border-subtle)]">
                      <span className="text-white font-semibold">Monthly Total</span>
                      <span className="text-lg font-semibold text-[var(--accent-teal)]">${config.monthlyRecurring}/mo</span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        );
      })}

      {/* Other Configured Services - App */}
      {otherServices.filter(s => s.type === 'app').map((service) => {
        const isOpen = expandedCard === 'app';
        const config = service.config as AppConfig;
        const appTypeLabel = appTypes.find(t => t.id === config.appType)?.label;
        const appTimelineLabel = appTimelineOptions.find(t => t.id === config.timeline)?.label;

        return (
          <div key={service.type} className="card p-6">
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
                        <span className="text-[var(--text-secondary)]">{appTimelineLabel}</span>
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
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-white font-semibold">One-time Total</span>
                    <span className="text-2xl font-bold gradient-text">
                      ${config.oneTimeTotal.toLocaleString()}
                    </span>
                  </div>
                  {config.monthlyTotal > 0 && (
                    <div className="flex justify-between items-center mt-2 pt-2 border-t border-[var(--border-subtle)]">
                      <span className="text-white font-semibold">Monthly Total</span>
                      <span className="text-lg font-semibold text-[var(--accent-teal)]">${config.monthlyTotal}/mo</span>
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
        const goalLabel = socialGoalOptions.find(g => g.id === config.managementGoal)?.label;
        const durationLabel = socialDurationOptions.find(d => d.id === config.duration)?.label;

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
                  onClick={() => setExpandedCard(isOpen ? null : 'social-media')}
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
                        <Clock className="w-5 h-5 text-[var(--accent-blue)]" />
                        <h3 className="font-medium text-white">Duration</h3>
                      </div>
                      <p className="text-[var(--text-secondary)]">{durationLabel}</p>
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
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-teal)] flex items-center justify-center">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-semibold text-white font-serif">Email Marketing Quote Summary</h2>
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
                    Professional brand identity design
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
                  onClick={() => toggleCard('visual-identity' as ExpandedCard)}
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
                        <h3 className="font-medium text-white">Investment Amount</h3>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--text-secondary)]">Total Investment</span>
                        {formatPrice(config.totalInvestment)}
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
                        {serviceType === 'website' ? (
                          <Globe className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent-blue)]" />
                        ) : serviceType === 'app' ? (
                          <Smartphone className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent-blue)]" />
                        ) : serviceType === 'animation' ? (
                          <Film className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent-blue)]" />
                        ) : serviceType === 'social-media' ? (
                          <Share2 className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent-blue)]" />
                        ) : serviceType === 'sound' ? (
                          <Music className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent-blue)]" />
                        ) : serviceType === 'paid-media' ? (
                          <Megaphone className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent-blue)]" />
                        ) : serviceType === 'email-marketing' ? (
                          <Mail className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent-blue)]" />
                        ) : serviceType === 'brand-strategy' ? (
                          <Target className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent-blue)]" />
                        ) : serviceType === 'visual-identity' ? (
                          <Palette className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent-blue)]" />
                        ) : (
                          <Image className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent-blue)]" />
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
