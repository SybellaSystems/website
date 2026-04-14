# Sybella Systems — Website v2.0
### Internal Brand & Technical Reference Document

> **For the Sybella Systems core team.** This document explains every intentional decision made in the design and engineering of our new website — the brand language, color system, typography, page structure, SEO architecture, and the vision behind it all. Read this before touching any code.

---

## The Vision Behind This Redesign

The previous version of our digital presence did not reflect who we are or where we are going. We are not a typical startup. We are not a freelance shop. We are not a generic African tech company.

**We are building Africa's most premium software infrastructure company.**

That conviction had to come through in every pixel, every word, every interaction. The new website was designed with one standard: *it should feel like the company building Africa's digital future.* Not loud. Not cluttered. Restrained, intelligent, and deeply intentional — the way truly great companies communicate.

Every decision on this site — font choice, spacing, color accent, animation speed — was made to serve that positioning.

---

## Brand Identity

### The Tagline
**"Engineering Africa's Digital Future."**

This is not marketing copy. It is a statement of intent that appears throughout the site and defines our positioning. It communicates three things simultaneously:
- We are engineers, not generalists
- Our scope is the African continent
- We are building forward, not patching the present

### Personality
The brand operates across four axes:

| Axis | Expression |
|---|---|
| **Tone** | Confident, not arrogant. Intelligent, not academic. Warm, not casual. |
| **Voice** | First-person plural. Direct sentences. No filler. No buzzwords. |
| **Aesthetic** | Dark luxury. Restraint. Precision. Architectural. |
| **Emotion** | Quiet confidence — the feeling of talking to the best in the room who doesn't need to say so. |

### What We Are NOT
- Not loud or aggressive in our marketing
- Not cluttered or feature-listing
- Not using clichéd "African patterns" as aesthetic decoration
- Not defaulting to blues and whites like every other tech company

---

## Color System

All colors are defined as CSS variables in `app/globals.css`. **Never hardcode hex values anywhere in the codebase. Always reference variables.**

### Base Palette

| Variable | Hex | Usage |
|---|---|---|
| `--black` | `#080808` | Page background. True near-black with a hint of warmth. |
| `--charcoal` | `#111118` | Section alternates. Slightly cooler than black to create depth. |
| `--surface` | `#16161f` | Cards, panels, elevated components. |
| `--surface-2` | `#1e1e2a` | Input backgrounds, code blocks, nested surfaces. |

The four base tones create a **layered depth system** — backgrounds recede, surfaces advance. This mimics architectural lighting and gives the site a three-dimensional quality without using actual shadows everywhere.

### Accent Palette

| Variable | Hex | Role | Meaning |
|---|---|---|---|
| `--gold` | `#c9a84c` | Primary accent | Prestige, authority, premium positioning |
| `--gold-bright` | `#e8c56d` | Highlight, headlines, hover states | Active, noticed, important |
| `--gold-dim` | `rgba(201,168,76,0.15)` | Tag backgrounds, subtle fills | Hinted presence |
| `--emerald` | `#2dba85` | Ogera brand, success, growth | Product identity, forward motion |
| `--emerald-dim` | `rgba(45,186,133,0.12)` | Ogera section fills | Ogera-specific context |
| `--copper` | `#b87333` | Gradient mid-tone, warmth | Connects gold to earth, grounds the palette |
| `--magenta` | `#c2185b` | Reserved, SyIntel™ AI accent | Intelligence, disruption (use sparingly) |

**Why gold?** Gold communicates premium quality, historical significance, and earned prestige — without screaming luxury the way neon or chrome would. It is warm and human. Against our near-black backgrounds, it creates the exact contrast ratio we want: noticeable but never overwhelming.

**Why emerald for Ogera?** Emerald reads as growth, youth, vitality, and forward momentum. It differentiates the Ogera product from the parent Sybella brand while still feeling premium. When users land on the Ogera page, they immediately feel a shift — same quality, different energy.

### Borders

