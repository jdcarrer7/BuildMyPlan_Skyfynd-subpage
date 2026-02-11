// AI Receptionist Builder Configuration Data

// Promo Configuration
export const PROMO_END_DATE = new Date('2026-03-01T00:00:00');

export function isPromoActive(): boolean {
  return new Date() < PROMO_END_DATE;
}

// Base Package Types
export interface BasePackage {
  id: 'starter' | 'business' | 'enterprise' | 'custom';
  name: string;
  monthlyPrice: number;
  displayPrice: number; // Price shown on cards (sum of preset defaults)
  activationFee: number;
  promoActivationFee: number | null;
  tagline: string;
  includes: string[];
  overageRate: number;
}

export const basePackages: BasePackage[] = [
  {
    id: 'starter',
    name: 'Starter Agent',
    monthlyPrice: 0, // Price is calculated from features
    displayPrice: 149, // Sum of starter preset defaults
    activationFee: 199,
    promoActivationFee: 99.50,
    tagline: 'Perfect for small businesses getting started with AI',
    includes: [
      '100 minutes/month',
      '1 local phone number',
      'Basic FAQ responses (up to 25 FAQs)',
      'Lead capture to Google Sheets',
      'Standard AI voice',
      'Business hours availability',
      'Email support',
      'Voicemail fallback',
    ],
    overageRate: 0.35,
  },
  {
    id: 'business',
    name: 'Business Agent',
    monthlyPrice: 0, // Price is calculated from features
    displayPrice: 349, // Sum of business preset defaults
    activationFee: 299,
    promoActivationFee: 149.50,
    tagline: 'For growing businesses needing advanced call handling',
    includes: [
      '300 minutes/month',
      '1 toll-free or local number',
      'Custom-trained AI (up to 100 FAQs)',
      'Appointment scheduling (Google Calendar/Calendly)',
      'CRM integration (HubSpot or Salesforce)',
      'Bilingual support (English + Spanish)',
      'Call transfers to your team',
      'Premium AI voice',
      'Extended hours availability',
      'Priority email support',
      'Call transcripts',
    ],
    overageRate: 0.30,
  },
  {
    id: 'enterprise',
    name: 'Enterprise Agent',
    monthlyPrice: 0, // Price is calculated from features
    displayPrice: 749, // Sum of enterprise preset defaults
    activationFee: 999,
    promoActivationFee: null, // No promo discount
    tagline: 'Full-scale AI receptionist for demanding operations',
    includes: [
      '1,000 minutes/month',
      'Multiple phone numbers (up to 3)',
      'Fully custom AI with unlimited knowledge base',
      'All integrations included',
      'Multilingual support (3+ languages)',
      'Custom voice persona',
      '24/7 availability',
      'Multi-location routing',
      'Advanced analytics dashboard',
      'AI call summaries',
      'Monthly performance reports',
      'Dedicated account manager',
      'White-glove onboarding',
    ],
    overageRate: 0.25,
  },
  {
    id: 'custom',
    name: 'Custom Agent',
    monthlyPrice: 0, // Price is calculated from features
    displayPrice: 149, // Starting price (same as starter base)
    activationFee: 199,
    promoActivationFee: 99.50,
    tagline: 'Full control over every feature',
    includes: ['Build your perfect agent with complete customization'],
    overageRate: 0.35,
  },
];

// Step 2: Phone Setup Options
export interface PhoneNumberTypeOption {
  id: 'local' | 'tollfree' | 'vanity';
  label: string;
  monthlyPrice: number;
  oneTimePrice: number;
  description: string;
}

export const phoneNumberTypeOptions: PhoneNumberTypeOption[] = [
  { id: 'local', label: 'Local Number', monthlyPrice: 5, oneTimePrice: 0, description: 'Standard local area code' },
  { id: 'tollfree', label: 'Toll-Free Number', monthlyPrice: 10, oneTimePrice: 0, description: '800, 888, 877, etc.' },
  { id: 'vanity', label: 'Vanity Number', monthlyPrice: 20, oneTimePrice: 50, description: 'Custom memorable number (subject to availability)' },
];

export interface AdditionalLinesOption {
  id: string;
  label: string;
  lines: number;
  monthlyPrice: number;
  customQuote?: boolean;
}

