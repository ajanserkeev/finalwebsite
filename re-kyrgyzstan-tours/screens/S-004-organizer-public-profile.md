# S-004 Public Tour Organizer Profile Page
Features: F-003, F-007 · URL: `/organizers/:slug` · Status: done

## Purpose
Dedicated public showcase for a local Kyrgyz tour operator or guide team so tourists can see **who actually runs the tour**, verify their legal/platform credentials, browse all their active tours, and read every verified review written by real past tourists across all their tours.

## Entry points
- Clicking the Open Organizer Badge/Card on any Tour Card (`S-002`) or Tour Detail Page (`S-003`)
- Clicking a Featured Organizer on `S-001`

## Anatomy

| # | Region | Contents | Component | Evidence |
|---|---|---|---|---|
| 1 | Organizer Hero Header | Brand Logo, Cover Photo, Organizer Name, **"Verified Organizer" Badge** (registration verified by platform admin), Year founded, Base city (e.g., Bishkek / Karakol / Osh), Languages spoken (EN, RU, KG, DE, FR), Aggregate Star Rating + Total Verified Reviews, Total Tourists Hosted counter | C-003 | [doc SRC-001] |
| 2 | About & Team Bio | Description of the organizer's specialization (e.g., high-altitude Tien Shan trekking, family jeep tours, horseback nomadic tours), fleet photos (4WD vehicles, yurt camps), lead guides' profiles & certifications | Organizer Bio | [doc SRC-001] |
| 3 | Organizer's Active Tours Grid | All published tours by this organizer with direct-price badges, next departure dates, and seat counts | C-002 | [doc SRC-001] |
| 4 | All Verified Reviews for this Organizer | Aggregated feed of verified reviews from tourists who booked any tour with this organizer, showing which specific tour each reviewer took, trip month/year, photos, and the organizer's public response | C-005 | [doc SRC-005] |

## Data shown

| Element | Entity.field | Evidence |
|---|---|---|
| Organizer Verification & Stats | `Organizer.brandName`, `Organizer.legalName`, `Organizer.isVerified`, `Organizer.ratingAvg`, `Organizer.reviewsCount`, `Organizer.touristsHostedCount` | [doc SRC-001] |
| Guide Profiles | `Organizer.guides[]` (name, photo, languages, years experience) | [doc SRC-001] |
| Aggregated Reviews | `Review.*` joined across all `Tour.organizerId = Organizer.id` | [doc SRC-005] |

## States

| State | How to reach it | What it shows | Evidence |
|---|---|---|---|
| Empty | Newly verified organizer with 0 past reviews | Shows "Verified Partner — Documents & Fleet Checked by Platform" badge + active tours | [doc SRC-003] |
| Loading | Navigating to `/organizers/:slug` | Header & tour grid skeleton | [doc SRC-005] |
| Typical | Established Kyrgyz operator with 5–15 tours and 30+ verified reviews | Full bio, fleet gallery, active tours grid, filterable verified reviews | [doc SRC-001] |
| Many items | 50+ reviews | Paginated review feed with filter by Tour Name and Star Rating | [doc SRC-005] |
| Long text | Detailed company story | Expandable "Read full story" section | [doc SRC-001] |
| Error | Invalid organizer slug | 404 page with link back to `/tours` | [doc SRC-005] |
| No permission | Suspended organizer | Redirects or displays "This organizer is currently not accepting new bookings" | [doc SRC-006] |
| Plan-gated | N/A | Public | [doc SRC-001] |

## Interactions

| Trigger | Result | Request | Persistence scope | Evidence |
|---|---|---|---|---|
| Filter reviews by specific tour | Filters the review list to show feedback for one selected tour run by this organizer | `GET /api/organizers/:slug/reviews?tourId=:id` | Component state | [doc SRC-005] |
| Click a tour card | Opens `S-003` for that tour | `GET /api/tours/:slug` | Route navigation | [doc SRC-001] |

## Keyboard and accessibility

| Check | Result | Evidence |
|---|---|---|
| Tab order | Breadcrumb -> Verification badge tooltip -> Active tour cards -> Review filter select -> Review pagination | [doc SRC-005] |
| Arrow keys | Navigates fleet/guide photo carousel | [doc SRC-005] |
| Shortcuts | `Escape` closes verification details modal | [doc SRC-005] |
| Focus visible | Visible focus ring on all links and filter pills | [doc SRC-005] |
| Escape | Closes photo lightbox | [doc SRC-005] |
| Unlabeled controls | Star rating graphics include `aria-label="Rated 4.9 out of 5 from 84 verified reviews"` | [doc SRC-005] |

## Microcopy

| Element | Text | Evidence |
|---|---|---|
| Verification Tooltip | "Legal registration (ИП/ОсОО), identity, and direct-price agreement verified by platform administration." | [doc SRC-003] |

## Rules
- R-001, R-007, R-008

## Realtime and performance

| Check | Result | Evidence |
|---|---|---|
| A change in a second tab appears without reload | ISR cache invalidated when a new verified review is published or a tour is updated | [doc SRC-005] |
| Loading pattern (skeleton, spinner, optimistic update) | SSR for SEO indexing of organizer brand name | [doc SRC-001] |
| Delays the user sees | < 200ms page load | [doc SRC-005] |

## Responsive

| Width | Change | Evidence |
|---|---|---|
| `< 768px` | Stacked profile header, horizontal scroll for guide cards, 1-column tour list | [doc SRC-005] |
| `>= 1024px` | 3-column tour grid + 2-column review summary | [doc SRC-001] |

## Not tested
- Live DOM inspection on `bolshayastrana.com` organizer page (documented from public specification).

