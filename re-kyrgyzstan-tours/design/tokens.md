# Design tokens

Theme(s) studied: Light Alpine & Nomadic Trust Theme (inspired by `bolshayastrana.com` clean mountain editorial cards + `viator.com` high-trust emerald badges). Window: 1440x900.

## Color

| Token | Light | Dark | Variable | Used for | Evidence |
|---|---|---|---|---|---|
| Primary Action (Alpine Teal / Emerald) | `#0D9488` | `#14B8A6` | `--color-primary` | Primary CTAs ("Select Date", "Pay Deposit"), Guaranteed Departure & Direct-Price badges | [doc SRC-001] |
| Primary Hover | `#0F766E` | `#0D9488` | `--color-primary-hover` | Button hover states | [doc SRC-005] |
| Warm Kyrgyz Sun / Urgency Accent | `#D97706` | `#F59E0B` | `--color-accent-warm` | Star ratings (`★ 4.9`), "Only 3 spots left" urgency pill | [doc SRC-001] |
| Verified Shield Green | `#059669` | `#10B981` | `--color-verified` | "✓ Verified Organizer" and "✓ Verified Tourist Review" badges | [doc SRC-006] |
| Surface Background | `#F8FAFC` | `#0F172A` | `--bg-canvas` | Page background behind white tour cards | [doc SRC-001] |
| Card Surface | `#FFFFFF` | `#1E293B` | `--bg-surface` | Tour cards, sticky booking widget, operator KPI cards | [doc SRC-001] |
| Text Primary | `#0F172A` | `#F8FAFC` | `--text-primary` | Headings, prices, organizer names | [doc SRC-001] |
| Text Muted | `#475569` | `#94A3B8` | `--text-muted` | Secondary metadata, deposit sublabels | [doc SRC-001] |
| Border Subtle | `#E2E8F0` | `#334155` | `--border-subtle` | Card borders, departure table dividers | [doc SRC-001] |

## Typography

| Token | Family | Size | Weight | Line height | Used for | Evidence |
|---|---|---|---|---|---|---|
| Hero Display | `Inter` / `Plus Jakarta Sans` | `40px` (`2.5rem`) | `800` | `1.15` | Home hero & Tour Detail title | [doc SRC-001] |
| Section Heading (`H2`) | `Inter` / `Plus Jakarta Sans` | `24px` (`1.5rem`) | `700` | `1.3` | Itinerary, Departure Matrix, Verified Reviews headers | [doc SRC-001] |
| Card Title (`H3`) | `Inter` | `18px` (`1.125rem`) | `600` | `1.4` | Tour card titles | [doc SRC-001] |
| KPI Metric Number | `JetBrains Mono` / `Inter` | `32px` (`2rem`) | `700` | `1.1` | Operator Portal "Tours Sold" & "People Signed Up" counters | [doc SRC-006] |
| Body Copy | `Inter` | `15px` (`0.9375rem`) | `400` | `1.6` | Day-by-day itinerary prose & tourist reviews | [doc SRC-001] |
| Badge / Microcopy | `Inter` | `12px` (`0.75rem`) | `600` | `1.2` | "0% Markup", "Guaranteed", "Verified Tourist" pills | [doc SRC-005] |

## Spacing, radius, shadow

| Token | Value | Variable | Used for | Evidence |
|---|---|---|---|---|
| Card Radius | `16px` | `--radius-lg` | Tour cards, Organizer profile card, Sticky booking box | [doc SRC-001] |
| Pill Radius | `9999px` | `--radius-full` | Filter chips, Guaranteed & Verified badges | [doc SRC-001] |
| Card Shadow | `0 4px 20px -2px rgba(15, 23, 42, 0.06)` | `--shadow-card` | Elevated tour cards and sticky booking sidebar | [doc SRC-001] |

## Motion

| Token | Duration | Easing | Used for | Evidence |
|---|---|---|---|---|
| Card Hover | `200ms` | `cubic-bezier(0.16, 1, 0.3, 1)` | Image zoom & shadow lift on tour cards | [doc SRC-005] |
| Accordion Expand | `250ms` | `ease-out` | Day-by-day itinerary toggle | [doc SRC-001] |

## Z-index layers

| Layer | Value | Used for | Evidence |
|---|---|---|---|
| Sticky Booking Card | `20` | Right sidebar on `S-003` | [doc SRC-001] |
| Sticky Header | `40` | Top navigation bar | [doc SRC-001] |
| Checkout / Filter Modal | `100` | Mobile filter drawer & Booking modal (`S-005`) | [doc SRC-005] |

## Icons

| Name | Size | Where used | Evidence |
|---|---|---|---|
| `shield-check` | `16px` | Verified Organizer & Direct-Price Guarantee badges | [doc SRC-001] |
| `mountain` / `gauge` | `16px` | Difficulty Level (1–5) indicator | [doc SRC-001] |
| `tent` / `home` | `16px` | Comfort Level (Yurt / Guesthouse / Hotel) indicator | [doc SRC-001] |
| `users` | `18px` | Group size & Operator "People Signed Up" KPI | [doc SRC-006] |

## Breakpoints and layout

| Width | Change | Evidence |
|---|---|---|
| `< 768px` (Mobile) | Single-column feed; sticky bottom booking bar on `S-003`; bottom sheet filters on `S-002` | [doc SRC-005] |
| `768px–1024px` (Tablet) | 2-column tour grid; collapsible sidebar | [doc SRC-001] |
| `>= 1280px` (Desktop) | `1280px` max container; 280px filter sidebar + 3-column tour grid on `S-002`; 65%/35% split on `S-003` | [doc SRC-001] |
