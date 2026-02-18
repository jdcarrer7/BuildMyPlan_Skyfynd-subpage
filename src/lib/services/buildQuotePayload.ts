import { usePlanStore } from '@/hooks/usePlanStore';
import { getServiceById } from '@/data/services';
import type { Feature } from '@/data/services';
import {
  useUnifiedQuoteStore,
  serviceMetadata,
  type ConfiguredService,
  type ServiceType,
  type WebsiteConfig,
  type AppConfig,
  type PaidMediaConfig,
  type SocialMediaConfig,
  type EmailMarketingConfig,
  type MessagingCopywritingConfig,
  type AIReceptionistConfig,
} from '@/hooks/useUnifiedQuoteStore';
import type { QuoteRequestPayload, TierServiceDetail, BuilderServiceDetail } from '@/lib/types/quote';
import type { ResolvedServiceConfig, ResolvedStep } from '@/lib/types/admin';
import { resolveServiceConfig } from '@/lib/services/configResolver';

/**
 * Converts a tier service's features into ResolvedServiceConfig format
 * so tier quotes get the same feature-level breakdown in emails as custom builders.
 */
function resolveTierService(
  serviceId: string,
  tierId: string,
  addOnIds: string[],
  itemSubtotal: number
): ResolvedServiceConfig {
  const service = getServiceById(serviceId);
  const tier = service?.tiers.find(t => t.id === tierId);
  const tierName = tier?.name ?? tierId;
  const serviceLabel = service ? `${service.name} — ${tierName}` : serviceId;

  // Convert included features to steps
  const steps: ResolvedStep[] = [];
  if (tier) {
    for (const feat of tier.features) {
      if (feat.included === true) {
        steps.push({
          stepName: feat.name,
          selectedLabel: typeof feat.value === 'boolean' ? 'Included' : String(feat.value),
          selectedId: 'included',
          priceImpact: null,
          isRecurring: false,
        });
      }
    }
  }

  // Add selected add-ons as steps
  if (service && addOnIds.length > 0) {
    for (const addOnId of addOnIds) {
      const addOn = service.addOns.find(a => a.id === addOnId);
      if (addOn) {
        steps.push({
          stepName: 'Add-on',
          selectedLabel: addOn.name,
          selectedId: addOnId,
          priceImpact: addOn.price,
          isRecurring: addOn.name.toLowerCase().includes('monthly'),
        });
      }
    }
  }

  const isMonthly = tier?.priceType === 'monthly';

  return {
    serviceType: serviceId as ServiceType,
    serviceLabel,
    steps,
    oneTimeTotal: isMonthly ? 0 : itemSubtotal,
    monthlyTotal: isMonthly ? itemSubtotal : 0,
    hasCustomQuote: false,
  };
}

/**
 * Builds a quote payload from the tier-based plan store (Main Page + Rent Me a Site).
 * Source is auto-detected: if any item has serviceId === 'website-rental', source = "Rent Me a Site".
 */
export function buildTierQuotePayload(
  formData: { name: string; email: string; company?: string; phone?: string; notes?: string }
): QuoteRequestPayload {
  const { items, subtotal, discountPercentage, total } = usePlanStore.getState();

  const isRental = items.some(item => item.serviceId === 'website-rental');
  const source = isRental ? 'Rent Me a Site' : 'Main Page';

  const servicesDetail: TierServiceDetail[] = items.map(item => {
    const service = getServiceById(item.serviceId);
    return {
      serviceId: item.serviceId,
      serviceName: service?.name ?? item.serviceId,
      tier: item.tierId,
      addOns: item.addOns,
      subtotal: item.subtotal,
    };
  });

  const serviceNames = servicesDetail.map(s => s.serviceName).join(', ');

  // Resolve tier features for email/admin breakdown
  const resolvedServices = items.map(item =>
    resolveTierService(item.serviceId, item.tierId, item.addOns, item.subtotal)
  );

  // Separate one-time vs monthly totals from resolved services
  let rawOneTime = 0;
  let rawMonthly = 0;
  for (const rs of resolvedServices) {
    rawOneTime += rs.oneTimeTotal;
    rawMonthly += rs.monthlyTotal;
  }

  // Apply bundle discount proportionally to both
  const discountMultiplier = discountPercentage > 0 ? 1 - discountPercentage / 100 : 1;
  const oneTimeTotal = Math.round(rawOneTime * discountMultiplier);
  const monthlyTotal = Math.round(rawMonthly * discountMultiplier);

  return {
    source,
    name: formData.name,
    email: formData.email,
    company: formData.company ?? '',
    phone: formData.phone ?? '',
    notes: formData.notes ?? '',
    serviceCount: items.length,
    serviceNames,
    hasCustomQuote: false,
    oneTimeTotal,
    monthlyTotal,
    discountPercentage,
    grandTotal: oneTimeTotal + monthlyTotal,
    servicesDetail,
    resolvedServices,
  };
}

