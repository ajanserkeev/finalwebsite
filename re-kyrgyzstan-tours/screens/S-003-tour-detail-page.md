# S-003 Tour Detail Page (Open Organizer, Departure Matrix & Reviews)
Features: F-002, F-003, F-004, F-005, F-006, F-007 · URL: `/tours/:slug` · Status: done

## Purpose
The primary conversion page where a tourist inspects the complete itinerary, verifies the **real Tour Organizer**, checks exact **group departure dates and remaining seats**, reads **verified reviews from real tourists**, and initiates booking at the **organizer's direct price**.

## Entry points
- Clicking any Tour Card in `S-001`, `S-002`, or `S-004`
- Direct link shared via WhatsApp/Telegram or organic Google search

## Anatomy

| # | Region | Contents | Component | Evidence |
|---|---|---|---|---|
| 1 | Title, Key Facts & Badges Header | Tour Title, Region breadcrumbs, Star rating + Verified review count, Key pills: Duration (days/nights), Group Size (e.g., Max 12 people), Difficulty (1–5), Comfort Level, Minimum Age, Languages spoken by guide (EN/RU/KG) | Tour Header | [doc SRC-001] |
| 2 | Media Gallery & Route Map | Hero photo mosaic (yurt camps, mountain lakes, 4WD vehicles) + interactive route map showing daily stops (e.g., Bishkek -> Burana -> Chon-Kemin -> Song-Kul -> Karakol -> Issyk-Kul) | Media & Map | [doc SRC-002] |
| 3 | Sticky Right Booking & Organizer Card | **Direct Price Guarantee Banner ("0% Markup — Same Price as Organizer")**, Total Price per person, **Online Deposit Today (e.g., 20% = $140)** vs. **Balance to Organizer on Arrival ($560)**, Selected Departure Date selector, "Book Spot / Reserve" CTA, Free Cancellation cutoff notice, and **Open Organizer Profile Card** (Logo, Name, License/Verification badge, Years active, Response time, "View Organizer Page" link) | C-003, C-004 | [doc SRC-001] |
| 4 | Day-by-Day Itinerary Accordion | Collapsible cards for Day 1..Day N: daily route distance (km & driving hours vs. hiking hours), altitude gain, meals included (B/L/D), overnight accommodation type (e.g., "Yurt camp at Song-Kul Lake, 3016m"), photos per day | Itinerary Block | [doc SRC-002] |
| 5 | Accommodation, Transport & Comfort Breakdown | Photos of the actual guesthouses/yurts/hotels and transport (e.g., Toyota Sequoia 4WD / Mercedes Sprinter), bathroom/shower availability per night (solves `B-005`) | Comfort Block | [doc SRC-002] |
| 6 | Included vs. Not Included Two-Column List | Green checkmarks (Accommodation, 4WD transport & fuel, English/Russian guide, National park fees, Eagle hunting show, specified meals) vs. Red crosses (International flights to Bishkek FRU, personal travel insurance, alcoholic drinks) | Inclusions Block | [doc SRC-002] |
| 7 | Group Departure Dates & Seat Quota Table | Interactive table of all scheduled departures by month: Start Date -> End Date, Guide Language, Status Badge (`Guaranteed`, `6 of 12 spots left`, `Sold Out`), Price per person, Deposit amount, and row-level "Select Date" button | C-004 | [doc SRC-001] |
| 8 | Verified Tourist Reviews Section | Aggregate score (Overall, Guide quality, Route, Accommodation, Transport, Value), filter by traveler photos, list of verified reviews showing Tourist Name, Country, **Verified Booking Badge ("Booked June 14–20, 2026 tour via platform")**, review text, tourist photos, and **Official Organizer Reply** | C-005 | [doc SRC-005] |

## Data shown

| Element | Entity.field | Evidence |
|---|---|---|
| Price & Deposit Breakdown | `TourDeparture.price`, `Tour.depositPercent`, `Tour.currency` | [doc SRC-004] |
| Departure Schedule Matrix | `TourDeparture.startDate`, `TourDeparture.endDate`, `TourDeparture.maxSeats`, `TourDeparture.bookedSeats`, `TourDeparture.seatsRemaining`, `TourDeparture.isGuaranteed`, `TourDeparture.cutoffHours` | [doc SRC-001] |
| Open Organizer Card | `Organizer.brandName`, `Organizer.legalName`, `Organizer.registrationNumber`, `Organizer.ratingAvg`, `Organizer.reviewsCount`, `Organizer.toursCompletedCount` | [doc SRC-001] |
| Verified Review Item | `Review.authorName`, `Review.bookingId`, `Review.tripDate`, `Review.rating`, `Review.comment`, `Review.photos`, `Review.organizerReply` | [doc SRC-006] |

