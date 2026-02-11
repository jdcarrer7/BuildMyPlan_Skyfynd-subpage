// App Builder Configuration Data

export interface AppTypeOption {
  id: string;
  label: string;
  tooltip: {
    whatItIs: string;
    idealIf: string;
    examples: string;
  };
}

export interface PlatformOption {
  id: string;
  label: string;
  price: number | null;
  startsAt?: boolean;
  tooltip: string;
  recommended?: boolean;
  description?: string;
}

export interface ScreenOption {
  id: string;
  label: string;
  price: number | null;
  customQuote?: boolean;
  tooltip: string;
  description?: string;
}

export interface DesignOption {
  id: string;
  label: string;
  price: number;
  tooltip: string;
  description?: string;
  popular?: boolean;
}

export interface AuthOption {
  id: string;
  label: string;
  price: number;
  startsAt?: boolean;
  tooltip: string;
  description?: string;
}

export interface BackendOption {
  id: string;
  label: string;
  price: number | null;
  startsAt?: boolean;
  tooltip: string;
  description?: string;
  recommended?: boolean;
}

export interface FeatureTier {
  id: string;
  label: string;
  price: number | null;
  description: string;
  startsAt?: boolean;
}

export interface Feature {
  id: string;
  name: string;
  defaultTier: string;
  options: FeatureTier[];
}

export interface AIFeatureSetup {
  id: string;
  label: string;
  price: number | null;
  startsAt?: boolean;
  description?: string;
}

export interface AIFeatureUsage {
  id: string;
  label: string;
  price: number | null;
  includes: string;
  custom?: boolean;
  description?: string;
}

export interface AIFeature {
  id: string;
  name: string;
  defaultSetupTier: string;
  defaultUsageTier: string;
  setupOptions: AIFeatureSetup[];
  usageOptions: AIFeatureUsage[];
}

export interface ServiceTierOption {
  id: string;
  label: string;
  price: number;
  description: string;
}

export interface AdditionalService {
  id: string;
  label: string;
  name?: string;
  price: number | null;
  startsAt?: boolean;
  recurring?: 'monthly';
  included?: boolean;
  customQuote?: boolean;
  tooltip: string;
  description?: string;
  options?: ServiceTierOption[];
  defaultOption?: string;
}

export interface TimelineOption {
  id: string;
  label: string;
  multiplier: number;
  tooltip: string;
  recommended?: boolean;
}

export interface RecommendationPreset {
  platform: string;
  screens: string;
  design: string;
  auth: string;
  backend: string;
  features: string[];
}

// App Types (Step 1)
export const appTypes: AppTypeOption[] = [
  {
    id: 'mobile',
    label: 'Mobile App',
    tooltip: {
      whatItIs: 'A native or cross-platform app for iOS and/or Android devices.',
      idealIf: 'You want users to download from the App Store or Google Play.',
      examples: 'Instagram, Uber, Duolingo',
    },
  },
  {
    id: 'web',
    label: 'Web App',
    tooltip: {
      whatItIs: 'An application that runs in a browser, no download required.',
      idealIf: 'You want easy access across all devices without app store approval.',
      examples: 'Notion, Figma, Google Docs',
    },
  },
  {
    id: 'desktop',
    label: 'Desktop App',
    tooltip: {
      whatItIs: 'Software installed on Mac or Windows computers.',
      idealIf: 'You need offline functionality or system-level access.',
      examples: 'Slack, VS Code, Spotify',
    },
  },
  {
    id: 'cross-platform',
    label: 'Cross-platform (Mobile + Web)',
    tooltip: {
      whatItIs: 'One codebase that works on mobile devices and browsers.',
      idealIf: 'You want maximum reach with a single development effort.',
      examples: 'Discord, Airbnb',
    },
  },
  {
    id: 'ecosystem',
    label: 'Full Ecosystem (Mobile + Web + Desktop)',
    tooltip: {
      whatItIs: 'A complete suite across all platforms with synced experience.',
      idealIf: "You're building a product that users access anywhere.",
      examples: 'Notion, Spotify, Microsoft Teams',
    },
  },
  {
    id: 'other',
    label: 'Other',
    tooltip: {
      whatItIs: 'Something unique or hybrid.',
      idealIf: "Your project doesn't fit standard categories — we'll tailor recommendations.",
      examples: 'Custom projects',
    },
  },
];