| Variable | Value | Usage |
|---|---|---|
| `--border` | `rgba(255,255,255,0.07)` | Default — barely-there lines that separate without dividing |
| `--border-bright` | `rgba(255,255,255,0.14)` | Hover states, emphasized separators |

Borders on this site are intentionally whisper-thin. They are structural cues, not decorative elements.

### Text Hierarchy

| Variable | Opacity | Usage |
|---|---|---|
| `--text-primary` | `#f2f0ea` (warm white) | Headlines, active labels, primary content |
| `--text-secondary` | `55% opacity` | Body copy, descriptions, supporting text |
| `--text-tertiary` | `30% opacity` | Metadata, timestamps, captions, placeholders |

The warm white (`#f2f0ea`) instead of pure white (`#ffffff`) was a deliberate choice. Pure white on near-black feels harsh and clinical. The warm off-white feels like candlelight — premium, readable, and easier on the eyes over long reading sessions.

---

## Typography

### Font Stack

**Display / Headlines: `Syne`**
- Weights used: 700 (headings), 800 (hero headlines), 600 (subheadings), 500 (labels)
- Syne is a geometric sans-serif with architectural, constructed letterforms. It feels technical and premium simultaneously. Unlike Space Grotesk or Inter (overused in the tech space), Syne has a distinctive character that registers as memorable.
- All headlines use `letter-spacing: -0.02em` to -0.05em — tight tracking is the mark of confident, high-end display typography.
- Line height for large headlines: `0.95` to `1.1` — compressed for drama.

**Body / Prose: `DM Sans`**
- Weights used: 300 (light captions), 400 (body), 500 (medium emphasis), 600 (strong labels)
- DM Sans is optimized for readability on screens. It's humanist, warm, and pairs well with Syne's geometry without competing with it.
- Body line height: `1.8` — generous, for comfortable extended reading.

**Rule:** Syne carries authority. DM Sans delivers information. Never swap their roles.

### Type Scale

Headlines scale fluidly using `clamp()`:

```css
/* Hero H1 */ font-size: clamp(44px, 6vw, 84px)
/* Section H2 */ font-size: clamp(28px, 3.5vw, 52px)
/* Card H3 */ font-size: 18–22px fixed
/* Labels */ font-size: 11px, letter-spacing: 0.12–0.2em, UPPERCASE
/* Body */ font-size: 14–17px
/* Captions */ font-size: 12–13px
```

Fluid sizing ensures the typography reads correctly at every breakpoint without media query overrides.

### The Shimmer Headline Effect

On key moments (hero sections, major CTAs), the text `"Africa's"` and `"exceptional"` use the `.gradient-text` class — a CSS animation that slides a gold-to-copper gradient across the text at a 4-second interval. It is subtle, never distracting, and communicates that this is the most important word on the page.

---

## Motion & Animation

### Philosophy
Less is more. Every animation on the site has a specific job:

1. **Page load / scroll reveal** — content fades up (`opacity: 0` → `1`, `translateY(24px)` → `0`) as sections enter the viewport. This is handled by `IntersectionObserver` in each page component. Delay is staggered for multi-item grids via CSS `transition-delay`. This gives the page a sense of life without feeling like a loading spinner.

2. **The Hero Orbital SVG** — the orb on the homepage is a pure SVG composition: concentric rings, dashed orbit paths, positioned dots at calculated angular intervals, and a central Sybella mark. It communicates scale, connection, and precision without requiring a video or heavy asset. It stays visually interesting without animation — nothing flashes or pulses.

3. **The shimmer gradient** — `background-position` animates from `0%` to `200%` over 4 seconds on gradient text. Barely perceptible. Just alive enough.

4. **Hover states** — cards lift `translateY(-4px)` on hover with border brightening. Buttons shift up `translateY(-1px)` with a gold glow shadow. Nav links fade from `--text-secondary` to `--text-primary`.

5. **The grain overlay** — a fixed SVG `feTurbulence` noise layer sits at `z-index: 9999` over the entire page at `3.5% opacity`. This is a technique borrowed from luxury print design — it adds texture and removes the flat, screen-like quality from the dark backgrounds. Users won't consciously notice it. But without it, the site feels cheaper.

