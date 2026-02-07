import { create } from 'zustand';
import {
  appRecommendationPresets,
  platformOptions,
  screenOptions,
  designOptions,
  authOptions,
  backendOptions,
  appFeatures,
  aiFeatures,
  appAdditionalServices,
  appTimelineOptions,
  getFeatureOptionPrice,
  getAISetupPrice,
  getAIUsagePrice,
} from '@/data/appBuilder';
import { useUnifiedQuoteStore, AppConfig } from './useUnifiedQuoteStore';

export interface SelectedFeature {
  id: string;
  optionId: string;
  price: number | null;
}

export interface SelectedAIFeature {
  id: string;
  setupOptionId: string;
  setupPrice: number | null;
  usageOptionId: string | null;
  usagePrice: number | null;
}

export interface SelectedService {
  id: string;
  price: number | null;
  recurring?: 'monthly';
  optionId?: string;
  customQuote?: boolean;
}

interface AppBuilderState {
  // Current step (1-11, 11 = summary)
  currentStep: number;

  // Step 1: App Type (info only)
  appType: string | null;

  // Step 2: Platform
  platform: string | null;
  platformPrice: number | null;

  // Step 3: Screens
  screens: string | null;
  screensPrice: number | null;

  // Step 4: Design
  design: string | null;
  designPrice: number;

  // Step 5: Authentication
  auth: string | null;
  authPrice: number;

  // Step 6: Backend
  backend: string | null;
  backendPrice: number | null;

  // Step 7: Features
  selectedFeatures: SelectedFeature[];

  // Step 8: AI Features
  selectedAIFeatures: SelectedAIFeature[];

  // Step 9: Additional Services
  selectedServices: SelectedService[];

  // Step 10: Timeline
  timeline: string | null;
  timelineMultiplier: number;

  // Calculated totals
  oneTimeSubtotal: number;
  rushFee: number;
  oneTimeTotal: number;
  monthlyTotal: number;
  hasCustomQuote: boolean;

  // Actions
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;

  setAppType: (type: string) => void;
  setPlatform: (platformId: string) => void;
  setScreens: (screensId: string) => void;
  setDesign: (designId: string) => void;
  setAuth: (authId: string) => void;
  setBackend: (backendId: string) => void;

  toggleFeature: (featureId: string) => void;
  setFeatureOption: (featureId: string, optionId: string) => void;
  isFeatureSelected: (featureId: string) => boolean;
  getFeatureOption: (featureId: string) => string | null;

  toggleAIFeature: (featureId: string) => void;
  setAISetupOption: (featureId: string, optionId: string) => void;
  setAIUsageOption: (featureId: string, optionId: string) => void;
  isAIFeatureSelected: (featureId: string) => boolean;
  getAIFeatureSetup: (featureId: string) => string | null;
  getAIFeatureUsage: (featureId: string) => string | null;

  toggleService: (serviceId: string) => void;
  setServiceOption: (serviceId: string, optionId: string) => void;
  getServiceOption: (serviceId: string) => string | null;
  isServiceSelected: (serviceId: string) => boolean;

  setTimeline: (timelineId: string) => void;

  applyRecommendations: (appType: string) => void;
  calculateTotals: () => void;

  // Unified quote integration
  saveToUnifiedQuote: () => void;
  loadFromUnifiedQuote: () => boolean;
  resetBuilder: () => void;

  // Get current config for unified quote
  getCurrentConfig: () => AppConfig;
}

const getInitialState = () => ({
  currentStep: 1,
  appType: null,
  platform: null,
  platformPrice: null,
  screens: null,
  screensPrice: null,
  design: null,
  designPrice: 0,
  auth: null,
  authPrice: 0,
  backend: null,
  backendPrice: null,
  selectedFeatures: [],
  selectedAIFeatures: [],
  selectedServices: [],
  timeline: 'flexible',
  timelineMultiplier: 1.0,
  oneTimeSubtotal: 0,
  rushFee: 0,
  oneTimeTotal: 0,
  monthlyTotal: 0,
  hasCustomQuote: false,
});

