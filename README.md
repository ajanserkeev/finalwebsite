# NomadBridge KG — Kyrgyzstan Tour Bridge Aggregator

A modern Viator-inspired **Kyrgyzstan Tour Bridge Aggregator** connecting travelers directly with verified local Kyrgyz tour operators at **0% markup** (exact direct organizer prices).

## Core Value Proposition
- **100% Direct Organizer Prices (0% Markup):** Travelers book at the exact same price as booking directly with the local Kyrgyz organizer, backed by a Lowest Direct-Price Guarantee & Price-Match Claim workflow.
- **Open Organizer Storefronts (`/organizers`, `/organizers/[slug]`):** Every experience openly displays the real licensed Kyrgyz operator (`ОсОО` / `ИП`), 4WD fleet, lead mountain guides, travelers hosted, and verified reviews.
- **Reserve Now, Pay Later (20% Online Deposit Split):** Lock seats with a 20% online reservation deposit (`Freedom Pay KG`, `Stripe`, `Finik`, `MBANK / Elkart QR`) and pay the remaining 80% directly to the organizer on arrival in Kyrgyzstan. Free cancellation up to 15 days prior.
- **100% Completed-Booking Verified Reviews:** Reviews require a verified completed booking token and update both Tour and Organizer ratings across 4 dimensions (*Overall, Guide, Accommodation, 4WD Transport*).

---

## Connected Portals & Features

1. **Public Marketplace (`/`, `/tours`, `/tours/[slug]`, `/organizers`, `/organizers/[slug]`):**
   - Modern Viator-style homepage with unified search pill, live autocomplete popover, interactive category tabs, and bespoke Kyrgyzstan photography across all 7 iconic regions (*Song-Kul, Issyk-Kul & Skazka Canyon, Kel-Suu, Karakol & Ala-Kul, Ala-Archa, Sary-Chelek, Osh & Lenin Peak*).
   - Multi-currency switcher (`USD`, `KGS`, `EUR`, `RUB`), **Wishlist Drawer**, and **My Trips & Booking Vouchers Drawer** with self-service free cancellation and review token copy.
   - Tour detail page with 5-photo editorial mosaic, full-screen photo lightbox, sticky **"Select Date & Travelers"** booking card, vertical timeline itinerary, group departure matrix, and verified reviews.

2. **Tour Operator Partner Portal (`/partner`):**
   - Multi-tenant operator switcher with real-time KPIs: **Total Tours Sold**, **Total People Signed Up (`Pax`)**, Gross Volume, and 80% Balance Due on Arrival.
   - 1-click `[−]` / `[+]` seat capacity sync, smart departure scheduler (auto-fills tour duration & direct price), Guide Participant Manifests with CSV export, Tour Builder, and Official Review Reply console.

3. **Platform Admin Control Center (`/admin`):**
   - **Organizer KYC Verification & Commission % Management**
   - **Tour Direct-Price Parity Moderation & Price-Match Claims Queue**
   - **Master Bookings, Deposit Escrow & Free-Cancellation Refund Ledger** (with search & status filters)
   - **Verified Reviews Audit Log**

---

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.