export const additionalLinesOptions: AdditionalLinesOption[] = [
  { id: '1', label: '1 line', lines: 1, monthlyPrice: 0 },
  { id: '2', label: '2 lines', lines: 2, monthlyPrice: 5 },
  { id: '3', label: '3 lines', lines: 3, monthlyPrice: 10 },
  { id: '5', label: '5 lines', lines: 5, monthlyPrice: 20 },
  { id: '10+', label: '10+ lines', lines: 10, monthlyPrice: 0, customQuote: true },
];

export interface CoverageAreaOption {
  id: 'us' | 'us-canada' | 'international';
  label: string;
  monthlyPrice: number;
  customQuote?: boolean;
}

export const coverageAreaOptions: CoverageAreaOption[] = [
  { id: 'us', label: 'Single Region (US)', monthlyPrice: 0 },
  { id: 'us-canada', label: 'US & Canada', monthlyPrice: 5 },
  { id: 'international', label: 'International', monthlyPrice: 0, customQuote: true },
];

// Step 3: Call Handling Options
export interface MonthlyMinutesOption {
  id: string;
  label: string;
  minutes: number;
  monthlyPrice: number;
  overageRate: number;
  customQuote?: boolean;
}

export const monthlyMinutesOptions: MonthlyMinutesOption[] = [
  { id: '100', label: '100 minutes', minutes: 100, monthlyPrice: 95, overageRate: 0.35 },
  { id: '200', label: '200 minutes', minutes: 200, monthlyPrice: 119, overageRate: 0.35 },
  { id: '300', label: '300 minutes', minutes: 300, monthlyPrice: 149, overageRate: 0.30 },
  { id: '500', label: '500 minutes', minutes: 500, monthlyPrice: 179, overageRate: 0.30 },
  { id: '1000', label: '1,000 minutes', minutes: 1000, monthlyPrice: 229, overageRate: 0.25 },
  { id: '2000', label: '2,000 minutes', minutes: 2000, monthlyPrice: 349, overageRate: 0.25 },
  { id: 'unlimited', label: 'Unlimited', minutes: -1, monthlyPrice: 0, overageRate: 0, customQuote: true },
];

export interface AvailabilityOption {
  id: 'business' | 'extended' | '24/7';
  label: string;
  monthlyPrice: number;
  description: string;
}

export const availabilityOptions: AvailabilityOption[] = [
  { id: 'business', label: 'Business Hours', monthlyPrice: 9, description: '9am-5pm local' },
  { id: 'extended', label: 'Extended Hours', monthlyPrice: 20, description: '7am-9pm local' },
  { id: '24/7', label: '24/7 Availability', monthlyPrice: 35, description: 'Around the clock' },
];

export interface CallTransferOption {
  id: 'none' | 'single' | 'multiple' | 'smart';
  label: string;
  monthlyPrice: number;
  description: string;
}

export const callTransferOptions: CallTransferOption[] = [
  { id: 'none', label: 'No Transfers', monthlyPrice: 0, description: 'Voicemail only' },
  { id: 'single', label: 'Transfer to 1 Number', monthlyPrice: 5, description: 'Single destination' },
  { id: 'multiple', label: 'Transfer to Multiple', monthlyPrice: 10, description: 'Up to 5 numbers' },
  { id: 'smart', label: 'Smart Routing', monthlyPrice: 25, description: 'By department/availability' },
];

export interface VoicemailOption {
  id: 'basic' | 'transcript' | 'ai-summary';
  label: string;
  monthlyPrice: number;
  description: string;
}

export const voicemailOptions: VoicemailOption[] = [
  { id: 'basic', label: 'Basic Voicemail', monthlyPrice: 5, description: 'Standard voicemail' },
  { id: 'transcript', label: 'Voicemail Transcription', monthlyPrice: 10, description: 'Text transcripts of voicemails' },
  { id: 'ai-summary', label: 'Voicemail with AI Summary', monthlyPrice: 15, description: 'AI-generated summaries' },
];

export interface MaxCallDurationOption {
  id: '5' | '10' | '15' | 'unlimited';
  label: string;
  minutes: number | null;
  monthlyPrice: number;
}

