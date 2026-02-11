import { create } from 'zustand';
import { useUnifiedQuoteStore, AIReceptionistConfig } from './useUnifiedQuoteStore';
import {
  basePackages,
  packagePresets,
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
  isPromoActive,
} from '@/data/aiReceptionistBuilder';

interface AIReceptionistBuilderState {
  // Navigation
  currentStep: number;

  // Step 1: Base Package
  basePackage: 'starter' | 'business' | 'enterprise' | 'custom' | null;

  // Step 2: Phone Setup
  phoneNumberType: 'local' | 'tollfree' | 'vanity' | null;
  additionalLines: string | null;
  coverageArea: 'us' | 'us-canada' | 'international' | null;

  // Step 3: Call Handling
  monthlyMinutes: string | null;
  availability: 'business' | 'extended' | '24/7' | null;
  callTransfer: 'none' | 'single' | 'multiple' | 'smart' | null;
  voicemailType: 'basic' | 'transcript' | 'ai-summary' | null;
  maxCallDuration: '5' | '10' | '15' | 'unlimited' | null;

  // Step 4: AI Capabilities
  language: 'english' | 'bilingual-spanish' | 'bilingual-other' | 'multilingual' | null;
  voiceStyle: 'standard' | 'premium' | 'custom' | 'cloned' | null;
  knowledgeBaseSize: '25' | '50' | '100' | '250' | 'unlimited' | null;
  conversationComplexity: 'simple' | 'multiturn' | 'complex' | 'dynamic' | null;
  personality: 'default' | 'custom' | 'industry' | null;

  // Step 5: Integrations
  leadCapture: 'sheets' | 'airtable' | 'notion' | 'hubspot' | 'salesforce' | 'custom' | null;
  calendar: 'none' | 'google' | 'calendly' | 'cal' | 'acuity' | 'custom' | null;
  notifications: string[];
  additionalIntegrations: string[];

  // Step 6: Reporting & Analytics
  transcripts: 'none' | 'full' | null;
  aiSummaries: 'none' | 'enabled' | null;
  analyticsLevel: 'basic' | 'standard' | 'advanced' | null;
  reportingFrequency: 'none' | 'weekly' | 'monthly' | 'custom' | null;

  // Step 7: Support & Onboarding
  onboardingType: 'self' | 'guided' | 'whiteglove' | null;
  knowledgeUpdates: 'self' | 'monthly' | 'unlimited' | null;
  supportLevel: 'email' | 'priority' | 'priority-chat' | 'dedicated' | null;

  // Calculated totals
  monthlySubtotal: number;
  oneTimeTotal: number;
  promoDiscount: number;
  monthlyTotal: number;
  hasCustomQuote: boolean;

  // Actions
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;

  setBasePackage: (id: 'starter' | 'business' | 'enterprise' | 'custom') => void;

  // Step 2 setters
  setPhoneNumberType: (id: 'local' | 'tollfree' | 'vanity') => void;
  setAdditionalLines: (id: string) => void;
  setCoverageArea: (id: 'us' | 'us-canada' | 'international') => void;

  // Step 3 setters
  setMonthlyMinutes: (id: string) => void;
  setAvailability: (id: 'business' | 'extended' | '24/7') => void;
  setCallTransfer: (id: 'none' | 'single' | 'multiple' | 'smart') => void;
  setVoicemailType: (id: 'basic' | 'transcript' | 'ai-summary') => void;
  setMaxCallDuration: (id: '5' | '10' | '15' | 'unlimited') => void;

  // Step 4 setters
  setLanguage: (id: 'english' | 'bilingual-spanish' | 'bilingual-other' | 'multilingual') => void;
  setVoiceStyle: (id: 'standard' | 'premium' | 'custom' | 'cloned') => void;
  setKnowledgeBaseSize: (id: '25' | '50' | '100' | '250' | 'unlimited') => void;
  setConversationComplexity: (id: 'simple' | 'multiturn' | 'complex' | 'dynamic') => void;
  setPersonality: (id: 'default' | 'custom' | 'industry') => void;

  // Step 5 setters
  setLeadCapture: (id: 'sheets' | 'airtable' | 'notion' | 'hubspot' | 'salesforce' | 'custom') => void;
  setCalendar: (id: 'none' | 'google' | 'calendly' | 'cal' | 'acuity' | 'custom') => void;
  toggleNotification: (id: string) => void;
  toggleAdditionalIntegration: (id: string) => void;