**What we avoided:** parallax, scroll-jacking, entrance animations that block interaction, looping video backgrounds, loading screens.

---

## Page Architecture

### Global Layout

```
app/
├── layout.tsx          ← Root layout: Nav + Footer wrap all pages
├── globals.css         ← Design system: all CSS variables, utility classes
├── page.tsx            ← Home (serves HomeClient.tsx)
├── sitemap.ts          ← Auto-generated /sitemap.xml
├── ogera/
│   └── page.tsx        ← Ogera product page (client component)
├── technology/
│   └── page.tsx        ← Technology & services page
└── impact/
    └── page.tsx        ← Impact, about, contact page

components/
├── Nav.tsx             ← Global navigation (client component)
├── HomeClient.tsx      ← Homepage sections (client component)
└── Footer.tsx          ← Global footer (client component)

public/
├── favicon.svg         ← SVG favicon (gold S-mark on black)
├── manifest.json       ← PWA manifest
└── robots.txt          ← Search engine crawl rules
```

---

### Page 1: Home (`/`)

**Purpose:** Create an immediate, visceral impression of who Sybella Systems is. Convert first-time visitors into believers before they scroll.

**Sections in order:**

**Hero** — Full-height opening. Left side: tag badge (location + founded year), H1 headline with shimmer "Africa's", value proposition, two CTAs (Explore Our Work / Discover Ogera), stats strip. Right side: the orbital SVG orb. The orb communicates our technological precision without words. The asymmetric layout (text left, visual right) is a deliberate break from centered hero designs that feel generic.

**Vision** — Three-column grid on charcoal background. Each column carries a numbered principle (01, 02, 03): Precision Engineering, African Context, Global Standard. This section answers the implicit question: "Why should I trust these people?" It communicates values through specificity, not platitudes.

**Services** — Six service cards in an auto-fill grid. Each card: a geometric icon, the service code (SyCore™ etc.), name, description, and dominant accent color. The grid is responsive — it collapses gracefully. This section replaces a traditional "what we do" paragraph with scannable, specific capability signals.

**Ogera Spotlight** — Two-column feature on charcoal. Left: mock platform UI (a deliberately minimal "app preview" showing key metrics: active opportunities, student profiles, employer count, beta launch date). Right: positioning copy, three benefit bullets, two CTAs. The mock UI communicates "this is real" better than any screenshot or description. The emerald accent creates a clear visual shift into Ogera's identity.

**Trust Indicators** — Four stats (Authorized Capital, Service Verticals, Beta Launch, Scalability Target), then a dual CTA block split between businesses and students/employers. This closes the homepage conversion loop.

---

### Page 2: Ogera (`/ogera`)

**Purpose:** Position Ogera as a transformational product, not just a job board. Generate beta registrations.

**Sections:**

**Hero** — Large-scale typographic hero with the emerald "Employment OS" label. Immediately differentiates Ogera from LinkedIn, Jobberman, or similar platforms by leading with "OS" (operating system) — a signal that this is infrastructure, not a listings site.

**For Students (How It Works)** — Three sequential steps: Build Your Profile → Get Matched → Earn & Grow. Each step has a numbered label, geometric icon, headline, and description. Clear, non-technical, emotionally engaging. Answers the student's question: "What does Ogera actually do for me?"

**For Employers** — Two-column section. Left: four-pillar value proposition (Verified Profiles, AI Matching, Performance Tracking, Compliance Ready) with gold left-border accent. Right: live candidate card preview — three fictional but realistic student profiles with names, universities, skill tags, and AI match percentages. This section makes the employer value tangible. The candidate cards are designed to feel like the actual product.

**Beta Registration Form** — Minimal, centered form: name, email, university/company, role selector (Student / Employer / University Partner). On submit, opens a pre-formatted mailto to `bessora@sybellasystems.co.rw`. The success state shows a checkmark and confirmation copy — no page reload needed.

