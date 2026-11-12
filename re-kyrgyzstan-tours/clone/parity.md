# Parity tests

One test per rule the clone must reproduce. A test passes when the clone shows the same behavior as the rule.

| Test | Rule | Feature | Summary | Clone status |
|---|---|---|---|---|
| T-001 | R-001 | F-003 | Every public tour card (`S-002`) and tour detail page (`S-003`) displays the Organizer's brand name, verified badge, rating, review count, and clickable link to `/organizers/:slug` (`S-004`) | pass |
| T-002 | R-002 | F-004 | Tour price equals the Organizer's direct price (0% markup); price-match claims can be submitted on `S-003` and audited by Admin on `S-007` | pass |
| T-003 | R-003 | F-005 | Checkout (`S-005`) splits `totalAmount = paxCount * price` into `depositAmount` (15–25% paid online now) and `balanceDueToOrganizer` (75–85% paid directly to Organizer) | pass |
| T-004 | R-004 | F-006 | Departure row displays `"Guaranteed Departure"` badge and matches the `guaranteed=true` filter when `bookedSeats >= minParticipants` or manually toggled by the Operator | pass |
| T-005 | R-005 | F-006 | Checkout blocks `paxCount > seatsRemaining`, places a 15-minute atomic seat hold during payment, and marks the departure `sold_out` when `seatsRemaining == 0` | pass |
| T-006 | R-006 | F-008 | Online booking automatically closes (`status = closed`) when `currentTime >= startDate - cutoffHours` | pass |
| T-007 | R-007 | F-007 | Only a tourist with a single-use token from a `completed` `Booking` can submit a review; unbooked visitors cannot submit reviews | pass |
| T-008 | R-008 | F-007 | Submitting a verified review updates both `Tour.ratingAvg`/`reviewsCount` (`S-003`) and `Organizer.ratingAvg`/`reviewsCount` (`S-004`) | pass |
| T-009 | R-009 | F-009 | Confirming a booking of `N` pax immediately increments the Operator Portal (`S-006`) counters: **Tours Sold (`+1`)** and **People Signed Up (`+N`)**, and adds travelers to the Departure Manifest | pass |
| T-010 | R-010 | F-008 | Cancelling `>= freeCancellationDays` before `startDate` marks 100% of the deposit refundable, restores `paxCount` seats to `seatsRemaining`, and decrements active operator signup counts | pass |
| T-011 | R-011 | F-010 | Operator Portal (`S-006`) prevents reducing `TourDeparture.maxSeats` below already-confirmed `bookedSeats` | pass |
| T-012 | R-012 | F-009 | Role-based access control strictly isolates each `organizer` to their own tours, bookings, manifests, and KPIs (`S-006`), while `admin` (`S-007`) has global access | pass |
| T-013 | R-013 | F-012 | Unverified organizers (`isVerified = false`) and unapproved tours (`status != 'published'`) are hidden from all public catalog and profile endpoints until approved by Admin in `S-007` | pass |
