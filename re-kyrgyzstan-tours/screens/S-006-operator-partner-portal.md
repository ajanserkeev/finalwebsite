# S-006 Tour Operator / Partner Dedicated Portal
Features: F-006, F-007, F-009, F-010, F-011 · URL: `/partner/dashboard` · Status: done

## Purpose
Dedicated workspace for each verified Tour Operator / Partner in Kyrgyzstan where they can track **how many tours were sold**, **how many people signed up (total participants)**, revenue and deposit/balance breakdowns, manage their tour programs & departure seat quotas, download participant manifests, and reply to verified tourist reviews.

## Entry points
- Partner login at `/partner/login`
- "For Organizers / Partner Cabinet" link in header/footer

## Anatomy

| # | Region | Contents | Component | Evidence |
|---|---|---|---|---|
| 1 | Partner Sidebar Navigation | Overview & Analytics, My Tours (`Tours`), Departure Dates & Quotas (`Departures`), Bookings & Participant Signups (`Bookings`), Reviews & Replies (`Reviews`), Payouts & Commission Statements (`Finance`), Company Profile & Guides (`Settings`) | Partner Sidebar | [doc SRC-006] |
| 2 | Top KPI Summary Cards | 4 real-time metric cards filterable by period (This Month, Season, All Time):<br/>1. **Total Tours Sold (Bookings Count)** (e.g., `42 bookings`)<br/>2. **Total People Signed Up (Participants / Pax)** (e.g., `118 tourists signed up`)<br/>3. **Gross Tour Sales Volume** (e.g., `$82,600 total value`)<br/>4. **Direct Balance Collectible on Arrival vs. Platform Commission** (e.g., `$69,384 paid by tourists to you + $13,216 platform commission`) | C-006 | [doc SRC-006] |
| 3 | Upcoming Departures & Seat Fill Bars | Visual list of next 10 departures showing Tour Name, Start Date, **Signed-Up Progress Bar (e.g. `9 / 12 people signed up — 75% full`)**, Guaranteed status toggle, Quick `+ / -` seat quota buttons (to sync seats sold on Instagram/WhatsApp and prevent `B-003`), and "View Participant List (CSV/PDF)" button | C-004, C-006 | [doc SRC-006] |
| 4 | Recent Bookings & Signups Table | Table of every booking: Booking ID, Booking Date, Tour & Departure Date, **Lead Tourist Name + Pax Count (e.g. "3 people")**, Contact (WhatsApp/Email unlocked once deposit is paid), Total Price, Deposit Paid Status, Balance Due to Operator on Arrival, Status (`Confirmed`, `Pending Confirmation`, `Completed`, `Cancelled`), Action buttons (`Confirm`, `Download Manifest`) | C-006 | [doc SRC-006] |
| 5 | Self-Service Tour Editor & Departure Scheduler | Structured form to create/edit tours (Title, Regions, Difficulty 1–5, Comfort level, Day-by-day itinerary, Inclusions, Photos, Direct Price covenant checkbox) and bulk-add departure dates with `maxSeats`, `price`, `isGuaranteed`, and `cutoffHours` | Tour Builder | [doc SRC-006] |
| 6 | Verified Reviews & Reply Console | Feed of verified tourist reviews for this operator's tours with a "Post Official Organizer Reply" form and a "Request Review Link" generator for past travelers | C-005 | [doc SRC-006] |

## Data shown

| Element | Entity.field | Evidence |
|---|---|---|
| KPI: Tours Sold | `COUNT(Booking.id)` where `Booking.organizerId = currentOrganizer.id` and `status IN ('confirmed', 'completed')` | [doc SRC-006] |
| KPI: People Signed Up | `SUM(Booking.paxCount)` where `Booking.organizerId = currentOrganizer.id` and `status IN ('confirmed', 'completed')` | [doc SRC-006] |
| Departure Fill Rate | `TourDeparture.bookedSeats` / `TourDeparture.maxSeats`, `TourDeparture.seatsRemaining` | [doc SRC-006] |
| Participant Manifest | `Booking.leadTravelerName`, `Booking.leadPhone`, `Booking.leadEmail`, `Booking.participants[]`, `Booking.dietaryNotes`, `Booking.balanceDueToOrganizer` | [doc SRC-006] |

## States