export const maxCallDurationOptions: MaxCallDurationOption[] = [
  { id: '5', label: '5 minutes per call', minutes: 5, monthlyPrice: 0 },
  { id: '10', label: '10 minutes per call', minutes: 10, monthlyPrice: 5 },
  { id: '15', label: '15 minutes per call', minutes: 15, monthlyPrice: 12 },
  { id: 'unlimited', label: 'Unlimited duration', minutes: null, monthlyPrice: 20 },
];

// Step 4: AI Capabilities Options
export interface LanguageOption {
  id: 'english' | 'bilingual-spanish' | 'bilingual-other' | 'multilingual';
  label: string;
  monthlyPrice: number;
  description: string;
}

export const languageOptions: LanguageOption[] = [
  { id: 'english', label: 'English Only', monthlyPrice: 10, description: 'Single language support' },
  { id: 'bilingual-spanish', label: 'Bilingual (English + Spanish)', monthlyPrice: 20, description: 'Two language support' },
  { id: 'bilingual-other', label: 'Bilingual (English + Other)', monthlyPrice: 35, description: 'French, German, etc.' },
  { id: 'multilingual', label: 'Multilingual (3+ Languages)', monthlyPrice: 50, description: 'Multiple language support' },
];

export interface VoiceStyleOption {
  id: 'standard' | 'premium' | 'custom' | 'cloned';
  label: string;
  monthlyPrice: number;
  oneTimePrice: number;
  description: string;
}

export const voiceStyleOptions: VoiceStyleOption[] = [
  { id: 'standard', label: 'Standard Professional', monthlyPrice: 10, oneTimePrice: 0, description: 'Default professional voice' },
  { id: 'premium', label: 'Premium Natural Voice', monthlyPrice: 25, oneTimePrice: 0, description: 'ElevenLabs quality' },
  { id: 'custom', label: 'Custom Voice Persona', monthlyPrice: 35, oneTimePrice: 200, description: 'Tailored to your brand' },
  { id: 'cloned', label: 'Voice Cloning', monthlyPrice: 60, oneTimePrice: 500, description: 'Your voice or actor' },
];

export interface KnowledgeBaseSizeOption {
  id: '25' | '50' | '100' | '250' | 'unlimited';
  label: string;
  faqs: number | null;
  monthlyPrice: number;
}

export const knowledgeBaseSizeOptions: KnowledgeBaseSizeOption[] = [
  { id: '25', label: 'Basic (up to 25 FAQs)', faqs: 25, monthlyPrice: 10 },
  { id: '50', label: 'Standard (up to 50 FAQs)', faqs: 50, monthlyPrice: 15 },
  { id: '100', label: 'Expanded (up to 100 FAQs)', faqs: 100, monthlyPrice: 20 },
  { id: '250', label: 'Comprehensive (up to 250 FAQs)', faqs: 250, monthlyPrice: 35 },
  { id: 'unlimited', label: 'Unlimited', faqs: null, monthlyPrice: 50 },
];

export interface ConversationComplexityOption {
  id: 'simple' | 'multiturn' | 'complex' | 'dynamic';
  label: string;
  monthlyPrice: number;
  description: string;
}

export const conversationComplexityOptions: ConversationComplexityOption[] = [
  { id: 'simple', label: 'Simple Q&A', monthlyPrice: 5, description: 'Direct answers' },
  { id: 'multiturn', label: 'Multi-turn Conversations', monthlyPrice: 20, description: 'Context-aware dialogue' },
  { id: 'complex', label: 'Complex Decision Trees', monthlyPrice: 35, description: 'Branching logic' },
  { id: 'dynamic', label: 'Dynamic Responses', monthlyPrice: 50, description: 'Pulls live data' },
];

export interface PersonalityOption {
  id: 'default' | 'custom' | 'industry';
  label: string;
  monthlyPrice: number;
  description: string;
}

export const personalityOptions: PersonalityOption[] = [
  { id: 'default', label: 'Professional & Friendly', monthlyPrice: 0, description: 'Default tone' },
  { id: 'custom', label: 'Custom Personality Brief', monthlyPrice: 10, description: 'Tailored personality' },
  { id: 'industry', label: 'Industry-Specific Persona', monthlyPrice: 20, description: 'Healthcare, legal, etc.' },
];

