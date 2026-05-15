import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Types for different service configurations
export interface WebsiteConfig {
  projectType: string | null;
  siteSize: string | null;
  siteSizePrice: number | null;
  designComplexity: string | null;
  designPrice: number;
  cms: string | null;
  cmsPrice: number;
  selectedFeatures: Array<{
    id: string;
    optionId: string;
    price: number | null;
  }>;
  selectedAIFeatures: Array<{
    id: string;
    setupOptionId: string;
    setupPrice: number | null;
    usageOptionId: string | null;
    usagePrice: number | null;
  }>;
  selectedServices: Array<{
    id: string;
    price: number;
    recurring?: 'monthly';
  }>;
  timeline: string | null;
  timelineMultiplier: number;
  subtotal: number;
  rushFee: number;
  total: number;
  monthlyRecurring: number;
  hasCustomQuote: boolean;
}

export interface AppConfig {
  appType: string | null;
  platform: string | null;
  platformPrice: number | null;
  screens: string | null;
  screensPrice: number | null;
  design: string | null;
  designPrice: number;
  auth: string | null;
  authPrice: number;
  backend: string | null;
  backendPrice: number | null;
  selectedFeatures: Array<{
    id: string;
    optionId: string;
    price: number | null;
  }>;
  selectedAIFeatures: Array<{
    id: string;
    setupOptionId: string;
    setupPrice: number | null;
    usageOptionId: string | null;
    usagePrice: number | null;
  }>;
  selectedServices: Array<{
    id: string;
    price: number;
    recurring?: 'monthly';
  }>;
  timeline: string | null;
  timelineMultiplier: number;
  oneTimeSubtotal: number;
  rushFee: number;
  oneTimeTotal: number;
  monthlyTotal: number;
  hasCustomQuote: boolean;
}

export interface AnimationConfig {
  animationType: string | null;
  duration: string | null;
  durationPrice: number | null;
  style: string | null;
  stylePrice: number | null;
  complexity: string | null;
  complexityPrice: number;
  sound: string | null;
  soundPrice: number;
  selectedAddOns: Array<{
    categoryId: string;
    tierId: string;
    price: number;
  }>;
  selectedVideoFormats: Array<{
    id: string;
    price: number;
  }>;
  aspectRatio: string;
  aspectRatioPrice: number;
  sourceFiles: string;
  sourceFilesPrice: number;
  timeline: string;
  timelineMultiplier: number;
  subtotal: number;
  rushFee: number;
  total: number;
  hasCustomQuote: boolean;
}

export interface ImageConfig {
  imageType: string | null;
  quantity: string | null;
  quantityPrice: number | null;
  style: string | null;
  stylePrice: number | null;
  creation: string | null;
  creationPrice: number;
  editing: string | null;
  editingPrice: number;
  background: string;
  backgroundPrice: number;
  overlay: string;
  overlayPrice: number;
  sizes: string;
  sizesPrice: number;
  revisions: string;
  revisionsPrice: number;
  formats: string;
  formatsPrice: number;
  source: string;
  sourcePrice: number;
  license: string;
  licensePrice: number;
  timeline: string;
  timelineMultiplier: number;
  subtotal: number;
  rushFee: number;
  total: number;
  hasCustomQuote: boolean;
}

export interface SoundConfig {
  soundType: string | null;
  duration: string | null;
  durationPrice: number | null;
  style: string | null;
  stylePrice: number | null;
  complexity: string | null;
  complexityPrice: number;
  quantity: string | null;
  quantityPrice: number | null;
  voiceover: string;
  voiceoverPrice: number;
  lyrics: string;
  lyricsPrice: number;
  selectedSoundDesignAddOns: string[];
  soundDesignAddOnsPrice: number;
  revisions: string;
  revisionsPrice: number;
  formats: string;
  formatsPrice: number;
  projectFiles: string;
  projectFilesPrice: number;
  license: string;
  licensePrice: number;
  timeline: string;
  timelineMultiplier: number;
  subtotal: number;
  rushFee: number;
  total: number;
  hasCustomQuote: boolean;
}

