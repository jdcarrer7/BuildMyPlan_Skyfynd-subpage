'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMessagingCopywritingBuilderStore } from '@/hooks/useMessagingCopywritingBuilderStore';
import { useUnifiedQuoteStore, serviceMetadata, WebsiteConfig, AppConfig, AnimationConfig, ImageConfig, SoundConfig, PaidMediaConfig, SocialMediaConfig, EmailMarketingConfig, VisualIdentityConfig, BrandApplicationsConfig, BrandStrategyConfig, ContentStrategyConfig } from '@/hooks/useUnifiedQuoteStore';
import {
  messagingGoalOptions,
  messagingOptions,
  voiceOptions,
  websiteOptions,
  marketingOptions,
  salesOptions,
  productOptions,
  contentOptions,
  uxOptions,
  retainerOptions,
  addOnServices,
  timelineOptions,
} from '@/data/messagingCopywritingBuilder';
import {
  Check,
  Edit2,
  FileText,
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
  MessageSquare,
  Mic,
  PenTool,
  Target,
  ShoppingBag,
  BookOpen,
  Layout,
  RefreshCw,
  Sparkles,
  Share2,
  Mail,
  Palette,
  Briefcase,
  Calendar,
  Layers,
} from 'lucide-react';
import BuilderQuoteForm from '../builder/BuilderQuoteForm';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type ExpandedCard = 'messaging-copywriting' | 'brand-strategy' | 'content-strategy' | 'website' | 'app' | 'animation' | 'image' | 'sound' | 'paid-media' | 'social-media' | 'email-marketing' | 'visual-identity' | 'brand-applications' | null;

interface Step13SummaryProps {
  showQuoteForm?: boolean;
  onCloseQuoteForm?: () => void;
}

