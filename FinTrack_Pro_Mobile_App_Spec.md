# FinTrack Pro Mobile — Distinctive Native Product & Design Specification

> **Design directive:** Build FinTrack Pro Mobile so it looks unmistakably designed by a strong product designer — **not like an AI-generated finance dashboard, not like a template, and not like a mobile wrapper of the existing web app.**

The existing FinTrack Pro product is a privacy-first, zero-backend personal finance application with local financial data, transaction management, budgets, accounts, analytics, AI, OCR, imports, investments, net worth, goals, debt, corporate mode, reports, and encrypted backups. fileciteturn0file0L9-L16

This document keeps that product capability and data philosophy while **redefining the mobile visual language from the ground up**.

---

# 1. PRODUCT DESIGN NORTH STAR

FinTrack Pro Mobile should communicate:

> **Quiet confidence, financial clarity, personal ownership.**

It should feel like a product made for someone who takes their money seriously.

It must NOT feel like:

- a generic AI-generated SaaS dashboard
- a Tailwind template
- a Dribbble clone
- a purple-gradient finance app
- a glassmorphism showcase
- a dashboard packed with cards
- a desktop UI compressed onto a phone

### The visual personality

Use:

- editorial composition
- asymmetric layouts
- strong typographic hierarchy
- intentional whitespace
- tactile surfaces
- restrained color
- distinctive financial visualization
- subtle motion
- unusual but usable information structures

Avoid:

- "everything is a rounded card"
- identical 3-column metric grids
- excessive gradients
- glowing purple buttons
- floating glass cards everywhere
- generic AI sparkle icons
- oversized hero illustrations
- excessive shadows
- decorative blobs
- meaningless animations

---

# 2. DESIGN CONCEPT

## Concept: "Personal Financial Instrument"

Do not design FinTrack as a dashboard.

Design it as a **personal financial instrument**.

Think:

- premium banking terminal
- modern editorial magazine
- personal ledger
- financial cockpit
- physical notebook
- precision instrument

combined into one interface.

The user should feel like they are **reading and controlling their financial system**, rather than browsing a collection of app cards.

---

# 3. VISUAL DIFFERENTIATION

The existing web application uses a dark navy / indigo visual system. fileciteturn0file0L303-L312

For mobile, do NOT simply reproduce that palette.

Instead, create a new mobile identity that remains recognizable as FinTrack.

## Primary palette

Use a warm, sophisticated neutral base.

### Ink

```text
#101310
```

Almost-black green-tinted ink.

### Paper

```text
#F4F1E8
```

Warm off-white.

### Bone

```text
#E7E2D6
```

Secondary warm surface.

### Moss

```text
#526B4F
```

Primary brand color.

### Electric Chartreuse

```text
#C8F169
```

Signature accent.

### Terracotta

```text
#C96F52
```

Expense / warning accent.

### Deep Plum

```text
#59445E
```

Secondary analytical accent.

### Brass

```text
#B89A58
```

Premium / investment accent.

### Cool Slate

```text
#687276
```

Neutral information color.

---

# 4. WHY THIS PALETTE

The color system should deliberately avoid the standard:

```text
navy + purple + cyan + glass
```

combination commonly produced by AI design systems.

Instead:

```text
Warm paper
+
ink
+
moss
+
chartreuse
+
terracotta
+
plum
+
brass
```

creates a visual identity closer to:

- editorial finance
- premium stationery
- investment research
- modern architecture
- physical ledgers

without looking old-fashioned.

---

# 5. COLOR RULE

The signature color is:

> **Electric Chartreuse `#C8F169`**

But it must be used sparingly.

Use it for:

- primary CTA
- important positive movement
- selected state
- key progress
- active navigation indicator
- critical interaction

Do NOT use it as:

- entire card background
- giant gradient
- glowing decoration
- text everywhere

A strong design should often be **90% neutral + 10% signature color**.

---

# 6. LIGHT MODE

Light mode should be the primary visual showcase.

Background:

```text
#F4F1E8
```

Text:

```text
#101310
```

Cards should not all be white.

Use subtle tonal layering:

```text
Paper
Bone
Soft Moss tint
```

Example:

```text
#F4F1E8
#E7E2D6
#DCE4D7
```

This creates depth without shadows.

---

# 7. DARK MODE

