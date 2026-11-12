# NomadBridge KG — Kyrgyzstan Tour Bridge Aggregator

A full-stack **Kyrgyzstan Tour Bridge Aggregator** built from a Reverse Engineering SaaS (RES) study of **Bolshaya Strana (`bolshayastrana.com`)** and **Viator (`viator.com`)**.

## Core Value Proposition
- **100% Direct Organizer Prices (0% Markup):** Tourists book at the exact same price as booking directly with the local Kyrgyz tour organizer.
- **Open Organizer Profiles (`S-003`, `S-004`, `R-001`):** Unlike opaque OTAs that hide the local operator until after payment, every tour card and detail page openly showcases the verified Kyrgyz organizer, their legal registration (`ОсОО` / `ИП`), guide team, 4WD fleet, and aggregated reviews.
- **20% Online Deposit Split (`R-003`):** Tourists pay only the 15%–20% reservation deposit online (Visa/Mastercard via Freedom Pay KG / Stripe, Finik QR, or MBANK/Elkart) to lock their seats, and pay the remaining 80%–85% directly to the organizer on arrival.
- **100% Completed-Booking Verified Reviews (`R-007`, `R-008`):** Only travelers with a completed booking token can submit a review, updating both the Tour rating and the Organizer's overall rating.

---

## Three Connected Portals

1. **Public Tourist Marketplace (`/`, `/tours`, `/tours/[slug]`, `/organizers/[slug]`):**
   - Multi-currency switcher (`USD`, `KGS`, `EUR`, `RUB`).
   - Kyrgyzstan-specific filters: Region (*Song-Kul*, *Kel-Suu*, *Karakol & Ala-Kul*, *Issyk-Kul*, *Ala-Archa*, *Sary-Chelek*, *Pamir & Osh*), Activity Type, Difficulty (`1–5`), Comfort (*Tent, Felt Yurt, Guesthouse, Hotel*), and *"Guaranteed Departures Only"* (`R-004`).
   - Interactive Group Departure Schedule & Seat Quota Matrix (`C-004`).
   - Online Deposit Checkout Modal (`S-005`) with atomic seat quota locking (`R-005`) and cutoff enforcement (`R-006`).

2. **Dedicated Tour Operator / Partner Portal (`/partner` — `S-006`):**
   - Strictly isolated per operator (`R-012`) with a demo switcher in the header.
   - Real-time KPI counters (`C-006`, `R-009`):
     - **Total Tours Sold (Bookings Count)**
     - **Total People Signed Up (`Pax` Participants)**
     - **Gross Tour Sales Volume**
     - **Direct Balance Collectible on Arrival vs. Platform Commission**
   - 1-click `[−]` / `[+]` seat capacity adjustments (`R-011`) to sync offline Instagram/WhatsApp sales.
   - Downloadable **Participant Manifests (CSV)** for mountain guides & drivers.
   - Self-service Tour Builder (`F-010`) and Official Review Reply console (`C-005`).

3. **Separate Platform Admin Panel (`/admin` — `S-007`):**
   - **Organizer KYC Verification Queue (`R-013`)** and custom agency commission % configuration.
   - **Tour Moderation & Direct-Price Parity Audit Queue (`R-002`)** + Price-Match Claims resolution.
   - **Master Bookings, Deposit Escrow & Refund Ledger (`R-010`)** with 1-click free-cancellation deposit refund and automatic seat restoration.
   - **Verified Reviews Audit Log (`R-007`)**.

---

## RES Study Knowledge Base
The complete Reverse Engineering SaaS (RES) study is included in [`re-kyrgyzstan-tours/`](./re-kyrgyzstan-tours/):
- Standalone HTML Report: [`re-kyrgyzstan-tours/REPORT.html`](./re-kyrgyzstan-tours/REPORT.html)
- Agent Build Brief: [`re-kyrgyzstan-tours/BUILD.md`](./re-kyrgyzstan-tours/BUILD.md)
- Product Requirements Document: [`re-kyrgyzstan-tours/clone/prd.md`](./re-kyrgyzstan-tours/clone/prd.md)
- Parity Test Suite: [`re-kyrgyzstan-tours/clone/parity.md`](./re-kyrgyzstan-tours/clone/parity.md)

---

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

