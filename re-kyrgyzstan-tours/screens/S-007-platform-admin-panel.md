# S-007 Platform Admin Panel
Features: F-007, F-012, F-013 · URL: `/admin/dashboard` · Status: done

## Purpose
Central back-office control panel for the platform owner/admin to verify local Kyrgyz tour operators, moderate tour listings & audit direct-price parity, oversee all bookings & deposit payments across the marketplace, manage commission splits/refunds, and moderate verified tourist reviews.

## Entry points
- Admin login at `/admin/login` (restricted to `role = admin`)

## Anatomy

| # | Region | Contents | Component | Evidence |
|---|---|---|---|---|
| 1 | Admin Navigation Sidebar | Marketplace Overview, Organizers & KYC Verification (`Organizers`), Tour Moderation & Price Parity (`Tours`), All Bookings & Escrow Ledger (`Bookings & Finance`), Verified Reviews Moderation (`Reviews`), Regions & Categories (`Taxonomy`), Platform Settings (`Commission & Rates`) | Admin Sidebar | [doc SRC-003] |
| 2 | Marketplace-Wide KPI Header | Total GMV (Gross Merchandise Value across all operators), Total Platform Commission Earned, Total Tours Sold, Total Tourists Signed Up (`Pax`), Active Verified Organizers, Pending Moderation Queue count | C-006 | [doc SRC-006] |
| 3 | Organizer KYC & Verification Queue | List of applicant tour operators with uploaded Kyrgyz registration documents (ИП / ОсОО certificate, passport, fleet/guide info), custom commission rate setting (e.g., default `15%` or custom `12%–20%`), Direct-Price Contract status, and `Approve & Verify` / `Request Changes` / `Suspend` actions | Verification Queue | [doc SRC-003] |
| 4 | Tour Moderation & Direct-Price Audit Queue | Side-by-side review of newly submitted or price-edited tours: checks itinerary completeness, comfort level accuracy, and compares submitted price against the organizer's official website/Instagram URL to enforce the **Direct-Price Guarantee (`R-002`)** | Moderation Table | [doc SRC-003] |
| 5 | Master Bookings, Deposit Escrow & Payout Ledger | Searchable ledger of every booking on the platform: Tourist details, Organizer, Departure Date, Total Tour Price, Online Deposit Collected (`Finik`/`Freedom Pay` transaction ID), Platform Commission Retained, Payout/Refund actions | Finance Ledger | [doc SRC-006] |
| 6 | Review Moderation & Dispute Resolution | Queue of newly submitted tourist reviews (verifying booking linkage, checking photo attachments for abuse, approving publication) and handling price-match or cancellation refund claims | Review Queue | [doc SRC-006] |

## Data shown

| Element | Entity.field | Evidence |
|---|---|---|
| Organizer Verification Record | `Organizer.legalName`, `Organizer.registrationNumber`, `Organizer.commissionPercent`, `Organizer.directSiteUrl`, `Organizer.verificationStatus` | [doc SRC-003] |
| Financial Split Row | `Booking.id`, `Booking.totalAmount`, `Booking.depositAmount`, `Booking.platformCommissionAmount`, `Booking.paymentGatewayRef`, `Booking.status` | [doc SRC-006] |

## States

| State | How to reach it | What it shows | Evidence |
|---|---|---|---|
| Empty | Zero pending operator or tour approvals | "All caught up — 0 pending verifications or price audits" | [doc SRC-006] |
| Loading | Filtering master ledger by date/operator | Table skeleton loader | [doc SRC-006] |
| Typical | Daily marketplace operations | Active KPIs, pending tour edits, recent bookings & deposit payments | [doc SRC-006] |
| Many items | Thousands of bookings across dozens of operators | Server-side pagination, full-text search by Booking ID / Tourist Phone / Organizer, CSV export for accounting | [doc SRC-006] |
| Long text | Dispute notes or legal details | Side drawer inspection view | [doc SRC-006] |
| Error | Refund gateway call fails | Displays exact gateway error code from Freedom Pay / Finik with manual retry option | [doc SRC-008] |
| No permission | Non-admin user (`tourist` or `organizer`) | HTTP 403 Forbidden (`R-012`) | [doc SRC-006] |
| Plan-gated | N/A | Internal admin tool | [doc SRC-003] |

## Interactions

| Trigger | Result | Request | Persistence scope | Evidence |
|---|---|---|---|---|
| Click "Approve & Verify Organizer" | Sets `Organizer.isVerified = true`, activates their public profile (`S-004`) and allows their approved tours to go live | `POST /api/admin/organizers/:id/verify` | Database | [doc SRC-003] |
| Approve Tour & Confirm Direct-Price Parity | Sets `Tour.status = published`, records `Tour.priceVerifiedAt`, and indexes tour in public catalog (`S-002`) | `POST /api/admin/tours/:id/approve` | Database | [doc SRC-003] |
| Issue Deposit Refund (Free Cancellation window) | Calls payment gateway refund API, sets `Booking.status = refunded`, restores `paxCount` seats to `TourDeparture.seatsRemaining` (`R-010`) | `POST /api/admin/bookings/:id/refund` | Database + Payment Gateway | [doc SRC-004] |

## Keyboard and accessibility

| Check | Result | Evidence |
|---|---|---|
| Tab order | Sidebar -> KPI filters -> Moderation queue tabs -> Table action buttons | [doc SRC-006] |
| Arrow keys | Navigates table rows | [doc SRC-006] |
| Shortcuts | `Escape` closes inspection drawer | [doc SRC-006] |
| Focus visible | Standard focus ring | [doc SRC-006] |
| Escape | Closes confirmation modals | [doc SRC-006] |
| Unlabeled controls | Icon action buttons include `aria-label` | [doc SRC-006] |

## Microcopy

| Element | Text | Evidence |
|---|---|---|
| Price Audit Prompt | "Check organizer's direct URL/Instagram (`Organizer.directSiteUrl`) to verify submitted price ($700) has 0% markup before publishing." | [doc SRC-004] |

## Rules
- R-001, R-002, R-008, R-010, R-012, R-013

## Realtime and performance

| Check | Result | Evidence |
|---|---|---|
| A change in a second tab appears without reload | Live badge count for pending bookings, refund requests, and operator submissions | [doc SRC-006] |
| Loading pattern (skeleton, spinner, optimistic update) | Server-side filtered tables with instant status badge updates | [doc SRC-006] |
| Delays the user sees | < 250ms table query | [doc SRC-006] |

## Responsive

| Width | Change | Evidence |
|---|---|---|
| `< 768px` | Collapsible sidebar drawer; horizontal scroll on financial ledger table | [doc SRC-006] |
| `>= 1024px` | Full desktop back-office layout | [doc SRC-006] |

## Not tested
- Internal admin backend of `bolshayastrana.com` and `viator.com` (derived from public partner onboarding & moderation workflows `SRC-003`, `SRC-006`).