// Recommendation Presets based on App Type
export const appRecommendationPresets: Record<string, RecommendationPreset> = {
  mobile: {
    platform: 'ios-android',
    screens: 'standard',
    design: 'custom',
    auth: 'social',
    backend: 'standard',
    features: ['pushNotifications', 'analytics'],
  },
  web: {
    platform: 'web',
    screens: 'standard',
    design: 'custom',
    auth: 'basic',
    backend: 'standard',
    features: ['analytics'],
  },
  desktop: {
    platform: 'desktop-single',
    screens: 'standard',
    design: 'custom',
    auth: 'basic',
    backend: 'simple',
    features: ['offlineMode', 'analytics'],
  },
  'cross-platform': {
    platform: 'web-ios-android',
    screens: 'standard',
    design: 'custom',
    auth: 'social',
    backend: 'standard',
    features: ['pushNotifications', 'analytics'],
  },
  ecosystem: {
    platform: 'all',
    screens: 'complex',
    design: 'premium',
    auth: 'advanced',
    backend: 'complex',
    features: ['pushNotifications', 'offlineMode', 'analytics'],
  },
  other: {
    platform: 'web',
    screens: 'simple',
    design: 'template',
    auth: 'none',
    backend: 'simple',
    features: ['analytics'],
  },
};

// Platform Options (Step 2)
export const platformOptions: PlatformOption[] = [
  { id: 'web', label: 'Web only', price: 500, tooltip: 'Browser-based application accessible on any device with internet connection.' },
  { id: 'ios', label: 'iOS only', price: 600, tooltip: 'Native iPhone and iPad app distributed via Apple App Store.' },
  { id: 'android', label: 'Android only', price: 600, tooltip: 'Native app distributed via Google Play Store.' },
  { id: 'ios-android', label: 'iOS + Android', price: 850, tooltip: 'Both mobile platforms with shared functionality and design.' },
  { id: 'web-ios', label: 'Web + iOS', price: 800, tooltip: 'Browser app plus native iPhone/iPad app.' },
  { id: 'web-android', label: 'Web + Android', price: 800, tooltip: 'Browser app plus native Android app.' },
  { id: 'web-ios-android', label: 'Web + iOS + Android', price: 1000, tooltip: 'Full coverage: browser and both mobile platforms.' },
  { id: 'desktop-single', label: 'Desktop (Mac or Windows)', price: 700, tooltip: 'Single desktop platform application.' },
  { id: 'desktop-both', label: 'Desktop (Mac + Windows)', price: 950, tooltip: 'Both desktop platforms with shared functionality.' },
  { id: 'all', label: 'All Platforms', price: 1400, startsAt: true, tooltip: 'Web, iOS, Android, Mac, Windows — complete ecosystem.' },
];

// Screen Complexity Options (Step 3)
export const screenOptions: ScreenOption[] = [
  { id: 'simple', label: 'Simple (1–5 screens)', price: 400, tooltip: 'Basic app with core functionality. Typical: Login, home, 1–2 feature screens, settings.' },
  { id: 'standard', label: 'Standard (6–12 screens)', price: 600, tooltip: 'Full-featured app with multiple sections and user flows.' },
  { id: 'complex', label: 'Complex (13–25 screens)', price: 900, tooltip: 'Comprehensive app with detailed features, multiple user types, or admin dashboards.' },
  { id: 'enterprise', label: 'Enterprise (25+ screens)', price: null, customQuote: true, tooltip: 'Large-scale application requiring custom scoping and pricing.' },
];

// Design Level Options (Step 4)
export const designOptions: DesignOption[] = [
  { id: 'template', label: 'Template-based', price: 100, tooltip: 'Clean UI using established design patterns and component libraries. Fast to implement, professional look.' },
  { id: 'custom', label: 'Custom Design', price: 300, tooltip: 'Unique visual identity with custom layouts, colors, typography, and branded elements.' },
  { id: 'premium', label: 'Premium / Bespoke', price: 550, tooltip: 'High-end design with micro-interactions, custom illustrations, animations, and refined details.' },
];

// Authentication Options (Step 5)
export const authOptions: AuthOption[] = [
  { id: 'none', label: 'None', price: 0, tooltip: 'No user accounts required — app works without login.' },
  { id: 'basic', label: 'Basic (Email/Password)', price: 100, tooltip: 'Standard signup and login with email and password, includes password reset flow.' },
  { id: 'social', label: 'Social Logins', price: 175, tooltip: 'Login with Google, Apple, Facebook, etc. in addition to email/password option.' },
  { id: 'advanced', label: 'Advanced (SSO, 2FA, Roles)', price: 350, startsAt: true, tooltip: 'Enterprise-grade: single sign-on, two-factor authentication, user roles and permissions.' },
];