---

### Page 3: Technology (`/technology`)

**Purpose:** Establish engineering credibility. Target technical decision-makers and enterprise buyers.

**Sections:**

**Hero** — "Engineered for Precision" with fluid oversized headline. The single-word line breaks (Engineered / for / Precision) are a typographic technique that forces the reader to feel the weight of each word individually.

**Architecture** — Side-by-side: left column covers the three architecture pillars (Scalability, Security, Performance) as bordered panel cards with colored left borders and specific technical claims. Right column shows a styled code block (`sybella-architecture.ts`) — a fictional but realistic TypeScript config that communicates how we think about systems. Below the code block: four metric cards (99.9% uptime, <200ms p95, SOC 2, 256-bit). Enterprise buyers look for these signals. We put them where they'll be seen.

**Service Verticals** — All seven Sybella service codes (SyCore™ through SyIntel™) in a three-column grid. Each card shows: the trademark code, service name, description, and four feature bullets. This is the definitive reference for what Sybella builds.

---

### Page 4: Impact & About (`/impact`)

**Purpose:** Build emotional connection. Tell the founding story. Convert interested visitors into partners. Capture contact leads.

**Sections:**

**Hero** — The most direct statement on the site: "Africa Has the Talent. We Build the Systems." This is the company's thesis in nine words. The emerald/gold split on the two halves of the statement reinforces the dual Sybella/Ogera identity.

**Our Story** — Left: founding narrative with specific facts (Rwanda, 2025, dual-founder structure, Ogera mission). Avoids generic "we are passionate about technology" language entirely. Right: a vertical timeline (2025 Q4 → 2026 Q1 → Q2 → Q3 → 2027+) showing our trajectory. Active milestones have gold dots; future milestones have dim dots. This communicates both credibility (we have a real track record) and ambition (we have a clear vision).

**Mission & Values** — Four value cards in a 2×2 grid: Excellence Over Speed, African Context First, Transparent Partnership, Long-Term Thinking. Each value is specific and actionable — not hollow mission-statement language. Each comes with a geometric icon.

**Contact Form** — Left: company contact details (email, location, legal structure) with icon accents. Right: a full project inquiry form (name, company, email, message). On submit, opens a pre-formatted mailto to `bessora@sybellasystems.co.rw`. Success state confirms the message was sent.

---

## Navigation

The navbar is a fixed, glass-blurred strip (`backdrop-filter: blur(20px)`) that appears transparent on scroll position zero and activates its blur + border on scroll. This is a deliberate UX choice — on the hero, the navigation floats over the content and doesn't compete with it. Once you begin reading, it locks into place.

**Desktop nav links:** Home · Ogera · Technology · Impact  
**CTA buttons:** "Work With Us" (ghost) · "Join Ogera" (primary gold)  
**Mobile:** Hamburger that reveals a full-screen slide-down panel with large tap targets (48px+ touch areas).

The active page link highlights in `--gold-bright`. All other links use `--text-secondary` at rest, `--text-primary` on hover.

The wordmark: the Sybella logotype is set in Syne 800 with `-0.03em` tracking and the SVG S-mark (a stylized double-path S in gold on black). The mark is hand-drawn as SVG paths — not a font character.

---

## Footer

Four-column layout:
- **Column 1 (2x width):** Brand block — wordmark, positioning statement, social icon row (LinkedIn, Twitter, GitHub — styled as bordered squares, not brand color circles).
- **Column 2:** Company links
- **Column 3:** Product links (Ogera sections)
- **Column 4:** Services links

Bottom bar: copyright + legal links (Privacy Policy, Terms). The "Sybella Systems Ltd. Rulindo, Rwanda" line reinforces geographic identity.

The footer collapses to a 2-column grid on mobile.

---

## SEO Architecture

### Metadata Strategy

Every page has individual metadata defined via Next.js 15's `Metadata` API. The root layout defines global defaults; pages override them.

**Title template:** `{Page Name} | Sybella Systems`  
**Root title:** `Sybella Systems — Africa's Premium Software Company`

