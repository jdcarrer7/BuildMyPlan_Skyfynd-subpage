/**
 * Config Resolver — maps raw config values (IDs) back to human-readable labels and prices
 * by looking up the same data arrays the builder UI uses.
 *
 * Used at submission time to produce a step-by-step breakdown stored in Drive JSON.
 */

import type { ResolvedStep, ResolvedServiceConfig } from '@/lib/types/admin';
import type { ServiceType } from '@/hooks/useUnifiedQuoteStore';
import type {
  WebsiteConfig,
  AppConfig,
  AnimationConfig,
  ImageConfig,
  SoundConfig,
  PaidMediaConfig,
  SocialMediaConfig,
  EmailMarketingConfig,
  BrandStrategyConfig,
  VisualIdentityConfig,
  BrandApplicationsConfig,
  ContentStrategyConfig,
  MessagingCopywritingConfig,
  AIReceptionistConfig,
} from '@/hooks/useUnifiedQuoteStore';
import { serviceMetadata } from '@/hooks/useUnifiedQuoteStore';

// ── Data imports ──

import {
  projectTypes,
  siteSizeOptions,
  designOptions as websiteDesignOptions,
  cmsOptions,
  features as websiteFeatures,
  websiteAIFeatures,
  additionalServices as websiteAdditionalServices,
  timelineOptions as websiteTimelineOptions,
} from '@/data/websiteBuilder';

import {
  appTypes,
  platformOptions as appPlatformOptions,
  screenOptions,
  designOptions as appDesignOptions,
  authOptions,
  backendOptions,
  appFeatures,
  aiFeatures as appAIFeatures,
  appAdditionalServices,
  appTimelineOptions,
} from '@/data/appBuilder';

import {
  animationTypeOptions,
  durationOptions as animDurationOptions,
  styleOptions as animStyleOptions,
  complexityOptions as animComplexityOptions,
  soundOptions as animSoundOptions,
  addOnCategories as animAddOnCategories,
  videoFormatOptions,
  aspectRatioOptions,
  sourceFileOptions,
  timelineOptions as animTimelineOptions,
} from '@/data/animationBuilder';

import {
  imageTypeOptions,
  quantityOptions as imgQuantityOptions,
  styleOptions as imgStyleOptions,
  creationMethodOptions,
  editingOptions,
  backgroundOptions,
  overlayOptions,
  sizeOptions as imgSizeOptions,
  revisionOptions as imgRevisionOptions,
  formatOptions as imgFormatOptions,
  sourceOptions as imgSourceOptions,
  licenseOptions as imgLicenseOptions,
  timelineOptions as imgTimelineOptions,
} from '@/data/imageBuilder';

import {
  soundTypeOptions,
  durationOptions as sndDurationOptions,
  styleOptions as sndStyleOptions,
  complexityOptions as sndComplexityOptions,
  quantityOptions as sndQuantityOptions,
  voiceoverOptions,
  lyricsOptions,
  soundDesignAddOns,
  revisionOptions as sndRevisionOptions,
  formatOptions as sndFormatOptions,
  projectFileOptions,
  licenseOptions as sndLicenseOptions,
  timelineOptions as sndTimelineOptions,
} from '@/data/soundBuilder';

import {
  campaignTypeOptions,
  platformOptions as pmPlatformOptions,
  budgetOptions,
  durationOptions as pmDurationOptions,
  managementOptions,
  creativeOptions,
  landingPageOptions,
  trackingOptions,
  reportingOptions as pmReportingOptions,
  addOnOptions as pmAddOnOptions,
} from '@/data/paidMediaBuilder';

import {
  managementGoalOptions,
  platformOptions as smPlatformOptions,
  frequencyOptions,
  contentOptions as smContentOptions,
  engagementOptions,
  strategyOptions,
  reportingOptions as smReportingOptions,
  storiesOptions,
  reelsOptions,
  additionalServicesOptions as smAdditionalServices,
  durationOptions as smDurationOptions,
} from '@/data/socialMediaBuilder';

import {
  emailGoalOptions,
  volumeOptions,
  designOptions as emDesignOptions,
  automationOptions,
  sequenceOptions,
  listOptions,
  copyOptions,
  reportingOptions as emReportingOptions,
  testingOptions,
  platformOptions as emPlatformOptions,
  additionalServicesOptions as emAdditionalServices,
  durationOptions as emDurationOptions,
} from '@/data/emailMarketingBuilder';

import {
  strategyGoalOptions,
  depthOptions as bsDepthOptions,
  researchOptions,
  positioningOptions,
  messagingOptions as bsMessagingOptions,
  architectureOptions,
  purposeOptions,
  audienceOptions as bsAudienceOptions,
  workshopOptions,
  addOnServices as bsAddOnServices,
  timelineOptions as bsTimelineOptions,
} from '@/data/brandStrategyBuilder';

import {
  visualIdentityGoalOptions,
  logoOptions,
  colorOptions,
  typographyOptions,
  photographyOptions,
  iconOptions,
  patternOptions,
  illustrationOptions,
  motionOptions,
  guidelinesOptions,
  addOnServices as viAddOnServices,
  timelineOptions as viTimelineOptions,
} from '@/data/visualIdentityBuilder';