// Backend & Database Options (Step 6)
export const backendOptions: BackendOption[] = [
  { id: 'none', label: 'No backend (static/local)', price: 0, tooltip: 'App stores data locally on device only. No server or database needed.' },
  { id: 'simple', label: 'Simple (Basic CRUD)', price: 400, tooltip: 'Create, read, update, delete data — user profiles, content, simple records.' },
  { id: 'standard', label: 'Standard (Relational data)', price: 600, tooltip: 'Multiple data types with relationships — orders linked to products, users to roles, etc.' },
  { id: 'complex', label: 'Complex (Real-time, large scale)', price: 900, startsAt: true, tooltip: 'Real-time sync, complex queries, high data volume, multi-tenant architecture.' },
];

// Features & Functionality (Step 7)
export const appFeatures: Feature[] = [
  {
    id: 'pushNotifications',
    name: 'Push Notifications',
    defaultTier: 'basic',
    options: [
      { id: 'basic', label: 'Basic', price: 75, description: 'Send announcements, updates, and reminders to all app users. Ideal for re-engaging users with news, promotions, or alerts. Examples: News apps, retail apps like Target.' },
      { id: 'segmented', label: 'Segmented', price: 150, description: 'Target specific user groups based on behavior, location, or preferences. Ideal for personalized messaging to increase engagement. Examples: Spotify, Amazon, Duolingo.' },
      { id: 'advanced', label: 'Advanced', price: 250, description: 'Automated triggers, scheduling, A/B testing, and rich media. Ideal for sophisticated engagement campaigns. Examples: Uber, DoorDash, Calm.', startsAt: true },
    ],
  },
  {
    id: 'messaging',
    name: 'In-App Messaging / Chat',
    defaultTier: 'basic',
    options: [
      { id: 'basic', label: 'Basic (1:1)', price: 200, description: 'Direct messaging between two users with text support. Ideal for user-to-user or user-to-support communication. Examples: Airbnb, Etsy, basic support chat.' },
      { id: 'group', label: 'Group Chat', price: 350, description: 'Multi-user conversations, chat rooms, and group management. Ideal for community, team collaboration, or social features. Examples: Slack, Discord, WhatsApp.' },
      { id: 'advanced', label: 'Advanced', price: 500, description: 'File sharing, reactions, threaded replies, read receipts, typing indicators. Ideal when communication is a core feature. Examples: Slack, Microsoft Teams, Telegram.', startsAt: true },
    ],
  },
  {
    id: 'payments',
    name: 'Payments / Transactions',
    defaultTier: 'single',
    options: [
      { id: 'single', label: 'Single Gateway', price: 250, description: 'Accept payments through one processor like Stripe, PayPal, or Square. Ideal for straightforward checkout. Examples: Small e-commerce, service booking apps.' },
      { id: 'multiple', label: 'Multiple Gateways', price: 350, description: 'Support multiple payment methods and regional processors. Ideal for diverse markets or payment flexibility. Examples: Amazon, international apps.' },
      { id: 'subscriptions', label: 'Subscriptions', price: 450, description: 'Recurring billing, subscription tiers, trials, and plan management. Ideal for recurring revenue models. Examples: Netflix, Spotify, Headspace.', startsAt: true },
      { id: 'marketplace', label: 'Marketplace', price: 600, description: 'Split payments, seller payouts, escrow, and platform fees. Ideal for connecting buyers and sellers. Examples: Uber, Airbnb, Etsy.', startsAt: true },
    ],
  },
  {
    id: 'location',
    name: 'Location / Maps',
    defaultTier: 'static',
    options: [
      { id: 'static', label: 'Static Maps', price: 75, description: 'Display locations on a map with pins and directions links. Ideal for showing store locations, addresses, or meeting points. Examples: Store locators, restaurant apps.' },
      { id: 'interactive', label: 'Interactive Maps', price: 150, description: 'Users can search, zoom, pan, and select locations. Ideal when location discovery is part of the experience. Examples: Yelp, Zillow, Google Maps-style exploration.' },
      { id: 'live', label: 'Live Tracking', price: 300, description: 'Real-time GPS tracking, route updates, and geofencing. Ideal for tracking movement in real-time. Examples: Uber, DoorDash, Find My Friends.', startsAt: true },
    ],
  },
  {
    id: 'media',
    name: 'Media Handling',
    defaultTier: 'image',
    options: [
      { id: 'image', label: 'Image Upload', price: 75, description: 'Users can upload, store, and display images. Ideal for profile photos, product images, or basic photo sharing. Examples: Profile pictures, product listings.' },
      { id: 'image-video', label: 'Image + Video', price: 150, description: 'Support for both photo and video uploads with playback. Ideal when rich media is part of your experience. Examples: Instagram, TikTok, YouTube.' },
      { id: 'advanced', label: 'Advanced', price: 300, description: 'In-app editing, filters, compression, and gallery management. Ideal when media creation is a core feature. Examples: Instagram filters, VSCO, Snapchat.', startsAt: true },
    ],
  },
  {
    id: 'offlineMode',
    name: 'Offline Mode',
    defaultTier: 'basic',
    options: [
      { id: 'basic', label: 'Basic (View only)', price: 100, description: 'Users can view previously loaded content without internet. Ideal for low-connectivity situations. Examples: Spotify downloads, Netflix offline, Google Maps offline.' },
      { id: 'full', label: 'Full (Sync)', price: 250, description: 'Users can create and edit offline; syncs when back online. Ideal when productivity can\'t stop with connectivity. Examples: Notion, Google Docs, field service apps.', startsAt: true },
    ],
  },
  {
    id: 'analytics',
    name: 'Analytics / Admin Dashboard',
    defaultTier: 'basic',
    options: [
      { id: 'basic', label: 'Basic Tracking', price: 75, description: 'Track user activity, screen views, and basic events. Ideal for understanding how users interact with your app. Examples: Firebase Analytics, Mixpanel basics.' },
      { id: 'dashboard', label: 'Admin Dashboard', price: 200, description: 'Backend dashboard to view stats, manage users, and moderate content. Ideal for visibility and control over operations. Examples: Content moderation, user management.' },
      { id: 'advanced', label: 'Advanced Reporting', price: 400, description: 'Custom reports, visualizations, filters, and data exports. Ideal for data-driven decisions. Examples: Shopify analytics, HubSpot dashboards.', startsAt: true },
    ],
  },
  {
    id: 'integrations',
    name: 'Third-party Integrations / API',
    defaultTier: 'one',
    options: [
      { id: 'one', label: '1 Integration', price: 100, description: 'Connect one external service (CRM, email, calendar, etc.). Ideal for a single key integration. Examples: Mailchimp, Calendly, Salesforce.' },
      { id: 'few', label: '2–3 Integrations', price: 200, description: 'Multiple service connections with data flow between them. Ideal for working within an existing tool ecosystem. Examples: Zapier-connected apps.' },
      { id: 'many', label: '4+ Integrations', price: 400, description: 'Complex integration ecosystem or custom API development. Ideal for platforms connecting many services. Examples: Enterprise apps, API-first products.', startsAt: true },
    ],
  },
  {
    id: 'search',
    name: 'Search',
    defaultTier: 'basic',
    options: [
      { id: 'basic', label: 'Basic', price: 75, description: 'Simple search within app content with results list. Ideal for finding content quickly without complex filtering. Examples: Basic product search, content search.' },
      { id: 'advanced', label: 'Advanced', price: 175, description: 'Filtered search, autocomplete, indexed results, sorting options. Ideal when discovery and findability are crucial. Examples: Amazon, Airbnb, job boards.' },
    ],
  },
  {
    id: 'multiLanguage',
    name: 'Multi-language Support',
    defaultTier: 'two',
    options: [
      { id: 'two', label: '2 Languages', price: 325, description: 'App available in two languages with language switcher. Ideal for bilingual markets or expanding to one new region. Examples: US apps adding Spanish.' },
      { id: 'multiple', label: '3+ Languages', price: 425, description: 'Multiple languages with automatic region detection. Ideal for global markets or diverse user bases. Examples: Duolingo, Airbnb, Uber.', startsAt: true },
    ],
  },
  {
    id: 'accessibility',
    name: 'Accessibility Features',
    defaultTier: 'standard',
    options: [
      { id: 'standard', label: 'Standard', price: 75, description: 'Screen reader support, proper contrast, keyboard navigation. Ideal for being inclusive and meeting basic accessibility needs.' },
      { id: 'full', label: 'Full Compliance (WCAG AA)', price: 200, description: 'Complete accessibility audit and implementation to WCAG AA standards. Ideal for legal compliance or serving users with disabilities. Examples: Banking, healthcare apps.', startsAt: true },
    ],
  },
  {
    id: 'customFeature',
    name: 'Custom Features',
    defaultTier: 'custom',
    options: [
      { id: 'custom', label: 'Custom Feature', price: null, description: 'Unique functionality like AR/VR, IoT, hardware integration, or specialized tools. Ideal when your app needs something that doesn\'t fit standard categories. Examples: IKEA Place (AR), Peloton.' },
    ],
  },
];