Dark mode should not simply invert the light palette.

Use:

```text
#101310
```

as the primary background.

Surfaces:

```text
#171B17
#202720
#293329
```

Accent:

```text
#C8F169
```

Text:

```text
#F4F1E8
```

Secondary text:

```text
#A7ADA5
```

The dark interface should feel like an illuminated instrument in a dark room.

---

# 8. OLED MODE

OLED mode:

```text
#000000
```

with:

```text
#111411
#181D18
```

for surfaces.

Use the signature chartreuse only for meaningful interactions.

---

# 9. TYPOGRAPHY

Do NOT use typography as an afterthought.

Use two complementary typefaces.

## Primary UI

Use:

> **Inter**

for:

- navigation
- labels
- forms
- buttons
- metadata

## Editorial / financial display

Use a distinctive serif such as:

> **DM Serif Display**

or another high-quality serif with an appropriate license.

Use serif typography for:

- balance numbers
- major financial headlines
- section titles
- insight headlines

This creates a deliberate contrast:

```text
Precision UI
+
Editorial finance
```

Example:

```text
YOUR MONTH

₹1,24,500
```

The number should feel like a financial statement, not a dashboard metric.

---

# 10. NUMBER TYPOGRAPHY

Financial numbers are the hero of the application.

Use:

- large display numbers
- tabular numerals
- consistent decimal alignment
- generous tracking where appropriate

Do not put financial numbers inside tiny statistic cards.

Instead:

```text
TOTAL BALANCE

₹1,24,500
```

with the number occupying visual priority.

---

# 11. LAYOUT PHILOSOPHY

Stop thinking:

```text
Card
Card
Card
Card
```

Think:

```text
Editorial composition
```

A screen may contain:

```text
Large financial statement
       ↓
Small contextual metadata
       ↓
One dominant visualization
       ↓
Dense but elegant transaction list
```

Use hierarchy instead of card quantity.

---

# 12. MOBILE DASHBOARD — NEW STRUCTURE

The dashboard should NOT copy the web dashboard.

Use this structure:

```text
┌─────────────────────────────┐
│  MONDAY · 16 AUGUST         │
│                             │
│  Good morning, MasterZ      │
│                             │
│  ₹1,24,500                  │
│  total balance              │
│                             │
│  +8.4% this month           │
├─────────────────────────────┤
│                             │
│  MONEY FLOW                 │
│                             │
│  IN      ₹65,000            │
│  OUT     ₹32,400            │
│                             │
│  ─────────────╮             │
│               ╰────         │
│                             │
├─────────────────────────────┤
│                             │
│  THIS MONTH                 │
│                             │
│  Food          ₹8,240       │
│  Transport     ₹4,120       │
│  Shopping      ₹3,890       │
│                             │
├─────────────────────────────┤
│                             │
│  RECENT                    │
│                             │
│  Swiggy            -₹450    │
│  HDFC              -₹900    │
│  Salary         +₹65,000    │
│                             │
└─────────────────────────────┘
```

This is intentionally more editorial and less dashboard-like.

---

# 13. DASHBOARD HERO

The hero area should contain:

```text
MONDAY · 16 AUGUST

Good morning

₹1,24,500
```

Under it:

```text
↑ 8.4%
from last month
```

No card around the balance.

Let the background breathe.

This is a major design distinction.

---

# 14. MONEY FLOW VISUALIZATION

Instead of a generic line chart immediately below the balance, create a distinctive **money flow ribbon**.

Conceptually:

```text
Income
████████████████████████

Expenses
███████████

Saved
█████████████
```

But render it as an elegant flowing visualization with:

- curved segments
- proportional width
- minimal labels
- touch interaction

Tap a segment:

```text
Income
₹65,000

Expenses
₹32,400

Saved
₹32,600
```

This becomes a signature FinTrack visualization.

---

# 15. FINANCIAL HEALTH

Do NOT use the standard:

```text
circular 82/100 gauge
```

That looks generic.

Instead create a **Financial Pulse**.

Example:

```text
FINANCIAL PULSE

██████████████████░░

82 · STEADY

Savings are healthy.
Spending is slightly elevated
on weekends.
```

Use a horizontal visual with subtle rhythm.

The original product has a 0–100 financial health concept; preserve the underlying metric but redesign its presentation. fileciteturn0file0L130-L135

