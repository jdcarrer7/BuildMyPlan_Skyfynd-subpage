# Claude Code Prompt: BuildMyPlan - SkyFynd Subpage

## Project Overview

I want to create **BuildMyPlan**, an interactive pricing and service selection subpage for my creative and digital marketing company, **SkyFynd**. This page will allow customers to browse all service plans and packages we offer, select services, customize their plan, and see real-time pricing as they build their package.

---

## Project Setup Instructions

### 1. Working Directory
```
/Users/carlosmario/Desktop/Codes/Webpages/SkyFynd_BuildMyPlan_subpage
```

This is the root folder for the project. Create all project files, folders, and the CLAUDE.md file here.

### 2. GitHub Repository Setup
- Create a new GitHub repository named: **`BuildMyPlan_Skyfynd-subpage`**
- Initialize the repo with a README.md
- Connect the local folder to this remote repository
- Set up proper .gitignore for the project

### 3. Project Folder Structure
Create the following folder structure:
```
SkyFynd_BuildMyPlan_subpage/
├── CLAUDE.md
├── README.md
├── .gitignore
├── package.json
├── /src
│   ├── /components
│   ├── /pages
│   ├── /styles
│   ├── /data
│   ├── /hooks
│   ├── /utils
│   └── /assets
│       ├── /images
│       ├── /icons
│       └── /fonts
├── /public
├── /docs
│   ├── /specs
│   └── /references
└── /tests
```

---

## Application Description

### Purpose
BuildMyPlan is an interactive service configurator that allows potential clients to:
- Browse all available services organized by category
- View tiered packages (Essential, Pro, Enterprise) for each service
- Add individual services or full packages to their plan
- See a running total as they customize
- Submit their configured plan as a quote request

### Target Audience
- Small businesses and startups looking for digital marketing services
- Growing brands needing website development or creative services
- Enterprises seeking comprehensive digital solutions

---

## Design Requirements

