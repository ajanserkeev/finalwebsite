# S-005 Booking Application & Deposit Checkout Modal/Page
Features: F-004, F-005, F-008 · URL: `/checkout/:departureId` · Status: done

## Purpose
Captures the tourist's booking for a specific `TourDeparture`, locks their seats in the group quota, transparently shows the **Direct Organizer Price** split into **Online Platform Deposit (15–25%)** + **Balance Paid Directly to Organizer (75–85%)**, and collects participant details + deposit payment.

## Entry points
- Clicking "Select Date / Book" on `S-003` for a chosen departure slot

## Anatomy

| # | Region | Contents | Component | Evidence |
|---|---|---|---|---|
| 1 | Tour & Departure Summary Header | Tour Title, **Organizer Name & Logo**, Selected Start Date -> End Date, Remaining seats badge (e.g., "4 spots left in this group"), Free Cancellation deadline date | Summary Banner | [doc SRC-004] |
| 2 | Participant Counter & Manifest Fields | Number of travelers (`paxCount`, bounded by `1..seatsRemaining`), Lead Traveler contact form (Full Name, Email, WhatsApp/Telegram phone number, Nationality), Additional Travelers' names/ages, Dietary or gear notes (vegetarian, sleeping bag rental size) | Booking Form | [doc SRC-006] |
| 3 | Transparent Price & Deposit Split Box | **Total Direct Organizer Price** (`paxCount × price`), **"0% Platform Markup — Same Price as Direct" badge**, **Due Now Online (e.g. 20% Deposit to lock seats)**, **Due Later to Organizer (80% paid in cash/transfer X days before or on Day 1 in Bishkek)** | Price Breakdown | [doc SRC-004] |
| 4 | Payment Method Selector | International Visa / Mastercard (3D-Secure via Freedom Pay / Stripe), Local Kyrgyzstan MBANK / Elkart / Finik QR, or "Submit Booking Request First (Pay Deposit within 24h after Organizer Confirmation)" | Payment Block | [doc SRC-008] |
| 5 | Legal Consents & Submit CTA | Checkbox for Platform Public Offer + Organizer Cancellation Policy, primary CTA ("Pay $140 Deposit & Lock 2 Seats" or "Reserve 2 Seats") | Submit Footer | [doc SRC-004] |

## Data shown

| Element | Entity.field | Evidence |
|---|---|---|
| Selected Slot Quota | `TourDeparture.startDate`, `TourDeparture.endDate`, `TourDeparture.seatsRemaining`, `TourDeparture.price` | [doc SRC-001] |
| Payment Split | `Booking.totalAmount`, `Booking.depositAmount`, `Booking.balanceDueToOrganizer` | [doc SRC-004] |
| Cancellation Cutoff | `TourDeparture.freeCancellationUntil` (calculated from `Tour.freeCancellationDays`) | [doc SRC-004] |

## States

| State | How to reach it | What it shows | Evidence |
|---|---|---|---|
| Empty | Initial load with `paxCount = 1` | 1 traveler form row, live deposit calculation | [doc SRC-005] |
| Loading | Submitting booking / redirecting to 3DS gateway | Disabled button with spinner ("Locking seats & opening secure payment...") | [doc SRC-008] |
| Typical | 2 travelers booking a 7-day tour | Shows $700 × 2 = $1,400 total; $280 deposit due today; $1,120 paid directly to Organizer | [doc SRC-004] |
| Many items | Group of 8 travelers | Scrollable traveler rows (Traveler 1..8) | [doc SRC-006] |
| Long text | Special medical/dietary note | Auto-expanding textarea (max 500 chars) | [doc SRC-006] |
| Error | Requested seats > `seatsRemaining` or card declined | Inline error message; seat hold preserved for 15 minutes so tourist can retry card | [doc SRC-007] |
| No permission | Departure past `cutoffHours` | Shows "Online booking closed for this departure — contact platform support" | [doc SRC-006] |
| Plan-gated | N/A | Public | [doc SRC-001] |

## Interactions

| Trigger | Result | Request | Persistence scope | Evidence |
|---|---|---|---|---|
| Increment/decrement `paxCount` | Recalculates `totalAmount`, `depositAmount`, and `balanceDueToOrganizer`; caps maximum at `TourDeparture.seatsRemaining` (`R-005`) | None (client calc) | Form state | [doc SRC-001] |
| Submit checkout form | Creates `Booking` in `pending_deposit` or `confirmed` status, places a 15-minute atomic hold on `paxCount` seats, and opens payment gateway | `POST /api/bookings` | Database + Payment Session | [doc SRC-007] |
| Payment Webhook Success | Marks `Booking.status = confirmed`, decrements `TourDeparture.seatsRemaining`, increments Organizer's **Tours Sold** & **People Signed Up** counters (`R-009`), sends voucher + WhatsApp/Email alert to Tourist and Organizer | `POST /api/webhooks/payment` | Database | [doc SRC-007] |

## Keyboard and accessibility

| Check | Result | Evidence |
|---|---|---|
| Tab order | Pax counter -> Lead traveler inputs -> Additional travelers -> Payment method radio -> Terms checkbox -> Submit button | [doc SRC-005] |
| Arrow keys | Switches payment method radio group | [doc SRC-005] |
| Shortcuts | `Escape` prompts confirmation before closing modal if fields are dirty | [doc SRC-005] |
| Focus visible | Auto-focuses first invalid input on validation error | [doc SRC-005] |
| Escape | Closes modal if untouched | [doc SRC-005] |
| Unlabeled controls | Stepper buttons (`-` / `+`) have `aria-label="Decrease travelers"` / `aria-label="Increase travelers"` | [doc SRC-005] |

## Microcopy

| Element | Text | Evidence |
|---|---|---|
| Deposit Reassurance | "You pay only the 20% reservation deposit ($140) today. The remaining $560 is paid directly to [Organizer Name] when your tour begins. Free cancellation with full deposit refund until [Date]." | [doc SRC-004] |

## Rules
- R-002, R-003, R-005, R-006, R-009, R-010

## Realtime and performance

| Check | Result | Evidence |
|---|---|---|
| A change in a second tab appears without reload | Atomic DB transaction (`SELECT ... FOR UPDATE`) prevents two simultaneous checkouts from overbooking the last seat | [doc SRC-007] |
| Loading pattern (skeleton, spinner, optimistic update) | Instant client math for price split; atomic server lock on submit | [doc SRC-007] |
| Delays the user sees | < 400ms booking hold creation | [doc SRC-007] |

## Responsive

| Width | Change | Evidence |
|---|---|---|
| `< 768px` | Full-screen checkout stepper with sticky bottom summary bar | [doc SRC-005] |
| `>= 1024px` | 2-column checkout layout (Form left, Price & Organizer summary card right) | [doc SRC-005] |

## Not tested
- Live payment submission (strictly forbidden under L4 Observe-Only rules).