---

# 16. TRANSACTION DESIGN

Transactions should look like a **modern ledger**.

Not:

```text
[icon] Swiggy
      Food
      -₹450
```

Instead:

```text
16 AUG

Swiggy                         -₹450
Food · HDFC                    10:32

Amazon                       -₹1,299
Shopping · SBI                 09:12

Salary                      +₹65,000
Income · HDFC                 08:01
```

Use typography and spacing instead of cards.

---

# 17. TRANSACTION COLOR SYSTEM

Do not make entire rows red/green.

Use only the amount:

```text
+₹65,000
```

or:

```text
−₹450
```

Income:

```text
Moss / Chartreuse
```

Expense:

```text
Terracotta
```

Transfer:

```text
Deep Plum
```

This keeps the interface calm.

---

# 18. TRANSACTION ICONS

Do not use generic colorful circular icon backgrounds.

Use:

- small monochrome line icons
- category glyphs
- subtle custom symbols

For example:

```text
◌ Food
◇ Transport
△ Shopping
□ Bills
```

Optionally develop a proprietary FinTrack category icon set.

---

# 19. CATEGORY VISUAL LANGUAGE

Categories should have identities.

Example:

```text
FOOD
Moss

TRANSPORT
Slate

SHOPPING
Terracotta

BILLS
Plum

INVESTMENTS
Brass
```

Do not use random colors per category.

Use a controlled semantic palette.

---

# 20. ADD TRANSACTION — SIGNATURE UX

The Add Transaction screen should be one of the most beautiful screens.

Open it as a bottom sheet.

At the top:

```text
ADD TRANSACTION
```

Then:

```text
₹ 450
```

large and centered.

Below:

```text
What was this for?

[ Lunch ]
```

Then horizontal selectors:

```text
Food    HDFC    Today
```

The user should be able to create a transaction with as few taps as possible.

---

# 21. TRANSACTION TYPE SELECTOR

Use a segmented editorial selector:

```text
EXPENSE     INCOME     TRANSFER
────────
```

Active selection uses a thin chartreuse line.

Avoid pill-shaped controls everywhere.

---

# 22. BOTTOM SHEETS

Use bottom sheets heavily for:

- category selection
- account selection
- date
- filters
- transaction actions
- AI confirmations

Bottom sheets should feel native.

---

# 23. BUDGETS — NEW VISUALIZATION

Do not use generic circular progress rings.

Use **budget tracks**.

Example:

```text
FOOD

₹8,240 / ₹10,000

━━━━━━━━━━━━━━━━━━
███████████████░░░

₹1,760 left
```

Different categories can use slightly different visual rhythms.

Example:

```text
Food       ███████████░
Transport  ███████░░░░░
Shopping   ██████████████
```

---

# 24. ANALYTICS — EDITORIAL STYLE

Analytics should resemble a premium financial research screen.

Top:

```text
SPENDING REVIEW

AUGUST 2026
```

Then:

```text
₹32,400
total spending
```

Then the dominant chart.

Use large whitespace.

Do not put three charts inside three cards.

---

# 25. CHART DESIGN

Avoid:

- rainbow charts
- neon gradients
- excessive grid lines
- huge legends

Use:

- thin lines
- restrained axes
- direct labels
- muted secondary data
- one strong highlight

The user should understand the chart without reading a legend.

---

# 26. CATEGORY BREAKDOWN

Instead of a generic donut chart, use a **radial sunburst / segmented wheel** only if it remains readable.

Otherwise use:

```text
FOOD       25%  █████████
TRANSPORT  13%  █████
SHOPPING   12%  ████
BILLS      10%  ███
OTHER      40%  █████████████
```

Direct labels are preferred over legends.

---

# 27. INVESTMENTS

Investment screens should feel different from spending screens.

Use the **Brass** accent.

Example:

```text
PORTFOLIO

₹8,42,500

+₹42,800
+5.36%

──────────────

EQUITY        52%
MUTUAL FUNDS  28%
GOLD          12%
CASH           8%
```

Use subtle financial-research styling.

---

# 28. NET WORTH

Net worth should be presented as a long-term story.

Top:

```text
NET WORTH

₹18,45,000

↑ ₹1,20,000
this year
```

Then:

```text
12 MONTH JOURNEY
```

