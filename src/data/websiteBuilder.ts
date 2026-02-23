// Website Builder Configuration Data

export interface ProjectType {
  id: string;
  label: string;
  tooltip: {
    whatItIs: string;
    idealIf: string;
    examples: string;
  };
}

export interface SiteSizeOption {
  id: string;
  label: string;
  price: number | null;
  customQuote?: boolean;
  tooltip: string;
}

export interface DesignOption {
  id: string;
  label: string;
  price: number;
  tooltip: string;
}

export interface CMSOption {
  id: string;
  label: string;
  price: number;
  tooltip: string;
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

export interface AdditionalService {
  id: string;
  label: string;
  price: number;
  startsAt?: boolean;
  recurring?: 'monthly';
  tooltip: string;
}

// AI Feature Types
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

export interface TimelineOption {
  id: string;
  label: string;
  multiplier: number;
  price?: number;
  tooltip: string;
}

export interface RecommendationPreset {
  siteSize: string;
  designComplexity: string;
  cms: string;
  features: string[];
}

// Project Types (Step 1)
export const projectTypes: ProjectType[] = [
  {
    id: 'portfolio',
    label: 'Portfolio / Personal Brand',
    tooltip: {
      whatItIs: 'A website showcasing your work, skills, or personal brand.',
      idealIf: "You're a freelancer, artist, photographer, or professional building your online presence.",
      examples: 'Casey Neistat, Behance portfolios, personal coaching sites',
    },
  },
  {
    id: 'business',
    label: 'Business / Corporate',
    tooltip: {
      whatItIs: 'A professional website representing your company and services.',
      idealIf: 'You want to establish credibility, attract clients, and showcase what your business offers.',
      examples: 'Deloitte, local law firms, marketing agencies',
    },
  },
  {
    id: 'landing',
    label: 'Landing Page',
    tooltip: {
      whatItIs: 'A single, focused page designed to drive one specific action.',
      idealIf: "You're launching a product, running a campaign, or capturing leads.",
      examples: 'App launch pages, event signups, Mailchimp landing pages',
    },
  },
  {
    id: 'ecommerce',
    label: 'Online Store / E-commerce',
    tooltip: {
      whatItIs: 'A website where customers can browse and buy products online.',
      idealIf: 'You want to sell physical or digital products directly to customers.',
      examples: 'Nike, Apple Store, Shopify stores',
    },
  },
  {
    id: 'webapp',
    label: 'Web Application',
    tooltip: {
      whatItIs: 'An interactive platform where users log in and perform tasks.',
      idealIf: "You're building a SaaS product, dashboard, tool, or member portal.",
      examples: 'Notion, Trello, Canva',
    },
  },
  {
    id: 'blog',
    label: 'Blog / Content Site',
    tooltip: {
      whatItIs: 'A content-focused website for articles, news, or resources.',
      idealIf: 'You want to publish regularly, build authority, or drive organic traffic.',
      examples: 'Medium, TechCrunch, company blogs',
    },
  },
  {
    id: 'other',
    label: 'Other',
    tooltip: {
      whatItIs: "Something unique that doesn't fit the above categories.",
      idealIf: "You have a custom project in mind — we'll tailor recommendations.",
      examples: 'Custom projects',
    },
  },
];

// Recommendation Presets based on Project Type
export const recommendationPresets: Record<string, RecommendationPreset> = {
  portfolio: {
    siteSize: '2-5',
    designComplexity: 'modern',
    cms: 'none',
    features: ['contactForm', 'imageGallery', 'analytics'],
  },
  business: {
    siteSize: '6-10',
    designComplexity: 'modern',
    cms: 'basic',
    features: ['contactForm', 'blog', 'seo', 'analytics'],
  },
  landing: {
    siteSize: '1',
    designComplexity: 'modern',
    cms: 'none',
    features: ['contactForm', 'videoBackground', 'animations', 'analytics'],
  },
  ecommerce: {
    siteSize: '6-10',
    designComplexity: 'modern',
    cms: 'advanced',
    features: ['ecommerce', 'contactForm', 'seo', 'analytics'],
  },
  webapp: {
    siteSize: '6-10',
    designComplexity: 'premium',
    cms: 'advanced',
    features: ['userAccounts', 'apiIntegration', 'analytics'],
  },
  blog: {
    siteSize: '6-10',
    designComplexity: 'clean',
    cms: 'advanced',
    features: ['blog', 'seo', 'analytics'],
  },
  other: {
    siteSize: '2-5',
    designComplexity: 'modern',
    cms: 'none',
    features: ['contactForm', 'analytics'],
  },
};

// Site Size Options (Step 2)
export const siteSizeOptions: SiteSizeOption[] = [
  {
    id: '1',
    label: '1 page (Landing)',
    price: 350,
    tooltip: 'A single, focused page. Great for campaigns, launches, or simple online presence.',
  },
  {
    id: '2-5',
    label: '2–5 pages',
    price: 750,
    tooltip: 'Typical for small sites: Home, About, Services, Contact, etc.',
  },
  {
    id: '6-10',
    label: '6–10 pages',
    price: 1400,
    tooltip: 'Room for detailed services, team pages, case studies, blog, and more.',
  },
  {
    id: '11+',
    label: '11+ pages',
    price: null,
    customQuote: true,
    tooltip: 'Comprehensive sites requiring custom scoping and pricing. We\'ll provide a tailored quote based on your specific needs.',
  },
];

// Design Complexity Options (Step 3)
export const designOptions: DesignOption[] = [
  {
    id: 'clean',
    label: 'Clean & Simple',
    price: 250,
    tooltip: 'Minimal, content-focused layouts with clean typography. Ideal if you want a straightforward, professional look without heavy visuals.',
  },
  {
    id: 'modern',
    label: 'Modern & Polished',
    price: 350,
    tooltip: 'Custom layouts, refined aesthetics, and thoughtful details. Ideal if you want to stand out with a polished, contemporary feel.',
  },
  {
    id: 'premium',
    label: 'Premium & Immersive',
    price: 600,
    tooltip: 'Bespoke design with scroll effects, animations, and rich visuals. Ideal if you want a high-end, memorable experience that wows visitors.',
  },
];

// CMS Options (Step 4)
export const cmsOptions: CMSOption[] = [
  {
    id: 'none',
    label: 'None (Static)',
    price: 0,
    tooltip: 'We build it, you send us updates to implement. Ideal if content rarely changes or you prefer hands-off management.',
  },
  {
    id: 'basic',
    label: 'Basic CMS',
    price: 250,
    tooltip: 'Edit text, images, and blog posts yourself via a simple dashboard. Ideal if you want to make quick updates without developer help.',
  },
  {
    id: 'advanced',
    label: 'Advanced CMS',
    price: 450,
    tooltip: 'Full control over collections, dynamic content, filtering, and structured data. Ideal if you have lots of content types that change frequently.',
  },
];

// Features & Functionality (Step 5)
export const features: Feature[] = [
  {
    id: 'contactForm',
    name: 'Contact Form',
    defaultTier: 'basic',
    options: [
      { id: 'basic', label: 'Basic', price: 50, description: 'Name, email, message → inbox' },
      { id: 'multistep', label: 'Multi-step / Lead Capture', price: 100, description: 'Conditional logic, qualification' },
    ],
  },
  {
    id: 'blog',
    name: 'Blog',
    defaultTier: 'standard',
    options: [
      { id: 'standard', label: 'Standard', price: 75, description: 'Categories, tags, single author' },
      { id: 'advanced', label: 'Advanced', price: 150, description: 'Multi-author, comments, newsletter' },
    ],
  },
  {
    id: 'imageGallery',
    name: 'Image Gallery / Portfolio',
    defaultTier: 'standard',
    options: [
      { id: 'standard', label: 'Standard', price: 75, description: 'Grid/masonry, lightbox' },
      { id: 'advanced', label: 'Advanced', price: 150, description: 'Filters, hover effects, detail pages' },
    ],
  },
  {
    id: 'videoBackground',
    name: 'Video Backgrounds',
    defaultTier: 'single',
    options: [
      { id: 'single', label: 'Single Section', price: 50, description: 'One hero/section' },
      { id: 'multiple', label: 'Multiple Sections', price: 100, description: 'Throughout site' },
    ],
  },
  {
    id: 'animations',
    name: 'Animations / Motion Effects',
    defaultTier: 'basic',
    options: [
      { id: 'basic', label: 'Basic', price: 100, description: 'Scroll reveals, hover effects' },
      { id: 'advanced', label: 'Advanced', price: 250, description: 'Parallax, sequences, scroll-driven' },
    ],
  },
  {
    id: 'ecommerce',
    name: 'E-commerce',
    defaultTier: 'standard',
    options: [
      { id: 'starter', label: 'Starter', price: 150, description: 'Up to 10 products, basic cart' },
      { id: 'standard', label: 'Standard', price: 300, description: 'Up to 50 products, variants, discounts' },
      { id: 'advanced', label: 'Advanced', price: 500, description: 'Unlimited, inventory, multi-gateway', startsAt: true },
    ],
  },
  {
    id: 'booking',
    name: 'Booking / Scheduling',
    defaultTier: 'basic',
    options: [
      { id: 'basic', label: 'Basic', price: 100, description: 'Single calendar, email confirmations' },
      { id: 'advanced', label: 'Advanced', price: 250, description: 'Multi-service, staff, payments', startsAt: true },
    ],
  },
  {
    id: 'userAccounts',
    name: 'User Accounts / Login',
    defaultTier: 'basic',
    options: [
      { id: 'basic', label: 'Basic', price: 150, description: 'Email/password, simple profile' },
      { id: 'advanced', label: 'Advanced', price: 300, description: 'Social login, roles, dashboards', startsAt: true },
    ],
  },
  {
    id: 'search',
    name: 'Search Functionality',
    defaultTier: 'basic',
    options: [
      { id: 'basic', label: 'Basic', price: 75, description: 'Site search, results page' },
      { id: 'advanced', label: 'Advanced', price: 150, description: 'Filters, instant results, suggestions' },
    ],
  },
  {
    id: 'multiLanguage',
    name: 'Multi-language Support',
    defaultTier: 'two',
    options: [
      { id: 'two', label: '2 Languages', price: 150, description: 'Bilingual with switcher' },
      { id: 'three-plus', label: '3+ Languages', price: 250, description: 'Multiple languages, regional content', startsAt: true },
    ],
  },
  {
    id: 'apiIntegration',
    name: 'API / Third-party Integrations',
    defaultTier: 'one',
    options: [
      { id: 'one', label: '1 Integration', price: 100, description: 'Single service connection' },
      { id: 'two-three', label: '2–3 Integrations', price: 200, description: 'Multiple connections' },
      { id: 'four-plus', label: '4+ Integrations', price: 350, description: 'Complex ecosystem', startsAt: true },
    ],
  },
  {
    id: 'customTool',
    name: 'Custom Interactive Tools',
    defaultTier: 'custom',
    options: [
      { id: 'custom', label: 'Custom Tool', price: null, description: 'Calculators, quizzes, configurators' },
    ],
  },
];

// Website AI Features (Step 6) - AI Chatbot and AI Search only
export const websiteAIFeatures: AIFeature[] = [
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
];

// Additional Services (Step 7)
export const additionalServices: AdditionalService[] = [
  {
    id: 'seo',
    label: 'SEO Optimization',
    price: 100,
    tooltip: 'Meta tags, schema markup, XML sitemap, page speed optimization, keyword-friendly structure.',
  },
  {
    id: 'copywriting',
    label: 'Copywriting / Content',
    price: 150,
    startsAt: true,
    tooltip: 'Professional website copy — headlines, page content, calls-to-action. Price varies by page count.',
  },
  {
    id: 'analytics',
    label: 'Analytics & Tracking',
    price: 50,
    tooltip: 'Google Analytics 4 setup, conversion tracking, event configuration.',
  },
  {
    id: 'maintenance',
    label: 'Ongoing Maintenance',
    price: 45,
    startsAt: true,
    recurring: 'monthly',
    tooltip: 'Monthly updates, security monitoring, backups, content edits.',
  },
  {
    id: 'hosting',
    label: 'Hosting Setup',
    price: 50,
    tooltip: 'Configuration and deployment to your preferred hosting provider.',
  },
  {
    id: 'domain',
    label: 'Domain / DNS Setup',
    price: 25,
    tooltip: 'Domain connection, DNS configuration, and SSL certificate setup.',
  },
];

// Timeline Options (Step 8)
export const timelineOptions: TimelineOption[] = [
  {
    id: 'flexible',
    label: 'Flexible / No rush',
    multiplier: 1.0,
    price: 0,
    tooltip: "We'll schedule based on current workload. Typically 4–8 weeks.",
  },
  {
    id: 'standard',
    label: '4–6 weeks',
    multiplier: 1.0,
    price: 0,
    tooltip: 'Standard timeline for most projects.',
  },
  {
    id: 'expedited',
    label: '2–4 weeks',
    multiplier: 1.0,
    price: 490,
    tooltip: 'Expedited delivery. Your project gets priority scheduling.',
  },
  {
    id: 'rush',
    label: 'ASAP (under 2 weeks)',
    multiplier: 1.0,
    price: 890,
    tooltip: 'Rush delivery. Subject to availability — contact us to confirm.',
  },
];

// Helper to get feature by ID
export const getFeatureById = (id: string): Feature | undefined => {
  return features.find((f) => f.id === id);
};

// Helper to get feature option price
export const getFeatureOptionPrice = (featureId: string, optionId: string): number | null => {
  const feature = getFeatureById(featureId);
  if (!feature) return null;
  const option = feature.options.find((o) => o.id === optionId);
  return option?.price ?? null;
};

// AI Feature helpers
export const getWebsiteAIFeatureById = (id: string): AIFeature | undefined => {
  return websiteAIFeatures.find((f) => f.id === id);
};

export const getWebsiteAISetupPrice = (featureId: string, optionId: string): number | null => {
  const feature = getWebsiteAIFeatureById(featureId);
  if (!feature) return null;
  const option = feature.setupOptions.find((o) => o.id === optionId);
  return option?.price ?? null;
};

export const getWebsiteAIUsagePrice = (featureId: string, optionId: string): number | null => {
  const feature = getWebsiteAIFeatureById(featureId);
  if (!feature) return null;
  const option = feature.usageOptions.find((o) => o.id === optionId);
  return option?.price ?? null;
};
