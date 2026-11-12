# S-002 Tour Catalog & Multi-Faceted Search
Features: F-001, F-002, F-003, F-004 · URL: `/tours` · Status: done

## Purpose
Allows tourists to filter, compare, and sort all available Kyrgyzstan tours across multiple local organizers with full transparency on organizer identity, difficulty, comfort, next departure dates, and direct prices.

## Entry points
- Search submission or region card click from `S-001`
- SEO landing URLs (e.g., `/tours/issyk-kul`, `/tours/horseback-trekking`, `/tours/kel-suu`)

## Anatomy

| # | Region | Contents | Component | Evidence |
|---|---|---|---|---|
| 1 | Breadcrumb & Category Header | SEO Title (e.g. "Tours in Kyrgyzstan — 142 tours from 28 local organizers"), active filter chips, sort dropdown (Popularity, Price Low-High, Rating, Soonest Departure) | Catalog Header | [doc SRC-002] |
| 2 | Left Filter Sidebar (Desktop) / Filter Drawer (Mobile) | Date range / Month picker, Price range slider, Duration (1 day, 2–4 days, 5–8 days, 9+ days), Region checkboxes, Activity type, Difficulty level (1–5), Comfort level (Tent, Yurt, Guesthouse, Hotel), Organizer filter, "Guaranteed Departures Only" toggle, "Free Cancellation" toggle | C-001 | [doc SRC-001] |
| 3 | Tour Card Listing Grid | Cards showing: Photo carousel, "Guaranteed" / "Direct Price" badges, Tour Title, **Open Organizer link + Star Rating + Verified Review count**, Duration + Group size, Difficulty & Comfort icons, Next 3 departure date pills with remaining seats, Total Price + "Reserve for $XX (20% deposit)" | C-002 | [doc SRC-001] |

## Data shown

| Element | Entity.field | Evidence |
|---|---|---|
| Tour Card Summary | `Tour.title`, `Tour.durationDays`, `Tour.difficultyLevel`, `Tour.comfortLevel`, `Tour.maxGroupSize` | [doc SRC-001] |
| Open Organizer Attribution | `Organizer.brandName`, `Organizer.slug`, `Organizer.isVerified`, `Organizer.ratingAvg`, `Organizer.reviewsCount` | [doc SRC-001] |
| Upcoming Departures Preview | Next 3 `TourDeparture.startDate`, `TourDeparture.seatsRemaining`, `TourDeparture.isGuaranteed` | [doc SRC-001] |

## States

| State | How to reach it | What it shows | Evidence |
|---|---|---|---|
| Empty | Filter combination with 0 matches | "No tours match all filters" + one-click button to relax date or difficulty filters + similar tours in Kyrgyzstan | [doc SRC-001] |
| Loading | Changing any sidebar filter | Shimmer overlay on grid + updated count badge on filter button | [doc SRC-005] |
| Typical | `/tours` default view | 12–24 tour cards per page with active departure dates | [doc SRC-002] |
| Many items | > 24 matching tours | Pagination + total count ("Showing 1–24 of 142 tours") | [doc SRC-002] |
| Long text | Multi-region route list | Shows first 3 regions ("Bishkek -> Karakol -> Song-Kul +2 more") | [doc SRC-001] |
| Error | Filter query timeout | Toast notification + "Retry search" button | [doc SRC-005] |
| No permission | N/A | Public | [doc SRC-001] |
| Plan-gated | N/A | Public | [doc SRC-001] |

## Interactions

| Trigger | Result | Request | Persistence scope | Evidence |
|---|---|---|---|---|
| Toggle "Guaranteed Departures Only" | Filters catalog to tours having at least one upcoming `TourDeparture` with `isGuaranteed = true` | `GET /api/tours?guaranteed=true` | URL query params | [doc SRC-001] |
| Hover/Click Difficulty or Comfort icon on card | Shows tooltip explaining exact physical requirement or accommodation type (e.g., "Comfort Level 2: Traditional Felt Yurt Camp, shared heated washrooms") | None (client tooltip) | Transient UI (A1) | [doc SRC-001] |
| Click Organizer Name on Tour Card | Navigates directly to `/organizers/:slug` (`S-004`) | `GET /api/organizers/:slug` | Route navigation | [doc SRC-001] |

## Keyboard and accessibility

| Check | Result | Evidence |
|---|---|---|
| Tab order | Filter controls -> Sort select -> Tour cards (Link -> Organizer Link -> Date Pills) -> Pagination | [doc SRC-005] |
| Arrow keys | Operates price/duration range sliders | [doc SRC-005] |
| Shortcuts | `Escape` closes mobile filter drawer | [doc SRC-005] |
| Focus visible | Outline on checkboxes, filter pills, and card links | [doc SRC-005] |
| Escape | Closes filter drawer or active tooltip | [doc SRC-005] |
| Unlabeled controls | Dual-thumb range sliders must carry `aria-label="Minimum price"` and `aria-label="Maximum price"` | [doc SRC-005] |

## Microcopy

| Element | Text | Evidence |
|---|---|---|
| Organizer attribution on card | "Organizer: [Brand Name] · ★ 4.9 (84 verified reviews)" | [doc SRC-001] |
| Seat urgency badge | "Only 3 spots left for July 14" / "Guaranteed departure" | [doc SRC-001] |

## Rules
- R-001, R-002, R-004, R-006

## Realtime and performance

| Check | Result | Evidence |
|---|---|---|
| A change in a second tab appears without reload | Seat quota updates on filter re-fetch | [doc SRC-001] |
| Loading pattern (skeleton, spinner, optimistic update) | URL query updates immediately; grid dims with 150ms debounce | [doc SRC-005] |
| Delays the user sees | Facet counts update alongside results | [doc SRC-005] |

## Responsive

| Width | Change | Evidence |
|---|---|---|
| `< 768px` | Sidebar moves into a slide-up modal sheet with a sticky bottom "Show X Tours" button | [doc SRC-005] |
| `>= 1024px` | Sticky 280px left filter sidebar + 3-column card grid | [doc SRC-001] |

## Not tested
- Live DOM inspection of filter checkboxes on `bolshayastrana.com` (L4 public documentation study).