export interface PaidMediaConfig {
  campaignType: string | null;
  platforms: string | null;
  platformsPrice: number | null;
  budget: string | null;
  adSpendRange: [number, number] | null;
  duration: string | null;
  durationMultiplier: number;
  durationMonths: number;
  management: string | null;
  managementPrice: number;
  managementOneTime: boolean;
  creatives: string | null;
  creativesPrice: number;
  landingPage: string | null;
  landingPagePrice: number;
  tracking: string | null;
  trackingPrice: number;
  reporting: string | null;
  reportingPrice: number;
  selectedAddOns: Array<{
    id: string;
    price: number;
    oneTime?: boolean;
    recurring?: 'monthly';
  }>;
  monthlySubtotal: number;
  durationDiscount: number;
  monthlyTotal: number;
  oneTimeTotal: number;
  totalMonthlyOverTerm: number;
  totalInvestment: number;
  hasCustomQuote: boolean;
}

export interface SocialMediaConfig {
  managementGoal: string | null;
  platforms: string | null;
  platformsPrice: number | null;
  frequency: string | null;
  frequencyPrice: number | null;
  postsPerMonth: number | null;
  content: string | null;
  contentPrice: number;
  engagement: string | null;
  engagementPrice: number | null;
  strategy: string | null;
  strategyPrice: number;
  reporting: string | null;
  reportingPrice: number;
  stories: string;
  storiesPrice: number;
  reels: string;
  reelsPrice: number | null;
  selectedAdditionalAddOns: Array<{
    id: string;
    price: number;
    oneTime?: boolean;
    recurring?: 'monthly';
    category: 'stories' | 'reels' | 'additional';
  }>;
  duration: string | null;
  durationMultiplier: number;
  durationMonths: number;
  monthlySubtotal: number;
  durationDiscount: number;
  monthlyTotal: number;
  oneTimeTotal: number;
  totalMonthlyOverTerm: number;
  totalInvestment: number;
  hasCustomQuote: boolean;
}

export interface EmailMarketingConfig {
  emailGoal: string | null;
  volume: string | null;
  volumePrice: number | null;
  emailsPerMonth: number | null;
  design: string | null;
  designPrice: number;
  automation: string | null;
  automationPrice: number;
  sequences: string | null;
  sequencesPrice: number | null;
  list: string | null;
  listPrice: number;
  copy: string | null;
  copyPrice: number;
  reporting: string | null;
  reportingPrice: number;
  testing: string;
  testingPrice: number;
  platform: string;
  platformPrice: number;
  selectedAdditionalServices: Array<{
    id: string;
    price: number;
    oneTime?: boolean;
    recurring?: 'monthly';
  }>;
  duration: string | null;
  durationMultiplier: number;
  durationMonths: number;
  monthlySubtotal: number;
  durationDiscount: number;
  monthlyTotal: number;
  oneTimeTotal: number;
  totalMonthlyOverTerm: number;
  totalInvestment: number;
  hasCustomQuote: boolean;
}

export interface BrandStrategyConfig {
  strategyGoal: string | null;
  depth: string | null;
  depthPrice: number;
  research: string | null;
  researchPrice: number;
  positioning: string | null;
  positioningPrice: number;
  messaging: string | null;
  messagingPrice: number;
  architecture: string | null;
  architecturePrice: number;
  purpose: string | null;
  purposePrice: number;
  audience: string | null;
  audiencePrice: number;
  workshop: string | null;
  workshopPrice: number | null;
  selectedAddOns: Array<{
    id: string;
    price: number;
    oneTime: true;
  }>;
  timeline: string | null;
  timelineMultiplier: number;
  strategySubtotal: number;
  addOnsTotal: number;
  projectSubtotal: number;
  timelinePremium: number;
  totalInvestment: number;
  hasCustomQuote: boolean;
}

export interface VisualIdentityConfig {
  visualIdentityGoal: string | null;
  logo: string | null;
  logoPrice: number;
  colors: string | null;
  colorsPrice: number;
  typography: string | null;
  typographyPrice: number;
  photography: string | null;
  photographyPrice: number;
  icons: string | null;
  iconsPrice: number;
  patterns: string | null;
  patternsPrice: number;
  illustration: string | null;
  illustrationPrice: number;
  motion: string | null;
  motionPrice: number;
  guidelines: string | null;
  guidelinesPrice: number;
  selectedAddOns: Array<{
    id: string;
    price: number;
    oneTime: true;
  }>;
  timeline: string | null;
  timelineMultiplier: number;
  coreIdentitySubtotal: number;
  visualElementsSubtotal: number;
  documentationSubtotal: number;
  addOnsTotal: number;
  projectSubtotal: number;
  timelinePremium: number;
  totalInvestment: number;
  hasCustomQuote: boolean;
}