import {
  applicationGoalOptions,
  stationeryOptions,
  digitalOptions,
  socialOptions as baSocialOptions,
  presentationOptions,
  marketingOptions as baMarketingOptions,
  signageOptions,
  packagingOptions,
  eventsOptions,
  addOnServices as baAddOnServices,
  timelineOptions as baTimelineOptions,
} from '@/data/brandApplicationsBuilder';

import {
  contentGoalOptions,
  depthOptions as csDepthOptions,
  auditOptions,
  audienceOptions as csAudienceOptions,
  channelOptions,
  editorialOptions,
  seoOptions,
  governanceOptions,
  measurementOptions,
  addOnServices as csAddOnServices,
  timelineOptions as csTimelineOptions,
} from '@/data/contentStrategyBuilder';

import {
  messagingGoalOptions as mcGoalOptions,
  messagingOptions as mcMessagingOptions,
  voiceOptions,
  websiteOptions as mcWebsiteOptions,
  marketingOptions as mcMarketingOptions,
  salesOptions,
  productOptions,
  contentOptions as mcContentOptions,
  uxOptions,
  retainerOptions,
  addOnServices as mcAddOnServices,
  timelineOptions as mcTimelineOptions,
} from '@/data/messagingCopywritingBuilder';

import {
  basePackages,
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
} from '@/data/aiReceptionistBuilder';

// ── Helpers ──