**Meta description** (global): Sybella Systems builds world-class software, custom ERP systems, and digital platforms across Africa. Creators of Ogera — the continent's premier student employment platform.

**Target keywords integrated naturally:**
- `cloud solutions for SMEs in Rwanda`
- `custom ERP developers Lagos`
- `premium SaaS development Nairobi`
- `software company Africa`
- `Ogera student jobs Africa`
- `Sybella Systems Kigali`

These appear in page copy, not as keyword-stuffing. They are woven into sentences that read naturally to humans.

### Open Graph & Social Sharing

Every page outputs correct Open Graph tags (`og:title`, `og:description`, `og:image`, `og:url`, `og:type`). When the URL is shared on LinkedIn, WhatsApp, Twitter, or any social platform, it renders a rich card with the 1200×630 `og-image.png`.

Twitter Cards are configured for `summary_large_image` — the largest preview format.

### Structured Data (JSON-LD)

An `Organization` schema block is injected in the root `<head>`:

```json
{
  "@type": "Organization",
  "name": "Sybella Systems",
  "url": "https://sybellasystems.co.rw",
  "address": { "addressLocality": "Rulindo", "addressCountry": "RW" },
  "sameAs": ["linkedin.com/company/sybella-systems", "twitter.com/sybellasystems"]
}
```

This is what Google, Bing, and AI search engines (Perplexity, ChatGPT search, Gemini) use to understand who we are. It means when someone asks "who is Sybella Systems?" to any AI assistant, it has a machine-readable source to pull from.

### Sitemap

`/sitemap.xml` is auto-generated by Next.js via `app/sitemap.ts` on every build. It includes:

| URL | Priority | Update Frequency |
|---|---|---|
| `/` | 1.0 | Weekly |
| `/ogera` | 0.9 | Weekly |
| `/technology` | 0.8 | Monthly |
| `/impact` | 0.8 | Monthly |

### robots.txt

```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/private/
Disallow: /_next/
Sitemap: https://sybellasystems.co.rw/sitemap.xml
```

All public pages are crawlable. Admin and private API routes are blocked. The sitemap URL is declared directly so crawlers don't have to find it.

### AI Search Optimization

This site is built with AI search engines (Perplexity, ChatGPT, Gemini, Claude) in mind, not just traditional Google. Key practices:
- **Semantic HTML** — `<main>`, `<section>`, `<header>`, `<footer>`, `<nav>` used correctly throughout. AI engines parse HTML structure.
- **Clear page intent** — each page has one clear topic. No page tries to be everything.
- **Factual specificity** — Rulindo, Rwanda, 2025 founded, Ogera beta June 14 2026, RWF 10M capital — real facts that AI can index and repeat accurately.
- **JSON-LD Organization schema** — the most direct signal to any AI system about who we are.

---

## PWA Configuration

The site is configured as a Progressive Web App via `public/manifest.json`:

- **Display mode:** `standalone` — opens without browser chrome when installed
- **Theme color:** `#c9a84c` (gold) — appears in Android task switcher and iOS Safari bar
- **Background color:** `#080808` (black) — splash screen background
- **Icon sizes:** 192px and 512px defined (PNG files to be added to `/public/`)

When a user visits on mobile and taps "Add to Home Screen," the site installs as a native-feeling app. The gold theme color makes the app immediately recognizable in their home screen.

---

## Technical Stack & Performance

| Layer | Technology | Why |
|---|---|---|
| Framework | Next.js 16, App Router | Static generation, automatic code splitting, edge-ready |
| Styling | Tailwind CSS v4 | Utility-first, zero unused CSS in production |
| Language | TypeScript | Type safety across all components and page props |
| Animations | CSS + `IntersectionObserver` | Zero JS animation libraries = faster load |
| Fonts | Google Fonts (preconnect) | Preconnect tags in `<head>` eliminate render blocking |
| Icons | Inline SVG | No icon library imports, no extra JS |