export interface BrandApplicationsConfig {
  applicationGoal: string | null;
  stationery: string | null;
  stationeryPrice: number;
  digital: string | null;
  digitalPrice: number;
  social: string | null;
  socialPrice: number;
  presentations: string | null;
  presentationsPrice: number;
  marketing: string | null;
  marketingPrice: number;
  signage: string | null;
  signagePrice: number;
  packaging: string | null;
  packagingPrice: number;
  events: string | null;
  eventsPrice: number;
  selectedAddOns: Array<{
    id: string;
    price: number;
    oneTime: true;
  }>;
  timeline: string | null;
  timelineMultiplier: number;
  businessEssentialsSubtotal: number;
  digitalSocialSubtotal: number;
  marketingSubtotal: number;
  physicalSubtotal: number;
  addOnsTotal: number;
  projectSubtotal: number;
  timelinePremium: number;
  totalInvestment: number;
  hasCustomQuote: boolean;
}

export interface ContentStrategyConfig {
  contentGoal: string | null;
  depth: string | null;
  depthPrice: number;
  audit: string | null;
  auditPrice: number;
  audience: string | null;
  audiencePrice: number;
  channels: string | null;
  channelsPrice: number;
  editorial: string | null;
  editorialPrice: number;
  seo: string | null;
  seoPrice: number;
  governance: string | null;
  governancePrice: number;
  measurement: string | null;
  measurementPrice: number;
  selectedAddOns: Array<{
    id: string;
    price: number;
    oneTime: true;
  }>;
  timeline: string | null;
  timelineMultiplier: number;
  strategyFoundationSubtotal: number;
  planningOperationsSubtotal: number;
  addOnsTotal: number;
  projectSubtotal: number;
  timelinePremium: number;
  totalInvestment: number;
  hasCustomQuote: boolean;
}

export interface MessagingCopywritingConfig {
  messagingGoal: string | null;
  messaging: string | null;
  messagingPrice: number;
  voice: string | null;
  voicePrice: number;
  website: string | null;
  websitePrice: number;
  marketing: string | null;
  marketingPrice: number;
  sales: string | null;
  salesPrice: number;
  product: string | null;
  productPrice: number;
  content: string | null;
  contentPrice: number;
  ux: string | null;
  uxPrice: number;
  retainer: string | null;
  retainerPrice: number; // This is monthly
  selectedAddOns: Array<{ id: string; price: number; oneTime: true }>;
  timeline: string | null;
  timelineMultiplier: number;
  messagingFoundationSubtotal: number;
  copyProductionSubtotal: number;
  addOnsTotal: number;
  oneTimeSubtotal: number;
  timelinePremium: number;
  oneTimeTotal: number;
  monthlyTotal: number;
  hasCustomQuote: boolean;
}

export interface AIReceptionistConfig {
  basePackage: 'starter' | 'business' | 'enterprise' | 'custom' | null;
  // Phone Setup
  phoneNumberType: 'local' | 'tollfree' | 'vanity' | null;
  additionalLines: string | null;
  coverageArea: 'us' | 'us-canada' | 'international' | null;
  // Call Handling
  monthlyMinutes: string | null;
  availability: 'business' | 'extended' | '24/7' | null;
  callTransfer: 'none' | 'single' | 'multiple' | 'smart' | null;
  voicemailType: 'basic' | 'transcript' | 'ai-summary' | null;
  maxCallDuration: '5' | '10' | '15' | 'unlimited' | null;
  // AI Capabilities
  language: 'english' | 'bilingual-spanish' | 'bilingual-other' | 'multilingual' | null;
  voiceStyle: 'standard' | 'premium' | 'custom' | 'cloned' | null;
  knowledgeBaseSize: '25' | '50' | '100' | '250' | 'unlimited' | null;
  conversationComplexity: 'simple' | 'multiturn' | 'complex' | 'dynamic' | null;
  personality: 'default' | 'custom' | 'industry' | null;
  // Integrations
  leadCapture: 'sheets' | 'airtable' | 'notion' | 'hubspot' | 'salesforce' | 'custom' | null;
  calendar: 'none' | 'google' | 'calendly' | 'cal' | 'acuity' | 'custom' | null;
  notifications: string[];
  additionalIntegrations: string[];
  // Reporting
  transcripts: 'none' | 'full' | null;
  aiSummaries: 'none' | 'enabled' | null;
  analyticsLevel: 'basic' | 'standard' | 'advanced' | null;
  reportingFrequency: 'none' | 'weekly' | 'monthly' | 'custom' | null;
  // Support
  onboardingType: 'self' | 'guided' | 'whiteglove' | null;
  knowledgeUpdates: 'self' | 'monthly' | 'unlimited' | null;
  supportLevel: 'email' | 'priority' | 'priority-chat' | 'dedicated' | null;
  // Totals
  monthlySubtotal: number;
  oneTimeTotal: number;
  promoDiscount: number;
  monthlyTotal: number;
  hasCustomQuote: boolean;
}