| State | How to reach it | What it shows | Evidence |
|---|---|---|---|
| Empty | Newly onboarded Kyrgyz tour operator | Onboarding checklist: "1. Complete Organizer Profile -> 2. Submit First Tour for Approval -> 3. Add Departure Dates" | [doc SRC-003] |
| Loading | Switching date range filter on KPI dashboard | Skeleton KPI cards and table shimmer | [doc SRC-006] |
| Typical | Active season operator | Populated KPI counters (Tours Sold, People Signed Up), departure fill bars, participant manifest table | [doc SRC-006] |
| Many items | 500+ season bookings | Filter by Tour, Departure Date, Booking Status + CSV/Excel export for guides & drivers | [doc SRC-006] |
| Long text | Detailed participant dietary/medical notes | Expandable drawer per booking row | [doc SRC-006] |
| Error | Setting `maxSeats` lower than already-booked `bookedSeats` | Validation error: "Cannot reduce total capacity below the 6 seats already booked on this departure" (`R-011`) | [doc SRC-006] |
| No permission | Unauthenticated or Tourist role | Redirects to `/partner/login`; strict row-level isolation so Operator A can never see Operator B's tours or bookings (`R-012`) | [doc SRC-006] |
| Plan-gated | Pending KYC verification | Operator can draft tours in `draft` mode, but publishing requires Admin verification (`R-013`) | [doc SRC-003] |

## Interactions

| Trigger | Result | Request | Persistence scope | Evidence |
|---|---|---|---|---|
| Adjust remaining seats (`+` / `-`) on a departure row | Immediately updates `TourDeparture.maxSeats` / `seatsRemaining` on public Tour Detail page (`S-003`) so offline/Instagram sales don't cause double-bookings | `PATCH /api/partner/departures/:id` | Database | [doc SRC-006] |
| Click "View Participant List / Export Manifest" on a departure | Displays all signed-up tourists for that departure date (names, WhatsApp contacts, pax count, balance to collect on Day 1) and exports PDF/CSV for the mountain guide | `GET /api/partner/departures/:id/manifest` | File download / Modal | [doc SRC-006] |
| Submit new or edited Tour price | Runs Direct-Price Parity validation (`R-002`) and queues tour for Admin approval (`S-007`) | `PUT /api/partner/tours/:id` | Database | [doc SRC-003] |
| Post Organizer Reply to a review | Appends `Review.organizerReply` and `repliedAt` publicly under the tourist's review on `S-003` and `S-004` | `POST /api/partner/reviews/:id/reply` | Database | [doc SRC-006] |

## Keyboard and accessibility

| Check | Result | Evidence |
|---|---|---|
| Tab order | Sidebar nav -> Period filter -> KPI cards -> Departure quota controls -> Bookings table -> Action buttons | [doc SRC-006] |
| Arrow keys | Navigates table rows and date pickers | [doc SRC-006] |
| Shortcuts | `Escape` closes participant manifest drawer | [doc SRC-006] |
| Focus visible | Clear focus outline on all table controls and quota steppers | [doc SRC-006] |
| Escape | Closes modal dialogs | [doc SRC-006] |
| Unlabeled controls | Quota adjustment buttons include `aria-label="Decrease available seats for July 14 departure"` | [doc SRC-006] |

## Microcopy

| Element | Text | Evidence |
|---|---|---|
| Direct Price Covenant Checkbox | "I confirm this price matches our official direct booking price with zero markup added." | [doc SRC-003] |
| Quick Quota Sync Hint | "Sold a spot via Instagram or WhatsApp? Click [−] to reduce available seats here in 1 second." | [doc SRC-006] |

## Rules
- R-002, R-005, R-009, R-011, R-012, R-013

## Realtime and performance

| Check | Result | Evidence |
|---|---|---|
| A change in a second tab appears without reload | New booking webhook pushes live notification toast + increments "Tours Sold" and "People Signed Up" counters | [doc SRC-007] |
| Loading pattern (skeleton, spinner, optimistic update) | Optimistic UI update on seat quota +/- buttons | [doc SRC-006] |
| Delays the user sees | < 200ms quota update | [doc SRC-006] |

## Responsive

| Width | Change | Evidence |
|---|---|---|
| `< 768px` | Mobile-optimized operator view so mountain guides in Karakol/Issyk-Kul can check today's participant manifest and adjust seat quotas from their phone | [doc SRC-006] |
| `>= 1024px` | Full sidebar + 4-column KPI grid + data tables | [doc SRC-006] |

## Not tested
- Authenticated session inside `supplier.viator.com` or `bolshayastrana.com` partner cabinet (L4 Observe-Only forbids account creation/login; documented from official supplier portal specifications `SRC-003`, `SRC-006`).

