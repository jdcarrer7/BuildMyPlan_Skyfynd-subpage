'use client';

import { motion } from 'framer-motion';
import { useUnifiedQuoteStore, serviceMetadata, WebsiteConfig, AppConfig, AnimationConfig, ImageConfig, SoundConfig, PaidMediaConfig, SocialMediaConfig, EmailMarketingConfig, BrandStrategyConfig, VisualIdentityConfig, BrandApplicationsConfig, ContentStrategyConfig, MessagingCopywritingConfig, ServiceType } from '@/hooks/useUnifiedQuoteStore';
import { Calculator, AlertCircle, Globe, Smartphone, Film, Image, Music, Megaphone, Share2, Mail, Target, Palette, Layers, FileText, PenTool, ArrowLeft, Send } from 'lucide-react';
import Link from 'next/link';

interface CombinedEstimateSidebarProps {
  currentService: ServiceType;
  onRequestQuote?: () => void;
}

export default function CombinedEstimateSidebar({ currentService, onRequestQuote }: CombinedEstimateSidebarProps) {
  const { getAllConfiguredServices, getCombinedTotals } = useUnifiedQuoteStore();

  const configuredServices = getAllConfiguredServices();
  const combinedTotals = getCombinedTotals();
  const isMultipleServices = configuredServices.length > 1;

  // Get service details for breakdown
  const getServiceDetails = (type: ServiceType, config: WebsiteConfig | AppConfig | AnimationConfig | ImageConfig | SoundConfig | PaidMediaConfig | SocialMediaConfig | EmailMarketingConfig | BrandStrategyConfig | VisualIdentityConfig | BrandApplicationsConfig | ContentStrategyConfig | MessagingCopywritingConfig) => {
    if (type === 'website') {
      const websiteConfig = config as WebsiteConfig;
      return {
        label: 'Website',
        icon: Globe,
        oneTime: websiteConfig.total,
        monthly: websiteConfig.monthlyRecurring,
        hasCustomQuote: websiteConfig.hasCustomQuote,
      };
    } else if (type === 'app') {
      const appConfig = config as AppConfig;
      return {
        label: 'App',
        icon: Smartphone,
        oneTime: appConfig.oneTimeTotal,
        monthly: appConfig.monthlyTotal,
        hasCustomQuote: appConfig.hasCustomQuote,
      };
    } else if (type === 'animation') {
      const animationConfig = config as AnimationConfig;
      return {
        label: 'Animation',
        icon: Film,
        oneTime: animationConfig.total,
        monthly: 0,
        hasCustomQuote: animationConfig.hasCustomQuote,
      };
    } else if (type === 'image') {
      const imageConfig = config as ImageConfig;
      return {
        label: 'Images',
        icon: Image,
        oneTime: imageConfig.total,
        monthly: 0,
        hasCustomQuote: imageConfig.hasCustomQuote,
      };
    } else if (type === 'sound') {
      const soundConfig = config as SoundConfig;
      return {
        label: 'Sound',
        icon: Music,
        oneTime: soundConfig.total,
        monthly: 0,
        hasCustomQuote: soundConfig.hasCustomQuote,
      };
    } else if (type === 'paid-media') {
      const paidMediaConfig = config as PaidMediaConfig;
      return {
        label: 'Paid Media',
        icon: Megaphone,
        oneTime: paidMediaConfig.oneTimeTotal,
        monthly: paidMediaConfig.monthlyTotal,
        hasCustomQuote: paidMediaConfig.hasCustomQuote,
      };
    } else if (type === 'social-media') {
      const socialMediaConfig = config as SocialMediaConfig;
      return {
        label: 'Social Media',
        icon: Share2,
        oneTime: socialMediaConfig.oneTimeTotal,
        monthly: socialMediaConfig.monthlyTotal,
        hasCustomQuote: socialMediaConfig.hasCustomQuote,
      };
    } else if (type === 'email-marketing') {
      const emailConfig = config as EmailMarketingConfig;
      return {
        label: 'Email Marketing',
        icon: Mail,
        oneTime: emailConfig.oneTimeTotal,
        monthly: emailConfig.monthlyTotal,
        hasCustomQuote: emailConfig.hasCustomQuote,
      };
    } else if (type === 'visual-identity') {
      const identityConfig = config as VisualIdentityConfig;
      return {
        label: 'Visual Identity',
        icon: Palette,
        oneTime: identityConfig.totalInvestment,
        monthly: 0,
        hasCustomQuote: identityConfig.hasCustomQuote,
      };
    } else if (type === 'brand-applications') {
      const applicationsConfig = config as BrandApplicationsConfig;
      return {
        label: 'Brand Applications',
        icon: Layers,
        oneTime: applicationsConfig.totalInvestment,
        monthly: 0,
        hasCustomQuote: applicationsConfig.hasCustomQuote,
      };
    } else if (type === 'content-strategy') {
      const contentStrategyConfig = config as ContentStrategyConfig;
      return {
        label: 'Content Strategy',
        icon: FileText,
        oneTime: contentStrategyConfig.totalInvestment,
        monthly: 0,
        hasCustomQuote: contentStrategyConfig.hasCustomQuote,
      };
    } else if (type === 'messaging-copywriting') {
      const messagingConfig = config as MessagingCopywritingConfig;
      return {
        label: 'Messaging & Copywriting',
        icon: PenTool,
        oneTime: messagingConfig.oneTimeTotal,
        monthly: messagingConfig.monthlyTotal,
        hasCustomQuote: messagingConfig.hasCustomQuote,
      };
    } else {
      const strategyConfig = config as BrandStrategyConfig;
      return {
        label: 'Brand Strategy',
        icon: Target,
        oneTime: strategyConfig.totalInvestment,
        monthly: 0,
        hasCustomQuote: strategyConfig.hasCustomQuote,
      };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="card p-6 sticky top-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <Calculator className="w-5 h-5 text-[var(--accent-blue)]" />
        <h3 className="text-xl font-semibold text-white">
          {isMultipleServices ? 'Combined Estimate' : 'Total Estimate'}
        </h3>
      </div>

      {combinedTotals.hasCustomQuote && (
        <div className="flex items-start gap-3 p-4 bg-[var(--accent-orange)]/10 border border-[var(--accent-orange)]/30 rounded-lg mb-4">
          <AlertCircle className="w-5 h-5 text-[var(--accent-orange)] shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-white font-medium">Custom Quote Required</p>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Some selections require custom pricing. We&apos;ll provide a detailed quote.
            </p>
          </div>
        </div>
      )}

      {/* Service-by-Service Breakdown */}
      <div className="space-y-4">
        {configuredServices.map((service, index) => {
          const details = getServiceDetails(service.type, service.config);
          const Icon = details.icon;
          const isCurrentService = service.type === currentService;

          return (
            <div key={service.type}>
              {/* Service Section */}
              <div className={`${isCurrentService ? 'bg-[var(--accent-blue)]/10 -mx-2 px-2 py-2 rounded-lg' : ''}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={`w-4 h-4 ${isCurrentService ? 'text-[var(--accent-blue)]' : 'text-[var(--text-muted)]'}`} />
                  <span className={`text-sm font-medium ${isCurrentService ? 'text-white' : 'text-[var(--text-secondary)]'}`}>
                    {details.label}
                  </span>
                </div>

                <div className="space-y-1 pl-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--text-muted)]">One-time Subtotal</span>
                    <span className="text-white">
                      {details.hasCustomQuote ? 'Custom' : `$${details.oneTime.toLocaleString()}`}
                    </span>
                  </div>

                  {details.monthly > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--text-muted)]">Monthly Subtotal</span>
                      <span className="text-[var(--accent-teal)]">
                        ${details.monthly.toLocaleString()}/mo
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Separator between services (not after the last one) */}
              {index < configuredServices.length - 1 && (
                <div className="border-b border-[var(--border-subtle)] my-4" />
              )}
            </div>
          );
        })}
      </div>

      {/* Grand Totals */}
      <div className="mt-6 pt-4 border-t-2 border-[var(--accent-blue)]/50">
        <div className="flex justify-between items-center mb-2">
          <span className="text-white font-bold">One-time Total</span>
          <motion.span
            key={combinedTotals.oneTimeTotal}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            className="text-xl font-bold gradient-text"
          >
            {combinedTotals.hasCustomQuote ? 'Custom' : `$${combinedTotals.oneTimeTotal.toLocaleString()}`}
          </motion.span>
        </div>

        {combinedTotals.monthlyTotal > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-white font-bold">Monthly Total</span>
            <span className="text-lg font-semibold text-[var(--accent-teal)]">
              ${combinedTotals.monthlyTotal.toLocaleString()}/mo
            </span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {onRequestQuote && (
        <div className="mt-6 pt-4 border-t border-[var(--border-subtle)] space-y-3">
          <motion.button
            onClick={onRequestQuote}
            className="w-full btn-primary flex items-center justify-center gap-2 py-3"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Send className="w-4 h-4" />
            Request Quote
          </motion.button>
          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-white hover:bg-[var(--bg-card-hover)] transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Services
          </Link>
        </div>
      )}

      <p className="text-[10px] text-[var(--text-muted)] mt-4">
        *Estimate based on selections. Final price confirmed after consultation.
      </p>
    </motion.div>
  );
}