A thin elegant growth line.

Below:

```text
ASSETS          LIABILITIES
₹24.2L          ₹5.8L
```

No card grid.

---

# 29. GOALS

Goals should feel personal.

Example:

```text
EMERGENCY FUND

₹40,000
of ₹1,00,000

40%

████████░░░░░░░░░

Target
30 December 2026
```

Use a visual "journey" rather than a standard progress card.

---

# 30. DEBT

Debt screens should feel precise and calm.

Example:

```text
PERSONAL LOAN

₹2,84,000 remaining

EMI
₹12,450 / month

11.5%
interest
```

Then:

```text
PAYOFF JOURNEY

2026 ─────────────── 2029
       ●────────●
```

The user should understand how far they are from freedom.

---

# 31. AI ASSISTANT — DO NOT USE GENERIC AI UI

This is extremely important.

Do NOT create:

```text
✨ Ask FinBot anything...
```

Do not use:

- sparkle icons
- purple AI gradients
- robot avatars
- generic chat bubbles
- "magic" UI

That immediately makes the app look AI-generated.

---

# 32. FINBOT CONCEPT

FinBot should feel like a **financial analyst**, not a chatbot.

Screen title:

```text
FINANCIAL DESK
```

Subtitle:

```text
Your numbers, interpreted.
```

User can ask:

```text
Where did my money go this month?
```

Response:

```text
YOUR AUGUST REVIEW

You spent ₹32,400 this month.

Food is your largest category
at ₹8,240.

Weekend spending is 31% higher
than weekday spending.

You're currently on track to save
₹18,600 this month.
```

This feels much more premium.

---

# 33. AI INPUT

Instead of a standard chat input:

```text
Ask anything...
```

Use:

```text
What would you like to understand?

────────────────────────

[Speak]                         [→]
```

Add contextual suggestions:

```text
Where am I overspending?

Can I afford ₹20,000?

Compare July and August

What changed this month?
```

---

# 34. OCR EXPERIENCE

Receipt scanning should feel like a camera utility.

Screen:

```text
SCAN RECEIPT

Align receipt inside frame
```

After capture:

```text
Reading receipt...

Swiggy
₹450
16 Aug 2026
```

Then:

```text
[Use details]
```

Never make OCR feel like a generic AI feature.

---

# 35. STATEMENT IMPORT

Design the import flow like a **data intake pipeline**.

```text
IMPORT STATEMENT

01  SELECT
02  READ
03  REVIEW
04  IMPORT
```

Each stage should have a clear progress indicator.

At review:

```text
145 transactions found

123 new
22 duplicates
```

Then:

```text
[Review & Import]
```

---

# 36. ONBOARDING VISUAL STYLE

Do not use:

- giant illustrations
- floating 3D objects
- gradient blobs
- generic finance illustrations

Use typography and subtle motion.

Example:

```text
YOUR MONEY.

YOUR DEVICE.

YOUR RULES.
```

Then:

```text
No account required.
No financial data uploaded.
```

This establishes the privacy philosophy immediately.

The existing product's core architecture is explicitly local-first and zero-backend. fileciteturn0file0L9-L16

---

# 37. ONBOARDING ANIMATION

Use a restrained sequence:

```text
YOUR MONEY.
```

fade

```text
YOUR DEVICE.
```

fade

```text
YOUR RULES.
```

Then:

```text
GET STARTED →
```

No particle effects.

---

# 38. NAVIGATION

Use a **floating bottom navigation rail**, but keep it visually restrained.

Primary destinations:

```text
HOME
MONEY
PLAN
ANALYZE
MORE
```

Do not call everything "Dashboard".

### Home

Overall financial state.

### Money

Transactions + accounts.

### Plan

Budgets + goals + debt.

### Analyze

Analytics + investments + net worth.

### More

AI + reports + corporate + settings.

This is more coherent than exposing 15 modules as separate navigation items.

---

# 39. MORE SCREEN

Organize features by purpose.

```text
MORE

FINANCIAL TOOLS

Investments
Net Worth
Debt

WORKSPACE

Corporate
Reports

INTELLIGENCE

Financial Desk

DATA

Backup
Import
Export

SETTINGS

Appearance
Security
Preferences
```

Use typography and dividers rather than card grids.

---