// Step 5: Integrations Options
export interface LeadCaptureOption {
  id: 'sheets' | 'airtable' | 'notion' | 'hubspot' | 'salesforce' | 'custom';
  label: string;
  monthlyPrice: number;
  oneTimePrice: number;
}

export const leadCaptureOptions: LeadCaptureOption[] = [
  { id: 'sheets', label: 'Google Sheets', monthlyPrice: 0, oneTimePrice: 0 },
  { id: 'airtable', label: 'Airtable', monthlyPrice: 5, oneTimePrice: 0 },
  { id: 'notion', label: 'Notion', monthlyPrice: 5, oneTimePrice: 0 },
  { id: 'hubspot', label: 'HubSpot', monthlyPrice: 20, oneTimePrice: 0 },
  { id: 'salesforce', label: 'Salesforce', monthlyPrice: 25, oneTimePrice: 0 },
  { id: 'custom', label: 'Custom CRM (via API/webhook)', monthlyPrice: 20, oneTimePrice: 150 },
];

export interface CalendarOption {
  id: 'none' | 'google' | 'calendly' | 'cal' | 'acuity' | 'custom';
  label: string;
  monthlyPrice: number;
  oneTimePrice: number;
}

export const calendarOptions: CalendarOption[] = [
  { id: 'none', label: 'None', monthlyPrice: 0, oneTimePrice: 0 },
  { id: 'google', label: 'Google Calendar', monthlyPrice: 10, oneTimePrice: 0 },
  { id: 'calendly', label: 'Calendly', monthlyPrice: 10, oneTimePrice: 0 },
  { id: 'cal', label: 'Cal.com', monthlyPrice: 10, oneTimePrice: 0 },
  { id: 'acuity', label: 'Acuity Scheduling', monthlyPrice: 15, oneTimePrice: 0 },
  { id: 'custom', label: 'Custom Booking System', monthlyPrice: 20, oneTimePrice: 150 },
];

export interface NotificationOption {
  id: 'email' | 'sms' | 'slack' | 'teams' | 'webhook';
  label: string;
  monthlyPrice: number;
}

export const notificationOptions: NotificationOption[] = [
  { id: 'email', label: 'Email Notifications', monthlyPrice: 0 },
  { id: 'sms', label: 'SMS Notifications', monthlyPrice: 5 },
  { id: 'slack', label: 'Slack Notifications', monthlyPrice: 5 },
  { id: 'teams', label: 'Microsoft Teams', monthlyPrice: 8 },
  { id: 'webhook', label: 'Custom Webhook', monthlyPrice: 12 },
];

export interface AdditionalIntegrationOption {
  id: 'zapier' | 'make' | 'custom-api';
  label: string;
  monthlyPrice: number;
  oneTimePrice: number;
}

export const additionalIntegrationOptions: AdditionalIntegrationOption[] = [
  { id: 'zapier', label: 'Zapier Connection', monthlyPrice: 5, oneTimePrice: 0 },
  { id: 'make', label: 'Make (Integromat)', monthlyPrice: 5, oneTimePrice: 0 },
  { id: 'custom-api', label: 'Custom API Endpoint', monthlyPrice: 15, oneTimePrice: 100 },
];

// Step 6: Reporting & Analytics Options
export interface TranscriptsOption {
  id: 'none' | 'full';
  label: string;
  monthlyPrice: number;
}

export const transcriptsOptions: TranscriptsOption[] = [
  { id: 'none', label: 'No Transcripts', monthlyPrice: 0 },
  { id: 'full', label: 'Full Call Transcripts', monthlyPrice: 10 },
];

export interface AISummariesOption {
  id: 'none' | 'enabled';
  label: string;
  monthlyPrice: number;
}

export const aiSummariesOptions: AISummariesOption[] = [
  { id: 'none', label: 'No Summaries', monthlyPrice: 0 },
  { id: 'enabled', label: 'AI-Generated Call Summaries', monthlyPrice: 20 },
];

export interface AnalyticsLevelOption {
  id: 'basic' | 'standard' | 'advanced';
  label: string;
  monthlyPrice: number;
  description: string;
}

