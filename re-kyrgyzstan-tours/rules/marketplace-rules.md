# Rules: Marketplace, Pricing, Quotas, Reviews & Portals

### R-001 Open Organizer Attribution on Every Tour
- Given any published tour displayed in search results (`S-002`) or on the tour detail page (`S-003`)
- When a tourist views the tour card or detail header/sidebar
- Then the platform openly displays the Organizer's brand name, verified badge, aggregate rating, verified review count, and a direct link to the Organizer's public profile (`S-004`) before any booking action
- Evidence: [doc SRC-001]
- Feature: F-003 · Screen: S-002, S-003, S-004

| Probe | Input | Result | Evidence |
|---|---|---|---|
| Public tour card | Published tour with `organizerId` | Shows Organizer name, avatar, rating, and link to `/organizers/:slug` | [doc SRC-001] |

### R-002 Direct-Price Parity Guarantee (0% Markup Over Organizer)
- Given a tour submitted or updated by an Organizer in `S-006`
- When the tour price or departure price is set
- Then `TourDeparture.price` must be less than or equal to the Organizer's official direct retail price (`Organizer.directSiteUrl`), and the platform earns its commission (`Organizer.commissionPercent`, e.g., 15–20%) out of that direct price rather than adding a markup on top
- Evidence: [doc SRC-001], [doc SRC-004]
- Feature: F-004 · Screen: S-003, S-006, S-007

| Probe | Input | Result | Evidence |
|---|---|---|---|
| Price match claim | Tourist submits proof of lower direct price for same departure | Platform matches the lower direct price and flags tour for Admin parity audit in `S-007` | [doc SRC-004] |

### R-003 Online Prepayment Deposit vs. Balance Paid to Organizer
- Given a tour with `depositPercent` (e.g. `20%`) and a departure with `price` (e.g. `$700`) for `paxCount` travelers (e.g. `2`)
- When the tourist initiates checkout in `S-005`
- Then `totalAmount = paxCount * price` (`$1,400`), `depositAmount = ROUND(totalAmount * depositPercent / 100)` (`$280`) is charged online now to lock the seats, and `balanceDueToOrganizer = totalAmount - depositAmount` (`$1,120`) is recorded as payable directly to the Organizer prior to or on Day 1 of the tour
- Evidence: [doc SRC-002], [doc SRC-004]
- Feature: F-005 · Screen: S-003, S-005

| Probe | Input | Result | Evidence |
|---|---|---|---|
| 2 pax @ $700, 20% deposit | `paxCount = 2`, `price = 700`, `depositPercent = 20` | Online deposit = `$280`; Balance to Organizer = `$1,120` | [doc SRC-004] |

### R-004 Guaranteed Departure Status Threshold
- Given a `TourDeparture` with `minParticipants` and `bookedSeats`
- When `bookedSeats >= minParticipants` OR the Organizer manually toggles `isGuaranteed = true` in `S-006`
- Then the departure displays the `"Guaranteed Departure"` badge on `S-002` and `S-003` and can be filtered via the "Guaranteed Departures Only" toggle
- Evidence: [doc SRC-001]
- Feature: F-006 · Screen: S-002, S-003, S-006

| Probe | Input | Result | Evidence |
|---|---|---|---|
| Group reaches min size | `bookedSeats (4) >= minParticipants (4)` | `isGuaranteed` becomes `true` and badge renders on `C-004` | [doc SRC-001] |

### R-005 Atomic Seat Quota Lock & Overbooking Prevention
- Given a `TourDeparture` with `seatsRemaining = maxSeats - bookedSeats - heldSeats`
- When a tourist attempts to book `paxCount` seats in `S-005`
- Then the system rejects any request where `paxCount > seatsRemaining`, places a 15-minute atomic hold (`heldSeats += paxCount`) during payment, and upon payment confirmation converts the hold into `bookedSeats += paxCount`; if `seatsRemaining == 0`, the departure status automatically becomes `sold_out`
- Evidence: [doc SRC-006], [doc SRC-007]
- Feature: F-006, F-008 · Screen: S-003, S-005, S-006

| Probe | Input | Result | Evidence |
|---|---|---|---|
| Request exceeds remaining seats | `seatsRemaining = 3`, `paxCount = 4` | Checkout blocked; max selectable `paxCount` capped at `3` | [doc SRC-007] |

### R-006 Booking Cutoff Auto-Closure
- Given a `TourDeparture` with `startDate` and `cutoffHours` (e.g., `24` or `48` hours before departure)
- When `currentTime >= startDate - cutoffHours`
- Then online self-service booking for that departure automatically closes (`status = closed`) on `S-003` and `S-005`
- Evidence: [doc SRC-006], [doc SRC-007]
- Feature: F-006, F-008 · Screen: S-003, S-005

| Probe | Input | Result | Evidence |
|---|---|---|---|
| Past cutoff window | `startDate - now() < cutoffHours` | Departure row button changes to "Booking Closed" | [doc SRC-006] |