# 40. DESIGN LANGUAGE FOR CONTROLS

Do not make every control pill-shaped.

Use:

### Buttons

Rectangular with modest radius.

### Tabs

Text + underline.

### Filters

Small bordered chips only when necessary.

### Inputs

Editorial underlined or lightly bordered fields.

### Cards

Only for genuinely grouped information.

This is critical to avoiding the AI-generated UI look.

---

# 41. BORDER RADIUS

Use a varied radius system.

```text
Small controls: 6px
Cards: 12px
Bottom sheets: 24px top corners
Primary surfaces: 16px
Buttons: 8px
```

Avoid 20px–24px rounded rectangles everywhere.

---

# 42. SHADOWS

Use very little shadow.

Prefer:

- tonal contrast
- borders
- spacing
- background changes

The visual depth should come primarily from composition.

---

# 43. TEXTURE

Optional extremely subtle texture may be used in light mode.

Example:

```text
Paper grain
```

Opacity must be extremely low.

Never make it visually noisy.

---

# 44. ICONOGRAPHY

Use Lucide or another consistent icon library as a foundation, but do not simply place an icon inside every card.

Icons should communicate actions.

For navigation, consider a custom FinTrack glyph system.

---

# 45. CUSTOM FINTRACK MOTIF

Create a subtle visual motif based on:

> **ledger lines**

Use thin horizontal lines in:

- section dividers
- charts
- transaction groups
- onboarding
- empty states

This becomes a recognizable FinTrack design element.

---

# 46. EMPTY STATES

Do not use generic:

```text
No data found
```

Instead:

```text
YOUR LEDGER IS QUIET.

Add your first transaction
to start seeing your financial picture.

[ADD TRANSACTION]
```

This reinforces brand voice.

---

# 47. ERROR STATES

Use calm language.

Instead of:

```text
Something went wrong!!!
```

Use:

```text
WE COULDN'T COMPLETE THAT.

Your financial data was not changed.

[Try again]
```

---

# 48. MICROCOPY

Avoid generic SaaS language.

Bad:

```text
Get Started
Manage your finances
AI-powered insights
```

Better:

```text
Take control
Read your money
Understand this month
Review your spending
```

---

# 49. MOTION LANGUAGE

Animation should feel like:

> paper, numbers and instruments moving into place.

Not:

> startup landing page animation.

Use:

- 150–250ms transitions
- subtle spring
- opacity
- vertical movement
- number interpolation
- chart drawing

Avoid:

- bouncing cards
- particle systems
- exaggerated scale
- infinite animations

---

# 50. ACCESSIBILITY

Distinctive design must never reduce usability.

Maintain:

- WCAG-conscious contrast
- 44–48dp touch targets
- readable text
- screen reader labels
- reduced motion
- accessible chart descriptions
- dynamic font support where practical

---

# 51. TECHNOLOGY STACK

Use:

- React Native
- Expo
- TypeScript
- Expo Router
- Expo SQLite
- Expo SecureStore
- Expo FileSystem
- Expo DocumentPicker
- Expo ImagePicker
- Expo Camera
- Expo Sharing
- React Native SVG
- Reanimated
- Gesture Handler
- Safe Area Context
- Zod
- date-fns
- maintained React Native chart library

Use current stable versions compatible with the selected Expo SDK.

---

# 52. REPOSITORY ARCHITECTURE

Use a monorepo.

```text
fintrack-pro/
│
├── apps/
│   ├── web/
│   └── mobile/
│
├── packages/
│   └── domain/
│       ├── models/
│       ├── calculations/
│       ├── validators/
│       ├── formatters/
│       ├── categorization/
│       └── backup/
│
├── docs/
│
├── package.json
└── README.md
```

Do NOT maintain separate permanent `web` and `mobile` branches.

---

# 53. SHARED DOMAIN

The web application currently uses IndexedDB with logical stores for profiles, transactions, accounts, investments, budgets, categories, bank profiles, AI cache, exchange rates and settings. fileciteturn0file0L98-L109

The mobile application should map these concepts to SQLite.

```text
Web
IndexedDB
   │
   ├── shared domain
   │
Mobile
SQLite
```

The UI is platform-specific.

The business rules should be shared where practical.

---

# 54. DATABASE

Mobile tables:

```text
profiles
transactions
accounts
investments
budgets
categories
bank_profiles
ai_cache
exchange_rates
settings
```

Use repositories.

Never access SQLite directly from screen components.

---

# 55. TRANSACTION MODEL

Preserve the existing transaction capabilities:

```text
id
profileId
date
description
amount
currency
convertedAmount
category
subcategory
type
accountId
toAccountId
tags
notes
receiptUri
isRecurring
recurringRule
paymentMethod
merchant
importedFrom
isSplit
splitParts
isBillable
gstRate
gstAmount
```

The existing specification defines these transaction fields and recurring transaction behavior. fileciteturn0file0L437-L442

---

# 56. CORE FEATURES

The mobile app must eventually support:

1. Onboarding
2. Dashboard
3. Transactions
4. Accounts
5. Transfers
6. Budgets
7. Analytics
8. Statement import
9. OCR
10. AI / Financial Desk
11. Investments
12. Net Worth
13. Goals
14. Debt
15. Corporate mode
16. Reports
17. Backup / Restore
18. Security
19. Themes

---

# 57. AI ARCHITECTURE

Use an abstraction:

```text
AI Engine
├── Rules
├── Local AI
├── OpenAI
├── Gemini
├── Groq
├── Anthropic
└── Ollama
```

The original product already specifies a unified AI engine with local and configurable external providers. fileciteturn0file0L403-L407

Do not initialize AI on application startup.

---

# 58. OCR ARCHITECTURE

Use native/on-device OCR where practical.

Pipeline:

```text
Camera
↓
Image preprocessing
↓
OCR
↓
Text extraction
↓
Merchant / amount / date parser
↓
Transaction draft
↓
User confirmation
```

The original product uses receipt OCR and extracts amount/date information. fileciteturn0file0L409-L412

---

# 59. IMPORT ARCHITECTURE

Support:

```text
CSV
PDF
OFX
QFX
```

Use:

```text
File
↓
Format detector
↓
Parser
↓
Bank profile
↓
Normalization
↓
Categorization
↓
Deduplication
↓
Review
↓
Commit
```

The existing system uses this general parsing and deduplication pipeline. fileciteturn0file0L414-L419

---

# 60. BACKUP

Use versioned JSON.

```json
{
  "format": "fintrack-backup",
  "version": 1,
  "createdAt": "...",
  "appVersion": "...",
  "profile": {},
  "accounts": [],
  "transactions": [],
  "budgets": [],
  "categories": [],
  "investments": [],
  "settings": {}
}
```

Support:

- JSON export
- encrypted export
- import
- restore
- validation
- migration

The existing product supports unencrypted and AES-256-GCM encrypted backups. fileciteturn0file0L178-L181

---

# 61. SECURITY

Use:

- SQLite for structured data
- SecureStore for secrets
- platform biometrics
- encrypted backups
- no unnecessary analytics
- no ad SDK
- no hidden data collection

Never invent cryptography.

Use established libraries.

The existing product uses AES-256-GCM with PBKDF2 for encrypted backups. fileciteturn0file0L366-L372

---

# 62. OFFLINE FIRST

Everything fundamental must work offline.

Offline:

- dashboard
- transactions
- accounts
- budgets
- analytics
- investments
- goals
- debt
- net worth
- local categorization
- backup
- restore

Online-only or enhanced:

- external AI
- live FX
- optional market prices

The original product is designed around local-first financial data and offline-capable behavior. fileciteturn0file0L9-L16

---

# 63. PERFORMANCE

Target:

- fast startup
- smooth navigation
- virtualized transaction lists
- indexed SQLite queries
- lazy AI
- lazy OCR
- lazy reports
- no unnecessary re-renders

Support 50,000+ transactions without rendering them all simultaneously.

---

# 64. DESIGN IMPLEMENTATION STRUCTURE

```text
apps/mobile/
│
├── app/
│
├── src/
│   ├── components/
│   ├── features/
│   │   ├── dashboard/
│   │   ├── transactions/
│   │   ├── budgets/
│   │   ├── analytics/
│   │   ├── accounts/
│   │   ├── investments/
│   │   ├── networth/
│   │   ├── goals/
│   │   ├── debt/
│   │   ├── ai/
│   │   ├── import/
│   │   ├── reports/
│   │   └── settings/
│   │
│   ├── database/
│   ├── services/
│   ├── theme/
│   ├── hooks/
│   ├── utils/
│   └── types/
│
└── assets/
```