export interface CustomerInfo {
  name: string;
  email: string;
  company: string;
  phone: string;
  notes: string;
}

export type ServiceType = 'website' | 'app' | 'animation' | 'image' | 'sound' | 'paid-media' | 'social-media' | 'email-marketing' | 'brand-strategy' | 'visual-identity' | 'brand-applications' | 'content-strategy' | 'messaging-copywriting' | 'ai-receptionist';

export interface ConfiguredService {
  type: ServiceType;
  config: WebsiteConfig | AppConfig | AnimationConfig | ImageConfig | SoundConfig | PaidMediaConfig | SocialMediaConfig | EmailMarketingConfig | BrandStrategyConfig | VisualIdentityConfig | BrandApplicationsConfig | ContentStrategyConfig | MessagingCopywritingConfig | AIReceptionistConfig;
  configuredAt: number; // timestamp
}

interface UnifiedQuoteState {
  // Configured services
  configuredServices: Record<ServiceType, ConfiguredService | null>;

  // Customer info (shared across all services)
  customerInfo: CustomerInfo;

  // Check if a service is configured
  isServiceConfigured: (type: ServiceType) => boolean;

  // Get configuration for a service
  getServiceConfig: <T extends WebsiteConfig | AppConfig | AnimationConfig | ImageConfig | SoundConfig | PaidMediaConfig | SocialMediaConfig | EmailMarketingConfig | BrandStrategyConfig | VisualIdentityConfig | BrandApplicationsConfig | ContentStrategyConfig | MessagingCopywritingConfig | AIReceptionistConfig>(type: ServiceType) => T | null;

  // Save configuration for a service
  saveServiceConfig: (type: ServiceType, config: WebsiteConfig | AppConfig | AnimationConfig | ImageConfig | SoundConfig | PaidMediaConfig | SocialMediaConfig | EmailMarketingConfig | BrandStrategyConfig | VisualIdentityConfig | BrandApplicationsConfig | ContentStrategyConfig | MessagingCopywritingConfig | AIReceptionistConfig) => void;

  // Clear configuration for a service (removes from quote, resets that builder)
  clearServiceConfig: (type: ServiceType) => void;

  // Get all configured services
  getAllConfiguredServices: () => ConfiguredService[];

  // Get available services (not yet configured)
  getAvailableServices: () => ServiceType[];

  // Calculate combined totals
  getCombinedTotals: () => {
    oneTimeTotal: number;
    monthlyTotal: number;
    hasCustomQuote: boolean;
    serviceCount: number;
  };

  // Customer info actions
  setCustomerInfo: (info: Partial<CustomerInfo>) => void;

  // Reset everything
  resetAllQuotes: () => void;
}

const initialCustomerInfo: CustomerInfo = {
  name: '',
  email: '',
  company: '',
  phone: '',
  notes: '',
};

// All available service types
const ALL_SERVICE_TYPES: ServiceType[] = ['website', 'app', 'animation', 'image', 'sound', 'paid-media', 'social-media', 'email-marketing', 'brand-strategy', 'visual-identity', 'brand-applications', 'content-strategy', 'messaging-copywriting', 'ai-receptionist'];