  // Step 6 setters
  setTranscripts: (id: 'none' | 'full') => void;
  setAiSummaries: (id: 'none' | 'enabled') => void;
  setAnalyticsLevel: (id: 'basic' | 'standard' | 'advanced') => void;
  setReportingFrequency: (id: 'none' | 'weekly' | 'monthly' | 'custom') => void;

  // Step 7 setters
  setOnboardingType: (id: 'self' | 'guided' | 'whiteglove') => void;
  setKnowledgeUpdates: (id: 'self' | 'monthly' | 'unlimited') => void;
  setSupportLevel: (id: 'email' | 'priority' | 'priority-chat' | 'dedicated') => void;

  // Utility actions
  calculateTotals: () => void;
  resetBuilder: () => void;
  saveToUnifiedQuote: () => void;
  loadFromUnifiedQuote: () => boolean;
  getCurrentConfig: () => AIReceptionistConfig;
}

export const useAIReceptionistBuilderStore = create<AIReceptionistBuilderState>((set, get) => ({
  // Initial state
  currentStep: 1,
  basePackage: null,

  // Step 2
  phoneNumberType: null,
  additionalLines: null,
  coverageArea: null,

  // Step 3
  monthlyMinutes: null,
  availability: null,
  callTransfer: null,
  voicemailType: null,
  maxCallDuration: null,

  // Step 4
  language: null,
  voiceStyle: null,
  knowledgeBaseSize: null,
  conversationComplexity: null,
  personality: null,

  // Step 5
  leadCapture: null,
  calendar: null,
  notifications: [],
  additionalIntegrations: [],

  // Step 6
  transcripts: null,
  aiSummaries: null,
  analyticsLevel: null,
  reportingFrequency: null,

  // Step 7
  onboardingType: null,
  knowledgeUpdates: null,
  supportLevel: null,

  // Totals
  monthlySubtotal: 0,
  oneTimeTotal: 0,
  promoDiscount: 0,
  monthlyTotal: 0,
  hasCustomQuote: false,

  // Navigation actions
  setStep: (step) => set({ currentStep: step }),
  nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, 8) })),
  prevStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) })),

  // Set base package and apply preset defaults
  setBasePackage: (id) => {
    const preset = packagePresets[id];
    if (!preset) {
      set({ basePackage: id });
      get().calculateTotals();
      return;
    }

    set({
      basePackage: id,
      phoneNumberType: preset.phoneNumberType,
      additionalLines: preset.additionalLines,
      coverageArea: preset.coverageArea,
      monthlyMinutes: preset.monthlyMinutes,
      availability: preset.availability,
      callTransfer: preset.callTransfer,
      voicemailType: preset.voicemailType,
      maxCallDuration: preset.maxCallDuration,
      language: preset.language,
      voiceStyle: preset.voiceStyle,
      knowledgeBaseSize: preset.knowledgeBaseSize,
      conversationComplexity: preset.conversationComplexity,
      personality: preset.personality,
      leadCapture: preset.leadCapture,
      calendar: preset.calendar,
      notifications: [...preset.notifications],
      additionalIntegrations: [...preset.additionalIntegrations],
      transcripts: preset.transcripts,
      aiSummaries: preset.aiSummaries,
      analyticsLevel: preset.analyticsLevel,
      reportingFrequency: preset.reportingFrequency,
      onboardingType: preset.onboardingType,
      knowledgeUpdates: preset.knowledgeUpdates,
      supportLevel: preset.supportLevel,
    });
    get().calculateTotals();
  },

  // Step 2 setters
  setPhoneNumberType: (id) => {
    set({ phoneNumberType: id });
    get().calculateTotals();
  },

  setAdditionalLines: (id) => {
    set({ additionalLines: id });
    get().calculateTotals();
  },

  setCoverageArea: (id) => {
    set({ coverageArea: id });
    get().calculateTotals();
  },

  // Step 3 setters
  setMonthlyMinutes: (id) => {
    set({ monthlyMinutes: id });
    get().calculateTotals();
  },

  setAvailability: (id) => {
    set({ availability: id });
    get().calculateTotals();
  },

  setCallTransfer: (id) => {
    set({ callTransfer: id });
    get().calculateTotals();
  },

  setVoicemailType: (id) => {
    set({ voicemailType: id });
    get().calculateTotals();
  },

  setMaxCallDuration: (id) => {
    set({ maxCallDuration: id });
    get().calculateTotals();
  },

  // Step 4 setters
  setLanguage: (id) => {
    set({ language: id });
    get().calculateTotals();
  },

  setVoiceStyle: (id) => {
    set({ voiceStyle: id });
    get().calculateTotals();
  },

  setKnowledgeBaseSize: (id) => {
    set({ knowledgeBaseSize: id });
    get().calculateTotals();
  },

  setConversationComplexity: (id) => {
    set({ conversationComplexity: id });
    get().calculateTotals();
  },

  setPersonality: (id) => {
    set({ personality: id });
    get().calculateTotals();
  },

  // Step 5 setters
  setLeadCapture: (id) => {
    set({ leadCapture: id });
    get().calculateTotals();
  },

  setCalendar: (id) => {
    set({ calendar: id });
    get().calculateTotals();
  },

  toggleNotification: (id) => {
    const { notifications } = get();
    const isSelected = notifications.includes(id);
    if (isSelected) {
      set({ notifications: notifications.filter((n) => n !== id) });
    } else {
      set({ notifications: [...notifications, id] });
    }
    get().calculateTotals();
  },

  toggleAdditionalIntegration: (id) => {
    const { additionalIntegrations } = get();
    const isSelected = additionalIntegrations.includes(id);
    if (isSelected) {
      set({ additionalIntegrations: additionalIntegrations.filter((i) => i !== id) });
    } else {
      set({ additionalIntegrations: [...additionalIntegrations, id] });
    }
    get().calculateTotals();
  },

  // Step 6 setters
  setTranscripts: (id) => {
    set({ transcripts: id });
    get().calculateTotals();
  },

  setAiSummaries: (id) => {
    set({ aiSummaries: id });
    get().calculateTotals();
  },

  setAnalyticsLevel: (id) => {
    set({ analyticsLevel: id });
    get().calculateTotals();
  },

  setReportingFrequency: (id) => {
    set({ reportingFrequency: id });
    get().calculateTotals();
  },

  // Step 7 setters
  setOnboardingType: (id) => {
    set({ onboardingType: id });
    get().calculateTotals();
  },

  setKnowledgeUpdates: (id) => {
    set({ knowledgeUpdates: id });
    get().calculateTotals();
  },

  setSupportLevel: (id) => {
    set({ supportLevel: id });
    get().calculateTotals();
  },

  // Calculate totals
  calculateTotals: () => {
    const state = get();
    let monthlySubtotal = 0;
    let oneTimeTotal = 0;
    let hasCustomQuote = false;

    // Base package monthly price + activation fee
    const basePkg = basePackages.find((p) => p.id === state.basePackage);
    if (basePkg) {
      monthlySubtotal += basePkg.monthlyPrice;
      oneTimeTotal += basePkg.activationFee;
    }

    // Step 2: Phone Setup
    const phoneType = phoneNumberTypeOptions.find((o) => o.id === state.phoneNumberType);
    if (phoneType) {
      monthlySubtotal += phoneType.monthlyPrice;
      oneTimeTotal += phoneType.oneTimePrice;
    }

    const lines = additionalLinesOptions.find((o) => o.id === state.additionalLines);
    if (lines) {
      if (lines.customQuote) {
        hasCustomQuote = true;
      } else {
        monthlySubtotal += lines.monthlyPrice;
      }
    }

    const coverage = coverageAreaOptions.find((o) => o.id === state.coverageArea);
    if (coverage) {
      if (coverage.customQuote) {
        hasCustomQuote = true;
      } else {
        monthlySubtotal += coverage.monthlyPrice;
      }
    }

    // Step 3: Call Handling
    const minutes = monthlyMinutesOptions.find((o) => o.id === state.monthlyMinutes);
    if (minutes) {
      if (minutes.customQuote) {
        hasCustomQuote = true;
      } else {
        monthlySubtotal += minutes.monthlyPrice;
      }
    }

    const avail = availabilityOptions.find((o) => o.id === state.availability);
    if (avail) {
      monthlySubtotal += avail.monthlyPrice;
    }

    const transfer = callTransferOptions.find((o) => o.id === state.callTransfer);
    if (transfer) {
      monthlySubtotal += transfer.monthlyPrice;
    }

    const voicemail = voicemailOptions.find((o) => o.id === state.voicemailType);
    if (voicemail) {
      monthlySubtotal += voicemail.monthlyPrice;
    }

    const duration = maxCallDurationOptions.find((o) => o.id === state.maxCallDuration);
    if (duration) {
      monthlySubtotal += duration.monthlyPrice;
    }

    // Step 4: AI Capabilities
    const lang = languageOptions.find((o) => o.id === state.language);
    if (lang) {
      monthlySubtotal += lang.monthlyPrice;
    }

    const voice = voiceStyleOptions.find((o) => o.id === state.voiceStyle);
    if (voice) {
      monthlySubtotal += voice.monthlyPrice;
      oneTimeTotal += voice.oneTimePrice;
    }

    const kb = knowledgeBaseSizeOptions.find((o) => o.id === state.knowledgeBaseSize);
    if (kb) {
      monthlySubtotal += kb.monthlyPrice;
    }

    const complexity = conversationComplexityOptions.find((o) => o.id === state.conversationComplexity);
    if (complexity) {
      monthlySubtotal += complexity.monthlyPrice;
    }

    const pers = personalityOptions.find((o) => o.id === state.personality);
    if (pers) {
      monthlySubtotal += pers.monthlyPrice;
    }

    // Step 5: Integrations
    const lead = leadCaptureOptions.find((o) => o.id === state.leadCapture);
    if (lead) {
      monthlySubtotal += lead.monthlyPrice;
      oneTimeTotal += lead.oneTimePrice;
    }

    const cal = calendarOptions.find((o) => o.id === state.calendar);
    if (cal) {
      monthlySubtotal += cal.monthlyPrice;
      oneTimeTotal += cal.oneTimePrice;
    }

    // Notifications
    state.notifications.forEach((notifId) => {
      const notif = notificationOptions.find((o) => o.id === notifId);
      if (notif) {
        monthlySubtotal += notif.monthlyPrice;
      }
    });

    // Additional integrations
    state.additionalIntegrations.forEach((intId) => {
      const integration = additionalIntegrationOptions.find((o) => o.id === intId);
      if (integration) {
        monthlySubtotal += integration.monthlyPrice;
        oneTimeTotal += integration.oneTimePrice;
      }
    });

    // Step 6: Reporting & Analytics
    const trans = transcriptsOptions.find((o) => o.id === state.transcripts);
    if (trans) {
      monthlySubtotal += trans.monthlyPrice;
    }

    const aiSum = aiSummariesOptions.find((o) => o.id === state.aiSummaries);
    if (aiSum) {
      monthlySubtotal += aiSum.monthlyPrice;
    }

    const analytics = analyticsLevelOptions.find((o) => o.id === state.analyticsLevel);
    if (analytics) {
      monthlySubtotal += analytics.monthlyPrice;
    }

    const reporting = reportingFrequencyOptions.find((o) => o.id === state.reportingFrequency);
    if (reporting) {
      monthlySubtotal += reporting.monthlyPrice;
    }

    // Step 7: Support & Onboarding
    const onboarding = onboardingTypeOptions.find((o) => o.id === state.onboardingType);
    if (onboarding) {
      oneTimeTotal += onboarding.oneTimePrice;
    }

    const updates = knowledgeUpdatesOptions.find((o) => o.id === state.knowledgeUpdates);
    if (updates) {
      monthlySubtotal += updates.monthlyPrice;
    }

    const support = supportLevelOptions.find((o) => o.id === state.supportLevel);
    if (support) {
      monthlySubtotal += support.monthlyPrice;
    }

    // Calculate promo discount (50% off activation for starter/business only, before March 1, 2026)
    let promoDiscount = 0;
    if (isPromoActive() && basePkg && (state.basePackage === 'starter' || state.basePackage === 'business' || state.basePackage === 'custom')) {
      if (basePkg.promoActivationFee !== null) {
        promoDiscount = basePkg.activationFee - basePkg.promoActivationFee;
      }
    }

    const finalOneTimeTotal = oneTimeTotal - promoDiscount;
    const monthlyTotal = monthlySubtotal;

    set({
      monthlySubtotal,
      oneTimeTotal: finalOneTimeTotal,
      promoDiscount,
      monthlyTotal,
      hasCustomQuote,
    });
  },

  // Reset builder
  resetBuilder: () => {
    useUnifiedQuoteStore.getState().clearServiceConfig('ai-receptionist');
    set({
      currentStep: 1,
      basePackage: null,
      phoneNumberType: null,
      additionalLines: null,
      coverageArea: null,
      monthlyMinutes: null,
      availability: null,
      callTransfer: null,
      voicemailType: null,
      maxCallDuration: null,
      language: null,
      voiceStyle: null,
      knowledgeBaseSize: null,
      conversationComplexity: null,
      personality: null,
      leadCapture: null,
      calendar: null,
      notifications: [],
      additionalIntegrations: [],
      transcripts: null,
      aiSummaries: null,
      analyticsLevel: null,
      reportingFrequency: null,
      onboardingType: null,
      knowledgeUpdates: null,
      supportLevel: null,
      monthlySubtotal: 0,
      oneTimeTotal: 0,
      promoDiscount: 0,
      monthlyTotal: 0,
      hasCustomQuote: false,
    });
  },

  // Get current config
  getCurrentConfig: (): AIReceptionistConfig => {
    const state = get();
    return {
      basePackage: state.basePackage,
      phoneNumberType: state.phoneNumberType,
      additionalLines: state.additionalLines,
      coverageArea: state.coverageArea,
      monthlyMinutes: state.monthlyMinutes,
      availability: state.availability,
      callTransfer: state.callTransfer,
      voicemailType: state.voicemailType,
      maxCallDuration: state.maxCallDuration,
      language: state.language,
      voiceStyle: state.voiceStyle,
      knowledgeBaseSize: state.knowledgeBaseSize,
      conversationComplexity: state.conversationComplexity,
      personality: state.personality,
      leadCapture: state.leadCapture,
      calendar: state.calendar,
      notifications: state.notifications,
      additionalIntegrations: state.additionalIntegrations,
      transcripts: state.transcripts,
      aiSummaries: state.aiSummaries,
      analyticsLevel: state.analyticsLevel,
      reportingFrequency: state.reportingFrequency,
      onboardingType: state.onboardingType,
      knowledgeUpdates: state.knowledgeUpdates,
      supportLevel: state.supportLevel,
      monthlySubtotal: state.monthlySubtotal,
      oneTimeTotal: state.oneTimeTotal,
      promoDiscount: state.promoDiscount,
      monthlyTotal: state.monthlyTotal,
      hasCustomQuote: state.hasCustomQuote,
    };
  },

  // Save to unified quote
  saveToUnifiedQuote: () => {
    const config = get().getCurrentConfig();
    useUnifiedQuoteStore.getState().saveServiceConfig('ai-receptionist', config);
  },

  // Load from unified quote
  loadFromUnifiedQuote: () => {
    const config = useUnifiedQuoteStore.getState().getServiceConfig<AIReceptionistConfig>('ai-receptionist');
    if (config) {
      set({
        basePackage: config.basePackage,
        phoneNumberType: config.phoneNumberType,
        additionalLines: config.additionalLines,
        coverageArea: config.coverageArea,
        monthlyMinutes: config.monthlyMinutes,
        availability: config.availability,
        callTransfer: config.callTransfer,
        voicemailType: config.voicemailType,
        maxCallDuration: config.maxCallDuration,
        language: config.language,
        voiceStyle: config.voiceStyle,
        knowledgeBaseSize: config.knowledgeBaseSize,
        conversationComplexity: config.conversationComplexity,
        personality: config.personality,
        leadCapture: config.leadCapture,
        calendar: config.calendar,
        notifications: config.notifications || [],
        additionalIntegrations: config.additionalIntegrations || [],
        transcripts: config.transcripts,
        aiSummaries: config.aiSummaries,
        analyticsLevel: config.analyticsLevel,
        reportingFrequency: config.reportingFrequency,
        onboardingType: config.onboardingType,
        knowledgeUpdates: config.knowledgeUpdates,
        supportLevel: config.supportLevel,
        monthlySubtotal: config.monthlySubtotal,
        oneTimeTotal: config.oneTimeTotal,
        promoDiscount: config.promoDiscount,
        monthlyTotal: config.monthlyTotal,
        hasCustomQuote: config.hasCustomQuote,
      });
      return true;
    }
    return false;
  },
}));