---

# 65. DESIGN TOKENS

Create:

```text
theme/
├── colors.ts
├── typography.ts
├── spacing.ts
├── radii.ts
├── shadows.ts
├── motion.ts
└── theme.ts
```

All UI must consume these tokens.

No random colors.

No random font sizes.

No component-specific visual hacks unless justified.

---

# 66. DESIGN REVIEW CHECKLIST

Before accepting any screen, ask:

### Does it look like an AI-generated app?

If yes:

- remove cards
- remove gradients
- remove unnecessary icons
- reduce colors
- improve typography
- increase whitespace
- simplify hierarchy

### Does every section need a container?

No.

### Does every button need rounded pill styling?

No.

### Is the screen trying to show too much?

If yes, remove secondary information.

### Is color communicating meaning?

If not, remove it.

### Is the design distinctive without becoming confusing?

If no, refine.

---

# 67. ANTI-AI DESIGN RULES

These are hard constraints.

DO NOT use:

```text
❌ Purple gradient hero
❌ Neon blue/purple AI glow
❌ Generic glassmorphism
❌ 3D finance illustrations
❌ Floating gradient blobs
❌ Sparkle AI icons
❌ Every section inside a card
❌ Three KPI cards across the screen
❌ Excessive rounded pills
❌ Rainbow charts
❌ Generic robot assistant
❌ "AI-powered" labels everywhere
❌ Stock dashboard template aesthetics
```

Instead:

```text
✓ Editorial typography
✓ Warm neutrals
✓ Moss + chartreuse signature color
✓ Direct labels
✓ Asymmetric hierarchy
✓ Strong whitespace
✓ Ledger-inspired lines
✓ Native interactions
✓ Quiet motion
✓ Distinctive financial visualizations
```

---

# 68. FIRST IMPLEMENTATION MILESTONE

Do NOT build every feature immediately.

Build this vertical slice:

```text
Launch
↓
Onboarding
↓
Create Profile
↓
Home
↓
Add Transaction
↓
Transaction appears in ledger
↓
Balance updates
↓
Financial pulse updates
↓
Close app
↓
Reopen
↓
Everything remains
```

The first milestone is successful only when the product already looks visually distinctive.

---

# 69. PHASED DEVELOPMENT

## Phase 1 — Foundation

- Expo
- TypeScript
- navigation
- theme
- database
- repositories
- domain models

## Phase 2 — Brand / UI

- typography
- color system
- dashboard composition
- navigation
- motion
- reusable components

## Phase 3 — Core Finance

- onboarding
- transactions
- accounts
- transfers

## Phase 4 — Planning

- budgets
- goals
- debt

## Phase 5 — Intelligence

- analytics
- financial pulse
- Financial Desk
- categorization

## Phase 6 — Data Intake

- CSV
- PDF
- OFX
- QFX
- OCR

## Phase 7 — Wealth

- investments
- net worth

## Phase 8 — Business

- corporate
- reimbursements
- reports

## Phase 9 — Security

- backup
- encrypted backup
- restore
- biometrics
- factory reset

## Phase 10 — Polish

- performance
- accessibility
- animation
- testing
- Android release

---

# 70. AI CODING AGENT MASTER PROMPT

Use this as the initial instruction to the coding agent:

