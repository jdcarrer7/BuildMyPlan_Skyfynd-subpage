# BuildMyPlan - SkyFynd Interactive Service Configurator

## Project Overview

BuildMyPlan is an interactive pricing and service selection subpage for SkyFynd, a creative and digital marketing company. It allows customers to browse services, select tiers, customize plans, and request quotes with real-time pricing.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **Animations:** Framer Motion
- **Forms:** React Hook Form + Zod validation
- **Icons:** Lucide React

## Folder Structure

```
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # Reusable UI components
│   ├── data/            # Service catalog & static data
│   ├── hooks/           # Custom React hooks
│   ├── styles/          # Global styles, CSS variables
│   ├── utils/           # Helper functions
│   └── assets/          # Images, icons, fonts
├── public/              # Static assets
├── docs/                # Documentation & specs
└── tests/               # Test files
```

## Design System

### Color Palette

```css
/* Backgrounds */
--bg-primary: #0a0a0a;
--bg-secondary: #1a1a1a;
--bg-card: #1c1825;
--bg-card-hover: #2a2435;

/* Gradients */
--gradient-primary: linear-gradient(135deg, #8b5cf6 0%, #d946ef 50%, #ec4899 100%);

/* Text */
--text-primary: #ffffff;
--text-secondary: #a0a0a0;
--text-muted: #888888;

/* Accent */
--accent-orange: #f59e0b;
--accent-purple: #8b5cf6;
--accent-pink: #ec4899;
```

### Typography

- **Headings:** Playfair Display (serif)
- **Body:** Inter (sans-serif)

## Component Naming Conventions

- **Components:** PascalCase (e.g., `ServiceCard.tsx`)
- **Hooks:** camelCase with 'use' prefix (e.g., `usePlanStore.ts`)
- **Utils:** camelCase (e.g., `calculateDiscount.ts`)
- **Data files:** camelCase (e.g., `services.ts`)

## Service Catalog

### Categories (4 total)

1. Design & Development
2. Marketing
3. Branding
4. Content

### Services (13 total)

| Category | Services |
|----------|----------|
| Design & Development | Websites, App Creation, Animations, Images, Original Ringtones |
| Marketing | Paid Media & Lead Gen, Social Media Management, Email Marketing |
| Branding | Brand Strategy, Visual Identity Design, Brand Applications |
| Content | Content Strategy, Messaging & Copywriting |

### Pricing Tiers

| Tier | Price |
|------|-------|
| Essential | $500 |
| Pro | $1,000 |
| Enterprise | $1,500 |

### Bundle Discounts

- 3+ services: 10% off
- 5+ services: 15% off
- 7+ services: 20% off

## Key Commands

```bash
# Development
npm run dev

# Build
npm run build

# Lint
npm run lint

# Type check
npx tsc --noEmit
```

## Git Workflow

1. Work on feature branches
2. Commit with descriptive messages
3. Push to remote before creating PR

## Key Decisions

1. **Next.js App Router** - Chosen for modern React patterns and future SSR capabilities
2. **Zustand** - Lightweight state management for cart/plan state
3. **Framer Motion** - Smooth animations without heavy dependencies
4. **Frontend-only form** - Quote submission is mocked for now, ready for API integration

## Form Submission

Currently mocked (console.log). Ready for integration with:
- Custom API endpoint
- Formspree
- EmailJS
- Any backend service

## Future Enhancements (Phase 2)

- Save/load plan configurations
- Share plan via link
- PDF export
- Comparison mode
- Testimonials section