export const useAppBuilderStore = create<AppBuilderState>((set, get) => ({
  ...getInitialState(),

  setStep: (step) => set({ currentStep: step }),

  nextStep: () => {
    const { currentStep } = get();
    if (currentStep < 11) {
      set({ currentStep: currentStep + 1 });
    }
  },

  prevStep: () => {
    const { currentStep } = get();
    if (currentStep > 1) {
      set({ currentStep: currentStep - 1 });
    }
  },

  setAppType: (type) => {
    set({ appType: type });
    get().applyRecommendations(type);
  },

  setPlatform: (platformId) => {
    const option = platformOptions.find((o) => o.id === platformId);
    set({
      platform: platformId,
      platformPrice: option?.price ?? null,
    });
    get().calculateTotals();
  },

  setScreens: (screensId) => {
    const option = screenOptions.find((o) => o.id === screensId);
    set({
      screens: screensId,
      screensPrice: option?.price ?? null,
    });
    get().calculateTotals();
  },

  setDesign: (designId) => {
    const option = designOptions.find((o) => o.id === designId);
    set({
      design: designId,
      designPrice: option?.price ?? 0,
    });
    get().calculateTotals();
  },

  setAuth: (authId) => {
    const option = authOptions.find((o) => o.id === authId);
    set({
      auth: authId,
      authPrice: option?.price ?? 0,
    });
    get().calculateTotals();
  },

  setBackend: (backendId) => {
    const option = backendOptions.find((o) => o.id === backendId);
    set({
      backend: backendId,
      backendPrice: option?.price ?? null,
    });
    get().calculateTotals();
  },

  toggleFeature: (featureId) => {
    const { selectedFeatures } = get();
    const isSelected = selectedFeatures.some((f) => f.id === featureId);

    if (isSelected) {
      set({
        selectedFeatures: selectedFeatures.filter((f) => f.id !== featureId),
      });
    } else {
      const feature = appFeatures.find((f) => f.id === featureId);
      if (feature) {
        const defaultOption = feature.options.find((o) => o.id === feature.defaultTier);
        set({
          selectedFeatures: [
            ...selectedFeatures,
            {
              id: featureId,
              optionId: feature.defaultTier,
              price: defaultOption?.price ?? null,
            },
          ],
        });
      }
    }
    get().calculateTotals();
  },

  setFeatureOption: (featureId, optionId) => {
    const { selectedFeatures } = get();
    const price = getFeatureOptionPrice(featureId, optionId);

    set({
      selectedFeatures: selectedFeatures.map((f) =>
        f.id === featureId ? { ...f, optionId, price } : f
      ),
    });
    get().calculateTotals();
  },

  isFeatureSelected: (featureId) => {
    return get().selectedFeatures.some((f) => f.id === featureId);
  },

  getFeatureOption: (featureId) => {
    const feature = get().selectedFeatures.find((f) => f.id === featureId);
    return feature?.optionId ?? null;
  },

  toggleAIFeature: (featureId) => {
    const { selectedAIFeatures } = get();
    const isSelected = selectedAIFeatures.some((f) => f.id === featureId);

    if (isSelected) {
      set({
        selectedAIFeatures: selectedAIFeatures.filter((f) => f.id !== featureId),
      });
    } else {
      const feature = aiFeatures.find((f) => f.id === featureId);
      if (feature) {
        const defaultSetup = feature.setupOptions.find((o) => o.id === feature.defaultSetupTier);
        const defaultUsage = feature.usageOptions.find((o) => o.id === feature.defaultUsageTier);
        set({
          selectedAIFeatures: [
            ...selectedAIFeatures,
            {
              id: featureId,
              setupOptionId: feature.defaultSetupTier,
              setupPrice: defaultSetup?.price ?? null,
              usageOptionId: feature.defaultUsageTier,
              usagePrice: defaultUsage?.price ?? null,
            },
          ],
        });
      }
    }
    get().calculateTotals();
  },

  setAISetupOption: (featureId, optionId) => {
    const { selectedAIFeatures } = get();
    const price = getAISetupPrice(featureId, optionId);

    set({
      selectedAIFeatures: selectedAIFeatures.map((f) =>
        f.id === featureId ? { ...f, setupOptionId: optionId, setupPrice: price } : f
      ),
    });
    get().calculateTotals();
  },

  setAIUsageOption: (featureId, optionId) => {
    const { selectedAIFeatures } = get();
    const price = getAIUsagePrice(featureId, optionId);

    set({
      selectedAIFeatures: selectedAIFeatures.map((f) =>
        f.id === featureId ? { ...f, usageOptionId: optionId, usagePrice: price } : f
      ),
    });
    get().calculateTotals();
  },

  isAIFeatureSelected: (featureId) => {
    return get().selectedAIFeatures.some((f) => f.id === featureId);
  },

  getAIFeatureSetup: (featureId) => {
    const feature = get().selectedAIFeatures.find((f) => f.id === featureId);
    return feature?.setupOptionId ?? null;
  },

  getAIFeatureUsage: (featureId) => {
    const feature = get().selectedAIFeatures.find((f) => f.id === featureId);
    return feature?.usageOptionId ?? null;
  },

  toggleService: (serviceId) => {
    const { selectedServices } = get();
    const isSelected = selectedServices.some((s) => s.id === serviceId);

    if (isSelected) {
      set({
        selectedServices: selectedServices.filter((s) => s.id !== serviceId),
      });
    } else {
      const service = appAdditionalServices.find((s) => s.id === serviceId);
      if (service) {
        // If service has options (e.g. maintenance tiers), use default option
        if (service.options && service.defaultOption) {
          const defaultOpt = service.options.find((o) => o.id === service.defaultOption);
          set({
            selectedServices: [
              ...selectedServices,
              {
                id: serviceId,
                price: defaultOpt?.price ?? service.price,
                recurring: service.recurring,
                optionId: service.defaultOption,
              },
            ],
          });
        } else if (service.customQuote) {
          set({
            selectedServices: [
              ...selectedServices,
              {
                id: serviceId,
                price: null,
                recurring: service.recurring,
                customQuote: true,
              },
            ],
          });
        } else {
          set({
            selectedServices: [
              ...selectedServices,
              {
                id: serviceId,
                price: service.price,
                recurring: service.recurring,
              },
            ],
          });
        }
      }
    }
    get().calculateTotals();
  },

  setServiceOption: (serviceId, optionId) => {
    const { selectedServices } = get();
    const service = appAdditionalServices.find((s) => s.id === serviceId);
    if (!service?.options) return;
    const option = service.options.find((o) => o.id === optionId);
    if (!option) return;

    set({
      selectedServices: selectedServices.map((s) =>
        s.id === serviceId ? { ...s, optionId, price: option.price } : s
      ),
    });
    get().calculateTotals();
  },

  getServiceOption: (serviceId) => {
    const service = get().selectedServices.find((s) => s.id === serviceId);
    return service?.optionId ?? null;
  },

  isServiceSelected: (serviceId) => {
    return get().selectedServices.some((s) => s.id === serviceId);
  },

  setTimeline: (timelineId) => {
    const option = appTimelineOptions.find((o) => o.id === timelineId);
    set({
      timeline: timelineId,
      timelineMultiplier: option?.multiplier ?? 1.0,
    });
    get().calculateTotals();
  },

  applyRecommendations: (appType) => {
    const preset = appRecommendationPresets[appType];
    if (!preset) return;

    // Set platform
    const platformOption = platformOptions.find((o) => o.id === preset.platform);

    // Set screens
    const screenOption = screenOptions.find((o) => o.id === preset.screens);

    // Set design
    const designOption = designOptions.find((o) => o.id === preset.design);

    // Set auth
    const authOption = authOptions.find((o) => o.id === preset.auth);

    // Set backend
    const backendOption = backendOptions.find((o) => o.id === preset.backend);

    // Set features
    const selectedFeatures: SelectedFeature[] = preset.features.map((featureId) => {
      const feature = appFeatures.find((f) => f.id === featureId);
      if (!feature) return null;
      const defaultOption = feature.options.find((o) => o.id === feature.defaultTier);
      return {
        id: featureId,
        optionId: feature.defaultTier,
        price: defaultOption?.price ?? null,
      };
    }).filter((f): f is SelectedFeature => f !== null);

    set({
      platform: preset.platform,
      platformPrice: platformOption?.price ?? null,
      screens: preset.screens,
      screensPrice: screenOption?.price ?? null,
      design: preset.design,
      designPrice: designOption?.price ?? 0,
      auth: preset.auth,
      authPrice: authOption?.price ?? 0,
      backend: preset.backend,
      backendPrice: backendOption?.price ?? null,
      selectedFeatures,
    });

    get().calculateTotals();
  },

  calculateTotals: () => {
    const state = get();
    let oneTimeSubtotal = 0;
    let monthlyTotal = 0;
    let hasCustomQuote = false;

    // Platform
    if (state.platformPrice === null) {
      hasCustomQuote = true;
    } else {
      oneTimeSubtotal += state.platformPrice;
    }

    // Screens
    if (state.screensPrice === null) {
      hasCustomQuote = true;
    } else {
      oneTimeSubtotal += state.screensPrice;
    }

    // Design
    oneTimeSubtotal += state.designPrice;

    // Auth
    oneTimeSubtotal += state.authPrice;

    // Backend
    if (state.backendPrice === null) {
      hasCustomQuote = true;
    } else {
      oneTimeSubtotal += state.backendPrice;
    }

    // Features
    state.selectedFeatures.forEach((feature) => {
      if (feature.price === null) {
        hasCustomQuote = true;
      } else {
        oneTimeSubtotal += feature.price;
      }
    });

    // AI Features
    state.selectedAIFeatures.forEach((ai) => {
      // Setup (one-time)
      if (ai.setupPrice === null) {
        hasCustomQuote = true;
      } else {
        oneTimeSubtotal += ai.setupPrice;
      }
      // Usage (monthly)
      if (ai.usagePrice === null) {
        hasCustomQuote = true;
      } else if (ai.usagePrice) {
        monthlyTotal += ai.usagePrice;
      }
    });

    // Additional Services
    state.selectedServices.forEach((service) => {
      if (service.customQuote || service.price === null) {
        hasCustomQuote = true;
      } else if (service.recurring === 'monthly') {
        monthlyTotal += service.price;
      } else {
        oneTimeSubtotal += service.price;
      }
    });

    // Timeline multiplier
    const rushFee = Math.round(oneTimeSubtotal * (state.timelineMultiplier - 1));
    const oneTimeTotal = Math.round(oneTimeSubtotal * state.timelineMultiplier);

    set({
      oneTimeSubtotal,
      rushFee,
      oneTimeTotal,
      monthlyTotal,
      hasCustomQuote,
    });
  },

  getCurrentConfig: (): AppConfig => {
    const state = get();
    return {
      appType: state.appType,
      platform: state.platform,
      platformPrice: state.platformPrice,
      screens: state.screens,
      screensPrice: state.screensPrice,
      design: state.design,
      designPrice: state.designPrice,
      auth: state.auth,
      authPrice: state.authPrice,
      backend: state.backend,
      backendPrice: state.backendPrice,
      selectedFeatures: state.selectedFeatures,
      selectedAIFeatures: state.selectedAIFeatures,
      selectedServices: state.selectedServices.map(s => ({
        id: s.id,
        price: s.price ?? 0,
        recurring: s.recurring,
      })),
      timeline: state.timeline,
      timelineMultiplier: state.timelineMultiplier,
      oneTimeSubtotal: state.oneTimeSubtotal,
      rushFee: state.rushFee,
      oneTimeTotal: state.oneTimeTotal,
      monthlyTotal: state.monthlyTotal,
      hasCustomQuote: state.hasCustomQuote,
    };
  },

  saveToUnifiedQuote: () => {
    const config = get().getCurrentConfig();
    useUnifiedQuoteStore.getState().saveServiceConfig('app', config);
  },

  loadFromUnifiedQuote: () => {
    const config = useUnifiedQuoteStore.getState().getServiceConfig<AppConfig>('app');
    if (config) {
      set({
        appType: config.appType,
        platform: config.platform,
        platformPrice: config.platformPrice,
        screens: config.screens,
        screensPrice: config.screensPrice,
        design: config.design,
        designPrice: config.designPrice,
        auth: config.auth,
        authPrice: config.authPrice,
        backend: config.backend,
        backendPrice: config.backendPrice,
        selectedFeatures: config.selectedFeatures,
        selectedAIFeatures: config.selectedAIFeatures,
        selectedServices: config.selectedServices,
        timeline: config.timeline,
        timelineMultiplier: config.timelineMultiplier,
        oneTimeSubtotal: config.oneTimeSubtotal,
        rushFee: config.rushFee,
        oneTimeTotal: config.oneTimeTotal,
        monthlyTotal: config.monthlyTotal,
        hasCustomQuote: config.hasCustomQuote,
      });
      return true;
    }
    return false;
  },

  resetBuilder: () => {
    set(getInitialState());
    // Also clear from unified quote
    useUnifiedQuoteStore.getState().clearServiceConfig('app');
  },
}));