export const useUnifiedQuoteStore = create<UnifiedQuoteState>()(
  persist(
    (set, get) => ({
      configuredServices: {
        website: null,
        app: null,
        animation: null,
        image: null,
        sound: null,
        'paid-media': null,
        'social-media': null,
        'email-marketing': null,
        'brand-strategy': null,
        'visual-identity': null,
        'brand-applications': null,
        'content-strategy': null,
        'messaging-copywriting': null,
        'ai-receptionist': null,
      },
      customerInfo: initialCustomerInfo,

      isServiceConfigured: (type) => {
        return get().configuredServices[type] !== null;
      },

      getServiceConfig: <T extends WebsiteConfig | AppConfig | AnimationConfig | ImageConfig | SoundConfig | PaidMediaConfig | SocialMediaConfig | EmailMarketingConfig | BrandStrategyConfig | VisualIdentityConfig | BrandApplicationsConfig | ContentStrategyConfig | MessagingCopywritingConfig | AIReceptionistConfig>(type: ServiceType): T | null => {
        const service = get().configuredServices[type];
        return service ? (service.config as T) : null;
      },

      saveServiceConfig: (type, config) => {
        set((state) => ({
          configuredServices: {
            ...state.configuredServices,
            [type]: {
              type,
              config,
              configuredAt: Date.now(),
            },
          },
        }));
      },

      clearServiceConfig: (type) => {
        set((state) => ({
          configuredServices: {
            ...state.configuredServices,
            [type]: null,
          },
        }));
      },

      getAllConfiguredServices: () => {
        const { configuredServices } = get();
        return Object.values(configuredServices).filter(
          (service): service is ConfiguredService => service !== null
        );
      },

      getAvailableServices: () => {
        const { configuredServices } = get();
        return ALL_SERVICE_TYPES.filter((type) => configuredServices[type] === null);
      },

      getCombinedTotals: () => {
        const services = get().getAllConfiguredServices();

        let oneTimeTotal = 0;
        let monthlyTotal = 0;
        let hasCustomQuote = false;

        services.forEach((service) => {
          if (service.type === 'website') {
            const config = service.config as WebsiteConfig;
            oneTimeTotal += config.total;
            monthlyTotal += config.monthlyRecurring;
            if (config.hasCustomQuote) hasCustomQuote = true;
          } else if (service.type === 'app') {
            const config = service.config as AppConfig;
            oneTimeTotal += config.oneTimeTotal;
            monthlyTotal += config.monthlyTotal;
            if (config.hasCustomQuote) hasCustomQuote = true;
          } else if (service.type === 'animation') {
            const config = service.config as AnimationConfig;
            oneTimeTotal += config.total;
            // Animation doesn't have monthly recurring
            if (config.hasCustomQuote) hasCustomQuote = true;
          } else if (service.type === 'image') {
            const config = service.config as ImageConfig;
            oneTimeTotal += config.total;
            // Image doesn't have monthly recurring
            if (config.hasCustomQuote) hasCustomQuote = true;
          } else if (service.type === 'sound') {
            const config = service.config as SoundConfig;
            oneTimeTotal += config.total;
            // Sound doesn't have monthly recurring
            if (config.hasCustomQuote) hasCustomQuote = true;
          } else if (service.type === 'paid-media') {
            const config = service.config as PaidMediaConfig;
            oneTimeTotal += config.oneTimeTotal;
            monthlyTotal += config.monthlyTotal;
            if (config.hasCustomQuote) hasCustomQuote = true;
          } else if (service.type === 'social-media') {
            const config = service.config as SocialMediaConfig;
            oneTimeTotal += config.oneTimeTotal;
            monthlyTotal += config.monthlyTotal;
            if (config.hasCustomQuote) hasCustomQuote = true;
          } else if (service.type === 'email-marketing') {
            const config = service.config as EmailMarketingConfig;
            oneTimeTotal += config.oneTimeTotal;
            monthlyTotal += config.monthlyTotal;
            if (config.hasCustomQuote) hasCustomQuote = true;
          } else if (service.type === 'brand-strategy') {
            const config = service.config as BrandStrategyConfig;
            oneTimeTotal += config.totalInvestment;
            // Brand strategy doesn't have monthly recurring
            if (config.hasCustomQuote) hasCustomQuote = true;
          } else if (service.type === 'visual-identity') {
            const config = service.config as VisualIdentityConfig;
            oneTimeTotal += config.totalInvestment;
            // Visual identity doesn't have monthly recurring
            if (config.hasCustomQuote) hasCustomQuote = true;
          } else if (service.type === 'brand-applications') {
            const config = service.config as BrandApplicationsConfig;
            oneTimeTotal += config.totalInvestment;
            // Brand applications doesn't have monthly recurring
            if (config.hasCustomQuote) hasCustomQuote = true;
          } else if (service.type === 'content-strategy') {
            const config = service.config as ContentStrategyConfig;
            oneTimeTotal += config.totalInvestment;
            // Content strategy doesn't have monthly recurring
            if (config.hasCustomQuote) hasCustomQuote = true;
          } else if (service.type === 'messaging-copywriting') {
            const config = service.config as MessagingCopywritingConfig;
            oneTimeTotal += config.oneTimeTotal;
            monthlyTotal += config.monthlyTotal;
            if (config.hasCustomQuote) hasCustomQuote = true;
          } else if (service.type === 'ai-receptionist') {
            const config = service.config as AIReceptionistConfig;
            oneTimeTotal += config.oneTimeTotal;
            monthlyTotal += config.monthlyTotal;
            if (config.hasCustomQuote) hasCustomQuote = true;
          }
        });

        return {
          oneTimeTotal,
          monthlyTotal,
          hasCustomQuote,
          serviceCount: services.length,
        };
      },

      setCustomerInfo: (info) => {
        set((state) => ({
          customerInfo: { ...state.customerInfo, ...info },
        }));
      },

      resetAllQuotes: () => {
        set({
          configuredServices: {
            website: null,
            app: null,
            animation: null,
            image: null,
            sound: null,
            'paid-media': null,
            'social-media': null,
            'email-marketing': null,
            'brand-strategy': null,
            'visual-identity': null,
            'brand-applications': null,
            'content-strategy': null,
            'messaging-copywriting': null,
            'ai-receptionist': null,
          },
          customerInfo: initialCustomerInfo,
        });
      },
    }),
    {
      name: 'unified-quote-storage',
      version: 2,
      partialize: (state) => ({
        configuredServices: state.configuredServices,
      }),
      migrate: (persistedState) => {
        if (persistedState && typeof persistedState === 'object' && 'customerInfo' in persistedState) {
          const { customerInfo: _drop, ...rest } = persistedState as Record<string, unknown>;
          void _drop;
          return rest;
        }
        return persistedState;
      },
    }
  )
);