**No runtime dependencies for visual effects.** Every animation, gradient, grain texture, and motion effect is CSS-only. The only JS running on page load is React's hydration and the `IntersectionObserver` for scroll reveals. This directly contributes to fast Core Web Vitals — LCP, CLS, and FID/INP targets.

The build output confirms all routes are statically generated (`○ Static`) — they prerender at build time, meaning the first byte of every page arrives instantly from the CDN.

---

## Component Reference

| File | Type | Responsibility |
|---|---|---|
| `app/layout.tsx` | Server | Root HTML shell, all metadata, JSON-LD, font preconnect |
| `app/globals.css` | CSS | Design tokens, utility classes, animation keyframes |
| `components/Nav.tsx` | Client | Global navbar, scroll state, mobile menu |
| `components/Footer.tsx` | Client | Global footer, social links, sitemap nav |
| `components/HomeClient.tsx` | Client | All homepage sections, hero SVG, stats, service cards, Ogera spotlight |
| `app/page.tsx` | Server | Homepage route wrapper |
| `app/ogera/page.tsx` | Client | Ogera product page, beta signup form |
| `app/technology/page.tsx` | Client | Technology page, code block, service verticals |
| `app/impact/page.tsx` | Client | Impact/about page, timeline, contact form |
| `app/sitemap.ts` | Server | Auto-generates `/sitemap.xml` |
| `public/manifest.json` | Static | PWA configuration |
| `public/robots.txt` | Static | Search engine crawl rules |
| `public/favicon.svg` | Static | SVG favicon — S-mark in gold on black |

---

## Deployment

```bash
# Install
npm install

# Development
npm run dev

# Production build
npm run build

# Start production server
npm start
```

**Recommended hosts:** Vercel (zero-config Next.js, ideal), Netlify, or any Node.js 18+ host.

**Environment variables needed for production:**
- None required for the base site
- Add `NEXT_PUBLIC_GA_ID` if connecting Google Analytics
- Add `SMTP_*` variables if replacing mailto with a server-side form handler

---

## What Changed From v1

This is not an update. This is a complete rebuild from scratch. Nothing from the previous iteration was carried forward.

| Dimension | Before | After |
|---|---|---|
| Visual identity | Generic, no clear aesthetic direction | Dark luxury — gold, charcoal, emerald |
| Typography | System fonts, inconsistent hierarchy | Syne + DM Sans, fluid scale, tight tracking |
| Color palette | Default blues and whites | Gold primary, emerald for Ogera, copper warmth |
| Page structure | Single page or minimal pages | 4 full pages with distinct purpose and identity |
| Ogera presence | Mentioned as a feature | Dedicated product page with its own brand identity |
| SEO | Basic meta tags | Full schema, sitemap, robots, OG, Twitter cards, AI-optimized |
| PWA | None | Manifest, theme color, installable on mobile |
| Animation | None or generic | Scroll reveals, shimmer text, orbital SVG, grain texture |
| Mobile | Responsive but not prioritized | Mobile-first, large touch targets, dedicated mobile nav |
| Code quality | Ad hoc | TypeScript, component architecture, static generation |
| Contact/leads | None or basic | Two forms (project inquiry + Ogera beta) routing to `bessora@sybellasystems.co.rw` |

---

## Maintaining the Standard

When adding new pages, sections, or features to this site, apply the following tests:

1. **The silence test:** Does this element need to exist, or does its removal make the page feel cleaner? Prefer removal.
2. **The specificity test:** Does this copy say something specific and true, or is it vague and generic? Rewrite until it's specific.
3. **The consistency test:** Does this use the CSS variables and component classes from `globals.css`? If not, refactor it to.
4. **The mobile test:** Open it on a real phone. Is every tap target comfortable? Does the layout hold? Does the font size feel right?
5. **The brand test:** If a Stripe or Linear engineer saw this page, would it feel like it belongs in the same company of world-class digital products? That is the standard.

---

*Sybella Systems Ltd. · Rulindo, Rwanda · sybellasystems.co.rw*  
*This document is internal. Last updated: April 2026.*