## States

| State | How to reach it | What it shows | Evidence |
|---|---|---|---|
| Empty | Tour has 0 reviews yet (new listing) | Shows Organizer's overall rating across their other tours: "New tour program — see 48 verified reviews for [Organizer Name] on their other Kyrgyzstan tours" | [doc SRC-005] |
| Loading | Switching currency or month tab in departure table | Instant client recalculation or skeleton row | [doc SRC-001] |
| Typical | Active multi-day tour with 5–15 scheduled departure dates | Full itinerary, sticky booking widget, green "Available" / "Guaranteed" departure rows | [doc SRC-001] |
| Many items | 30+ departure dates across May–October season | Month filter tabs (`May`, `June`, `July`, `August`, `September`, `October`) above the departure table | [doc SRC-001] |
| Long text | 10-day itinerary with detailed descriptions | Days 1–2 expanded by default; "Expand All 10 Days" toggle button | [doc SRC-001] |
| Error | Selected departure just sold out in another session | Inline alert: "Those seats were just reserved — please select another departure date below" | [doc SRC-007] |
| No permission | Draft/Unpublished tour URL | Accessible only to the owning Organizer (`S-006`) and Platform Admin (`S-007`) in preview mode | [doc SRC-006] |
| Plan-gated | N/A | Public | [doc SRC-001] |

## Interactions

| Trigger | Result | Request | Persistence scope | Evidence |
|---|---|---|---|---|
| Click "Select Date" on a row in Departure Matrix (`C-004`) | Highlights that departure date, updates price/seats in sticky widget, and opens Booking Checkout (`S-005`) | `GET /api/departures/:id/availability` | URL hash / state | [doc SRC-001] |
| Click "Found cheaper? Price Match" link | Opens modal where tourist pastes link to organizer's direct page if price differs; platform matches price (`R-002`) | `POST /api/price-match-claims` | Database record | [doc SRC-004] |
| Click Organizer Card | Navigates to Organizer Public Profile (`S-004`) showing all their tours and verified reviews | `GET /api/organizers/:slug` | Route navigation | [doc SRC-001] |

## Keyboard and accessibility

| Check | Result | Evidence |
|---|---|---|
| Tab order | Breadcrumbs -> Gallery -> Sticky Booking Card -> Itinerary Accordions -> Departure Table rows -> Review filters | [doc SRC-005] |
| Arrow keys | Switches photos in lightbox gallery and months in departure tabs | [doc SRC-005] |
| Shortcuts | `Escape` closes photo lightbox | [doc SRC-005] |
| Focus visible | High-contrast ring on accordion headers and "Select Date" buttons | [doc SRC-005] |
| Escape | Closes lightbox or price-match modal | [doc SRC-005] |
| Unlabeled controls | Accordion buttons use `aria-expanded="true|false"` | [doc SRC-005] |

## Microcopy

| Element | Text | Evidence |
|---|---|---|
| Direct Price Guarantee | "Direct price from organizer [Organizer Name] without markups or hidden agency fees." | [doc SRC-001] |
| Verified Review Tag | "✓ Verified Tourist — booked this tour with [Organizer Name] via our platform" | [doc SRC-006] |

## Rules
- R-001, R-002, R-003, R-004, R-005, R-006, R-007, R-008

## Realtime and performance

| Check | Result | Evidence |
|---|---|---|
| A change in a second tab appears without reload | Live availability check runs when clicking "Select Date" to prevent overbooking (`R-005`) | [doc SRC-007] |
| Loading pattern (skeleton, spinner, optimistic update) | Static itinerary renders immediately via SSR; departure seat counts revalidate on mount | [doc SRC-005] |
| Delays the user sees | Instant itinerary accordion toggle; <300ms availability check | [doc SRC-005] |

## Responsive

| Width | Change | Evidence |
|---|---|---|
| `< 768px` | Right sticky booking card turns into a fixed bottom bar (`From $700 · Deposit $140 · [Choose Date]`) that scrolls to the Departure Matrix | [doc SRC-005] |
| `>= 1024px` | 2-column layout: 65% main content column on left, 35% sticky booking & organizer card on right | [doc SRC-001] |

## Not tested
- Live DOM script extraction on `bolshayastrana.com` tour detail page (documented from public specification).