// Service metadata for UI
export const serviceMetadata: Record<ServiceType, {
  label: string;
  description: string;
  builderPath: string;
  icon: string;
}> = {
  website: {
    label: 'Custom Website',
    description: 'Build a custom website with your specific requirements',
    builderPath: '/build-my-site',
    icon: 'Globe',
  },
  app: {
    label: 'Custom App',
    description: 'Build a custom mobile, web, or desktop application',
    builderPath: '/build-my-app',
    icon: 'Smartphone',
  },
  animation: {
    label: 'Custom Animation',
    description: 'Create custom motion graphics, explainer videos, or promotional animations',
    builderPath: '/build-my-animation',
    icon: 'Film',
  },
  image: {
    label: 'Custom Images',
    description: 'Create custom graphics, photography, illustrations, or AI-generated imagery',
    builderPath: '/build-my-images',
    icon: 'Image',
  },
  sound: {
    label: 'Brand Signature Sound',
    description: 'Create custom sonic logos, audio branding, jingles, and sound identity',
    builderPath: '/build-my-sound',
    icon: 'Music',
  },
  'paid-media': {
    label: 'Paid Media & Lead Gen',
    description: 'Ad campaigns, audience targeting, and conversion optimization across platforms',
    builderPath: '/build-my-media',
    icon: 'Megaphone',
  },
  'social-media': {
    label: 'Social Media Management',
    description: 'Complete social media management with content, engagement, and strategy',
    builderPath: '/build-my-social',
    icon: 'Share2',
  },
  'email-marketing': {
    label: 'Email Marketing & Automation',
    description: 'Email campaigns, automation sequences, and list management',
    builderPath: '/build-my-email',
    icon: 'Mail',
  },
  'brand-strategy': {
    label: 'Brand Strategy & Positioning',
    description: 'Strategic brand foundations, positioning, and messaging frameworks',
    builderPath: '/build-my-brand-strategy',
    icon: 'Target',
  },
  'visual-identity': {
    label: 'Visual Identity Design',
    description: 'Logo design, color palettes, typography, and complete brand style guides',
    builderPath: '/build-my-identity',
    icon: 'Palette',
  },
  'brand-applications': {
    label: 'Brand Applications',
    description: 'Business cards, letterheads, social templates, presentations, and branded collateral',
    builderPath: '/build-my-applications',
    icon: 'Layers',
  },
  'content-strategy': {
    label: 'Content Strategy',
    description: 'Strategic content planning, audits, editorial systems, and measurement frameworks',
    builderPath: '/build-my-content-strategy',
    icon: 'FileText',
  },
  'messaging-copywriting': {
    label: 'Messaging & Copywriting',
    description: 'Strategic messaging frameworks and professional copywriting across all touchpoints',
    builderPath: '/build-my-messaging',
    icon: 'PenTool',
  },
  'ai-receptionist': {
    label: 'AI Receptionist',
    description: '24/7 AI-powered call answering that captures leads, schedules appointments, and never misses a call',
    builderPath: '/build-my-receptionist',
    icon: 'Phone',
  },
};