/**
 * Gets the one-time and monthly totals from any configured service.
 */
function getServiceTotals(service: ConfiguredService): { oneTime: number; monthly: number } {
  const c = service.config;
  switch (service.type) {
    case 'website':
      return { oneTime: (c as WebsiteConfig).total, monthly: (c as WebsiteConfig).monthlyRecurring };
    case 'app':
      return { oneTime: (c as AppConfig).oneTimeTotal, monthly: (c as AppConfig).monthlyTotal };
    case 'paid-media':
      return { oneTime: (c as PaidMediaConfig).oneTimeTotal, monthly: (c as PaidMediaConfig).monthlyTotal };
    case 'social-media':
      return { oneTime: (c as SocialMediaConfig).oneTimeTotal, monthly: (c as SocialMediaConfig).monthlyTotal };
    case 'email-marketing':
      return { oneTime: (c as EmailMarketingConfig).oneTimeTotal, monthly: (c as EmailMarketingConfig).monthlyTotal };
    case 'messaging-copywriting':
      return { oneTime: (c as MessagingCopywritingConfig).oneTimeTotal, monthly: (c as MessagingCopywritingConfig).monthlyTotal };
    case 'ai-receptionist':
      return { oneTime: (c as AIReceptionistConfig).oneTimeTotal, monthly: (c as AIReceptionistConfig).monthlyTotal };
    // Services with only one-time totals
    case 'animation':
    case 'image':
    case 'sound':
      return { oneTime: (c as { total: number }).total, monthly: 0 };
    case 'brand-strategy':
    case 'visual-identity':
    case 'brand-applications':
    case 'content-strategy':
      return { oneTime: (c as { totalInvestment: number }).totalInvestment, monthly: 0 };
    default:
      return { oneTime: 0, monthly: 0 };
  }
}

/**
 * Builds a quote payload from the unified quote store (Custom Builders).
 */
export function buildBuilderQuotePayload(
  formData: { name: string; email: string; company?: string; phone?: string; notes?: string }
): QuoteRequestPayload {
  const store = useUnifiedQuoteStore.getState();
  const configuredServices = store.getAllConfiguredServices();
  const totals = store.getCombinedTotals();

  const servicesDetail: BuilderServiceDetail[] = configuredServices.map(service => {
    const meta = serviceMetadata[service.type];
    const serviceTotals = getServiceTotals(service);
    return {
      serviceType: service.type,
      serviceLabel: meta.label,
      oneTimeTotal: serviceTotals.oneTime,
      monthlyTotal: serviceTotals.monthly,
      hasCustomQuote: (service.config as { hasCustomQuote: boolean }).hasCustomQuote,
      config: service.config as unknown as Record<string, unknown>,
    };
  });

  const serviceNames = servicesDetail.map(s => s.serviceLabel).join(', ');

  // Resolve step-by-step configs for admin viewing
  const resolvedServices = configuredServices.map(service => {
    const serviceTotals = getServiceTotals(service);
    return resolveServiceConfig(service.type, service.config, serviceTotals);
  });

  return {
    source: 'Custom Builder',
    name: formData.name,
    email: formData.email,
    company: formData.company ?? '',
    phone: formData.phone ?? '',
    notes: formData.notes ?? '',
    serviceCount: totals.serviceCount,
    serviceNames,
    hasCustomQuote: totals.hasCustomQuote,
    oneTimeTotal: totals.oneTimeTotal,
    monthlyTotal: totals.monthlyTotal,
    discountPercentage: 0,
    grandTotal: totals.oneTimeTotal + totals.monthlyTotal,
    servicesDetail,
    resolvedServices,
  };
}