### Brand Aesthetic
- **Theme:** Dark modern tech aesthetic
- **Primary Background:** Deep blacks and dark purples (#0a0a0a, #1a1a1a, #12101a, #1c1825)
- **Color Palette:**
  - **Primary Gradient:** Purple to pink gradient (for headings, highlights, CTAs)
  - **Dark Purple:** Background accents, cards, sections (#1c1825, #2a2435)
  - **White:** Primary text, headings (#ffffff, #f5f5f5)
  - **Light Gray:** Secondary text, descriptions (#a0a0a0, #888888)
  - **Orange/Amber:** Selected states, active indicators, accent highlights (#f59e0b, #ff9500)
  - **Purple Gradient Example:** linear-gradient(135deg, #8b5cf6 0%, #d946ef 50%, #ec4899 100%)
- **Typography:** 
  - Headings: Serif font (similar to Playfair Display or similar elegant serif)
  - Body: Clean sans-serif (Inter, DM Sans, or similar)
- **UI Elements:**
  - Cards: Dark purple/charcoal with subtle borders
  - Tags/Badges: Dark background with light text, orange for active/selected
  - Stats boxes: Dark with subtle border, clean typography
  - Floating particles/dots: Subtle animated background elements
- **Style:** Modern, tech-forward, clean, professional
- **Interactions:** Smooth animations, subtle hover effects, gradient transitions

### UI/UX Principles
- Clean, uncluttered interface
- Intuitive service selection flow
- Real-time price updates
- Mobile-first responsive design
- Clear visual hierarchy
- Accessible (WCAG 2.1 AA compliant)

---

## Core Features

### 1. Service Categories
Four main categories:
- **Design & Development**
- **Marketing**
- **Branding**
- **Content**

### 2. Tiered Pricing Structure
Each service has 3 tiers:
- **Essential** - $500
- **Pro** - $1,000
- **Enterprise** - $1,500

### 3. Plan Builder Interface
- Service cards with expandable details
- Add/remove services with one click
- Quantity adjustments where applicable
- Visual indicators for selected items
- Comparison view toggle for tiers

### 4. Price Calculator
- Running subtotal displayed prominently
- Real-time updates on selection changes
- Optional add-ons with price impact
- Discount logic for bundled services (optional)
- Clear price breakdown

### 5. Summary & Checkout
- Selected services summary panel
- Edit selections from summary
- "Request Quote" submission form
- Form fields: Name, Email, Company, Phone, Message/Notes
- Confirmation state after submission

### 6. Additional Features (Phase 2)
- Save/load plan configurations
- Share plan via link
- PDF export of configured plan
- Comparison mode for packages
- Testimonials or trust indicators

---

## Technical Requirements

### Recommended Stack
- **Framework:** React (Next.js preferred for future integration) or vanilla HTML/CSS/JS
- **Styling:** Tailwind CSS or custom CSS with CSS variables
- **State Management:** React Context or Zustand (if React)
- **Animations:** Framer Motion or CSS animations
- **Forms:** React Hook Form (if React)
- **Icons:** Lucide React or custom SVGs

### Performance Goals
- Lighthouse score > 90
- First Contentful Paint < 1.5s
- No layout shifts
- Optimized assets

### Browser Support
- Chrome, Firefox, Safari, Edge (latest 2 versions)
- Mobile browsers: iOS Safari, Chrome Android

---

## Complete Service Catalog & Pricing

### Pricing Tiers (Standard)
| Tier | Price |
|------|-------|
| Essential | $500 |
| Pro | $1,000 |
| Enterprise | $1,500 |

---

### Category 1: Design & Development

#### 1.1 Websites

**Service includes:**
- Website design & development
- Content management and optimization
- Ongoing support & maintenance

| Feature | Essential ($500) | Pro ($1,000) | Enterprise ($1,500) |
|---------|------------------|--------------|---------------------|
| **Best for** | Small businesses, personal brands, early startups | Growing brands, service businesses, lead generation | Tech startups, funded companies, premium brands |
| **Website Type** | Static | Dynamic (CMS-based) | Hybrid (CMS + advanced interaction) |
| **Custom Design** | ✓ | ✓ | ✓ |
| **Responsive (Desktop/Tablet/Mobile)** | ✓ | ✓ | ✓ |
| **Pages Included** | 3–5 pages | 6–10 pages | Custom |
| **CMS (Dynamic Content)** | — | ✓ | ✓ |
| **Reusable Page Templates** | — | ✓ | ✓ |
| **Basic Animations & Transitions** | ✓ | ✓ | ✓ |
| **Interactive Sections** | — | ✓ | ✓ |
| **Advanced Animations / Motion** | — | — | ✓ |
| **UX & Content Strategy** | — | — | ✓ |
| **Forms & Lead Capture** | ✓ | ✓ (multi-form) | ✓ (advanced flows) |
| **SEO-Ready Structure** | ✓ | ✓ | ✓ |
| **Analytics & Tracking Setup** | ✓ | ✓ | ✓ |
| **Performance Optimization** | ✓ | ✓ | ✓ |
| **E-commerce / Checkout** | — | — | Add-on |
| **Ongoing Maintenance** | — | — | Add-on |
| **Outcome** | Professional online presence | Website designed to convert | Premium digital experience |

#### 1.2 App Creation

| Feature | Essential ($500) | Pro ($1,000) | Enterprise ($1,500) |
|---------|------------------|--------------|---------------------|
| **Best for** | MVPs, simple tools, landing apps | Full-featured apps, business tools | Complex platforms, scalable solutions |
| **App Type** | Single-platform (web or mobile) | Cross-platform (web + mobile) | Native + Web ecosystem |
| **Screens/Views** | Up to 5 | Up to 12 | Custom |
| **UI/UX Design** | Template-based | Custom design | Bespoke design system |
| **User Authentication** | Basic (email/password) | Social logins + email | SSO, 2FA, advanced auth |
| **Database Integration** | Simple data storage | Full CRUD operations | Complex data architecture |
| **API Integrations** | 1 integration | Up to 3 integrations | Unlimited |
| **Push Notifications** | — | ✓ | ✓ (segmented) |
| **Analytics Dashboard** | Basic | Standard | Advanced reporting |
| **Testing & QA** | Basic | Comprehensive | Full test coverage |
| **Deployment** | Single environment | Staging + Production | Multi-environment |
| **Documentation** | Basic | Standard | Comprehensive |

#### 1.3 Animations

| Feature | Essential ($500) | Pro ($1,000) | Enterprise ($1,500) |
|---------|------------------|--------------|---------------------|
| **Best for** | Social content, simple web elements | Marketing campaigns, presentations | Brand films, premium experiences |
| **Animation Type** | Motion graphics, simple loops | Complex motion, character animation | Cinematic, 3D elements |
| **Duration** | Up to 15 seconds | Up to 60 seconds | Custom length |
| **Revisions** | 2 rounds | 4 rounds | Unlimited |
| **Formats Delivered** | MP4, GIF | MP4, GIF, WebM, Lottie | All formats + source files |
| **Sound Design** | — | Basic | Custom audio/music |
| **Storyboarding** | — | ✓ | ✓ (detailed) |
| **3D Elements** | — | — | ✓ |
| **Interactive (Lottie/Web)** | — | ✓ | ✓ (advanced) |

#### 1.4 Images

| Feature | Essential ($500) | Pro ($1,000) | Enterprise ($1,500) |
|---------|------------------|--------------|---------------------|
| **Best for** | Social media, basic marketing | Campaigns, web content, ads | Premium branding, editorial |
| **Image Count** | Up to 5 images | Up to 15 images | Up to 30 images |
| **Style** | Standard editing/enhancement | Advanced compositing, retouching | Bespoke creative direction |
| **AI-Generated Options** | ✓ | ✓ | ✓ |
| **Custom Illustrations** | — | ✓ | ✓ (complex) |
| **Photo Manipulation** | Basic | Advanced | Expert-level |
| **Formats** | JPG, PNG | JPG, PNG, WebP | All formats + RAW/PSD |
| **Commercial License** | ✓ | ✓ | ✓ (exclusive rights) |
| **Revisions** | 2 rounds | 4 rounds | Unlimited |

#### 1.5 Original Ringtones

| Feature | Essential ($500) | Pro ($1,000) | Enterprise ($1,500) |
|---------|------------------|--------------|---------------------|
| **Best for** | Personal use, small brands | Apps, brand notifications | Full audio branding suite |
| **Ringtones/Sounds** | Up to 3 | Up to 8 | Up to 15 |
| **Duration** | Up to 30 seconds each | Up to 45 seconds each | Custom length |
| **Style Options** | 2 style variations | 4 style variations | Unlimited exploration |
| **Notification Sounds** | — | ✓ | ✓ |
| **System Sound Package** | — | — | ✓ |
| **Formats** | MP3, M4R | MP3, M4R, WAV | All formats + stems |
| **Commercial License** | Personal only | Commercial use | Exclusive rights |
| **Revisions** | 2 rounds | 4 rounds | Unlimited |

---

### Category 2: Marketing

#### 2.1 Paid Media & Lead Generation

| Feature | Essential ($500) | Pro ($1,000) | Enterprise ($1,500) |
|---------|------------------|--------------|---------------------|
| **Best for** | Testing ads, small campaigns | Active lead generation | Full-funnel marketing |
| **Platforms** | 1 platform | Up to 3 platforms | Unlimited platforms |
| **Ad Creatives** | Up to 3 | Up to 10 | Up to 25 |
| **Campaign Setup** | ✓ | ✓ | ✓ |
| **Audience Research** | Basic | Detailed personas | Advanced segmentation |
| **A/B Testing** | — | ✓ | ✓ (multivariate) |
| **Landing Page** | — | 1 included | Up to 3 included |
| **Retargeting Setup** | — | ✓ | ✓ (advanced) |
| **Conversion Tracking** | Basic | Standard | Advanced attribution |
| **Monthly Reporting** | Basic metrics | Detailed report | Custom dashboard |
| **Ad Spend Management** | Guidance only | Up to $2,500/mo | Up to $10,000/mo |
| **Campaign Duration** | Setup only | 1 month management | 1 month + strategy |

#### 2.2 Social Media Management

| Feature | Essential ($500) | Pro ($1,000) | Enterprise ($1,500) |
|---------|------------------|--------------|---------------------|
| **Best for** | Maintaining presence | Growing engagement | Full social strategy |
| **Platforms Managed** | 1 platform | Up to 3 platforms | Up to 5 platforms |
| **Posts per Month** | 8 posts | 16 posts | 30 posts |
| **Content Calendar** | Basic | Detailed | Strategic calendar |
| **Content Creation** | Captions only | Captions + basic graphics | Full creative (graphics, video) |
| **Hashtag Strategy** | ✓ | ✓ | ✓ (researched) |
| **Community Management** | — | Basic engagement | Full management |
| **Stories/Reels** | — | 4 per month | 12 per month |
| **Analytics Report** | Basic | Monthly detailed | Weekly + insights |
| **Influencer Outreach** | — | — | ✓ |
| **Paid Boost Strategy** | — | — | ✓ |

#### 2.3 Email Marketing & Automation

| Feature | Essential ($500) | Pro ($1,000) | Enterprise ($1,500) |
|---------|------------------|--------------|---------------------|
| **Best for** | Newsletter setup, basic emails | Nurture sequences, campaigns | Full automation ecosystem |
| **Email Platform Setup** | ✓ | ✓ | ✓ |
| **Email Templates** | 1 template | 3 templates | 5 templates |
| **Email Campaigns** | Up to 4 | Up to 10 | Up to 20 |
| **Automation Sequences** | — | 1 sequence (5 emails) | 3 sequences (unlimited) |
| **List Segmentation** | Basic | Advanced | Dynamic segmentation |
| **A/B Testing** | — | Subject lines | Full testing |
| **Lead Magnets** | — | 1 included | Up to 3 included |
| **Landing Pages** | — | — | 2 included |
| **Analytics & Reporting** | Basic open rates | Detailed metrics | Full funnel tracking |
| **Integration Setup** | 1 integration | Up to 3 | Unlimited |

---

### Category 3: Branding

#### 3.1 Brand Strategy & Positioning (Consulting)

| Feature | Essential ($500) | Pro ($1,000) | Enterprise ($1,500) |
|---------|------------------|--------------|---------------------|
| **Best for** | Startups, pivoting brands | Established brands, repositioning | Enterprise rebrand, market entry |
| **Discovery Session** | 1 hour | 2 hours | 4 hours |
| **Competitor Analysis** | 3 competitors | 5 competitors | 10 competitors |
| **Target Audience Definition** | Basic personas | Detailed personas | Research-backed personas |
| **Brand Positioning Statement** | ✓ | ✓ | ✓ |
| **Value Proposition** | ✓ | ✓ | ✓ (tested) |
| **Brand Voice Guidelines** | — | ✓ | ✓ (comprehensive) |
| **Messaging Framework** | — | Basic | Full hierarchy |
| **Market Opportunity Analysis** | — | — | ✓ |
| **Strategic Recommendations** | Summary | Detailed report | Roadmap + presentation |
| **Follow-up Session** | — | 30 minutes | 1 hour |

#### 3.2 Visual Identity Design

**Includes:** Logo, Icons, Business Concept Development

| Feature | Essential ($500) | Pro ($1,000) | Enterprise ($1,500) |
|---------|------------------|--------------|---------------------|
| **Best for** | New brands, refreshes | Growing brands, full identity | Premium brands, complete systems |
| **Logo Concepts** | 2 concepts | 4 concepts | 6 concepts |
| **Logo Revisions** | 2 rounds | 4 rounds | Unlimited |
| **Logo Variations** | Primary only | Primary + secondary | Full logo system |
| **Icon Set** | — | 5 custom icons | 15 custom icons |
| **Color Palette** | Primary colors | Full palette + usage | Extended palette + system |
| **Typography Selection** | 1 font pairing | 2 font pairings | Custom type hierarchy |
| **Brand Mark/Symbol** | — | ✓ | ✓ |
| **Pattern/Texture Design** | — | — | ✓ |
| **Style Guide** | Basic (2 pages) | Standard (8 pages) | Comprehensive (20+ pages) |
| **File Formats** | PNG, JPG, PDF | + SVG, EPS | + AI source files |

#### 3.3 Brand Applications

**Includes:** Business cards, letterheads, Social media templates

| Feature | Essential ($500) | Pro ($1,000) | Enterprise ($1,500) |
|---------|------------------|--------------|---------------------|
| **Best for** | Basic collateral needs | Full business suite | Complete brand rollout |
| **Business Card Design** | 1 design | 2 designs | Custom designs + variants |
| **Letterhead** | ✓ | ✓ | ✓ + envelope |
| **Email Signature** | ✓ | ✓ | ✓ (multiple versions) |
| **Social Media Templates** | 3 templates | 8 templates | 15 templates |
| **Social Media Covers** | 1 platform | 3 platforms | All platforms |
| **Presentation Template** | — | Basic (10 slides) | Premium (25 slides) |
| **Document Templates** | — | 2 templates | 5 templates |
| **Merchandise Mockups** | — | — | 5 mockups |
| **Print-Ready Files** | ✓ | ✓ | ✓ |
| **Editable Source Files** | — | Canva/Figma | All formats |

---

### Category 4: Content

#### 4.1 Content Strategy (Consultation)

| Feature | Essential ($500) | Pro ($1,000) | Enterprise ($1,500) |
|---------|------------------|--------------|---------------------|
| **Best for** | Content direction, planning | Full content planning | Integrated content ecosystem |
| **Strategy Session** | 1 hour | 2 hours | 4 hours |
| **Content Audit** | — | Basic audit | Comprehensive audit |
| **Audience Analysis** | Basic | Detailed | Research-backed |
| **Content Pillars** | 3 pillars | 5 pillars | 7 pillars + sub-topics |
| **Content Calendar** | 1 month | 3 months | 6 months |
| **Channel Strategy** | 1 channel | 3 channels | Omnichannel |
| **SEO Keyword Research** | — | Basic | Comprehensive |
| **Competitor Content Analysis** | — | 3 competitors | 5 competitors |
| **Content Guidelines** | — | Basic | Comprehensive playbook |
| **Performance KPIs** | Basic | Detailed | Full measurement framework |
| **Follow-up Session** | — | 30 minutes | 1 hour |

#### 4.2 Messaging & Copywriting

| Feature | Essential ($500) | Pro ($1,000) | Enterprise ($1,500) |
|---------|------------------|--------------|---------------------|
| **Best for** | Core messaging, small projects | Website copy, campaigns | Full brand messaging |
| **Word Count** | Up to 1,000 words | Up to 3,000 words | Up to 7,000 words |
| **Tagline Options** | 3 options | 5 options | 10 options |
| **Headlines/Hooks** | 5 | 15 | 30 |
| **Website Pages** | 1 page | Up to 5 pages | Up to 10 pages |
| **Product Descriptions** | — | Up to 10 | Up to 25 |
| **Email Copy** | — | 3 emails | 10 emails |
| **Ad Copy Variations** | — | 5 variations | 15 variations |
| **SEO Optimization** | — | Basic | Advanced |
| **Tone of Voice Guide** | — | — | ✓ |
| **Revisions** | 2 rounds | 4 rounds | Unlimited |

---

## Data Structure

### Service Data Model
```javascript
{
  id: "websites",
  category: "design-development",
  categoryName: "Design & Development",
  name: "Websites",
  description: "Website design & development, content management and optimization, ongoing support & maintenance",
  tiers: [
    {
      id: "essential",
      name: "Essential",
      price: 500,
      priceType: "one-time",
      bestFor: "Small businesses, personal brands, early startups",
      outcome: "Professional online presence",
      features: [
        { name: "Website Type", value: "Static", included: true },
        { name: "Custom Design", value: true, included: true },
        { name: "Responsive", value: true, included: true },
        { name: "Pages Included", value: "3-5 pages", included: true },
        { name: "CMS (Dynamic Content)", value: false, included: false },
        { name: "Reusable Page Templates", value: false, included: false },
        { name: "Basic Animations & Transitions", value: true, included: true },
        { name: "Interactive Sections", value: false, included: false },
        { name: "Advanced Animations / Motion", value: false, included: false },
        { name: "UX & Content Strategy", value: false, included: false },
        { name: "Forms & Lead Capture", value: "Basic", included: true },
        { name: "SEO-Ready Structure", value: true, included: true },
        { name: "Analytics & Tracking Setup", value: true, included: true },
        { name: "Performance Optimization", value: true, included: true },
        { name: "E-commerce / Checkout", value: false, included: false },
        { name: "Ongoing Maintenance", value: false, included: false }
      ],
      popular: false
    },
    {
      id: "pro",
      name: "Pro",
      price: 1000,
      priceType: "one-time",
      bestFor: "Growing brands, service businesses, lead generation",
      outcome: "Website designed to convert",
      features: [
        { name: "Website Type", value: "Dynamic (CMS-based)", included: true },
        { name: "Custom Design", value: true, included: true },
        { name: "Responsive", value: true, included: true },
        { name: "Pages Included", value: "6-10 pages", included: true },
        { name: "CMS (Dynamic Content)", value: true, included: true },
        { name: "Reusable Page Templates", value: true, included: true },
        { name: "Basic Animations & Transitions", value: true, included: true },
        { name: "Interactive Sections", value: true, included: true },
        { name: "Advanced Animations / Motion", value: false, included: false },
        { name: "UX & Content Strategy", value: false, included: false },
        { name: "Forms & Lead Capture", value: "Multi-form", included: true },
        { name: "SEO-Ready Structure", value: true, included: true },
        { name: "Analytics & Tracking Setup", value: true, included: true },
        { name: "Performance Optimization", value: true, included: true },
        { name: "E-commerce / Checkout", value: false, included: false },
        { name: "Ongoing Maintenance", value: false, included: false }
      ],
      popular: true
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: 1500,
      priceType: "one-time",
      bestFor: "Tech startups, funded companies, premium brands",
      outcome: "Premium digital experience",
      features: [
        { name: "Website Type", value: "Hybrid (CMS + advanced interaction)", included: true },
        { name: "Custom Design", value: true, included: true },
        { name: "Responsive", value: true, included: true },
        { name: "Pages Included", value: "Custom", included: true },
        { name: "CMS (Dynamic Content)", value: true, included: true },
        { name: "Reusable Page Templates", value: true, included: true },
        { name: "Basic Animations & Transitions", value: true, included: true },
        { name: "Interactive Sections", value: true, included: true },
        { name: "Advanced Animations / Motion", value: true, included: true },
        { name: "UX & Content Strategy", value: true, included: true },
        { name: "Forms & Lead Capture", value: "Advanced flows", included: true },
        { name: "SEO-Ready Structure", value: true, included: true },
        { name: "Analytics & Tracking Setup", value: true, included: true },
        { name: "Performance Optimization", value: true, included: true },
        { name: "E-commerce / Checkout", value: "Add-on", included: "addon" },
        { name: "Ongoing Maintenance", value: "Add-on", included: "addon" }
      ],
      popular: false
    }
  ],
  addOns: [
    { id: "extra-page", name: "Additional Page", price: 75 },
    { id: "ecommerce", name: "E-commerce / Checkout", price: 300 },
    { id: "maintenance", name: "Ongoing Maintenance (monthly)", price: 150 }
  ]
}
```

### Cart/Plan State Model
```javascript
{
  items: [
    {
      serviceId: "websites",
      tierId: "pro",
      quantity: 1,
      addOns: ["ecommerce"],
      subtotal: 1300
    },
    {
      serviceId: "visual-identity",
      tierId: "essential",
      quantity: 1,
      addOns: [],
      subtotal: 500
    }
  ],
  subtotal: 1800,
  discount: 0,
  total: 1800,
  customerInfo: {
    name: "",
    email: "",
    company: "",
    phone: "",
    notes: ""
  }
}
```

---

## Service Summary Reference

### Quick Reference Table

| Category | Service | Essential | Pro | Enterprise |
|----------|---------|-----------|-----|------------|
| **Design & Development** | Websites | $500 | $1,000 | $1,500 |
| | App Creation | $500 | $1,000 | $1,500 |
| | Animations | $500 | $1,000 | $1,500 |
| | Images | $500 | $1,000 | $1,500 |
| | Original Ringtones | $500 | $1,000 | $1,500 |
| **Marketing** | Paid Media & Lead Gen | $500 | $1,000 | $1,500 |
| | Social Media Management | $500 | $1,000 | $1,500 |
| | Email Marketing & Automation | $500 | $1,000 | $1,500 |
| **Branding** | Brand Strategy (Consulting) | $500 | $1,000 | $1,500 |
| | Visual Identity Design | $500 | $1,000 | $1,500 |
| | Brand Applications | $500 | $1,000 | $1,500 |
| **Content** | Content Strategy (Consulting) | $500 | $1,000 | $1,500 |
| | Messaging & Copywriting | $500 | $1,000 | $1,500 |

**Total Services:** 13
**Price Range:** $500 - $1,500 per service

---

## CLAUDE.md File

Create a CLAUDE.md file in the project root with:
- Project overview and purpose
- Tech stack documentation
- Folder structure explanation
- Coding conventions and standards
- Component naming patterns
- Git workflow instructions
- Environment setup steps
- Key decisions and rationale
- Links to reference docs in /docs folder
- Complete service catalog reference

---

## Deliverables for Initial Setup

1. ✅ Initialize project folder structure
2. ✅ Create GitHub repository and connect
3. ✅ Set up CLAUDE.md with project documentation
4. ✅ Create README.md with project description
5. ✅ Initialize package.json with dependencies
6. ✅ Set up base styling with dark theme and gold accents
7. ✅ Create data files for all 13 services with full feature breakdowns
8. ✅ Build basic component structure
9. ✅ Implement responsive layout foundation

---

## Notes

- Assets and additional reference materials will be placed in `/docs/references` or `/src/assets`
- The page will eventually integrate into the main SkyFynd company website
- Prioritize clean, maintainable code for future scaling
- Document all major decisions in CLAUDE.md
- All services use consistent $500 / $1,000 / $1,500 tier pricing

---

## Questions to Confirm Before Starting

1. Preferred framework: React/Next.js or vanilla HTML/CSS/JS?
2. Any existing brand assets (logo, fonts, icons) to include?
3. Form submission: API endpoint, email service, or just frontend for now?
4. Any bundle discounts for multiple services?

---

Let's build something exceptional. 🚀