// AI Features (Step 8)
export const aiFeatures: AIFeature[] = [
  {
    id: 'aiChatbot',
    name: 'AI Chatbot / Assistant',
    defaultSetupTier: 'standard',
    defaultUsageTier: 'growth',
    setupOptions: [
      { id: 'basic', label: 'Basic', price: 200, description: 'Rule-based bot with light AI for FAQs and simple routing. Ideal for automated responses to common questions. Examples: Basic customer service bots, FAQ assistants.' },
      { id: 'standard', label: 'Standard', price: 350, description: 'Full conversational AI (GPT/Claude) that understands context and varied inputs. Ideal for natural conversations handling complex queries. Examples: Intercom bots, shopping assistants.' },
      { id: 'advanced', label: 'Advanced', price: 550, startsAt: true, description: 'Custom-trained on your data with brand voice, memory, human handoff, and analytics. Ideal when AI is a core differentiator. Examples: Klarna\'s AI, enterprise support bots.' },
    ],
    usageOptions: [
      { id: 'starter', label: 'Starter', price: 50, includes: 'Up to 1,000 interactions' },
      { id: 'growth', label: 'Growth', price: 150, includes: 'Up to 5,000 interactions' },
      { id: 'scale', label: 'Scale', price: 300, includes: 'Up to 15,000 interactions' },
      { id: 'enterprise', label: 'Enterprise', price: null, includes: 'Unlimited / dedicated', custom: true },
    ],
  },
  {
    id: 'aiSearch',
    name: 'AI Search',
    defaultSetupTier: 'standard',
    defaultUsageTier: 'growth',
    setupOptions: [
      { id: 'basic', label: 'Basic', price: 150, description: 'Natural language search that understands intent beyond keywords. Ideal for better search results without complex implementation. Examples: Upgraded site search.' },
      { id: 'standard', label: 'Standard', price: 300, description: 'Semantic search with filters, handles typos, synonyms, and user intent. Ideal when search quality impacts conversions. Examples: E-commerce, knowledge bases.' },
      { id: 'advanced', label: 'Advanced', price: 450, startsAt: true, description: 'Custom-trained on your content, learns from behavior, personalized results. Ideal when search is a core feature. Examples: Netflix, Spotify, Amazon.' },
    ],
    usageOptions: [
      { id: 'starter', label: 'Starter', price: 30, includes: 'Up to 5,000 searches' },
      { id: 'growth', label: 'Growth', price: 75, includes: 'Up to 20,000 searches' },
      { id: 'scale', label: 'Scale', price: 150, includes: 'Up to 50,000 searches' },
      { id: 'enterprise', label: 'Enterprise', price: null, includes: 'Unlimited', custom: true },
    ],
  },
  {
    id: 'aiContent',
    name: 'AI Content Generation',
    defaultSetupTier: 'standard',
    defaultUsageTier: 'standard',
    setupOptions: [
      { id: 'basic', label: 'Basic', price: 200, description: 'Auto-complete, short descriptions, simple summaries. Ideal for AI assistance on small content tasks. Examples: Smart compose, product description helpers.' },
      { id: 'standard', label: 'Standard', price: 350, description: 'Full content creation — posts, descriptions, emails, multiple formats. Ideal when content creation is frequent. Examples: Jasper, Copy.ai, Notion AI.' },
      { id: 'advanced', label: 'Advanced', price: 500, startsAt: true, description: 'Custom tone training, templates, workflows, bulk generation. Ideal for content at scale with brand consistency. Examples: Enterprise content platforms.' },
    ],
    usageOptions: [
      { id: 'light', label: 'Light', price: 30, includes: 'Up to 50,000 tokens' },
      { id: 'standard', label: 'Standard', price: 75, includes: 'Up to 150,000 tokens' },
      { id: 'heavy', label: 'Heavy', price: 150, includes: 'Up to 400,000 tokens' },
      { id: 'enterprise', label: 'Enterprise', price: null, includes: 'Unlimited', custom: true },
    ],
  },
  {
    id: 'aiRecommendations',
    name: 'AI Recommendations',
    defaultSetupTier: 'standard',
    defaultUsageTier: 'growth',
    setupOptions: [
      { id: 'basic', label: 'Basic', price: 200, description: 'Rules-based suggestions — "popular items," "frequently bought together." Ideal for simple recommendations. Examples: Basic "you may also like" sections.' },
      { id: 'standard', label: 'Standard', price: 400, description: 'Behavior-driven recommendations based on user history and preferences. Ideal when personalization increases engagement. Examples: Amazon, Spotify Discover Weekly.' },
      { id: 'advanced', label: 'Advanced', price: 600, startsAt: true, description: 'Real-time personalization, A/B optimized, collaborative filtering. Ideal when recommendations are core to your value. Examples: Netflix, TikTok, YouTube.' },
    ],
    usageOptions: [
      { id: 'starter', label: 'Starter', price: 50, includes: 'Up to 10,000 requests' },
      { id: 'growth', label: 'Growth', price: 125, includes: 'Up to 50,000 requests' },
      { id: 'scale', label: 'Scale', price: 250, includes: 'Up to 150,000 requests' },
      { id: 'enterprise', label: 'Enterprise', price: null, includes: 'Unlimited', custom: true },
    ],
  },
  {
    id: 'aiImage',
    name: 'AI Image Enhancement / Generation',
    defaultSetupTier: 'enhancement',
    defaultUsageTier: 'growth',
    setupOptions: [
      { id: 'enhancement', label: 'Enhancement', price: 150, description: 'Auto-improve photos — upscaling, noise reduction, color correction. Ideal for automatic quality improvement. Examples: Photo apps, e-commerce product photos.' },
      { id: 'generation', label: 'Generation', price: 300, description: 'Create images from text prompts using DALL-E, Stable Diffusion. Ideal for generating custom visuals. Examples: Canva AI, avatar generators.' },
      { id: 'custom', label: 'Custom', price: 500, startsAt: true, description: 'Background removal, style transfer, product mockups, brand-trained models. Ideal when image manipulation is a core feature. Examples: Remove.bg, Lensa AI.' },
    ],
    usageOptions: [
      { id: 'starter', label: 'Starter', price: 40, includes: 'Up to 200 images' },
      { id: 'growth', label: 'Growth', price: 100, includes: 'Up to 600 images' },
      { id: 'scale', label: 'Scale', price: 200, includes: 'Up to 1,500 images' },
      { id: 'enterprise', label: 'Enterprise', price: null, includes: 'Unlimited', custom: true },
    ],
  },
  {
    id: 'aiVoice',
    name: 'AI Voice / Speech',
    defaultSetupTier: 'both',
    defaultUsageTier: 'growth',
    setupOptions: [
      { id: 'stt', label: 'Speech-to-Text', price: 200, description: 'Transcribe audio and voice to text. Ideal for capturing voice as text — notes, accessibility, dictation. Examples: Otter.ai, voice memos transcription.' },
      { id: 'tts', label: 'Text-to-Speech', price: 200, description: 'Convert text to natural-sounding audio. Ideal for read-aloud, audio content, or accessibility. Examples: Audiobook apps, language learning apps.' },
      { id: 'both', label: 'Both (STT + TTS)', price: 350, description: 'Full voice input and output capability. Ideal when voice interaction enhances user experience. Examples: Language learning, accessibility tools.' },
      { id: 'assistant', label: 'Voice Assistant', price: 500, startsAt: true, description: 'Voice commands, conversational interface, wake words. Ideal for hands-free operation. Examples: Siri-like features, smart home controls.' },
    ],
    usageOptions: [
      { id: 'starter', label: 'Starter', price: 40, includes: 'Up to 60 minutes' },
      { id: 'growth', label: 'Growth', price: 100, includes: 'Up to 300 minutes' },
      { id: 'scale', label: 'Scale', price: 200, includes: 'Up to 800 minutes' },
      { id: 'enterprise', label: 'Enterprise', price: null, includes: 'Unlimited', custom: true },
    ],
  },
  {
    id: 'aiTranslation',
    name: 'AI Translation',
    defaultSetupTier: 'basic',
    defaultUsageTier: 'growth',
    setupOptions: [
      { id: 'basic', label: 'Basic', price: 150, description: 'Translate text between languages using Google Translate, DeepL. Ideal for occasional translation. Examples: Translate buttons in chat, content localization.' },
      { id: 'realtime', label: 'Real-time', price: 300, description: 'Live translation in chat, voice, or content as users interact. Ideal for real-time cross-language communication. Examples: Skype Translator, international chat.' },
      { id: 'custom', label: 'Custom', price: 450, startsAt: true, description: 'Industry-specific terminology, brand glossary, tone preservation. Ideal when translation accuracy is business-critical. Examples: Legal/medical apps.' },
    ],
    usageOptions: [
      { id: 'starter', label: 'Starter', price: 40, includes: 'Up to 100,000 characters' },
      { id: 'growth', label: 'Growth', price: 100, includes: 'Up to 500,000 characters' },
      { id: 'scale', label: 'Scale', price: 200, includes: 'Up to 1,500,000 characters' },
      { id: 'enterprise', label: 'Enterprise', price: null, includes: 'Unlimited', custom: true },
    ],
  },
  {
    id: 'aiDataAnalysis',
    name: 'AI Data Analysis / Insights',
    defaultSetupTier: 'standard',
    defaultUsageTier: 'growth',
    setupOptions: [
      { id: 'basic', label: 'Basic', price: 250, description: 'AI-generated summaries — trends, highlights, anomaly detection. Ideal for quick insights without digging through data. Examples: Weekly summaries, trend alerts.' },
      { id: 'standard', label: 'Standard', price: 400, description: 'Natural language queries ("Show me sales last month"), auto-generated reports. Ideal for non-technical users exploring data. Examples: Thoughtspot-style interfaces.' },
      { id: 'advanced', label: 'Advanced', price: 650, startsAt: true, description: 'Predictive analytics, forecasting, custom dashboards, automated alerts. Ideal for data-driven predictions. Examples: Salesforce Einstein, churn prediction.' },
    ],
    usageOptions: [
      { id: 'starter', label: 'Starter', price: 50, includes: 'Up to 1,000 queries' },
      { id: 'growth', label: 'Growth', price: 125, includes: 'Up to 5,000 queries' },
      { id: 'scale', label: 'Scale', price: 250, includes: 'Up to 15,000 queries' },
      { id: 'enterprise', label: 'Enterprise', price: null, includes: 'Unlimited', custom: true },
    ],
  },
  {
    id: 'aiVision',
    name: 'AI Vision / Recognition',
    defaultSetupTier: 'ocr',
    defaultUsageTier: 'growth',
    setupOptions: [
      { id: 'ocr', label: 'OCR', price: 150, description: 'Extract text from photos, documents, receipts, IDs. Ideal for capturing text from images. Examples: Expense apps, document scanners, business card readers.' },
      { id: 'object', label: 'Object Detection', price: 300, description: 'Identify and label objects in images. Ideal for recognizing and categorizing visual content. Examples: Google Lens, plant identification apps.' },
      { id: 'facial', label: 'Facial Recognition', price: 400, startsAt: true, description: 'Identity verification and face matching. Ideal for security or identity verification. Examples: Banking app login, age verification. (Compliance considerations apply)' },
      { id: 'custom', label: 'Custom Vision', price: 600, startsAt: true, description: 'Train AI to recognize items specific to your business. Ideal for specialized recognition. Examples: Quality control, medical imaging, brand logo detection.' },
    ],
    usageOptions: [
      { id: 'starter', label: 'Starter', price: 40, includes: 'Up to 500 processes' },
      { id: 'growth', label: 'Growth', price: 100, includes: 'Up to 2,000 processes' },
      { id: 'scale', label: 'Scale', price: 200, includes: 'Up to 5,000 processes' },
      { id: 'enterprise', label: 'Enterprise', price: null, includes: 'Unlimited', custom: true },
    ],
  },
  {
    id: 'aiForm',
    name: 'AI Form / Lead Qualification',
    defaultSetupTier: 'standard',
    defaultUsageTier: 'growth',
    setupOptions: [
      { id: 'basic', label: 'Basic', price: 150, description: 'Dynamic forms that adapt questions based on previous answers. Ideal for smarter conversational forms. Examples: Typeform-style flows, conditional surveys.' },
      { id: 'standard', label: 'Standard', price: 275, description: 'Lead scoring — AI rates lead quality in real-time. Ideal for prioritizing high-value leads automatically. Examples: HubSpot lead scoring, Salesforce Einstein.' },
      { id: 'advanced', label: 'Advanced', price: 400, startsAt: true, description: 'Full qualification flow with auto-responses, CRM integration, routing. Ideal for high-volume lead handling. Examples: Enterprise lead management.' },
    ],
    usageOptions: [
      { id: 'starter', label: 'Starter', price: 30, includes: 'Up to 500 submissions' },
      { id: 'growth', label: 'Growth', price: 75, includes: 'Up to 2,000 submissions' },
      { id: 'scale', label: 'Scale', price: 150, includes: 'Up to 5,000 submissions' },
      { id: 'enterprise', label: 'Enterprise', price: null, includes: 'Unlimited', custom: true },
    ],
  },
  {
    id: 'aiPersonalization',
    name: 'AI Personalization',
    defaultSetupTier: 'standard',
    defaultUsageTier: 'growth',
    setupOptions: [
      { id: 'basic', label: 'Basic', price: 250, description: 'Returning user recognition, basic content swaps. Ideal for acknowledging returning users with relevant content. Examples: "Welcome back" messages, recently viewed.' },
      { id: 'standard', label: 'Standard', price: 400, description: 'Behavior-based personalization — dynamic content, personalized CTAs. Ideal when personalization improves conversions. Examples: Amazon homepage, personalized emails.' },
      { id: 'advanced', label: 'Advanced', price: 600, startsAt: true, description: 'Real-time personalization engine, A/B optimization, predictive targeting. Ideal when personalization is a competitive advantage. Examples: Netflix, Spotify, TikTok.' },
    ],
    usageOptions: [
      { id: 'starter', label: 'Starter', price: 75, includes: 'Up to 10,000 sessions' },
      { id: 'growth', label: 'Growth', price: 175, includes: 'Up to 50,000 sessions' },
      { id: 'scale', label: 'Scale', price: 300, includes: 'Up to 150,000 sessions' },
      { id: 'enterprise', label: 'Enterprise', price: null, includes: 'Unlimited', custom: true },
    ],
  },
  {
    id: 'aiCustom',
    name: 'Custom AI / ML',
    defaultSetupTier: 'api',
    defaultUsageTier: 'starter',
    setupOptions: [
      { id: 'api', label: 'API Integration Only', price: 200, description: 'Connect to an existing AI service — we handle integration. Ideal when you already have an AI solution. Examples: Connecting to OpenAI, custom ML endpoints.' },
      { id: 'finetuned', label: 'Fine-tuned Model', price: 800, startsAt: true, description: 'Train a model on your data for specialized performance. Ideal when off-the-shelf models don\'t meet your needs. Examples: Industry-specific chatbots, custom classification.' },
      { id: 'custom', label: 'Custom ML Solution', price: null, description: 'Proprietary algorithms, unique pipelines, R&D work. Ideal when you need something truly novel. Examples: Novel recommendation engines, research applications.' },
    ],
    usageOptions: [
      { id: 'starter', label: 'Starter', price: 50, includes: 'Based on scope' },
      { id: 'growth', label: 'Growth', price: 150, includes: 'Based on scope' },
      { id: 'scale', label: 'Scale', price: 300, includes: 'Based on scope' },
      { id: 'enterprise', label: 'Enterprise', price: null, includes: 'Custom pricing', custom: true },
    ],
  },
];

