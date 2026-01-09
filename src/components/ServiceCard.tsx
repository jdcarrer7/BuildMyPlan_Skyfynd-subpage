'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Service } from '@/data/services';
import { usePlanStore } from '@/hooks/usePlanStore';
import { Check, Plus, Minus, ChevronDown, ChevronUp, Star, LayoutGrid, Wrench, Smartphone, Film, Image, Music, Megaphone, Share2, Mail, Target, Palette, Layers, FileText, PenTool, Globe, Sparkles, Zap } from 'lucide-react';
import Link from 'next/link';
import ComparisonModal from './ComparisonModal';

interface ServiceCardProps {
  service: Service;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onScrollToCard?: () => void;
}

export default function ServiceCard({ service, isExpanded, onToggleExpand, onScrollToCard }: ServiceCardProps) {
  const [selectedTier, setSelectedTier] = useState<'essential' | 'pro' | 'enterprise'>('pro');
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);

  const { addItem, removeItem, isServiceInPlan, getItemByServiceId, toggleAddOn } = usePlanStore();

  const isInPlan = isServiceInPlan(service.id);
  const planItem = getItemByServiceId(service.id);
  const currentTier = service.tiers.find(t => t.id === (planItem?.tierId || selectedTier));

  const handleAddToPlan = () => {
    if (isInPlan) {
      removeItem(service.id);
    } else {
      addItem(service.id, selectedTier);
      // Scroll the card to the top of the viewport when adding
      onScrollToCard?.();
    }
  };

  const handleTierSelect = (tierId: 'essential' | 'pro' | 'enterprise') => {
    setSelectedTier(tierId);
    if (isInPlan) {
      addItem(service.id, tierId);
    }
    // Scroll the card to the top of the viewport
    onScrollToCard?.();
  };

  // Check if this service has a custom builder
  const hasCustomBuilder = ['websites', 'app-creation', 'animations', 'images', 'ringtones', 'paid-media', 'social-media', 'email-marketing', 'brand-strategy', 'visual-identity', 'brand-applications', 'content-strategy', 'copywriting'].includes(service.id);

  // Service icon and color mapping (matching SkyFynd nav bar style)
  const serviceIconMap: Record<string, { icon: React.ReactNode; color: string }> = {
    'websites': { icon: <Globe className="w-5 h-5" />, color: '#3B82F6' }, // Blue
    'app-creation': { icon: <Smartphone className="w-5 h-5" />, color: '#8B5CF6' }, // Purple
    'animations': { icon: <Film className="w-5 h-5" />, color: '#EC4899' }, // Pink
    'images': { icon: <Image className="w-5 h-5" />, color: '#F59E0B' }, // Amber
    'ringtones': { icon: <Music className="w-5 h-5" />, color: '#10B981' }, // Emerald
    'paid-media': { icon: <Megaphone className="w-5 h-5" />, color: '#22C55E' }, // Green
    'social-media': { icon: <Share2 className="w-5 h-5" />, color: '#06B6D4' }, // Cyan
    'email-marketing': { icon: <Mail className="w-5 h-5" />, color: '#F97316' }, // Orange
    'brand-strategy': { icon: <Target className="w-5 h-5" />, color: '#EF4444' }, // Red
    'visual-identity': { icon: <Palette className="w-5 h-5" />, color: '#F59E0B' }, // Amber/Orange
    'brand-applications': { icon: <Layers className="w-5 h-5" />, color: '#A855F7' }, // Purple
    'content-strategy': { icon: <FileText className="w-5 h-5" />, color: '#14B8A6' }, // Teal
    'copywriting': { icon: <PenTool className="w-5 h-5" />, color: '#6366F1' }, // Indigo
  };

  const serviceIcon = serviceIconMap[service.id];

  return (
    <motion.div
      layout
      onClick={onScrollToCard}
      className={`
        relative overflow-hidden rounded-2xl p-6 lg:p-7 w-full h-full cursor-pointer
        transition-all duration-500 ease-out flex flex-col
        ${isInPlan
          ? 'bg-gradient-to-br from-[var(--bg-card-hover)] to-[var(--bg-card)] border-2 border-[var(--accent-orange)]/40 shadow-[0_0_40px_rgba(212,165,116,0.12)]'
          : 'bg-gradient-to-br from-[var(--bg-card)] to-[var(--bg-card-hover)]/50 border border-[var(--border-subtle)] hover:border-[var(--border-accent)] hover:shadow-[var(--shadow-glow)]'
        }
      `}
    >
      {/* Subtle glow effect when in plan */}
      {isInPlan && (
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-orange)]/5 to-transparent pointer-events-none" />
      )}

      {/* Header */}
      <div className="relative mb-5">
        <div className="flex items-center gap-3 mb-2.5">
          {serviceIcon && (
            <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-[var(--accent-purple)]/20 text-[var(--accent-purple)]">
              {serviceIcon.icon}
            </div>
          )}
          <h3 className="font-serif" style={{ fontSize: '24px', fontWeight: 600, lineHeight: 1.25, letterSpacing: '-0.01em', color: '#FAFAFA' }}>{service.name}</h3>
          {isInPlan && (
            <span className="px-2.5 py-1 bg-gradient-to-r from-[var(--accent-orange)] to-[var(--accent-gold)] text-[#09090b] text-[10px] font-semibold rounded-full uppercase tracking-wide">
              In Plan
            </span>
          )}
        </div>
        <p className="min-h-[45px]" style={{ fontSize: '15px', color: '#A1A1AA', lineHeight: 1.5 }}>
          {service.description}
        </p>
      </div>

      {/* Tier Selection - Always 3 columns for tiers */}
      <div className="grid grid-cols-3 gap-3 mb-4 pt-3">
        {service.tiers.map((tier) => {
          const isSelected = (planItem?.tierId || selectedTier) === tier.id;
          return (
            <button
              key={tier.id}
              onClick={() => handleTierSelect(tier.id)}
              className={`
                relative px-2 py-4 rounded-xl text-center transition-all duration-300 flex flex-col items-center justify-center h-[90px]
                ${isSelected
                  ? 'text-white bg-gradient-to-br from-[var(--accent-purple)]/50 to-[var(--accent-pink)]/30 shadow-[0_4px_20px_rgba(139,92,246,0.3)] border border-[var(--accent-purple)]/60'
                  : 'bg-[var(--bg-secondary)]/60 text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-white border border-[var(--border-subtle)] hover:border-[var(--border-accent)]'
                }
              `}
            >
              {tier.popular && (
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2 py-0.5 text-[8px] font-bold rounded-full uppercase tracking-wider shadow-sm whitespace-nowrap bg-gradient-to-r from-[var(--accent-purple)] to-[var(--accent-pink)] text-[#09090b]">
                  <Star className="w-2 h-2" fill="currentColor" />
                  Popular
                </div>
              )}
              <div className="text-base font-semibold tracking-wide leading-tight">{tier.name}</div>
              <div className="text-[10px] opacity-60 uppercase tracking-wider mt-1 whitespace-nowrap">starting at</div>
              <div className="text-xl font-bold mt-1">${tier.price.toLocaleString()}</div>
            </button>
          );
        })}
      </div>

      {/* Build My Button - Fixed height container for alignment */}
      <div className="h-[52px] mb-5">
        {(() => {
          const builderConfig: Record<string, { href: string; label: string }> = {
            'websites': { href: '/build-my-site', label: 'Build My Site' },
            'app-creation': { href: '/build-my-app', label: 'Build My App' },
            'animations': { href: '/build-my-animation', label: 'Build My Animation' },
            'images': { href: '/build-my-images', label: 'Build My Images' },
            'ringtones': { href: '/build-my-sound', label: 'Build My Sound' },
            'paid-media': { href: '/build-my-media', label: 'Build My Media' },
            'social-media': { href: '/build-my-social', label: 'Build My Social' },
            'email-marketing': { href: '/build-my-email', label: 'Build My Email' },
            'brand-strategy': { href: '/build-my-brand-strategy', label: 'Build My Strategy' },
            'visual-identity': { href: '/build-my-identity', label: 'Build My Identity' },
            'brand-applications': { href: '/build-my-applications', label: 'Build My Apps' },
            'content-strategy': { href: '/build-my-content-strategy', label: 'Build My Content' },
            'copywriting': { href: '/build-my-messaging', label: 'Build My Messaging' },
          };

          const config = builderConfig[service.id];

          if (!config || !serviceIcon) return null;

          return (
            <Link
              href={config.href}
              className="flex items-center justify-center gap-3 w-full h-full px-4 py-3 rounded-xl transition-all duration-300 bg-gradient-to-r from-[var(--accent-purple)]/50 to-[var(--accent-pink)]/50 text-white border border-[var(--accent-purple)]/40 hover:shadow-[0_4px_24px_rgba(139,92,246,0.3)] hover:from-[var(--accent-purple)]/60 hover:to-[var(--accent-pink)]/60 group"
            >
              <span className="transition-transform group-hover:scale-110 text-[var(--accent-purple)]">
                {serviceIcon.icon}
              </span>
              <span className="text-sm font-bold">{config.label}</span>
            </Link>
          );
        })()}
      </div>

      {/* Current Tier Info - Fixed height for alignment */}
      <div className="mb-5 p-4 bg-[var(--bg-secondary)]/40 rounded-xl border border-[var(--border-subtle)] min-h-[100px] flex flex-col justify-center gap-3">
        {currentTier && (
          <>
            <div className="space-y-1.5">
              <span className="text-[var(--text-muted)] text-[10px] uppercase tracking-wider font-medium">Best for</span>
              <p className="text-sm text-[var(--text-primary)] leading-relaxed">{currentTier.bestFor}</p>
            </div>
            <div className="space-y-1.5">
              <span className="text-[var(--text-muted)] text-[10px] uppercase tracking-wider font-medium">Outcome</span>
              <p className="text-sm text-[var(--accent-purple)] font-medium leading-relaxed">{currentTier.outcome}</p>
            </div>
          </>
        )}
      </div>

      {/* Action Buttons - Aligned with equal heights */}
      <div className="grid grid-cols-[1fr_auto_auto] gap-3 items-stretch mt-auto">
        <motion.button
          onClick={handleAddToPlan}
          className={`
            flex items-center justify-center gap-3 h-12 px-6 rounded-xl font-medium transition-all duration-300 whitespace-nowrap
            ${isInPlan
              ? 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/15 hover:border-red-500/30'
              : 'btn-primary !py-0'
            }
          `}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          {isInPlan ? (
            <>
              <Minus className="w-4 h-4" />
              Remove
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              Add to Plan
            </>
          )}
        </motion.button>

        <button
          onClick={() => setIsComparisonOpen(true)}
          className="h-12 px-4 rounded-xl border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--border-accent)] hover:text-white hover:bg-[var(--bg-secondary)]/30 transition-all duration-300 flex items-center justify-center gap-2"
          title="Compare Plans"
        >
          <LayoutGrid className="w-4 h-4" />
          <span className="hidden sm:inline text-sm">Compare</span>
        </button>

        <button
          onClick={onToggleExpand}
          className="h-12 w-12 rounded-xl border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--border-accent)] hover:text-white hover:bg-[var(--bg-secondary)]/30 transition-all duration-300 flex items-center justify-center"
        >
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Expanded Features - Refined */}
      <AnimatePresence>
        {isExpanded && currentTier && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="pt-5 mt-5 border-t border-[var(--border-subtle)]">
              <h4 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-4">Features Included</h4>
              <ul className="space-y-2.5">
                {currentTier.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm">
                    <span className={`mt-0.5 ${feature.included === true ? 'text-emerald-400' : feature.included === 'addon' ? 'text-[var(--accent-orange)]' : 'text-[var(--text-muted)]'}`}>
                      {feature.included === true ? (
                        <Check className="w-4 h-4" />
                      ) : feature.included === 'addon' ? (
                        <Plus className="w-4 h-4" />
                      ) : (
                        <Minus className="w-4 h-4" />
                      )}
                    </span>
                    <span className="text-[var(--text-secondary)]">
                      <span className="text-white font-medium">{feature.name}:</span>{' '}
                      {typeof feature.value === 'boolean'
                        ? (feature.value ? 'Included' : 'Not included')
                        : feature.value
                      }
                    </span>
                  </li>
                ))}
              </ul>

              {/* Add-ons - Refined */}
              {service.addOns.length > 0 && isInPlan && (
                <div className="mt-5 pt-5 border-t border-[var(--border-subtle)]">
                  <h4 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-4">Available Add-ons</h4>
                  <div className="space-y-2">
                    {service.addOns.map((addOn) => {
                      const isAdded = planItem?.addOns.includes(addOn.id);
                      return (
                        <button
                          key={addOn.id}
                          onClick={() => toggleAddOn(service.id, addOn.id)}
                          className={`
                            w-full flex items-center justify-between p-3.5 rounded-xl transition-all duration-300
                            ${isAdded
                              ? 'bg-[var(--accent-orange)]/10 border border-[var(--accent-orange)]/30'
                              : 'bg-[var(--bg-secondary)]/40 border border-[var(--border-subtle)] hover:border-[var(--border-accent)] hover:bg-[var(--bg-secondary)]/60'
                            }
                          `}
                        >
                          <span className="flex items-center gap-3">
                            {isAdded ? (
                              <Check className="w-4 h-4 text-[var(--accent-orange)]" />
                            ) : (
                              <Plus className="w-4 h-4 text-[var(--text-muted)]" />
                            )}
                            <span className={isAdded ? 'text-white font-medium' : 'text-[var(--text-secondary)]'}>
                              {addOn.name}
                            </span>
                          </span>
                          <span className="text-[var(--accent-purple)] font-semibold">
                            +${addOn.price}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comparison Modal */}
      <ComparisonModal
        service={service}
        isOpen={isComparisonOpen}
        onClose={() => setIsComparisonOpen(false)}
      />
    </motion.div>
  );
}
