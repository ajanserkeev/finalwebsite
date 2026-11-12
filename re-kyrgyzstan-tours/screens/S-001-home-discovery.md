# S-001 Home & Kyrgyzstan Destination Discovery
Features: F-001, F-003, F-004 · URL: `/` · Status: done

## Purpose
Landing page that communicates the aggregator's core value proposition (**"All Kyrgyzstan Tours Directly from Verified Local Organizers — 0% Markup, Same Price as Direct"**) and funnels tourists into filtered discovery by region, travel dates, and activity style.

## Entry points
- Direct URL (`/`)
- Header brand logo from any screen

## Anatomy

| # | Region | Contents | Component | Evidence |
|---|---|---|---|---|
| 1 | Top Utility & Header Bar | Language selector (EN/RU), Currency selector (USD/KGS/EUR/RUB), "For Organizers" partner portal link, Favorites, Login | Header Bar | [doc SRC-001] |
| 2 | Hero Search Banner | Headline ("Book Kyrgyzstan Tours Directly from Local Organizers — No Markups"), 4-field search bar (Destination/Region, Dates/Month, Activity Type, Duration), Trust badges ("100% Direct Organizer Price", "Verified Tourist Reviews", "Secure Deposit") | C-001 | [doc SRC-001] |
| 3 | Kyrgyzstan Region Grid | Visual cards with tour counts & starting prices: Issyk-Kul, Song-Kul, Kel-Suu, Karakol & Altyn-Arashan, Ala-Archa & Bishkek Day Trips, Sary-Chelek, Osh & Pamir | Region Grid | [doc SRC-002] |
| 4 | Activity & Style Tabs | Quick filter pills: Multi-Day Jeep 4WD Tours, Horseback Expeditions, High-Mountain Trekking, Yurt & Nomadic Culture, One-Day Excursions, Winter Ski/Freeride | Filter Bar | [doc SRC-002] |
| 5 | Featured Tours Carousel | Top-rated tours with open Organizer avatar/name, verified review score, next departure date, remaining seats, total price & deposit amount | C-002 | [doc SRC-001] |
| 6 | "How Direct-Price Booking Works" Strip | 4-step visual explainer: 1) Compare verified local organizers -> 2) Lock your spot with a 15–20% online deposit -> 3) Connect directly with the organizer -> 4) Pay remaining balance on arrival | Trust Banner | [doc SRC-004] |
| 7 | Featured Verified Organizers | Carousel of top local Kyrgyz tour operators & mountain guide teams with review counts, years active, and "View All X Tours" link | C-003 | [doc SRC-001] |

## Data shown

| Element | Entity.field | Evidence |
|---|---|---|
| Region card tour count | `Tour.region` aggregated count | [doc SRC-002] |
| Tour card price & deposit | `TourDeparture.price`, `Tour.depositPercent` | [doc SRC-004] |
| Organizer badge | `Organizer.brandName`, `Organizer.ratingAvg`, `Organizer.isVerified` | [doc SRC-001] |

## States

| State | How to reach it | What it shows | Evidence |
|---|---|---|---|
| Empty | Region with 0 active departures | Hides empty region pill or shows "Season opens in May — Subscribe for alerts" | [doc SRC-001] |
| Loading | Initial page load | Skeleton cards for region grid and featured tour cards | [doc SRC-005] |
| Typical | Normal public visit | 6–8 destination regions, 8 featured tours, 6 top organizers, recent verified reviews | [doc SRC-001] |
| Many items | 200+ active tours across 40 organizers | Paginated "Explore All X Tours in Kyrgyzstan" CTA leading to `S-002` | [doc SRC-001] |
| Long text | Organizer or tour title > 60 chars | 2-line CSS clamp (`line-clamp-2`) on tour card title | [doc SRC-005] |
| Error | API fetch failure | Inline retry banner keeping static destination links accessible | [doc SRC-005] |
| No permission | N/A (public screen) | Publicly accessible | [doc SRC-001] |
| Plan-gated | Sponsored/Boosted placement | "Featured" subtle badge if organizer uses optional promoted placement | [doc SRC-006] |

## Interactions

| Trigger | Result | Request | Persistence scope | Evidence |
|---|---|---|---|---|
| Select currency (USD/KGS/EUR/RUB) | Converts all displayed prices & deposits using daily NBKR exchange rate | `GET /api/rates` | `localStorage` (`pref_currency`) | [doc SRC-005] |
| Submit Hero Search | Navigates to `/tours` with URL query params (`?region=song-kul&month=2027-07&type=horseback`) | `GET /api/tours` | URL query params | [doc SRC-001] |
| Click Organizer name/avatar on Tour Card | Opens Public Organizer Profile (`S-004`) directly without hiding operator identity | `GET /api/organizers/:slug` | Route navigation | [doc SRC-001] |

## Keyboard and accessibility

| Check | Result | Evidence |
|---|---|---|
| Tab order | Header controls -> Search inputs -> Search CTA -> Region cards -> Tour cards | [doc SRC-005] |
| Arrow keys | Navigates date picker calendar cells and autocomplete dropdown options | [doc SRC-005] |
| Shortcuts | `Escape` closes open date/region popover | [doc SRC-005] |
| Focus visible | 2px high-contrast focus ring on interactive cards and inputs | [doc SRC-005] |
| Escape | Closes currency/language/calendar dropdowns | [doc SRC-005] |
| Unlabeled controls | Heart/favorite icon button requires `aria-label="Save tour to wishlist"` | [doc SRC-005] |

## Microcopy

| Element | Text | Evidence |
|---|---|---|
| Price Parity Badge | "Direct Organizer Price — 0% Markup" ("Прямая цена организатора — без наценок") | [doc SRC-001] |
| Deposit Explainer | "Pay only 20% online to reserve your seat; pay the rest directly to the organizer" | [doc SRC-004] |

## Rules
- R-001, R-002, R-003

## Realtime and performance

| Check | Result | Evidence |
|---|---|---|
| A change in a second tab appears without reload | Currency selection syncs across tabs via storage event; catalog uses SSR/ISR caching | [doc SRC-005] |
| Loading pattern (skeleton, spinner, optimistic update) | Server-side rendered hero & SEO metadata + skeleton placeholders for dynamic availability | [doc SRC-005] |
| Delays the user sees | < 200ms filter transition via pre-indexed query | [doc SRC-005] |

## Responsive

| Width | Change | Evidence |
|---|---|---|
| `< 768px` (Mobile) | Search bar collapses into a compact pill ("Where & When in Kyrgyzstan?") that opens a full-screen filter sheet; tour cards stack 1 per row | [doc SRC-005] |
| `768px–1024px` (Tablet) | 2-column tour card grid; horizontal scrollable activity pills | [doc SRC-001] |
| `> 1024px` (Desktop) | 3- or 4-column tour card grid; inline 4-field search bar | [doc SRC-001] |

## Not tested
- Live Chrome DevTools DOM inspection of `bolshayastrana.com` home page animations (timed out awaiting user remote-debugging approval; documented from public specifications).

