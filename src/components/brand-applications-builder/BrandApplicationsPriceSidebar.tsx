'use client';

import { motion } from 'framer-motion';
import { useBrandApplicationsBuilderStore } from '@/hooks/useBrandApplicationsBuilderStore';
import {
  applicationGoalOptions,
  stationeryOptions,
  digitalOptions,
  socialOptions,
  presentationOptions,
  marketingOptions,
  signageOptions,
  packagingOptions,
  eventsOptions,
  timelineOptions,
} from '@/data/brandApplicationsBuilder';
import { Calculator, AlertCircle, TrendingUp, ArrowRight, FileText, Globe, Megaphone, MapPin, Package, Sparkles } from 'lucide-react';

interface BrandApplicationsPriceSidebarProps {
  currentStep: number;
  onGoToSummary: () => void;
}

export default function BrandApplicationsPriceSidebar({ currentStep, onGoToSummary }: BrandApplicationsPriceSidebarProps) {
  const {
    applicationGoal,
    stationery,
    stationeryPrice,
    digital,
    digitalPrice,
    social,
    socialPrice,
    presentations,
    presentationsPrice,
    marketing,
    marketingPrice,
    signage,
    signagePrice,
    packaging,
    packagingPrice,
    events,
    eventsPrice,
    selectedAddOns,
    timeline,
    timelineMultiplier,
    businessEssentialsSubtotal,
    digitalSocialSubtotal,
    marketingSubtotal,
    physicalSubtotal,
    addOnsTotal,
    projectSubtotal,
    timelinePremium,
    totalInvestment,
    hasCustomQuote,
  } = useBrandApplicationsBuilderStore();

  // Get labels
  const goalLabel = applicationGoalOptions.find((g) => g.id === applicationGoal)?.label;
  const stationeryLabel = stationeryOptions.find((s) => s.id === stationery)?.label;
  const digitalLabel = digitalOptions.find((d) => d.id === digital)?.label;
  const socialLabel = socialOptions.find((s) => s.id === social)?.label;
  const presentationsLabel = presentationOptions.find((p) => p.id === presentations)?.label;
  const marketingLabel = marketingOptions.find((m) => m.id === marketing)?.label;
  const signageLabel = signageOptions.find((s) => s.id === signage)?.label;
  const packagingLabel = packagingOptions.find((p) => p.id === packaging)?.label;
  const eventsLabel = eventsOptions.find((e) => e.id === events)?.label;
  const timelineLabel = timelineOptions.find((t) => t.id === timeline)?.label;

  // Calculate timeline premium percentage
  const premiumPercent = timelineMultiplier > 1 ? Math.round((timelineMultiplier - 1) * 100) : 0;

  // Check if Business Essentials has any selected items (stationery + presentations)
  const hasBusinessEssentials = (stationery && stationery !== 'none') || (presentations && presentations !== 'none');

  // Check if Digital & Social has any selected items
  const hasDigitalSocial = (digital && digital !== 'none') || (social && social !== 'none');

  // Check if Marketing has any selected items
  const hasMarketing = marketing && marketing !== 'none';

  // Check if Physical Applications has any selected items (signage + packaging + events)
  const hasPhysicalApplications = (signage && signage !== 'none') || (packaging && packaging !== 'none') || (events && events !== 'none');

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="card p-6 sticky top-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <Calculator className="w-5 h-5 text-[var(--accent-blue)]" />
        <h3 className="text-lg font-semibold text-white">Your Estimate</h3>
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

      {/* Selections Summary */}
      <div className="space-y-3 mb-6">
        {applicationGoal && (
          <div className="flex justify-between text-sm">
            <span className="text-[var(--text-muted)]">Goal</span>
            <span className="text-[var(--text-secondary)]">{goalLabel}</span>
          </div>
        )}
      </div>

      {/* Price Breakdown by Category */}
      <div className="border-t border-[var(--border-subtle)] pt-4 space-y-4">

        {/* Business Essentials Section: Stationery + Presentations */}
        {hasBusinessEssentials && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-[var(--accent-blue)]" />
              <span className="text-sm font-medium text-white">Business Essentials</span>
            </div>
            {stationery && stationery !== 'none' && (
              <div className="flex justify-between text-sm pl-6">
                <span className="text-[var(--text-muted)]">Stationery - {stationeryLabel}</span>
                <span className="text-[var(--text-secondary)]">${stationeryPrice.toLocaleString()}</span>
              </div>
            )}
            {presentations && presentations !== 'none' && (
              <div className="flex justify-between text-sm pl-6">
                <span className="text-[var(--text-muted)]">Presentations - {presentationsLabel}</span>
                <span className="text-[var(--text-secondary)]">${presentationsPrice.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-sm pt-1 border-t border-[var(--border-subtle)]/50">
              <span className="text-[var(--text-muted)] pl-6">Subtotal</span>
              <span className="text-white">${businessEssentialsSubtotal.toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* Digital & Social Section: Digital + Social */}
        {hasDigitalSocial && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="w-4 h-4 text-[var(--accent-teal)]" />
              <span className="text-sm font-medium text-white">Digital & Social</span>
            </div>
            {digital && digital !== 'none' && (
              <div className="flex justify-between text-sm pl-6">
                <span className="text-[var(--text-muted)]">Digital - {digitalLabel}</span>
                <span className="text-[var(--text-secondary)]">${digitalPrice.toLocaleString()}</span>
              </div>
            )}
            {social && social !== 'none' && (
              <div className="flex justify-between text-sm pl-6">
                <span className="text-[var(--text-muted)]">Social - {socialLabel}</span>
                <span className="text-[var(--text-secondary)]">${socialPrice.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-sm pt-1 border-t border-[var(--border-subtle)]/50">
              <span className="text-[var(--text-muted)] pl-6">Subtotal</span>
              <span className="text-white">${digitalSocialSubtotal.toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* Marketing Materials Section */}
        {hasMarketing && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <Megaphone className="w-4 h-4 text-[var(--accent-orange)]" />
              <span className="text-sm font-medium text-white">Marketing Materials</span>
            </div>
            <div className="flex justify-between text-sm pl-6">
              <span className="text-[var(--text-muted)]">Marketing - {marketingLabel}</span>
              <span className="text-[var(--text-secondary)]">${marketingPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm pt-1 border-t border-[var(--border-subtle)]/50">
              <span className="text-[var(--text-muted)] pl-6">Subtotal</span>
              <span className="text-white">${marketingSubtotal.toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* Physical Applications Section: Signage + Packaging + Events */}
        {hasPhysicalApplications && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-[var(--accent-blue)]" />
              <span className="text-sm font-medium text-white">Physical Applications</span>
            </div>
            {signage && signage !== 'none' && (
              <div className="flex justify-between text-sm pl-6">
                <span className="text-[var(--text-muted)]">Signage - {signageLabel}</span>
                <span className="text-[var(--text-secondary)]">${signagePrice.toLocaleString()}</span>
              </div>
            )}
            {packaging && packaging !== 'none' && (
              <div className="flex justify-between text-sm pl-6">
                <span className="text-[var(--text-muted)]">Packaging - {packagingLabel}</span>
                <span className="text-[var(--text-secondary)]">${packagingPrice.toLocaleString()}</span>
              </div>
            )}
            {events && events !== 'none' && (
              <div className="flex justify-between text-sm pl-6">
                <span className="text-[var(--text-muted)]">Events - {eventsLabel}</span>
                <span className="text-[var(--text-secondary)]">${eventsPrice.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-sm pt-1 border-t border-[var(--border-subtle)]/50">
              <span className="text-[var(--text-muted)] pl-6">Subtotal</span>
              <span className="text-white">${physicalSubtotal.toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* Add-Ons Section */}
        {selectedAddOns.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-[var(--accent-blue)]" />
              <span className="text-sm font-medium text-white">Add-Ons</span>
            </div>
            <div className="flex justify-between text-sm pl-6">
              <span className="text-[var(--text-muted)]">{selectedAddOns.length} item{selectedAddOns.length > 1 ? 's' : ''} selected</span>
              <span className="text-[var(--text-secondary)]">${addOnsTotal.toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* Timeline Premium */}
        {premiumPercent > 0 && timeline && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[var(--text-muted)]">Timeline - {timelineLabel}</span>
              <span className="text-[var(--accent-orange)]">+{premiumPercent}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[var(--accent-orange)]">Timeline Premium</span>
              <span className="text-[var(--accent-orange)]">+${timelinePremium.toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* Project Subtotal */}
        {projectSubtotal > 0 && (
          <div className="flex justify-between items-center text-sm pt-2 border-t border-[var(--border-subtle)]">
            <span className="text-white font-medium">Project Subtotal</span>
            <span className="text-white">${projectSubtotal.toLocaleString()}</span>
          </div>
        )}

        {/* Total Investment */}
        <div className="pt-3 mt-3 border-t-2 border-[var(--accent-blue)]/50">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-[var(--accent-blue)]" />
            <span className="text-sm text-[var(--text-muted)]">Total Investment</span>
          </div>
          <motion.div
            key={totalInvestment}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            className="text-2xl font-bold gradient-text"
          >
            {hasCustomQuote ? 'Custom Quote' : `$${totalInvestment.toLocaleString()}`}
          </motion.div>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            One-time project investment
          </p>
        </div>
      </div>

      {/* Go to Summary Button */}
      {currentStep < 12 && applicationGoal && stationery && (
        <motion.button
          onClick={onGoToSummary}
          className="w-full mt-6 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--accent-blue)] hover:text-white transition-all"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Go to Summary
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      )}

      <p className="text-[10px] text-[var(--text-muted)] mt-4">
        *Pricing based on your selections. Final quote may vary based on project scope.
      </p>
    </motion.div>
  );
}
