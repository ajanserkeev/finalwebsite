# Clone requirements: Kyrgyzstan Tour Aggregator (Bolshaya Strana & Viator Study)
Updated: 2026-11-12 · Status: done

## Problem and users
Tourists visiting **Kyrgyzstan** face fragmented discovery (dozens of small local operators scattered across Instagram and WhatsApp) or 25–30% inflated prices on global OTAs like Viator where the real local organizer is hidden until after booking (`B-001`, `B-002`). Meanwhile, local Kyrgyz tour operators struggle to get international bookings without paying steep upfront ad costs.

We are building a **Kyrgyzstan Tour Bridge Aggregator** combining the best of **Bolshaya Strana** (`bolshayastrana.com`) and **Viator** (`viator.com`) across **three connected applications**:
1. **Public Tourist Marketplace (`S-001`–`S-005`):** Tourists browse Kyrgyzstan tours by region, difficulty, comfort level, and exact group departure dates, see the **Open Organizer Profile** and **Verified Reviews by real tourists**, and book at the **exact same price as booking direct with the organizer (0% markup)** by paying only a **15–20% reservation deposit online** (paying the remaining 80–85% directly to the organizer on arrival).
2. **Dedicated Tour Operator / Partner Portal (`S-006`):** Verified operators log into their dedicated dashboard to see **how many tours were sold**, **how many people signed up (total pax)**, departure seat fill bars, downloadable participant manifests (names, WhatsApp, dietary notes, balance to collect on Day 1), 1-click seat quota adjustments, and review reply tools.
3. **Platform Admin Panel (`S-007`):** Separate back-office for the platform owner to verify operator KYC documents, audit & approve tours for direct-price parity, track all bookings/deposits/commissions, process free-cancellation refunds, and moderate verified reviews.

## Launch blockers

From `clone/barriers.md`, severity `blocks launch` and `adds lead time`, with who clears each one and when.

| Barrier | Severity | Owner | Start by |
|---|---|---|---|
| BR-001: Kyrgyzstan & Cross-Border Online Payment Acquiring (Freedom Pay / Finik / Stripe for Visa, Mastercard, MBANK, Elkart) | blocks launch | Founder | Week 1 (runs in parallel with MVP build) |
| BR-002: Operator Agency Contract (`Агентский договор`) with Direct-Price Parity Clause & Commission-Only Tax Structure | blocks launch | Founder + Legal | Week 1 |
| BR-003: Telegram Bot + Email + WhatsApp Business Booking Notifications | adds lead time | Engineering | Week 2 (launch with Telegram + Email first) |

## Core loop
1. **Operator Onboards & Schedules (`FL-002`):** Local Kyrgyz operator is verified by Admin (`S-007`), publishes a tour at their official direct price, and adds group departure dates & seat quotas in the Partner Portal (`S-006`).
2. **Tourist Discovers & Books at Direct Price (`FL-001`):** Tourist filters Kyrgyzstan tours (`S-002`), checks the Open Organizer profile (`S-004`) and verified reviews (`S-003`), picks a departure date (`C-004`), and locks their seats by paying the 15–20% online deposit (`S-005`).
3. **Real-Time Partner Tracking (`R-009`):** Operator's dedicated dashboard (`S-006`) immediately increments **Tours Sold (`+1`)** and **People Signed Up (`+paxCount`)**, deducts available seats, and unlocks the tourist's contact manifest.
4. **Verified Review Loop (`FL-003`):** After the tour's `endDate`, the tourist receives a signed link to post a verified review & photos (`R-007`), updating both the Tour and Organizer ratings (`R-008`).

## Scope by priority

| Priority | Feature | Rules | Screens | Notes |
|---|---|---|---|---|
| P1 | F-003: Open Organizer Identity & Public Profile Page | R-001, R-008 | S-002, S-003, S-004 | Core differentiator vs. Viator |
| P1 | F-004: Direct-Price Parity Guarantee (0% Markup) | R-002 | S-002, S-003, S-005, S-007 | Contractual parity with organizer's direct price |
| P1 | F-005: Online Deposit Split (15–20% Online Deposit = Platform Commission + 80–85% Balance to Organizer) | R-003 | S-003, S-005 | Eliminates escrow complexity; platform keeps commission from deposit |
| P1 | F-007: Verified Tourist Reviews Engine (Post-Trip Booker Gate + Organizer Replies) | R-007, R-008 | S-003, S-004, S-006, S-007 | Tied strictly to completed `Booking` records |
| P1 | F-008: Tourist Checkout with Atomic Seat Hold & Free Cancellation Cutoff | R-005, R-006, R-010 | S-005 | Prevents double-booking |
| P1 | F-009, F-010, F-011: Dedicated Tour Operator Portal (Tours Sold, People Signed Up, Quota Sync, Participant Manifests) | R-009, R-011, R-012 | S-006 | Multi-tenant isolated partner workspace |
| P1 | F-012, F-013: Separate Platform Admin Panel (KYC Verification, Tour Parity Approval, Commission & Refund Ledger) | R-002, R-010, R-012, R-013 | S-007 | Full marketplace governance |
| P2 | F-001, F-002, F-006: Kyrgyzstan Region/Activity Filters, Difficulty/Comfort Badges & Group Departure Matrix | R-004, R-005 | S-001, S-002, S-003 | Tailored to Kyrgyzstan mountain/yurt tours |

## Non-goals
- Building an airline flight or railway ticket GDS aggregator.
- Building a standalone hotel/guesthouse booking OTA (accommodations are documented as part of multi-day tour itineraries).
- Holding 100% of tour funds in long-term escrow when the 15–20% deposit split model is used.

## Data model
See `data-model/erd.mmd` and `data-model/types.ts` (`Organizer`, `Tour`, `TourDeparture`, `Booking`, `Review`).

## Build order
1. **Start long lead-time approvals and launch blockers (`BR-001`, `BR-002`):** Merchant acquiring application (Freedom Pay / Finik) and 1-page Kyrgyz Operator Agency Agreement.
2. **Data model, Auth & Role Isolation (`R-012`):** PostgreSQL schema (`E-001`–`E-005`) with `tourist`, `organizer`, and `admin` roles.
3. **Platform Admin Panel (`S-007`) & Operator Partner Portal (`S-006`):** So you and your first Kyrgyz tour partners can onboard, create tours, set departure dates/quotas, and view the **Tours Sold** and **People Signed Up** dashboard immediately.
4. **Public Tourist Marketplace (`S-001`–`S-005`):** Home, Catalog filters, Tour Detail with Departure Matrix & Open Organizer Card, Public Organizer Profile, and Deposit Checkout.
5. **Rules & Parity Suite (`clone/parity.md`):** Atomic seat locks (`R-005`), Verified Review gate (`R-007`), and Telegram/Email notifications (`BR-003`).

## Open questions
See `questions.md` (`Q-001` through `Q-004`).