### R-007 Verified-Booker-Only Review Gate
- Given the review submission endpoint and UI (`C-005`)
- When a user attempts to submit a review for a Tour and Organizer
- Then the submission is accepted ONLY if linked to a single-use `Booking` where `Booking.status == 'completed'` and `TourDeparture.endDate < currentDate`; unauthenticated or unbooked visitors cannot post reviews
- Evidence: [doc SRC-006]
- Feature: F-007 · Screen: S-003, S-004

| Probe | Input | Result | Evidence |
|---|---|---|---|
| Unbooked visitor | No completed `Booking` token | No public review form shown; API returns `403 Verified booking required` | [doc SRC-006] |

### R-008 Dual Rating Aggregation (Tour Level + Organizer Level)
- Given a newly published verified `Review` for `Tour` belonging to `Organizer`
- When the review is saved
- Then the system recalculates both the specific `Tour.ratingAvg` / `Tour.reviewsCount` AND the parent `Organizer.ratingAvg` / `Organizer.reviewsCount` across all tours operated by that Organizer, displaying the review on both `S-003` and `S-004`
- Evidence: [doc SRC-001], [doc SRC-005]
- Feature: F-003, F-007 · Screen: S-003, S-004

| Probe | Input | Result | Evidence |
|---|---|---|---|
| New 5-star review | Saved on `Tour A` of `Organizer X` | Updates `Tour A` rating and `Organizer X` profile rating + review feed | [doc SRC-005] |

### R-009 Real-Time Operator Portal Sales & Signup Counters
- Given a Tour Operator logged into the Partner Portal (`S-006`)
- When a `Booking` transitions to `confirmed` (or `completed`) for any of that operator's tours
- Then the Operator's dashboard immediately increments **Total Tours Sold** by `1`, increments **Total People Signed Up (`Pax`)** by `Booking.paxCount`, updates the departure's seat fill bar (`bookedSeats / maxSeats`), and adds the travelers to the Departure Participant Manifest
- Evidence: [doc SRC-006]
- Feature: F-009, F-011 · Screen: S-006

| Probe | Input | Result | Evidence |
|---|---|---|---|
| Confirmed booking of 3 pax | `Booking(paxCount=3, status='confirmed')` | Operator KPI: `Tours Sold +1`, `People Signed Up +3`, manifest updated | [doc SRC-006] |

### R-010 Free Cancellation Cutoff & Seat Restoration
- Given a `confirmed` Booking on a tour with `freeCancellationDays` (e.g. `15` days on multi-day tours or `1` day on day trips)
- When the tourist cancels at least `freeCancellationDays` before `TourDeparture.startDate`
- Then `100%` of the online deposit is marked refundable, `Booking.status` becomes `cancelled`, `TourDeparture.bookedSeats` decreases by `Booking.paxCount` (restoring available seats), and the Operator's active signup counter decrements accordingly
- Evidence: [doc SRC-004], [doc SRC-005]
- Feature: F-008, F-013 · Screen: S-005, S-006, S-007

| Probe | Input | Result | Evidence |
|---|---|---|---|
| Cancel 20 days before start | `daysUntilStart (20) >= freeCancellationDays (15)` | Full deposit refund eligible; `seatsRemaining` restored by `paxCount` | [doc SRC-004] |

### R-011 Operator Quota Floor Validation
- Given a `TourDeparture` that already has `bookedSeats > 0`
- When the Operator attempts to edit `maxSeats` in `S-006`
- Then the system rejects any `maxSeats < bookedSeats` so existing confirmed tourists are never displaced without an explicit cancellation workflow
- Evidence: [doc SRC-006]
- Feature: F-010 · Screen: S-006

| Probe | Input | Result | Evidence |
|---|---|---|---|
| Reduce capacity below booked | `bookedSeats = 6`, new `maxSeats = 4` | Returns `422 Unprocessable Entity: 6 seats already booked` | [doc SRC-006] |

### R-012 Strict Multi-Tenant Role & Data Isolation
- Given three platform roles (`tourist`, `organizer`, `admin`)
- When an `organizer` user queries `/api/partner/*` (`S-006`)
- Then all queries are strictly scoped to `organizer_id = currentUser.organizerId` (an operator can never view or edit another operator's tours, bookings, participant manifests, or revenue), and only `admin` users (`S-007`) can access `/api/admin/*` across all operators
- Evidence: [doc SRC-006]
- Feature: F-009, F-012 · Screen: S-006, S-007

| Probe | Input | Result | Evidence |
|---|---|---|---|
| Cross-operator access attempt | Operator A requests Operator B's departure manifest | Returns `403 Forbidden` / `404 Not Found` | [doc SRC-006] |

### R-013 Mandatory Admin Verification Before Public Listing
- Given a newly registered Organizer or a newly created Tour
- When `Organizer.isVerified == false` OR `Tour.status != 'published'`
- Then neither the Organizer nor the Tour appears in public catalog queries (`S-001`, `S-002`, `S-003`, `S-004`) until approved by a Platform Admin in `S-007`
- Evidence: [doc SRC-003], [doc SRC-006]
- Feature: F-012 · Screen: S-006, S-007

| Probe | Input | Result | Evidence |
|---|---|---|---|
| Unverified operator creates tour | `Organizer.isVerified = false` | Tour saved as `pending_review`; excluded from public `/api/tours` | [doc SRC-003] |