// Additional Services (Step 9)
export const appAdditionalServices: AdditionalService[] = [
  { id: 'appstore', label: 'App Store Submission', price: 100, tooltip: 'We handle iOS App Store and/or Google Play submission, assets, screenshots, and approval process.' },
  { id: 'beta', label: 'Beta Testing Setup', price: 75, tooltip: 'Configure TestFlight (iOS) and/or internal testing track (Android) for beta distribution.' },
  { id: 'analytics', label: 'Analytics Setup', price: 50, tooltip: 'Firebase, Mixpanel, or similar analytics integration with event tracking configuration.' },
  { id: 'docs', label: 'Documentation', price: 100, startsAt: true, tooltip: 'Technical documentation, user guides, API docs. Price varies by scope.' },
  {
    id: 'maintenance',
    label: 'Ongoing Maintenance',
    price: 150,
    recurring: 'monthly',
    tooltip: 'Keep your app running smoothly with professional ongoing support.',
    defaultOption: 'basic',
    options: [
      { id: 'basic', label: 'Basic', price: 150, description: 'Updates, bug fixes, OS compatibility, security patches, minor enhancements.' },
      { id: 'standard', label: 'Standard', price: 300, description: 'Everything in Basic, plus performance optimization, monthly health reports, priority support, and feature tweaks.' },
      { id: 'premium', label: 'Premium', price: 500, description: 'Everything in Standard, plus dedicated support, proactive monitoring, quarterly strategy calls, and unlimited revision requests.' },
    ],
  },
  { id: 'source', label: 'Source Code Handoff', price: null, customQuote: true, tooltip: 'Want to own the code?' },
];

