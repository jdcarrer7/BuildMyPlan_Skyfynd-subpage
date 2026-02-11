'use client';

import { motion } from 'framer-motion';
import { useAIReceptionistBuilderStore } from '@/hooks/useAIReceptionistBuilderStore';
import { basePackages, isPromoActive, PROMO_END_DATE } from '@/data/aiReceptionistBuilder';
import { Check, Sparkles, Phone, Building2, Crown, Settings2 } from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  'starter': Phone,
  'business': Building2,
  'enterprise': Crown,
  'custom': Settings2,
};

export default function Step1Overview() {
  const { basePackage, setBasePackage } = useAIReceptionistBuilderStore();
  const promoActive = isPromoActive();

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="space-y-6">
      {/* Promotional Banner */}
      {promoActive && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[var(--accent-purple)] via-[var(--accent-pink)] to-[var(--accent-orange)] p-[1px]"
        >
          <div className="relative flex items-center justify-between gap-4 rounded-xl bg-[var(--bg-card)] px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-[var(--accent-purple)] to-[var(--accent-pink)]">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-white">
                  50% OFF Activation Fee for Starter & Business Plans!
                </p>
                <p className="text-sm text-[var(--text-secondary)]">
                  Limited time offer ends {formatDate(PROMO_END_DATE)}
                </p>
              </div>
            </div>
            <div className="hidden sm:block">
              <span className="rounded-full bg-[var(--accent-purple)]/20 px-4 py-1.5 text-sm font-medium text-[var(--accent-purple)]">
                Save up to $149.50
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-white mb-2">Choose Your AI Receptionist Package</h2>
        <p className="text-[var(--text-secondary)]">
          Select a package to get started. You can customize every feature in the following steps.
        </p>
      </div>

      {/* Package Cards */}
      <div className="grid sm:grid-cols-2 gap-4">
        {basePackages.map((pkg) => {
          const isSelected = basePackage === pkg.id;
          const Icon = iconMap[pkg.id] || Phone;
          const hasPromoDiscount = promoActive && pkg.promoActivationFee !== null;

          return (
            <motion.button
              key={pkg.id}
              onClick={() => setBasePackage(pkg.id)}
              className={`
                relative w-full p-5 rounded-xl text-left transition-all group
                ${isSelected
                  ? 'bg-gradient-to-br from-[var(--accent-purple)]/20 to-[var(--accent-pink)]/20 border-2 border-[var(--accent-purple)]'
                  : 'bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--accent-purple)]/50'
                }
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Popular Badge for Business */}
              {pkg.id === 'business' && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-gradient-to-r from-[var(--accent-purple)] to-[var(--accent-pink)] px-3 py-1 text-xs font-medium text-white">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Header Row */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`
                    p-2.5 rounded-lg
                    ${isSelected
                      ? 'bg-[var(--accent-purple)]/30'
                      : 'bg-[var(--bg-secondary)]'
                    }
                  `}>
                    <Icon className={`w-5 h-5 ${isSelected ? 'text-[var(--accent-purple)]' : 'text-[var(--text-secondary)]'}`} />
                  </div>
                  <div>
                    <h3 className={`font-semibold ${isSelected ? 'text-white' : 'text-[var(--text-secondary)] group-hover:text-white'}`}>
                      {pkg.name}
                    </h3>
                  </div>
                </div>
                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-[var(--accent-purple)] flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>

              {/* Pricing */}
              <div className="mb-3">
                {pkg.id === 'custom' ? (
                  <>
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg text-[var(--text-secondary)]">Starting at</span>
                      <span className="text-2xl font-bold text-white">${pkg.displayPrice}</span>
                      <span className="text-sm text-[var(--text-secondary)]">/mo</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      {hasPromoDiscount ? (
                        <>
                          <span className="text-sm text-[var(--text-muted)] line-through">
                            ${pkg.activationFee}
                          </span>
                          <span className="text-sm font-medium text-[var(--accent-purple)]">
                            ${pkg.promoActivationFee?.toFixed(2)} activation
                          </span>
                        </>
                      ) : (
                        <span className="text-sm text-[var(--text-secondary)]">
                          + ${pkg.activationFee} activation
                        </span>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-white">${pkg.displayPrice}</span>
                      <span className="text-sm text-[var(--text-secondary)]">/mo</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      {hasPromoDiscount ? (
                        <>
                          <span className="text-sm text-[var(--text-muted)] line-through">
                            ${pkg.activationFee}
                          </span>
                          <span className="text-sm font-medium text-[var(--accent-purple)]">
                            ${pkg.promoActivationFee?.toFixed(2)} activation
                          </span>
                        </>
                      ) : (
                        <span className="text-sm text-[var(--text-secondary)]">
                          + ${pkg.activationFee} activation
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Tagline */}
              <p className="text-sm text-[var(--text-secondary)] mb-4">
                {pkg.tagline}
              </p>

              {/* Includes List */}
              <div className="space-y-2 mb-4">
                {pkg.includes.slice(0, pkg.id === 'custom' ? 1 : 5).map((item, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[var(--accent-purple)] mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-[var(--text-secondary)]">{item}</span>
                  </div>
                ))}
                {pkg.includes.length > 5 && pkg.id !== 'custom' && (
                  <div className="flex items-start gap-2">
                    <span className="text-sm text-[var(--accent-purple)]">
                      +{pkg.includes.length - 5} more features
                    </span>
                  </div>
                )}
              </div>

              {/* Overage Rate */}
              {pkg.id !== 'custom' && (
                <div className="pt-3 border-t border-[var(--border-subtle)]">
                  <span className="text-xs text-[var(--text-muted)]">
                    Overage: ${pkg.overageRate.toFixed(2)}/min after plan minutes
                  </span>
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Selection Confirmation */}
      {basePackage && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-[var(--accent-purple)]/10 border border-[var(--accent-purple)]/30 rounded-lg"
        >
          <p className="text-sm text-[var(--text-secondary)]">
            {basePackage === 'custom' ? (
              <>You&apos;ve selected <span className="text-white font-medium">Custom Agent</span>. You&apos;ll configure all features from scratch in the next steps.</>
            ) : (
              <>You&apos;ve selected <span className="text-white font-medium">{basePackages.find(p => p.id === basePackage)?.name}</span>. We&apos;ve pre-configured recommended options which you can adjust in the following steps.</>
            )}
          </p>
        </motion.div>
      )}
    </div>
  );
}