```text
You are the lead product engineer and senior mobile product designer for FinTrack Pro Mobile.

Read MOBILE_APP_SPEC.md completely before changing the repository.

Your job is NOT merely to reproduce the existing web UI.

Build a genuinely native mobile application with a distinctive product identity.

The most important visual requirement is:

THE APP MUST NOT LOOK AI-GENERATED.

Do not use generic AI SaaS design patterns.

Do not use:
- purple gradients
- generic glassmorphism
- excessive rounded cards
- floating gradient blobs
- AI sparkle icons
- robot avatars
- generic dashboard KPI grids
- rainbow charts
- template-like layouts

The design language must use:
- warm paper-like neutrals
- deep ink
- moss
- electric chartreuse
- terracotta
- plum
- brass
- editorial typography
- strong whitespace
- asymmetric hierarchy
- ledger-inspired dividers
- direct chart labeling
- restrained motion

The product should feel like a premium personal financial instrument.

Before implementing UI:
1. Inspect the existing web application.
2. Identify reusable domain/business logic.
3. Identify existing data models.
4. Identify current repository structure.
5. Do not overwrite working web code.
6. Determine whether a monorepo already exists.

Preferred architecture:

apps/web
apps/mobile
packages/domain

If the repository already has another sensible architecture, adapt rather than blindly restructuring.

FIRST TASK ONLY:

Build:
1. mobile Expo foundation
2. TypeScript
3. Expo Router
4. SQLite
5. database migrations
6. shared domain model interfaces
7. theme tokens
8. navigation
9. onboarding
10. distinctive Home screen
11. Add Transaction flow
12. transaction persistence
13. balance calculation

The first milestone must demonstrate:

Create Profile
→ Home
→ Add ₹500 Food Expense
→ Home updates
→ Close App
→ Reopen App
→ Data persists

The Home screen must already demonstrate the new FinTrack design language.

Do not implement AI, OCR, reports or advanced import functionality yet.

Do not create hundreds of placeholder files.

Implement a small amount correctly.

Run the app.

Check TypeScript.

Check runtime errors.

Fix problems before moving forward.

At the end, report:
- files created
- files modified
- commands executed
- build status
- tests
- known issues
- recommended next step

Then stop.

Do not continue into the next feature phase without confirmation.
```

---

# 71. GIT STRATEGY

Use a monorepo.

Permanent structure:

```text
main
│
├── apps/web
├── apps/mobile
└── packages/domain
```

Development branches:

```text
feature/mobile-foundation
feature/mobile-brand-system
feature/mobile-dashboard
feature/mobile-transactions
feature/mobile-accounts
feature/mobile-budgets
feature/mobile-analytics
feature/mobile-import
feature/mobile-ai
feature/mobile-security
```

Do not create permanent:

```text
web-branch
mobile-branch
```

---

# 72. FINAL QUALITY BAR

Before calling the app "finished", ask:

> Could a designer look at this and immediately say this came from a generic AI UI generator?

If yes:

**Reject the screen and redesign it.**

The finished application should instead feel like:

> **A carefully art-directed financial instrument with its own visual language.**

It should have recognizable FinTrack signatures:

```text
Warm paper
+
Ink
+
Moss
+
Electric chartreuse
+
Editorial numbers
+
Ledger lines
+
Asymmetric layouts
+
Quiet motion
+
Native mobile interactions
```

---

# 73. FINAL PRODUCT STATEMENT

FinTrack Pro Mobile is not:

> "A finance dashboard with AI."

It is:

> **A personal financial instrument that helps you read, understand and control your money.**

The interface should make the user's money feel tangible.

Every design decision should answer:

> **Does this make the user's financial picture clearer?**

If not, remove it.

---

# 74. DEFINITION OF DONE

- [ ] Native Android application
- [ ] Distinctive FinTrack visual identity
- [ ] Light mode
- [ ] Dark mode
- [ ] OLED mode
- [ ] Onboarding
- [ ] Dashboard
- [ ] Transactions
- [ ] Accounts
- [ ] Transfers
- [ ] Budgets
- [ ] Analytics
- [ ] Investments
- [ ] Net Worth
- [ ] Goals
- [ ] Debt
- [Corporate mode
- [ ] Financial Desk
- [ ] OCR
- [ ] CSV/PDF/OFX/QFX import
- [ ] Deduplication
- [ ] Reports
- [ ] JSON backup
- [ ] Encrypted backup
- [ ] Restore
- [ ] Biometrics
- [ ] Offline-first operation
- [ ] Accessibility
- [ ] Performance testing
- [ ] Large dataset testing
- [ ] No critical runtime errors
- [ ] No secrets in repository
- [ ] Production Android build succeeds

---

# 75. THE ONE RULE THAT OVERRIDES EVERYTHING

**Do not add visual elements simply because modern apps have them.**

No:

```text
"Maybe a gradient?"
"Maybe another card?"
"Maybe an AI sparkle?"
"Maybe a floating widget?"
"Maybe a glass effect?"
```

Instead:

```text
What information matters?
What hierarchy does it need?
What is the simplest beautiful way to show it?
```

That is the design philosophy for FinTrack Pro Mobile.