// Timeline Options (Step 10)
export const appTimelineOptions: TimelineOption[] = [
  { id: 'flexible', label: 'Flexible / No rush', multiplier: 1.0, tooltip: "We'll schedule based on workload. Typically 8–12 weeks depending on scope.", recommended: true },
  { id: 'standard', label: '6–8 weeks', multiplier: 1.0, tooltip: 'Standard timeline for most app projects.' },
  { id: 'expedited', label: '4–6 weeks', multiplier: 1.15, tooltip: 'Accelerated development with priority scheduling.' },
  { id: 'rush', label: 'Under 4 weeks', multiplier: 1.25, tooltip: 'Rush delivery. Subject to scope limitations and availability.' },
];

// Helper functions
export const getFeatureById = (id: string): Feature | undefined => {
  return appFeatures.find((f) => f.id === id);
};

export const getFeatureOptionPrice = (featureId: string, optionId: string): number | null => {
  const feature = getFeatureById(featureId);
  if (!feature) return null;
  const option = feature.options.find((o) => o.id === optionId);
  return option?.price ?? null;
};

export const getAIFeatureById = (id: string): AIFeature | undefined => {
  return aiFeatures.find((f) => f.id === id);
};

export const getAISetupPrice = (featureId: string, optionId: string): number | null => {
  const feature = getAIFeatureById(featureId);
  if (!feature) return null;
  const option = feature.setupOptions.find((o) => o.id === optionId);
  return option?.price ?? null;
};

export const getAIUsagePrice = (featureId: string, optionId: string): number | null => {
  const feature = getAIFeatureById(featureId);
  if (!feature) return null;
  const option = feature.usageOptions.find((o) => o.id === optionId);
  return option?.price ?? null;
};