/* eslint-disable @typescript-eslint/no-explicit-any */
function resolveOption(
  options: any[],
  selectedId: string | null,
  stepName: string,
  priceOverride?: number | null,
  isRecurring?: boolean
): ResolvedStep {
  if (!selectedId) {
    return { stepName, selectedLabel: 'Not selected', selectedId: null, priceImpact: 0 };
  }
  const found = options.find((o: any) => o.id === selectedId);
  const label = found?.label ?? found?.name ?? selectedId;
  const price = priceOverride !== undefined ? priceOverride : (found?.price ?? 0);
  return {
    stepName,
    selectedLabel: label,
    selectedId,
    priceImpact: price,
    isRecurring: isRecurring || found?.recurring === 'monthly',
    isCustomQuote: found?.customQuote ?? false,
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

// ── Per-service resolvers ──

function resolveWebsite(c: WebsiteConfig): ResolvedStep[] {
  const steps: ResolvedStep[] = [];

  steps.push(resolveOption(projectTypes, c.projectType, 'Project Type'));
  steps.push(resolveOption(siteSizeOptions, c.siteSize, 'Site Size', c.siteSizePrice));
  steps.push(resolveOption(websiteDesignOptions, c.designComplexity, 'Design Complexity', c.designPrice));
  steps.push(resolveOption(cmsOptions, c.cms, 'CMS', c.cmsPrice));

  // Features (nested)
  if (c.selectedFeatures.length > 0) {
    const featureSteps: ResolvedStep[] = c.selectedFeatures.map(sf => {
      const feature = websiteFeatures.find(f => f.id === sf.id);
      const option = feature?.options.find(o => o.id === sf.optionId);
      return {
        stepName: feature?.name ?? sf.id,
        selectedLabel: option?.label ?? sf.optionId,
        selectedId: sf.optionId,
        priceImpact: sf.price,
      };
    });
    steps.push({ stepName: 'Features', selectedLabel: `${c.selectedFeatures.length} selected`, selectedId: null, priceImpact: null, children: featureSteps });
  }

  // AI Features (nested)
  if (c.selectedAIFeatures.length > 0) {
    const aiSteps: ResolvedStep[] = c.selectedAIFeatures.map(af => {
      const feature = websiteAIFeatures.find(f => f.id === af.id);
      const setupOpt = feature?.setupOptions.find(o => o.id === af.setupOptionId);
      const usageOpt = af.usageOptionId ? feature?.usageOptions.find(o => o.id === af.usageOptionId) : null;
      return {
        stepName: feature?.name ?? af.id,
        selectedLabel: `${setupOpt?.label ?? af.setupOptionId}${usageOpt ? ' + ' + usageOpt.label : ''}`,
        selectedId: af.setupOptionId,
        priceImpact: (af.setupPrice ?? 0) + (af.usagePrice ?? 0),
        isRecurring: !!af.usagePrice,
      };
    });
    steps.push({ stepName: 'AI Features', selectedLabel: `${c.selectedAIFeatures.length} selected`, selectedId: null, priceImpact: null, children: aiSteps });
  }

  // Additional Services
  if (c.selectedServices.length > 0) {
    const svcSteps: ResolvedStep[] = c.selectedServices.map(ss => {
      const svc = websiteAdditionalServices.find(s => s.id === ss.id);
      return {
        stepName: svc?.label ?? ss.id,
        selectedLabel: svc?.label ?? ss.id,
        selectedId: ss.id,
        priceImpact: ss.price,
        isRecurring: ss.recurring === 'monthly',
      };
    });
    steps.push({ stepName: 'Additional Services', selectedLabel: `${c.selectedServices.length} selected`, selectedId: null, priceImpact: null, children: svcSteps });
  }

  steps.push(resolveOption(websiteTimelineOptions, c.timeline, 'Timeline'));

  return steps;
}

function resolveApp(c: AppConfig): ResolvedStep[] {
  const steps: ResolvedStep[] = [];

  steps.push(resolveOption(appTypes, c.appType, 'App Type'));
  steps.push(resolveOption(appPlatformOptions, c.platform, 'Platform', c.platformPrice));
  steps.push(resolveOption(screenOptions, c.screens, 'Screens', c.screensPrice));
  steps.push(resolveOption(appDesignOptions, c.design, 'Design', c.designPrice));
  steps.push(resolveOption(authOptions, c.auth, 'Authentication', c.authPrice));
  steps.push(resolveOption(backendOptions, c.backend, 'Backend', c.backendPrice));

  // Features
  if (c.selectedFeatures.length > 0) {
    const featureSteps: ResolvedStep[] = c.selectedFeatures.map(sf => {
      const feature = appFeatures.find(f => f.id === sf.id);
      const option = feature?.options.find(o => o.id === sf.optionId);
      return {
        stepName: feature?.name ?? sf.id,
        selectedLabel: option?.label ?? sf.optionId,
        selectedId: sf.optionId,
        priceImpact: sf.price,
      };
    });
    steps.push({ stepName: 'Features', selectedLabel: `${c.selectedFeatures.length} selected`, selectedId: null, priceImpact: null, children: featureSteps });
  }

  // AI Features
  if (c.selectedAIFeatures.length > 0) {
    const aiSteps: ResolvedStep[] = c.selectedAIFeatures.map(af => {
      const feature = appAIFeatures.find(f => f.id === af.id);
      const setupOpt = feature?.setupOptions.find(o => o.id === af.setupOptionId);
      const usageOpt = af.usageOptionId ? feature?.usageOptions.find(o => o.id === af.usageOptionId) : null;
      return {
        stepName: feature?.name ?? af.id,
        selectedLabel: `${setupOpt?.label ?? af.setupOptionId}${usageOpt ? ' + ' + usageOpt.label : ''}`,
        selectedId: af.setupOptionId,
        priceImpact: (af.setupPrice ?? 0) + (af.usagePrice ?? 0),
        isRecurring: !!af.usagePrice,
      };
    });
    steps.push({ stepName: 'AI Features', selectedLabel: `${c.selectedAIFeatures.length} selected`, selectedId: null, priceImpact: null, children: aiSteps });
  }

  // Additional Services
  if (c.selectedServices.length > 0) {
    const svcSteps: ResolvedStep[] = c.selectedServices.map(ss => {
      const svc = appAdditionalServices.find(s => s.id === ss.id);
      return {
        stepName: svc?.label ?? svc?.name ?? ss.id,
        selectedLabel: svc?.label ?? svc?.name ?? ss.id,
        selectedId: ss.id,
        priceImpact: ss.price,
        isRecurring: ss.recurring === 'monthly',
      };
    });
    steps.push({ stepName: 'Additional Services', selectedLabel: `${c.selectedServices.length} selected`, selectedId: null, priceImpact: null, children: svcSteps });
  }

  steps.push(resolveOption(appTimelineOptions, c.timeline, 'Timeline'));

  return steps;
}

function resolveAnimation(c: AnimationConfig): ResolvedStep[] {
  const steps: ResolvedStep[] = [];

  steps.push(resolveOption(animationTypeOptions, c.animationType, 'Animation Type'));
  steps.push(resolveOption(animDurationOptions, c.duration, 'Duration', c.durationPrice));
  steps.push(resolveOption(animStyleOptions, c.style, 'Style', c.stylePrice));
  steps.push(resolveOption(animComplexityOptions, c.complexity, 'Complexity', c.complexityPrice));
  steps.push(resolveOption(animSoundOptions, c.sound, 'Sound', c.soundPrice));

  // Add-ons
  if (c.selectedAddOns.length > 0) {
    const addOnSteps: ResolvedStep[] = c.selectedAddOns.map(ao => {
      const cat = animAddOnCategories.find(c => c.id === ao.categoryId);
      const tier = cat?.tiers.find(t => t.id === ao.tierId);
      return {
        stepName: cat?.name ?? ao.categoryId,
        selectedLabel: tier?.label ?? ao.tierId,
        selectedId: ao.tierId,
        priceImpact: ao.price,
      };
    });
    steps.push({ stepName: 'Add-Ons', selectedLabel: `${c.selectedAddOns.length} selected`, selectedId: null, priceImpact: null, children: addOnSteps });
  }

  // Video formats
  if (c.selectedVideoFormats.length > 0) {
    const fmtSteps: ResolvedStep[] = c.selectedVideoFormats.map(vf => {
      const fmt = videoFormatOptions.find(f => f.id === vf.id);
      return {
        stepName: fmt?.label ?? vf.id,
        selectedLabel: fmt?.label ?? vf.id,
        selectedId: vf.id,
        priceImpact: vf.price,
      };
    });
    steps.push({ stepName: 'Video Formats', selectedLabel: `${c.selectedVideoFormats.length} selected`, selectedId: null, priceImpact: null, children: fmtSteps });
  }

  steps.push(resolveOption(aspectRatioOptions, c.aspectRatio, 'Aspect Ratio', c.aspectRatioPrice));
  steps.push(resolveOption(sourceFileOptions, c.sourceFiles, 'Source Files', c.sourceFilesPrice));
  steps.push(resolveOption(animTimelineOptions, c.timeline, 'Timeline'));

  return steps;
}

function resolveImage(c: ImageConfig): ResolvedStep[] {
  const steps: ResolvedStep[] = [];

  steps.push(resolveOption(imageTypeOptions, c.imageType, 'Image Type'));
  steps.push(resolveOption(imgQuantityOptions, c.quantity, 'Quantity', c.quantityPrice));
  steps.push(resolveOption(imgStyleOptions, c.style, 'Style', c.stylePrice));
  steps.push(resolveOption(creationMethodOptions, c.creation, 'Creation Method', c.creationPrice));
  steps.push(resolveOption(editingOptions, c.editing, 'Editing Level', c.editingPrice));
  steps.push(resolveOption(backgroundOptions, c.background, 'Background', c.backgroundPrice));
  steps.push(resolveOption(overlayOptions, c.overlay, 'Overlay & Text', c.overlayPrice));
  steps.push(resolveOption(imgSizeOptions, c.sizes, 'Sizes', c.sizesPrice));
  steps.push(resolveOption(imgRevisionOptions, c.revisions, 'Revisions', c.revisionsPrice));
  steps.push(resolveOption(imgFormatOptions, c.formats, 'Formats', c.formatsPrice));
  steps.push(resolveOption(imgSourceOptions, c.source, 'Source Files', c.sourcePrice));
  steps.push(resolveOption(imgLicenseOptions, c.license, 'License', c.licensePrice));
  steps.push(resolveOption(imgTimelineOptions, c.timeline, 'Timeline'));

  return steps;
}

function resolveSound(c: SoundConfig): ResolvedStep[] {
  const steps: ResolvedStep[] = [];

  steps.push(resolveOption(soundTypeOptions, c.soundType, 'Sound Type'));
  steps.push(resolveOption(sndDurationOptions, c.duration, 'Duration', c.durationPrice));
  steps.push(resolveOption(sndStyleOptions, c.style, 'Style', c.stylePrice));
  steps.push(resolveOption(sndComplexityOptions, c.complexity, 'Complexity', c.complexityPrice));
  steps.push(resolveOption(sndQuantityOptions, c.quantity, 'Quantity', c.quantityPrice));
  steps.push(resolveOption(voiceoverOptions, c.voiceover, 'Voiceover', c.voiceoverPrice));
  steps.push(resolveOption(lyricsOptions, c.lyrics, 'Lyrics', c.lyricsPrice));

  // Sound design add-ons
  if (c.selectedSoundDesignAddOns.length > 0) {
    const addOnSteps: ResolvedStep[] = c.selectedSoundDesignAddOns.map(id => {
      const addOn = soundDesignAddOns.find(a => a.id === id);
      return {
        stepName: addOn?.label ?? id,
        selectedLabel: addOn?.label ?? id,
        selectedId: id,
        priceImpact: addOn?.price ?? 0,
      };
    });
    steps.push({ stepName: 'Sound Design Add-Ons', selectedLabel: `${c.selectedSoundDesignAddOns.length} selected`, selectedId: null, priceImpact: null, children: addOnSteps });
  }

  steps.push(resolveOption(sndRevisionOptions, c.revisions, 'Revisions', c.revisionsPrice));
  steps.push(resolveOption(sndFormatOptions, c.formats, 'Formats', c.formatsPrice));
  steps.push(resolveOption(projectFileOptions, c.projectFiles, 'Project Files', c.projectFilesPrice));
  steps.push(resolveOption(sndLicenseOptions, c.license, 'License', c.licensePrice));
  steps.push(resolveOption(sndTimelineOptions, c.timeline, 'Timeline'));

  return steps;
}

function resolvePaidMedia(c: PaidMediaConfig): ResolvedStep[] {
  const steps: ResolvedStep[] = [];

  steps.push(resolveOption(campaignTypeOptions, c.campaignType, 'Campaign Type'));
  steps.push(resolveOption(pmPlatformOptions, c.platforms, 'Platform', c.platformsPrice, true));
  steps.push(resolveOption(budgetOptions, c.budget, 'Ad Budget'));
  steps.push(resolveOption(pmDurationOptions, c.duration, 'Duration'));
  steps.push(resolveOption(managementOptions, c.management, 'Management', c.managementPrice, !c.managementOneTime));
  steps.push(resolveOption(creativeOptions, c.creatives, 'Creatives', c.creativesPrice));
  steps.push(resolveOption(landingPageOptions, c.landingPage, 'Landing Page', c.landingPagePrice));
  steps.push(resolveOption(trackingOptions, c.tracking, 'Tracking', c.trackingPrice));
  steps.push(resolveOption(pmReportingOptions, c.reporting, 'Reporting', c.reportingPrice, true));

  // Add-ons
  if (c.selectedAddOns.length > 0) {
    const addOnSteps: ResolvedStep[] = c.selectedAddOns.map(ao => {
      const opt = pmAddOnOptions.find(o => o.id === ao.id);
      return {
        stepName: opt?.label ?? ao.id,
        selectedLabel: opt?.label ?? ao.id,
        selectedId: ao.id,
        priceImpact: ao.price,
        isRecurring: ao.recurring === 'monthly',
      };
    });
    steps.push({ stepName: 'Add-Ons', selectedLabel: `${c.selectedAddOns.length} selected`, selectedId: null, priceImpact: null, children: addOnSteps });
  }

  return steps;
}

function resolveSocialMedia(c: SocialMediaConfig): ResolvedStep[] {
  const steps: ResolvedStep[] = [];

  steps.push(resolveOption(managementGoalOptions, c.managementGoal, 'Management Goal'));
  steps.push(resolveOption(smPlatformOptions, c.platforms, 'Platforms', c.platformsPrice, true));
  steps.push(resolveOption(frequencyOptions, c.frequency, 'Posting Frequency', c.frequencyPrice, true));
  steps.push(resolveOption(smContentOptions, c.content, 'Content Creation', c.contentPrice, true));
  steps.push(resolveOption(engagementOptions, c.engagement, 'Engagement', c.engagementPrice, true));
  steps.push(resolveOption(strategyOptions, c.strategy, 'Strategy', c.strategyPrice, true));
  steps.push(resolveOption(smReportingOptions, c.reporting, 'Reporting', c.reportingPrice, true));
  steps.push(resolveOption(storiesOptions, c.stories, 'Stories', c.storiesPrice, true));
  steps.push(resolveOption(reelsOptions, c.reels, 'Reels', c.reelsPrice, true));

  // Additional add-ons
  if (c.selectedAdditionalAddOns.length > 0) {
    const addOnSteps: ResolvedStep[] = c.selectedAdditionalAddOns.map(ao => {
      const allOpts = [...smAdditionalServices];
      const opt = allOpts.find(o => o.id === ao.id);
      return {
        stepName: opt?.label ?? ao.id,
        selectedLabel: opt?.label ?? ao.id,
        selectedId: ao.id,
        priceImpact: ao.price,
        isRecurring: ao.recurring === 'monthly',
      };
    });
    steps.push({ stepName: 'Additional Services', selectedLabel: `${c.selectedAdditionalAddOns.length} selected`, selectedId: null, priceImpact: null, children: addOnSteps });
  }

  steps.push(resolveOption(smDurationOptions, c.duration, 'Duration'));

  return steps;
}

function resolveEmailMarketing(c: EmailMarketingConfig): ResolvedStep[] {
  const steps: ResolvedStep[] = [];

  steps.push(resolveOption(emailGoalOptions, c.emailGoal, 'Email Goal'));
  steps.push(resolveOption(volumeOptions, c.volume, 'Volume', c.volumePrice, true));
  steps.push(resolveOption(emDesignOptions, c.design, 'Design', c.designPrice, true));
  steps.push(resolveOption(automationOptions, c.automation, 'Automation', c.automationPrice, true));
  steps.push(resolveOption(sequenceOptions, c.sequences, 'Sequences', c.sequencesPrice));
  steps.push(resolveOption(listOptions, c.list, 'List Management', c.listPrice, true));
  steps.push(resolveOption(copyOptions, c.copy, 'Copywriting', c.copyPrice, true));
  steps.push(resolveOption(emReportingOptions, c.reporting, 'Reporting', c.reportingPrice, true));
  steps.push(resolveOption(testingOptions, c.testing, 'Testing', c.testingPrice));
  steps.push(resolveOption(emPlatformOptions, c.platform, 'Platform', c.platformPrice));

  // Additional services
  if (c.selectedAdditionalServices.length > 0) {
    const svcSteps: ResolvedStep[] = c.selectedAdditionalServices.map(ss => {
      const svc = emAdditionalServices.find(s => s.id === ss.id);
      return {
        stepName: svc?.label ?? ss.id,
        selectedLabel: svc?.label ?? ss.id,
        selectedId: ss.id,
        priceImpact: ss.price,
        isRecurring: ss.recurring === 'monthly',
      };
    });
    steps.push({ stepName: 'Additional Services', selectedLabel: `${c.selectedAdditionalServices.length} selected`, selectedId: null, priceImpact: null, children: svcSteps });
  }

  steps.push(resolveOption(emDurationOptions, c.duration, 'Duration'));

  return steps;
}

function resolveBrandStrategy(c: BrandStrategyConfig): ResolvedStep[] {
  const steps: ResolvedStep[] = [];

  steps.push(resolveOption(strategyGoalOptions, c.strategyGoal, 'Strategy Goal'));
  steps.push(resolveOption(bsDepthOptions, c.depth, 'Depth', c.depthPrice));
  steps.push(resolveOption(researchOptions, c.research, 'Research', c.researchPrice));
  steps.push(resolveOption(positioningOptions, c.positioning, 'Positioning', c.positioningPrice));
  steps.push(resolveOption(bsMessagingOptions, c.messaging, 'Messaging', c.messagingPrice));
  steps.push(resolveOption(architectureOptions, c.architecture, 'Architecture', c.architecturePrice));
  steps.push(resolveOption(purposeOptions, c.purpose, 'Purpose & Values', c.purposePrice));
  steps.push(resolveOption(bsAudienceOptions, c.audience, 'Audience', c.audiencePrice));
  steps.push(resolveOption(workshopOptions, c.workshop, 'Workshop', c.workshopPrice));

  // Add-ons
  if (c.selectedAddOns.length > 0) {
    const addOnSteps: ResolvedStep[] = c.selectedAddOns.map(ao => {
      const svc = bsAddOnServices.find(s => s.id === ao.id);
      return {
        stepName: svc?.label ?? ao.id,
        selectedLabel: svc?.label ?? ao.id,
        selectedId: ao.id,
        priceImpact: ao.price,
      };
    });
    steps.push({ stepName: 'Add-Ons', selectedLabel: `${c.selectedAddOns.length} selected`, selectedId: null, priceImpact: null, children: addOnSteps });
  }

  steps.push(resolveOption(bsTimelineOptions, c.timeline, 'Timeline'));

  return steps;
}

function resolveVisualIdentity(c: VisualIdentityConfig): ResolvedStep[] {
  const steps: ResolvedStep[] = [];

  steps.push(resolveOption(visualIdentityGoalOptions, c.visualIdentityGoal, 'Goal'));
  steps.push(resolveOption(logoOptions, c.logo, 'Logo', c.logoPrice));
  steps.push(resolveOption(colorOptions, c.colors, 'Colors', c.colorsPrice));
  steps.push(resolveOption(typographyOptions, c.typography, 'Typography', c.typographyPrice));
  steps.push(resolveOption(photographyOptions, c.photography, 'Photography', c.photographyPrice));
  steps.push(resolveOption(iconOptions, c.icons, 'Icons', c.iconsPrice));
  steps.push(resolveOption(patternOptions, c.patterns, 'Patterns', c.patternsPrice));
  steps.push(resolveOption(illustrationOptions, c.illustration, 'Illustration', c.illustrationPrice));
  steps.push(resolveOption(motionOptions, c.motion, 'Motion', c.motionPrice));
  steps.push(resolveOption(guidelinesOptions, c.guidelines, 'Guidelines', c.guidelinesPrice));

  // Add-ons
  if (c.selectedAddOns.length > 0) {
    const addOnSteps: ResolvedStep[] = c.selectedAddOns.map(ao => {
      const svc = viAddOnServices.find(s => s.id === ao.id);
      return {
        stepName: svc?.label ?? ao.id,
        selectedLabel: svc?.label ?? ao.id,
        selectedId: ao.id,
        priceImpact: ao.price,
      };
    });
    steps.push({ stepName: 'Add-Ons', selectedLabel: `${c.selectedAddOns.length} selected`, selectedId: null, priceImpact: null, children: addOnSteps });
  }

  steps.push(resolveOption(viTimelineOptions, c.timeline, 'Timeline'));

  return steps;
}

function resolveBrandApplications(c: BrandApplicationsConfig): ResolvedStep[] {
  const steps: ResolvedStep[] = [];

  steps.push(resolveOption(applicationGoalOptions, c.applicationGoal, 'Goal'));
  steps.push(resolveOption(stationeryOptions, c.stationery, 'Stationery', c.stationeryPrice));
  steps.push(resolveOption(digitalOptions, c.digital, 'Digital', c.digitalPrice));
  steps.push(resolveOption(baSocialOptions, c.social, 'Social', c.socialPrice));
  steps.push(resolveOption(presentationOptions, c.presentations, 'Presentations', c.presentationsPrice));
  steps.push(resolveOption(baMarketingOptions, c.marketing, 'Marketing', c.marketingPrice));
  steps.push(resolveOption(signageOptions, c.signage, 'Signage', c.signagePrice));
  steps.push(resolveOption(packagingOptions, c.packaging, 'Packaging', c.packagingPrice));
  steps.push(resolveOption(eventsOptions, c.events, 'Events', c.eventsPrice));

  // Add-ons
  if (c.selectedAddOns.length > 0) {
    const addOnSteps: ResolvedStep[] = c.selectedAddOns.map(ao => {
      const svc = baAddOnServices.find(s => s.id === ao.id);
      return {
        stepName: svc?.label ?? ao.id,
        selectedLabel: svc?.label ?? ao.id,
        selectedId: ao.id,
        priceImpact: ao.price,
      };
    });
    steps.push({ stepName: 'Add-Ons', selectedLabel: `${c.selectedAddOns.length} selected`, selectedId: null, priceImpact: null, children: addOnSteps });
  }

  steps.push(resolveOption(baTimelineOptions, c.timeline, 'Timeline'));

  return steps;
}

function resolveContentStrategy(c: ContentStrategyConfig): ResolvedStep[] {
  const steps: ResolvedStep[] = [];

  steps.push(resolveOption(contentGoalOptions, c.contentGoal, 'Content Goal'));
  steps.push(resolveOption(csDepthOptions, c.depth, 'Depth', c.depthPrice));
  steps.push(resolveOption(auditOptions, c.audit, 'Audit', c.auditPrice));
  steps.push(resolveOption(csAudienceOptions, c.audience, 'Audience', c.audiencePrice));
  steps.push(resolveOption(channelOptions, c.channels, 'Channels', c.channelsPrice));
  steps.push(resolveOption(editorialOptions, c.editorial, 'Editorial', c.editorialPrice));
  steps.push(resolveOption(seoOptions, c.seo, 'SEO', c.seoPrice));
  steps.push(resolveOption(governanceOptions, c.governance, 'Governance', c.governancePrice));
  steps.push(resolveOption(measurementOptions, c.measurement, 'Measurement', c.measurementPrice));

  // Add-ons
  if (c.selectedAddOns.length > 0) {
    const addOnSteps: ResolvedStep[] = c.selectedAddOns.map(ao => {
      const svc = csAddOnServices.find(s => s.id === ao.id);
      return {
        stepName: svc?.label ?? ao.id,
        selectedLabel: svc?.label ?? ao.id,
        selectedId: ao.id,
        priceImpact: ao.price,
      };
    });
    steps.push({ stepName: 'Add-Ons', selectedLabel: `${c.selectedAddOns.length} selected`, selectedId: null, priceImpact: null, children: addOnSteps });
  }

  steps.push(resolveOption(csTimelineOptions, c.timeline, 'Timeline'));

  return steps;
}

function resolveMessagingCopywriting(c: MessagingCopywritingConfig): ResolvedStep[] {
  const steps: ResolvedStep[] = [];

  steps.push(resolveOption(mcGoalOptions, c.messagingGoal, 'Goal'));
  steps.push(resolveOption(mcMessagingOptions, c.messaging, 'Messaging Framework', c.messagingPrice));
  steps.push(resolveOption(voiceOptions, c.voice, 'Voice & Tone', c.voicePrice));
  steps.push(resolveOption(mcWebsiteOptions, c.website, 'Website Copy', c.websitePrice));
  steps.push(resolveOption(mcMarketingOptions, c.marketing, 'Marketing Copy', c.marketingPrice));
  steps.push(resolveOption(salesOptions, c.sales, 'Sales Copy', c.salesPrice));
  steps.push(resolveOption(productOptions, c.product, 'Product Copy', c.productPrice));
  steps.push(resolveOption(mcContentOptions, c.content, 'Content', c.contentPrice));
  steps.push(resolveOption(uxOptions, c.ux, 'UX Writing', c.uxPrice));
  steps.push(resolveOption(retainerOptions, c.retainer, 'Retainer', c.retainerPrice, true));

  // Add-ons
  if (c.selectedAddOns.length > 0) {
    const addOnSteps: ResolvedStep[] = c.selectedAddOns.map(ao => {
      const svc = mcAddOnServices.find(s => s.id === ao.id);
      return {
        stepName: svc?.label ?? ao.id,
        selectedLabel: svc?.label ?? ao.id,
        selectedId: ao.id,
        priceImpact: ao.price,
      };
    });
    steps.push({ stepName: 'Add-Ons', selectedLabel: `${c.selectedAddOns.length} selected`, selectedId: null, priceImpact: null, children: addOnSteps });
  }

  steps.push(resolveOption(mcTimelineOptions, c.timeline, 'Timeline'));

  return steps;
}

function resolveAIReceptionist(c: AIReceptionistConfig): ResolvedStep[] {
  const steps: ResolvedStep[] = [];

  // Base package
  const pkg = basePackages.find(p => p.id === c.basePackage);
  steps.push({
    stepName: 'Base Package',
    selectedLabel: pkg?.name ?? c.basePackage ?? 'Not selected',
    selectedId: c.basePackage,
    priceImpact: pkg?.monthlyPrice ?? 0,
    isRecurring: true,
  });

  // Phone Setup
  steps.push(resolveOption(phoneNumberTypeOptions, c.phoneNumberType, 'Phone Number Type'));
  steps.push(resolveOption(additionalLinesOptions, c.additionalLines, 'Additional Lines'));
  steps.push(resolveOption(coverageAreaOptions, c.coverageArea, 'Coverage Area'));

  // Call Handling
  steps.push(resolveOption(monthlyMinutesOptions, c.monthlyMinutes, 'Monthly Minutes'));
  steps.push(resolveOption(availabilityOptions, c.availability, 'Availability'));
  steps.push(resolveOption(callTransferOptions, c.callTransfer, 'Call Transfer'));
  steps.push(resolveOption(voicemailOptions, c.voicemailType, 'Voicemail'));
  steps.push(resolveOption(maxCallDurationOptions, c.maxCallDuration, 'Max Call Duration'));

  // AI Capabilities
  steps.push(resolveOption(languageOptions, c.language, 'Language'));
  steps.push(resolveOption(voiceStyleOptions, c.voiceStyle, 'Voice Style'));
  steps.push(resolveOption(knowledgeBaseSizeOptions, c.knowledgeBaseSize, 'Knowledge Base'));
  steps.push(resolveOption(conversationComplexityOptions, c.conversationComplexity, 'Conversation Complexity'));
  steps.push(resolveOption(personalityOptions, c.personality, 'Personality'));

  // Integrations
  steps.push(resolveOption(leadCaptureOptions, c.leadCapture, 'Lead Capture'));
  steps.push(resolveOption(calendarOptions, c.calendar, 'Calendar'));

  if (c.notifications.length > 0) {
    const notifSteps: ResolvedStep[] = c.notifications.map(id => {
      const opt = notificationOptions.find(o => o.id === id);
      return {
        stepName: opt?.label ?? id,
        selectedLabel: opt?.label ?? id,
        selectedId: id,
        priceImpact: opt?.monthlyPrice ?? 0,
        isRecurring: true,
      };
    });
    steps.push({ stepName: 'Notifications', selectedLabel: `${c.notifications.length} selected`, selectedId: null, priceImpact: null, children: notifSteps });
  }

  if (c.additionalIntegrations.length > 0) {
    const intSteps: ResolvedStep[] = c.additionalIntegrations.map(id => {
      const opt = additionalIntegrationOptions.find(o => o.id === id);
      return {
        stepName: opt?.label ?? id,
        selectedLabel: opt?.label ?? id,
        selectedId: id,
        priceImpact: opt?.monthlyPrice ?? 0,
        isRecurring: true,
      };
    });
    steps.push({ stepName: 'Additional Integrations', selectedLabel: `${c.additionalIntegrations.length} selected`, selectedId: null, priceImpact: null, children: intSteps });
  }

  // Reporting
  steps.push(resolveOption(transcriptsOptions, c.transcripts, 'Transcripts'));
  steps.push(resolveOption(aiSummariesOptions, c.aiSummaries, 'AI Summaries'));
  steps.push(resolveOption(analyticsLevelOptions, c.analyticsLevel, 'Analytics Level'));
  steps.push(resolveOption(reportingFrequencyOptions, c.reportingFrequency, 'Reporting Frequency'));

  // Support
  steps.push(resolveOption(onboardingTypeOptions, c.onboardingType, 'Onboarding'));
  steps.push(resolveOption(knowledgeUpdatesOptions, c.knowledgeUpdates, 'Knowledge Updates'));
  steps.push(resolveOption(supportLevelOptions, c.supportLevel, 'Support Level'));

  return steps;
}

// ── Main entry point ──

type AnyServiceConfig =
  | WebsiteConfig
  | AppConfig
  | AnimationConfig
  | ImageConfig
  | SoundConfig
  | PaidMediaConfig
  | SocialMediaConfig
  | EmailMarketingConfig
  | BrandStrategyConfig
  | VisualIdentityConfig
  | BrandApplicationsConfig
  | ContentStrategyConfig
  | MessagingCopywritingConfig
  | AIReceptionistConfig;

export function resolveServiceConfig(
  serviceType: ServiceType,
  config: AnyServiceConfig,
  totals: { oneTime: number; monthly: number }
): ResolvedServiceConfig {
  const meta = serviceMetadata[serviceType];

  let steps: ResolvedStep[];

  switch (serviceType) {
    case 'website':
      steps = resolveWebsite(config as WebsiteConfig);
      break;
    case 'app':
      steps = resolveApp(config as AppConfig);
      break;
    case 'animation':
      steps = resolveAnimation(config as AnimationConfig);
      break;
    case 'image':
      steps = resolveImage(config as ImageConfig);
      break;
    case 'sound':
      steps = resolveSound(config as SoundConfig);
      break;
    case 'paid-media':
      steps = resolvePaidMedia(config as PaidMediaConfig);
      break;
    case 'social-media':
      steps = resolveSocialMedia(config as SocialMediaConfig);
      break;
    case 'email-marketing':
      steps = resolveEmailMarketing(config as EmailMarketingConfig);
      break;
    case 'brand-strategy':
      steps = resolveBrandStrategy(config as BrandStrategyConfig);
      break;
    case 'visual-identity':
      steps = resolveVisualIdentity(config as VisualIdentityConfig);
      break;
    case 'brand-applications':
      steps = resolveBrandApplications(config as BrandApplicationsConfig);
      break;
    case 'content-strategy':
      steps = resolveContentStrategy(config as ContentStrategyConfig);
      break;
    case 'messaging-copywriting':
      steps = resolveMessagingCopywriting(config as MessagingCopywritingConfig);
      break;
    case 'ai-receptionist':
      steps = resolveAIReceptionist(config as AIReceptionistConfig);
      break;
    default:
      steps = [];
  }

  return {
    serviceType,
    serviceLabel: meta.label,
    steps,
    oneTimeTotal: totals.oneTime,
    monthlyTotal: totals.monthly,
    hasCustomQuote: (config as { hasCustomQuote?: boolean }).hasCustomQuote ?? false,
  };
}