export const analyticsLevelOptions: AnalyticsLevelOption[] = [
  { id: 'basic', label: 'Basic Metrics', monthlyPrice: 0, description: 'Call count, duration' },
  { id: 'standard', label: 'Standard Dashboard', monthlyPrice: 10, description: 'Trends, patterns' },
  { id: 'advanced', label: 'Advanced Analytics', monthlyPrice: 25, description: 'Sentiment, insights' },
];

export interface ReportingFrequencyOption {
  id: 'none' | 'weekly' | 'monthly' | 'custom';
  label: string;
  monthlyPrice: number;
}

export const reportingFrequencyOptions: ReportingFrequencyOption[] = [
  { id: 'none', label: 'Self-Serve (Dashboard)', monthlyPrice: 0 },
  { id: 'weekly', label: 'Weekly Email Reports', monthlyPrice: 5 },
  { id: 'monthly', label: 'Monthly Performance Reports', monthlyPrice: 15 },
  { id: 'custom', label: 'Custom Reporting Schedule', monthlyPrice: 30 },
];

// Step 7: Support & Onboarding Options
export interface OnboardingTypeOption {
  id: 'self' | 'guided' | 'whiteglove';
  label: string;
  oneTimePrice: number;
  description: string;
}

export const onboardingTypeOptions: OnboardingTypeOption[] = [
  { id: 'self', label: 'Self-Serve', oneTimePrice: 0, description: 'Documentation + guides' },
  { id: 'guided', label: 'Guided Setup', oneTimePrice: 150, description: '1-hour call + config' },
  { id: 'whiteglove', label: 'White-Glove', oneTimePrice: 400, description: 'Full done-for-you setup' },
];

export interface KnowledgeUpdatesOption {
  id: 'self' | 'monthly' | 'unlimited';
  label: string;
  monthlyPrice: number;
  description: string;
}

export const knowledgeUpdatesOptions: KnowledgeUpdatesOption[] = [
  { id: 'self', label: 'Self-Serve', monthlyPrice: 0, description: 'You update via portal' },
  { id: 'monthly', label: 'Monthly Refresh', monthlyPrice: 15, description: 'We update monthly' },
  { id: 'unlimited', label: 'Unlimited Updates', monthlyPrice: 35, description: 'Request anytime' },
];

export interface SupportLevelOption {
  id: 'email' | 'priority' | 'priority-chat' | 'dedicated';
  label: string;
  monthlyPrice: number;
  description: string;
}

export const supportLevelOptions: SupportLevelOption[] = [
  { id: 'email', label: 'Email Support', monthlyPrice: 0, description: '48hr response' },
  { id: 'priority', label: 'Priority Email', monthlyPrice: 10, description: '24hr response' },
  { id: 'priority-chat', label: 'Priority + Live Chat', monthlyPrice: 25, description: 'Chat support included' },
  { id: 'dedicated', label: 'Dedicated Account Manager', monthlyPrice: 40, description: 'Personal support' },
];

// Package Presets (defaults for each package)
export interface PackagePreset {
  phoneNumberType: 'local' | 'tollfree' | 'vanity';
  additionalLines: string;
  coverageArea: 'us' | 'us-canada' | 'international';
  monthlyMinutes: string;
  availability: 'business' | 'extended' | '24/7';
  callTransfer: 'none' | 'single' | 'multiple' | 'smart';
  voicemailType: 'basic' | 'transcript' | 'ai-summary';
  maxCallDuration: '5' | '10' | '15' | 'unlimited';
  language: 'english' | 'bilingual-spanish' | 'bilingual-other' | 'multilingual';
  voiceStyle: 'standard' | 'premium' | 'custom' | 'cloned';
  knowledgeBaseSize: '25' | '50' | '100' | '250' | 'unlimited';
  conversationComplexity: 'simple' | 'multiturn' | 'complex' | 'dynamic';
  personality: 'default' | 'custom' | 'industry';
  leadCapture: 'sheets' | 'airtable' | 'notion' | 'hubspot' | 'salesforce' | 'custom';
  calendar: 'none' | 'google' | 'calendly' | 'cal' | 'acuity' | 'custom';
  notifications: string[];
  additionalIntegrations: string[];
  transcripts: 'none' | 'full';
  aiSummaries: 'none' | 'enabled';
  analyticsLevel: 'basic' | 'standard' | 'advanced';
  reportingFrequency: 'none' | 'weekly' | 'monthly' | 'custom';
  onboardingType: 'self' | 'guided' | 'whiteglove';
  knowledgeUpdates: 'self' | 'monthly' | 'unlimited';
  supportLevel: 'email' | 'priority' | 'priority-chat' | 'dedicated';
}