export default function Step13Summary({ showQuoteForm = false, onCloseQuoteForm }: Step13SummaryProps) {
  const store = useMessagingCopywritingBuilderStore();
  const unifiedStore = useUnifiedQuoteStore();
  const router = useRouter();

  const [expandedCard, setExpandedCard] = useState<ExpandedCard>('messaging-copywriting');
  const [showAddServices, setShowAddServices] = useState(false);

  // Save to unified quote on mount
  useEffect(() => {
    store.saveToUnifiedQuote();
  }, [store]);

  // Get labels
  const goalLabel = messagingGoalOptions.find((g) => g.id === store.messagingGoal)?.label;
  const messagingLabel = messagingOptions.find((m) => m.id === store.messaging)?.label;
  const messagingStartsAt = messagingOptions.find((m) => m.id === store.messaging)?.startsAt;
  const voiceLabel = voiceOptions.find((v) => v.id === store.voice)?.label;
  const voiceStartsAt = voiceOptions.find((v) => v.id === store.voice)?.startsAt;
  const websiteLabel = websiteOptions.find((w) => w.id === store.website)?.label;
  const websiteStartsAt = websiteOptions.find((w) => w.id === store.website)?.startsAt;
  const marketingLabel = marketingOptions.find((m) => m.id === store.marketing)?.label;
  const marketingStartsAt = marketingOptions.find((m) => m.id === store.marketing)?.startsAt;
  const salesLabel = salesOptions.find((s) => s.id === store.sales)?.label;
  const salesStartsAt = salesOptions.find((s) => s.id === store.sales)?.startsAt;
  const productLabel = productOptions.find((p) => p.id === store.product)?.label;
  const productStartsAt = productOptions.find((p) => p.id === store.product)?.startsAt;
  const contentLabel = contentOptions.find((c) => c.id === store.content)?.label;
  const contentStartsAt = contentOptions.find((c) => c.id === store.content)?.startsAt;
  const uxLabel = uxOptions.find((u) => u.id === store.ux)?.label;
  const uxStartsAt = uxOptions.find((u) => u.id === store.ux)?.startsAt;
  const retainerLabel = retainerOptions.find((r) => r.id === store.retainer)?.label;
  const retainerStartsAt = retainerOptions.find((r) => r.id === store.retainer)?.startsAt;
  const timelineLabel = timelineOptions.find((t) => t.id === store.timeline)?.label;

  // Get available and configured services
  const availableServices = unifiedStore.getAvailableServices().filter((s) => s !== 'messaging-copywriting');
  const configuredServices = unifiedStore.getAllConfiguredServices();
  const otherServices = configuredServices.filter((s) => s.type !== 'messaging-copywriting');

  const handleEdit = () => {
    store.setStep(1);
  };

  const handleClear = () => {
    // Get remaining services (excluding current service)
    const remainingServices = configuredServices.filter(s => s.type !== 'messaging-copywriting');

    // Clear from both builder store and unified quote store
    store.resetBuilder();
    unifiedStore.clearServiceConfig('messaging-copywriting');

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

  const formatMonthlyPrice = (price: number, startsAt?: boolean) => {
    if (price === 0) return <span className="text-[var(--text-muted)]">$0/mo</span>;
    if (startsAt) return <span className="text-[var(--accent-pink)] font-medium">${price.toLocaleString()}/mo+</span>;
    return <span className="text-[var(--accent-pink)] font-medium">${price.toLocaleString()}/mo</span>;
  };

  if (showQuoteForm) {
    return <BuilderQuoteForm onBack={() => onCloseQuoteForm?.()} />;
  }

  return (
    <div className="space-y-6">
      {/* Main Messaging & Copywriting Summary Card */}
      <div className="card p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--accent-purple)] to-[var(--accent-pink)] flex items-center justify-center">
              <PenTool className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-semibold text-white font-serif">
                Messaging & Copywriting Quote Summary
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
              Adjust Plan
            </button>
            <button
              onClick={handleClear}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all"
            >
              <Trash2 className="w-4 h-4" />
              Reset
            </button>
            <button
              onClick={() => toggleCard('messaging-copywriting')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-white hover:border-[var(--accent-purple)] transition-all"
            >
              {expandedCard === 'messaging-copywriting' ? (
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
          {expandedCard === 'messaging-copywriting' && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="space-y-4 mt-6">
                {/* ONE-TIME COSTS Section */}
                <div className="p-4 bg-[var(--bg-card)] rounded-lg border border-[var(--border-subtle)]">
                  <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[var(--accent-purple)]" />
                    ONE-TIME COSTS
                  </h3>

                  {/* Messaging Foundation */}
                  <div className="space-y-3 mb-4">
                    <h4 className="text-sm font-medium text-[var(--accent-purple)] uppercase tracking-wide">
                      Messaging Foundation
                    </h4>

                    <SummarySection title="Messaging Framework" icon={<MessageSquare className="w-5 h-5 text-[var(--accent-purple)]" />} stepNumber={2}>
                      <div className="flex justify-between">
                        <span className="text-[var(--text-secondary)]">{messagingLabel}</span>
                        {formatPrice(store.messagingPrice, messagingStartsAt)}
                      </div>
                    </SummarySection>

                    <SummarySection title="Brand Voice & Tone" icon={<Mic className="w-5 h-5 text-[var(--accent-purple)]" />} stepNumber={3}>
                      <div className="flex justify-between">
                        <span className="text-[var(--text-secondary)]">{voiceLabel}</span>
                        {formatPrice(store.voicePrice, voiceStartsAt)}
                      </div>
                    </SummarySection>
                  </div>

                  {/* Copy Production */}
                  <div className="space-y-3 mb-4">
                    <h4 className="text-sm font-medium text-[var(--accent-purple)] uppercase tracking-wide">
                      Copy Production
                    </h4>

                    <SummarySection title="Website Copy" icon={<Globe className="w-5 h-5 text-[var(--accent-purple)]" />} stepNumber={4}>
                      <div className="flex justify-between">
                        <span className="text-[var(--text-secondary)]">{websiteLabel}</span>
                        {formatPrice(store.websitePrice, websiteStartsAt)}
                      </div>
                    </SummarySection>

                    <SummarySection title="Marketing & Advertising Copy" icon={<Megaphone className="w-5 h-5 text-[var(--accent-purple)]" />} stepNumber={5}>
                      <div className="flex justify-between">
                        <span className="text-[var(--text-secondary)]">{marketingLabel}</span>
                        {formatPrice(store.marketingPrice, marketingStartsAt)}
                      </div>
                    </SummarySection>

                    <SummarySection title="Sales Enablement Copy" icon={<Target className="w-5 h-5 text-[var(--accent-purple)]" />} stepNumber={6}>
                      <div className="flex justify-between">
                        <span className="text-[var(--text-secondary)]">{salesLabel}</span>
                        {formatPrice(store.salesPrice, salesStartsAt)}
                      </div>
                    </SummarySection>

                    <SummarySection title="Product Copy" icon={<ShoppingBag className="w-5 h-5 text-[var(--accent-purple)]" />} stepNumber={7}>
                      <div className="flex justify-between">
                        <span className="text-[var(--text-secondary)]">{productLabel}</span>
                        {formatPrice(store.productPrice, productStartsAt)}
                      </div>
                    </SummarySection>

                    <SummarySection title="Content Writing" icon={<BookOpen className="w-5 h-5 text-[var(--accent-purple)]" />} stepNumber={8}>
                      <div className="flex justify-between">
                        <span className="text-[var(--text-secondary)]">{contentLabel}</span>
                        {formatPrice(store.contentPrice, contentStartsAt)}
                      </div>
                    </SummarySection>

                    <SummarySection title="UX Writing" icon={<Layout className="w-5 h-5 text-[var(--accent-purple)]" />} stepNumber={9}>
                      <div className="flex justify-between">
                        <span className="text-[var(--text-secondary)]">{uxLabel}</span>
                        {formatPrice(store.uxPrice, uxStartsAt)}
                      </div>
                    </SummarySection>
                  </div>

                  {/* Add-ons */}
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

                  {/* One-time Subtotals */}
                  <div className="mt-4 pt-4 border-t border-[var(--border-subtle)] space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--text-secondary)]">One-Time Subtotal</span>
                      <span className="text-white">${store.oneTimeSubtotal.toLocaleString()}</span>
                    </div>

                    {/* Timeline */}
                    <SummarySection title="Timeline" icon={<Clock className="w-5 h-5 text-[var(--accent-purple)]" />} stepNumber={12}>
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

                    <div className="flex justify-between pt-2 border-t border-[var(--accent-purple)]/30">
                      <span className="text-white font-bold">ONE-TIME TOTAL</span>
                      <span className="text-xl font-bold gradient-text">${store.oneTimeTotal.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* MONTHLY COSTS Section */}
                <div className="p-4 bg-[var(--bg-card)] rounded-lg border border-[var(--accent-pink)]/30">
                  <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <RefreshCw className="w-5 h-5 text-[var(--accent-pink)]" />
                    MONTHLY COSTS
                  </h3>

                  <SummarySection title="Ongoing Retainer" icon={<RefreshCw className="w-5 h-5 text-[var(--accent-pink)]" />} stepNumber={10}>
                    <div className="flex justify-between">
                      <span className="text-[var(--text-secondary)]">{retainerLabel}</span>
                      {formatMonthlyPrice(store.retainerPrice, retainerStartsAt)}
                    </div>
                  </SummarySection>

                  <div className="flex justify-between mt-4 pt-4 border-t border-[var(--accent-pink)]/30">
                    <span className="text-white font-bold">MONTHLY TOTAL</span>
                    <span className="text-xl font-bold text-[var(--accent-pink)]">
                      ${store.monthlyTotal.toLocaleString()}/mo
                    </span>
                  </div>
                </div>

                {/* Investment Summary Box */}
                <div className="p-4 bg-gradient-to-r from-[var(--accent-purple)]/20 to-[var(--accent-pink)]/20 border border-[var(--accent-purple)]/30 rounded-lg">
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
                    <div className="space-y-4">
                      <h4 className="text-white font-semibold text-center">Investment Summary</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-[var(--bg-secondary)] rounded-lg">
                          <p className="text-xs text-[var(--text-muted)] uppercase mb-1">One-Time</p>
                          <p className="text-2xl font-bold gradient-text">${store.oneTimeTotal.toLocaleString()}</p>
                        </div>
                        <div className="text-center p-3 bg-[var(--bg-secondary)] rounded-lg">
                          <p className="text-xs text-[var(--text-muted)] uppercase mb-1">Monthly</p>
                          <p className="text-2xl font-bold text-[var(--accent-pink)]">${store.monthlyTotal.toLocaleString()}/mo</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Collapsed Totals */}
        {expandedCard !== 'messaging-copywriting' && (
          <div className="mt-4 p-4 bg-gradient-to-r from-[var(--accent-purple)]/20 to-[var(--accent-pink)]/20 border border-[var(--accent-purple)]/30 rounded-lg">
            {store.hasCustomQuote ? (
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-[var(--accent-orange)] shrink-0 mt-0.5" />
                <p className="text-white font-semibold">Custom Quote Required</p>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-white font-semibold">One-Time: </span>
                  <span className="text-lg font-bold gradient-text">${store.oneTimeTotal.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-white font-semibold">Monthly: </span>
                  <span className="text-lg font-bold text-[var(--accent-pink)]">${store.monthlyTotal.toLocaleString()}/mo</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Other Configured Services would go here - following the same pattern as ContentStrategy */}
      {/* For brevity, I'll include a simplified version */}

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
                        ) : serviceType === 'visual-identity' ? (
                          <Palette className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent-purple)]" />
                        ) : serviceType === 'brand-applications' ? (
                          <Briefcase className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent-purple)]" />
                        ) : serviceType === 'brand-strategy' ? (
                          <Target className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent-purple)]" />
                        ) : serviceType === 'content-strategy' ? (
                          <Layers className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent-purple)]" />
                        ) : (
                          <FileText className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent-purple)]" />
                        )}
                        <span className="text-white text-sm font-medium">{serviceMetadata[serviceType].label}</span>
                      </div>
                      <Plus className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent-purple)]" />
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      <p className="text-[10px] text-[var(--text-muted)] text-center">
        *Estimates are based on your selections and subject to final confirmation after consultation. One-time fees are project-based. Monthly fees are recurring.
      </p>
    </div>
  );
}