export const packagePresets: Record<string, PackagePreset> = {
  starter: {
    phoneNumberType: 'local',
    additionalLines: '1',
    coverageArea: 'us',
    monthlyMinutes: '100',
    availability: 'business',
    callTransfer: 'none',
    voicemailType: 'basic',
    maxCallDuration: '5',
    language: 'english',
    voiceStyle: 'standard',
    knowledgeBaseSize: '25',
    conversationComplexity: 'simple',
    personality: 'default',
    leadCapture: 'sheets',
    calendar: 'none',
    notifications: ['email'],
    additionalIntegrations: [],
    transcripts: 'none',
    aiSummaries: 'none',
    analyticsLevel: 'basic',
    reportingFrequency: 'none',
    onboardingType: 'self',
    knowledgeUpdates: 'self',
    supportLevel: 'email',
  },
  business: {
    phoneNumberType: 'tollfree',
    additionalLines: '1',
    coverageArea: 'us',
    monthlyMinutes: '300',
    availability: 'extended',
    callTransfer: 'multiple',
    voicemailType: 'transcript',
    maxCallDuration: '10',
    language: 'bilingual-spanish',
    voiceStyle: 'premium',
    knowledgeBaseSize: '100',
    conversationComplexity: 'multiturn',
    personality: 'default',
    leadCapture: 'hubspot',
    calendar: 'google',
    notifications: ['email'],
    additionalIntegrations: [],
    transcripts: 'full',
    aiSummaries: 'none',
    analyticsLevel: 'standard',
    reportingFrequency: 'none',
    onboardingType: 'guided',
    knowledgeUpdates: 'self',
    supportLevel: 'priority',
  },
  enterprise: {
    phoneNumberType: 'tollfree',
    additionalLines: '3',
    coverageArea: 'us',
    monthlyMinutes: '1000',
    availability: '24/7',
    callTransfer: 'smart',
    voicemailType: 'ai-summary',
    maxCallDuration: 'unlimited',
    language: 'multilingual',
    voiceStyle: 'custom',
    knowledgeBaseSize: 'unlimited',
    conversationComplexity: 'dynamic',
    personality: 'industry',
    leadCapture: 'salesforce',
    calendar: 'custom',
    notifications: ['email', 'slack'],
    additionalIntegrations: ['zapier'],
    transcripts: 'full',
    aiSummaries: 'enabled',
    analyticsLevel: 'advanced',
    reportingFrequency: 'monthly',
    onboardingType: 'whiteglove',
    knowledgeUpdates: 'unlimited',
    supportLevel: 'dedicated',
  },
  custom: {
    phoneNumberType: 'local',
    additionalLines: '1',
    coverageArea: 'us',
    monthlyMinutes: '100',
    availability: 'business',
    callTransfer: 'none',
    voicemailType: 'basic',
    maxCallDuration: '5',
    language: 'english',
    voiceStyle: 'standard',
    knowledgeBaseSize: '25',
    conversationComplexity: 'simple',
    personality: 'default',
    leadCapture: 'sheets',
    calendar: 'none',
    notifications: ['email'],
    additionalIntegrations: [],
    transcripts: 'none',
    aiSummaries: 'none',
    analyticsLevel: 'basic',
    reportingFrequency: 'none',
    onboardingType: 'self',
    knowledgeUpdates: 'self',
    supportLevel: 'email',
  },
};

// Helper functions
export const getBasePackageById = (id: string): BasePackage | undefined => {
  return basePackages.find((p) => p.id === id);
};

export const getActivationFee = (packageId: string): { regular: number; promo: number | null; promoActive: boolean } => {
  const pkg = getBasePackageById(packageId);
  if (!pkg) return { regular: 199, promo: null, promoActive: false };

  const promoActive = isPromoActive();
  return {
    regular: pkg.activationFee,
    promo: promoActive ? pkg.promoActivationFee : null,
    promoActive,
  };
};
